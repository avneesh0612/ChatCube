import { SignedIn, UserButton, useUser } from "@clerk/clerk-react";
import { Dialog, Transition } from "@headlessui/react";
import { SearchIcon } from "@heroicons/react/outline";
import * as EmailValidator from "email-validator";
import Image from "next/image";
import Link from "next/link";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import Fade from "react-reveal/Fade";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { db } from "../firebase";
import { useKeyPress } from "../hooks/useKeyPress";
import { UsersType } from "../types/UserType";
import Chat from "./Chat";
import ThemeToggler from "./ThemeToggler";

interface ChatType {
  id: string;
  data(): { users: [string] };
}

interface UserFilterType {
  data: {
    name: string;
  };
}

const Sidebar = () => {
  const user = useUser();
  const [users, setUsers] = useState<any>([]);
  const [inputValue, setInputValue] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState<UsersType[]>(
    []
  );

  const slashpress = useKeyPress("/");
  const escpress = useKeyPress("Escape");
  const inputFocusRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    slashpress && inputFocusRef?.current?.focus();
  }, [slashpress]);

  useEffect(() => {
    escpress && inputFocusRef?.current?.blur();
  }, [escpress]);

  useEffect(() => {
    setFilteredSuggestions(users);
  }, [users]);

  useEffect(() => {
    db.collection("users")
      .orderBy("name")
      .onSnapshot(snapshot =>
        setUsers(
          snapshot.docs.map(doc => ({
            id: doc.id,
            data: doc.data(),
          }))
        )
      );
  }, []);

  const userChatsRef = db
    .collection("chats")
    .where("users", "array-contains", user?.primaryEmailAddress?.emailAddress);
  const [chatsSnapshot] = useCollection(userChatsRef);

  const createChat = (input: string | undefined) => {
    if (!input) return;
    if (
      EmailValidator.validate(input) &&
      !chatAlreadyExist(input) &&
      input !== user?.primaryEmailAddress?.emailAddress
    ) {
      db.collection("chats").add({
        users: [user?.primaryEmailAddress?.emailAddress, input],
      });
    }
    setIsOpen(false);
  };

  const chatAlreadyExist = (recipientEmail: string) =>
    !!chatsSnapshot?.docs.find(
      (chat: any) =>
        chat.data().users.find((user: string) => user === recipientEmail)
          ?.length > 0
    );

  const [isOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const userInput = e.currentTarget.value;
    const filteredSuggestions = users.filter(
      (user: UserFilterType) =>
        user?.data?.name?.toLowerCase().indexOf(userInput.toLowerCase()) > -1
    );
    setFilteredSuggestions(filteredSuggestions.slice(0, 10));
    setInputValue(e.currentTarget.value);
  };

  const filterChats = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sidebarChat = document.getElementsByClassName("sidebarChat");

    const inputValLowerCase = e.target.value.toLowerCase();

    function capitalizeFirstLetter(string: string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const inputValCaps = capitalizeFirstLetter(e.target.value);

    Array.from(sidebarChat).forEach(element => {
      const NameHd =
        element.getElementsByClassName("recipientName")[0].textContent;

      if (
        NameHd?.includes(inputValLowerCase) ||
        NameHd?.includes(inputValCaps) ||
        NameHd?.includes(e.target.value.toUpperCase())
      ) {
        element.classList.add("flex");
        element.classList.remove("hidden");
      } else {
        element.classList.add("hidden");
        element.classList.remove("flex");
      }
    });
  };

  return (
    <div className="flex w-[30vw]">
      <ThemeToggler />

      <Fade left>
        <div className="max-h-screen bg-blue-400 dark:bg-white/[8%] backdrop-blur-lg w-[400px] min-h-screen text-black dark:text-white">
          <div className="pt-5 text-center ">
            <Link passHref href="/">
              <a>
                <Image
                  src="https://res.cloudinary.com/dssvrf9oz/image/upload/v1626881694/Aman-removebg-preview_pwjggi.png"
                  alt="chatCube"
                  width={100}
                  height={100}
                  objectFit="contain"
                  className="cursor-pointer"
                />
              </a>
            </Link>
          </div>
          <div className="flex items-center justify-center p-3 border-b-[1px] border-indigo-900">
            <div className="flex items-center justify-center p-3 text-black bg-white/10 backdrop-filter backdrop-blur-2xl rounded-xl w-80">
              <SearchIcon className="w-6 h-6 dark:text-white  text-black" />
              <input
                ref={inputFocusRef}
                className="flex-1 ml-3 text-black placeholder-black  dark:text-white dark:placeholder-white bg-transparent border-none outline-none"
                placeholder="Search in chats"
                type="text"
                onChange={filterChats}
              />
            </div>
          </div>
          <hr className="text-transparent bg-transparent" />

          <div>
            <div className="px-3 pt-5">
              <p className="pb-5 text-sm font-medium tracking-widest uppercase">
                direct messages
              </p>
            </div>
            <div className="w-full max-h-[48vh] overflow-y-scroll hidescrollbar">
              {chatsSnapshot?.docs.map((chat: ChatType) => (
                <Chat key={chat.id} id={chat.id} users={chat.data().users} />
              ))}
            </div>
          </div>

          <div className="flex fixed w-[400px] bottom-0 flex-col justify-between mt-auto">
            <div className="w-full focus:outline-none py-2 px-8">
              <button
                className="bg-blue-700 text-white shadow-lg p-2 text-center font-semibold rounded-sm w-full"
                onClick={openModal}
              >
                Start a new chat
              </button>
            </div>
            <div className="p-4 border-t-[1px] border-indigo-900 flex pl-6 flex-row items-center">
              <SignedIn>
                <UserButton />
              </SignedIn>
              <h1 className="ml-4 font-semibold">{user?.fullName}</h1>
            </div>
          </div>
        </div>
      </Fade>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 backdrop-blur-sm"
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
              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-blue-800 shadow-xl rounded-xl">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-semibold leading-6 text-black dark:text-white"
                >
                  Start a chat with others
                </Dialog.Title>
                <input
                  ref={inputFocusRef}
                  className="w-full p-4 mt-3 text-black dark:text-white placeholder-gray-300 rounded-md shadow-md outline-none bg-white/10 backdrop-blur-lg focus-visible:ring-blue-500"
                  placeholder="Search for someone"
                  value={inputValue}
                  onChange={onChange}
                />

                <div className="h-full mt-2 overflow-y-scroll max-h-[500px] pr-2 pt-5">
                  {filteredSuggestions.map(
                    ({ id, data: { name, email, photoURL } }) => (
                      <div
                        key={id}
                        className="rounded-lg bg-white/10 backdrop-blur-lg"
                        onClick={() => {
                          createChat(email);
                          toast.success("Chat created successfully");
                        }}
                      >
                        {email === user?.primaryEmailAddress?.emailAddress ? (
                          <div></div>
                        ) : (
                          <div className="flex items-center p-4 my-1 text-black dark:text-white break-words cursor-pointer rounded-xl">
                            {photoURL && (
                              <Image
                                width={56}
                                height={56}
                                src={photoURL}
                                alt={name}
                                className="rounded-full cursor-pointer hover:opacity-80"
                              />
                            )}
                            <div className="flex flex-col ml-3 break-words cursor-pointer">
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
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-xl hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
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
    </div>
  );
};

export default Sidebar;
