import Link from "next/link";
import Image from "next/image";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { LightBulbIcon, MoonIcon } from "@heroicons/react/outline";
import useDarkMode from "../hooks/useDarkMode";

function Header() {
  const [colorTheme, setTheme] = useDarkMode();
  return (
    <header className="px-5 flex justify-between items-center bg-white dark:bg-indigo-700 dark:text-gray-300 m-4 rounded-3xl">
      <Image
        src="https://corporatebytes.in/wp-content/uploads/2016/11/logo-logo1.jpg"
        alt="logo"
        width={100}
        height={100}
        objectFit="contain"
      />
      <div className="flex items-center h-full w-1/3 justify-evenly">
        <h3 className="text-lg cursor-pointer hover:text-xl hover:underline delay-75 duration-75 font-medium text-gray-900 dark:text-gray-300 ">
          Home
        </h3>
        <h3 className="text-lg cursor-pointer hover:text-xl hover:underline delay-75 duration-75 font-medium text-gray-900 dark:text-gray-300">
          Profile
        </h3>
        <h3 className="text-indigo-800 dark:text-gray-100 text-lg cursor-pointer hover:text-xl hover:underline delay-75 duration-75 font-medium">
          Message
        </h3>
        <h3 className="text-lg cursor-pointer hover:text-xl hover:underline delay-75 duration-75 font-medium text-gray-900 dark:text-gray-300">
          Settings
        </h3>
        <div className="h-6 w-6 cursor-pointer">
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
