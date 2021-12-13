import { useUser } from "@clerk/clerk-react";
import {
  EmojiHappyIcon,
  MicrophoneIcon,
  PaperAirplaneIcon,
  PaperClipIcon,
} from "@heroicons/react/outline";
import { Picker } from "emoji-mart";
import "emoji-mart/css/emoji-mart.css";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { NextSeo } from "next-seo";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { toast } from "react-toastify";
import { db, storage } from "../firebase";
import useComponentVisible from "../hooks/useComponentVisible";
import { MessageType } from "../types/MessageType";
import getRecipientEmail from "../utils/getRecipientEmail";
import ChatScreenHeader from "./ChatScreenHeader";
import Message from "./Message";

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface messageType {
  data(): import("../types/MessageType").MessageType;
  id: string;
}

interface Props {
  chat: {
    id: string;
    users: [string];
  };
  messages: string;
}

const ChatScreen: React.FC<Props> = ({ chat, messages }) => {
  const user = useUser();
  const router = useRouter();
  const endOfMessagesRef = useRef<HTMLInputElement>(null);
  const [input, setInput] = useState("");
  const focusRef = useRef<HTMLInputElement>(null);
  const [imageToPost, setImageToPost] = useState(null);
  const { ref, isComponentVisible, setIsComponentVisible } =
    useComponentVisible();
  const [hearing, setHearing] = useState(false);

  const routerId = router.query.id as string;

  const SpeechRecognition =
    (window as Window)?.SpeechRecognition ||
    (window as Window)?.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  let finalTranscript = "";
  recognition.interimResults = true;

  const [messagesSnapshot] = useCollection(
    db
      .collection("chats")
      .doc(routerId)
      .collection("messages")
      .orderBy("timestamp", "asc")
  );
  const userLoggedIn = user.primaryEmailAddress?.emailAddress;

  const [recipientSnapshot] = useCollection(
    db
      .collection("users")
      .where("email", "==", getRecipientEmail(chat.users, userLoggedIn))
  );
  const filepickerRef = useRef<HTMLInputElement>(null);

  const recipient = recipientSnapshot?.docs?.[0]?.data();
  const addEmoji = (e: any) => {
    const sym = e.unified.split("-");
    const codesArray: any[] = [];
    sym.forEach((el: any) => codesArray.push("0x" + el));
    const emoji = String.fromCodePoint(...codesArray);
    setInput(input + emoji);
    setIsComponentVisible(false);
    focusRef?.current?.focus();
  };

  const showMessages = () => {
    if (messagesSnapshot) {
      return messagesSnapshot.docs.map((message: messageType) => (
        <div key={message.id}>
          {console.log(message.data())}
          {message.data().image ? (
            <div
              className={`
              w-[340px] h-full flex p-2
              rounded-xl justify-center items-center
               ${
                 message.data().user === userLoggedIn
                   ? "ml-auto bg-indigo-900"
                   : "bg-blue-900"
               }
              `}
            >
              <div className="relative w-80 h-80 rounded-xl">
                <Image
                  objectFit="contain"
                  layout="fill"
                  alt={message.data().user}
                  className="object-contain rounded-xl"
                  src={message?.data()?.image}
                />
              </div>
            </div>
          ) : (
            <></>
          )}
          <Message
            key={message?.id}
            creatorEmail={message.data().user}
            message={{
              ...message.data(),
              timestamp: message.data().timestamp?.toDate().getTime(),
            }}
            id={message.id}
          />
        </div>
      ));
    } else {
      return JSON.parse(messages).map((message: MessageType) => (
        <Message
          key={message.id}
          creatorEmail={message.user}
          message={message}
          id={message.id}
        />
      ));
    }
  };

  const textToSpeech = () => {
    function onResult(event: { resultIndex: number; results: any }) {
      let interTrimTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
          setInput(finalTranscript);
        } else {
          interTrimTranscript += event.results[i][0].transcript;
          setInput(interTrimTranscript);
        }
      }
    }

    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      // speech recognition API supported

      recognition.start();
      setInput("");

      recognition.addEventListener("start", () => {
        setHearing(true);
      });

      recognition.addEventListener("result", onResult);

      recognition.addEventListener("end", () => {
        setHearing(false);
        focusRef?.current?.focus();
      });

      recognition.addEventListener("error", function (event: { error: any }) {
        setHearing(false);
        alert(event.error);
      });
    } else {
      alert("Your browser does not support speech recognition");
    }
  };

  const ScrollToBottom = () => {
    endOfMessagesRef?.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const sendMessage = (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (!input || input[0] === " ") return toast.error("Please add a text");

    db.collection("users").doc(user.primaryEmailAddress?.emailAddress).set(
      {
        lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    db.collection("chats")
      .doc(routerId)
      .collection("messages")
      .add({
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        message: input,
        user: user?.primaryEmailAddress?.emailAddress,
        photoURL: user?.profileImageUrl,
        edited: false,
      })
      .then(doc => {
        if (imageToPost) {
          const uploadTask = storage
            .ref(`images/${doc.id}`)
            .putString(imageToPost, "data_url");

          removeImage();

          uploadTask.on(
            "state_changed",
            null,
            error => {
              toast.error(error);
            },
            () => {
              storage
                .ref("images")
                .child(doc.id)
                .getDownloadURL()
                .then(url => {
                  db.collection("chats")
                    .doc(routerId)
                    .collection("messages")
                    .doc(doc.id)
                    .set(
                      {
                        image: url,
                      },
                      { merge: true }
                    );
                });
            }
          );
        }
      });

    setInput("");

    ScrollToBottom();
  };

  const addImageToPost = (e: any) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }

    reader.onload = (readerEvent: any) => {
      setImageToPost(readerEvent.target.result);
    };
  };

  const removeImage = () => {
    setImageToPost(null);
  };

  useEffect(() => {
    ScrollToBottom();
  });

  const recipientEmail = getRecipientEmail(
    chat.users,
    user.primaryEmailAddress?.emailAddress
  );

  return (
    <div className="flex flex-col h-screen w-[70vw]">
      {recipient?.name ? (
        <NextSeo title={`Chat with ${recipient?.name}`} />
      ) : (
        <NextSeo title={`Chat with ${recipient?.firstName}`} />
      )}
      <ChatScreenHeader
        recipient={recipient}
        recipientEmail={recipientEmail}
        recipientSnapshot={recipientSnapshot}
      />

      <div className="p-8 pb-24 max-h-[97vh] w-full border-t-[1px] border-indigo-900 overflow-y-scroll overflow-x-hidden hidescrollbar">
        {showMessages()}
        <div ref={endOfMessagesRef} />
      </div>

      <form className="flex items-center p-4 w-full dark:bg-blue-800 bg-blue-300 fixed bottom-0 rounded-b-xl border-t-[1px] border-indigo-900 z-50">
        <div
          onClick={() => filepickerRef?.current?.click()}
          className="inputIcon"
        >
          <PaperClipIcon className="w-6 h-6 mr-2 text-gray-100 cursor-pointer" />
          <input
            onChange={addImageToPost}
            ref={filepickerRef}
            type="file"
            hidden
            accept="image/*"
          />
        </div>
        <EmojiHappyIcon
          ref={ref}
          onClick={() => setIsComponentVisible(!isComponentVisible)}
          className="mr-2 text-gray-100 cursor-pointer h-7 w-7 md:h-6 md:w-6"
        />
        {isComponentVisible && (
          <span ref={ref} className="absolute z-50 mb-[500px]">
            <Picker onSelect={addEmoji} />
          </span>
        )}
        <MicrophoneIcon
          onClick={textToSpeech}
          className={`${
            hearing && "text-red-500"
          }     text-white h-7 w-7 md:h-6 md:w-6 cursor-pointer`}
        />
        <input
          className="p-4 w-[60%] mx-2 ml-2 text-white bg-white border-none rounded-lg outline-none md:mx-4 backdrop-filter backdrop-blur-2xl bg-opacity-10"
          value={input}
          onChange={e => setInput(e.target.value)}
          ref={focusRef}
          type="text"
        />

        <button
          type="submit"
          onClick={sendMessage}
          disabled={input.trim().length === 0}
        >
          <PaperAirplaneIcon
            className={`${
              input.trim().length === 0
                ? "text-gray-500 cursor-not-allowed"
                : "text-gray-100 cursor-pointer"
            } rotate-90 h-7 w-7 md:h-6 md:w-6 mr-2`}
          />
        </button>
        {imageToPost && (
          <div
            onClick={removeImage}
            className="flex flex-col transition duration-150 transform cursor-pointer filter hover:brightness-110 hover:scale-105"
          >
            <div className="relative object-contain w-10 h-10">
              <Image
                objectFit="contain"
                layout="fill"
                alt={recipient?.name}
                className="object-contain h-10 "
                src={imageToPost}
              />
            </div>
            <p className="text-xs text-center text-red-500">Remove</p>
          </div>
        )}
      </form>
    </div>
  );
};

export default ChatScreen;
