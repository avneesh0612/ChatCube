import Link from "next/link";
import Image from "next/image";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { LightBulbIcon, MoonIcon } from "@heroicons/react/outline";
import useDarkMode from "../hooks/useDarkMode";

function Header() {
  const [colorTheme, setTheme] = useDarkMode();
  return (
    <header className="flex items-center justify-between px-5 m-4 bg-white dark:bg-indigo-700 dark:text-gray-300 rounded-3xl">
      {colorTheme !== "dark" ? (
        <Image
          src="https://res.cloudinary.com/dssvrf9oz/image/upload/v1626881694/Aman-removebg-preview_pwjggi.png"
          alt="logo"
          width={100}
          height={100}
          objectFit="contain"
        />
      ) : (
        <Image
          src="https://res.cloudinary.com/dssvrf9oz/image/upload/v1626881465/Logo_challenge-removebg-preview_adfynp.png"
          alt="logo"
          width={100}
          height={100}
          objectFit="contain"
        />
      )}
      <div className="flex items-center w-1/3 h-full justify-evenly">
        <h3 className="text-lg font-medium text-gray-900 duration-75 delay-75 cursor-pointer hover:text-xl hover:underline dark:text-gray-300 ">
          Home
        </h3>
        <h3 className="text-lg font-medium text-gray-900 duration-75 delay-75 cursor-pointer hover:text-xl hover:underline dark:text-gray-300">
          Profile
        </h3>
        <h3 className="text-lg font-medium text-indigo-800 duration-75 delay-75 cursor-pointer dark:text-gray-100 hover:text-xl hover:underline">
          Message
        </h3>
        <h3 className="text-lg font-medium text-gray-900 duration-75 delay-75 cursor-pointer hover:text-xl hover:underline dark:text-gray-300">
          Settings
        </h3>
        <div className="w-6 h-6 cursor-pointer">
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
