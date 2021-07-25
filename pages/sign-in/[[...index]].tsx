import { SignIn } from "@clerk/clerk-react";
import Head from "next/head";
import Header from "../../components/Header";

export default function SignInPage() {
  return (
    <div className="dark:bg-gray-900 bg-indigo-700">
      <Head>
        <title>Sign in to ChatCube</title>
      </Head>
      <Header />
      <SignIn path="/sign-in" routing="path" />
    </div>
  );
}
