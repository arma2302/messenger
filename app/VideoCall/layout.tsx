import React from "react";

export default async function VidepCallLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="w-full h-full pl-0 ">{children}</div>;
}
