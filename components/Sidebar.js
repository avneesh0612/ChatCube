import React from "react";
import { db } from "../firebase";
import DonutLargeRoundedIcon from "@material-ui/icons/DonutLargeRounded";
import SearchIcon from "@material-ui/icons/Search";
import Chat from "./Chat";
import { useCollection } from "react-firebase-hooks/firestore";
import * as EmailValidator from "email-validator";
import { useRouter } from "next/router";
import { PersonOutline } from "@material-ui/icons";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";

function Sidebar() {
  const router = useRouter();
  const user = window.Clerk.user;
  const userChatsRef = db
    .collection("chats")
    .where("users", "array-contains", user.primaryEmailAddress.emailAddress);
  const [chatsSnapshot] = useCollection(userChatsRef);

  const createChat = () => {
    const input = prompt(
      "Please enter an email address for the user you wish to chat with"
    );

    if (!input) return;

    if (
      EmailValidator.validate(input) &&
      !chatAlreadyExist(input) &&
      input !== user.primaryEmailAddress.emailAddress
    ) {
      db.collection("chats").add({
        users: [user.primaryEmailAddress.emailAddress, input],
      });
      toast.success("Chat created successfully");
    }
  };

  const chatAlreadyExist = (recipientEmail) =>
    !!chatsSnapshot?.docs.find(
      (chat) =>
        chat.data().users.find((user) => user === recipientEmail)?.length > 0
    );

  return (
    <div className="border-[1px] w-[30vw] border-indigo-500 dark:border-gray-700 h-[90vh] m-10 min-w-[300px] max-w-[400px] overflow-y-scroll hidescrollbar rounded-xl">
      <div className="flex sticky top-0 justify-between items-center p-4 h-20 bg-indigo-700 border-b-[1px] border-indigo-500 dark:border-gray-700 z-10">
        <Image
          width={56}
          height={56}
          className="rounded-full cursor-pointer hover:opacity-80"
          onClick={() => router.push("/details")}
          src={user.profileImageUrl}
        />

        <div>
          <DonutLargeRoundedIcon className="w-20 h-20 rounded-full  text-black cursor-pointer focus:outline-none dark:text-gray-50 hover:bg-indigo-500" />
          <PersonOutline
            onClick={() => router.push("/users")}
            className="w-20 h-20 text-black cursor-pointer rounded-full focus:outline-none dark:text-gray-50 hover:bg-indigo-500"
          />
        </div>
      </div>

      <div className="flex items-center justify-center  bg-indigo-700 p-3 border-b-[1px] border-indigo-500 dark:border-gray-700">
        <div className="flex items-center justify-center p-3 text-black bg-white backdrop-filter backdrop-blur-2xl bg-opacity-10 rounded-xl w-80">
          <SearchIcon className="text-black dark:text-gray-50" />
          <input
            className="flex-1 ml-3 text-black bg-transparent border-none outline-none dark:text-white"
            placeholder="Search in chats"
            type="text"
          />
        </div>
      </div>

      <button
        className="w-full focus:outline-none border-b-[1px] py-2 border-indigo-500 dark:border-gray-700 hover:bg-indigo-400 bg-indigo-700 dark:!text-white"
        onClick={createChat}
      >
        Start a new chat
      </button>

      <div className="min-h-screen bg-indigo-700 ">
        {chatsSnapshot?.docs.map((chat) => (
          <Chat key={chat.id} id={chat.id} users={chat.data().users} />
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
