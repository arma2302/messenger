// // import getCurrentuser from "@/app/actions/getCurrentUser";
// import { NextResponse } from "next/server";
// import prisma from "@/app/libs/prismadb";

import { NextResponse } from "next/server";

// export async function POST(request: Request) {
//   console.log("entered");

//   try {
//     const currentUser = await getCurrentuser();
//     const body = await request.json();

//     const { message, image, conversationId } = body;
//     console.log(body, "msg body");
//     console.log("conversation Id", conversationId);
//     console.log("conversationId type:", typeof conversationId);

//     if (!currentUser?.id || !currentUser.email) {
//       return new NextResponse("invalid data", { status: 401 });
//     }
//     // If conversationId is an ObjectId (MongoDB), convert to string
//     const conversationIdStr = conversationId?.toString(); // Ensure ObjectId is converted to string
//     // For relational databases, leave it as is

//     const newMsg = await prisma.message.create({
//       data: {
//         body: message,
//         conversation: { connect: { id: conversationId } },
//         seen: { connect: { id: currentUser.id } },
//         sender: { connect: { id: currentUser.id } },
//         image: image,
//       },
//       include: {
//         seen: true,
//         sender: true,
//       },
//     });
//     return NextResponse.json(newMsg);
//   } catch (error: any) {
//     return new NextResponse("Invalid data", { status: 500 });
//   }
// }
// import prisma from "@/app/libs/prismadb";
// import getCurrentuser from "@/app/actions/getCurrentUser";
// export async function POST(request: Request) {
//   const body = await request.json();
//   const { message, image, conversationId } = body;

//   console.log(typeof conversationId);

//   const currentUser = await getCurrentuser();

//   try {
//     if (!currentUser?.id || !currentUser?.email) {
//       return new NextResponse("Unauthorized data", { status: 401 });
//     }
//     const newMsg = await prisma.message.create({
//       data: {
//         body: message,
//         image: image,
//         conversation: {
//           connect: { id: conversationId },
//         },
//         sender: {
//           connect: { id: currentUser?.id },
//         },
//         seen: {
//           connect: { id: currentUser?.id },
//         },
//       },
//       include: {
//         seen: true,
//         sender: true,
//       },
//     });

//     const updatedConversation = await prisma.conversation.update({
//       where: { id: conversationId },
//       data: {
//         lastMessageAt: new Date(),
//         messages: {
//           connect: { id: newMsg.id },
//         },
//       },
//       include: {
//         users: true,
//         messages: {
//           include: {
//             seen: true,
//           },
//         },
//       },
//     });
import prisma from "@/app/libs/prismadb";
import getCurrentuser from "@/app/actions/getCurrentUser";
import { pusherServer } from "@/app/libs/pusher";

export async function POST(request: Request) {
  const body = await request.json();
  const { message, image, conversationId } = body;

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
    await pusherServer.trigger(conversationId, "message:new", newMsg);
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
