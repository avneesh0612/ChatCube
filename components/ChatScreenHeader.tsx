import { ArrowLeftIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";
import Image from "next/image";
import TimeAgo from "timeago-react";
import React from "react";

interface Props {
  recipient: {
    name: string;
    photoURL: string;
    firstName: string;
    lastSeen: {
      toDate: () => Date;
    };
  };
  recipientEmail: string | undefined;
  recipientSnapshot: any;
}

const ChatScreenHeader: React.FC<Props> = ({
  recipient,
  recipientEmail,
  recipientSnapshot,
}) => {
  const router = useRouter();
  return (
    <div className="sticky top-0 z-30 flex items-center h-20 p-4">
      <ArrowLeftIcon
        onClick={() => router.push("/")}
        className="w-6 h-6 mr-2 cursor-pointer md:!hidden focus:outline-none text-gray-50"
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
            Last active: {""}
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
  );
};

export default ChatScreenHeader;
