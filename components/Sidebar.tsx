import { SignedIn, UserButton } from "@clerk/clerk-react";
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
import Chat from "./Chat";
import ThemeToggler from "./ThemeToggler";

interface UserType {
  id: string;
  username: string;
  primaryEmailAddress: {
    emailAddress: string;
  };
  firstName: string;
  lastName: string;
  fullName: string;
  name?: string;
  email?: string;
  photoURL?: string;
}

interface UsersType {
  id: string;
  data: UserType;
}

const Sidebar = () => {
  const user: UserType = window?.Clerk?.user as UserType;
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
    .where("users", "array-contains", user?.primaryEmailAddress?.emailAddress);
  const [chatsSnapshot] = useCollection(userChatsRef);

  const createChat = (input: string | undefined) => {
    console.log(input);
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
      (user: any) =>
        user?.data?.name?.toLowerCase().indexOf(userInput.toLowerCase()) > -1
    );
    setFilteredSuggestions(filteredSuggestions.slice(0, 10));
    setInputValue(e.currentTarget.value);
  };

  const filterChats = (e: React.ChangeEvent<HTMLInputElement>) => {
    let sidebarChat = document.getElementsByClassName("sidebarChat");

    let inputValLowerCase = e.target.value.toLowerCase();

    function capitalizeFirstLetter(string: string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }

    let inputValCaps = capitalizeFirstLetter(e.target.value);

    Array.from(sidebarChat).forEach((element) => {
      let NameHd =
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
    <div className="flex">
      <ThemeToggler />

      <Fade left>
        <div className="max-h-screen bg-bgprimary w-[400px] min-h-screen text-white">
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
          <div className="flex items-center justify-center p-3 border-b-[1px] border-darkblue ">
            <div className="flex items-center justify-center p-3 text-black bg-white/10 backdrop-filter backdrop-blur-2xl rounded-xl w-80">
              <SearchIcon className="w-6 h-6 text-white dark:text-gray-50" />
              <input
                ref={inputFocusRef}
                className="flex-1 ml-3 text-white placeholder-white bg-transparent border-none outline-none"
                placeholder="Search in chats"
                type="text"
                onChange={filterChats}
              />
            </div>
          </div>
          <hr className="text-transparent bg-transparent" />
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
                  <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-xl">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-semibold leading-6 text-gray-900"
                    >
                      Start a chat with others
                    </Dialog.Title>
                    <input
                      ref={inputFocusRef}
                      className="w-full p-4 mt-3 placeholder-gray-300 rounded-md shadow-md outline-none focus-visible:ring-blue-500"
                      placeholder="Search for someone"
                      value={inputValue}
                      onChange={onChange}
                    />

                    <div className="h-full mt-2 overflow-y-scroll hidescrollbar">
                      {filteredSuggestions.map(
                        ({ id, data: { name, email, photoURL } }) => (
                          <div
                            key={id}
                            onClick={() => {
                              createChat(email);
                              toast.success("Chat created successfully");
                            }}
                          >
                            {email ===
                            user?.primaryEmailAddress?.emailAddress ? (
                              <div></div>
                            ) : (
                              <div className="flex items-center p-4 my-1 text-white break-words cursor-pointer rounded-xl">
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
          <div>
            <div className="px-3 pt-5">
              <p className="pb-5 text-sm font-thin tracking-widest uppercase">
                direct messages
              </p>
            </div>
            <div className="w-full">
              {chatsSnapshot?.docs.map((chat: any) => (
                <Chat key={chat.id} id={chat.id} users={chat.data().users} />
              ))}
            </div>
          </div>

          <div className="flex fixed w-[400px] bottom-0 flex-col justify-between mt-auto">
            <div className="w-full focus:outline-none border-b-[1px] py-2 px-8 border-darkblue">
              <button
                className="bg-[#1F1E5E] shadow-lg p-2 text-center font-semibold rounded-sm w-full"
                onClick={openModal}
              >
                Start a new chat
              </button>
            </div>
            <div className="p-4 border-t-[1px] border-indigo-500 flex pl-6 flex-row gap-4 items-center">
              <SignedIn>
                <UserButton />
              </SignedIn>
              <h1 className="font-semibold">{user?.fullName}</h1>
            </div>
          </div>
        </div>
      </Fade>
    </div>
  );
};

export default Sidebar;
