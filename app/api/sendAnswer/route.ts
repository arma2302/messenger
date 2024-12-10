import { pusherServer } from "@/app/libs/pusher";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { caller, answer } = body;

  if (answer === "accept") {
    await pusherServer.trigger(caller.id, "answer:new", answer);
  }
  if (answer === "reject") {
    await pusherServer.trigger(caller.id, "answer:new", answer);
  }

  return new NextResponse("successfully", { status: 200 });
}
