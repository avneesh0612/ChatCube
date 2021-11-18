import {
  ClerkProvider,
  RedirectToSignIn,
  SignedIn,
  SignedOut,
} from "@clerk/clerk-react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { NextSeo } from "next-seo";
import { AppProps } from "next/app";
import { useRouter } from "next/router";
import NextNProgress from "nextjs-progressbar";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { UrlObject } from "url";
import { db } from "../firebase";
import "../styles/globals.css";

const clerkFrontendApi = process.env.NEXT_PUBLIC_CLERK_FRONTEND_API;

const publicPages = ["/sign-in/[[...index]]", "/sign-up/[[...index]]"];

const MyApp = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();

  useEffect(() => {
    if (window.Clerk?.user) {
      db.collection("users")
        .doc(window.Clerk.user.primaryEmailAddress?.emailAddress)
        .set(
          {
            email: window.Clerk.user.primaryEmailAddress?.emailAddress,
            name: window.Clerk.user.fullName,
            lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
            photoURL: window.Clerk.user.profileImageUrl,
            firstName: window.Clerk.user.firstName,
          },
          { merge: true }
        );
    }
  });

  return (
    <ClerkProvider
      frontendApi={clerkFrontendApi}
      navigate={(to: string | UrlObject) => router.push(to)}
      authVersion={2}
    >
      <NextSeo
        title="ChatCube"
        description="This is a 1:1 chatting app."
        canonical="https://www.chatcube.me/"
        openGraph={{
          url: "https://www.chatcube.me/",
          title: "ChatCube",
          description: "This is a 1:1 chatting app.",
          images: [
            {
              url: "/Logo.png",
              width: 500,
              height: 500,
              alt: "ChatCube",
            },
          ],
          site_name: "ChatCube",
        }}
        twitter={{
          handle: "@avneesh0612",
          site: "@avneesh0612",
          cardType: "summary_large_image",
        }}
      />

      <ToastContainer />
      <NextNProgress color="#FE4098" options={{ showSpinnner: false }} />

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
