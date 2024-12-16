import getCurrentuser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";

export async function DELETE(
  request: Request,
  contex: { params: { conversationId: string } }
) {
  try {
    const { conversationId } = contex.params; // Extract params here

    const currentuser = await getCurrentuser();
    if (!currentuser?.id || !currentuser?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const existingConversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: { users: true },
    });

    if (!existingConversation) {
      return new NextResponse("Invalid data", { status: 400 });
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
          user.id,
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
