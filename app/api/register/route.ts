import bcrypt from "bcrypt";
import prisma from "@/app/libs/prismadb";

import { NextResponse } from "next/server";
export async function POST(request: Request) {
  console.log("entered");

  try {
    const body = await request.json();
    console.log(body, "first body");

    const { email, name, password } = body;
    console.log(body, "log");

    if (!email || !name || !password) {
      return new NextResponse("Missing Info", { status: 400 });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    console.log("hasshed password created");

    const user = await prisma.user.create({
      data: {
        email,
        name,
        hashedPassword,
      },
    });

    const userData = { email, hashedPassword, name };
    console.log(userData, " userdata");

    return NextResponse.json(user);
  } catch (error: any) {
    return new NextResponse("internal error", { status: 500 });
  }
}
