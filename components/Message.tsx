import moment from "moment";
import React from "react";
import { MessageType } from "../types/MessageType";
import Linkify from "react-linkify";

type MessageProps = {
  message: MessageType;
  creatorEmail: string;
};

const Message: React.FC<MessageProps> = ({ message, creatorEmail }) => {
  const userLoggedIn = (window as any).Clerk.user.primaryEmailAddress
    .emailAddress;
  const TypeOfMessage = creatorEmail === userLoggedIn ? "Sender" : "Reciever";

  return (
    <div className="min-w-[80px]">
      <p
        style={{ width: "fit-content" }}
        className={`p-4 rounded-lg m-3 min-w-[80px] pb-7 relative text-center break-all text-white ${
          TypeOfMessage === "Sender"
            ? "ml-auto bg-indigo-900 "
            : "bg-blue-900 text-center"
        }`}
      >
        <Linkify>{message.message}</Linkify>
        <p className="text-gray-400 min-w-[80px] p-2 text-xs absolute bottom-0 text-right right-0 mt-3">
          {message.timestamp ? moment(message.timestamp).format("LT") : "..."}
        </p>
      </p>
    </div>
  );
};

export default Message;
