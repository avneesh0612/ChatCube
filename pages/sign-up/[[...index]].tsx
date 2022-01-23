import { NextSeo } from "next-seo";
import { SignUp } from "@clerk/clerk-react";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import type { NextPage } from "next";

const SignUpPage: NextPage = () => {
  return (
    <div className="bg-indigo-700">
      <NextSeo title="Sign up to ChatCube" />
      <Header />
      <SignUp path="/sign-up" routing="path" />
      <Footer />
    </div>
  );
}

export default SignUpPage
