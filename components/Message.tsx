import { useUser } from "@clerk/clerk-react";
import { Dialog, Menu, Transition } from "@headlessui/react";
import {
  DotsVerticalIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/outline";
import moment from "moment";
import { useRouter } from "next/router";
import React, { Fragment, useRef, useState } from "react";
import Linkify from "react-linkify";
import { db } from "../firebase";
import { MessageType } from "../types/MessageType";

type MessageProps = {
  message: MessageType;
  creatorEmail: string;
  id: string;
};

const Message: React.FC<MessageProps> = ({ message, creatorEmail, id }) => {
  const user = useUser();
  const userLoggedIn = user?.primaryEmailAddress?.emailAddress;
  const TypeOfMessage = creatorEmail === userLoggedIn ? "Sender" : "Receiver";
  const router = useRouter();
  const [showModal, setShowModal] = useState<boolean>(false);

  const editedMessage = useRef<HTMLInputElement>(null);

  function closeModal() {
    setShowModal(false);
  }

  function openModal() {
    setShowModal(true);
  }

  const editMessage = (e: React.MouseEvent) => {
    e.preventDefault();

    db.collection("chats")
      .doc(router.query.id as string)
      .collection("messages")
      .doc(id)
      .set(
        {
          message: editedMessage?.current?.value,
          edited: true,
        },
        { merge: true }
      );
    setShowModal(false);
  };

  const deleteMessage = () => {
    db.collection("chats")
      .doc(router.query.id as string)
      .collection("messages")
      .doc(id)
      .delete();
  };

  return (
    <div className="min-w-[80px]">
      <div
        style={{ width: "fit-content" }}
        className={`p-4 rounded-lg m-3 min-w-[80px] pb-7 relative text-center break-all text-white ${
          TypeOfMessage === "Sender"
            ? "ml-auto bg-indigo-900 text-left"
            : "bg-blue-900 text-left"
        }`}
      >
        <div>
          <Linkify>
            {message.message}{" "}
            <span className="text-sm text-gray-400">
              {message.edited && "(edited)"}
            </span>
          </Linkify>
          {TypeOfMessage === "Sender" && (
            <Menu>
              <Menu.Button>
                <DotsVerticalIcon className="w-4 h-4 cursor-pointer" />
              </Menu.Button>
              <Menu.Items className="flex">
                <Menu.Item>
                  {({ active }) => (
                    <PencilIcon
                      className="w-5 h-5 m-1 cursor-pointer focus:outline-none"
                      onClick={openModal}
                    />
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <TrashIcon
                      className="w-5 h-5 m-1 cursor-pointer focus:outline-none"
                      onClick={deleteMessage}
                    />
                  )}
                </Menu.Item>
              </Menu.Items>
            </Menu>
          )}
        </div>
        <p className="text-gray-400 min-w-[80px] p-2 text-xs absolute bottom-0 text-right right-0 mt-3">
          {message.timestamp ? moment(message.timestamp).format("LT") : "..."}
        </p>
      </div>
      <Transition appear show={showModal} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={closeModal}
        >
          <div className="min-h-screen px-4 text-center backdrop-blur-sm">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0" />
            </Transition.Child>
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-blue-800 shadow-xl rounded-xl">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-white"
                >
                  Edit your message
                </Dialog.Title>
                <form>
                  <div className="mt-2">
                    <input
                      className="w-full p-5 text-white outline-none bg-white/10 rounded-xl backdrop-filter backdrop-blur-2xl bg-opacity-10 focus-visible:ring-blue-500"
                      placeholder="Your edited message"
                      ref={editedMessage}
                      defaultValue={message.message}
                    />
                  </div>

                  <div className="mt-4">
                    <button
                      type="submit"
                      className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-xl hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                      onClick={editMessage}
                    >
                      Edit message
                    </button>
                  </div>
                </form>
              </div>
            </Transition.Child>{" "}
            cursor-pointer
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default Message;
