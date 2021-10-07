import Fade from "react-reveal/Fade";

function Header() {
  return (
    <Fade bottom>
      <footer className="flex items-center justify-between px-5 m-4 bg-white dark:bg-indigo-700  mb-5 dark:text-white rounded-xl">
        <p className="text-center w-full py-3 text-lg font-medium">
          Made with 💜 by{" "}
          <a target="_blank" href="https://avneesh-links.vercel.app/">Avneesh Agarwal</a>
        </p>
      </footer>
    </Fade>
  );
}

export default Header;
