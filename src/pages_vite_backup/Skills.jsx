// ═════════════════════════════════════════════════════════════════
//  Skills.jsx
//  Path: frontend/src/pages/Skills.jsx
//
//  WHAT CHANGED FROM THE STATIC VERSION:
//  ──────────────────────────────────────
//  • Removed hardcoded skillCategories array
//  • Added useState to hold API data, loading state, and errors
//  • Added useEffect to fetch /api/skills on component mount
//  • Added Framer Motion animations (entrance, hover, tab switch)
//  • Fixed React Hook rules violation: useInView was being called
//    inside .map() callbacks — now each item is its own component
//  • Tech grid pills extracted into <SkillPill> component
//  • Progress bars animated via Framer Motion (not CSS transitions)
//  • Quick stat cards are now computed from real API data
// ═════════════════════════════════════════════════════════════════

// ── Imports ──────────────────────────────────────────────────────
// React core
import React, { useEffect, useRef, useState } from "react";

// Framer Motion — animation library
// motion      : makes any HTML element animatable (motion.div, motion.button, etc.)
// AnimatePresence: lets elements play an EXIT animation before being removed from DOM
// useInView   : returns true when the referenced element scrolls into the viewport
import { motion, AnimatePresence, useInView } from "framer-motion";

// ThemeContext — provides darkMode boolean
import { useTheme } from "../context/ThemeContext";

// Service function — handles the axios API call
// path: frontend/src/services/skillsService.js
import { fetchSkills } from "../services/skillsService";

// Spinner component — shown while API data is loading
// path: frontend/src/components/Spinner.jsx
import Spinner from "../components/Spinner";
import SEO from "../components/SEO";


// ═════════════════════════════════════════════════════════════════
//  REUSABLE SUB-COMPONENTS
//  These are defined OUTSIDE Skills() so React doesn't re-create
//  them on every render — better for performance.
// ═════════════════════════════════════════════════════════════════


// ── SkillBar ─────────────────────────────────────────────────────
// Renders one skill row: icon + name + description + animated bar.
//
// HOW THE ANIMATION WORKS:
//  1. useInView watches when this element scrolls into the viewport.
//  2. When inView becomes true, Framer Motion animates:
//     • The row sliding in from the left  (initial/animate on the wrapper)
//     • The bar width from 0 → skill.level%  (initial/animate on motion.div)
//  3. once: true means the animation only fires the FIRST time — not
//     every time you scroll up and back down.
//
// Props:
//   skill   — { name, level, icon, color, desc }
//   delay   — stagger delay in ms so bars animate one after another
//   darkMode — boolean
const SkillBar = ({ skill, delay, darkMode }) => {
  const ref    = useRef(null);

  // useInView from framer-motion:
  //   ref    = the DOM element to watch
  //   once   = trigger only on the first intersection (no re-animation on scroll)
  //   margin = start triggering 30px before the element actually hits the edge
  const inView = useInView(ref, { once: true, margin: "-30px" });

  return (
    <motion.div
      ref={ref}
      // Row entrance: fade in + slide right
      initial={{ opacity: 0, x: -16 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.45, delay: delay / 1000 }}
    >
      {/* ── Top row: icon · name · description · percentage ── */}
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <span className="text-base">{skill.icon}</span>
          <span
            className="text-sm font-bold"
            style={{ color: darkMode ? "#fff" : "#1a2050" }}
          >
            {skill.name}
          </span>
          {/* Description hidden on very small screens to save space */}
          <span
            className="text-xs hidden sm:block"
            style={{ color: darkMode ? "rgba(255,255,255,0.35)" : "rgba(30,40,80,0.45)" }}
          >
            — {skill.desc}
          </span>
        </div>
        <span
          className="text-xs font-extrabold tabular-nums"
          style={{ color: skill.color }}
        >
          {skill.level}%
        </span>
      </div>

      {/* ── Progress bar track (background) ── */}
      <div
        className="h-1.5 rounded-full overflow-hidden"
        style={{ background: darkMode ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)" }}
      >
        {/* ── Animated fill bar ──
            Framer Motion animates `width` as a CSS property.
            delay / 1000 converts ms → seconds (Framer uses seconds).
            The extra 0.12 makes the bar start filling slightly AFTER the
            row has appeared, so the user sees them as two separate events. */}
        <motion.div
          className="h-full rounded-full"
          initial={{ width: 0 }}
          animate={inView ? { width: `${skill.level}%` } : { width: 0 }}
          transition={{
            duration: 1.1,
            ease: [0.4, 0, 0.2, 1],
            delay: delay / 1000 + 0.12,
          }}
          style={{
            background: `linear-gradient(90deg, ${skill.color}cc, ${skill.color})`,
            boxShadow: `0 0 8px ${skill.color}66`,
          }}
        />
      </div>
    </motion.div>
  );
};


// ── SkillPill ────────────────────────────────────────────────────
// A coloured pill shown in the "Technologies I Work With" grid.
//
// WHY IS THIS ITS OWN COMPONENT?
//  Previously, useInView was called inside a .map() callback:
//    allSkills.map((skill, i) => {
//      const [ref, inView] = useInView();  ← REACT RULES VIOLATION
//    })
//  React hooks MUST be called at the top level of a component —
//  never inside loops, conditions, or callbacks. By extracting this
//  into <SkillPill>, each pill is a proper component with its own
//  valid hook call.
//
// Props:
//   skill   — { name, icon, color }
//   index   — used to stagger the entrance animation
//   darkMode
const SkillPill = ({ skill, index, darkMode }) => {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-20px" });

  return (
    <motion.div
      ref={ref}
      // Entrance: pop in from smaller scale
      initial={{ opacity: 0, scale: 0.82 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.35, delay: index * 0.045 }}
      // Hover: lift up + enlarge + custom box shadow
      whileHover={{
        y: -4,
        scale: 1.07,
        boxShadow: `0 8px 24px ${skill.color}40`,
      }}
      whileTap={{ scale: 0.96 }}
      className="flex items-center gap-2 px-4 py-2 rounded-2xl font-bold text-xs uppercase tracking-wider cursor-default"
      style={{
        background: darkMode ? `${skill.color}12` : `${skill.color}10`,
        border: `0.5px solid ${skill.color}44`,
        color: skill.color,
        boxShadow: `0 2px 12px ${skill.color}18`,
      }}
    >
      <span>{skill.icon}</span>
      {skill.name}
    </motion.div>
  );
};


// ── CategoryTab ──────────────────────────────────────────────────
// Navigation tab for each skill category (Frontend / Backend / Mobile).
// Uses motion.button so Framer Motion handles hover + press effects.
//
// Props:
//   cat     — { id, label, icon, accent }
//   active  — boolean, is this the currently selected tab?
//   onClick — function called when tab is clicked
//   darkMode
const CategoryTab = ({ cat, active, onClick, darkMode }) => (
  <motion.button
    onClick={onClick}
    // whileHover and whileTap are declarative — no onMouseEnter/Leave needed
    whileHover={{ scale: 1.05, translateY: -2 }}
    whileTap={{ scale: 0.95 }}
    transition={{ type: "spring", stiffness: 350, damping: 25 }}
    className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-bold"
    style={{
      background: active
        ? `linear-gradient(135deg, ${cat.accent}33, ${cat.accent}15)`
        : darkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
      border: `1px solid ${
        active
          ? cat.accent + "66"
          : darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"
      }`,
      color: active
        ? cat.accent
        : darkMode ? "rgba(255,255,255,0.5)" : "rgba(30,40,80,0.55)",
      boxShadow: active ? `0 4px 20px ${cat.accent}22` : "none",
    }}
  >
    <span>{cat.icon}</span>
    {cat.label}
  </motion.button>
);


// ── SkillBubble ──────────────────────────────────────────────────
// Renders one skill as a bubble on the SVG orbit diagram.
// This is an SVG <g> element — Framer Motion's motion.g works but SVG
// animations are simpler with CSS transitions here, so we keep them.
//
// Props:
//   skill, index, total     — position on the orbit
//   darkMode
//   hoveredSkill            — name of currently hovered skill (or null)
//   setHoveredSkill         — state setter from the parent
const SkillBubble = ({ skill, index, total, darkMode, hoveredSkill, setHoveredSkill }) => {
  // Calculate the (x, y) position on the ellipse orbit
  const angle   = (index / total) * 2 * Math.PI - Math.PI / 2;
  const radiusX = 210;
  const radiusY = 170;
  const cx = 260;
  const cy = 210;
  const x  = cx + radiusX * Math.cos(angle);
  const y  = cy + radiusY * Math.sin(angle);
  const isHovered = hoveredSkill === skill.name;

  return (
    <g
      style={{ cursor: "pointer" }}
      onMouseEnter={() => setHoveredSkill(skill.name)}
      onMouseLeave={() => setHoveredSkill(null)}
    >
      {/* Dashed line connecting bubble to center */}
      <line
        x1={cx} y1={cy} x2={x} y2={y}
        stroke={isHovered ? skill.color : darkMode ? "rgba(255,255,255,0.06)" : "rgba(30,40,80,0.08)"}
        strokeWidth={isHovered ? 1.5 : 0.8}
        strokeDasharray={isHovered ? "none" : "4 4"}
        style={{ transition: "all 0.3s ease" }}
      />
      {/* Main bubble */}
      <circle
        cx={x} cy={y}
        r={isHovered ? 28 : 22}
        fill={isHovered ? `${skill.color}33` : darkMode ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.9)"}
        stroke={skill.color}
        strokeWidth={isHovered ? 2 : 1}
        style={{
          transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
          filter: isHovered ? `drop-shadow(0 0 12px ${skill.color}88)` : "none",
        }}
      />
      {/* Arc showing skill level (partial circle outline) */}
      <circle
        cx={x} cy={y}
        r={isHovered ? 28 : 22}
        fill="none"
        stroke={skill.color}
        strokeWidth="2.5"
        strokeDasharray={`${(skill.level / 100) * (isHovered ? 175 : 138)} 999`}
        strokeLinecap="round"
        style={{
          transition: "all 0.4s ease",
          transformOrigin: `${x}px ${y}px`,
          transform: "rotate(-90deg)",
        }}
      />
      {/* First two letters of skill name inside the bubble */}
      <text
        x={x} y={y + 1}
        textAnchor="middle" dominantBaseline="middle"
        fontSize={isHovered ? 14 : 11}
        style={{ userSelect: "none" }}
      >
        {skill.name.slice(0, 2)}
      </text>
      {/* "React · 82%" label shown below bubble on hover */}
      {isHovered && (
        <text
          x={x} y={y + 42}
          textAnchor="middle"
          fontSize="9" fontWeight="700"
          fill={skill.color}
          style={{ userSelect: "none", letterSpacing: "0.05em" }}
        >
          {skill.name} · {skill.level}%
        </text>
      )}
    </g>
  );
};


// ═════════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ═════════════════════════════════════════════════════════════════

const Skills = () => {
  // ── Theme ─────────────────────────────────────────────────────
  const { darkMode } = useTheme();


  // ── State ──────────────────────────────────────────────────────
  //
  // WHY useState?
  // ─────────────
  // A React functional component is just a function. Normally, any
  // variable you declare is reset every time the component re-renders.
  // useState gives you a "memory box" — the value persists across
  // renders, and calling the setter (e.g. setLoading) TRIGGERS a
  // re-render so the new value appears on screen immediately.
  //
  // skillCategories: the API data once loaded
  //   starts as []  →  filled after fetchSkills() resolves
  //
  // loading: controls whether the Spinner is shown
  //   starts as true  →  set to false in the finally block
  //
  // error: holds any error message if the API call fails
  //   starts as null  →  set to a string if catch runs
  //
  // activeTab: which category tab is currently selected
  //   starts as ""  →  set to first category's id after data loads
  //
  // hoveredSkill: name of the skill the user is hovering on the orbit
  //   used to show the glow + tooltip in SkillBubble

  const [skillCategories, setSkillCategories] = useState([]);
  const [loading,         setLoading]         = useState(true);
  const [error,           setError]           = useState(null);
  const [activeTab,       setActiveTab]       = useState("");
  const [hoveredSkill,    setHoveredSkill]    = useState(null);


  // SkillBar and SkillPill use their own per-item refs (see those components).
  // The hero and orbit sections use whileInView directly on motion elements.


  // ── API Fetch via useEffect ─────────────────────────────────────
  //
  // WHY useEffect?
  // ──────────────
  // An API call is a "side effect" — it reaches outside React's world
  // (it goes over the network). React requires all side effects to live
  // inside useEffect, not directly in the component body.
  //
  // If you wrote `const data = await fetchSkills()` directly in the
  // component body, it would run on EVERY render (when user switches
  // tabs, resizes the window, etc.) — spamming your backend.
  //
  // The empty array [] as the second argument tells React:
  //   "Run this effect only once — when the component first mounts."
  //   (equivalent to componentDidMount in class-based React)
  //
  // WHERE should the API call be placed?
  // ─────────────────────────────────────
  // Inside useEffect, inside an async inner function (loadSkills).
  // You cannot make useEffect's callback itself async — React doesn't
  // support that — so we define and immediately call an async function
  // inside the effect.
  //
  // BACKEND ROUTE:
  //   GET http://localhost:5000/api/skills
  //   (baseURL is set in frontend/src/api/axiosInstance.js)

  useEffect(() => {
    // Define the async function inside useEffect
    const loadSkills = async () => {
      try {
        setLoading(true);  // show spinner
        setError(null);    // clear any previous error

        // fetchSkills() calls axiosInstance.get("/skills") internally
        // It's defined in: frontend/src/services/skillsService.js
        const data = await fetchSkills();

        // data should be an array of category objects
        const categories = Array.isArray(data) ? data : [];
        setSkillCategories(categories);

        // Set the first category's tab as active once data loads
        if (categories.length > 0) {
          setActiveTab(categories[0].id);
        }
      } catch (err) {
        // err.response?.data?.message → error sent from Express backend
        // err.message                 → axios network error (e.g. "Network Error")
        setError(
          err.response?.data?.message ||
          err.message ||
          "Failed to load skills."
        );
      } finally {
        // finally always runs whether the request succeeded or failed
        // This ensures the spinner always turns off
        setLoading(false);
      }
    };

    // Call the async function immediately
    loadSkills();
  }, []); // [] = run once on mount


  // ── Derived Data ──────────────────────────────────────────────
  // These are computed values — React recalculates them every render,
  // so they automatically update when skillCategories changes.

  // Flatten all skills into one array for the orbit diagram and tech grid
  const allSkills = skillCategories.flatMap((c) =>
    (c.skills || []).map((s) => ({
      ...s,
      category: c.label,
      catAccent: c.accent,
    }))
  );

  // The currently active category object (drives the tab content)
  const activeCategory =
    skillCategories.find((c) => c.id === activeTab) || skillCategories[0];


  // ── Loading Screen ─────────────────────────────────────────────
  // Return early while the API request is in-flight.
  // This means the main JSX (with .map() calls) never runs on empty data.
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
        <Spinner message="Loading Skills..." darkMode={darkMode} />
      </section>
    );
  }


  // ── Error Screen ───────────────────────────────────────────────
  // Show a friendly error card with a Retry button if the API call failed.
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
        <motion.div
          initial={{ opacity: 0, scale: 0.93 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="text-center max-w-md px-8 py-10 rounded-2xl"
          style={{
            background: darkMode
              ? "rgba(255,80,80,0.07)"
              : "rgba(255,80,80,0.05)",
            border: "1px solid rgba(255,80,80,0.25)",
          }}
        >
          <p className="text-3xl mb-3">⚠️</p>
          <p className="text-sm font-bold mb-2" style={{ color: "#f87171" }}>
            Could not load skills
          </p>
          <p
            className="text-xs mb-6"
            style={{
              color: darkMode
                ? "rgba(255,255,255,0.4)"
                : "rgba(30,40,80,0.5)",
            }}
          >
            {error}
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 rounded-xl text-xs font-bold text-white"
            style={{ background: "linear-gradient(135deg,#3d6eff,#6c3dff)" }}
          >
            Retry
          </motion.button>
        </motion.div>
      </section>
    );
  }


  // ── Main Render ────────────────────────────────────────────────
  // This only runs after the API data has loaded successfully.
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
        title="Skills | Saksham Khadka — React, Node.js, MongoDB Developer"
        description="Technical skills of Saksham Khadka: React.js, Node.js, Express.js, MongoDB, Flutter, Dart, Tailwind CSS, JavaScript, PHP. MERN Stack developer from Nepal."
        keywords="Saksham Khadka Skills, React Developer, Node.js Developer, MongoDB Nepal, Flutter Developer Nepal, JavaScript Nepal, MERN Stack Skills"
        canonical="/skills"
      />
      {/* ── Background glow orbs (decorative) ── */}
      <div
        className="absolute top-16 left-0 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: "rgba(108,159,255,0.09)", filter: "blur(100px)" }}
      />
      <div
        className="absolute bottom-24 right-0 w-72 h-72 rounded-full pointer-events-none"
        style={{ background: "rgba(61,220,151,0.07)", filter: "blur(90px)" }}
      />
      <div
        className="absolute top-1/2 right-1/4 w-48 h-48 rounded-full pointer-events-none"
        style={{ background: "rgba(6,182,212,0.06)", filter: "blur(80px)" }}
      />

      <div className="max-w-5xl mx-auto">

        {/* ══════════════════════════════════════════════════════
            SECTION: Page Header
        ══════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-14"
        >
          <p
            className="text-xs uppercase tracking-[0.3em] font-bold mb-3"
            style={{ color: "#6c9fff" }}
          >
            My Arsenal
          </p>
          <h2
            className="text-4xl md:text-5xl font-extrabold mb-4"
            style={{
              fontFamily: "'DM Serif Display', serif",
              color: darkMode ? "#fff" : "#1a2050",
            }}
          >
            Skills &{" "}
            <em className="not-italic" style={{ color: "#3ddc97" }}>
              Technologies
            </em>
          </h2>
          <p
            className="text-sm leading-relaxed max-w-lg mx-auto"
            style={{
              color: darkMode
                ? "rgba(255,255,255,0.45)"
                : "rgba(30,40,80,0.6)",
            }}
          >
            From pixel-perfect frontends to scalable backends and cross-platform
            mobile — here's everything I've picked up across four semesters of building.
          </p>
        </motion.div>


        {/* ══════════════════════════════════════════════════════
            SECTION: Orbit Diagram + Quick Stats
        ══════════════════════════════════════════════════════ */}
        <div
          className="flex flex-col lg:flex-row items-center gap-8 mb-16"
        >
          {/* ── SVG Orbit Diagram ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative shrink-0"
          >
            <svg
              viewBox="0 0 520 420"
              width="100%"
              style={{ maxWidth: 480, overflow: "visible" }}
            >
              {/* Outer orbit ring */}
              <ellipse
                cx="260" cy="210" rx="210" ry="170"
                fill="none"
                stroke={darkMode ? "rgba(255,255,255,0.04)" : "rgba(30,40,80,0.06)"}
                strokeWidth="1"
                strokeDasharray="6 6"
              />
              {/* Inner orbit ring */}
              <ellipse
                cx="260" cy="210" rx="140" ry="113"
                fill="none"
                stroke={darkMode ? "rgba(255,255,255,0.04)" : "rgba(30,40,80,0.06)"}
                strokeWidth="1"
                strokeDasharray="4 8"
              />

              {/* Centre core circles */}
              <circle
                cx="260" cy="210" r="44"
                fill={darkMode ? "rgba(108,159,255,0.1)" : "rgba(108,159,255,0.12)"}
                stroke="rgba(108,159,255,0.4)"
                strokeWidth="1.5"
              />
              <circle
                cx="260" cy="210" r="32"
                fill={darkMode ? "rgba(108,159,255,0.08)" : "rgba(108,159,255,0.1)"}
                stroke="rgba(108,159,255,0.25)"
                strokeWidth="1"
              />
              <text
                x="260" y="205"
                textAnchor="middle" dominantBaseline="middle"
                fontSize="11" fontWeight="800" letterSpacing="0.08em"
                fill={darkMode ? "rgba(255,255,255,0.7)" : "rgba(30,40,80,0.7)"}
              >
                STACK
              </text>
              {/* Dynamic skill count — reads from live API data */}
              <text
                x="260" y="219"
                textAnchor="middle" dominantBaseline="middle"
                fontSize="8"
                fill="rgba(108,159,255,0.8)"
                letterSpacing="0.12em"
              >
                {allSkills.length} SKILLS
              </text>

              {/* Skill bubbles — one per skill from API */}
              {allSkills.map((skill, i) => (
                <SkillBubble
                  key={skill.name}
                  skill={skill}
                  index={i}
                  total={allSkills.length}
                  darkMode={darkMode}
                  hoveredSkill={hoveredSkill}
                  setHoveredSkill={setHoveredSkill}
                />
              ))}
            </svg>

            {/* Hover tooltip — appears when a bubble is hovered */}
            {hoveredSkill && (() => {
              const s = allSkills.find((sk) => sk.name === hoveredSkill);
              return s ? (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.18 }}
                  className="absolute bottom-2 left-1/2 -translate-x-1/2 px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap"
                  style={{
                    background: darkMode
                      ? "rgba(10,15,30,0.95)"
                      : "rgba(255,255,255,0.95)",
                    border: `1px solid ${s.color}55`,
                    color: s.color,
                    backdropFilter: "blur(12px)",
                    boxShadow: `0 8px 32px ${s.color}22`,
                  }}
                >
                  {s.name} · {s.level}% · {s.category}
                </motion.div>
              ) : null;
            })()}
          </motion.div>

          {/* ── Quick Stat Cards ──
              These are DYNAMIC — computed from the real API data.
              First card is always "Total Skills".
              Remaining cards are one per category from the API.  */}
          <div className="flex flex-col gap-4 w-full max-w-xs">
            {[
              // "Total Skills" card uses the full allSkills count
              {
                label: "Total Skills",
                value: `${allSkills.length}+`,
                accent: "#6c9fff",
                icon: "⚡",
              },
              // One card per API category (Frontend, Backend, Mobile, etc.)
              ...skillCategories.map((cat) => ({
                label: `${cat.label} Skills`,
                value: `${cat.skills?.length || 0} tools`,
                accent: cat.accent,
                icon: cat.icon,
              })),
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, x: 28 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.08 }}
                whileHover={{ scale: 1.02, x: 5 }}
                className="rounded-2xl px-5 py-4 flex items-center gap-4"
                style={{
                  background: darkMode
                    ? "rgba(255,255,255,0.04)"
                    : "rgba(255,255,255,0.85)",
                  border: `1px solid ${
                    darkMode
                      ? "rgba(255,255,255,0.07)"
                      : "rgba(0,0,0,0.07)"
                  }`,
                  boxShadow: darkMode
                    ? "0 4px 20px rgba(0,0,0,0.3)"
                    : "0 4px 20px rgba(0,0,0,0.06)",
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
                  style={{ background: `${stat.accent}18` }}
                >
                  {stat.icon}
                </div>
                <div>
                  <div
                    className="text-xl font-extrabold"
                    style={{ color: stat.accent }}
                  >
                    {stat.value}
                  </div>
                  <div
                    className="text-xs font-medium"
                    style={{
                      color: darkMode
                        ? "rgba(255,255,255,0.4)"
                        : "rgba(30,40,80,0.5)",
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>


        {/* ══════════════════════════════════════════════════════
            SECTION: Category Tabs + Skill Progress Bars
        ══════════════════════════════════════════════════════ */}
        <div
          className="rounded-3xl p-6 md:p-8"
          style={{
            background: darkMode
              ? "rgba(255,255,255,0.03)"
              : "rgba(255,255,255,0.8)",
            border: `1px solid ${
              darkMode ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"
            }`,
            boxShadow: darkMode
              ? "0 8px 40px rgba(0,0,0,0.4)"
              : "0 8px 40px rgba(0,0,0,0.07)",
          }}
        >
          {/* ── Tab Row — one button per category from API ── */}
          <div className="flex flex-wrap gap-2 mb-8">
            {skillCategories.map((cat) => (
              <CategoryTab
                key={cat.id}
                cat={cat}
                active={activeTab === cat.id}
                onClick={() => setActiveTab(cat.id)}
                darkMode={darkMode}
              />
            ))}
          </div>

          {/* ── Active Category Header + Skill Bars ── */}
          {activeCategory && (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl"
                  style={{ background: `${activeCategory.accent}22` }}
                >
                  {activeCategory.icon}
                </div>
                <div>
                  <h3
                    className="font-extrabold text-base"
                    style={{
                      color: darkMode ? "#fff" : "#1a2050",
                      fontFamily: "'DM Serif Display', serif",
                    }}
                  >
                    {activeCategory.label} Development
                  </h3>
                  <p
                    className="text-xs"
                    style={{ color: activeCategory.accent }}
                  >
                    {activeCategory.skills?.length || 0} technologies
                  </p>
                </div>
              </div>

              {/* ── Animated Tab Content ──
                  AnimatePresence plays an EXIT animation when a tab changes.
                  mode="wait" ensures the old content exits BEFORE new content
                  enters — no overlap between old and new skill bars.
                  The key={activeTab} tells Framer Motion to treat each tab
                  as a different element, triggering enter/exit. */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.22 }}
                  className="flex flex-col gap-5"
                >
                  {(activeCategory.skills || []).map((skill, i) => (
                    <SkillBar
                      key={`${activeTab}-${skill.name}`}
                      skill={skill}
                      delay={i * 90}
                      darkMode={darkMode}
                    />
                  ))}
                </motion.div>
              </AnimatePresence>
            </>
          )}
        </div>


        {/* ══════════════════════════════════════════════════════
            SECTION: Tech Logo Grid
            Each <SkillPill> is its own component, which fixes the
            React Hooks rules violation from the original code where
            useInView was called inside a .map() callback.
        ══════════════════════════════════════════════════════ */}
        <div className="mt-12">
          <p
            className="text-center text-xs uppercase tracking-[0.3em] font-bold mb-6"
            style={{
              color: darkMode
                ? "rgba(255,255,255,0.25)"
                : "rgba(30,40,80,0.35)",
            }}
          >
            Technologies I Work With
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {allSkills.map((skill, i) => (
              <SkillPill
                key={skill.name}
                skill={skill}
                index={i}
                darkMode={darkMode}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default Skills;
