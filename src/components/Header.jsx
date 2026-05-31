"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LuSunMoon } from "react-icons/lu";
import { useTheme } from "../context/ThemeContext";

const NAV_LINKS = [
  { href: "/",        label: "Home"    },
  { href: "/about",   label: "About"   },
  { href: "/project", label: "Project" },
  { href: "/gallery", label: "Gallery" },
  { href: "/skills",  label: "Skills"  },
  { href: "/blog",    label: "Blog"    },
  { href: "/contact", label: "Contact" },
];

const Header = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={`w-full fixed top-0 left-0 z-50 backdrop-blur-md shadow-sm transition-colors ${
        darkMode ? "bg-gray-900/90" : "bg-white/80"
      }`}
      role="banner"
    >
      <nav aria-label="Main navigation">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex gap-2 items-center">
            <img src="/assets/sakshamport.jpeg" alt="Saksham Khadka" className="w-10 h-10 rounded-3xl" />
            <h1 className={`text-xl font-semibold tracking-wide ${darkMode ? "text-white" : "text-gray-900"}`}>
              Saksham
            </h1>
          </div>

          <ul className={`hidden md:flex gap-10 text-sm font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>
            {NAV_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`transition hover:text-blue-400 ${
                    isActive(href) ? "text-blue-400 font-bold" : darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-4">
            <div
              className={`cursor-pointer transition-colors ${darkMode ? "text-white" : "text-gray-900"}`}
              onClick={toggleDarkMode}
            >
              <LuSunMoon size={24} />
            </div>
            <div className="md:hidden flex flex-col gap-1 cursor-pointer" onClick={() => setMenuOpen(!menuOpen)}>
              <span className={`w-6 h-0.5 transition-colors ${darkMode ? "bg-white" : "bg-black"}`} />
              <span className={`w-6 h-0.5 transition-colors ${darkMode ? "bg-white" : "bg-black"}`} />
              <span className={`w-6 h-0.5 transition-colors ${darkMode ? "bg-white" : "bg-black"}`} />
            </div>
          </div>
        </div>

        <div className={`md:hidden transition-all duration-300 overflow-hidden ${menuOpen ? "max-h-60 py-4" : "max-h-0"} ${darkMode ? "bg-gray-900" : "bg-white"}`}>
          <ul className={`flex flex-col items-center gap-6 text-sm font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>
            {NAV_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className={`transition hover:text-blue-400 ${
                    isActive(href) ? "text-blue-400 font-bold" : darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
            <li>
              <div
                className={`cursor-pointer px-4 py-1 border rounded-lg transition text-sm ${
                  darkMode ? "border-white/20 text-white hover:bg-gray-800" : "border-gray-300 text-gray-900 hover:bg-gray-100"
                }`}
                onClick={toggleDarkMode}
              >
                {darkMode ? "Light Mode" : "Dark Mode"}
              </div>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
