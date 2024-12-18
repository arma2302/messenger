"use client";

import Input from "@/app/component/inputs/Input";
import Button from "@/app/component/Button";
import React, { useCallback, useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import AuthSocialButton from "./AuthSocialButton";
import { BsGithub, BsGoogle } from "react-icons/bs";
import axios from "axios";
import toast from "react-hot-toast";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import LoadingModal from "@/app/component/LoadingModal";
import { HiEye, HiEyeOff } from "react-icons/hi";
import OneSignal from "react-onesignal";

export default function AuthForm() {
  const session = useSession();
  const router = useRouter();
  const [varient, setVarient] = useState<"LOGIN" | "REGISTER">("LOGIN");
  const [isLoading, setLoading] = useState(false);
  const [passwordVisiblity, setPasswordVisiblity] = useState<
    "password" | "text"
  >("password");
  useEffect(() => {
    if (session?.status === "authenticated") {
      setLoading(true);
      router.push("/users");
    }

    return () => {
      setLoading(false);
    };
  }, [session?.status, router]);

  const togglevarient = useCallback(() => {
    if (varient === "LOGIN") {
      setVarient("REGISTER");
    } else {
      setVarient("LOGIN");
    }
  }, [varient]);

  const togglePassword = useCallback(() => {
    if (passwordVisiblity === "password") {
      setPasswordVisiblity("text");
    } else {
      setPasswordVisiblity("password");
    }
  }, [passwordVisiblity]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onsubmit: SubmitHandler<FieldValues> = (data) => {
    setLoading(true);
    console.log("started");

    if (varient === "REGISTER") {
      console.log("sending Request");

      axios
        .post("api/register", data)
        .then(() => {
          toast.success("Registered  successfully! Please Login to continue");
        })
        .catch((error) => {
          console.log(error);
          toast.error("something went wrong");
        })
        .finally(() => {
          setLoading(false);
          router.refresh();
        });
    }

    if (varient === "LOGIN") {
      signIn("credentials", {
        ...data,
        redirect: false,
      })
        .then((callback) => {
          if (callback?.error) {
            return toast.error("invalid username or password");
          }
          if (callback?.ok && !callback.error) {
            toast.success("Logged In!");
          }
        })
        .finally(() => {
          setLoading(false);
          router.push("/users");
        });
    }
  };

  // const socialActions = (action: string) => {
  //   setLoading(true);
  //   console.log("social action ", action);

  //   signIn(action, { redirect: false })
  //     .then((callback) => {
  //       if (callback?.error) {
  //         return toast.error("Error logging in with " + action);
  //       }
  //       if (callback?.ok && !callback.error) {
  //         return toast.success("Logged In with " + action);
  //       }
  //     })
  //     .finally(() => {
  //       setLoading(false);
  //     });
  // };
  const socialActions = (action: string) => {
    setLoading(true);
    console.log("social action ", action);

    signIn(action, { redirect: false })
      .then((callback) => {
        console.log("callback response", callback); // Log the full callback response
        if (callback?.error) {
          return toast.error("Error logging in with " + action);
        }
        if (callback?.ok && !callback.error) {
          return toast.success("Logged In with " + action);
        }
      })
      .catch((error) => {
        console.error("SignIn error:", error); // Log any errors
        toast.error("Unexpected error: " + error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      {isLoading && <LoadingModal />}
      <div className="mt-8 sm:mx-auto sm:w-full sm:mx-w-md ">
        <div className="bg-white px-4 py-8  shadow sm:rounded-lg sm:px-10 md:w-1/4 sm:mx-auto w-11/12 mx-auto">
          <form onSubmit={handleSubmit(onsubmit)} className="space-y-6">
            {varient === "REGISTER" && (
              <Input
                label="Name"
                register={register}
                id="name"
                errors={errors}
              />
            )}
            <Input
              label="Email"
              register={register}
              id="email"
              errors={errors}
              type="email"
            />
            <div className="relative">
              <Input
                label="Password"
                register={register}
                id="password"
                errors={errors}
                type={passwordVisiblity === "password" ? "password" : "text"}
              />
              {passwordVisiblity === "password" ? (
                <HiEye
                  size={22}
                  className="text-sky-500 absolute right-2 bottom-[5px] "
                  onClick={togglePassword}
                />
              ) : (
                <HiEyeOff
                  size={22}
                  className="text-sky-500 absolute right-2 bottom-[5px] "
                  onClick={togglePassword}
                />
              )}
            </div>
            <div>
              <Button type="submit" disabled={isLoading}>
                {varient === "LOGIN" ? "Sign In" : "Register"}
              </Button>
            </div>
            <div className=" mt-6 ">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="border-t border-gray-300 w-full" />
                </div>
              </div>
              <div className="flex relative  justify-center text-sm items-center">
                <span className="absolute bg-white text-gray-500">
                  Or continue With
                </span>
              </div>
            </div>
            <div className="mt-6 flex gap-4">
              <AuthSocialButton
                icon={BsGithub}
                onClick={() => socialActions("github")}
              />
              <AuthSocialButton
                icon={BsGoogle}
                onClick={() => socialActions("google")}
              />
            </div>
            <div className="text-sm flex justify-center gap-2 mt-6 px-2 text-gray-500 ">
              <p>
                {varient === "LOGIN"
                  ? "New to Messenger?"
                  : "Alreday Have an Account?"}
              </p>
              <div
                onClick={togglevarient}
                className="text-gray-900 underline cursor-pointer"
              >
                {varient === "LOGIN" ? "Create An Account " : "Login"}
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
