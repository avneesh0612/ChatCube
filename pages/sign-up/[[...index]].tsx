import { NextSeo } from "next-seo";
import { SignUp } from "@clerk/clerk-react";
import Footer from "../../components/Footer";
import Header from "../../components/Header";

export default function SignUpPage() {
  return (
    <div className="bg-indigo-700">
      <NextSeo title="Sign up to ChatCube" />
      <Header />
      <SignUp path="/sign-up" routing="path" />
      <Footer />
    </div>
  );
}
