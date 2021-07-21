import React from "react";
import { db } from "../../firebase";
import Sidebar from "../../components/Sidebar";
import ChatScreen from "../../components/ChatScreen";
import Head from "next/head";
import Header from "../../components/Header";

function Chat({ chat, messages }) {
  return (
    <div className="flex shadow-md flex-col">
      <Head>
        <title>Chat</title>
      </Head>
      <Header />
      <div className="flex">
        <div className="md:flex hidden">
          <Sidebar />
        </div>
        <div className="overflow-scroll h-screen hidescrollbar">
          <ChatScreen chat={chat} messages={messages} />
        </div>
      </div>
    </div>
  );
}

export default Chat;

export async function getServerSideProps(context) {
  const ref = db.collection("chats").doc(context.query.id);

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

  const chatRes = await ref.get();
  const chat = {
    id: chatRes.id,
    ...chatRes.data(),
  };

  return {
    props: {
      messages: JSON.stringify(messages),
      chat: chat,
    },
  };
}
