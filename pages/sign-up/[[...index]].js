import { SignUp } from "@clerk/clerk-react";
import Header from "../../components/Header";

export default function SignUpPage() {
  return (
    <div className="dark:bg-gray-900 bg-indigo-300">
      <Header />
      <SignUp path="/sign-up" routing="path" />
    </div>
  );
}
