/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";

interface Type {
  key: string;
}

export function useKeyPress(targetKey: string) {
  const [keyPressed, setKeyPressed] = useState<boolean>(false);
  function downHandler({ key }: Type) {
    if (key === targetKey) {
      setKeyPressed(true);
    }
  }
  const upHandler = ({ key }: Type) => {
    if (key === targetKey) {
      setKeyPressed(false);
    }
  };
  useEffect(() => {
    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);
    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  }, []);
  return keyPressed;
}
