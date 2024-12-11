// components/CallInvitation.js
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { pusherClient, pusherServer } from "../libs/pusher";
import { sendAnswerToCaller } from "../utils/webRtc";
import { SendAnswerToCaller } from "../actions/sendAnswerToCaller";
import axios from "axios";

interface InvitationProps {
  data: any;
}

const CallInvitation: React.FC<InvitationProps> = ({ data }) => {
  const route = useRouter();
  const pathname = usePathname();
  const reciverId = data.reciver.id;
  const onAccept = async () => {
    // pusherServer.trigger(data.caller.id, "answer:new", "accept");
    // await SendAnswerToCaller("accept", data.caller.id!);
    axios.post("/api/sendAnswer", { caller: data.caller, answer: "accept" });
    route.replace(`/videocall`);
  };
  const onDecline = () => {
    axios.post("/api/sendAnswer", { caller: data.caller, answer: "reject" });
    pusherClient.unsubscribe(reciverId);
    // SendAnswerToCaller("reject", data.caller.id!);
    // pusherServer.trigger(data.caller.id, "answer:new", "reject");
    route.back();
  };
  return (
    <div className="flex items-center justify-center bg-gray-800 bg-opacity-60 fixed inset-0 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm mx-4 sm:mx-0">
        <div className="flex items-center space-x-4">
          {/* Avatar */}
          <img
            src={
              data.caller?.image ||
              "https://static.vecteezy.com/system/resources/previews/002/387/693/non_2x/user-profile-icon-free-vector.jpg"
            }
            alt={data.caller.name}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              {data.caller.name}
            </h2>
            <p className="text-gray-600">is calling you...</p>
          </div>
        </div>
        <div className="mt-6 flex justify-between space-x-4 items-center">
          {/* Accept Button */}
          <button
            onClick={onAccept}
            className="bg-blue-500 w-1/2 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Accept
          </button>
          {/* Decline Button */}
          <button
            onClick={onDecline}
            className="bg-red-500 w-1/2 text-white py-2 px-4 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
};

export default CallInvitation;
