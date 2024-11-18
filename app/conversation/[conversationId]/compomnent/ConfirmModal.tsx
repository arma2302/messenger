"use client";

import Modal from "@/app/component/Modal";
import useConversation from "@/app/hooks/useConversation";
import {
  Button,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { FiAlertTriangle } from "react-icons/fi";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { conversationId } = useConversation();

  const onDelete = useCallback(() => {
    setIsLoading(true);
    axios
      .delete(`/api/conversations/${conversationId}`)
      .then(() => {
        router.push("/conversation");
        router.refresh();
      })
      .catch(() => toast.error("something went wrong"))
      .finally(() => setIsLoading(false));
  }, [conversationId, router, onClose]);

  return (
    <div>
      <Modal isOpen={isOpen} onClose={onClose}>
        <div className="sm:flex sm:items-start bg-white  gap-3 p-4 w-full">
          <div
            className="w-12 
            h-12 
            flex 
            flex-shrink-0 
            bg-red-100 
            justify-center 
            items-center 
            sm:mx-0 
            sm:h-10 
            sm:w-10 rounded-full"
          >
            <FiAlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <div className="mt-3 sm:mt-0 sm:text-left">
            <DialogTitle
              as="h3"
              className="text-gray-900 text-base font-semibold leading-6 "
            >
              Delete Conversation
            </DialogTitle>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                Are You sure You want to Delete This Conversation?This action
                can not be undone.
              </p>
            </div>
          </div>
        </div>
        <DialogPanel className="w-full flex justify-end items-end mt-2 p-2 gap-4">
          <Button
            disabled={isLoading}
            onClick={onClose}
            className="rounded bg-gray-100 py-2 px-4 text-sm text-black data-[hover]:bg-gray-200 data-[active]:bg-gray-200"
          >
            Cancle
          </Button>
          <Button
            disabled={isLoading}
            onClick={onDelete}
            className="rounded bg-red-600 py-2 px-4 text-sm text-white data-[hover]:bg-red-500 data-[active]:bg-red-700"
          >
            Delete
          </Button>
        </DialogPanel>
      </Modal>
    </div>
  );
};

export default ConfirmModal;
