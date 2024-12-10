"use client";
import Image from "next/image";
import AuthForm from "./Component/AuthForm";
import { useEffect } from "react";
import OneSignal from "react-onesignal";

export default function Home() {
  return (
    <>
      <div className="flex flex-col min-h-full py-12 sm:px-6 lg:px-8 bg-gray-100 justify-center ">
        <div>
          <Image
            src={"/images/logo.png"}
            className="mx-auto w-auto"
            alt="Logo"
            width={48}
            height={48}
          />
          <h2 className="text-gray-900 tracking-tighter text-center mt-6 text-3xl font-bold">
            Get Started with Messenger!
          </h2>
        </div>
        {/* AuthForm */}
        <AuthForm />
      </div>
    </>
  );
}
