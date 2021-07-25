import { SignUp } from "@clerk/clerk-react";
import Head from "next/head";
import Header from "../../components/Header";

export default function SignUpPage() {
  return (
    <div className="dark:bg-gray-900 bg-indigo-700">
      <Head>
        <title>Sign Up to ChatCube</title>
      </Head>
      <Header />
      <SignUp path="/sign-up" routing="path" />
    </div>
  );
}
