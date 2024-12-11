"use client";

import React, { useEffect, useState } from "react";
import { pusherClient } from "../libs/pusher";
import { User } from "@prisma/client";
import CallInvitation from "../component/CallNotification";
interface CallContextProps {
  currentUser: User;
}
const CallContext: React.FC<CallContextProps> = ({ currentUser }) => {
  const [incomingCall, setIncomingCall] = useState(false);
  const [data, setData] = useState("");
  useEffect(() => {
    pusherClient.subscribe(currentUser?.id!);
    pusherClient.bind("callInvitation:new", function (data: any) {
      console.log(data, "notification data");
      setData(data);
      setIncomingCall(true);
    });

    return () => {
      pusherClient.unsubscribe(currentUser?.id!);
      pusherClient.unbind("callInvitation:new");
    };
  }, [currentUser?.id]);

  return <>{incomingCall && data && <CallInvitation data={data} />}</>;
};

export default CallContext;
