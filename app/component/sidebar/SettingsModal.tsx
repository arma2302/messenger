"use client";
import { User } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Modal from "../Modal";
import Input from "../inputs/Input";
import Image from "next/image";
import { CldUploadButton } from "next-cloudinary";
import Button from "../Button";

interface SettingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
}

const SettingsModal: React.FC<SettingModalProps> = ({
  isOpen,
  onClose,
  currentUser,
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FieldValues>({
    defaultValues: { name: currentUser?.name, image: currentUser?.image },
  });

  const image = watch("image");
  const handleUpload = (result: any) => {
    setValue("image", result?.info?.secure_url, { shouldValidate: true });
  };

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);
    axios
      .post(`/api/settings`, data)
      .then(() => {
        router.refresh();
        onClose();
      })
      .catch(() => toast.error("something Went wrong"))
      .finally(() => {
        setIsLoading(false);
      });
  };
  return (
    <div>
      <Modal isOpen={isOpen} onClose={onClose}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-12 bg-white p-6">
            <div className="border-b border-e-gray-900/10 text-left">
              <h2 className="text-base leading-7 text-neutral-900 font-semibold">
                Profile
              </h2>
              <p className="text-sm text-gray-600 leading-6 mt-1">
                Edit Your Public Information
              </p>

              <div
                className="flex flex-col gay-y-8 mt-10  
              "
              >
                <Input
                  disabled={isLoading}
                  label="name"
                  id="name"
                  errors={errors}
                  required
                  register={register}
                />
              </div>
              <div>
                <label className="block text-sm font-medium leading-6  mt-4 text-gray-600">
                  Photo
                </label>
                <div className="flex items-center gap-x-3 py-6">
                  <Image
                    width="48"
                    height="48"
                    alt="Profile Pic"
                    src={image || currentUser?.image || "/images/avatar.png"}
                    className="rounded-full w-[48px] h-[48px]"
                  />
                  <CldUploadButton
                    className="flex-1"
                    onSuccess={handleUpload}
                    uploadPreset="jgqmus84"
                    options={{ maxFiles: 1 }}
                  >
                    <Button disabled={isLoading} type="button">
                      Change
                    </Button>
                  </CldUploadButton>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 flex  justify-end items-center gap-x-6 p-6">
            <Button disabled={isLoading} onClick={onClose}>
              Cancel
            </Button>
            <Button disabled={isLoading} type="submit">
              Save
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SettingsModal;
