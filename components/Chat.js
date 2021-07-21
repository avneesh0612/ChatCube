import { useRouter } from "next/router";
import React, { useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../firebase";
import getRecipientEmail from "../utils/getRecipientEmail";
import Image from "next/image";

function Chat({ id, users }) {
  const router = useRouter();
  const user = window.Clerk.user;
  const [recipientSnapshot] = useCollection(
    db.collection("users").where("email", "==", getRecipientEmail(users, user))
  );

  const enterChat = () => {
    router.push(`/chat/${id}`);
  };

  const recipient = recipientSnapshot?.docs?.[0]?.data();
  const recipientEmail = getRecipientEmail(users, user);
  console.log(recipient);

  return (
    <div
      className="flex items-center cursor-pointer p-4 break-words dark:bg-bgdarkSecondary bg-indigo-300 hover:bg-indigo-400 border-b-[1px] border-indigo-500 dark:border-gray-700 dark:hover:bg-gray-900 dark:text-white"
      onClick={enterChat}
    >
      {recipient ? (
        <Image
          width={50}
          height={50}
          className="m-1 mr-4 z-0 rounded-full"
          src={recipient?.photoURL}
        />
      ) : (
        <p className="m-1 mr-4 z-0 w-5 h-5 rounded-full bg-gray-500 text-black">
          {recipientEmail[0]}
        </p>
      )}
      <div className="ml-2">
        {recipient?.userName ? (
          <p>{recipient?.userName}</p>
        ) : (
          <p>{recipient?.name}</p>
        )}
      </div>
    </div>
  );
}

export default Chat;
