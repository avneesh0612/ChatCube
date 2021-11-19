import Image from "next/image";
import Link from "next/link";
import Fade from "react-reveal/Fade";

function Header() {
  return (
    <Fade top>
      <header className="px-5 m-4 text-center rounded-lg">
        <Link passHref href="/">
          <a>
            <Image
              src="https://res.cloudinary.com/dssvrf9oz/image/upload/v1626881694/Aman-removebg-preview_pwjggi.png"
              alt="chatCube"
              width={100}
              height={100}
              objectFit="contain"
              className="cursor-pointer"
            />
          </a>
        </Link>
      </header>
    </Fade>
  );
}

export default Header;
