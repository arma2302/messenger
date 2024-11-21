import React, { ForwardedRef } from "react";
import { FieldValues, UseFormRegister } from "react-hook-form";

interface MessageInputProps {
  id: string;
  placeholder: string;
  type?: string;
  required: boolean;
  register: UseFormRegister<FieldValues>;
}

const MessageInput: React.FC<MessageInputProps> = ({
  placeholder,
  type,
  id,
  register,
  required,
}) => {
  return (
    <div className="w-full relative">
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        autoComplete={id}
        {...register(id, { required })}
        className="text-black font-light py-2 px-4  bg-neutral-100 w-full rounded-full focus:outline-none"
      ></input>
    </div>
  );
};

export default MessageInput;
