import { NextSeo } from "next-seo";
import { SignIn } from "@clerk/clerk-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import type { NextPage } from "next";

const SignInPage: NextPage = () => {
  return (
    <div className="bg-indigo-700">
      <NextSeo title="Sign in to ChatCube" />

      <Header />
      <SignIn path="/sign-in" routing="path" />
      <Footer />
    </div>
  );
}

export default SignInPage
