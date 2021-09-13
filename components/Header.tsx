import Link from "next/link";
import Image from "next/image";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { LightBulbIcon, MoonIcon } from "@heroicons/react/outline";
import useDarkMode from "../hooks/useDarkMode";
import { useRouter } from "next/router";
import Fade from "react-reveal/Fade";

function Header() {
  const [colorTheme, setTheme] = useDarkMode();
  const router = useRouter();
  const location = router.pathname;

  return (
    <Fade top>
      <header className="flex items-center justify-between px-5 m-4 bg-white dark:bg-indigo-700 dark:text-gray-300 rounded-xl">
        <Link passHref href="/">
          <a>
            {colorTheme !== "dark" ? (
              <Image
                src="https://res.cloudinary.com/dssvrf9oz/image/upload/v1626881694/Aman-removebg-preview_pwjggi.png"
                alt="chatCube"
                width={100}
                height={100}
                objectFit="contain"
                className="cursor-pointer"
              />
            ) : (
              <Image
                src="https://res.cloudinary.com/dssvrf9oz/image/upload/v1626881465/Logo_challenge-removebg-preview_adfynp.png"
                alt="chatCube"
                width={100}
                height={100}
                className="cursor-pointer"
                objectFit="contain"
              />
            )}
          </a>
        </Link>
        <div className="flex items-center w-1/3 h-full justify-evenly">
          <Link passHref href="/">
            <a
              className={`text-lg font-medium  ${
                location === "/"
                  ? "text-indigo-800 dark:text-white underline"
                  : " text-gray-900 dark:text-gray-300 sm:inline-flex hidden"
              } duration-75 delay-75 dark:hover:text-white cursor-pointer hover:text-xl no-underline hover:underline `}
            >
              Home
            </a>
          </Link>
          <Link passHref href="/user">
            <a
              className={`text-lg font-medium  ${
                location === "/user"
                  ? "text-indigo-800 dark:text-white underline"
                  : " text-gray-900 dark:text-gray-300 sm:inline-flex hidden"
              } duration-75 delay-75 dark:hover:text-white cursor-pointer hover:text-xl no-underline hover:underline `}
            >
              Profile
            </a>
          </Link>
          <a
            className={`text-lg font-medium  ${
              location === "/chat"
                ? "text-indigo-800 dark:text-white underline"
                : " text-gray-900 dark:text-gray-300 sm:inline-flex hidden"
            } duration-75 delay-75 dark:hover:text-white cursor-pointer hover:text-xl no-underline hover:underline `}
          >
            Message
          </a>
          <div className="w-8 h-8 hover:w-9 hover:h-9 duration-75 delay-75 dark:hover:text-white cursor-pointer flex items-center justify-center">
            {colorTheme === "light" ? (
              <LightBulbIcon onClick={() => setTheme("light")} />
            ) : (
              <MoonIcon onClick={() => setTheme("dark")} />
            )}
          </div>
        </div>

        <div className="flex items-center justify-center space-x-2">
          <a
            target="blank"
            href="https://avneesh0612.hashnode.dev/how-i-built-chatcube-with-nextjs-tailwindcss-clerk-and-firebase-and-a-walkthrough-of-the-app"
            className="text-lg font-medium
                text-gray-900 dark:text-gray-300 sm:inline-flex hidden
             duration-75 delay-75 dark:hover:text-white cursor-pointer hover:text-xl no-underline hover:underline"
          >
            About Project
          </a>
          <a
            target="blank"
            href="https://github.com/avneesh0612/ChatCube"
            className="text-lg font-medium
                text-gray-900 dark:text-gray-300 sm:inline-flex hidden
             duration-75 delay-75 dark:hover:text-white cursor-pointer hover:text-xl no-underline hover:underline"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8 hover:w-9 hover:h-9 duration-75 delay-75 dark:hover:text-white cursor-pointer flex items-center justify-center"
              viewBox="0 0 24 24"
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </a>
          <SignedOut>
            <Link passHref href="/sign-in">
              <a
                className={`text-lg font-medium  ${
                  location === "/sign-in"
                    ? "text-indigo-800 dark:text-white underline"
                    : " text-gray-900 dark:text-gray-300 sm:inline-flex hidden"
                } duration-75 delay-75 dark:hover:text-white cursor-pointer hover:text-xl no-underline hover:underline `}
              >
                Sign in
              </a>
            </Link>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </header>
    </Fade>
  );
}

export default Header;
