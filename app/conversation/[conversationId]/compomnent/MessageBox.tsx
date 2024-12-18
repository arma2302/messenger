"use client";
import Avatar from "@/app/component/Avatar";
import { FullMessageType } from "@/app/types";
import axios from "axios";
import clsx from "clsx";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import ImageModal from "./ImageModal";
import { pusherClient } from "@/app/libs/pusher";
import { log } from "console";

interface MessageBoxProps {
  data: FullMessageType;
  isLast: boolean;
  conversationId: string;
}
const MessageBox: React.FC<MessageBoxProps> = ({
  data,
  isLast,
  conversationId,
}) => {
  const session = useSession();
  const [isImageModalOpen, setImageModalOpen] = useState(false);
  const [isAudioPlaying, setAudioPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isOwn = session.data?.user?.email === data?.sender?.email;
  const seenList = (data.seen || [])
    .filter((user) => user.email !== data?.sender?.email)
    .map((user) => user.name)
    .join(", ");

  const container = clsx("flex gap-3 p-4", isOwn && "justify-end");
  const avatar = clsx(isOwn && "order-2");
  const body = clsx("flex flex-col gap-2", isOwn && "items-end");
  const message = clsx(
    "text-sm w-fit overflow-hidden",
    isOwn ? "bg-sky-500 text-white" : "bg-gray-100",
    data.image ? "rounded-md p-0" : "rounded-full py-2 px-3",
    data.audio && "bg-transparent rounded-md"
  );
  // // Toggle play/pause
  // const toggleAudio = () => {
  //   if (audioRef.current) {
  //     if (isAudioPlaying) {
  //       audioRef.current.pause();
  //     } else {
  //       audioRef.current.play();
  //     }
  //     setAudioPlaying(!isAudioPlaying);
  //   }
  // };
  // useEffect(() => {
  //   pusherClient.subscribe(data.conversationId);
  //   pusherClient.bind("message:new", (msg: FullMessageType) => {
  //     if (data.conversationId === conversationId) {
  //       data = msg;
  //       console.log(data, "newly Created Data");

  //       return data;
  //     }
  //   });
  // }, [conversationId]);

  return (
    <>
      <ImageModal
        src={data.image!}
        isOpen={isImageModalOpen}
        onClose={() => setImageModalOpen(false)}
      />
      <div className={container}>
        <div className={avatar}>
          <Avatar user={data.sender} />
        </div>
        <div className={body}>
          <div className="flex items-center gap-1">
            <div className="text-sm text-gray-500">{data?.sender?.name}</div>
            <div className="text-xs text-gray-400 ">
              {format(new Date(data.createdAt), "p")}
            </div>
          </div>
          <div className={message}>
            {data.image ? (
              <Image
                onClick={() => setImageModalOpen(true)}
                alt="image"
                width="288"
                height="288"
                className="object-cover translate transition hover:scale-110"
                src={data.image}
              ></Image>
            ) : data.audio ? (
              <div className="flex items-center gap-2">
                {/* <button className="px-3 py-1 text-sm text-white bg-blue-500 rounded-full">
                  {isAudioPlaying ? "Pause" : "Play"}
                </button> */}
                <audio src={data.audio} controls />
              </div>
            ) : (
              <div>{data.body}</div>
            )}
          </div>
          {isLast && isOwn && seenList.length > 0 && (
            <div className="text-xs font-light text-gray-500 ">
              Seen By {seenList}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MessageBox;
