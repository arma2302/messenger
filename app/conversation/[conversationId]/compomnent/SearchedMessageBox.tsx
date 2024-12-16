"use client";
import Avatar from "@/app/component/Avatar";
import { FullMessageType } from "@/app/types";
import clsx from "clsx";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import ImageModal from "./ImageModal";

interface MessageBoxProps {
  data: FullMessageType;
  filteredVal: string;
}

const SearchedMessageBox: React.FC<MessageBoxProps> = ({
  data,
  filteredVal,
}) => {
  const session = useSession();
  const [isImageModalOpen, setImageModalOpen] = useState(false);
  const isOwn = session.data?.user?.email === data?.sender?.email;

  const container = clsx("flex gap-3 p-4", isOwn && "justify-end");
  const avatar = clsx(isOwn && "order-2");
  const body = clsx("flex flex-col gap-2", isOwn && "items-end");
  const message = clsx(
    "text-sm w-fit overflow-hidden rounded-full py-2 px-3",
    isOwn ? "bg-sky-500 text-white" : "bg-gray-100"
  );

  // Function to highlight the search term in the message body
  const highlightText = (text: string, highlight: string) => {
    if (!highlight) return text;

    const parts = text.split(new RegExp(`(${highlight})`, "gi")); // Split by the highlight term (case-insensitive)
    return parts.map((part, index) => {
      return part.toLowerCase() === highlight.toLowerCase() ? (
        <span key={index} className="bg-yellow-300 text-black">
          {part}
        </span> // Apply background color to highlight
      ) : (
        part
      );
    });
  };

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
            <div className="text-xs text-gray-400">
              {format(new Date(data.createdAt), "p")}
            </div>
          </div>
          <div className={message}>
            {highlightText(data?.body!, filteredVal)}{" "}
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchedMessageBox;
