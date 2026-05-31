"use client";

import { useEffect } from "react";
import Aos from "aos";
import "aos/dist/aos.css";
import { ThemeProvider, useTheme } from "../context/ThemeContext";

const AppShell = ({ children }) => {
  const { darkMode } = useTheme();

  useEffect(() => {
    Aos.init({ once: true });
  }, []);

  return (
    <div className={`min-h-screen ${darkMode ? "bg-[#0a0f1e]" : "bg-white"}`}>
      {children}
    </div>
  );
};

export default function Providers({ children }) {
  return (
    <ThemeProvider>
      <AppShell>{children}</AppShell>
    </ThemeProvider>
  );
}
