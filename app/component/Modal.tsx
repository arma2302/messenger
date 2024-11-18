"use client";

import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Fragment } from "react";
import { IoClose } from "react-icons/io5";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  return (
    <Transition show={isOpen}>
      <Dialog onClose={onClose} as="div" className="z-50 relative">
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-500"
          leaveTo="opacity-0"
          leaveFrom="opacity-100"
        >
          <div className="bg-gray-500 bg-opacity-40 fixed inset-0"></div>
        </TransitionChild>
        <div className="flex items-center text-center min-h-full z-50 justify-center sm:p-0">
          <TransitionChild
            as={Fragment}
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter=" ease-out duration-300 "
            enterTo="opacity-100 translate-y-0  sm:scale-100"
            leave=" ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0  sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel className="relative w-full sm:w-full sm:max-w-lg ">
              <div className="fixed inset-0 overflow-hidden  flex justify-center items-center ">
                <div className="bg-white">
                  <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block z-10">
                    <button
                      onClick={onClose}
                      className="rounded-md bg-white text-gray-400 focus:outline-none hover:text-gray-500 focus:ring-2 focus:ring-sky-500"
                    >
                      <span className="sr-only">Close</span>
                      <IoClose className="h-6 w-6" />
                    </button>
                  </div>
                  {children}
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Modal;
