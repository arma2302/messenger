import React from "react";

import dynamic from "next/dynamic";
const Basics = dynamic(() => import("./component/Videocall"), {
  ssr: false,
});
export default function VideoCallLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full h-full pl-0 ">
      <Basics />
    </div>
  );
}
