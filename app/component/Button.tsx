"use client";

import clsx from "clsx";
import React from "react";
interface ButtopnProps {
  onClick?: () => void;
  children: React.ReactNode;
  type?: "button" | "submit" | "reset" | undefined;
  disabled?: boolean;
  danger?: boolean;
  secondary?: boolean;
}

const Button: React.FC<ButtopnProps> = ({
  children,
  onClick,
  type,
  danger,
  secondary,
  disabled,
}) => {
  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={clsx(
        "bg-sky-600 shadow-lg w-full border-0 text-white p-2 rounded-sm ",
        danger && "bg-red-600 text-white",
        secondary && "bg-gray-500 text-white"
      )}
    >
      {children}
    </button>
  );
};
export default Button;
