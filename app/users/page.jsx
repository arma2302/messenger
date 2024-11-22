"use client";
import React, { useEffect } from "react";
import EmptyState from "../component/EmptyState";
import OneSignal from "react-onesignal";
import axios from "axios";
export default function Page() {
  useEffect(() => {
    OneSignal.init({
      appId: "fe053631-7865-497a-b4a6-fa17d4a00c19",
      safari_web_id: "web.onesignal.auto.1f13959d-363e-4480-ae37-ce4b59dbb72b",
      notifyButton: {
        enable: true,
      },

      allowLocalhostAsSecureOrigin: true,
    });
    const windowObj = window;

    OneSignal.User.PushSubscription.addEventListener(
      "change",
      (subscription) => {
        console.log("changed event");

        const userId = windowObj.OneSignal.User.onesignalId;
        console.log("userID", userId);

        axios
          .post("/api/Notification", { playerId: userId })
          .then((response) => {
            console.log("Player ID stored successfully");
          })
          .catch((error) => {
            console.error("Error storing Player ID:", error);
          });
      }
    );
  }, []);
  return (
    <div className="hidden lg:block lg:pl-80 h-full">
      <EmptyState />
    </div>
  );
}
