import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { LuSunMoon } from "react-icons/lu";
import { useTheme } from "../context/ThemeContext"; // ← import hook

const Header = () => {
  const { darkMode, toggleDarkMode } = useTheme(); // ← consume context, no props needed
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className={`w-full fixed top-0 left-0 z-50 backdrop-blur-md shadow-sm transition-colors ${
        darkMode ? "bg-gray-900/90" : "bg-white/80"
      }`}
      role="banner"
    >
    <nav aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex gap-2 items-center">
          <img
            src="assets/sakshamport.jpeg"
            alt="Saksham Khadka"
            className="w-10 h-10 rounded-3xl"
          />
          <h1 className={`text-xl font-semibold tracking-wide ${darkMode ? "text-white" : "text-gray-900"}`}>
            Saksham
          </h1>
        </div>

        {/* Desktop Menu */}
        <ul className={`hidden md:flex gap-10 text-sm font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>
          {[
            { to: "/home",    label: "Home"    },
            { to: "/about",   label: "About"   },
            { to: "/project", label: "Project" },
            { to: "/gallery", label: "Gallery" },
            { to: "/skills",  label: "Skills"  },
            { to: "/blog",    label: "Blog"    },
            { to: "/contact", label: "Contact" },
          ].map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `transition hover:text-blue-400 ${
                  isActive
                    ? "text-blue-400 font-bold"
                    : darkMode ? "text-white" : "text-gray-900"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </ul>

        {/* Right side: Dark Mode Toggle + Hamburger */}
        <div className="flex items-center gap-4">
          {/* Dark Mode Toggle */}
          <div
            className={`cursor-pointer transition-colors ${darkMode ? "text-white" : "text-gray-900"}`}
            onClick={toggleDarkMode} // ← use toggleDarkMode from context
          >
            <LuSunMoon size={24} />
          </div>

          {/* Hamburger */}
          <div
            className="md:hidden flex flex-col gap-1 cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className={`w-6 h-[2px] transition-colors ${darkMode ? "bg-white" : "bg-black"}`} />
            <span className={`w-6 h-[2px] transition-colors ${darkMode ? "bg-white" : "bg-black"}`} />
            <span className={`w-6 h-[2px] transition-colors ${darkMode ? "bg-white" : "bg-black"}`} />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          menuOpen ? "max-h-60 py-4" : "max-h-0"
        } ${darkMode ? "bg-gray-900" : "bg-white"}`}
      >
        <ul className={`flex flex-col items-center gap-6 text-sm font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>
          {[
            { to: "/home",    label: "Home"    },
            { to: "/about",   label: "About"   },
            { to: "/project", label: "Work"    },
            { to: "/contact", label: "Contact" },
          ].map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)} // close menu on nav
              className={({ isActive }) =>
                `transition hover:text-blue-400 ${
                  isActive
                    ? "text-blue-400 font-bold"
                    : darkMode ? "text-white" : "text-gray-900"
                }`
              }
            >
              {label}
            </NavLink>
          ))}

          {/* Mobile Dark Mode Toggle */}
          <div
            className={`cursor-pointer px-4 py-1 border rounded-lg transition text-sm ${
              darkMode
                ? "border-white/20 text-white hover:bg-gray-800"
                : "border-gray-300 text-gray-900 hover:bg-gray-100"
            }`}
            onClick={toggleDarkMode} // ← use toggleDarkMode from context
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </div>
        </ul>
      </div>
    </nav>
    </header>
  );
};

export default Header;