"use client";

import AgoraRTC, { AgoraRTCProvider } from "agora-rtc-react";
import Basics from "./component/Videocall";
import { useParams } from "next/navigation";
import { useEffect } from "react";

const VideoCallPage = () => {
  // const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

  return (
    // <AgoraRTCProvider client={client}>
    //   <Basics />
    // </AgoraRTCProvider>
    <Basics />
  );
};

export default VideoCallPage;
