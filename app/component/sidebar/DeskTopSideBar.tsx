"use client";
import useRoutes from "@/app/hooks/useRoutes";
import React, { useState } from "react";
import DesktopItem from "./DesktopItem";
import { User } from "@prisma/client";
import Avatar from "../Avatar";
import SettingsModal from "./SettingsModal";

interface DeskTopSideBarProps {
  currentuser: User;
}

const DeskTopSideBar: React.FC<DeskTopSideBarProps> = ({ currentuser }) => {
  const routes = useRoutes();
  console.log(routes, "routes");

  const [isOpen, setIsOpen] = useState(false);
  console.log(currentuser);

  return (
    <>
      <SettingsModal
        currentUser={currentuser}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
      <div className="hidden lg:fixed lg:inset-y-6 lg:left-0 lg:z-40 lg:w-20 xl:px-6 lg:overflow-y-auto lg:bg-white lg:border-r-[1px] lg:pb-4 lg:flex lg:flex-col justify-between">
        <nav className="mt-4 flex flex-col justify-between">
          <ul role="list " className="flex items-center flex-col space-y-1">
            {routes.map((item) => {
              return (
                <DesktopItem
                  key={item.label}
                  href={item.href}
                  label={item.label}
                  icon={item.icon}
                  onClick={item.onClick}
                  active={item.active}
                />
              );
            })}
          </ul>
        </nav>
        <nav className="mt-4 flex flex-col items-center justify-between">
          <div
            onClick={() => setIsOpen(true)}
            className="hover:opacity-75 transition cursor-pointer"
          >
            <Avatar user={currentuser} />
          </div>
        </nav>
      </div>
    </>
  );
};
export default DeskTopSideBar;
