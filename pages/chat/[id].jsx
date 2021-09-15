import { useRouter } from "next/router";
import React, { useEffect } from "react";
import ChatScreen from "../../components/ChatScreen";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import { db } from "../../firebase";

// interface ChatProps {
//   chat: {
//     users: [string];
//     id: string;
//   };
//   messages: string;
//   users: [UserType];
// }

const Chat = ({ chat, messages, users }) => {
  const router = useRouter();
  useEffect(() => {
    if (
      chat.users.includes(
        window?.Clerk?.user?.primaryEmailAddress?.emailAddress
      ) === false
    ) {
      router.push("/");
    }
  });
  return (
    <div className="flex shadow-md flex-col h-screen">
      <Header />
      <div className="flex">
        <div className="md:flex hidden">
          <Sidebar users={users} />
        </div>
        <div className="overflow-scroll hidescrollbar">
          <ChatScreen chat={chat} messages={messages} />
        </div>
      </div>
    </div>
  );
};

export default Chat;

export async function getServerSideProps(context) {
  const ref = db.collection("chats").doc(context.query.id);
  const allusers = await db.collection("users").get();

  const messagesRes = await ref
    .collection("messages")
    .orderBy("timestamp", "asc")
    .get();

  const messages = messagesRes.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    .map((messages) => ({
      ...messages,
      timestamp: messages.timestamp.toDate().getTime(),
    }));

  const users = allusers.docs.map((user) => ({
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
