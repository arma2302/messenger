"use client";
import AgoraRTC, { AgoraRTCProvider } from "agora-rtc-react";
import React from "react";
import VcPage from "./Videocall";
export const Client = () => {
  const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
  return (
    <AgoraRTCProvider client={client}>
      <VcPage />
    </AgoraRTCProvider>
  );
};

export default Client;
