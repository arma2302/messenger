"use client";

import useConversation from "@/app/hooks/useConversation";
import axios from "axios";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { HiPaperAirplane, HiPhoto } from "react-icons/hi2";
import MessageInput from "./MessageInput";
import { CldUploadButton } from "next-cloudinary";

const Form = () => {
  const { conversationId } = useConversation();

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: { message: "" },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setValue("message", "", { shouldValidate: true });
    axios.post("/api/messages", { ...data, conversationId: conversationId });
  };

  const handleupload = (result: any) => {
    axios.post("/api/messages", {
      image: result?.info?.secure_url,
      conversationId: conversationId,
    });
    console.log("Image upload button clicked");
    console.log(result?.info?.secure_url, "img url");
  };
  return (
    <div className="px-4 py-4  bg-white border-t flex  items-center gap-2  w-full lg:gap-4 mt-auto ">
      <CldUploadButton
        onSuccess={handleupload}
        options={{ maxFiles: 1 }}
        uploadPreset="jgqmus84"
      >
        <HiPhoto className="text-sky-500 " size={30} />
      </CldUploadButton>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex items-center gap-2  lg:gap-4 w-full"
      >
        <MessageInput
          id="message"
          register={register}
          type="text"
          required
          placeholder="Write a message"
        />
        <button
          type="submit"
          className="rounded-full p-2 bg-sky-500 hover:bg-sky-600 transition"
        >
          <HiPaperAirplane className="text-white" />
        </button>
      </form>
    </div>
  );
};

export default Form;
