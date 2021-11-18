import Fade from "react-reveal/Fade";
import { useRouter } from "next/router";

function Footer() {
  const router = useRouter();
  if (router.pathname.match("/")) {
    return null;
  } else {
    return (
      <Fade bottom>
        <footer className="flex items-center justify-between px-5 bg-white">
          <p className="w-full py-3 text-lg font-medium text-center">
            Made with 💜 by{" "}
            <a target="blank" href="https://avneesh-links.vercel.app/">
              Avneesh Agarwal
            </a>
          </p>
        </footer>
      </Fade>
    );
  }
}

export default Footer;
