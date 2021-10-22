import Fade from "react-reveal/Fade";
import router from "next/router";

function Footer() {
  if (router.pathname.match("/")) {
    return null;
  }
  else {
    return (
      <Fade bottom>
        <footer className="flex items-center justify-between px-5 bg-white">
          <p className="text-center w-full py-3 text-lg font-medium">
            Made with 💜 by{" "}
            <a target="blank" href="https://avneesh-links.vercel.app/">Avneesh Agarwal</a>
            and re-designed by Aman Kaushik
          </p>
        </footer>
      </Fade>
    );
  }
}

export default Footer;
