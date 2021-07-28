import SEO from "@bradgarropy/next-seo";
import { UserProfile } from "@clerk/clerk-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function UserProfilePage() {
  return (
    <div className="dark:bg-gray-900 bg-indigo-700">
      <SEO title="Your profile" />
      <Header />
      <UserProfile path="/user" routing="path" />;
      <Footer />
    </div>
  );
}
