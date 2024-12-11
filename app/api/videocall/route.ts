import getConversationById from "@/app/actions/getConversationById";
import getCurrentuser from "@/app/actions/getCurrentUser";
import { pusherServer } from "@/app/libs/pusher";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = req.json();
    const { params } = await body;
    const conversation = await getConversationById(params.conversationId);
    const currentUser = await getCurrentuser();
    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse("Unauthorized Data", { status: 401 });
    }
    const otherUser = conversation?.users.find(
      (user) => user.id !== currentUser?.id
    );
    const newInvite = {
      caller: currentUser,
      reciver: otherUser,
      msg: `${currentUser.name} is calling You`,
    };
    await pusherServer.trigger(otherUser?.id!, "callInvitation:new", newInvite);
    return NextResponse.json({
      currentUser: currentUser,
      otherUser: otherUser,
    });
  } catch (error: any) {
    return new NextResponse("error ", { status: 500 });
  }
}
