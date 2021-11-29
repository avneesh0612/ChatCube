import {
  ClerkProvider,
  RedirectToSignIn,
  SignedIn,
  SignedOut,
} from "@clerk/clerk-react";
import "firebase/compat/firestore";
import { NextSeo } from "next-seo";
import { AppProps } from "next/app";
import { useRouter } from "next/router";
import NextNProgress from "nextjs-progressbar";
import { ToastContainer } from "react-toastify";
import { UrlObject } from "url";
import "../styles/globals.css";

const clerkFrontendApi = process.env.NEXT_PUBLIC_CLERK_FRONTEND_API;

const publicPages = ["/sign-in/[[...index]]", "/sign-up/[[...index]]"];

const MyApp = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();

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
