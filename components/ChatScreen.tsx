import { NextSeo } from "next-seo";
import {
  ArrowLeftIcon,
  EmojiHappyIcon,
  MicrophoneIcon,
  PaperAirplaneIcon,
  PaperClipIcon,
} from "@heroicons/react/outline";
import { Picker } from "emoji-mart";
import "emoji-mart/css/emoji-mart.css";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import Fade from "react-reveal/Fade";
import { toast } from "react-toastify";
import TimeAgo from "timeago-react";
import { db, storage } from "../firebase";
import useComponentVisible from "../hooks/useComponentVisible";
import getRecipientEmail from "../utils/getRecipientEmail";
import Message from "./Message";
import { UserType } from "../types/UserType";

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const ChatScreen: React.FC<any> = ({ chat, messages }) => {
  const user = window?.Clerk?.user as UserType;
  const router = useRouter();
  const endOfMessagesRef = useRef<any>(null);
  const [input, setInput] = useState("");
  const focusRef = useRef<HTMLInputElement>(null);
  const [imageToPost, setImageToPost] = useState(null);
  const { ref, isComponentVisible, setIsComponentVisible } =
    useComponentVisible();
  const [hearing, setHearing] = useState(false);

  const routerId = router.query.id as string;

  const SpeechRecognition =
    window?.SpeechRecognition || window?.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  var final_transcript = "";
  recognition.interimResults = true;

  const [messagesSnapshot] = useCollection(
    db
      .collection("chats")
      .doc(routerId)
      .collection("messages")
      .orderBy("timestamp", "asc")
  );
  const userLoggedIn = window?.Clerk?.user?.primaryEmailAddress?.emailAddress;

  const [recipientSnapshot] = useCollection(
    db
      .collection("users")
      .where("email", "==", getRecipientEmail(chat.users, userLoggedIn))
  );
  const filepickerRef = useRef<any>(null);

  const recipient = recipientSnapshot?.docs?.[0]?.data();
  const addEmoji = (e: any) => {
    let sym = e.unified.split("-");
    let codesArray: any[] = [];
    sym.forEach((el: any) => codesArray.push("0x" + el));
    let emoji = String.fromCodePoint(...codesArray);
    setInput(input + emoji);
    setIsComponentVisible(false);
    focusRef?.current?.focus();
  };

  const showMessages = () => {
    if (messagesSnapshot) {
      return messagesSnapshot.docs.map((message: any) => (
        <div key={message.id}>
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
                  className="object-contain w-80 rounded-xl"
                  src={message.data().image}
                />
              </div>
            </div>
          ) : (
            <></>
          )}
          <Message
            key={message.id}
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
      return JSON.parse(messages).map((message: any) => (
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
    function onResult(event: { resultIndex: any; results: string | any[] }) {
      var interim_transcript = "";
      for (var i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final_transcript += event.results[i][0].transcript;
          setInput(final_transcript);
        } else {
          interim_transcript += event.results[i][0].transcript;
          setInput(interim_transcript);
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

    db.collection("users")
      .doc(window?.Clerk?.user?.primaryEmailAddress?.emailAddress)
      .set(
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
      .then((doc) => {
        if (imageToPost) {
          const uploadTask = storage
            .ref(`images/${doc.id}`)
            .putString(imageToPost, "data_url");

          removeImage();

          uploadTask.on(
            "state_changed",
            null,
            (error) => {
              toast.error(error);
            },
            () => {
              storage
                .ref("images")
                .child(doc.id)
                .getDownloadURL()
                .then((url) => {
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

  const recipientEmail = getRecipientEmail(chat.users, user);

  return (
    <Fade right>
      {recipient?.name ? (
        <NextSeo title={`Chat with ${recipient?.name}`} />
      ) : (
        <NextSeo title={`Chat with ${recipient?.firstName}`} />
      )}
      <div className="flex flex-col bg-[#3736AA] h-screen">
        <div className="sticky rounded-t-xl bg-[#3736AA] z-30 top-0 flex p-4 h-20 items-center">
          <ArrowLeftIcon
            onClick={() => router.push("/")}
            className="md:!hidden focus:outline-none cursor-pointer h-6 w-6 text-gray-50 mr-2"
          />
          {recipient ? (
            <Image
              width={56}
              height={56}
              className="z-0 m-1 mr-4 rounded-full"
              alt={recipient?.name}
              src={recipient?.photoURL}
            />
          ) : (
            <p className="z-0 flex items-center justify-center text-xl text-center capitalize bg-gray-300 rounded-full w-14 h-14">
              {recipientEmail && recipientEmail[0]}
            </p>
          )}

          <div className="flex-1 ml-4">
            <h3 className="mb-1 text-white">
              {recipient?.name ? (
                <p>{recipient?.name}</p>
              ) : (
                <p>{recipient?.firstName}</p>
              )}
            </h3>
            {recipientSnapshot ? (
              <p className="text-sm text-gray-100">
                Last active:{` `}
                {recipient?.lastSeen?.toDate() ? (
                  <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
                ) : (
                  "Unavailable"
                )}
              </p>
            ) : (
              <p className="mb-1 text-white">Loading Last active...</p>
            )}
          </div>
        </div>

        <div className="p-8 pb-20 h-full max-w-full border-t-[1px] border-indigo-500 overflow-y-scroll overflow-x-hidden hidescrollbar">
          {showMessages()}
          <div ref={endOfMessagesRef} />
        </div>

        <form className="flex items-center p-3 fixed bottom-0 rounded-b-xl border-t-[1px] border-indigo-500 bg-[#3736AA] z-50">
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
            className="w-full p-4 mx-2 ml-2 text-white bg-white border-none rounded-lg outline-none md:mx-4 backdrop-filter backdrop-blur-2xl bg-opacity-10"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            ref={focusRef}
            type="text"
          />

          <button
            type="submit"
            onClick={sendMessage}
            disabled={!input || input[0] === " "}
          >
            <PaperAirplaneIcon
              className={`${
                !input || input[0] === " "
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
    </Fade>
  );
};

export default ChatScreen;
