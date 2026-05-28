import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Projects from "./pages/Projects";
import Gallery from "./pages/Gallery";
import Skills from "./pages/Skills";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import Aos from "aos";
import "aos/dist/aos.css";

const App = () => {
  useEffect(() => {
    Aos.init();
  }, []);

  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

// Separate inner component so it can consume ThemeContext
const AppContent = () => {
  const { darkMode } = useTheme(); // ← now available here too if needed

  return (
    <div className={`min-h-screen ${darkMode ? "bg-[#0a0f1e]" : "bg-white"}`}>
      <Header />
      <main className="w-full">
        <Routes>
          <Route path="/home"    element={<Home />} />
          <Route path="/"        element={<Home />} />
          <Route path="/about"   element={<About />} />
          <Route path="/project" element={<Projects />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/skills"  element={<Skills />} />
          <Route path="/blog"    element={<Blog />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;