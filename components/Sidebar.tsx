import React, { ChangeEventHandler, useEffect } from "react";
import { db } from "../firebase";
import Chat from "./Chat";
import { useCollection } from "react-firebase-hooks/firestore";
import { useRouter } from "next/router";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import { SearchIcon } from "@heroicons/react/outline";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import * as EmailValidator from "email-validator";
import { toast } from "react-toastify";
import Fade from "react-reveal/Fade";

interface User {
  id: string;
  data: any;
  email: string;
  lastSeen: any;
  name: string;
  photoURL: string;
  username: string | null;
}

const Sidebar: React.FC<any> = () => {
  const router = useRouter();
  const user = window.Clerk.user;
  const [users, setUsers] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  console.log(showSuggestions);

  useEffect(() => {
    db.collection("users")
      .orderBy("name")
      .onSnapshot((snapshot) =>
        setUsers(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        )
      );
  }, []);

  const userChatsRef = db
    .collection("chats")
    .where("users", "array-contains", user.primaryEmailAddress.emailAddress);
  const [chatsSnapshot] = useCollection(userChatsRef);

  const createChat = (input) => {
    if (!input) return;
    if (
      EmailValidator.validate(input) &&
      !chatAlreadyExist(input) &&
      input !== user.primaryEmailAddress.emailAddress
    ) {
      db.collection("chats").add({
        users: [user.primaryEmailAddress.emailAddress, input],
      });
    }
    setIsOpen(false);
  };

  const chatAlreadyExist = (recipientEmail) =>
    !!chatsSnapshot?.docs.find(
      (chat) =>
        chat.data().users.find((user) => user === recipientEmail)?.length > 0
    );

  let [isOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const userInput = e.currentTarget.value;
    const filteredSuggestions = users.filter(
      (user) =>
        user.data.name?.toLowerCase().indexOf(userInput.toLowerCase()) > -1
    );
    setFilteredSuggestions(filteredSuggestions.slice(0, 10));
    setShowSuggestions(true);
    setInputValue(e.currentTarget.value);
  };

  return (
    <Fade left>
      <div className="border-[1px] m-4 md:w-[30vw] border-darkblue dark:border-gray-700 h-[80vh] md:m-1 md:ml-5 mt-0 mb-0 min-w-[300px] overflow-y-scroll hidescrollbar rounded-xl">
        <div className="flex sticky top-0 justify-between items-center p-4 h-20 bg-lightblue dark:bg-indigo-700 border-b-[1px] border-darkblue dark:border-gray-700 z-10">
          <Image
            width={56}
            height={56}
            className="rounded-full cursor-pointer hover:opacity-80"
            onClick={() => router.push("/user")}
            src={user.profileImageUrl}
            alt={user.fullName}
          />
        </div>

        <div className="flex items-center justify-center bg-lightblue dark:bg-indigo-700 p-3 border-b-[1px] border-darkblue dark:border-gray-700">
          <div className="flex items-center justify-center p-3 text-black bg-white backdrop-filter backdrop-blur-2xl bg-opacity-10 rounded-xl w-80">
            <SearchIcon className="text-black dark:text-gray-50 w-6 h-6" />
            <input
              className="flex-1 ml-3 text-black bg-transparent border-none outline-none dark:text-white"
              placeholder="Search in chats"
              type="text"
            />
          </div>
        </div>

        <button
          className="w-full focus:outline-none border-b-[1px] py-2 border-darkblue dark:border-gray-700 hover:bg-indigo-400 bg-lightblue dark:bg-indigo-700 dark:!text-white dark:hover:bg-gray-900"
          onClick={openModal}
        >
          Start a new chat
        </button>
        <Transition appear show={isOpen} as={Fragment}>
          <Dialog
            as="div"
            className="fixed inset-0 z-50 overflow-y-auto"
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
                    Start a chat with others
                  </Dialog.Title>
                  <input
                    className="w-full p-5 text-blue-900 bg-blue-600 rounded-lg outline-none backdrop-filter backdrop-blur-2xl bg-opacity-10 focus-visible:ring-blue-500"
                    placeholder="Search for someone"
                    value={inputValue}
                    onChange={onChange}
                  />

                  <div className="mt-2 h-[400px] overflow-y-scroll">
                    {filteredSuggestions.map(
                      ({ id, data: { name, email, photoURL } }) => (
                        <div
                          key={id}
                          onClick={(e) => {
                            createChat(email);
                            toast.success("Chat created successfully");
                          }}
                        >
                          {email === user.primaryEmailAddress.emailAddress ? (
                            <div></div>
                          ) : (
                            <div className="flex items-center cursor-pointer p-4 break-words bg-lightblue dark:bg-indigo-700 hover:bg-indigo-400 border-b-[1px] border-darkblue dark:border-gray-700 dark:hover:bg-gray-900 mx-2 dark:text-white rounded-xl my-1">
                              <Image
                                width={56}
                                height={56}
                                src={photoURL}
                                alt={name}
                                className="cursor-pointer rounded-full hover:opacity-80"
                              />
                              <div className="flex cursor-pointer break-words flex-col ml-3">
                                <p>{name}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    )}
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                      onClick={closeModal}
                    >
                      I will chat later!
                    </button>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>
        <div className="min-h-screen bg-lightblue dark:bg-indigo-700 ">
          {chatsSnapshot?.docs.map((chat) => (
            <Chat key={chat.id} id={chat.id} users={chat.data().users} />
          ))}
        </div>
      </div>
    </Fade>
  );
};

export default Sidebar;
