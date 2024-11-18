import getCurrentuser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { userId, name, isGroup, members } = body;
  const currentuser = await getCurrentuser();

  try {
    if (!currentuser?.id || !currentuser?.email) {
      return NextResponse.json("Unauthorized Data", { status: 401 });
    }

    if (isGroup && (!members || members.length < 2 || !name)) {
      return new NextResponse("Invalid Data", { status: 400 });
    }

    if (isGroup) {
      const newconversation = await prisma.conversation.create({
        data: {
          isGroup,
          name,
          users: {
            connect: [
              ...members.map((member: { value: string }) => ({
                id: member.value,
              })),
              {
                id: currentuser.id,
              },
            ],
          },
        },
        include: {
          users: true,
        },
      });

      newconversation.users.forEach((user) => {
        if (user.email) {
          pusherServer.trigger(user.email, "conversation:new", newconversation);
          console.log("group convo vreated");
        }
      });
      return NextResponse.json(newconversation);
    }

    const existingConversations = await prisma.conversation.findMany({
      where: {
        OR: [
          {
            userIds: {
              equals: [userId, currentuser.id],
            },
          },
          {
            userIds: {
              equals: [currentuser.id, userId],
            },
          },
        ],
      },
    });

    const singleConversation = existingConversations[0];
    if (singleConversation) {
      console.log("convo already Exist ");

      return NextResponse.json(singleConversation);
    }

    const newconversation = await prisma.conversation.create({
      data: {
        users: {
          connect: [
            {
              id: userId,
            },
            {
              id: currentuser?.id,
            },
          ],
        },
      },
      include: {
        users: true,
      },
    });

    newconversation.users.map((user) => {
      if (user.email) {
        pusherServer.trigger(user.email, "conversation:new", newconversation);
      }
    });
    return NextResponse.json(newconversation);
  } catch (error: any) {
    return new NextResponse("Internal server error", { status: 500 });
  }
}
