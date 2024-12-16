import getCurrentuser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  console.log("entered");
  const body = await req.json();
  const currentUser = await getCurrentuser();
  const { seachVal, conversationId } = body;
  //   const messages = await prisma.message.findMany({
  //     where: {
  //       conversationId: conversationId,
  //       body: {
  //         contains: serachVal,
  //       },
  //     },
  //   });
  pusherServer.trigger(currentUser?.id!, "message:filter", seachVal);
  return new NextResponse("sent", { status: 200 });
}
