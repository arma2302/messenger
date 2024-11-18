"use client";

import { User } from "@prisma/client";
import Image from "next/image";

interface AvatarGroupProps {
  users?: User[];
}
const AvatarGroup: React.FC<AvatarGroupProps> = ({ users = [] }) => {
  const slicedUser = users.slice(0, 3);
  const positionMap = {
    0: "top-0 left-[12px]",
    1: "bottom-0",
    2: "bottom-0 right-0",
  };
  return (
    <div className="relative h-11 w-11 ">
      {slicedUser.map((user, index) => (
        <div
          className={`absolute inline-block over overflow-hidden h-[21px] w-[21px]  rounded-full ${
            positionMap[index as keyof typeof positionMap]
          }`}
          key={user.id}
        >
          <Image
            src={user.image || "/images/avatar.png"}
            fill
            className="rounded-full"
            alt="avatar"
          ></Image>
        </div>
      ))}
    </div>
  );
};

export default AvatarGroup;
