import { UserProfile } from "@clerk/clerk-react";
import Header from "../../components/Header";
import Fade from "react-reveal/Fade";

export default function UserProfilePage() {
  return (
    <div className="dark:bg-gray-900 bg-indigo-700">
      <Header />
      <Fade>
        <UserProfile path="/user" routing="path" />;
      </Fade>
    </div>
  );
}
