// // import { NextResponse } from "next/server";

// // import prisma from "@/app/libs/prismadb";
// // import getCurrentuser from "@/app/actions/getCurrentUser";
// // import { pusherServer } from "@/app/libs/pusher";

// // export async function POST(request: Request) {
// //   const body = await request.json();
// //   const { message, image, conversationId, audio, userId } = body;
// //   const currentUser = await getCurrentuser();

// //   try {
// //     // if (!currentUser?.id || !currentUser?.email) {
// //     //   return new NextResponse("Unauthorized data", { status: 401 });
// //     // }

// //     // Create a new message in the database
// //     const newMsg = await prisma.message.create({
// //       data: {
// //         body: message,
// //         image: image,
// //         audio: audio,
// //         conversation: {
// //           connect: { id: conversationId },
// //         },
// //         sender: {
// //           connect: { id: currentUser?.id },
// //         },
// //         seen: {
// //           connect: { id: currentUser?.id },
// //         },
// //       },
// //       include: {
// //         seen: true,
// //         sender: true,
// //       },
// //     });
// //     pusherServer.trigger(conversationId, "message:new", newMsg);

// //     const otherUser = await prisma.user.findUnique({
// //       where: {
// //         id: userId,
// //       },
// //     });

// //     // Update the conversation with the new message
// //     const updatedConversation = await prisma.conversation.update({
// //       where: { id: conversationId },
// //       data: {
// //         lastMessageAt: new Date(),
// //         messages: {
// //           connect: { id: newMsg.id },
// //         },
// //       },
// //       include: {
// //         users: true,
// //         messages: {
// //           include: {
// //             seen: true,
// //           },
// //         },
// //       },
// //     });

// //     // Send the new message to the conversation channel for real-time updates
// //     // await pusherServer.trigger(conversationId, "message:new", newMsg);
// //     const lastMessage =
// //       updatedConversation.messages[updatedConversation.messages.length - 1];
// //     // Send the updated conversation state to all users (including the last message)
// //     updatedConversation.users.map((user) => {
// //       pusherServer.trigger(user.email!, "conversation:update", {
// //         id: conversationId,
// //         messages: [lastMessage], // Pass all messages
// //       });
// //     });

// //     return NextResponse.json(newMsg);
// //   } catch (error: any) {
// //     return new NextResponse("error", { status: 500 });
// //   }
// // }
// import { NextResponse } from "next/server";
// import prisma from "@/app/libs/prismadb";
// import getCurrentuser from "@/app/actions/getCurrentUser";
// import { pusherServer } from "@/app/libs/pusher";

// export async function POST(request: Request) {
//   const body = await request.json();
//   const { message, image, conversationId, audio, userId } = body;
//   const currentUser = await getCurrentuser();

//   try {
//     // // Step 1: Return early if the current user is unauthorized
//     // if (!currentUser?.id || !currentUser?.email) {
//     //   return new NextResponse("Unauthorized data", { status: 401 });
//     // }

//     // Step 2: Create the message and trigger Pusher as soon as possible
//     pusherServer.trigger(userId!, "notification:new", {
//       msg: message,
//       from: currentUser?.name,
//     });
//     const newMsg = await prisma.message.create({
//       data: {
//         body: message,
//         image: image,
//         audio: audio,
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

//     pusherServer.trigger(conversationId, "message:new", newMsg);

//     // // Trigger the Pusher event immediately after message creation
//     // pusherServer.trigger(conversationId, "message:new", newMsg);

//     //     // Update the conversation with the new message
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

//     // Send the new message to the conversation channel for real-time updates
//     // await pusherServer.trigger(conversationId, "message:new", newMsg);
//     const lastMessage =
//       updatedConversation.messages[updatedConversation.messages.length - 1];
//     // Send the updated conversation state to all users (including the last message)
//     updatedConversation.users.map((user) => {
//       pusherServer.trigger(user.email!, "conversation:update", {
//         id: conversationId,
//         messages: [lastMessage], // Pass all messages
//       });
//     });

//     //  Return the newly created message as a response
//     return NextResponse.json(newMsg);
//   } catch (error: any) {
//     return new NextResponse("error", { status: 500 });
//   }
// }
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import getCurrentuser from "@/app/actions/getCurrentUser";
import { pusherServer } from "@/app/libs/pusher";

export async function POST(request: Request) {
  const body = await request.json();
  const { message, image, conversationId, audio, userId } = body;
  const currentUser = await getCurrentuser();

  try {
    // Step 1: Return early if the current user is unauthorized
    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse("Unauthorized data", { status: 401 });
    }

    // pusherServer.trigger(userId!, "notification:new", {
    //   msg: message,
    //   from: currentUser?.name,
    // });

    // Step 2: Create the message and trigger Pusher as soon as possible
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
    setTimeout(() => {
      pusherServer.trigger(conversationId, "message:new", newMsg);
    }, 0);

    // // Trigger the Pusher event immediately after message creation
    // pusherServer.trigger(conversationId, "message:new", newMsg);

    const updatedConversation = prisma.conversation.update({
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

    // Step 4: Get the users for updating their channels, done asynchronously
    const otherUser = prisma.user.findUnique({
      where: { id: userId },
    });

    // Step 5: After both queries resolve, send the updated conversation and trigger push notifications
    const [conversation, otherUserDetails] = await Promise.all([
      updatedConversation,
      otherUser,
    ]);

    const lastMessage = conversation.messages[conversation.messages.length - 1];

    // Send updated conversation state to all users in the conversation
    await Promise.all(
      conversation.users.map((user) => {
        return pusherServer.trigger(user.email!, "conversation:update", {
          id: conversationId,
          messages: [lastMessage], // Send the last message
        });
      })
    );

    // Step 6: Return the newly created message as a response
    return NextResponse.json(newMsg);
  } catch (error: any) {
    return new NextResponse("error", { status: 500 });
  }
}
