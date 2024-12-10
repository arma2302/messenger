// import { sendAnswerToCaller, sendOfferToReceiver } from "@/app/utils/webRtc";
// import { NextResponse } from "next/server";

// export async function POST(req: Request) {
//   const body = await req.json();
//   const { type, offer, answer, receiverId, senderId, receiver } = body;

//   try {
//     if (type === "offer") {
//       // Trigger offer event
//       sendOfferToReceiver(offer, receiverId, senderId, receiver);
//       console.log("triggerd offer event ");
//     } else if (type === "answer") {
//       // Trigger answer event
//       sendAnswerToCaller(answer, senderId, receiverId);
//     }

//     return new NextResponse("event signal sent ", { status: 200 });
//   } catch (error) {
//     return new NextResponse("event signal  failed ", { status: 500 });
//   }
// }
import {
  sendAnswerToCaller,
  sendOfferToReceiver,
  sendIceCandidateToReceiver,
  sendIceCandidateToCaller,
} from "@/app/utils/webRtc";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { type, offer, answer, receiverId, senderId, receiver, candidate } =
    body;

  try {
    if (type === "offer") {
      // Trigger offer event
      sendOfferToReceiver(offer, receiverId, senderId, receiver);
      console.log("Triggered offer event");
    } else if (type === "answer") {
      // Trigger answer event
      sendAnswerToCaller(answer, senderId, receiverId);
    } else if (type === "ice-candidate") {
      // Handle ICE candidate event
      if (receiverId) {
        // Send ICE candidate to the receiver
        sendIceCandidateToReceiver(candidate, receiverId, senderId);
      } else if (senderId) {
        // Send ICE candidate to the caller
        sendIceCandidateToCaller(candidate, senderId, receiverId);
      }
      console.log("Triggered ICE candidate event");
    }

    return new NextResponse("Event signal sent", { status: 200 });
  } catch (error) {
    return new NextResponse("Event signal failed", { status: 500 });
  }
}
