import { useState, useEffect, useRef } from "react";

export default function useComponentVisible() {
  const [isComponentVisible, setIsComponentVisible] = useState<boolean>(false);
  const ref = useRef<any>(null);

  const handleClickOutside = (event: any) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setIsComponentVisible(!isComponentVisible);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, !isComponentVisible);

    return () => {
      document.removeEventListener(
        "click",
        handleClickOutside,
        !isComponentVisible
      );
    };
  });

  return { ref, isComponentVisible, setIsComponentVisible };
}
