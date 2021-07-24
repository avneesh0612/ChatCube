import moment from "moment";
import React, { useRef } from "react";
import { MessageType } from "../types/MessageType";
import Linkify from "react-linkify";
import { PencilIcon, TrashIcon } from "@heroicons/react/outline";
import { db } from "../firebase";
import { useRouter } from "next/router";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";

type MessageProps = {
  message: MessageType;
  creatorEmail: string;
  id: any;
};

const Message: React.FC<MessageProps> = ({ message, creatorEmail, id }) => {
  const userLoggedIn = (window as any).Clerk.user.primaryEmailAddress
    .emailAddress;
  const TypeOfMessage = creatorEmail === userLoggedIn ? "Sender" : "Reciever";
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  const editedMessage = useRef<HTMLInputElement>();

  function closeModal() {
    setShowModal(false);
  }

  function openModal() {
    setShowModal(true);
  }

  const editMessage = (e) => {
    e.preventDefault();

    db.collection("chats")
      .doc(router.query.id as string)
      .collection("messages")
      .doc(id)
      .set(
        {
          message: editedMessage.current.value,
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
            <span className="text-gray-400 text-sm">
              {message.edited && "(edited)"}
            </span>
          </Linkify>
          {TypeOfMessage === "Sender" && (
            <div className="flex items-end justify-end w-full">
              <PencilIcon
                className="w-6 h-6 cursor-pointer"
                onClick={openModal}
              />
              <TrashIcon
                className="w-6 h-6 cursor-pointer"
                onClick={deleteMessage}
              />
            </div>
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
          <div className="min-h-screen px-4 text-center">
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
              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Edit your message
                </Dialog.Title>
                <form>
                  <div className="mt-2">
                    <input
                      className="w-full p-5 text-blue-900 bg-blue-600 rounded-lg outline-none backdrop-filter backdrop-blur-2xl bg-opacity-10 focus-visible:ring-blue-500"
                      placeholder="Your edited message"
                      ref={editedMessage}
                      defaultValue={message.message}
                    />
                  </div>

                  <div className="mt-4">
                    <button
                      type="submit"
                      className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
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
