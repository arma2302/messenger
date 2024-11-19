"use client";
import React, { useState } from "react";
import clsx from "clsx";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";
import { HiEye } from "react-icons/hi";

interface Inputprops {
  label: string;
  id: string;
  type?: string;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
  disabled?: boolean;
}
const Input: React.FC<Inputprops> = ({
  label,
  id,
  register,
  required,
  disabled,
  type,
  errors,
}) => {
  return (
    <div>
      <label
        className="block text-sm font-medium text-gray-900 leading-6"
        htmlFor={id}
      >
        {label}
      </label>
      <div className="mt-2">
        <input
          id={id}
          type={type}
          autoComplete={id}
          disabled={disabled}
          {...register(id, { required })}
          className={clsx(
            `form-input block w-full border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-inset focus:outline-none focus:ring-sky-600 sm:text-sm sm:leading-6`,
            errors[id] && `focus:ring-rose-500`,
            disabled && "opacity-50 cursor-default"
          )}
        ></input>
      </div>
    </div>
  );
};
export default Input;
