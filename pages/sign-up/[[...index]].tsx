import { SignUp } from "@clerk/clerk-react";
import Header from "../../components/Header";
import Fade from "react-reveal/Fade";

export default function SignUpPage() {
  return (
    <div className="dark:bg-gray-900 bg-indigo-700">
      <Header />
      <Fade>
        <SignUp path="/sign-up" routing="path" />
      </Fade>
    </div>
  );
}
