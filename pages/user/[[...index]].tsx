import { NextSeo } from "next-seo";
import { UserProfile } from "@clerk/clerk-react";
import Header from "../../components/Header";
import type { NextPage } from "next";

const UserProfilePage: NextPage = () => {
  return (
    <div className="bg-indigo-700">
      <NextSeo title="Your profile" />
      <Header />
      <UserProfile path="/user" routing="path" />;
    </div>
  );
}

export default UserProfilePage
