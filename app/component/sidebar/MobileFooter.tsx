"use client";

import useConversation from "@/app/hooks/useConversation";
import useRoutes from "@/app/hooks/useRoutes";
import React, { useState } from "react";
import MobileFooterItem from "./MobileFooterItem";
import Avatar from "../Avatar";
import { User } from "@prisma/client";
import SettingsModal from "./SettingsModal";

interface MobileFooterProps {
  currentuser: User;
}
const MobileFooter: React.FC<MobileFooterProps> = ({ currentuser }) => {
  const routes = useRoutes();
  const { isOpen } = useConversation();
  const [isModalOpen, setIsOpen] = useState(false);
  if (isOpen) {
    return null;
  }
  return (
    <>
      <SettingsModal
        currentUser={currentuser}
        isOpen={isModalOpen}
        onClose={() => setIsOpen(false)}
      />
      <div className="lg:hidden  fixed bottom-0 z-40 w-full flex justify-between bg-sky-200">
        {routes.map((item) => {
          return (
            <MobileFooterItem
              key={item.label}
              href={item.href}
              label={item.label}
              active={item.active}
              icon={item.icon}
              onClick={item.onClick}
            />
          );
        })}
        <div
          className="fixed bottom-16 right-6"
          onClick={() => setIsOpen(true)}
        >
          <Avatar user={currentuser} />
        </div>
      </div>
    </>
  );
};

export default MobileFooter;
