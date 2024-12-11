import React from "react";

export default function VideoCallLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="w-full h-full pl-0 ">{children}</div>;
}
