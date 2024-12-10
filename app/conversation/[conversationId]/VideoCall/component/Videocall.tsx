"use client";
import {
  LocalUser,
  RemoteUser,
  useIsConnected,
  useJoin,
  useLocalMicrophoneTrack,
  useLocalCameraTrack,
  usePublish,
  useRemoteUsers,
} from "agora-rtc-react";
import React, { useEffect, useState } from "react";
import "@/app/conversation/[conversationId]/VideoCall/component/style.css";
import { User } from "@prisma/client";
import { HiCamera, HiMicrophone, HiPhone } from "react-icons/hi2";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import AgoraRTM from "agora-rtm-sdk";
import { pusherServer } from "@/app/libs/pusher";

export const Basics = () => {
  const { RTM } = AgoraRTM;
  const [currentUser, setCurrentUser] = useState<User | null>();
  const [otherUser, setOtherUser] = useState<User | null>();
  const params = useParams();

  // useEffect(() => {
  //   axios
  //     .post("/api/userDetails", { params })
  //     .then((res) => {
  //       console.log(res.data);
  //       return res.data;
  //     })
  //     .then((data) => {
  //       setCurrentUser(data.currentUser);
  //       setOtherUser(data.otherUser);
  //     })
  //     .catch((error) => {
  //       console.log(error, "error fetching user details");
  //     });
  // }, []);

  const [appId, setAppId] = useState("f9d0855cb9ca4c9896d50f231e32c9de");
  const [channel, setChannel] = useState("vcroom");
  const [token, setToken] = useState(
    "007eJxTYJjJ3JzoEOs359wbvWnLllpPjro/J2+z6cS7oRbcFWuKHt5TYEizTDGwMDVNTrJMTjRJtrSwNEsxNUgzMjZMNTZKtkxJjXkQnt4QyMjAY36ahZEBAkF8Noay5KL8/FwGBgCvLSC3"
  );
  const [calling, setCalling] = useState(false);
  useJoin({
    appid: appId,
    channel: channel,
    token: token ? token : null,
  });

  const isConnected = useIsConnected();

  //local user
  const [micOn, setMic] = useState(true);
  const [cameraOn, setCamera] = useState(true);
  const { localMicrophoneTrack } = useLocalMicrophoneTrack(micOn);
  const { localCameraTrack } = useLocalCameraTrack(cameraOn);
  usePublish([localMicrophoneTrack, localCameraTrack]);
  //remote users
  const remoteUsers = useRemoteUsers();
  const route = useRouter();

  const leaveCall = () => {
    setCalling(!calling);
    route.back();
  };

  return (
    <div className="w-full bg-gray-900 h-full flex flex-col justify-center items-center py-4 ">
      {/* Video Container */}
      <div className="w-full max-w-[90%] flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 p-4">
        {/* Local Video */}
        <div className="relative w-full sm:w-1/2 h-[280px] sm:h-[600px] bg-black rounded-lg overflow-hidden shadow-xl">
          <LocalUser
            audioTrack={localMicrophoneTrack}
            cameraOn={cameraOn}
            micOn={micOn}
            videoTrack={localCameraTrack}
            cover={
              "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
            }
          >
            <div className="absolute top-2 left-2 text-white text-sm bg-gray-800 bg-opacity-60 px-2 py-1 rounded-md">
              You
            </div>
          </LocalUser>
        </div>

        {/* Remote Video */}
        {isConnected && remoteUsers.length > 0 && (
          <div className="relative w-full sm:w-1/2 h-[280px] sm:h-[600px] bg-black rounded-lg overflow-hidden shadow-xl">
            {remoteUsers.map((user) => (
              <RemoteUser
                key={user.uid}
                cover="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                user={user}
              >
                <div className="absolute top-2 left-2 text-white text-sm bg-gray-800 bg-opacity-60 px-2 py-1 rounded-md">
                  {otherUser?.name || "OtherUser"}
                </div>
              </RemoteUser>
            ))}
          </div>
        )}
      </div>

      {/* Control Buttons */}
      <div className="fixed bottom-6 w-full max-w-lg flex justify-center gap-8 items-center z-10">
        <button
          className={`bg-gray-700 w-16 h-16 rounded-full flex justify-center items-center transition-all transform hover:scale-110 ${
            micOn ? "text-red-600" : "text-gray-300"
          } shadow-md`}
          aria-label={micOn ? "Mute Microphone" : "Unmute Microphone"}
          onClick={() => setMic((prev) => !prev)}
        >
          <HiMicrophone size={36} />
        </button>

        <button
          className={`bg-gray-700 w-16 h-16 rounded-full flex justify-center items-center transition-all transform hover:scale-110 ${
            cameraOn ? "text-red-600" : "text-gray-300"
          } shadow-md`}
          aria-label={cameraOn ? "Turn Off Camera" : "Turn On Camera"}
          onClick={() => setCamera((prev) => !prev)}
        >
          <HiCamera size={36} />
        </button>

        <button
          className={`bg-red-600 w-16 h-16 rounded-full flex justify-center items-center transition-all transform hover:scale-110 ${
            calling ? "bg-green-600" : ""
          } shadow-md`}
          aria-label={calling ? "End Call" : "Start Call"}
          onClick={leaveCall}
        >
          <HiPhone size={36} className="text-white" />
        </button>
      </div>
    </div>
  );
};

export default Basics;
