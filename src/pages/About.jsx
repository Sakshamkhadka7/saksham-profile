// ─────────────────────────────────────────────────────────────
//  About.jsx
//  Path: frontend/src/pages/About.jsx
//
//  WHAT THIS FILE DOES:
//  ─────────────────────
//  1. Fetches all About-page data (timeline, works, resume) from
//     GET /api/about in a single API call on component mount.
//  2. Shows a Spinner while loading, an error card on failure.
//  3. Renders:
//       • Hero intro (static text — "Who I Am")
//       • Alternating vertical timeline (education journey)
//       • Work highlight cards grid
//       • Resume download section
//  4. All scroll-triggered entrance animations use Framer Motion's
//     useInView — same visual result as the original Intersection
//     Observer animations, just using the framer-motion library.
//
//  BACKEND ROUTE:  GET /api/about
//  SERVICE FILE:   frontend/src/services/aboutService.js
//
//  ──────────────────────────────────────────────────────────────
//  EXPLANATION: WHY useEffect and useState?
//  ─────────────────────────────────────────
//  useState:
//    React components re-render when their state changes.
//    We store API data (timeline, works, resume) in state so that
//    when the data arrives, React automatically re-renders the UI
//    with the new values. A plain variable wouldn't trigger a re-render.
//
//  useEffect:
//    API calls are "side effects" — they reach outside React to hit
//    the network. React's rule: side effects belong in useEffect,
//    never directly in the component body. useEffect with [] runs
//    exactly once after the first render: show spinner → fetch → show data.
//
//  useCallback:
//    Wrapping loadAbout in useCallback gives it a stable reference.
//    This lets us safely list it in useEffect's dependency array
//    without triggering an infinite re-render loop.
// ─────────────────────────────────────────────────────────────

import React, { useCallback, useEffect, useRef, useState } from "react";
// motion   → creates animated versions of HTML elements (motion.div, etc.)
// useInView → watches a DOM element and returns true when it enters the
//             viewport. It uses Intersection Observer under the hood —
//             same as the original custom hook, but from framer-motion.
import { motion, useInView } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { fetchAbout } from "../services/aboutService";
import Spinner from "../components/Spinner";
import SEO from "../components/SEO";

// Prevents a false-positive ESLint "motion is unused" warning.
// Some ESLint setups don't track JSX member expressions (motion.div)
// as usage of `motion`. This one-liner fixes that without side effects.
// _MotionRef starts with _ which the varsIgnorePattern (^[A-Z_]) allows unused.
const _MotionRef = { div: motion.div };

// ── TimelineCard ──────────────────────────────────────────────
//  Pure presentational component — receives props, renders a card.
//  Has NO state and NO side effects of its own.
//
//  WHY a separate component?
//  ──────────────────────────
//  TimelineItem places this card on EITHER the left or right side
//  of the spine. By isolating the card into its own component, we
//  write the card markup once and reuse it for both sides. If the
//  card design ever changes, there's exactly ONE place to update.
//  This is the "single responsibility" principle.
//
//  Props:
//    item      → the timeline data object from the API
//    darkMode  → boolean from ThemeContext (controls colours)
//    isCurrent → true if item.type === "current" (glow + "Now" badge)
//    isFuture  → true if item.type === "future" (dimmed appearance)
//    align     → "left" | "right" (controls tag/period badge alignment)
const TimelineCard = ({ item, darkMode, isCurrent, isFuture, align }) => (
  <div
    className="rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group"
    style={{
      background: isFuture
        ? darkMode ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"
        : darkMode ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.85)",
      border: `1px solid ${
        isCurrent
          ? item.accent + "66"
          : darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"
      }`,
      boxShadow: isCurrent
        ? `0 0 24px ${item.accent}22`
        : darkMode ? "0 4px 24px rgba(0,0,0,0.3)" : "0 4px 24px rgba(0,0,0,0.06)",
      opacity: isFuture ? 0.6 : 1,
    }}
  >
    {/* Period badge + optional "Now" pulse badge */}
    <div className={`flex items-center gap-2 mb-2 ${align === "right" ? "justify-end" : "justify-start"}`}>
      <span
        className="text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
        style={{ background: `${item.accent}22`, color: item.accent }}
      >
        {item.period}
      </span>
      {/* "Now" badge — only shown when this is the current semester */}
      {isCurrent && (
        <span
          className="text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded-full animate-pulse"
          style={{ background: "#10b98122", color: "#10b981" }}
        >
          Now
        </span>
      )}
    </div>

    {/* Title */}
    <h3
      className="font-extrabold text-base mb-0.5"
      style={{ color: darkMode ? "#fff" : "#1a2050", fontFamily: "'DM Serif Display', serif" }}
    >
      {item.title}
    </h3>

    {/* Institution */}
    <p className="text-xs mb-2 font-medium" style={{ color: item.accent }}>
      {item.institution}
    </p>

    {/* Description */}
    <p
      className="text-xs leading-relaxed mb-3"
      style={{ color: darkMode ? "rgba(255,255,255,0.45)" : "rgba(30,40,80,0.6)" }}
    >
      {item.description}
    </p>

    {/* Tags — rendered only when the item has at least one tag */}
    {(item.tags || []).length > 0 && (
      <div className={`flex flex-wrap gap-1.5 ${align === "right" ? "justify-end" : "justify-start"}`}>
        {(item.tags || []).map((tag) => (
          <span
            key={tag}
            className="text-xs px-2 py-0.5 rounded-full font-semibold"
            style={{
              background: darkMode ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.05)",
              color: darkMode ? "rgba(255,255,255,0.6)" : "rgba(30,40,80,0.65)",
              border: `0.5px solid ${darkMode ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)"}`,
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    )}
  </div>
);

// ── TimelineItem ──────────────────────────────────────────────
//  Renders ONE row of the vertical timeline.
//
//  HOW THE ALTERNATING LAYOUT WORKS:
//  ────────────────────────────────────
//  Each row has three columns:
//    [left-col] [spine-node] [right-col]
//
//  For EVEN indexes (0, 2, 4 ...):  card is in left-col,  right-col is invisible.
//  For ODD  indexes (1, 3, 5 ...):  left-col is invisible, card is in right-col.
//
//  "invisible" class hides the column visually but KEEPS its space,
//  so the layout stays symmetric even when the col is empty.
//
//  HOW THE SCROLL ANIMATION WORKS:
//  ──────────────────────────────────
//  1. `const ref = useRef(null)` creates a pointer to the DOM element.
//  2. `useInView(ref, ...)` starts watching that element via Intersection
//     Observer. It returns false until the element enters the viewport.
//  3. motion.div uses that boolean to switch between initial (hidden)
//     and visible (shown) states, creating the fade+slide-up effect.
//  4. `once: true` means the animation fires once and doesn't reverse
//     when scrolling back up — matching the original behavior.
//  5. `delay: index * 0.08` staggers the animation: item 0 at 0ms,
//     item 1 at 80ms, item 2 at 160ms — creating a cascading reveal.
const TimelineItem = ({ item, index, darkMode }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });

  const isLeft = index % 2 === 0;  // even index → left side
  const isCurrent = item.type === "current";
  const isFuture = item.type === "future";

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
      transition={{
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1],
        delay: index * 0.08,
      }}
      className="relative flex items-start gap-0 mb-12"
    >
      {/* Left column */}
      <div className={`flex-1 ${isLeft ? "pr-8 text-right" : "pr-8 invisible"}`}>
        {isLeft && (
          <TimelineCard item={item} darkMode={darkMode} isCurrent={isCurrent} isFuture={isFuture} align="right" />
        )}
      </div>

      {/* Center spine node — the emoji circle ON the vertical line */}
      <div className="flex flex-col items-center z-10" style={{ minWidth: 48 }}>
        <div
          className={`w-11 h-11 rounded-full flex items-center justify-center text-lg shadow-lg border-2 transition-transform duration-300 hover:scale-110 ${
            isCurrent ? "animate-pulse" : ""
          }`}
          style={{
            background: isFuture
              ? darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"
              : `${item.accent}22`,
            borderColor: isFuture ? "rgba(255,255,255,0.15)" : item.accent,
            boxShadow: isCurrent ? `0 0 18px ${item.accent}55` : "none",
          }}
        >
          {item.icon}
        </div>
      </div>

      {/* Right column */}
      <div className={`flex-1 ${!isLeft ? "pl-8" : "pl-8 invisible"}`}>
        {!isLeft && (
          <TimelineCard item={item} darkMode={darkMode} isCurrent={isCurrent} isFuture={isFuture} align="left" />
        )}
      </div>
    </motion.div>
  );
};

// ── WorkCard ──────────────────────────────────────────────────
//  A single project highlight card in the 4-column grid.
//
//  WHY its own component?
//  ──────────────────────
//  The grid maps over an array of works. Each card needs its own
//  useRef + useInView hook call. React's rules state hooks can NOT
//  be called inside .map() — they must be at the top level of a
//  component function. By making WorkCard a component, each card
//  gets its own legal top-level hook call.
//
//  `index` prop drives the stagger delay:
//    card 0 → 0ms, card 1 → 100ms, card 2 → 200ms, card 3 → 300ms.
const WorkCard = ({ work, index, darkMode }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1], delay: index * 0.1 }}
      className="rounded-2xl p-5 hover:-translate-y-1 hover:shadow-2xl"
      style={{
        background: darkMode ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.85)",
        border: `1px solid ${work.color}33`,
        boxShadow: darkMode ? "0 4px 24px rgba(0,0,0,0.3)" : "0 4px 24px rgba(0,0,0,0.07)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
      }}
    >
      {/* Colour dot icon */}
      <div className="w-8 h-8 rounded-xl mb-3 flex items-center justify-center"
        style={{ background: `${work.color}22` }}>
        <div className="w-3 h-3 rounded-full" style={{ background: work.color }} />
      </div>

      <h4 className="font-extrabold text-sm mb-1"
        style={{ color: darkMode ? "#fff" : "#1a2050" }}>
        {work.title}
      </h4>

      <p className="text-xs font-semibold mb-2" style={{ color: work.color }}>
        {work.tech}
      </p>

      <p className="text-xs leading-relaxed"
        style={{ color: darkMode ? "rgba(255,255,255,0.45)" : "rgba(30,40,80,0.6)" }}>
        {work.desc}
      </p>
    </motion.div>
  );
};

// ── About (main page component) ───────────────────────────────
//
//  STATE:
//    timeline → array of education journey items from /api/about
//    works    → array of project highlight items from /api/about
//    resume   → object: { downloadUrl, stats, note } from /api/about
//    loading  → true while the API call is in flight (shows Spinner)
//    error    → error message string if the call failed (shows retry card)
//
//  DATA FLOW (how backend data gets into the UI):
//  ─────────────────────────────────────────────
//  1. Component mounts → useEffect triggers → loadAbout() runs
//  2. loadAbout() calls fetchAbout() → Axios sends GET /api/about
//  3. Backend responds with { timeline, works, resume } data
//  4. setTimeline(), setWorks(), setResume() store it in state
//  5. React detects state change → re-renders the component
//  6. JSX maps over timeline[] and works[] to build the UI
//  7. User sees their real data from the database
//
//  SCALABILITY:
//  ─────────────
//  • Adding a new semester: admin adds it in DB → appears on site with zero code changes
//  • Adding a new work highlight: same — just add to DB
//  • Updating resume URL: admin uploads new PDF → URL updates in DB → site uses new link
const About = () => {
  const { darkMode } = useTheme();

  // ── State ────────────────────────────────────────────────────
  const [timeline, setTimeline] = useState([]);
  const [works, setWorks] = useState([]);
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Refs + useInView for resume section entrance animation only
  const resumeRef = useRef(null);
  const resumeInView = useInView(resumeRef, { once: true, amount: 0.1 });

  // ── Fetch about data ──────────────────────────────────────────
  // useCallback prevents loadAbout from being re-created on every render,
  // which would cause useEffect to run infinitely.
  const loadAbout = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // fetchAbout() → Axios → GET /api/about → returns { timeline, works, resume }
      const data = await fetchAbout();

      // Always store an array (prevents .map() crash if API returns unexpected data)
      setTimeline(Array.isArray(data?.timeline) ? data.timeline : []);
      setWorks(Array.isArray(data?.works) ? data.works : []);
      // resume can be null if admin hasn't uploaded one yet
      setResume(data?.resume || null);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to load page data");
    } finally {
      setLoading(false);
    }
  }, []);

  // useEffect runs loadAbout ONCE on mount.
  // The component renders first (showing Spinner), then fetches data.
  useEffect(() => {
    loadAbout();
  }, [loadAbout]);

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
        <Spinner message="Loading about page..." darkMode={darkMode} />
      </section>
    );
  }


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
            Couldn't load page
          </p>
          <p className="text-sm mb-6"
            style={{ color: darkMode ? "rgba(255,255,255,0.45)" : "rgba(30,40,80,0.55)" }}>
            {error}
          </p>
          <button
            onClick={loadAbout}
            className="px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:shadow-lg"
            style={{ background: "linear-gradient(135deg, #3d6eff, #6c3dff)" }}
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  // ── Sorted timeline ───────────────────────────────────────────
  // Sort by `order` field if provided by API; keep API order otherwise.
  // This ensures items always appear chronologically regardless of
  // the order the database returns them.
  const sortedTimeline = [...timeline].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  // ── Resume fallback defaults ──────────────────────────────────
  // If the admin hasn't set specific resume data yet, we show sensible
  // defaults so the section never looks empty.
  const resumeStats = resume?.stats || [
    { label: "Semesters Done", value: "4"  },
    { label: "Languages",      value: "5+" },
    { label: "Projects",       value: "20+" },
  ];
  const resumeDownloadUrl = resume?.downloadUrl || "/assets/resume.pdf";
  const resumeNote = resume?.note || "Dummy resume · Real one coming soon";

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
        title="About Saksham Khadka | MERN Stack Developer Nepal"
        description="Learn about Saksham Khadka — BCSIT student from Nepal, MERN Stack developer. Timeline of my journey from high school to building full-stack web apps."
        keywords="Saksham Khadka About, BCSIT Nepal, MERN Stack Student Nepal, Full Stack Developer Journey, Web Developer Nepal"
        canonical="/about"
      />
      {/* Background glow orbs */}
      <div className="absolute top-20 right-10 w-72 h-72 rounded-full pointer-events-none"
        style={{ background: "rgba(108,159,255,0.1)", filter: "blur(90px)" }} />
      <div className="absolute bottom-40 left-0 w-60 h-60 rounded-full pointer-events-none"
        style={{ background: "rgba(16,185,129,0.08)", filter: "blur(80px)" }} />

      <div className="max-w-5xl mx-auto">

        {/* ── Hero intro ── */}
        {/*
          HOW THIS ANIMATION WORKS:
          ─────────────────────────
          heroRef is attached to this motion.div.
          useInView(heroRef) uses Intersection Observer to detect when it
          scrolls into the viewport, then sets heroInView = true.
          motion.div transitions from initial (opacity:0, y:24) to
          animate (opacity:1, y:0) — a smooth fade+slide-up entrance.
        */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          className="text-center mb-20"
        >
          <p className="text-xs uppercase tracking-[0.3em] font-bold mb-3"
            style={{ color: "#6c9fff" }}>
            Who I Am
          </p>
          <h2
            className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight"
            style={{ fontFamily: "'DM Serif Display', serif", color: darkMode ? "#fff" : "#1a2050" }}
          >
            Crafting the Web,<br />
            <em className="not-italic" style={{ color: "#6c9fff" }}>One Semester</em> at a Time
          </h2>
          <p className="text-sm leading-relaxed max-w-xl mx-auto"
            style={{ color: darkMode ? "rgba(255,255,255,0.45)" : "rgba(30,40,80,0.6)" }}>
            I'm Saksham Khadka — a BCSIT undergraduate turning academic milestones into
            real-world full-stack applications. Here's my journey so far.
          </p>
        </motion.div>

        {/* ── Timeline section ── */}
        <div className="mb-24">
          {/* Section label */}
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-[0.3em] font-bold mb-2"
              style={{ color: "#3ddc97" }}>
              Education & Journey
            </p>
            <h3
              className="text-2xl font-extrabold"
              style={{ fontFamily: "'DM Serif Display', serif", color: darkMode ? "#fff" : "#1a2050" }}
            >
              The Timeline
            </h3>
          </div>

          {/* Empty state — shown when API returns no timeline items */}
          {sortedTimeline.length === 0 && (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">📋</div>
              <p className="font-bold text-sm"
                style={{ color: darkMode ? "rgba(255,255,255,0.4)" : "rgba(30,40,80,0.45)" }}>
                Timeline coming soon
              </p>
            </div>
          )}

          {sortedTimeline.length > 0 && (
            <div className="relative">
              {/*
                SPINE LINE:
                ─────────────
                The thin vertical line running down the center.
                `left-1/2` centers it horizontally.
                `-translate-x-1/2` shifts it left by half its own width so it's truly centered.
                `absolute top-0 bottom-0` makes it span the full container height.
                Each TimelineItem's center circle sits on top of this line (z-10).
              */}
              <div
                className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 z-0"
                style={{
                  background: darkMode
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(30,40,80,0.1)",
                }}
              />

              {/*
                DYNAMIC TIMELINE RENDERING:
                ─────────────────────────────
                Instead of 6 hardcoded items, we map over `sortedTimeline`
                from the API. React renders exactly as many rows as the
                database returns. When the admin adds "Semester 5", it
                appears here automatically — zero code changes needed.

                key={item._id || item.id || i}:
                  React needs a unique key for each list item to track
                  additions/removals efficiently. _id comes from MongoDB.
                  We fall back to `i` (index) if the API doesn't send an id.
              */}
              {sortedTimeline.map((item, i) => (
                <TimelineItem
                  key={item._id || item.id || i}
                  item={item}
                  index={i}
                  darkMode={darkMode}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── Work highlights ── */}
        <div className="mb-24">
          <div className="text-center mb-10">
            <p className="text-xs uppercase tracking-[0.3em] font-bold mb-2"
              style={{ color: "#f59e0b" }}>
              What I've Built
            </p>
            <h3
              className="text-2xl font-extrabold"
              style={{ fontFamily: "'DM Serif Display', serif", color: darkMode ? "#fff" : "#1a2050" }}
            >
              A Little Of My Work
            </h3>
          </div>

          {/* Empty state */}
          {works.length === 0 && (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">🛠️</div>
              <p className="font-bold text-sm"
                style={{ color: darkMode ? "rgba(255,255,255,0.4)" : "rgba(30,40,80,0.45)" }}>
                Work highlights coming soon
              </p>
            </div>
          )}

          {/*
            RESPONSIVE GRID:
            ──────────────────
            grid-cols-1           → 1 column on mobile
            sm:grid-cols-2        → 2 columns on tablet
            lg:grid-cols-4        → 4 columns on desktop
            This handles any number of work items gracefully.

            REUSABLE COMPONENTS IN ACTION:
            ────────────────────────────────
            WorkCard encapsulates the card markup + its own hooks.
            The About component just maps data and passes it as props.
            This separation keeps the About component clean and readable,
            and WorkCard can be imported into other pages if needed.
          */}
          {works.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {works.map((work, i) => (
                <WorkCard
                  key={work._id || work.id || i}
                  work={work}
                  index={i}
                  darkMode={darkMode}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── Resume section ── */}
        <motion.div
          ref={resumeRef}
          initial={{ opacity: 0, y: 32 }}
          animate={resumeInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          className="rounded-3xl p-8 md:p-12"
          style={{
            background: darkMode ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.85)",
            border: `1px solid ${darkMode ? "rgba(108,159,255,0.2)" : "rgba(108,159,255,0.25)"}`,
            boxShadow: darkMode
              ? "0 8px 48px rgba(0,0,0,0.4)"
              : "0 8px 48px rgba(108,159,255,0.1)",
          }}
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">

            {/* Left: text + stats */}
            <div className="flex-1">
              <p className="text-xs uppercase tracking-[0.3em] font-bold mb-2"
                style={{ color: "#6c9fff" }}>
                My Resume
              </p>
              <h3
                className="text-2xl font-extrabold mb-3"
                style={{ fontFamily: "'DM Serif Display', serif", color: darkMode ? "#fff" : "#1a2050" }}
              >
                The Full Picture
              </h3>
              <p className="text-sm leading-relaxed mb-5 max-w-md"
                style={{ color: darkMode ? "rgba(255,255,255,0.45)" : "rgba(30,40,80,0.6)" }}>
                My resume covers my education, technical skills, and projects in detail.
                A current copy is linked below.
              </p>

              {/*
                DYNAMIC STATS:
                ────────────────
                resumeStats comes from the API when available,
                or falls back to the default array defined above.
                If the admin updates "Projects: 20+" to "Projects: 30+"
                in the database, it updates here automatically.
              */}
              <div className="flex flex-wrap gap-6">
                {resumeStats.map(({ label, value }) => (
                  <div key={label}>
                    <div className="text-2xl font-extrabold" style={{ color: "#6c9fff" }}>
                      {value}
                    </div>
                    <div
                      className="text-xs uppercase tracking-widest mt-0.5"
                      style={{ color: darkMode ? "rgba(255,255,255,0.35)" : "rgba(30,40,80,0.45)" }}
                    >
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: faux resume preview + download button */}
            <div className="flex flex-col items-center gap-4">
              {/* Decorative faux resume card */}
              <div
                className="rounded-2xl overflow-hidden relative"
                style={{
                  width: 160,
                  height: 210,
                  background: darkMode ? "rgba(255,255,255,0.06)" : "#f8faff",
                  border: `1px solid ${darkMode ? "rgba(255,255,255,0.1)" : "rgba(108,159,255,0.2)"}`,
                }}
              >
                <div className="p-4 flex flex-col gap-2">
                  <div className="w-16 h-2 rounded-full" style={{ background: "#6c9fff55" }} />
                  <div className="w-10 h-1.5 rounded-full" style={{ background: "#3ddc9744" }} />
                  <div className="mt-2 flex flex-col gap-1.5">
                    {[70, 90, 60, 80, 55, 75, 50, 85, 65].map((w, i) => (
                      <div key={i} className="h-1 rounded-full"
                        style={{
                          width: `${w}%`,
                          background: darkMode ? "rgba(255,255,255,0.1)" : "rgba(30,40,80,0.08)",
                        }} />
                    ))}
                  </div>
                  <div className="mt-2 w-12 h-1.5 rounded-full" style={{ background: "#6c9fff44" }} />
                  <div className="flex flex-col gap-1 mt-1">
                    {[60, 80, 45].map((w, i) => (
                      <div key={i} className="h-1 rounded-full"
                        style={{
                          width: `${w}%`,
                          background: darkMode ? "rgba(255,255,255,0.08)" : "rgba(30,40,80,0.06)",
                        }} />
                    ))}
                  </div>
                </div>
                {/* Corner bracket accents */}
                {[
                  "top-0 left-0 border-t-2 border-l-2",
                  "top-0 right-0 border-t-2 border-r-2",
                  "bottom-0 left-0 border-b-2 border-l-2",
                  "bottom-0 right-0 border-b-2 border-r-2",
                ].map((cls, i) => (
                  <div key={i} className={`absolute w-3 h-3 ${cls} rounded-sm`}
                    style={{ borderColor: "#3d6eff" }} />
                ))}
              </div>

              {/*
                DYNAMIC DOWNLOAD LINK:
                ────────────────────────
                `resumeDownloadUrl` comes from the API.
                When the admin uploads a new PDF via Cloudinary,
                the URL in the database updates and this button
                automatically points to the new file.
                Falls back to "/assets/resume.pdf" if API doesn't provide a URL.
              */}
              <a
                href={resumeDownloadUrl}
                download
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:shadow-lg"
                style={{ background: "linear-gradient(135deg, #3d6eff, #6c3dff)" }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download CV
              </a>

              {/* Note from API */}
              <p className="text-xs text-center"
                style={{ color: darkMode ? "rgba(255,255,255,0.25)" : "rgba(30,40,80,0.35)" }}>
                {resumeNote}
              </p>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default About;
