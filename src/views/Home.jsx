"use client";

// ─────────────────────────────────────────────────────────────
//  Home.jsx
//  Path: frontend/src/pages/Home.jsx
//
//  Change: the "Recent Projects" section now fetches the 2 newest
//  projects from the backend instead of using hardcoded data.
// ─────────────────────────────────────────────────────────────

import React, { useEffect, useRef, useState } from "react";
import Typed from "typed.js";
import { useTheme } from "../context/ThemeContext";
import axiosInstance from "../api/axiosInstance";
import Spinner from "../components/Spinner";

// ── Intersection Observer hook ──
const useInView = (options = {}) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.1, ...options }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return [ref, inView];
};

// ── What I Do Card ──
const ServiceCard = ({ icon, title, desc, accent, index, darkMode }) => {
  const [ref, inView] = useInView();
  const [hovered, setHovered] = useState(false);
  return (
    <div
      ref={ref}
      className={`rounded-2xl p-5 flex flex-col gap-3 transition-all duration-600 ease-out cursor-default ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{
        transitionDelay: `${index * 90}ms`,
        background: hovered
          ? darkMode ? `${accent}12` : `${accent}08`
          : darkMode ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.85)",
        border: `1px solid ${hovered ? accent + "55" : darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)"}`,
        boxShadow: hovered ? `0 12px 40px ${accent}20` : darkMode ? "0 4px 20px rgba(0,0,0,0.3)" : "0 4px 20px rgba(0,0,0,0.06)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl"
        style={{ background: `${accent}20`, border: `1px solid ${accent}33`,
          transform: hovered ? "rotate(-6deg) scale(1.1)" : "rotate(0deg) scale(1)",
          transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1)" }}>
        {icon}
      </div>
      <div>
        <h4 className="font-extrabold text-sm mb-1"
          style={{ fontFamily: "'DM Serif Display', serif", color: darkMode ? "#fff" : "#1a2050" }}>
          {title}
        </h4>
        <p className="text-xs leading-relaxed"
          style={{ color: darkMode ? "rgba(255,255,255,0.45)" : "rgba(30,40,80,0.6)" }}>
          {desc}
        </p>
      </div>
      <div className="mt-auto">
        <div className="h-0.5 rounded-full"
          style={{
            background: `linear-gradient(90deg, ${accent}, transparent)`,
            transform: hovered ? "scaleX(1)" : "scaleX(0.3)",
            transformOrigin: "left",
            transition: "transform 0.4s ease",
          }} />
      </div>
    </div>
  );
};

// ── Tech Stack Pill ──
const TechPill = ({ name, color, icon, index, darkMode }) => {
  const [ref, inView] = useInView();
  const [hovered, setHovered] = useState(false);
  return (
    <div
      ref={ref}
      className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-500 ${
        inView ? "opacity-100 scale-100" : "opacity-0 scale-90"
      }`}
      style={{
        transitionDelay: `${index * 50}ms`,
        background: hovered ? `${color}22` : darkMode ? `${color}12` : `${color}10`,
        border: `0.5px solid ${color}44`,
        color: color,
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        boxShadow: hovered ? `0 6px 20px ${color}33` : "none",
        cursor: "default",
        transition: "all 0.25s ease",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span>{icon}</span>
      {name}
    </div>
  );
};

// ── Recent Project Mini Card ──
const MiniProject = ({ title, desc, accent, tags, emoji, index, darkMode }) => {
  const [ref, inView] = useInView();
  const [hovered, setHovered] = useState(false);
  return (
    <div
      ref={ref}
      className={`rounded-2xl p-5 transition-all duration-600 ease-out ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{
        transitionDelay: `${index * 100}ms`,
        background: hovered
          ? darkMode ? `${accent}10` : `${accent}08`
          : darkMode ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.85)",
        border: `1px solid ${hovered ? accent + "66" : darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
        boxShadow: hovered ? `0 16px 48px ${accent}22` : darkMode ? "0 4px 20px rgba(0,0,0,0.3)" : "0 4px 20px rgba(0,0,0,0.06)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
        cursor: "default",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Top accent line */}
      <div className="h-0.5 w-full rounded-full mb-4"
        style={{
          background: `linear-gradient(90deg, ${accent}, transparent)`,
          transform: hovered ? "scaleX(1)" : "scaleX(0.4)",
          transformOrigin: "left",
          transition: "transform 0.4s ease",
        }} />
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
          style={{ background: `${accent}20`, border: `1px solid ${accent}33` }}>
          {emoji}
        </div>
        <span className="text-xs font-bold px-2 py-0.5 rounded-full"
          style={{ background: `${accent}20`, color: accent }}>
          Live
        </span>
      </div>
      <h4 className="font-extrabold text-sm mb-1.5"
        style={{ fontFamily: "'DM Serif Display', serif", color: darkMode ? "#fff" : "#1a2050" }}>
        {title}
      </h4>
      <p className="text-xs leading-relaxed mb-3"
        style={{ color: darkMode ? "rgba(255,255,255,0.45)" : "rgba(30,40,80,0.6)" }}>
        {desc}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {tags.map(tag => (
          <span key={tag} className="text-xs px-2 py-0.5 rounded-full"
            style={{
              background: darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
              color: darkMode ? "rgba(255,255,255,0.5)" : "rgba(30,40,80,0.55)",
              border: `0.5px solid ${darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}`,
            }}>
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

// ── Data ──
const services = [
  { icon: "🌐", title: "Full-Stack Web Apps", desc: "End-to-end MERN applications with clean architecture, REST APIs, and responsive frontends.", accent: "#6c9fff" },
  { icon: "📱", title: "Mobile Development", desc: "Cross-platform mobile apps with Flutter & Dart — smooth animations, Firebase integration.", accent: "#06b6d4" },
  { icon: "🎨", title: "UI/UX Design", desc: "Clean, modern interfaces built with Tailwind CSS and Bootstrap. Dark/light mode ready.", accent: "#f59e0b" },
  { icon: "🔧", title: "API Development", desc: "Scalable RESTful APIs with Node.js & Express, JWT auth, middleware, and MongoDB.", accent: "#10b981" },
];

const techStack = [
  { name: "React", color: "#61dafb", icon: "⚛️" },
  { name: "Node.js", color: "#3ddc97", icon: "🟢" },
  { name: "MongoDB", color: "#6fa847", icon: "🍃" },
  { name: "Express", color: "#6c9fff", icon: "🚂" },
  { name: "Flutter", color: "#54c5f8", icon: "💙" },
  { name: "Dart", color: "#00b4ab", icon: "🎯" },
  { name: "Tailwind", color: "#38bdf8", icon: "🌊" },
  { name: "JavaScript", color: "#f7df1e", icon: "🟡" },
  { name: "PHP", color: "#8892bf", icon: "🐘" },
  { name: "Bootstrap", color: "#7952b3", icon: "🅱️" },
];

// NOTE: recentProjects static array removed.
// The Home component fetches the 2 newest projects from the API instead.

const timeline = [
  { year: "2022–2024", label: "High School", color: "#f59e0b", icon: "🎓", side: "left" },
  { year: "Sem I · 2024", label: "HTML, CSS, JavaScript", color: "#6c9fff", icon: "🌐", side: "right" },
  { year: "Sem II · 2024", label: "Flutter & Dart", color: "#06b6d4", icon: "📱", side: "left" },
  { year: "Sem III · 2025", label: "MERN Stack", color: "#10b981", icon: "⚡", side: "right" },
  { year: "Sem IV · 2025", label: "Building Real Apps", color: "#3ddc97", icon: "🚀", current: true, side: "left" },
];

// ── Resume Section Component ──
const ResumeSection = ({ darkMode }) => {
  const [headerRef, headerInView] = useInView();
  const [cardRef, cardInView] = useInView();

  const highlights = [
    { label: "Languages", value: "JavaScript (ES6+), TypeScript, Dart, PHP", icon: "💻", color: "#6c9fff" },
    { label: "Frontend", value: "React.js, Tailwind CSS, Redux Toolkit, HTML5/CSS3", icon: "🎨", color: "#f59e0b" },
    { label: "Backend", value: "Node.js, Express.js, REST API, JWT Authentication", icon: "⚙️", color: "#3ddc97" },
    { label: "Database", value: "MongoDB, Mongoose ODM, MySQL", icon: "🗄️", color: "#10b981" },
    { label: "Tools", value: "Git, GitHub, Cloudinary, Vercel, Render, VS Code", icon: "🛠️", color: "#8b5cf6" },
  ];

  const divider = { borderTop: `1px solid ${darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)"}` };

  return (
    <section className="relative px-6 md:px-14 py-16 overflow-hidden">
      <div className="absolute top-10 left-0 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: "rgba(139,92,246,0.07)", filter: "blur(90px)" }} />
      <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full pointer-events-none"
        style={{ background: "rgba(61,110,255,0.06)", filter: "blur(80px)" }} />

      <div className="max-w-5xl mx-auto">
        <div ref={headerRef}
          className={`text-center mb-12 transition-all duration-700 ${headerInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <p className="text-xs uppercase tracking-[0.3em] font-bold mb-3" style={{ color: "#8b5cf6" }}>
            Download CV
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4"
            style={{ fontFamily: "'DM Serif Display', serif", color: darkMode ? "#fff" : "#1a2050" }}>
            My <em className="not-italic" style={{ color: "#8b5cf6" }}>Resume</em>
          </h2>
          <p className="text-sm max-w-md mx-auto"
            style={{ color: darkMode ? "rgba(255,255,255,0.45)" : "rgba(30,40,80,0.6)" }}>
            A snapshot of my skills, education, and projects — download the full PDF or view it online.
          </p>
        </div>

        <div ref={cardRef}
          className={`grid grid-cols-1 lg:grid-cols-2 gap-6 transition-all duration-700 ${cardInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          style={{ transitionDelay: "150ms" }}>

          {/* ── LEFT: Resume highlights ── */}
          <div className="rounded-2xl p-6"
            style={{
              background: darkMode ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.9)",
              border: `1px solid ${darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)"}`,
              boxShadow: darkMode ? "0 8px 32px rgba(0,0,0,0.3)" : "0 8px 32px rgba(0,0,0,0.06)",
            }}>
            <div className="flex items-start gap-4 mb-5 pb-5" style={divider}>
              <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0"
                style={{ border: "1px solid rgba(108,159,255,0.3)" }}>
                <img src="/assets/sakshamport.jpeg" alt="Saksham Khadka" className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="font-extrabold text-base"
                  style={{ fontFamily: "'DM Serif Display', serif", color: darkMode ? "#fff" : "#1a2050" }}>
                  Saksham Khadka
                </h3>
                <p className="text-xs font-bold mt-0.5" style={{ color: "#3ddc97" }}>
                  MERN Stack Developer · BCSIT Student
                </p>
                <p className="text-xs mt-1" style={{ color: darkMode ? "rgba(255,255,255,0.4)" : "rgba(30,40,80,0.5)" }}>
                  📍 Kathmandu, Nepal
                </p>
              </div>
            </div>

            <div className="space-y-3 mb-5">
              {highlights.map(({ label, value, icon, color }) => (
                <div key={label} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
                    style={{ background: `${color}20`, border: `1px solid ${color}33` }}>
                    {icon}
                  </div>
                  <div>
                    <p className="text-xs font-bold" style={{ color }}>{label}</p>
                    <p className="text-xs leading-relaxed"
                      style={{ color: darkMode ? "rgba(255,255,255,0.5)" : "rgba(30,40,80,0.6)" }}>
                      {value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4" style={divider}>
              <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#f59e0b" }}>
                Education
              </p>
              <p className="text-xs font-bold" style={{ color: darkMode ? "#fff" : "#1a2050" }}>
                Bachelor of Computer Science &amp; IT (BCSIT)
              </p>
              <p className="text-xs" style={{ color: darkMode ? "rgba(255,255,255,0.4)" : "rgba(30,40,80,0.5)" }}>
                Quest International College · 2024–2028
              </p>
            </div>
          </div>

          {/* ── RIGHT: CTA card ── */}
          <div className="rounded-2xl p-6 flex flex-col"
            style={{
              background: darkMode
                ? "linear-gradient(135deg, rgba(61,110,255,0.1) 0%, rgba(139,92,246,0.1) 50%, rgba(61,220,151,0.08) 100%)"
                : "linear-gradient(135deg, rgba(61,110,255,0.06) 0%, rgba(139,92,246,0.06) 50%, rgba(61,220,151,0.05) 100%)",
              border: "1px solid rgba(139,92,246,0.25)",
              boxShadow: darkMode ? "0 8px 32px rgba(0,0,0,0.3)" : "0 8px 32px rgba(139,92,246,0.08)",
            }}>
            <div className="flex flex-wrap gap-2 mb-5">
              {[
                { text: "2+ Projects Shipped", color: "#6c9fff" },
                { text: "MERN Trained", color: "#3ddc97" },
                { text: "Hackathon Winner 🏆", color: "#f59e0b" },
                { text: "Flutter Certified", color: "#06b6d4" },
              ].map(({ text, color }) => (
                <span key={text} className="text-xs font-bold px-3 py-1 rounded-full"
                  style={{ background: `${color}18`, border: `1px solid ${color}44`, color }}>
                  {text}
                </span>
              ))}
            </div>

            <p className="text-sm leading-relaxed mb-5 flex-1"
              style={{ color: darkMode ? "rgba(255,255,255,0.55)" : "rgba(30,40,80,0.65)" }}>
              BCSIT student with hands-on MERN stack experience — shipped a live LMS with eSewa payment
              integration, built a personal portfolio, and won an internal college hackathon. Currently
              exploring TypeScript &amp; Next.js.
            </p>

            <div className="mb-5 pt-4"
              style={{ borderTop: `1px solid ${darkMode ? "rgba(255,255,255,0.08)" : "rgba(139,92,246,0.15)"}` }}>
              <p className="text-xs font-bold uppercase tracking-wider mb-2.5" style={{ color: "#6c9fff" }}>
                Certifications
              </p>
              <div className="space-y-1.5">
                {[
                  { text: "MERN Stack Development · Sipalaya Infotech, 2024–2025", icon: "⚡" },
                  { text: "Flutter Mobile Development · Code IT, 2025", icon: "📱" },
                  { text: "TEDx Quest International College, 2024", icon: "🎤" },
                ].map(({ text, icon }) => (
                  <div key={text} className="flex items-center gap-2 text-xs"
                    style={{ color: darkMode ? "rgba(255,255,255,0.5)" : "rgba(30,40,80,0.6)" }}>
                    <span className="flex-shrink-0">{icon}</span>
                    {text}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="/assets/Saksham_Khadka_Resume.pdf"
                download="Saksham_Khadka_Resume.pdf"
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:shadow-xl"
                style={{ background: "linear-gradient(135deg, #3d6eff, #8b5cf6)", boxShadow: "0 6px 24px rgba(61,110,255,0.35)" }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Download PDF
              </a>
              <a
                href="/assets/Saksham_Khadka_Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5"
                style={{
                  background: "transparent",
                  border: `1px solid ${darkMode ? "rgba(139,92,246,0.4)" : "rgba(139,92,246,0.35)"}`,
                  color: "#8b5cf6",
                }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                View Online
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ── Main Component ──
const Home = ({ initialProjects = null }) => {
  const { darkMode } = useTheme();
  const typedRef = useRef(null);
  const canvasRef = useRef(null);
  const [servicesRef, servicesInView] = useInView();
  const [stackRef, stackInView] = useInView();
  const [projectsRef, projectsInView] = useInView();
  const [journeyRef, journeyInView] = useInView();
  const [ctaRef, ctaInView] = useInView();

  // Map raw API project → shape MiniProject expects
  const mapProject = (p) => ({
    title: p.title,
    desc:  p.description,
    accent: p.accent || "#6c9fff",
    tags:  p.tags || [],
    emoji: p.icon || "🚀",
  });

  const [recentProjects, setRecentProjects] = useState(
    Array.isArray(initialProjects) ? initialProjects.slice(0, 2).map(mapProject) : []
  );
  const [projectsLoading, setProjectsLoading] = useState(!initialProjects);

  useEffect(() => {
    if (initialProjects) return; // server already supplied data — skip client fetch
    const fetchRecent = async () => {
      try {
        const response = await axiosInstance.get("/projects");
        const data = response.data?.data ?? response.data;
        setRecentProjects(
          (Array.isArray(data) ? data : []).slice(0, 2).map(mapProject)
        );
      } catch {
        setRecentProjects([]);
      } finally {
        setProjectsLoading(false);
      }
    };
    fetchRecent();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Typed.js
  useEffect(() => {
    if (!typedRef.current) return;
    const typed = new Typed(typedRef.current, {
      strings: ["MERN Stack Developer", "App Developer", "Learning Full Stack"],
      typeSpeed: 55, backSpeed: 38, backDelay: 1400, loop: true,
    });
    return () => typed.destroy();
  }, []);

  // Particle canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const parent = canvas.parentElement;
    const resize = () => { canvas.width = parent.offsetWidth; canvas.height = parent.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);
    const particles = Array.from({ length: 40 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.4,
      vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
      a: Math.random() * 0.35 + 0.1,
    }));
    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = darkMode ? `rgba(180,200,255,${p.a})` : `rgba(60,100,255,${p.a * 0.5})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, [darkMode]);

  // Count-up
  useEffect(() => {
    const counters = [
      { id: "proj-count", target: 2, suffix: "+" },
      { id: "exp-count", target: 1, suffix: "+" },
      { id: "tech-count", target: 8, suffix: "+" },
    ];
    const intervals = counters.map(({ id, target, suffix }) => {
      let v = 0;
      const step = Math.ceil(target / 30);
      const interval = setInterval(() => {
        v = Math.min(v + step, target);
        const el = document.getElementById(id);
        if (el) el.textContent = v + suffix;
        if (v >= target) clearInterval(interval);
      }, 40);
      return interval;
    });
    return () => intervals.forEach(clearInterval);
  }, []);

  const sectionLabel = (text, color = "#6c9fff") => (
    <p className="text-xs uppercase tracking-[0.3em] font-bold mb-3" style={{ color }}>{text}</p>
  );

  const sectionTitle = (text, highlight, highlightColor = "#6c9fff") => (
    <h2 className="text-3xl md:text-4xl font-extrabold mb-4"
      style={{ fontFamily: "'DM Serif Display', serif", color: darkMode ? "#fff" : "#1a2050" }}>
      {text} <em className="not-italic" style={{ color: highlightColor }}>{highlight}</em>
    </h2>
  );

  return (
    <div style={{
      background: darkMode
        ? "linear-gradient(160deg, #0a0f1e 0%, #0d1533 60%, #0a0f1e 100%)"
        : "linear-gradient(160deg, #f0f4ff 0%, #e8eeff 60%, #f5f0ff 100%)",
    }}>
      

      {/* ════════════════════════════════
          HERO SECTION
      ════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col md:flex-row items-center justify-between overflow-hidden px-6 md:px-14 pt-24 md:pt-16 pb-12 md:pb-0 gap-10 md:gap-0">
        <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />

        {/* Glow Orbs */}
        <div className="absolute -top-16 -left-10 w-80 h-80 rounded-full pointer-events-none z-0"
          style={{ background: "rgba(56,100,255,0.18)", filter: "blur(80px)" }} />
        <div className="absolute bottom-5 right-16 w-56 h-56 rounded-full pointer-events-none z-0"
          style={{ background: "rgba(120,40,255,0.14)", filter: "blur(80px)" }} />
        <div className="absolute w-40 h-40 rounded-full pointer-events-none z-0"
          style={{ background: "rgba(0,200,160,0.10)", filter: "blur(80px)", top: "60%", left: "40%" }} />

        {/* LEFT */}
        <div className="relative z-10 w-full md:flex-1 md:max-w-sm text-center md:text-left" data-aos="fade-right" data-aos-duration="900">
          <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 mb-6 text-xs uppercase tracking-widest mx-auto md:mx-0"
            style={{
              background: darkMode ? "rgba(255,255,255,0.06)" : "rgba(60,80,180,0.07)",
              border: `0.5px solid ${darkMode ? "rgba(255,255,255,0.15)" : "rgba(60,80,180,0.18)"}`,
              color: darkMode ? "rgba(255,255,255,0.55)" : "rgba(40,60,160,0.7)",
            }}>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Available for work
          </div>

          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-2"
            style={{ fontFamily: "'DM Serif Display', serif", color: darkMode ? "#ffffff" : "#1a2050" }}>
            Hey, I'm<br />
            <em className="not-italic" style={{ color: "#6c9fff" }}>Saksham</em> Khadka
          </h1>

          <h2 className="text-xl font-bold tracking-wide mb-4 min-h-8" style={{ color: "#3ddc97" }}>
            <span ref={typedRef} />
          </h2>

          <p className="text-sm leading-relaxed mb-7"
            style={{ color: darkMode ? "rgba(255,255,255,0.45)" : "rgba(30,40,80,0.6)" }}>
            Building full-stack web apps that connect<br />frontend magic to solid backends.
          </p>

          <div className="flex gap-3 justify-center md:justify-start">
            <a href="/contact"
              className="px-5 py-2.5 rounded-lg text-sm font-bold text-white transition-all hover:-translate-y-0.5"
              style={{ background: "linear-gradient(135deg,#3d6eff,#6c3dff)" }}>
              Get in Touch
            </a>
            <a href="/project"
              className="px-5 py-2.5 rounded-lg text-sm font-bold transition-all"
              style={{
                background: "transparent",
                border: `0.5px solid ${darkMode ? "rgba(255,255,255,0.2)" : "rgba(30,40,180,0.25)"}`,
                color: darkMode ? "rgba(255,255,255,0.6)" : "rgba(30,40,180,0.7)",
              }}>
              View Work
            </a>
          </div>

          {/* Stats */}
          <div className="flex gap-7 mt-9 justify-center md:justify-start">
            {[
              { id: "proj-count", label: "Projects" },
              { id: "exp-count", label: "Years Exp" },
              { id: "tech-count", label: "Technologies" },
            ].map(({ id, label }, i) => (
              <React.Fragment key={id}>
                {i > 0 && <div style={{ width: 1, background: darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)" }} />}
                <div className="flex flex-col">
                  <span id={id} className="text-2xl font-extrabold"
                    style={{ color: darkMode ? "#ffffff" : "#1a2050" }}>0</span>
                  <span className="text-xs uppercase tracking-widest mt-1"
                    style={{ color: darkMode ? "rgba(255,255,255,0.35)" : "rgba(30,40,80,0.45)" }}>
                    {label}
                  </span>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* RIGHT — hidden on mobile, visible from md up */}
        <div className="hidden md:flex relative z-10 flex-col items-end gap-3" data-aos="fade-left" data-aos-duration="900">
          {/* <div className="relative rounded-2xl overflow-hidden"
            style={{
              width: 210, height: 240,
              border: `0.5px solid ${darkMode ? "rgba(255,255,255,0.12)" : "rgba(30,40,180,0.15)"}`,
              background: darkMode ? "rgba(255,255,255,0.04)" : "rgba(60,80,180,0.04)",
            }}>
            <img src="/assets/sakshamport2.jpeg" alt="Saksham Khadka" className="w-full h-full object-cover" />
            {["top-0 left-0 border-t-2 border-l-2 rounded-tl", "top-0 right-0 border-t-2 border-r-2 rounded-tr",
              "bottom-0 left-0 border-b-2 border-l-2 rounded-bl", "bottom-0 right-0 border-b-2 border-r-2 rounded-br",
            ].map((cls, i) => (
              <div key={i} className={`absolute w-4 h-4 ${cls}`} style={{ borderColor: "#3d6eff" }} />
            ))}
          </div> */}

   <div
  className="relative rounded-2xl overflow-hidden
             w-[220px] h-[260px]
             lg:w-[430px] lg:h-[440px]
             xl:w-[500px] xl:h-[520px]"
  style={{
    border: `0.5px solid ${
      darkMode
        ? "rgba(255,255,255,0.12)"
        : "rgba(30,40,180,0.15)"
    }`,
    background: darkMode
      ? "rgba(255,255,255,0.04)"
      : "rgba(60,80,180,0.04)",
  }}
>
  <img
    src="/assets/sakshamport2.jpeg"
    alt="Saksham Khadka"
    className="w-full h-full object-cover"
  />
</div>

          <div className="flex flex-wrap gap-2 justify-end max-w-xs">
            {[
              { label: "React", color: "#61dafb" }, { label: "Node.js", color: "#3ddc97" },
              { label: "MongoDB", color: "#6fa847" }, { label: "Express", color: "#6c9fff" },
            ].map(({ label, color }) => (
              <span key={label} className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full"
                style={{ color, borderColor: `${color}44`, border: "0.5px solid", background: `${color}11` }}>
                {label}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs tracking-widest uppercase mt-2"
            style={{ color: darkMode ? "rgba(255,255,255,0.25)" : "rgba(30,40,80,0.35)" }}>
            <div style={{ width: 28, height: 1, background: darkMode ? "rgba(255,255,255,0.15)" : "rgba(30,40,80,0.2)" }} />
            Scroll to explore
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          RESUME
      ════════════════════════════════ */}
      <ResumeSection darkMode={darkMode} />

      {/* ════════════════════════════════
          WHAT I DO
      ════════════════════════════════ */}
      <section className="relative px-6 md:px-14 py-20 overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full pointer-events-none"
          style={{ background: "rgba(108,159,255,0.07)", filter: "blur(90px)" }} />

        <div className="max-w-5xl mx-auto">
          <div ref={servicesRef}
            className={`text-center mb-12 transition-all duration-700 ${servicesInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            {sectionLabel("What I Do")}
            {sectionTitle("Services I", "Offer", "#3ddc97")}
            <p className="text-sm max-w-md mx-auto"
              style={{ color: darkMode ? "rgba(255,255,255,0.45)" : "rgba(30,40,80,0.6)" }}>
              From pixel-perfect frontends to robust backends — here's how I can help bring your ideas to life.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {services.map((s, i) => (
              <ServiceCard key={s.title} {...s} index={i} darkMode={darkMode} />
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          TECH STACK
      ════════════════════════════════ */}
      <section className="relative px-6 md:px-14 py-16 overflow-hidden">
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: "rgba(61,220,151,0.06)", filter: "blur(80px)" }} />

        <div className="max-w-5xl mx-auto">
          <div ref={stackRef}
            className={`text-center mb-10 transition-all duration-700 ${stackInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            {sectionLabel("My Arsenal", "#f59e0b")}
            {sectionTitle("Tech", "Stack", "#f59e0b")}
            <p className="text-sm max-w-md mx-auto"
              style={{ color: darkMode ? "rgba(255,255,255,0.45)" : "rgba(30,40,80,0.6)" }}>
              Every tool I've picked up across four semesters of building real-world applications.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {techStack.map((tech, i) => (
              <TechPill key={tech.name} {...tech} index={i} darkMode={darkMode} />
            ))}
          </div>

          {/* Progress bars for core skills */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {[
              { label: "Frontend (React + Tailwind)", pct: 88, color: "#6c9fff" },
              { label: "Backend (Node + Express)", pct: 80, color: "#3ddc97" },
              { label: "Database (MongoDB)", pct: 75, color: "#6fa847" },
              { label: "Mobile (Flutter + Dart)", pct: 72, color: "#06b6d4" },
            ].map(({ label, pct, color }, i) => {
              const [barRef, barInView] = useInView();
              return (
                <div key={label} ref={barRef}
                  className={`transition-all duration-500 ${barInView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"}`}
                  style={{ transitionDelay: `${i * 100}ms` }}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-xs font-bold" style={{ color: darkMode ? "rgba(255,255,255,0.7)" : "#1a2050" }}>
                      {label}
                    </span>
                    <span className="text-xs font-extrabold" style={{ color }}>{pct}%</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden"
                    style={{ background: darkMode ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)" }}>
                    <div className="h-full rounded-full"
                      style={{
                        width: barInView ? `${pct}%` : "0%",
                        background: `linear-gradient(90deg, ${color}cc, ${color})`,
                        transition: "width 1.1s cubic-bezier(0.4,0,0.2,1)",
                        boxShadow: `0 0 8px ${color}55`,
                      }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          RECENT PROJECTS
      ════════════════════════════════ */}
      <section className="relative px-6 md:px-14 py-16 overflow-hidden">
        <div className="absolute top-10 right-10 w-60 h-60 rounded-full pointer-events-none"
          style={{ background: "rgba(232,93,4,0.07)", filter: "blur(80px)" }} />

        <div className="max-w-5xl mx-auto">
          <div ref={projectsRef}
            className={`text-center mb-10 transition-all duration-700 ${projectsRef && projectsInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            {sectionLabel("Portfolio Highlights", "#e85d04")}
            {sectionTitle("Recent", "Projects", "#e85d04")}
            <p className="text-sm max-w-md mx-auto"
              style={{ color: darkMode ? "rgba(255,255,255,0.45)" : "rgba(30,40,80,0.6)" }}>
              A quick look at two live apps I've shipped. More on the Projects page.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
            {/* Show spinner while API request is in-flight */}
            {projectsLoading ? (
              <div className="col-span-2">
                <Spinner message="Loading Projects..." darkMode={darkMode} />
              </div>
            ) : recentProjects.length > 0 ? (
              // Render fetched projects once data arrives
              recentProjects.map((p, i) => (
                <MiniProject key={p.title} {...p} index={i} darkMode={darkMode} />
              ))
            ) : (
              // Fallback if API returned empty array
              <p
                className="col-span-2 text-center text-sm py-10"
                style={{ color: darkMode ? "rgba(255,255,255,0.3)" : "rgba(30,40,80,0.4)" }}
              >
                No projects yet — check back soon.
              </p>
            )}
          </div>

          <div className="text-center">
            <a href="/project"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:shadow-lg"
              style={{ background: "linear-gradient(135deg, #e85d04, #f59e0b)" }}>
              View All Projects
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          JOURNEY TIMELINE (mini)
      ════════════════════════════════ */}
      <section className="relative px-6 md:px-14 py-16 overflow-hidden">
        <div className="absolute left-1/2 top-0 bottom-0 w-72 h-72 rounded-full pointer-events-none -translate-x-1/2"
          style={{ background: "rgba(108,159,255,0.05)", filter: "blur(100px)" }} />

        <div className="max-w-3xl mx-auto">
          <div ref={journeyRef}
            className={`text-center mb-12 transition-all duration-700 ${journeyInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            {sectionLabel("My Path", "#8b5cf6")}
            {sectionTitle("The", "Journey", "#8b5cf6")}
            <p className="text-sm max-w-md mx-auto"
              style={{ color: darkMode ? "rgba(255,255,255,0.45)" : "rgba(30,40,80,0.6)" }}>
              From high school graduate to MERN stack developer — five milestones that shaped me.
            </p>
          </div>

          {/* Compact horizontal timeline */}
          <div className="relative">
            {/* Spine */}
            <div className="absolute left-5 top-0 bottom-0 w-px"
              style={{ background: darkMode ? "rgba(255,255,255,0.07)" : "rgba(30,40,80,0.1)" }} />

            <div className="flex flex-col gap-6 pl-14">
              {timeline.map((item, i) => {
                const [tRef, tInView] = useInView();
                return (
                  <div key={i} ref={tRef}
                    className={`relative transition-all duration-500 ease-out ${tInView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6"}`}
                    style={{ transitionDelay: `${i * 100}ms` }}>
                    {/* Dot */}
                    <div className="absolute -left-9 top-1 w-8 h-8 rounded-full flex items-center justify-center text-sm"
                      style={{
                        background: `${item.color}22`,
                        border: `2px solid ${item.color}`,
                        boxShadow: item.current ? `0 0 16px ${item.color}55` : "none",
                        animation: item.current ? "pulse 2s infinite" : "none",
                      }}>
                      {item.icon}
                    </div>
                    {/* Content */}
                    <div className="rounded-xl px-4 py-3"
                      style={{
                        background: darkMode ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.8)",
                        border: `1px solid ${item.current ? item.color + "55" : darkMode ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}`,
                        boxShadow: item.current ? `0 0 20px ${item.color}22` : "none",
                      }}>
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <span className="text-xs font-bold" style={{ color: item.color }}>{item.year}</span>
                          <p className="text-sm font-extrabold mt-0.5"
                            style={{ fontFamily: "'DM Serif Display', serif", color: darkMode ? "#fff" : "#1a2050" }}>
                            {item.label}
                          </p>
                        </div>
                        {item.current && (
                          <span className="text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0"
                            style={{ background: `${item.color}22`, color: item.color }}>
                            Now ✦
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="text-center mt-8">
            <a href="/about"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5"
              style={{
                background: "transparent",
                border: `1px solid ${darkMode ? "rgba(139,92,246,0.4)" : "rgba(139,92,246,0.3)"}`,
                color: "#8b5cf6",
              }}>
              Full Story on About Page
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          CTA BANNER
      ════════════════════════════════ */}
      <section className="relative px-6 md:px-14 py-16">
        <div className="max-w-5xl mx-auto">
          <div
            ref={ctaRef}
            className={`relative rounded-3xl overflow-hidden p-10 md:p-14 text-center transition-all duration-700 ${
              ctaInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
            style={{
              background: "linear-gradient(135deg, #3d6eff22 0%, #6c3dff22 50%, #3ddc9722 100%)",
              border: "1px solid rgba(108,159,255,0.25)",
            }}
          >
            {/* Decorative orbs inside */}
            <div className="absolute top-0 left-0 w-40 h-40 rounded-full pointer-events-none"
              style={{ background: "rgba(61,110,255,0.15)", filter: "blur(40px)", transform: "translate(-30%,-30%)" }} />
            <div className="absolute bottom-0 right-0 w-40 h-40 rounded-full pointer-events-none"
              style={{ background: "rgba(61,220,151,0.15)", filter: "blur(40px)", transform: "translate(30%,30%)" }} />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5 text-xs font-bold"
                style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", color: "#10b981" }}>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Open to freelance & collaborations
              </div>

              <h2 className="text-3xl md:text-4xl font-extrabold mb-4"
                style={{ fontFamily: "'DM Serif Display', serif", color: darkMode ? "#fff" : "#1a2050" }}>
                Got a project in mind?<br />
                <em className="not-italic" style={{ color: "#6c9fff" }}>Let's build it together.</em>
              </h2>

              <p className="text-sm leading-relaxed max-w-md mx-auto mb-8"
                style={{ color: darkMode ? "rgba(255,255,255,0.5)" : "rgba(30,40,80,0.6)" }}>
                Whether it's a web app, mobile project, or a quick consultation — I'm always
                happy to chat and see how I can help.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <a href="/contact"
                  className="flex items-center gap-2 px-7 py-3 rounded-2xl text-sm font-extrabold text-white transition-all hover:-translate-y-0.5 hover:shadow-xl"
                  style={{ background: "linear-gradient(135deg,#3d6eff,#6c3dff)", boxShadow: "0 8px 32px rgba(61,110,255,0.35)" }}>
                  Start a Conversation
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                  </svg>
                </a>
                <a href="https://github.com/Sakshamkhadka7" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold transition-all hover:-translate-y-0.5"
                  style={{
                    background: darkMode ? "rgba(255,255,255,0.07)" : "rgba(30,40,80,0.06)",
                    border: `1px solid ${darkMode ? "rgba(255,255,255,0.15)" : "rgba(30,40,80,0.15)"}`,
                    color: darkMode ? "rgba(255,255,255,0.7)" : "rgba(30,40,80,0.7)",
                  }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                  GitHub Profile
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;