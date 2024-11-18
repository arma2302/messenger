"use client";
import Avatar from "@/app/component/Avatar";
import Modal from "@/app/component/Modal";
import useOtherUser from "@/app/hooks/useOtherUsers";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Conversation, User } from "@prisma/client";
import { format } from "date-fns";
import React, { Fragment, useMemo, useState } from "react";
import { IoClose, IoTrash } from "react-icons/io5";
import ConfirmModal from "./ConfirmModal";
import AvatarGroup from "@/app/component/AvatarGroup";
import useActiceUserList from "@/app/hooks/useActiveUserList";

interface ProfileDrawerProps {
  isOpen: boolean;
  data: Conversation & {
    users: User[];
  };
  onClose: () => void;
}

const ProfileDrawer: React.FC<ProfileDrawerProps> = ({
  data,
  isOpen,
  onClose,
}) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const otherUser = useOtherUser(data);

  const joinedDate = useMemo(() => {
    return format(new Date(otherUser.createdAt), "PP");
  }, [otherUser.createdAt]);

  const title = useMemo(() => {
    return data.name || otherUser.name;
  }, [data.name, otherUser.name]);

  const { members } = useActiceUserList();
  const isActive = members.indexOf(otherUser?.email!) !== -1;

  const statusText = useMemo(() => {
    if (data.isGroup) {
      return `${data.users.length} Members In a Group`;
    }

    return isActive
      ? `${otherUser.name} is Active`
      : `${otherUser.name} is Offline`;
  }, [data, isActive]);

  return (
    <>
      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
      />

      <Transition show={isOpen} as={Fragment}>
        <Dialog as="div" onClose={onClose} className="relative z-50">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-500"
            leaveTo="opacity-0"
            leaveFrom="opacity-100"
          >
            <div className="bg-black bg-opacity-40 fixed inset-0"></div>
          </TransitionChild>
          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                <TransitionChild
                  as={Fragment}
                  enterFrom="translate-x-full"
                  enter="transform transition ease-in-out duration-500 "
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <DialogPanel className="pointer-events-auto w-screen max-w-md bg-white">
                    <div className="h-full flex  flex-col overflow-y-scroll py-6  shadow-xl">
                      <div className="px-4 sm:px-6">
                        <div className="flex  items-start justify-end">
                          <div className="h-7 flex ml-3  items-center ">
                            <button
                              onClick={onClose}
                              className="rounded-md bg-white text-gray-400 focus:outline-none hover:text-gray-500 focus:ring-2 focus:ring-sky-500"
                            >
                              <span className="sr-only">Close panel</span>
                              <IoClose size={24} />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="relative mt-6 flex-1 px-4 sm:px-6">
                        <div className="flex flex-col items-center">
                          <div className="mb-2 ">
                            {data.isGroup ? (
                              <AvatarGroup users={data.users} />
                            ) : (
                              <Avatar user={otherUser} />
                            )}
                          </div>
                          <div>{title}</div>
                          <div className="text-sm text-gray-500">
                            {statusText}
                          </div>
                          <div className="flex gap-10 my-8">
                            <div
                              className="flex flex-col items-center cursor-pointer hover:opacity-75 gap-3"
                              onClick={() => setConfirmOpen(true)}
                            >
                              <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center">
                                <IoTrash size={20} />
                              </div>
                              <div className="text-sm font-light text-neutral-600">
                                Delete
                              </div>
                            </div>
                          </div>
                          <div className="w-full pb-5 pt-5 sm:px-0 sm:pt-0 ">
                            <dl className="space-y-8 px-4 sm:space-y-6 sm:px-6">
                              {!data.isGroup && (
                                <div>
                                  <dt className="text-sm font-medium text-gray-500  sm:w-40 sm:flex-shrink-0">
                                    Email
                                  </dt>
                                  <dd className="text-sm text-gray-900 sm:col-span-2">
                                    {otherUser.email}
                                  </dd>
                                </div>
                              )}
                              {!data.isGroup && (
                                <>
                                  <hr />
                                  <div>
                                    <dt className="text-sm font-medium text-gray-500  sm:w-40 sm:flex-shrink-0">
                                      Joined
                                    </dt>
                                    <dd className="text-sm text-gray-900 sm:col-span-2">
                                      <time dateTime={joinedDate}>
                                        {joinedDate}
                                      </time>
                                    </dd>
                                  </div>
                                </>
                              )}
                            </dl>
                          </div>
                        </div>
                      </div>
                    </div>
                  </DialogPanel>
                </TransitionChild>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default ProfileDrawer;
