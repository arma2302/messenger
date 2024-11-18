import Button from "@/app/component/Button";
import Input from "@/app/component/inputs/Input";
import Select from "@/app/component/inputs/Select";
import Modal from "@/app/component/Modal";
import { Label } from "@headlessui/react";
import { User } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface GroupChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
}

const GroupChatModal: React.FC<GroupChatModalProps> = ({
  isOpen,
  onClose,
  users,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<FieldValues>({ defaultValues: { name: "", members: [] } });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    axios
      .post("/api/conversations", {
        ...data,
        isGroup: true,
      })
      .then(() => {
        router.refresh();
        onClose();
      })
      .catch(() => toast.error("Something went wrong"))
      .finally(() => setIsLoading(false));
  };

  const members = watch("members");
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="px-8 py-10 text-left">
        <div className="border-b-gray-700">
          <div className="flex flex-col border-b border-gray-900/10 ">
            <h2 className="text-sm font-semibold text-gray-900">
              Create a Group Chat
            </h2>
            <p className="text-sm text-gray-600 font-light">
              create A Group chat with more than 2 people
            </p>
            <div className="mt-2">
              <Input
                label="name"
                id="name"
                required
                type="text"
                disabled={isLoading}
                errors={errors}
                register={register}
              />

              <Select
                disabled={isLoading}
                label="Select Members"
                options={users.map((user) => ({
                  label: user.name,
                  value: user.id,
                }))}
                onChange={(value) =>
                  setValue("members", value, { shouldValidate: true })
                }
                value={members}
              />
            </div>
            <div className="mt-6 flex  justify-end items-center gap-x-6">
              <Button disabled={isLoading} onClick={onClose}>
                Cancel
              </Button>
              <Button disabled={isLoading} type="submit">
                Save
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default GroupChatModal;
