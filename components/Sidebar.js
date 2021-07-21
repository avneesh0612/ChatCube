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
      <div className="flex sticky top-0 justify-between items-center p-4 h-20 dark:bg-bgdarkSecondary bg-indigo-300 border-b-[1px] border-indigo-500 dark:border-gray-700 z-10">
        <Image
          width={56}
          height={56}
          className="cursor-pointer hover:opacity-80 rounded-full"
          onClick={() => router.push("/details")}
          src={user.profileImageUrl}
        />

        <div>
          <DonutLargeRoundedIcon className="text-black focus:outline-none  dark:text-gray-50" />
          <PersonOutline
            onClick={() => router.push("/users")}
            className="text-black focus:outline-none dark:text-gray-50"
          />
        </div>
      </div>

      <div className="flex items-center justify-center dark:bg-bgdarkSecondary bg-indigo-300 p-3 border-b-[1px] border-indigo-500 dark:border-gray-700">
        <div className="flex items-center justify-center backdrop-filter backdrop-blur-2xl bg-white bg-opacity-10 text-black rounded-xl p-3 w-80">
          <SearchIcon className="text-black dark:text-gray-50" />
          <input
            className="outline-none border-none text-black dark:text-white flex-1 ml-3 bg-transparent"
            placeholder="Search in chats"
            type="text"
          />
        </div>
      </div>

      <button
        className="w-full focus:outline-none border-b-[1px] py-2 border-indigo-500 dark:border-gray-700 hover:bg-indigo-400 dark:!bg-bgdarkSecondary bg-indigo-300 dark:!text-white"
        onClick={createChat}
      >
        Start a new chat
      </button>

      <div className="dark:bg-bgdarkSecondary bg-indigo-300  min-h-screen">
        {chatsSnapshot?.docs.map((chat) => (
          <Chat key={chat.id} id={chat.id} users={chat.data().users} />
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
