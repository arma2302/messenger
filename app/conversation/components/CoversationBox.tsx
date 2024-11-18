"use client";

import Avatar from "@/app/component/Avatar";
import AvatarGroup from "@/app/component/AvatarGroup";
import useOtherUser from "@/app/hooks/useOtherUsers";
import { FullConversationType } from "@/app/types";
import clsx from "clsx";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";

interface CoversationBoxProps {
  data: FullConversationType;
  selected?: boolean;
}

const CoversationBox: React.FC<CoversationBoxProps> = ({ data, selected }) => {
  const otherUser = useOtherUser(data);
  const session = useSession();
  const router = useRouter();

  // Click handler to navigate to the selected conversation
  const handleClick = useCallback(() => {
    console.log("Navigating to conversation:", data.id); // Debugging
    router.push(`/conversation/${data.id}`);
  }, [data.id, router]);

  // Getting the last message from the conversation
  const lastMessage = useMemo(() => {
    const messages = data?.messages || [];
    return messages[messages.length - 1];
  }, [data.messages, session]);

  const userEmail = useMemo(() => {
    return session.data?.user?.email;
  }, [session.data?.user?.email]);

  // Check if the user has seen the last message
  const hasSeen = useMemo(() => {
    if (!lastMessage) return false;
    const seenArray = lastMessage.seen || [];
    return seenArray.some((user) => user.email === userEmail);
  }, [userEmail, lastMessage]);

  // Get the text of the last message
  const lastMessageText = useMemo(() => {
    if (lastMessage?.image) {
      return "Sent an Image";
    }
    if (lastMessage?.body) {
      return lastMessage.body;
    }
    return "Started a Conversation";
  }, [lastMessage]);

  return (
    <div
      className={clsx(
        `w-full flex items-center space-x-3 p-3 hover:bg-neutral-100 rounded-lg transition cursor-pointer `,
        selected ? "bg-neutral-100" : "bg-white my-5"
      )}
      onClick={handleClick}
    >
      {data.isGroup ? (
        <AvatarGroup users={data.users} />
      ) : (
        <Avatar user={otherUser} />
      )}
      <div className="min-w-0 flex-1">
        <div className="focus:outline-none">
          <div className="flex justify-between items-center mb-1">
            <p className="text-md font-medium text-gray-900">
              {data?.name || otherUser?.name}
            </p>
            {lastMessage?.createdAt && (
              <p className="text-xs text-gray-400 font-light">
                {format(new Date(lastMessage.createdAt), "p")}
              </p>
            )}
          </div>
          <p
            className={clsx(
              hasSeen ? "text-gray-500" : "text-black font-medium"
            )}
          >
            {lastMessageText}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CoversationBox;
