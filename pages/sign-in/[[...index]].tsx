import { NextSeo } from "next-seo";
import { SignIn } from "@clerk/clerk-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function SignInPage() {
  return (
    <div className="dark:bg-gray-900 bg-indigo-700">
      <NextSeo title="Sign in to ChatCube" />

      <Header />
      <SignIn path="/sign-in" routing="path" />
      <Footer />
    </div>
  );
}