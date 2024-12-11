import { NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";
import getCurrentuser from "@/app/actions/getCurrentUser";
import { pusherServer } from "@/app/libs/pusher";

export async function POST(request: Request) {
  const body = await request.json();
  const { message, image, conversationId, audio, userId } = body;

  console.log(body);

  const currentUser = await getCurrentuser();

  try {
    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse("Unauthorized data", { status: 401 });
    }

    // Create a new message in the database
    const newMsg = await prisma.message.create({
      data: {
        body: message,
        image: image,
        audio: audio,
        conversation: {
          connect: { id: conversationId },
        },
        sender: {
          connect: { id: currentUser?.id },
        },
        seen: {
          connect: { id: currentUser?.id },
        },
      },
      include: {
        seen: true,
        sender: true,
      },
    });
    await pusherServer.trigger("messege-channel", "message:new", newMsg);

    const otherUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    // Update the conversation with the new message
    const updatedConversation = await prisma.conversation.update({
      where: { id: conversationId },
      data: {
        lastMessageAt: new Date(),
        messages: {
          connect: { id: newMsg.id },
        },
      },
      include: {
        users: true,
        messages: {
          include: {
            seen: true,
          },
        },
      },
    });

    // Send the new message to the conversation channel for real-time updates
    // await pusherServer.trigger(conversationId, "message:new", newMsg);
    const lastMessage =
      updatedConversation.messages[updatedConversation.messages.length - 1];
    // Send the updated conversation state to all users (including the last message)
    updatedConversation.users.map((user) => {
      pusherServer.trigger(user.email!, "conversation:update", {
        id: conversationId,
        messages: [lastMessage], // Pass all messages
      });
    });

    return NextResponse.json(newMsg);
  } catch (error: any) {
    return new NextResponse("error", { status: 500 });
  }
}
