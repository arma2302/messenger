import { pusherServer } from "../libs/pusher";

export const sendOfferToReceiver = (
  offer: RTCSessionDescriptionInit,
  receiverId: string,
  senderId: string,
  receiver: any
) => {
  pusherServer.trigger("video-call-channel", "client-send-offer", {
    offer,
    senderId,
    receiverId,
    receiver,
  });
  console.log("channel triggered");
};

export const sendAnswerToCaller = (
  answer: RTCSessionDescriptionInit,
  senderId: string,
  receiverId: string
) => {
  pusherServer.trigger("video-call-channel", "client-send-answer", {
    answer,
    senderId,
    receiverId,
  });
};
export const sendIceCandidateToReceiver = (
  candidate: RTCIceCandidateInit,
  receiverId: string,
  senderId: string
) => {
  pusherServer.trigger("video-call-channel", "client-send-ice-candidate", {
    candidate,
    senderId,
    receiverId,
  });
  console.log("ICE candidate sent");
};
export const sendIceCandidateToCaller = (
  candidate: RTCIceCandidateInit,
  senderId: string,
  receiverId: string
) => {
  pusherServer.trigger("video-call-channel", "client-send-ice-candidate", {
    candidate,
    senderId,
    receiverId,
  });
  console.log("ICE candidate sent to caller");
};
