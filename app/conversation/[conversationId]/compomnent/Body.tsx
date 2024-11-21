"use client";
import useConversation from "@/app/hooks/useConversation";
import React, { useEffect, useRef, useState } from "react";
import { FullMessageType } from "@/app/types";
import axios from "axios";
import MessageBox from "./MessageBox";
import { pusherClient } from "@/app/libs/pusher";
import { find } from "lodash";
import ActiveStatus from "@/app/component/ActiveStatus";

interface BodyProps {
  msgs: FullMessageType[];
}

const Body: React.FC<BodyProps> = ({ msgs }) => {
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
    console.log(messages, "body msgs");

    axios.post(`/api/conversations/${conversationId}/seen`);
  }, [conversationId]);

  useEffect(() => {
    pusherClient.subscribe(conversationId.toString());
    bottomRef.current?.scrollIntoView();

    const messageHandler = (message: FullMessageType) => {
      axios.post(`/api/conversations/${conversationId}/seen`);

      setMessages((current) => {
        if (find(current, { id: message.id })) {
          return current;
        }
        return [...current, message];
      });
      bottomRef.current?.scrollIntoView();
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
  return (
    <div className="flex-1 overflow-y-auto">
      <ActiveStatus />
      {messages.map((msg, i) => {
        return (
          <MessageBox
            isLast={i === messages.length - 1}
            key={msg.id}
            data={msg}
          />
        );
      })}
      <div ref={bottomRef} className="pt-24 "></div>
    </div>
  );
};

export default Body;
