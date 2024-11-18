import getCurrentuser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";

interface Iparams {
  conversationId: string;
}

export async function POST(request: Request, { params }: { params: Iparams }) {
  console.log("enterd in seen post api");

  try {
    const { conversationId } = await params;
    console.log("got the params", conversationId);

    const currentUser = await getCurrentuser();
    if (!currentUser?.email || !currentUser.id) {
      return new NextResponse("unauthorized", { status: 401 });
    }

    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        messages: {
          include: {
            seen: true,
          },
        },
        users: true,
      },
    });
    if (!conversation) {
      return new NextResponse("invalid id", { status: 400 });
    }

    const lastMessage = conversation.messages[conversation.messages.length - 1];

    if (!lastMessage) {
      return NextResponse.json(conversation);
    }

    const updateMessages = await prisma.message.update({
      where: { id: lastMessage.id },
      include: { sender: true, seen: true },
      data: {
        seen: { connect: { id: currentUser.id } },
      },
    });

    await pusherServer.trigger(currentUser.email!, "conversation:update", {
      id: conversationId,
      messages: [updateMessages],
    });

    if (lastMessage.seenIds.indexOf(currentUser.id) !== -1) {
      return NextResponse.json(conversation);
    }

    await pusherServer.trigger(
      conversationId,
      "message:update",
      updateMessages
    );
    return NextResponse.json(updateMessages);
  } catch (error: any) {
    return new NextResponse("Invalid Data", { status: 500 });
  }
}
