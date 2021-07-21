import Link from "next/link";
import Image from "next/image";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { LightBulbIcon, MoonIcon } from "@heroicons/react/outline";
import useDarkMode from "../hooks/useDarkMode";

function Header() {
  const [colorTheme, setTheme] = useDarkMode();
  return (
    <header className="px-5 flex justify-between items-center bg-white dark:bg-indigo-700 dark:text-gray-300 m-4 rounded-3xl">
      {colorTheme !== "dark" ? (
        <Image
          src="https://res.cloudinary.com/dssvrf9oz/image/upload/v1626875709/0002-4635317732-removebg-preview_cwdgae.png"
          alt="logo"
          width={180}
          height={100}
          objectFit="contain"
        />
      ) : (
        <Image
          src="https://res.cloudinary.com/dssvrf9oz/image/upload/v1626875530/ChatCube__1_-removebg-preview_dxm932.png"
          alt="logo"
          width={180}
          height={100}
          objectFit="contain"
        />
      )}
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
