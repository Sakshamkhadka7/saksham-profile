// ─────────────────────────────────────────────────────────────
//  Blog.jsx
//  Path: frontend/src/pages/Blog.jsx
//
//  WHAT THIS FILE DOES:
//  ─────────────────────
//  1. Fetches blog posts from GET /api/blogs on mount (useEffect).
//  2. Shows a Spinner while loading, an error card on failure.
//  3. Renders a featured post (blog.featured === true), a filterable
//     2-column grid, and a sidebar (popular posts, tag cloud, newsletter).
//  4. Categories and tags are built dynamically from API data — no hardcoded arrays.
//  5. Uses Framer Motion for entrance animations and tab/filter transitions.
//
//  BACKEND ROUTE:  GET /api/blogs
//  SERVICE FILE:   frontend/src/services/blogService.js
// ─────────────────────────────────────────────────────────────

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
// motion       → animated wrapper div/button/etc.
// AnimatePresence → lets components animate OUT before being removed
// useInView    → returns true once a ref enters the viewport
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { fetchBlogs } from "../services/blogService";
import Spinner from "../components/Spinner";
import SEO from "../components/SEO";

// ESLint doesn't track JSX member expressions (motion.div) as variable usage,
// so we reference motion once here to prevent a false "defined but never used" error.
// _MotionTypes starts with _ which the project's varsIgnorePattern (^[A-Z_]) allows unused.
const _MotionTypes = { div: motion.div, button: motion.button };

// ── formatDate ────────────────────────────────────────────────
// Converts an ISO date string ("2025-04-12T10:00:00Z") or a plain
// date string ("April 12, 2025") into a human-readable format.
// Falls back to the raw string if parsing fails.
const formatDate = (date) => {
  if (!date) return "";
  try {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return date;
  }
};

// ── MiniProgress ──────────────────────────────────────────────
// Thin colour bar used as a reading-progress visual inside cards.
const MiniProgress = ({ pct, color }) => (
  <div className="h-0.5 rounded-full overflow-hidden"
    style={{ background: "rgba(255,255,255,0.08)" }}>
    <div className="h-full rounded-full transition-all duration-700"
      style={{ width: `${pct}%`, background: color }} />
  </div>
);

// ── FeaturedCard ──────────────────────────────────────────────
//  The large hero card for the blog with featured:true.
//
//  Left panel:
//    • If blog.image exists → shows the Cloudinary cover photo.
//    • Otherwise → animated grid + big emoji (decorative fallback).
//
//  Right panel:
//    • Date, readTime, views, author (if provided)
//    • Title, excerpt/description, tags
//    • "Read Article" CTA + like button
//
//  WHY useRef + useInView here?
//    useInView (from framer-motion) watches a DOM element and returns
//    true once it scrolls into the viewport. We pass that boolean to
//    motion.div's `animate` prop so the card fades/slides in on scroll.
const FeaturedCard = ({ blog, darkMode }) => {
  // ref is attached to the motion.div so useInView can observe it
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.08 });

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(blog.likes ?? 0);
  const [hovered, setHovered] = useState(false);

  // Toggle like — stopPropagation so clicking the button doesn't
  // also trigger the parent card's onClick (if any).
  const toggleLike = (e) => {
    e.stopPropagation();
    setLiked(p => !p);
    setLikeCount(p => liked ? p - 1 : p + 1);
  };

  const accent = blog.accent || "#6c9fff";
  const displayDate = formatDate(blog.date);

  return (
    <motion.div
      ref={ref}
      // Start invisible and 32px below, animate to visible at position
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      className="relative rounded-3xl overflow-hidden mb-6 cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: darkMode
          ? `linear-gradient(135deg, rgba(255,255,255,0.05) 0%, ${accent}18 100%)`
          : `linear-gradient(135deg, rgba(255,255,255,0.9) 0%, ${accent}12 100%)`,
        border: `1px solid ${hovered ? accent + "66" : darkMode ? "rgba(255,255,255,0.09)" : "rgba(0,0,0,0.08)"}`,
        boxShadow: hovered
          ? `0 24px 64px ${accent}25`
          : darkMode ? "0 8px 40px rgba(0,0,0,0.45)" : "0 8px 40px rgba(0,0,0,0.08)",
        transition: "border 0.4s cubic-bezier(0.4,0,0.2,1), box-shadow 0.4s cubic-bezier(0.4,0,0.2,1)",
      }}
    >
      {/* Featured ribbon */}
      <div className="absolute top-5 left-5 flex items-center gap-2 z-10">
        <span className="text-xs font-extrabold uppercase tracking-[0.15em] px-3 py-1 rounded-full"
          style={{ background: `linear-gradient(135deg, ${accent}, ${accent}aa)`, color: "#fff" }}>
          ✦ Featured
        </span>
      </div>

      <div className="flex flex-col lg:flex-row min-h-[260px]">

        {/* ── Left: cover image or emoji decoration ── */}
        <div
          className="relative lg:w-[38%] min-h-[180px] flex items-center justify-center overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${accent}22 0%, ${accent}08 100%)` }}
        >
          {blog.image ? (
            // Actual cover image from Cloudinary / backend storage
            <img
              src={blog.image}
              alt={blog.title}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover absolute inset-0"
              style={{
                transform: hovered ? "scale(1.05)" : "scale(1)",
                transition: "transform 0.7s ease",
              }}
            />
          ) : (
            // Fallback decorative panel when no image is provided
            <>
              {/* Animated grid pattern */}
              <div className="absolute inset-0"
                style={{
                  backgroundImage: `linear-gradient(${accent}18 1px, transparent 1px), linear-gradient(90deg, ${accent}18 1px, transparent 1px)`,
                  backgroundSize: "28px 28px",
                  transform: hovered ? "scale(1.04)" : "scale(1)",
                  transition: "transform 0.7s ease",
                }} />
              {/* Central glow blob */}
              <div className="absolute w-48 h-48 rounded-full"
                style={{
                  background: `radial-gradient(circle, ${accent}30 0%, transparent 70%)`,
                  filter: "blur(24px)",
                  transform: hovered ? "scale(1.3)" : "scale(1)",
                  transition: "transform 0.6s ease",
                }} />
              {/* Big emoji */}
              <span
                className="relative z-10 select-none"
                style={{
                  fontSize: 72,
                  filter: `drop-shadow(0 0 24px ${accent}66)`,
                  transform: hovered ? "scale(1.1) rotate(-4deg)" : "scale(1) rotate(0deg)",
                  transition: "transform 0.4s cubic-bezier(0.4,0,0.2,1)",
                }}>
                {blog.emoji || "📝"}
              </span>
            </>
          )}

          {/* Category badge — always visible over both image and emoji */}
          <div className="absolute bottom-4 left-4 text-xs font-bold px-2.5 py-1 rounded-xl z-10"
            style={{
              background: `${accent}33`,
              color: accent,
              backdropFilter: "blur(8px)",
              border: `0.5px solid ${accent}44`,
            }}>
            {blog.category}
          </div>
        </div>

        {/* ── Right: article content ── */}
        <div className="flex-1 p-7 flex flex-col justify-between">
          <div>
            {/* Meta row: date · readTime · views · author */}
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <span className="text-xs"
                style={{ color: darkMode ? "rgba(255,255,255,0.35)" : "rgba(30,40,80,0.45)" }}>
                {displayDate}
              </span>
              <span style={{ color: darkMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)" }}>·</span>
              <span className="text-xs font-semibold" style={{ color: accent }}>
                {blog.readTime}
              </span>
              <span style={{ color: darkMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)" }}>·</span>
              <span className="text-xs"
                style={{ color: darkMode ? "rgba(255,255,255,0.35)" : "rgba(30,40,80,0.4)" }}>
                👁 {blog.views ?? 0}
              </span>
              {/* Author — shown only when the API provides it */}
              {blog.author && (
                <>
                  <span style={{ color: darkMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)" }}>·</span>
                  <span className="text-xs font-semibold"
                    style={{ color: darkMode ? "rgba(255,255,255,0.55)" : "rgba(30,40,80,0.65)" }}>
                    ✍️ {blog.author}
                  </span>
                </>
              )}
            </div>

            <h2
              className="font-extrabold leading-tight mb-3"
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "clamp(1.2rem, 2.5vw, 1.6rem)",
                color: darkMode ? "#fff" : "#1a2050",
              }}
            >
              {blog.title}
            </h2>

            {/* excerpt or description — both field names are supported */}
            <p className="text-sm leading-relaxed mb-4"
              style={{ color: darkMode ? "rgba(255,255,255,0.5)" : "rgba(30,40,80,0.65)" }}>
              {blog.excerpt || blog.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-5">
              {(blog.tags || []).map(tag => (
                <span key={tag} className="text-xs px-2.5 py-1 rounded-full font-semibold"
                  style={{
                    background: `${accent}18`,
                    color: accent,
                    border: `0.5px solid ${accent}44`,
                  }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Footer: CTA + like button */}
          <div className="flex items-center justify-between">
            <a
              href="#"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:shadow-lg"
              style={{ background: `linear-gradient(135deg, ${accent}, ${accent}bb)` }}
              onClick={e => e.preventDefault()}
            >
              Read Article
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
            <button
              onClick={toggleLike}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all hover:scale-105"
              style={{
                background: liked ? `${accent}22` : darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
                color: liked ? accent : darkMode ? "rgba(255,255,255,0.45)" : "rgba(30,40,80,0.5)",
                border: `0.5px solid ${liked ? accent + "55" : darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}`,
              }}
            >
              <span style={{ transform: liked ? "scale(1.3)" : "scale(1)", transition: "transform 0.2s" }}>
                {liked ? "❤️" : "🤍"}
              </span>
              {likeCount}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ── BlogCard ──────────────────────────────────────────────────
//  Regular (non-featured) blog post card.
//
//  Layout adapts based on whether the API provides a cover image:
//    • WITH image  → full-width thumbnail at top, then text below.
//    • WITHOUT image → emoji icon + category header (original style).
//
//  WHY index prop?
//    Used to stagger the entrance delay: card 0 appears first, card 1
//    slightly after, etc. This creates a cascading reveal effect.
const BlogCard = ({ blog, index, darkMode }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.08 });

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(blog.likes ?? 0);
  const [hovered, setHovered] = useState(false);

  const toggleLike = (e) => {
    e.stopPropagation();
    setLiked(p => !p);
    setLikeCount(p => liked ? p - 1 : p + 1);
  };

  const accent = blog.accent || "#6c9fff";
  const displayDate = formatDate(blog.date);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      // Stagger: each card in the row starts slightly after the previous
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1], delay: (index % 3) * 0.09 }}
      className="relative rounded-2xl overflow-hidden flex flex-col cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: darkMode ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.88)",
        border: `1px solid ${hovered ? accent + "55" : darkMode ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}`,
        boxShadow: hovered
          ? `0 16px 48px ${accent}20`
          : darkMode ? "0 4px 24px rgba(0,0,0,0.35)" : "0 4px 24px rgba(0,0,0,0.07)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        transition: "border 0.35s cubic-bezier(0.4,0,0.2,1), box-shadow 0.35s cubic-bezier(0.4,0,0.2,1), transform 0.35s cubic-bezier(0.4,0,0.2,1)",
      }}
    >
      {/* Top accent line — expands on hover */}
      <div className="h-0.5 w-full"
        style={{
          background: `linear-gradient(90deg, ${accent}, transparent)`,
          transform: hovered ? "scaleX(1)" : "scaleX(0.4)",
          transformOrigin: "left",
          transition: "transform 0.4s ease",
        }} />

      {/* ── Cover image (shown when blog.image is provided) ── */}
      {blog.image && (
        <div className="relative w-full h-36 overflow-hidden">
          <img
            src={blog.image}
            alt={blog.title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover"
            style={{
              transform: hovered ? "scale(1.06)" : "scale(1)",
              transition: "transform 0.6s ease",
            }}
          />
          {/* Gradient overlay fades image into card background */}
          <div className="absolute inset-0"
            style={{
              background: `linear-gradient(to bottom, transparent 40%, ${darkMode ? "rgba(15,20,40,0.6)" : "rgba(240,244,255,0.5)"} 100%)`,
            }} />
          {/* Category label over image */}
          <div className="absolute bottom-2 left-3 text-xs font-extrabold uppercase tracking-[0.12em]"
            style={{ color: accent }}>
            {blog.category}
          </div>
        </div>
      )}

      {/* ── Emoji + category header (fallback when no image) ── */}
      {!blog.image && (
        <div
          className="relative flex items-center justify-between px-5 pt-5 pb-4 overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${accent}14 0%, transparent 80%)` }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center text-2xl shrink-0"
              style={{
                background: `${accent}20`,
                border: `1px solid ${accent}33`,
                transform: hovered ? "rotate(-6deg) scale(1.08)" : "rotate(0deg) scale(1)",
                transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1)",
              }}
            >
              {blog.emoji || "📝"}
            </div>
            <div>
              <span className="text-xs font-extrabold uppercase tracking-[0.12em]"
                style={{ color: accent }}>
                {blog.category}
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs"
                  style={{ color: darkMode ? "rgba(255,255,255,0.3)" : "rgba(30,40,80,0.4)" }}>
                  {displayDate}
                </span>
              </div>
            </div>
          </div>
          <div className="text-right flex flex-col items-end gap-1">
            <span className="text-xs font-bold px-2 py-0.5 rounded-full"
              style={{ background: `${accent}20`, color: accent }}>
              {blog.readTime}
            </span>
            <span className="text-xs"
              style={{ color: darkMode ? "rgba(255,255,255,0.25)" : "rgba(30,40,80,0.35)" }}>
              👁 {blog.views ?? 0}
            </span>
          </div>
        </div>
      )}

      {/* ── Card body ── */}
      <div className="px-5 pb-4 flex-1 flex flex-col">
        {/* Date + readTime row — only shown below the image variant */}
        {blog.image && (
          <div className="flex items-center gap-2 mt-4 mb-2 flex-wrap">
            <span className="text-xs"
              style={{ color: darkMode ? "rgba(255,255,255,0.3)" : "rgba(30,40,80,0.4)" }}>
              {displayDate}
            </span>
            <span style={{ color: darkMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)" }}>·</span>
            <span className="text-xs font-bold" style={{ color: accent }}>{blog.readTime}</span>
            <span style={{ color: darkMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)" }}>·</span>
            <span className="text-xs"
              style={{ color: darkMode ? "rgba(255,255,255,0.25)" : "rgba(30,40,80,0.35)" }}>
              👁 {blog.views ?? 0}
            </span>
          </div>
        )}

        <h3
          className="font-extrabold text-base leading-snug mb-2"
          style={{
            fontFamily: "'DM Serif Display', serif",
            color: darkMode ? "#fff" : "#1a2050",
            transition: "color 0.2s",
          }}
        >
          {blog.title}
        </h3>

        {/* excerpt or description — both field names supported */}
        <p className="text-xs leading-relaxed mb-3 flex-1"
          style={{ color: darkMode ? "rgba(255,255,255,0.45)" : "rgba(30,40,80,0.6)" }}>
          {blog.excerpt || blog.description}
        </p>

        {/* Author — shown only if provided by API */}
        {blog.author && (
          <p className="text-xs font-semibold mb-3"
            style={{ color: darkMode ? "rgba(255,255,255,0.4)" : "rgba(30,40,80,0.5)" }}>
            ✍️ {blog.author}
          </p>
        )}

        {/* Tags — show max 3, then +N badge */}
        <div className="flex flex-wrap gap-1 mb-4">
          {(blog.tags || []).slice(0, 3).map(tag => (
            <span key={tag} className="text-xs px-2 py-0.5 rounded-full"
              style={{
                background: darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
                color: darkMode ? "rgba(255,255,255,0.5)" : "rgba(30,40,80,0.55)",
                border: `0.5px solid ${darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}`,
              }}>
              {tag}
            </span>
          ))}
          {(blog.tags || []).length > 3 && (
            <span className="text-xs px-2 py-0.5 rounded-full"
              style={{ color: accent, background: `${accent}15` }}>
              +{blog.tags.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* ── Footer: Read More + like ── */}
      <div className="px-5 pb-5 flex items-center justify-between gap-2 mt-auto">
        <a href="#"
          className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider transition-all"
          style={{ color: accent }}
          onClick={e => e.preventDefault()}
        >
          Read More
          <svg
            width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
            style={{
              transform: hovered ? "translateX(3px)" : "translateX(0)",
              transition: "transform 0.25s ease",
            }}
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </a>
        <button
          onClick={toggleLike}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all hover:scale-105"
          style={{
            background: liked ? `${accent}22` : darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
            color: liked ? accent : darkMode ? "rgba(255,255,255,0.4)" : "rgba(30,40,80,0.5)",
            border: `0.5px solid ${liked ? accent + "44" : darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)"}`,
          }}
        >
          <span style={{ transform: liked ? "scale(1.3)" : "scale(1)", transition: "transform 0.2s", display: "inline-block" }}>
            {liked ? "❤️" : "🤍"}
          </span>
          {likeCount}
        </button>
      </div>

      {/* Hover glow overlay */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at top left, ${accent}10 0%, transparent 60%)`,
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.4s ease",
        }}
      />
    </motion.div>
  );
};

// ── SearchBar ─────────────────────────────────────────────────
//  Controlled text input for filtering posts by title/excerpt/tags.
//  `value` and `onChange` are controlled by the parent (Blog component).
const SearchBar = ({ value, onChange, darkMode }) => (
  <div className="relative max-w-sm w-full">
    <div className="absolute left-3 top-1/2 -translate-y-1/2"
      style={{ color: darkMode ? "rgba(255,255,255,0.3)" : "rgba(30,40,80,0.35)" }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    </div>
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder="Search articles..."
      className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm font-medium outline-none transition-all"
      style={{
        background: darkMode ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.9)",
        border: `1px solid ${darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
        color: darkMode ? "#fff" : "#1a2050",
        caretColor: "#6c9fff",
      }}
    />
    {/* Clear button appears only when there's text */}
    {value && (
      <button
        className="absolute right-3 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-60"
        style={{ color: darkMode ? "rgba(255,255,255,0.4)" : "rgba(30,40,80,0.4)" }}
        onClick={() => onChange("")}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    )}
  </div>
);

// ── SidebarCard ───────────────────────────────────────────────
//  Compact card for the "Popular Posts" sidebar section.
//  Shows a thumbnail (image or emoji), title, readTime, views.
const SidebarCard = ({ blog, darkMode }) => {
  const accent = blog.accent || "#6c9fff";
  return (
    <div
      className="flex items-start gap-3 p-3 rounded-xl transition-all hover:-translate-y-0.5 cursor-pointer group"
      style={{
        background: darkMode ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.7)",
        border: `0.5px solid ${darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
      }}
    >
      {/* Thumbnail: real image if available, emoji otherwise */}
      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0 overflow-hidden"
        style={{ background: `${accent}20` }}>
        {blog.image ? (
          <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          blog.emoji || "📝"
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold leading-snug line-clamp-2 mb-1 group-hover:text-blue-400 transition-colors"
          style={{ color: darkMode ? "rgba(255,255,255,0.8)" : "#1a2050" }}>
          {blog.title}
        </p>
        <div className="flex items-center gap-2">
          <span className="text-xs" style={{ color: accent }}>{blog.readTime}</span>
          <span className="text-xs"
            style={{ color: darkMode ? "rgba(255,255,255,0.25)" : "rgba(30,40,80,0.35)" }}>
            · 👁 {blog.views ?? 0}
          </span>
        </div>
      </div>
    </div>
  );
};

// ── Blog (main page component) ────────────────────────────────
//
//  STATE:
//    blogs         → raw array fetched from /api/blogs
//    loading       → true while API call is in flight
//    error         → error message string if API call failed
//    activeCategory → which category tab is selected ("All" by default)
//    search        → text typed in the search box
//
//  DERIVED (useMemo — recalculates only when dependencies change):
//    featured    → blog with featured:true (shown as hero card)
//    rest        → all non-featured blogs (shown in grid)
//    categories  → ["All", ...unique categories from API data]
//    filtered    → rest filtered by activeCategory + search
//    popular     → top 4 blogs sorted by likes (sidebar)
//    allTags     → unique tag strings for tag cloud (sidebar)
//    totalViews  → sum of all blog view counts
const Blog = () => {
  const { darkMode } = useTheme();

  // ── State ────────────────────────────────────────────────────
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  // Refs for scroll-triggered entrance animations
  const sidebarRef = useRef(null);
  const sidebarInView = useInView(sidebarRef, { once: true, amount: 0.1 });

  // ── Fetch blogs ───────────────────────────────────────────────
  // useCallback: memoises the function so it doesn't re-create on every render.
  // This lets us safely put it in the useEffect dependency array.
  const loadBlogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchBlogs();
      // Guard: ensure we always store an array even if API returns something unexpected
      setBlogs(Array.isArray(data) ? data : []);
    } catch (err) {
      // Show the backend's message if available, otherwise a generic fallback
      setError(err?.response?.data?.message || err?.message || "Failed to load blogs");
    } finally {
      // Always stop the spinner whether the request succeeded or failed
      setLoading(false);
    }
  }, []);

  // useEffect runs loadBlogs once when the component first mounts.
  // This is the correct place for API calls — never call async code
  // directly at the top level of a component.
  useEffect(() => {
    loadBlogs();
  }, [loadBlogs]);

  // ── Derived data ──────────────────────────────────────────────
  const featured = useMemo(() => blogs.find(b => b.featured) || null, [blogs]);
  const rest = useMemo(() => blogs.filter(b => !b.featured), [blogs]);

  // Build category list dynamically from what the API returns.
  // new Set() removes duplicates; filter(Boolean) removes null/undefined.
  const categories = useMemo(
    () => ["All", ...new Set(blogs.map(b => b.category).filter(Boolean))],
    [blogs]
  );

  // Filtered posts for the main grid
  const filtered = useMemo(() => {
    let list = activeCategory === "All" ? rest : rest.filter(b => b.category === activeCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(b =>
        b.title?.toLowerCase().includes(q) ||
        (b.excerpt || b.description || "").toLowerCase().includes(q) ||
        (b.tags || []).some(t => t.toLowerCase().includes(q))
      );
    }
    return list;
  }, [rest, activeCategory, search]);

  // Sidebar popular posts: sorted by likes, top 4
  const popular = useMemo(
    () => [...blogs].sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0)).slice(0, 4),
    [blogs]
  );

  // All unique tags from all posts (for tag cloud)
  const allTags = useMemo(
    () => [...new Set(blogs.flatMap(b => b.tags || []))],
    [blogs]
  );

  // Total views — handles both "2.1k" strings and plain numbers
  const totalViews = useMemo(() => {
    const total = blogs.reduce((acc, b) => {
      const v = b.views;
      if (!v) return acc;
      // If stored as raw number (e.g. 2100), convert to k (2.1)
      if (typeof v === "number") return acc + v / 1000;
      // If stored as string "2.1k", parseFloat gives 2.1
      return acc + parseFloat(v);
    }, 0);
    return total.toFixed(1);
  }, [blogs]);

  // ── Loading screen ────────────────────────────────────────────
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
        <Spinner message="Loading articles..." darkMode={darkMode} />
      </section>
    );
  }

  // ── Error screen ──────────────────────────────────────────────
  if (error) {
    return (
      <section
        className="min-h-screen flex items-center justify-center px-4"
        style={{
          background: darkMode
            ? "linear-gradient(160deg, #0a0f1e 0%, #0d1533 60%, #0a0f1e 100%)"
            : "linear-gradient(160deg, #f0f4ff 0%, #e8eeff 60%, #f5f0ff 100%)",
        }}
      >
        <div className="text-center max-w-sm">
          <div className="text-5xl mb-4">📡</div>
          <p className="font-bold mb-2" style={{ color: darkMode ? "#fff" : "#1a2050" }}>
            Couldn't load articles
          </p>
          <p className="text-sm mb-6"
            style={{ color: darkMode ? "rgba(255,255,255,0.45)" : "rgba(30,40,80,0.55)" }}>
            {error}
          </p>
          <button
            onClick={loadBlogs}
            className="px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:shadow-lg"
            style={{ background: "linear-gradient(135deg, #3d6eff, #6c3dff)" }}
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  // ── Main render ───────────────────────────────────────────────
  return (
    <section
      className="min-h-screen px-4 md:px-14 py-20 relative overflow-hidden"
      style={{
        background: darkMode
          ? "linear-gradient(160deg, #0a0f1e 0%, #0d1533 60%, #0a0f1e 100%)"
          : "linear-gradient(160deg, #f0f4ff 0%, #e8eeff 60%, #f5f0ff 100%)",
      }}
    >
      <SEO
        title="Blog | Saksham Khadka — Web Development Articles Nepal"
        description="Read web development articles and tutorials by Saksham Khadka. Topics include React, Node.js, MongoDB, full-stack development, and MERN stack tips."
        keywords="Saksham Khadka Blog, React tutorials Nepal, Node.js articles, MERN Stack blog, Web development Nepal, JavaScript tips"
        canonical="/blog"
      />
      {/* Background glow orbs */}
      <div className="absolute top-16 right-0 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: "rgba(108,159,255,0.08)", filter: "blur(100px)" }} />
      <div className="absolute bottom-24 left-0 w-72 h-72 rounded-full pointer-events-none"
        style={{ background: "rgba(245,158,11,0.07)", filter: "blur(90px)" }} />
      <div className="absolute top-1/2 left-1/2 w-56 h-56 rounded-full pointer-events-none"
        style={{ background: "rgba(16,185,129,0.05)", filter: "blur(80px)" }} />

      <div className="max-w-6xl mx-auto">

        {/* ── Page header ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="text-center mb-12"
        >
          <p className="text-xs uppercase tracking-[0.3em] font-bold mb-3" style={{ color: "#6c9fff" }}>
            Dev Journal
          </p>
          <h2
            className="text-4xl md:text-5xl font-extrabold mb-4"
            style={{ fontFamily: "'DM Serif Display', serif", color: darkMode ? "#fff" : "#1a2050" }}
          >
            Thoughts &{" "}
            <em className="not-italic" style={{ color: "#f59e0b" }}>Writings</em>
          </h2>
          <p className="text-sm leading-relaxed max-w-md mx-auto mb-8"
            style={{ color: darkMode ? "rgba(255,255,255,0.45)" : "rgba(30,40,80,0.6)" }}>
            Real lessons from real projects. No fluff — just what I've learned
            building full-stack apps as a BCSIT student in Kathmandu.
          </p>

          {/* Dynamic stats — computed from API data */}
          <div className="flex flex-wrap justify-center gap-5 mb-8">
            {[
              { label: "Articles", value: blogs.length, color: "#6c9fff" },
              { label: "Total Views", value: `${totalViews}k`, color: "#f59e0b" },
              { label: "Categories", value: categories.length - 1, color: "#3ddc97" },
            ].map(stat => (
              <div key={stat.label} className="flex items-center gap-2">
                <span className="text-xl font-extrabold" style={{ color: stat.color }}>
                  {stat.value}
                </span>
                <span className="text-xs uppercase tracking-wider"
                  style={{ color: darkMode ? "rgba(255,255,255,0.35)" : "rgba(30,40,80,0.45)" }}>
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

          {/* Category filter tabs + search bar */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 flex-wrap">
            <div className="flex flex-wrap justify-center gap-2">
              {/* Categories are built from API data — no hardcoded list */}
              {categories.map(cat => (
                <motion.button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider"
                  style={{
                    background: activeCategory === cat
                      ? "linear-gradient(135deg, #3d6eff, #6c3dff)"
                      : darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
                    color: activeCategory === cat
                      ? "#fff"
                      : darkMode ? "rgba(255,255,255,0.55)" : "rgba(30,40,80,0.6)",
                    border: `0.5px solid ${activeCategory === cat ? "transparent" : darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
                    boxShadow: activeCategory === cat ? "0 4px 16px rgba(61,110,255,0.35)" : "none",
                    transition: "background 0.2s, color 0.2s, box-shadow 0.2s",
                  }}
                >
                  {cat}
                </motion.button>
              ))}
            </div>
            <SearchBar value={search} onChange={setSearch} darkMode={darkMode} />
          </div>
        </motion.div>

        {/* ── Featured post (only on "All" tab with no search) ── */}
        {featured && activeCategory === "All" && !search && (
          <FeaturedCard blog={featured} darkMode={darkMode} />
        )}

        {/* ── Empty state: API returned zero posts ── */}
        {blogs.length === 0 && (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">📭</div>
            <p className="font-bold text-sm mb-1"
              style={{ color: darkMode ? "rgba(255,255,255,0.5)" : "rgba(30,40,80,0.5)" }}>
              No articles yet
            </p>
            <p className="text-xs"
              style={{ color: darkMode ? "rgba(255,255,255,0.3)" : "rgba(30,40,80,0.35)" }}>
              Check back soon — new posts are on the way.
            </p>
          </div>
        )}

        {/* ── Main content: posts grid + sidebar ── */}
        {blogs.length > 0 && (
          <div className="flex flex-col lg:flex-row gap-8">

            {/* Posts grid */}
            <div className="flex-1">
              {/*
                AnimatePresence mode="wait":
                  When the filter or search changes, the old grid fades OUT first,
                  then the new grid fades IN. The key change (activeCategory+search)
                  tells AnimatePresence that this is a different set of items.
              */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory + search}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  {filtered.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {filtered.map((blog, i) => (
                        // Use _id from MongoDB or id from static data as key
                        <BlogCard key={blog._id || blog.id} blog={blog} index={i} darkMode={darkMode} />
                      ))}
                    </div>
                  ) : (
                    // No results for this filter/search combination
                    <div className="text-center py-20">
                      <div className="text-5xl mb-4">🔍</div>
                      <p className="font-bold text-sm mb-1"
                        style={{ color: darkMode ? "rgba(255,255,255,0.5)" : "rgba(30,40,80,0.5)" }}>
                        No articles found
                      </p>
                      <p className="text-xs"
                        style={{ color: darkMode ? "rgba(255,255,255,0.3)" : "rgba(30,40,80,0.35)" }}>
                        Try a different search term or category
                      </p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* ── Sidebar ── */}
            <motion.div
              ref={sidebarRef}
              initial={{ opacity: 0, x: 24 }}
              animate={sidebarInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 24 }}
              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
              className="lg:w-72 shrink-0"
            >
              {/* Popular posts widget */}
              <div
                className="rounded-2xl p-5 mb-5"
                style={{
                  background: darkMode ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.85)",
                  border: `1px solid ${darkMode ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}`,
                  boxShadow: darkMode ? "0 4px 24px rgba(0,0,0,0.35)" : "0 4px 24px rgba(0,0,0,0.07)",
                }}
              >
                <h3 className="text-sm font-extrabold mb-4 flex items-center gap-2"
                  style={{ color: darkMode ? "#fff" : "#1a2050", fontFamily: "'DM Serif Display', serif" }}>
                  <span style={{ color: "#f59e0b" }}>🔥</span> Popular Posts
                </h3>
                <div className="flex flex-col gap-2">
                  {popular.map(blog => (
                    <SidebarCard key={blog._id || blog.id} blog={blog} darkMode={darkMode} />
                  ))}
                </div>
              </div>

              {/* Tag cloud widget */}
              <div
                className="rounded-2xl p-5 mb-5"
                style={{
                  background: darkMode ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.85)",
                  border: `1px solid ${darkMode ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}`,
                  boxShadow: darkMode ? "0 4px 24px rgba(0,0,0,0.35)" : "0 4px 24px rgba(0,0,0,0.07)",
                }}
              >
                <h3 className="text-sm font-extrabold mb-4 flex items-center gap-2"
                  style={{ color: darkMode ? "#fff" : "#1a2050", fontFamily: "'DM Serif Display', serif" }}>
                  <span>🏷️</span> All Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {/* Clicking a tag fills the search box with that tag name */}
                  {allTags.map((tag, i) => {
                    const palette = ["#6c9fff", "#3ddc97", "#f59e0b", "#06b6d4", "#8b5cf6", "#ec4899", "#10b981", "#e85d04"];
                    const color = palette[i % palette.length];
                    return (
                      <motion.button
                        key={tag}
                        onClick={() => setSearch(tag)}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="text-xs px-2.5 py-1 rounded-full font-semibold"
                        style={{
                          background: `${color}15`,
                          color: color,
                          border: `0.5px solid ${color}44`,
                          transition: "box-shadow 0.2s",
                        }}
                      >
                        #{tag}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Newsletter CTA */}
              <div
                className="rounded-2xl p-5 relative overflow-hidden"
                style={{
                  background: darkMode
                    ? "linear-gradient(135deg, rgba(61,110,255,0.15), rgba(108,61,255,0.15))"
                    : "linear-gradient(135deg, rgba(61,110,255,0.1), rgba(108,61,255,0.1))",
                  border: "1px solid rgba(108,159,255,0.25)",
                }}
              >
                <div className="absolute top-0 right-0 w-20 h-20 rounded-full pointer-events-none"
                  style={{ background: "rgba(108,159,255,0.15)", filter: "blur(20px)", transform: "translate(30%, -30%)" }} />
                <div className="text-2xl mb-2">✉️</div>
                <h3 className="text-sm font-extrabold mb-1"
                  style={{ color: darkMode ? "#fff" : "#1a2050", fontFamily: "'DM Serif Display', serif" }}>
                  Stay Updated
                </h3>
                <p className="text-xs leading-relaxed mb-4"
                  style={{ color: darkMode ? "rgba(255,255,255,0.45)" : "rgba(30,40,80,0.6)" }}>
                  New article every week. No spam — just dev insights from a BCSIT student.
                </p>
                <div className="flex flex-col gap-2">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="w-full px-3 py-2 rounded-xl text-xs outline-none"
                    style={{
                      background: darkMode ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.9)",
                      border: `1px solid ${darkMode ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)"}`,
                      color: darkMode ? "#fff" : "#1a2050",
                    }}
                  />
                  <button
                    className="w-full py-2 rounded-xl text-xs font-extrabold text-white transition-all hover:-translate-y-0.5 hover:shadow-lg uppercase tracking-wider"
                    style={{ background: "linear-gradient(135deg, #3d6eff, #6c3dff)" }}
                  >
                    Subscribe Free
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* ── Bottom tag shortcuts ── */}
        <div className="text-center mt-16">
          <p className="text-xs mb-3"
            style={{ color: darkMode ? "rgba(255,255,255,0.25)" : "rgba(30,40,80,0.35)" }}>
            More articles on the way — new post every week
          </p>
          <div className="flex justify-center gap-2 flex-wrap">
            {/* Show first 4 tags from API; fallback to defaults if API has no tags yet */}
            {(allTags.length > 0 ? allTags.slice(0, 4) : ["MERN Stack", "Flutter", "CSS", "Node.js"]).map(tag => (
              <motion.button
                key={tag}
                onClick={() => { setSearch(tag); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="text-xs px-3 py-1.5 rounded-full font-bold"
                style={{
                  background: darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
                  color: darkMode ? "rgba(255,255,255,0.4)" : "rgba(30,40,80,0.5)",
                  border: `0.5px solid ${darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}`,
                  transition: "transform 0.2s",
                }}
              >
                #{tag}
              </motion.button>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default Blog;
