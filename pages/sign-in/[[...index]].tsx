import { SignIn } from "@clerk/clerk-react";
import Header from "../../components/Header";
import Fade from "react-reveal/Fade";

export default function SignInPage() {
  return (
    <div className="dark:bg-gray-900 bg-indigo-700">
      <Header />
      <Fade>
        <SignIn path="/sign-in" routing="path" />
      </Fade>
    </div>
  );
}
