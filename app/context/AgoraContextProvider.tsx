"use client";
import AgoraRTC, { AgoraRTCProvider } from "agora-rtc-react";
import { SessionProvider } from "next-auth/react";
import React from "react";

interface AgoraProps {
  children: React.ReactNode;
}
export default function AgoraContext({ children }: AgoraProps) {
  const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

  return <AgoraRTCProvider client={client}>{children}</AgoraRTCProvider>;
}
