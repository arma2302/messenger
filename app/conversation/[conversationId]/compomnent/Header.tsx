"use client";

import Avatar from "@/app/component/Avatar";
import useOtherUser from "@/app/hooks/useOtherUsers";
import { Conversation, User } from "@prisma/client";
import Link from "next/link";
import React, { useMemo, useState } from "react";
import { HiChevronLeft, HiEllipsisHorizontal } from "react-icons/hi2";
import ProfileDrawer from "./ProfileDrawer";
import AvatarGroup from "@/app/component/AvatarGroup";
import useActiceUserList from "@/app/hooks/useActiveUserList";
import { HiCamera, HiVideoCamera } from "react-icons/hi";
import VideoCall from "./VideoCall";
import ActiveStatus from "@/app/component/ActiveStatus";

interface HeaderProps {
  convo: Conversation & {
    users: User[];
  };
}

const Header: React.FC<HeaderProps> = ({ convo }) => {
  const { members } = useActiceUserList();
  const otherUser = useOtherUser(convo);
  const isActive = members.indexOf(otherUser?.email!) !== -1;
  console.log(isActive, "true or false");
  console.log(otherUser, "other user");

  const statusText = useMemo(() => {
    if (convo.isGroup) {
      return `${convo.users.length} Members in a Group`;
    }
    if (!isActive) {
      return "Offline";
    }
    return "Active";
  }, [convo, isActive]);

  const [drawerOpen, setDraweropen] = useState(false);
  const [videoCallOpen, setVideoCallOpen] = useState(false);

  const startVideoCall = () => {
    setVideoCallOpen(true);
  };

  return (
    <>
      {" "}
      <ActiveStatus />
      {videoCallOpen && <VideoCall convo={convo} />}
      <ProfileDrawer
        isOpen={drawerOpen}
        data={convo}
        onClose={() => setDraweropen(false)}
      />
      <div className=" flex  border-b-[1px] bg-white  w-full  sm:px-4  py-3 px-4  shadow-sm items-center justify-between lg:px-6">
        <div className="flex items-center gap-3">
          <Link
            href={"/conversation"}
            className="lg:hidden block text-sky-500 hover:text-slate-600 transition cursor-pointer "
          >
            <HiChevronLeft />
          </Link>
          {convo.isGroup ? (
            <AvatarGroup users={convo.users} />
          ) : (
            <Avatar user={otherUser} />
          )}
          <div className="flex flex-col">
            <div>{convo.name || otherUser?.name}</div>
            <div className="text-sm font-light text-neutral-500">
              {statusText}
            </div>
          </div>
        </div>
        <div className="flex  items-center  gap-3">
          <HiVideoCamera
            size={32}
            className="text-sky-500"
            onClick={startVideoCall}
          />
          <HiEllipsisHorizontal
            size={32}
            onClick={() => {
              setDraweropen(true);
            }}
            className="text-sky-500 hover:text-sky-600 curser-pointer transition"
          />
        </div>
      </div>
    </>
  );
};

export default Header;
