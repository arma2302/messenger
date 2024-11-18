"use client";

import useConversation from "@/app/hooks/useConversation";
import useRoutes from "@/app/hooks/useRoutes";
import React from "react";
import MobileFooterItem from "./MobileFooterItem";

export default function MobileFooter() {
  const routes = useRoutes();
  const { isOpen } = useConversation();

  if (isOpen) {
    return null;
  }
  return (
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
    </div>
  );
}
