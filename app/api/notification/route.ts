import getCurrentuser from "@/app/actions/getCurrentUser";
import { pusherServer } from "@/app/libs/pusher";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { userId, conversationId, message, image, audio } = body;

  const currentUser = await getCurrentuser();

  if (!currentUser) {
    return new NextResponse("Unauthorized Data", { status: 404 });
  }
  try {
    if (message) {
      pusherServer.trigger(userId!, "notification:new", {
        msg: message,
        from: currentUser?.name,
      });
    } else if (audio) {
      pusherServer.trigger(userId!, "notification:new", {
        msg: "Sent a Voice Note",
        from: currentUser?.name,
      });
    } else if (image) {
      pusherServer.trigger(userId!, "notification:new", {
        msg: "Sent an image",
        from: currentUser?.name,
      });
    }

    return new NextResponse("notification Sent", { status: 200 });
  } catch (error: any) {
    return new NextResponse("Internal server error", { status: 500 });
  }
}
