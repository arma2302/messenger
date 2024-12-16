"use client";

import Avatar from "@/app/component/Avatar";
import useOtherUser from "@/app/hooks/useOtherUsers";
import { Conversation, User } from "@prisma/client";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { HiChevronLeft, HiEllipsisHorizontal, HiPhone } from "react-icons/hi2";
import ProfileDrawer from "./ProfileDrawer";
import AvatarGroup from "@/app/component/AvatarGroup";
import useActiceUserList from "@/app/hooks/useActiveUserList";
import { HiCamera, HiSearch, HiVideoCamera } from "react-icons/hi";
import ActiveStatus from "@/app/component/ActiveStatus";

import { useParams, usePathname, useRouter } from "next/navigation";
import { pusherClient } from "@/app/libs/pusher";
import axios from "axios";
import CallNotification from "@/app/component/CallNotification";
import ConversationId from "../page";
import SearchComponent from "./SearchComponent";

interface HeaderProps {
  convo: Conversation & {
    users: User[];
  };
}

const Header: React.FC<HeaderProps> = ({ convo }) => {
  const { members } = useActiceUserList();
  const otherUser = useOtherUser(convo);
  const currentUser = convo.users.find((user) => user.id !== otherUser.id);
  const [incomingCall, setIncomingCall] = useState(false);
  const [searchedMsg, setSearchedMsg] = useState("");
  const [data, setData] = useState("");

  // useEffect(() => {
  //   pusherClient.subscribe(currentUser?.id!);
  //   pusherClient.bind("callInvitation:new", function (data: any) {
  //     console.log(data, "notification data");
  //     setData(data);
  //     setIncomingCall(true);
  //   });

  //   return () => {
  //     pusherClient.unsubscribe(currentUser?.id!);
  //     pusherClient.unbind("callInvitation:new");
  //   };
  // }, [currentUser?.id]);

  const user = convo.users.filter((user) => user.id !== otherUser.id)[0];

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
  const [caller, setCaller] = useState<User | null>();
  const [Reciver, setReciver] = useState<User | null>();
  const [calling, setIsCalling] = useState(false);

  // const startVideoCall = () => {
  //   setVideoCallOpen(true);
  // };
  const pathname = usePathname();
  const route = useRouter();
  const params = useParams();
  const Videocall = async () => {
    await axios
      .post("/api/videocall", { params })
      .then((res) => {
        console.log(res.data);
        return res.data;
      })
      .then((data) => {
        setCaller(data.currentUser);
        setReciver(data.otherUser);
      })
      .catch((error) => {
        console.log(error, "error fetching user details");
      });
    setIsCalling(true);
    // route.push(`${pathname}/VideoCall`);
  };

  useEffect(() => {
    pusherClient.subscribe(currentUser?.id!);
    pusherClient.bind("answer:new", (data: string) => {
      console.log(data, "data");
      if (data === "accept") {
        route.replace(`/videocall`);
      }
      if (data === "reject") {
        alert("Call declined");
        setIsCalling(false);
      }
    });

    return () => {
      pusherClient.unsubscribe(currentUser?.id!);
      pusherClient.unbind("answer:new");
    };
  }, [currentUser?.id]);

  return (
    <>
      {" "}
      {incomingCall && data && <CallNotification data={data} />}
      {calling && (
        <div className="flex flex-col items-center justify-center bg-gradient-to-b from-gray-800 to-gray-900 bg-opacity-90 min-h-screen py-8 px-6">
          {/* Receiver Info */}
          <div className="flex flex-col items-center space-y-6 mb-8">
            <img
              src={
                Reciver?.image ||
                "https://static.vecteezy.com/system/resources/previews/002/387/693/non_2x/user-profile-icon-free-vector.jpg"
              }
              alt={Reciver?.name!}
              className="w-32 h-32 rounded-full object-cover border-4 border-green-500 shadow-xl"
            />
            <div className="text-white text-center">
              <h3 className="text-3xl font-semibold">{Reciver?.name}</h3>
              <p className="text-lg text-gray-300">Receiver</p>
            </div>
          </div>

          {/* Calling Status */}
          <h2 className="text-4xl font-semibold text-center text-white mb-6">
            Calling...
          </h2>

          {/* End Call Button */}
        </div>
      )}
      <ActiveStatus />
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
          <SearchComponent convo={convo} />
          <HiVideoCamera
            size={32}
            className="text-sky-500 cursor-pointer"
            onClick={Videocall}
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
