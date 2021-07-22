import React from "react";
import { db } from "../../firebase";
import Sidebar from "../../components/Sidebar";
import ChatScreen from "../../components/ChatScreen";
import Head from "next/head";
import Header from "../../components/Header";

function Chat({ chat, messages, users }) {
  return (
    <div className="flex shadow-md flex-col">
      <Head>
        <title>Chat</title>
      </Head>
      <Header />
      <div className="flex">
        <div className="md:flex hidden">
          <Sidebar users={users} />
        </div>
        <div className="overflow-scroll h-[90vh] hidescrollbar">
          <ChatScreen chat={chat} messages={messages} />
        </div>
      </div>
    </div>
  );
}

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
      timestamp: (messages as any).timestamp.toDate().getTime(),
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
