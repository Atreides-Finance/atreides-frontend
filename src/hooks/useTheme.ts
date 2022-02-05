import { useEffect, useState } from "react";

const useTheme = (): [string, (e: KeyboardEvent) => void, boolean] => {
  const [theme, setTheme] = useState("dark");
  const [mounted, setMounted] = useState(false);

  const setMode = (mode: string) => {
    window.localStorage.setItem("theme", mode);
    setTheme(mode);
  };

  const toggleTheme = (e: KeyboardEvent) => {
    setMode("dark");
  };

  useEffect(() => {
    setMode("dark");
    setMounted(true);
  }, []);

  return [theme, toggleTheme, mounted];
};

export default useTheme;
