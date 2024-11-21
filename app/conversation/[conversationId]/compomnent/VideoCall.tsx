import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import Pusher from "pusher-js";
import { Conversation, User } from "@prisma/client";
import { pusherClient } from "@/app/libs/pusher";

interface VideoCallProps {
  convo: Conversation & {
    users: User[];
  };
  otheruser?: User;
}

const VideoCall: React.FC<VideoCallProps> = ({ convo }) => {
  const [callStatus, setCallStatus] = useState("Idle");
  const [peerConnection, setPeerConnection] =
    useState<RTCPeerConnection | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [incomingOffer, setIncomingOffer] =
    useState<RTCSessionDescriptionInit | null>(null);
  const [incomingCandidate, setIncomingCandidate] =
    useState<RTCIceCandidate | null>(null);

  // Create refs for local and remote video elements
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  // Pusher initialization
  useEffect(() => {
    const channel = pusherClient.subscribe(`call-${convo.id}`);

    // Listen for offer event
    channel.bind("offer", (data: { offer: RTCSessionDescriptionInit }) => {
      setIncomingOffer(data.offer);
      console.log(data, " offer enevt data");
      setCallStatus("Incoming");
    });

    // Listen for answer event
    channel.bind("answer", (data: { answer: RTCSessionDescriptionInit }) => {
      if (peerConnection) {
        peerConnection.setRemoteDescription(
          new RTCSessionDescription(data.answer)
        );
      }
    });

    // Listen for ICE candidate event
    channel.bind("candidate", (data: { candidate: RTCIceCandidate }) => {
      if (peerConnection) {
        peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
      }
    });

    // Cleanup when component unmounts
    return () => {
      pusherClient.unsubscribe(`call-${convo.id}`);
    };
  }, [convo.id, peerConnection]);

  useEffect(() => {
    // Get user's media (camera and microphone)
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream; // Display local video stream
        }
        console.log("video of the sender user");
      })
      .catch((err) => {
        console.error("Error getting user media", err);
      });
  }, []);

  const sendOfferToServer = (offer: RTCSessionDescriptionInit) => {
    axios
      .post("/api/videocall/sendOffer", {
        convoId: convo.id,
        offer,
      })
      .then((response) => {
        console.log("Offer sent:", response.data);
      })
      .catch((error) => {
        console.error("Error sending offer:", error);
      });
  };

  const sendAnswerToServer = (answer: RTCSessionDescriptionInit) => {
    axios
      .post("/api/videocall/sendAnswer", {
        convoId: convo.id,
        answer,
      })
      .then((response) => {
        console.log("Answer sent:", response.data);
      })
      .catch((error) => {
        console.error("Error sending answer:", error);
      });
  };

  const sendCandidateToServer = (candidate: RTCIceCandidate) => {
    axios
      .post("/api/videocall/sendCandidate", {
        convoId: convo.id,
        candidate,
      })
      .then((response) => {
        console.log("Candidate sent:", response.data);
      })
      .catch((error) => {
        console.error("Error sending candidate:", error);
      });
  };
  const startCall = () => {
    setCallStatus("Outgoing");

    // Create the PeerConnection
    const pc = createPeerConnection();
    setPeerConnection(pc);

    // Create an offer
    pc.createOffer()
      .then((offer) => {
        // Set the local description (the offer)
        return pc.setLocalDescription(offer);
      })
      .then(() => {
        // Send the offer to the server
        sendOfferToServer(pc.localDescription as RTCSessionDescriptionInit);
      })
      .catch((error) => {
        console.error("Error starting call:", error);
      });
  };

  const createPeerConnection = () => {
    const iceConfiguration = {
      iceServers: [
        {
          urls: [
            "stun:stun1.l.google.com:19302",
            "stun:stun3.l.google.com:19302",
          ],
        },
      ],
    };

    const pc = new RTCPeerConnection(iceConfiguration);

    console.log("connecttion created");

    // Listen for ICE candidates and send them to the server
    pc.onicecandidate = (event) => {
      console.log(event, "ice event");

      if (event.candidate) {
        sendCandidateToServer(event.candidate);
      }
      console.log("candided set");
    };

    // Handle incoming remote tracks
    pc.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
      console.log("send offer to  other user");
    };

    // Add local stream tracks to the connection once we have it
    if (localStream) {
      localStream.getTracks().forEach((track) => {
        pc.addTrack(track, localStream);
      });
    }

    return pc;
  };

  const answerCall = (offer: RTCSessionDescriptionInit) => {
    const pc = createPeerConnection();
    setPeerConnection(pc);

    pc.setRemoteDescription(new RTCSessionDescription(offer))
      .then(() => {
        return pc.createAnswer();
      })
      .then((answer) => {
        return pc.setLocalDescription(answer);
      })
      .then(() => {
        sendAnswerToServer(pc.localDescription as RTCSessionDescriptionInit);
      })
      .catch((error) => {
        console.error("Error answering call:", error);
      });
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
      <div className="w-full max-w-3xl bg-white p-4 rounded-lg shadow-lg flex justify-between items-center">
        <div className="flex flex-col items-center w-1/2">
          <video ref={localVideoRef} autoPlay muted className="w-full h-auto" />
          {callStatus === "Incoming" && incomingOffer && (
            <button
              onClick={() => answerCall(incomingOffer)} // Pass the incoming offer here
              className="mt-4 bg-green-500 text-white py-2 px-4 rounded-full"
            >
              Answer Call
            </button>
          )}
          {callStatus === "Outgoing" && (
            <button
              onClick={() => setCallStatus("Idle")}
              className="mt-4 bg-red-500 text-white py-2 px-4 rounded-full"
            >
              End Call
            </button>
          )}
        </div>
        <div className="flex flex-col items-center w-1/2">
          <video ref={remoteVideoRef} autoPlay className="w-full h-auto" />
        </div>
      </div>
      {callStatus === "Idle" && (
        <button
          onClick={startCall}
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white py-3 px-6 rounded-full"
        >
          Start Video Call
        </button>
      )}
    </div>
  );
};

export default VideoCall;
