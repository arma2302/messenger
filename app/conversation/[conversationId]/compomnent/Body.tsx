"use client";
import useConversation from "@/app/hooks/useConversation";
import React, { useEffect, useRef, useState } from "react";
import { FullMessageType } from "@/app/types";
import axios from "axios";
import MessageBox from "./MessageBox";
import { pusherClient } from "@/app/libs/pusher";
import { find } from "lodash";
import ActiveStatus from "@/app/component/ActiveStatus";
import OneSignal from "react-onesignal";
import { useParams } from "next/navigation";
import { User } from "@prisma/client";

interface BodyProps {
  msgs: FullMessageType[];
  currentUser: User;
}

const Body: React.FC<BodyProps> = ({ msgs, currentUser }) => {
  const [messages, setMessages] = useState(msgs);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { conversationId } = useConversation();

  // useEffect(() => {
  //   pusherClient.subscribe(conversationId.toString());
  //   bottomRef?.current?.scrollIntoView();

  //   const messageHandler = (message: FullMessageType) => {
  //     axios.post(`/api/conversations/${conversationId}/seen`);

  //     setMessages((current) => {
  //       if (find(current, { id: message.id })) {
  //         return current;
  //       }
  //       return [...current, message];
  //     });
  //     bottomRef.current?.scrollIntoView();
  //   };
  //   pusherClient.bind("message:new", messageHandler);

  //   return () => {
  //     pusherClient.unsubscribe(conversationId.toString());
  //     pusherClient.unbind("message:new", messageHandler);
  //   };
  // }, [conversationId]);

  useEffect(() => {
    axios.post(`/api/conversations/${conversationId}/seen`);
  }, [conversationId]);

  useEffect(() => {
    pusherClient.subscribe(conversationId.toString());
    bottomRef.current?.scrollIntoView();

    const messageHandler = (message: FullMessageType) => {
      setMessages((current) => {
        const existingMessage = find(current, { id: message.id });
        if (existingMessage) {
          return current;
        }
        return [...current, message];
      });
      bottomRef.current?.scrollIntoView();
      axios.post(`/api/conversations/${conversationId}/seen`);
    };

    const updateMessaheHandler = (newmsg: FullMessageType) => {
      axios.post(`/api/conversations/${conversationId}/seen`);

      setMessages((current) =>
        current.map((currentMessage) => {
          if (currentMessage.id === newmsg.id) {
            return newmsg;
          }
          return currentMessage;
        })
      );
    };

    pusherClient.bind("message:new", messageHandler);
    pusherClient.bind("message:update", updateMessaheHandler);

    return () => {
      pusherClient.unsubscribe(conversationId.toString());
      pusherClient.unbind("message:new", messageHandler);
      pusherClient.unbind("message:update", updateMessaheHandler);
    };
  }, [conversationId]);

  // useEffect(() => {
  //   pusherClient.bind("callInvitation:new", function (data: any) {
  //     console.log(data, "notification data");
  //     alert(data.invitaion);
  //   });

  //   return () => {
  //     pusherClient.unsubscribe("call-channel");
  //   };
  // }, []);
  return (
    <div className="flex-1 overflow-y-auto">
      <ActiveStatus />
      {messages.map((msg, i) => {
        return (
          <MessageBox
            isLast={i === messages.length - 1}
            key={msg.id}
            data={msg}
            conversationId={conversationId.toString()}
          />
        );
      })}
      <div ref={bottomRef} className="pt-24 "></div>
    </div>
  );
};

export default Body;
