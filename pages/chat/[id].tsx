import { useUser } from "@clerk/clerk-react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import ChatScreen from "../../components/ChatScreen";
import Sidebar from "../../components/Sidebar";
import { db } from "../../firebase";
import { UserType } from "../../types/UserType";

interface ChatProps {
  chat: {
    users: [string];
    id: string;
  };
  messages: string;
  users: [UserType];
}

const Chat: React.FC<ChatProps> = ({ chat, messages, users }) => {
  const router = useRouter();
  const user = useUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress as string;
  useEffect(() => {
    if (chat.users.includes(userEmail) === false) {
      router.push("/");
    }
  });
  return (
    <div className="flex w-screen h-screen pr-5 shadow-md">
      <div className="hidden w-[30vw] md:flex">
        <Sidebar />
      </div>
      <div className="w-[70vw] hidescrollbar">
        <ChatScreen chat={chat} messages={messages} />
      </div>
    </div>
  );
};

export default Chat;

export async function getServerSideProps(context: any) {
  const ref = db.collection("chats").doc(context.query.id);
  const allusers = await db.collection("users").get();

  const messagesRes = await ref
    .collection("messages")
    .orderBy("timestamp", "asc")
    .get();

  const messages = messagesRes.docs
    .map(doc => ({
      id: doc.id,
      ...doc.data(),
    }))
    .map((messages: any) => ({
      ...messages,
      timestamp: messages.timestamp.toDate().getTime(),
    }));

  const users = allusers.docs.map(user => ({
    id: user.id,
    ...user.data(),
    lastSeen: null,
  }));

  const chatRes = await ref.get();
  const chat = {
    id: chatRes.id,
    ...chatRes.data(),
  };

  return {
    props: {
      messages: JSON.stringify(messages),
      chat: chat,
      users,
    },
  };
}
