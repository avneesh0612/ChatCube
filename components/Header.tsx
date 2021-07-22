import Link from "next/link";
import Image from "next/image";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { LightBulbIcon, MoonIcon } from "@heroicons/react/outline";
import useDarkMode from "../hooks/useDarkMode";
import { useRouter } from "next/router";

function Header() {
  const [colorTheme, setTheme] = useDarkMode();
  const router = useRouter();
  const location = router.pathname;

  return (
    <header className="flex items-center justify-between px-5 m-4 bg-white dark:bg-indigo-700 dark:text-gray-300 rounded-3xl">
      <Link href="/">
        {colorTheme !== "dark" ? (
          <Image
            src="https://res.cloudinary.com/dssvrf9oz/image/upload/v1626881694/Aman-removebg-preview_pwjggi.png"
            alt="logo"
            width={100}
            height={100}
            objectFit="contain"
            className="cursor-pointer"
          />
        ) : (
          <Image
            src="https://res.cloudinary.com/dssvrf9oz/image/upload/v1626881465/Logo_challenge-removebg-preview_adfynp.png"
            alt="logo"
            width={100}
            height={100}
            className="cursor-pointer"
            objectFit="contain"
          />
        )}
      </Link>
      <div className="flex items-center w-1/3 h-full justify-evenly">
        <Link href="/">
          <p
            className={`text-lg font-medium ${
              location === "/"
                ? "text-indigo-800"
                : "text-gray-900 dark:text-gray-300"
            } duration-75 delay-75 cursor-pointer hover:text-xl hover:underline `}
          >
            Home
          </p>
        </Link>
        <Link href="/user">
          <p
            className={`text-lg font-medium${
              location === "/user"
                ? "text-indigo-800"
                : "text-gray-900 dark:text-gray-300"
            } duration-75 delay-75 cursor-pointer hover:text-xl hover:underline `}
          >
            Profile
          </p>
        </Link>
        <h3
          className={`text-lg font-medium ${
            location === "/home" ? "text-indigo-800" : ""
          } duration-75 delay-75 cursor-pointer dark:text-gray-100 hover:text-xl hover:underline`}
        >
          Message
        </h3>
        <div className="w-8 h-8 cursor-pointer flex items-center justify-center">
          {colorTheme === "light" ? (
            <LightBulbIcon onClick={() => setTheme("light")} />
          ) : (
            <MoonIcon onClick={() => setTheme("dark")} />
          )}
        </div>
      </div>

      <div>
        <SignedOut>
          <Link href="/sign-in">Sign in</Link>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </header>
  );
}

export default Header;
