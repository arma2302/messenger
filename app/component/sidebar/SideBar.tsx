import React from "react";
import DeskTopSideBar from "./DeskTopSideBar";
import MobileFooter from "./MobileFooter";
import getCurrentuser from "@/app/actions/getCurrentUser";

export default async function SideBar({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentuser = await getCurrentuser();
  return (
    <div className="h-full">
      <DeskTopSideBar currentuser={currentuser!} />
      <MobileFooter />
      <div className="lp:pl-20 h-full">{children}</div>
    </div>
  );
}
