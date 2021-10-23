import React, { useEffect, useRef } from "react";
import { db } from "../firebase";
import Chat from "./Chat";
import { useCollection } from "react-firebase-hooks/firestore";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import { SearchIcon } from "@heroicons/react/outline";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import * as EmailValidator from "email-validator";
import { toast } from "react-toastify";
import Fade from "react-reveal/Fade";
import { useKeyPress } from "../hooks/useKeyPress";
import Link from "next/link";

const Sidebar = () => {
  const user = window?.Clerk?.user;
  const [users, setUsers] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);

  const slashpress = useKeyPress("/");
  const escpress = useKeyPress("Escape");
  const inputFocusRef = useRef(null);

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

  const createChat = (input) => {
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

  const chatAlreadyExist = (recipientEmail) =>
    !!chatsSnapshot?.docs.find(
      (chat) =>
        chat.data().users.find((user) => user === recipientEmail)?.length > 0
    );

  const [isOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const onChange = (e) => {
    const userInput = e.currentTarget.value;
    const filteredSuggestions = users.filter(
      (user) =>
        user?.data?.name?.toLowerCase().indexOf(userInput.toLowerCase()) > -1
    );
    setFilteredSuggestions(filteredSuggestions.slice(0, 10));
    setInputValue(e.currentTarget.value);
  };

  const filterChats = (e) => {
    let sidebarChat = document.getElementsByClassName("sidebarChat");

    let inputValLowerCase = e.target.value.toLowerCase();

    function capitalizeFirstLetter(string) {
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
    <div className="flex flex-row-reverse h-screen">
      <Fade left>
        <div className="overflow-y-scroll hidescrollbar text-white">
          <div className="bg-darkblue text-center pt-5">
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
          <div className="bg-darkblue flex items-center justify-center p-3 border-b-[1px] border-darkblue">
            <div className="flex items-center justify-center p-3 text-black bg-white backdrop-filter backdrop-blur-2xl bg-opacity-10 rounded-xl w-80">
              <SearchIcon className="text-white dark:text-gray-50 w-6 h-6" />
              <input
                ref={inputFocusRef}
                className="flex-1 ml-3 placeholder-white text-white bg-transparent border-none outline-none"
                placeholder="Search in chats"
                type="text"
                onChange={filterChats}
              />
            </div>
          </div>
          <hr className="bg-transparent text-transparent" />
          <Transition appear show={isOpen} as={Fragment}>
            <Dialog
              as="div"
              className=" bg-black backdrop-blur-sm bg-opacity-50 fixed inset-0 z-50 overflow-y-auto"
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
                      className="w-full placeholder-gray-300 mt-3 p-4 rounded-md shadow-md outline-none focus-visible:ring-blue-500"
                      placeholder="Search for someone"
                      value={inputValue}
                      onChange={onChange}
                    />

                    <div className="mt-2 h-[400px] overflow-y-scroll">
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
                              <div className="flex items-center cursor-pointer p-4 break-words bg-darkblue text-white rounded-xl my-1">
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
            <div className="px-3 bg-darkblue pt-5">
              <p className="uppercase tracking-widest text-sm font-thin pb-5">
                direct messages
              </p>
            </div>
            <div className="bg-darkblue">
              {chatsSnapshot?.docs.map((chat) => (
                <Chat key={chat.id} id={chat.id} users={chat.data().users} />
              ))}
            </div>
          </div>

          <div className="bg-darkblue w-full focus:outline-none border-b-[1px] py-2 px-8 border-darkblue pt-36">
            <button
              className="bg-[#1F1E5E] shadow-lg p-2 text-center font-semibold rounded-sm w-full"
              onClick={openModal}
            >
              Start a new chat
            </button>
          </div>
          <div className="bg-darkblue p-4 border-t-[1px] border-indigo-500 flex pl-6 flex-row gap-4 items-center">
            <div>
              {user?.profileImageUrl && user?.firstName && (
                <Image
                  width={50}
                  height={50}
                  objectFit="cover"
                  className="rounded-full cursor-pointer hover:animate-pulse"
                  onClick={() => router.push("/user")}
                  src={user?.profileImageUrl}
                  alt={user?.firstName}
                />
              )}{" "}
            </div>{" "}
            <h1 className="font-semibold">
              {user?.data.first_name} {user?.data.last_name}
            </h1>
          </div>
        </div>
        <div className="flex flex-col-reverse p-5">
          <div class="w-8 h-8 hover:w-9 hover:h-9 duration-75 delay-75 cursor-pointer flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              ></path>
            </svg>
          </div>
        </div>
      </Fade>
    </div>
  );
};

export default Sidebar;
