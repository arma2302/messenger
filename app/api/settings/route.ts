import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import getCurrentuser from "@/app/actions/getCurrentUser";

export async function POST(request: Request) {
  const body = await request.json();
  const { name, image } = body;

  try {
    const currentuser = await getCurrentuser();

    if (!currentuser?.id || !currentuser.email) {
      return new NextResponse("invalid", { status: 401 });
    }
    const user = await prisma.user.update({
      where: {
        id: currentuser?.id,
      },
      data: {
        image: image,
        name: name,
      },
    });
    return NextResponse.json(user);
  } catch (error: any) {
    return new NextResponse("server Error", { status: 500 });
  }
}
