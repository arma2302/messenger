"use client";

import useConversation from "@/app/hooks/useConversation";
import axios from "axios";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { HiMicrophone, HiPaperAirplane, HiPhoto } from "react-icons/hi2";
import MessageInput from "./MessageInput";
import { CldUploadButton } from "next-cloudinary";
import { HiEmojiHappy, HiStop, HiTrash } from "react-icons/hi";
import React, { useRef, useState, useEffect } from "react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import Audio from "./Audio";
import useOtherUser from "@/app/hooks/useOtherUsers";
import { Conversation, User } from "@prisma/client";

interface FormProps {
  convo: Conversation & {
    users: User[];
  };
}

const Form2: React.FC<FormProps> = ({ convo }) => {
  const { conversationId } = useConversation();
  const otherUser = useOtherUser(convo);

  const {
    handleSubmit,
    register,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: { message: "" },
  });

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Handle message submit (text)
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    console.log(data, "DTAA");

    setValue("message", "", { shouldValidate: true });
    axios.post("/api/messages", {
      ...data,
      conversationId: conversationId,
      userId: otherUser.id,
    });

    setShowEmojiPicker(false);
  };

  const handleupload = (result: any) => {
    axios.post("/api/messages", {
      image: result?.info?.secure_url,
      conversationId: conversationId,
      userId: otherUser.id,
    });
    console.log("Image upload button clicked");
    console.log(result?.info?.secure_url, "img url");
  };

  // Handle emoji picker
  const handleEmojiPickup = (emoji: { native: string }) => {
    const currentmsg = getValues("message");
    setValue("message", currentmsg + emoji.native, { shouldValidate: true });
  };

  // Start/Stop recording logic
  const toggleRecording = () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop(); // Stop recording
    } else {
      startRecording(); // Start recording
    }
    setIsRecording(!isRecording);
  };

  // Start recording
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);

    // Store audio chunks
    mediaRecorderRef.current.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };

    mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
      setAudioBlob(audioBlob);
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioUrl(audioUrl);
      audioChunksRef.current = []; // Reset chunks
    };

    mediaRecorderRef.current.start();
  };

  // Send the voice note
  const sendVoiceNote = async () => {
    if (!audioBlob) {
      console.error("No audio to send");
      return;
    }

    // Upload to Cloudinary and get the URL
    const cloudinaryUrl = await uploadToCloudinary(audioBlob);

    if (cloudinaryUrl) {
      // Send the Cloudinary URL to the backend API
      try {
        await axios.post("/api/messages", {
          audio: cloudinaryUrl,
          conversationId: conversationId,
          userId: otherUser.id,
        });
        console.log("Voice note sent successfully!");
        setAudioUrl(null); // Clear audio URL after sending
        setAudioBlob(null); // Clear audio blob after sending
      } catch (error) {
        console.error("Error sending voice note", error);
      }
    }
  };

  const deleteRecording = () => {
    setAudioBlob(null);
    setAudioUrl(null);
  };

  // Convert Blob to File and upload to Cloudinary
  const uploadToCloudinary = async (audioBlob: Blob) => {
    // Convert Blob to a File
    const audioFile = new File([audioBlob], "voiceNote.wav", {
      type: "audio/wav",
    });

    // Create a FormData object and append the file
    const formData = new FormData();
    formData.append("file", audioFile);
    formData.append("upload_preset", "jgqmus84"); // Cloudinary preset

    try {
      // Upload the audio file to Cloudinary
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
        formData
      );

      const cloudinaryUrl = response.data.secure_url; // Get the URL from Cloudinary
      return cloudinaryUrl;
    } catch (error) {
      console.error("Error uploading to Cloudinary", error);
      return null;
    }
  };

  return (
    <div className="px-4 py-4 bg-white border-t flex items-center gap-2 w-full lg:gap-4 mt-auto">
      {/* Image Upload Button */}
      <CldUploadButton
        onSuccess={handleupload}
        options={{ maxFiles: 1 }}
        uploadPreset="jgqmus84"
      >
        <HiPhoto className="text-sky-500" size={30} />
      </CldUploadButton>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex items-center gap-2 lg:gap-4 w-full justify-between"
      >
        <div className="flex-1">
          {isRecording ? (
            <Audio />
          ) : audioUrl ? (
            <div className="flex items-center gap-2 w-full justify-between">
              <audio
                controls
                src={audioUrl}
                className="bg-transparent flex-1"
              />
              <div className="flex items-center gap-x-2">
                {" "}
                <button
                  type="button"
                  onClick={sendVoiceNote}
                  className="bg-sky-500 p-2 rounded-full text-white"
                >
                  Send Voice Note
                </button>
                <button
                  type="button"
                  onClick={deleteRecording}
                  className="rounded-full p-2 bg-sky-500 hover:bg-sky-600 transition"
                >
                  <HiTrash className="text-white" />
                </button>
              </div>
            </div>
          ) : (
            <MessageInput
              id="message"
              register={register}
              type="text"
              required
              placeholder="Write a message"
            />
          )}
        </div>

        <div className="flex items-center gap-x-2">
          {/* Submit Button */}
          {!audioUrl && (
            <button
              type="submit"
              className="rounded-full p-2 bg-sky-500 hover:bg-sky-600 transition"
            >
              <HiPaperAirplane className="text-white" />
            </button>
          )}

          {/* Emoji Picker Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="rounded-full p-2 bg-sky-500 hover:bg-sky-600 transition"
            >
              <HiEmojiHappy className="text-white" />
            </button>
            {showEmojiPicker && (
              <div className="absolute right-0 bottom-16">
                <Picker
                  data={data}
                  onEmojiSelect={handleEmojiPickup}
                  title="Pick your emoji"
                  emoji="point_up"
                  theme="light"
                />
              </div>
            )}
          </div>

          {/* Voice Recording Button */}
          <button
            type="button"
            onClick={toggleRecording}
            className={`rounded-full p-2 ${
              isRecording
                ? "bg-gray-500 hover:bg-gray-600"
                : "bg-sky-500 hover:bg-sky-600"
            } transition`}
          >
            {isRecording ? (
              <HiStop className="text-white" />
            ) : (
              <HiMicrophone className="text-white" />
            )}
          </button>
        </div>
      </form>

      {/* Play the recorded voice note */}
      {/* {audioUrl && (
        <div className="mt-2 flex items-center gap-2">
          <audio controls src={audioUrl} />
          <button
            type="button"
            onClick={sendVoiceNote}
            className="bg-sky-500 p-2 rounded-full text-white"
          >
            Send Voice Note
          </button>
          <button type="button" onClick={deleteRecording}>
            <HiTrash />
          </button>
        </div>
      )} */}
    </div>
  );
};

export default Form2;
