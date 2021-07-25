import { UserProfile } from "@clerk/clerk-react";
import Head from "next/head";
import Header from "../../components/Header";

export default function UserProfilePage() {
  return (
    <div className="dark:bg-gray-900 bg-indigo-700">
      <Head>
        <title>Your profile</title>
      </Head>
      <Header />
      <UserProfile path="/user" routing="path" />;
    </div>
  );
}
