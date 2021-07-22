import "tailwindcss/tailwind.css";
import "../styles/globals.css";
import {
  ClerkProvider,
  RedirectToSignIn,
  SignedIn,
  SignedOut,
} from "@clerk/clerk-react";
import { useRouter } from "next/router";
import "../styles/nprogress.css";
import nProgress from "nprogress";
import Router from "next/router";
import { useEffect } from "react";
import { db } from "../firebase";
import firebase from "firebase";
import { ToastContainer } from "react-toastify";
import SEO from "@bradgarropy/next-seo";
import { AppProps } from "next/app";
import { UrlObject } from "url";

const clerkFrontendApi = process.env.NEXT_PUBLIC_CLERK_FRONTEND_API;

nProgress.configure({ showSpinner: false });

Router.events.on("routeChangeStart", nProgress.start);
Router.events.on("routeChangeComplete", nProgress.done);
Router.events.on("routeChangeError", nProgress.done);

const publicPages = ["/sign-in/[[...index]]", "/sign-up/[[...index]]"];

const MyApp = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();

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
      <SEO title="ChatCube" description="A ChatCube" icon="/favicon.ico" />
      <ToastContainer />
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
