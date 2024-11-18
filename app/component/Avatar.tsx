"use client";
import { User } from "@prisma/client";
import Image from "next/image";
import React from "react";
import useActiceUserList from "../hooks/useActiveUserList";
import clsx from "clsx";

interface AvatarProps {
  user?: User;
}

const Avatar: React.FC<AvatarProps> = ({ user }) => {
  const { members } = useActiceUserList();
  const isActive = members.indexOf(user?.email!) !== -1;

  return (
    <div className="relative">
      <div className="relative h-9 w-9 rounded-full md:w-11 md:h-11 inline-block bg-gray-200">
        <Image
          alt="Avatar"
          src={user?.image || "/images/avatar.png"}
          className="w-full h-full rounded-full"
          fill
        />
      </div>

      <span
        className={clsx(
          "absolute rounded-full ring-white top-0 right-0 w-2 h-2 md:h-3 md:w-3",
          isActive ? " bg-green-500" : "bg-transparen bg-gray-400"
        )}
      ></span>
    </div>
  );
};
export default Avatar;
