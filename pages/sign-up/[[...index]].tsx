import SEO from "@bradgarropy/next-seo";
import { SignUp } from "@clerk/clerk-react";
import Head from "next/head";
import Header from "../../components/Header";

export default function SignUpPage() {
  return (
    <div className="dark:bg-gray-900 bg-indigo-700">
      <SEO title="Sign up to ChatCube" />
      <Header />
      <SignUp path="/sign-up" routing="path" />
    </div>
  );
}
