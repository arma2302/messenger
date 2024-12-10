import React from "react";

export default async function VidepCallLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="lg:pl-80 h-full pl-0 ">{children}</div>;
}
