"use client";

// ─────────────────────────────────────────────────────────────
//  Projects.jsx
//  Path: frontend/src/pages/Projects.jsx
//
//  Previously: used a hardcoded `projects` array
//  Now:        fetches projects from the backend API using axios
//              and shows a loading spinner + error message as needed
// ─────────────────────────────────────────────────────────────

import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import axiosInstance from "../api/axiosInstance"; // our configured axios instance
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

// NOTE: The static projects array has been removed.
// Projects are now fetched from the backend API in the Projects component below.

const statusColors = {
  Live: { bg: "#10b98122", color: "#10b981", dot: "#10b981" },
  "In Progress": { bg: "#f59e0b22", color: "#f59e0b", dot: "#f59e0b" },
  Completed: { bg: "#6c9fff22", color: "#6c9fff", dot: "#6c9fff" },
};

// ── Featured Project Card (large, first two) ──
const FeaturedCard = ({ project, index, darkMode }) => {
  const [ref, inView] = useInView();
  const [hovered, setHovered] = useState(false);
  const isEven = index % 2 === 0;
  const status = statusColors[project.status];

  return (
    <div
      ref={ref}
      className={`relative rounded-3xl overflow-hidden transition-all duration-700 ease-out mb-8 ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}
      style={{ transitionDelay: `${index * 120}ms` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className={`flex flex-col ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"} min-h-[340px]`}
        style={{
          background: darkMode
            ? "rgba(255,255,255,0.04)"
            : "rgba(255,255,255,0.85)",
          border: `1px solid ${hovered ? project.accent + "66" : darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
          boxShadow: hovered
            ? `0 24px 64px ${project.accent}22`
            : darkMode ? "0 8px 32px rgba(0,0,0,0.4)" : "0 8px 32px rgba(0,0,0,0.08)",
          transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)",
          borderRadius: "1.5rem",
        }}
      >
        {/* ── Mockup panel ── */}
        <div
          className="relative lg:w-[45%] min-h-[220px] flex items-center justify-center overflow-hidden"
          style={{
            background: darkMode ? project.mockupDark : project.mockupBg,
            borderRadius: isEven
              ? "1.5rem 0 0 1.5rem"
              : "0 1.5rem 1.5rem 0",
          }}
        >
          {/* Animated grid lines */}
          <div className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `linear-gradient(${project.accent}33 1px, transparent 1px), linear-gradient(90deg, ${project.accent}33 1px, transparent 1px)`,
              backgroundSize: "32px 32px",
              transform: hovered ? "scale(1.05)" : "scale(1)",
              transition: "transform 0.6s ease",
            }}
          />

          {/* Glow orb */}
          <div
            className="absolute w-40 h-40 rounded-full"
            style={{
              background: `radial-gradient(circle, ${project.accent}44 0%, transparent 70%)`,
              filter: "blur(30px)",
              transform: hovered ? "scale(1.3)" : "scale(1)",
              transition: "transform 0.6s ease",
            }}
          />

          {/* Browser chrome mockup */}
          <div
            className="relative z-10 rounded-xl overflow-hidden shadow-2xl"
            style={{
              width: "80%",
              maxWidth: 300,
              transform: hovered ? "translateY(-4px) scale(1.02)" : "translateY(0) scale(1)",
              transition: "transform 0.4s cubic-bezier(0.4,0,0.2,1)",
              border: `1px solid ${project.accent}44`,
            }}
          >
            {/* Browser bar */}
            <div className="flex items-center gap-1.5 px-3 py-2"
              style={{ background: darkMode ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0.08)" }}>
              <div className="w-2.5 h-2.5 rounded-full bg-red-400 opacity-80" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400 opacity-80" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-400 opacity-80" />
              <div className="flex-1 mx-2 h-4 rounded-full text-xs flex items-center px-2"
                style={{ background: darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)", color: "rgba(255,255,255,0.35)", fontSize: 9 }}>
                {project.liveUrl !== "#" ? project.liveUrl.replace("https://","") : "localhost:5173"}
              </div>
            </div>
            {/* Screen content */}
            <div className="relative" style={{ background: darkMode ? project.mockupDark : project.mockupBg, aspectRatio: "16/10" }}>
              {project.image ? (
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <>
                  <div className="p-3 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full" style={{ background: `${project.accent}66` }} />
                      <div className="h-2 w-16 rounded-full" style={{ background: `${project.accent}55` }} />
                      <div className="ml-auto h-2 w-8 rounded-full" style={{ background: "rgba(255,255,255,0.15)" }} />
                    </div>
                    <div className="mt-1 h-3 w-3/4 rounded-full" style={{ background: `${project.accent}44` }} />
                    <div className="h-2 w-1/2 rounded-full" style={{ background: `${project.secondaryAccent}44` }} />
                    <div className="h-2 w-2/3 rounded-full" style={{ background: "rgba(255,255,255,0.1)" }} />
                    <div className="flex gap-2 mt-2">
                      <div className="h-6 w-16 rounded-lg" style={{ background: `${project.accent}66` }} />
                      <div className="h-6 w-14 rounded-lg" style={{ background: "rgba(255,255,255,0.1)" }} />
                    </div>
                    <div className="grid grid-cols-3 gap-1.5 mt-1">
                      {[1,2,3].map(i => (
                        <div key={i} className="rounded-lg" style={{ aspectRatio: "1", background: `${project.accent}${i === 2 ? "44" : "22"}` }} />
                      ))}
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-3 text-4xl opacity-20 select-none">{project.icon}</div>
                </>
              )}
            </div>
          </div>

          {/* Year badge */}
          <div className="absolute top-4 left-4 text-xs font-bold px-2 py-1 rounded-lg"
            style={{ background: `${project.accent}33`, color: project.accent, backdropFilter: "blur(8px)" }}>
            {project.year}
          </div>
        </div>

        {/* ── Info panel ── */}
        <div className="flex-1 p-7 flex flex-col justify-between">
          <div>
            {/* Top row */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1"
                    style={{ background: status.bg, color: status.color }}>
                    <span className="w-1.5 h-1.5 rounded-full inline-block"
                      style={{ background: status.dot, animation: project.status === "Live" ? "pulse 2s infinite" : "none" }} />
                    {project.status}
                  </span>
                </div>
                <h3 className="text-2xl font-extrabold leading-tight"
                  style={{ fontFamily: "'DM Serif Display', serif", color: darkMode ? "#fff" : "#1a2050" }}>
                  {project.title}
                </h3>
                <p className="text-sm font-medium mt-0.5" style={{ color: project.accent }}>
                  {project.subtitle}
                </p>
              </div>
              <span className="text-3xl">{project.icon}</span>
            </div>

            <p className="text-sm leading-relaxed mb-4"
              style={{ color: darkMode ? "rgba(255,255,255,0.5)" : "rgba(30,40,80,0.65)" }}>
              {project.description}
            </p>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {project.features.map(f => (
                <span key={f} className="text-xs px-2.5 py-1 rounded-full font-semibold"
                  style={{
                    background: `${project.accent}15`,
                    color: project.accent,
                    border: `0.5px solid ${project.accent}44`,
                  }}>
                  {f}
                </span>
              ))}
            </div>

            {/* Tech tags */}
            <div className="flex flex-wrap gap-1.5">
              {project.tags.map(tag => (
                <span key={tag} className="text-xs px-2 py-0.5 rounded-full font-medium"
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

          {/* Action buttons */}
          <div className="flex items-center gap-3 mt-5">
            {project.liveUrl !== "#" ? (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:shadow-lg"
                style={{ background: `linear-gradient(135deg, ${project.accent}, ${project.secondaryAccent})` }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
                Live Demo
              </a>
            ) : (
              <span className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold opacity-40 cursor-not-allowed"
                style={{ background: darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)", color: darkMode ? "#fff" : "#1a2050" }}>
                Coming Soon
              </span>
            )}
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5"
              style={{
                background: "transparent",
                border: `0.5px solid ${darkMode ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)"}`,
                color: darkMode ? "rgba(255,255,255,0.6)" : "rgba(30,40,80,0.65)",
              }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Small Project Card (grid, remaining) ──
const SmallCard = ({ project, index, darkMode }) => {
  const [ref, inView] = useInView();
  const [hovered, setHovered] = useState(false);
  const status = statusColors[project.status];

  return (
    <div
      ref={ref}
      className={`rounded-2xl p-5 flex flex-col transition-all duration-600 ease-out cursor-default ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      style={{
        transitionDelay: `${index * 100}ms`,
        background: darkMode ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.85)",
        border: `1px solid ${hovered ? project.accent + "55" : darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
        boxShadow: hovered
          ? `0 16px 48px ${project.accent}22`
          : darkMode ? "0 4px 20px rgba(0,0,0,0.3)" : "0 4px 20px rgba(0,0,0,0.07)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Top */}
      <div className="flex items-center justify-between mb-3">
        <div className="text-3xl">{project.icon}</div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1"
            style={{ background: status.bg, color: status.color }}>
            <span className="w-1.5 h-1.5 rounded-full"
              style={{ background: status.dot, display: "inline-block" }} />
            {project.status}
          </span>
          <span className="text-xs font-bold" style={{ color: "rgba(255,255,255,0.25)" }}>
            {project.year}
          </span>
        </div>
      </div>

      {/* Title */}
      <h4 className="text-lg font-extrabold mb-0.5"
        style={{ fontFamily: "'DM Serif Display', serif", color: darkMode ? "#fff" : "#1a2050" }}>
        {project.title}
      </h4>
      <p className="text-xs font-semibold mb-2" style={{ color: project.accent }}>
        {project.subtitle}
      </p>
      <p className="text-xs leading-relaxed mb-3 flex-1"
        style={{ color: darkMode ? "rgba(255,255,255,0.45)" : "rgba(30,40,80,0.6)" }}>
        {project.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1 mb-4">
        {project.tags.slice(0, 3).map(tag => (
          <span key={tag} className="text-xs px-2 py-0.5 rounded-full"
            style={{
              background: darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
              color: darkMode ? "rgba(255,255,255,0.5)" : "rgba(30,40,80,0.55)",
              border: `0.5px solid ${darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}`,
            }}>
            {tag}
          </span>
        ))}
        {project.tags.length > 3 && (
          <span className="text-xs px-2 py-0.5 rounded-full"
            style={{ color: project.accent, background: `${project.accent}15` }}>
            +{project.tags.length - 3}
          </span>
        )}
      </div>
 
     
      <div className="flex gap-2 mt-auto">
      
        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
          className="flex-1 text-center py-2 rounded-xl text-xs font-bold text-white transition-all hover:opacity-90"
          style={{ background: `linear-gradient(135deg, ${project.accent}, ${project.secondaryAccent})` }}>
          {project.liveUrl !== "#" ? "Live Demo" : "Coming Soon"}
        </a>
        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
          className="px-3 py-2 rounded-xl text-xs font-bold transition-all hover:opacity-80"
          style={{
            background: "transparent",
            border: `0.5px solid ${darkMode ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)"}`,
            color: darkMode ? "rgba(255,255,255,0.6)" : "rgba(30,40,80,0.65)",
          }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"/>
          </svg>
        </a>
      </div>
    </div>
  );
};

// ── Filter tabs ──
const FILTERS = ["All", "Mobile"];

// Moved outside component so they can be used for server-supplied initialProjects
const toUrl = (url) => {
  if (!url || url === "#") return "#";
  if (/^https?:\/\//i.test(url)) return url;
  return `https://${url}`;
};

const normalize = (p) => ({
  ...p,
  id:              p._id || p.id,
  status:          p.status || "Completed",
  icon:            p.icon || p.emoji || "💻",
  accent:          p.accent || "#6c9fff",
  secondaryAccent: p.secondaryAccent || p.accent || "#6c3dff",
  mockupBg:        p.mockupBg  || `${p.accent || "#6c9fff"}18`,
  mockupDark:      p.mockupDark || "rgba(0,0,0,0.5)",
  year:            p.year || (p.createdAt ? new Date(p.createdAt).getFullYear().toString() : ""),
  category:        p.category || "Full Stack",
  subtitle:        p.subtitle || p.excerpt || "",
  features:        Array.isArray(p.features) ? p.features : [],
  tags:            Array.isArray(p.tags) ? p.tags : [],
  liveUrl:         toUrl(p.liveUrl),
  githubUrl:       toUrl(p.githubUrl),
});

const Projects = ({ initialProjects = null }) => {
  const { darkMode } = useTheme();
  const [activeFilter, setActiveFilter] = useState("All");

  const [projects, setProjects] = useState(
    Array.isArray(initialProjects) ? initialProjects.map(normalize) : []
  );
  const [loading, setLoading] = useState(!initialProjects);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      if (initialProjects) return; // server already supplied data — skip client fetch
      try {
        setLoading(true);
        setError(null);
        const response = await axiosInstance.get("/projects");
        const data = response.data?.data ?? response.data;
        setProjects(Array.isArray(data) ? data.map(normalize) : []);
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Failed to load projects.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const filtered = activeFilter === "All"
    ? projects
    : projects.filter(p => p.category === activeFilter);

  const featured = filtered.slice(0, 2);
  const grid = filtered.slice(2);

  // ── Early returns for loading / error ──────────────────────
  // Show spinner while the API request is in-flight
  if (loading) {
    return (
      <section
        className="min-h-screen flex items-center justify-center"
        style={{
          background: darkMode
            ? "linear-gradient(160deg, #0a0f1e 0%, #0d1533 60%, #0a0f1e 100%)"
            : "linear-gradient(160deg, #f0f4ff 0%, #e8eeff 60%, #f5f0ff 100%)",
        }}
      >
        <Spinner message="Fetching Projects..." darkMode={darkMode} />
      </section>
    );
  }

  // Show a friendly error banner if the API call failed
  if (error) {
    return (
      <section
        className="min-h-screen flex items-center justify-center px-6"
        style={{
          background: darkMode
            ? "linear-gradient(160deg, #0a0f1e 0%, #0d1533 60%, #0a0f1e 100%)"
            : "linear-gradient(160deg, #f0f4ff 0%, #e8eeff 60%, #f5f0ff 100%)",
        }}
      >
        <div
          className="text-center max-w-md px-8 py-10 rounded-2xl"
          style={{
            background: darkMode ? "rgba(255,80,80,0.07)" : "rgba(255,80,80,0.05)",
            border: "1px solid rgba(255,80,80,0.25)",
          }}
        >
          <p className="text-3xl mb-3">⚠️</p>
          <p className="text-sm font-bold mb-1" style={{ color: "#f87171" }}>
            Could not load projects
          </p>
          <p className="text-xs" style={{ color: darkMode ? "rgba(255,255,255,0.4)" : "rgba(30,40,80,0.5)" }}>
            {error}
          </p>
          {/* Retry button — re-runs fetchProjects by toggling a reload state */}
          <button
            onClick={() => window.location.reload()}
            className="mt-5 px-5 py-2 rounded-xl text-xs font-bold text-white"
            style={{ background: "linear-gradient(135deg,#3d6eff,#6c3dff)" }}
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  return (
    <section
      className="min-h-screen px-4 md:px-14 py-20 relative overflow-hidden"
      style={{
        background: darkMode
          ? "linear-gradient(160deg, #0a0f1e 0%, #0d1533 60%, #0a0f1e 100%)"
          : "linear-gradient(160deg, #f0f4ff 0%, #e8eeff 60%, #f5f0ff 100%)",
      }}
    >
      
      {/* Glow orbs */}
      <div className="absolute top-10 right-0 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "rgba(108,159,255,0.08)", filter: "blur(100px)" }} />
      <div className="absolute bottom-20 left-0 w-72 h-72 rounded-full pointer-events-none"
        style={{ background: "rgba(232,93,4,0.07)", filter: "blur(90px)" }} />
      <div className="absolute top-1/2 left-1/2 w-56 h-56 rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2"
        style={{ background: "rgba(139,92,246,0.06)", filter: "blur(80px)" }} />

      <div className="max-w-5xl mx-auto">

        {/* ── Header ── */}
        <div
          className="text-center mb-14"
        >
          <p className="text-xs uppercase tracking-[0.3em] font-bold mb-3"
            style={{ color: "#6c9fff" }}>
            What I've Built
          </p>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4"
            style={{ fontFamily: "'DM Serif Display', serif", color: darkMode ? "#fff" : "#1a2050" }}>
            My <em className="not-italic" style={{ color: "#6c9fff" }}>Projects</em>
          </h2>
          <p className="text-sm leading-relaxed max-w-lg mx-auto mb-8"
            style={{ color: darkMode ? "rgba(255,255,255,0.45)" : "rgba(30,40,80,0.6)" }}>
            A collection of real-world apps built across semesters — from restaurant platforms
            to IT institutions, mobile apps to full-stack systems.
          </p>

          {/* Filter tabs */}
          <div className="inline-flex rounded-2xl p-1 gap-1"
            style={{
              background: darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
              border: `0.5px solid ${darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
            }}>
            {FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className="px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200"
                style={{
                  background: activeFilter === f
                    ? "linear-gradient(135deg, #3d6eff, #6c3dff)"
                    : "transparent",
                  color: activeFilter === f
                    ? "#fff"
                    : darkMode ? "rgba(255,255,255,0.5)" : "rgba(30,40,80,0.55)",
                  boxShadow: activeFilter === f ? "0 4px 16px rgba(61,110,255,0.35)" : "none",
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* ── Featured (large) cards ── */}
        {featured.map((project, i) => (
          <FeaturedCard key={project._id || project.id || i} project={project} index={i} darkMode={darkMode} />
        ))}

        {/* ── Grid cards ── */}
        {grid.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-4">
            {grid.map((project, i) => (
              <SmallCard key={project._id || project.id || i} project={project} index={i} darkMode={darkMode} />
            ))}
          </div>
        )}

        {/* ── Bottom CTA ── */}
        <div className="text-center mt-16">
          <p className="text-sm mb-4" style={{ color: darkMode ? "rgba(255,255,255,0.35)" : "rgba(30,40,80,0.45)" }}>
            More projects on the way as I level up each semester
          </p>
          <a
            href="https://github.com/Sakshamkhadka7"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold transition-all hover:-translate-y-0.5 hover:shadow-xl"
            style={{
              background: darkMode ? "rgba(255,255,255,0.06)" : "rgba(30,40,80,0.06)",
              border: `0.5px solid ${darkMode ? "rgba(255,255,255,0.15)" : "rgba(30,40,80,0.15)"}`,
              color: darkMode ? "rgba(255,255,255,0.7)" : "rgba(30,40,80,0.7)",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            View All on GitHub
          </a>
        </div>

      </div>
    </section>
  );
};

export default Projects;