import getCurrentuser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";
interface IParams {
  conversationId: string;
}

export async function DELETE(
  request: Request,
  { params }: { params: IParams }
) {
  try {
    const { conversationId } = params;
    const currentuser = await getCurrentuser();
    if (!currentuser?.id || !currentuser?.email) {
      return new NextResponse("Unauthorixed", { status: 401 });
    }

    const existingConversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: { users: true },
    });

    if (!existingConversation) {
      return new NextResponse("invalid data", { status: 400 });
    }

    const deleteConversation = await prisma.conversation.deleteMany({
      where: {
        id: conversationId,
        userIds: {
          hasSome: [currentuser.id],
        },
      },
    });

    existingConversation.users.forEach((user) => {
      if (user.email) {
        pusherServer.trigger(
          user.email,
          "conversation:remove",
          existingConversation
        );
      }
    });

    return NextResponse.json(deleteConversation);
  } catch (error: any) {
    console.log(error, "Error Msg");
    return new NextResponse("Internal server error", { status: 500 });
  }
}
