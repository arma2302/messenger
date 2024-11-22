import getCurrentuser from "@/app/actions/getCurrentUser";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentuser();
    const body = await req.json();
    const { playerId } = body;

    if (!currentUser?.email || !currentUser.id) {
      return new NextResponse("Unautorized Data", { status: 401 });
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        oneSignalPlayerId: playerId,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error: any) {
    return new NextResponse("internal server error", { status: 500 });
  }
}
