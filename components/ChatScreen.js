import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { db, storage } from "../firebase";
import getRecipientEmail from "../utils/getRecipientEmail";
import firebase from "firebase";
import TimeAgo from "timeago-react";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import MicIcon from "@material-ui/icons/Mic";
import Message from "./Message";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import Image from "next/image";

function ChatScreen({ chat, messages }) {
  const user = window.Clerk.user;
  const router = useRouter();
  const endOfMessagesRef = useRef(null);
  const inputRef = useRef(null);
  const [imageToPost, setImageToPost] = useState(null);
  const [messagesSnapshot] = useCollection(
    db
      .collection("chats")
      .doc(router.query.id)
      .collection("messages")
      .orderBy("timestamp", "asc")
  );
  const userLoggedIn = window.Clerk.user.primaryEmailAddress.emailAddress;

  const [recipientSnapshot] = useCollection(
    db
      .collection("users")
      .where("email", "==", getRecipientEmail(chat.users, user))
  );
  const filepickerRef = useRef(null);

  const recipient = recipientSnapshot?.docs?.[0]?.data();

  const showMessages = () => {
    if (messagesSnapshot) {
      return messagesSnapshot.docs.map((message) => (
        <div key={message.id}>
          {message.data().image ? (
            <div
              className={`
              w-[340px] h-[340px] flex
               object-contain rounded-xl justify-center items-center
               ${
                 message.data().user === userLoggedIn
                   ? "ml-auto bg-indigo-900"
                   : "bg-blue-900"
               }
              `}
            >
              <img
                className="w-80 h-80 rounded-xl"
                src={message.data().image}
              />
            </div>
          ) : (
            <></>
          )}
          <Message
            key={message.id}
            user={message.data().user}
            message={{
              ...message.data(),
              timestamp: message.data().timestamp?.toDate().getTime(),
            }}
          />
        </div>
      ));
    } else {
      return JSON.parse(messages).map((message) => (
        <Message key={message.id} user={message.user} message={message} />
      ));
    }
  };

  const ScrollToBottom = () => {
    endOfMessagesRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const sendMessage = (e) => {
    e.preventDefault();

    if (!inputRef.current.value) return;

    db.collection("users").doc(user.id).set(
      {
        lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    db.collection("chats").doc(router.query.id).add(
      {
        lastMessage: firebase.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    db.collection("chats")
      .doc(router.query.id)
      .collection("messages")
      .add({
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        message: inputRef.current.value,
        user: user.primaryEmailAddress.emailAddress,
        photoURL: user.profileImageUrl,
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
              console.log(error);
            },
            () => {
              storage
                .ref("images")
                .child(doc.id)
                .getDownloadURL()
                .then((url) => {
                  db.collection("chats")
                    .doc(router.query.id)
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

    inputRef.current.value = "";

    ScrollToBottom();
  };

  const addImageToPost = (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }

    reader.onload = (readerEvent) => {
      setImageToPost(readerEvent.target.result);
    };
  };

  const removeImage = () => {
    setImageToPost(null);
  };

  const recipientEmail = getRecipientEmail(chat.users, user);
  return (
    <div className="flex flex-col min-w-[60vw] h-[90vh] m-10 rounded-xl  bg-indigo-300">
      <div className="sticky rounded-t-xl  bg-indigo-300 z-50 top-0 flex p-4 h-20 items-center border-[1px] border-indigo-500 dark:border-gray-700">
        <ArrowBackIcon
          onClick={() => router.push("/")}
          className="md:!hidden focus:outline-none cursor-pointer text-gray-50"
        />
        {recipient ? (
          <Image
            width={56}
            height={56}
            className="m-1 mr-4 z-0 rounded-full"
            src={recipient?.photoURL}
          />
        ) : (
          <p className="text-center flex items-center justify-center z-0 w-14 h-14 rounded-full bg-gray-300 text-black text-xl capitalize">
            {recipientEmail[0]}
          </p>
        )}

        <div className="ml-4 flex-1">
          <h3 className="mb-1 dark:text-white">
            {recipient?.userName ? (
              <p>{recipient?.userName}</p>
            ) : (
              <p>{recipient?.name}</p>
            )}
          </h3>
          {recipientSnapshot ? (
            <p className="text-gray-500 text-sm">
              Last active:{` `}
              {recipient?.lastSeen?.toDate() ? (
                <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
              ) : (
                "Unavailable"
              )}
            </p>
          ) : (
            <p className="mb-1 dark:text-white">Loading Last active...</p>
          )}
        </div>
      </div>

      <div className="p-8 h-[66vh] border-[1px] border-indigo-500 overflow-scroll hidescrollbar">
        {showMessages()}
        <div className="" ref={endOfMessagesRef} />
      </div>

      <form className="flex items-center p-3 sticky rounded-b-xl border-[1px] border-indigo-500 dark:border-gray-700  bg-indigo-300 z-50">
        <div
          onClick={() => filepickerRef.current.click()}
          className="inputIcon"
        >
          <InsertEmoticonIcon className="text-black dark:text-gray-100" />
          <input
            onChange={addImageToPost}
            ref={filepickerRef}
            type="file"
            hidden
          />
        </div>
        <input
          className="border-none outline-none rounded-lg backdrop-filter backdrop-blur-2xl bg-white bg-opacity-10 p-5 mx-4 w-full dark:text-white"
          ref={inputRef}
          type="text"
        />

        <button hidden type="submit" onClick={sendMessage}>
          Send Message
        </button>
        <MicIcon className="text-black dark:text-gray-100" />
        {imageToPost && (
          <div
            onClick={removeImage}
            className="flex flex-col filter hover:brightness-110 transition duration-150 transform hover:scale-105 cursor-pointer"
          >
            <img className="h-10 object-contain " src={imageToPost} alt="" />
            <p className="text-xs text-red-500 text-center">Remove</p>
          </div>
        )}
      </form>
    </div>
  );
}

export default ChatScreen;
