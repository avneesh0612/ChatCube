import "tailwindcss/tailwind.css";
import "../styles/globals.css";
import {
  ClerkProvider,
  RedirectToSignIn,
  SignedIn,
  SignedOut,
} from "@clerk/clerk-react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { db } from "../firebase";
import firebase from "firebase";
import { ToastContainer } from "react-toastify";
import SEO from "@bradgarropy/next-seo";
import { AppProps } from "next/app";
import { UrlObject } from "url";
import NextNProgress from "nextjs-progressbar";
import useDarkMode from "../hooks/useDarkMode";

const clerkFrontendApi = process.env.NEXT_PUBLIC_CLERK_FRONTEND_API;

const publicPages = ["/sign-in/[[...index]]", "/sign-up/[[...index]]"];

const MyApp = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();
  const [colorTheme, setTheme] = useDarkMode();

  useEffect(() => {
    if (window.Clerk?.user) {
      db.collection("users")
        .doc(window.Clerk.user.primaryEmailAddress.emailAddress)
        .set(
          {
            email: window.Clerk.user.primaryEmailAddress.emailAddress,
            name: window.Clerk.user.fullName,
            lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
            photoURL: window.Clerk.user.profileImageUrl,
            userName: window.Clerk.user.username,
          },
          { merge: true }
        );
    }
  });

  return (
    <ClerkProvider
      frontendApi={clerkFrontendApi}
      navigate={(to: string | UrlObject) => router.push(to)}
    >
      <SEO
        title="ChatCube"
        description="This is a 1:1 chatting app"
        keywords={["chatting", "chat", "message"]}
        icon="/Icon.png"
        facebook={{
          image: "/Logo.png",
          url: "https://www.chatcube.me/",
          type: "website",
        }}
        twitter={{
          image: "/Logo.png",
          site: "@AvneeshAgarwa12",
          card: "summary",
        }}
      />

      <ToastContainer />
      <NextNProgress color="#FE4098" />

      {publicPages.includes(router.pathname) ? (
        <Component {...pageProps} />
      ) : (
        <>
          <SignedIn>
            <Component {...pageProps} />
          </SignedIn>
          <SignedOut>
            <RedirectToSignIn />
          </SignedOut>
        </>
      )}
    </ClerkProvider>
  );
};

export default MyApp;
