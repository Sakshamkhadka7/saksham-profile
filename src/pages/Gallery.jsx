// ═════════════════════════════════════════════════════════════════
//  Gallery.jsx
//  Path: frontend/src/pages/Gallery.jsx
//
//  WHAT CHANGED FROM THE STATIC VERSION:
//  ──────────────────────────────────────
//  • Removed hardcoded galleryItems array (12 static items)
//  • Removed hardcoded FILTERS array — now derived from API categories
//  • Added useState for gallery data, loading flag, and error message
//  • Added useEffect to fetch /api/gallery on mount
//  • Replaced custom useInView hook with framer-motion's useInView
//  • Added Framer Motion animations throughout:
//      - Card entrance (opacity + scale + y)
//      - Card hover overlay elements (opacity + y + scale)
//      - Accent line (scaleX on hover)
//      - Filter tab transitions (AnimatePresence on grid)
//      - Lightbox fade + image scale-in/out
//      - Error card scale-in
//  • Fixed duplicate `transition` CSS property bug on the img element
//  • Added native lazy loading (`loading="lazy" decoding="async"`)
//  • Added empty state for when gallery has 0 total items from API
//  • Quick-stat badges above grid now show real counts from API data
// ═════════════════════════════════════════════════════════════════


// ── Imports ──────────────────────────────────────────────────────

// React core hooks
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

// Framer Motion
// motion        → wraps any HTML element to make it animatable
// AnimatePresence → plays EXIT animations before removing elements from the DOM
// useInView     → returns true when the DOM element enters the viewport
import { AnimatePresence, motion, useInView } from "framer-motion";

// ThemeContext: provides darkMode boolean
import { useTheme } from "../context/ThemeContext";

// galleryService: handles the axios API call cleanly
// path: frontend/src/services/galleryService.js
import { fetchGallery } from "../services/galleryService";

// Spinner: reusable loading indicator
// path: frontend/src/components/Spinner.jsx
import Spinner from "../components/Spinner";
import SEO from "../components/SEO";


// ═════════════════════════════════════════════════════════════════
//  LIGHTBOX COMPONENT
//  Full-screen image viewer with keyboard navigation.
//  Wrapped in AnimatePresence in the parent for enter/exit animation.
// ═════════════════════════════════════════════════════════════════

const Lightbox = ({ item, items, onClose, onPrev, onNext }) => {
  // Keyboard navigation: Escape closes, Arrow keys navigate
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape")      onClose();
      if (e.key === "ArrowLeft")   onPrev();
      if (e.key === "ArrowRight")  onNext();
    };
    window.addEventListener("keydown", handleKey);
    // Lock body scroll while lightbox is open
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";   // restore scroll on cleanup
    };
  }, [onClose, onPrev, onNext]);

  const currentIndex = items.findIndex((i) => (i._id || i.id) === (item._id || item.id));

  return (
    // ── Overlay backdrop — fades in/out via AnimatePresence in parent ──
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-100 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.92)", backdropFilter: "blur(20px)" }}
      onClick={onClose}
    >
      {/* ── Close button ── */}
      <motion.button
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.93 }}
        className="absolute top-5 right-5 w-10 h-10 rounded-full flex items-center justify-center z-10"
        style={{
          background: "rgba(255,255,255,0.1)",
          border: "0.5px solid rgba(255,255,255,0.2)",
          color: "#fff",
        }}
        onClick={onClose}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </motion.button>

      {/* ── Previous button ── */}
      <motion.button
        whileHover={{ scale: 1.12, backgroundColor: "rgba(255,255,255,0.18)" }}
        whileTap={{ scale: 0.92 }}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center z-10"
        style={{
          background: "rgba(255,255,255,0.08)",
          border: "0.5px solid rgba(255,255,255,0.15)",
          color: "#fff",
        }}
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </motion.button>

      {/* ── Next button ── */}
      <motion.button
        whileHover={{ scale: 1.12, backgroundColor: "rgba(255,255,255,0.18)" }}
        whileTap={{ scale: 0.92 }}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center z-10"
        style={{
          background: "rgba(255,255,255,0.08)",
          border: "0.5px solid rgba(255,255,255,0.15)",
          color: "#fff",
        }}
        onClick={(e) => { e.stopPropagation(); onNext(); }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </motion.button>

      {/* ── Image container — scales in/out ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.93 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.93 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="relative max-w-4xl w-full mx-16 rounded-2xl overflow-hidden"
        style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.08)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={item.src}
          alt={item.title}
          className="w-full object-cover"
          style={{ maxHeight: "75vh" }}
        />

        {/* Caption overlay */}
        <div
          className="absolute bottom-0 left-0 right-0 px-6 py-4"
          style={{ background: "linear-gradient(transparent, rgba(0,0,0,0.85))" }}
        >
          <div className="flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                  style={{ background: `${item.accent}33`, color: item.accent }}
                >
                  {item.category}
                </span>
              </div>
              <h3
                className="text-white font-extrabold text-lg"
                style={{ fontFamily: "'DM Serif Display', serif" }}
              >
                {item.title}
              </h3>
              <div className="flex gap-1.5 mt-1 flex-wrap">
                {(item.tags || []).map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{ background: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.6)" }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                {currentIndex + 1} / {items.length}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Filmstrip thumbnails at the bottom ── */}
      <div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 px-4 py-2 rounded-2xl"
        style={{
          background: "rgba(255,255,255,0.06)",
          backdropFilter: "blur(12px)",
          border: "0.5px solid rgba(255,255,255,0.1)",
        }}
      >
        {items.map((img) => {
          const imgId  = img._id  || img.id;
          const itemId = item._id || item.id;
          const isActive = imgId === itemId;
          return (
            <button
              key={imgId}
              className="rounded-lg overflow-hidden shrink-0"
              style={{
                width: isActive ? 44 : 32,
                height: 32,
                border: isActive ? `2px solid ${item.accent}` : "2px solid transparent",
                opacity: isActive ? 1 : 0.45,
                transform: isActive ? "scale(1.1)" : "scale(1)",
                transition: "all 0.2s ease",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={img.thumb}
                alt=""
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </button>
          );
        })}
      </div>
    </motion.div>
  );
};


// ═════════════════════════════════════════════════════════════════
//  GALLERY CARD COMPONENT
//
//  HOW RESPONSIVE GALLERY GRID WORKS:
//  ─────────────────────────────────────
//  Each card returns a className with optional CSS Grid span classes:
//    size="tall"   → "row-span-2"   (takes up 2 rows — appears taller)
//    size="wide"   → "col-span-2"   (takes up 2 columns — appears wider)
//    size="normal" → ""             (1×1 cell)
//
//  The parent grid uses:
//    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))"
//    gridAutoRows: "180px"
//
//  This creates a MASONRY-LIKE CSS grid where:
//   • Columns fill the available width (auto-fill)
//   • Each column is at least 260px wide
//   • Rows are all 180px tall, but "tall" cards span 2 = 360px+gap
//   • "wide" cards span 2 columns = appear much wider
//   → This gives the staggered masonry look without any JS library
//
//  HOW IMAGES ARE RENDERED DYNAMICALLY:
//  ──────────────────────────────────────
//  1. API returns an array of gallery objects from MongoDB
//  2. Gallery component stores them in `galleryItems` state
//  3. `filtered` array is derived from `galleryItems` based on activeFilter
//  4. `filtered.map(item => <GalleryCard />)` renders one card per item
//  5. Each card receives the item as a prop and renders it
//
//  Props:
//    item     — { _id, src, thumb, title, category, tags, size, accent }
//    index    — position in the filtered array (used for stagger delay)
//    onClick  — opens the lightbox for this item
//    darkMode — boolean from ThemeContext
// ═════════════════════════════════════════════════════════════════

const GalleryCard = ({ item, index, onClick, darkMode }) => {
  // ── useInView from Framer Motion ──────────────────────────────
  // Watches when this card element enters the viewport.
  // once: true  → animate only on first scroll-in, not every time
  // margin      → start triggering 40px before the element's edge
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  // hovered: true while the mouse is over the card
  // loaded:  true after the thumbnail image has fully loaded
  const [hovered, setHovered] = useState(false);
  const [loaded,  setLoaded]  = useState(false);

  // Determine the CSS grid span class based on item.size from the API.
  // Defaults to "normal" if size is missing or unrecognised.
  const gridSpan = {
    tall:   "row-span-2",
    wide:   "col-span-2",
    normal: "",
  }[item.size || "normal"] || "";

  return (
    // ── motion.div: Card wrapper ──────────────────────────────
    // initial/animate → entrance animation when scrolled into view
    // exit           → fade + shrink when filter changes (handled by AnimatePresence parent)
    // onHoverStart/End → tracks hover to drive overlay animations
    // transition.delay → (index % 6) creates a stagger: cards 0-5 animate
    //                    0ms, 70ms, 140ms... then it resets for the next row
    <motion.div
      ref={ref}
      className={`relative overflow-hidden rounded-2xl cursor-pointer ${gridSpan}`}
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
      exit={{ opacity: 0, scale: 0.88 }}
      transition={{
        duration: 0.5,
        delay: (index % 6) * 0.07,   // stagger: each card in a row is 70ms later
        ease: [0.4, 0, 0.2, 1],
      }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{
        // minHeight ensures cards without a tall/wide class are not too short
        minHeight: item.size === "tall" ? 380 : 220,
        // Border and shadow transition based on hover state
        border: `1px solid ${
          hovered
            ? item.accent + "55"
            : darkMode ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"
        }`,
        boxShadow: hovered
          ? `0 20px 60px ${item.accent}28`
          : darkMode ? "0 4px 24px rgba(0,0,0,0.35)" : "0 4px 24px rgba(0,0,0,0.08)",
        // CSS transition for border/shadow — simpler than animating via Framer Motion
        transition: "border-color 0.4s ease, box-shadow 0.4s ease",
      }}
      onClick={() => onClick(item)}
    >
      {/* ── Skeleton loader ─────────────────────────────────────
          Shown as a pulsing placeholder until the image loads.
          Once `loaded` becomes true, this disappears. */}
      {!loaded && (
        <div
          className="absolute inset-0 animate-pulse"
          style={{
            background: darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)",
          }}
        />
      )}

      {/* ── Thumbnail image ─────────────────────────────────────
          LAZY LOADING EXPLAINED:
          • loading="lazy" — native HTML attribute. The browser will
            NOT download this image until it is near the viewport.
            This saves bandwidth for images far down the page.
          • decoding="async" — browser decodes image in background
            without blocking the main thread (smoother scrolling).
          • onLoad callback — sets `loaded = true`, triggering the
            fade-in via opacity and removing the skeleton.
          • The CSS transition combines transform (scale on hover)
            and opacity (fade in when loaded) in a single string.
            This fixes the duplicate-transition bug in the original. */}
      <img
        src={item.thumb}
        alt={item.title}
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover"
        style={{
          transform: hovered ? "scale(1.06)" : "scale(1)",
          opacity: loaded ? 1 : 0,
          // IMPORTANT: combine both transitions into one string.
          // Original code had TWO separate `transition:` keys in the object,
          // so the second one silently overrode the first (JS object key rules).
          transition: "transform 0.6s cubic-bezier(0.4,0,0.2,1), opacity 0.4s ease",
        }}
        onLoad={() => setLoaded(true)}
      />

      {/* ── Hover overlay ──────────────────────────────────────── */}
      <div
        className="absolute inset-0 flex flex-col justify-end p-4"
        style={{
          background: hovered
            ? "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)"
            : "linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 60%)",
          transition: "background 0.4s ease",
        }}
      >
        {/* Category badge — slides down and fades in on hover */}
        <motion.div
          className="absolute top-3 right-3"
          animate={{
            opacity: hovered ? 1 : 0,
            y: hovered ? 0 : -8,
          }}
          transition={{ duration: 0.28 }}
        >
          <span
            className="text-xs font-bold px-2.5 py-1 rounded-full"
            style={{
              background: `${item.accent}dd`,
              color: "#fff",
              backdropFilter: "blur(8px)",
            }}
          >
            {item.category}
          </span>
        </motion.div>

        {/* Zoom icon — pops in from smaller scale */}
        <motion.div
          className="absolute top-3 left-3 w-8 h-8 rounded-full flex items-center justify-center"
          animate={{
            opacity: hovered ? 1 : 0,
            scale: hovered ? 1 : 0.65,
          }}
          transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
          style={{
            background: "rgba(255,255,255,0.15)",
            backdropFilter: "blur(8px)",
            border: "0.5px solid rgba(255,255,255,0.25)",
          }}
        >
          <svg
            width="14" height="14"
            viewBox="0 0 24 24"
            fill="none" stroke="white" strokeWidth="2.5"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            <line x1="11" y1="8" x2="11" y2="14" />
            <line x1="8" y1="11" x2="14" y2="11" />
          </svg>
        </motion.div>

        {/* Title + tags — slides up and brightens on hover */}
        <motion.div
          animate={{
            opacity: hovered ? 1 : 0.72,
            y: hovered ? 0 : 5,
          }}
          transition={{ duration: 0.32 }}
        >
          <h3
            className="text-white font-extrabold text-sm mb-1.5 leading-tight"
            style={{
              fontFamily: "'DM Serif Display', serif",
              textShadow: "0 1px 8px rgba(0,0,0,0.5)",
            }}
          >
            {item.title}
          </h3>
          <div className="flex flex-wrap gap-1">
            {(item.tags || []).map((tag) => (
              <span
                key={tag}
                className="rounded-md font-medium"
                style={{
                  background: "rgba(255,255,255,0.15)",
                  color: "rgba(255,255,255,0.8)",
                  backdropFilter: "blur(4px)",
                  fontSize: 10,
                  padding: "2px 6px",
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Accent line — slides in from the left on hover */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-2xl"
          style={{ background: item.accent, transformOrigin: "left" }}
          animate={{ scaleX: hovered ? 1 : 0 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        />
      </div>
    </motion.div>
  );
};


// ═════════════════════════════════════════════════════════════════
//  MAIN GALLERY COMPONENT
// ═════════════════════════════════════════════════════════════════

const Gallery = () => {
  // ── Theme ─────────────────────────────────────────────────────
  const { darkMode } = useTheme();


  // ── State ──────────────────────────────────────────────────────
  //
  // WHY useState?
  // ─────────────
  // React functional components re-run (re-render) every time their
  // state changes. useState gives the component a "memory box" that
  // persists between renders.  When you call setGalleryItems(data),
  // React re-renders the component and the new images appear on screen.
  //
  // galleryItems  : the full list of images returned by the API
  //                 starts as []  →  filled after fetchGallery() resolves
  //
  // loading       : drives whether the Spinner is shown
  //                 starts true  →  set to false in the finally block
  //
  // error         : holds an error string if the API call fails
  //                 starts null  →  set to a string in the catch block
  //
  // activeFilter  : which category tab is selected ("All", "Development"…)
  //
  // lightboxItem  : the image object currently open in the lightbox (or null)
  //
  // layout        : "masonry" = CSS grid spans  |  "grid" = uniform cells

  const [galleryItems,  setGalleryItems]  = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState(null);
  const [activeFilter,  setActiveFilter]  = useState("All");
  const [lightboxItem,  setLightboxItem]  = useState(null);
  const [layout,        setLayout]        = useState("masonry");

  // heroRef removed — hero is always visible at page top, no scroll trigger needed


  // ── API Fetch ──────────────────────────────────────────────────
  //
  // WHY useEffect?
  // ──────────────
  // An API call is a "side effect" — it reaches outside React's world
  // over the network. React requires all side effects inside useEffect.
  //
  // If you put the call directly in the component body:
  //   const data = await fetchGallery();   ← WRONG
  // It would re-run on every re-render (e.g., every filter click),
  // spamming the backend unnecessarily.
  //
  // useEffect with [] runs ONCE when the component first mounts —
  // equivalent to componentDidMount in older class-based React.
  //
  // WHERE should the API call be placed?
  // ──────────────────────────────────────
  // Inside useEffect  →  inside an async inner function (loadGallery)
  // because useEffect callbacks cannot themselves be async.
  //
  // BACKEND ROUTE:
  //   GET http://localhost:5000/api/gallery
  //   (baseURL is set in frontend/.env  →  frontend/src/api/axiosInstance.js)

  useEffect(() => {
    const loadGallery = async () => {
      try {
        setLoading(true);
        setError(null);

        // fetchGallery() lives in frontend/src/services/galleryService.js
        const data = await fetchGallery();
        setGalleryItems(Array.isArray(data) ? data : []);
      } catch (err) {
        // err.response?.data?.message → error message from Express backend
        // err.message                 → axios network/timeout error
        setError(
          err.response?.data?.message ||
          err.message ||
          "Failed to load gallery."
        );
      } finally {
        // Always turns the spinner off, success or failure
        setLoading(false);
      }
    };

    loadGallery();
  }, []); // [] = run once on mount, never again


  // ── Derived Data ──────────────────────────────────────────────
  //
  // useMemo re-computes only when galleryItems changes.
  // It builds a filter list of ALL unique categories from the API data.
  // "All" is always first, then the unique categories in order.
  //
  // Example: if API returns items with "Development", "Mobile", "Creative",
  // filters becomes: ["All", "Development", "Mobile", "Creative"]
  // These drive the filter tab buttons — no more hardcoded FILTERS array.
  const filters = useMemo(
    () => ["All", ...new Set(galleryItems.map((i) => i.category).filter(Boolean))],
    [galleryItems]
  );

  // filtered: the subset of items matching the active filter tab
  // When activeFilter is "All", all items are shown.
  const filtered = activeFilter === "All"
    ? galleryItems
    : galleryItems.filter((i) => i.category === activeFilter);

  // lightboxItems: the items available for lightbox prev/next navigation.
  // Always the filtered set, so arrow keys stay within the current filter.
  const lightboxItems = filtered;


  // ── Lightbox Navigation (useCallback) ─────────────────────────
  // useCallback memoises these functions so they don't get re-created
  // on every render, preventing unnecessary re-renders in the Lightbox.
  const openLightbox  = useCallback((item) => setLightboxItem(item), []);
  const closeLightbox = useCallback(() => setLightboxItem(null), []);

  const goNext = useCallback(() => {
    const idx = lightboxItems.findIndex(
      (i) => (i._id || i.id) === (lightboxItem._id || lightboxItem.id)
    );
    setLightboxItem(lightboxItems[(idx + 1) % lightboxItems.length]);
  }, [lightboxItem, lightboxItems]);

  const goPrev = useCallback(() => {
    const idx = lightboxItems.findIndex(
      (i) => (i._id || i.id) === (lightboxItem._id || lightboxItem.id)
    );
    setLightboxItem(
      lightboxItems[(idx - 1 + lightboxItems.length) % lightboxItems.length]
    );
  }, [lightboxItem, lightboxItems]);


  // ── Loading Screen ─────────────────────────────────────────────
  // Return early while the API call is in-flight.
  // The main JSX with .map() never runs on empty data.
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
        <Spinner message="Loading Gallery..." darkMode={darkMode} />
      </section>
    );
  }


  // ── Error Screen ───────────────────────────────────────────────
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
            background: darkMode ? "rgba(255,80,80,0.07)" : "rgba(255,80,80,0.05)",
            border: "1px solid rgba(255,80,80,0.25)",
          }}
        >
          <p className="text-3xl mb-3">📷</p>
          <p className="text-sm font-bold mb-2" style={{ color: "#f87171" }}>
            Could not load gallery
          </p>
          <p
            className="text-xs mb-6"
            style={{ color: darkMode ? "rgba(255,255,255,0.4)" : "rgba(30,40,80,0.5)" }}
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


  // ── Main Render ─────────────────────────────────────────────────
  // Only runs when loading=false and error=null (data is ready).
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
        title="Gallery | Saksham Khadka — Developer Portfolio Nepal"
        description="Photo gallery of Saksham Khadka — developer, student, and creator from Kathmandu Nepal. Screenshots, development moments, and creative work."
        keywords="Saksham Khadka Gallery, Developer Portfolio Nepal, Kathmandu Developer, BCSIT Student Nepal"
        canonical="/gallery"
      />
      {/* ── Decorative background glow orbs ── */}
      <div
        className="absolute top-16 right-0 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "rgba(108,159,255,0.08)", filter: "blur(110px)" }}
      />
      <div
        className="absolute bottom-32 left-0 w-72 h-72 rounded-full pointer-events-none"
        style={{ background: "rgba(61,220,151,0.07)", filter: "blur(90px)" }}
      />
      <div
        className="absolute top-1/3 left-1/3 w-56 h-56 rounded-full pointer-events-none"
        style={{ background: "rgba(245,158,11,0.05)", filter: "blur(80px)" }}
      />

      <div className="max-w-6xl mx-auto">

        {/* ══════════════════════════════════════════════════════
            PAGE HEADER
            Slides up and fades in using Framer Motion.
        ══════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <p
            className="text-xs uppercase tracking-[0.3em] font-bold mb-3"
            style={{ color: "#6c9fff" }}
          >
            Visual Journal
          </p>
          <h2
            className="text-4xl md:text-5xl font-extrabold mb-4"
            style={{
              fontFamily: "'DM Serif Display', serif",
              color: darkMode ? "#fff" : "#1a2050",
            }}
          >
            My{" "}
            <em className="not-italic" style={{ color: "#f59e0b" }}>
              Gallery
            </em>
          </h2>
          <p
            className="text-sm leading-relaxed max-w-md mx-auto mb-8"
            style={{
              color: darkMode ? "rgba(255,255,255,0.45)" : "rgba(30,40,80,0.6)",
            }}
          >
            Moments from development sessions, workspaces, projects, and the journey
            of becoming a full-stack engineer — one semester at a time.
          </p>

          {/* ── Controls Row: filters + layout toggle + count ── */}
          <div className="flex flex-wrap items-center justify-center gap-3">

            {/* Filter pills — DYNAMIC: built from API category data */}
            <div className="flex flex-wrap justify-center gap-2">
              {filters.map((f) => (
                <motion.button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  whileHover={{ scale: 1.06, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider"
                  style={{
                    background:
                      activeFilter === f
                        ? "linear-gradient(135deg, #3d6eff, #6c3dff)"
                        : darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
                    color:
                      activeFilter === f
                        ? "#fff"
                        : darkMode ? "rgba(255,255,255,0.55)" : "rgba(30,40,80,0.6)",
                    border: `0.5px solid ${
                      activeFilter === f
                        ? "transparent"
                        : darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"
                    }`,
                    boxShadow:
                      activeFilter === f
                        ? "0 4px 16px rgba(61,110,255,0.35)"
                        : "none",
                  }}
                >
                  {f}
                </motion.button>
              ))}
            </div>

            {/* Layout toggle: masonry ⟷ grid */}
            <div
              className="flex items-center gap-1 p-1 rounded-xl"
              style={{
                background: darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
                border: `0.5px solid ${darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
              }}
            >
              {/* Masonry icon */}
              <button
                onClick={() => setLayout("masonry")}
                className="p-1.5 rounded-lg transition-all"
                title="Masonry layout"
                style={{
                  background:
                    layout === "masonry"
                      ? darkMode ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.9)"
                      : "transparent",
                  color:
                    layout === "masonry"
                      ? "#6c9fff"
                      : darkMode ? "rgba(255,255,255,0.4)" : "rgba(30,40,80,0.4)",
                  boxShadow: layout === "masonry" ? "0 2px 8px rgba(0,0,0,0.15)" : "none",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <rect x="0" y="0" width="7" height="9" rx="1.5" />
                  <rect x="9" y="0" width="7" height="5" rx="1.5" />
                  <rect x="0" y="11" width="7" height="5" rx="1.5" />
                  <rect x="9" y="7" width="7" height="9" rx="1.5" />
                </svg>
              </button>

              {/* Grid icon */}
              <button
                onClick={() => setLayout("grid")}
                className="p-1.5 rounded-lg transition-all"
                title="Grid layout"
                style={{
                  background:
                    layout === "grid"
                      ? darkMode ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.9)"
                      : "transparent",
                  color:
                    layout === "grid"
                      ? "#6c9fff"
                      : darkMode ? "rgba(255,255,255,0.4)" : "rgba(30,40,80,0.4)",
                  boxShadow: layout === "grid" ? "0 2px 8px rgba(0,0,0,0.15)" : "none",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <rect x="0" y="0" width="7" height="7" rx="1.5" />
                  <rect x="9" y="0" width="7" height="7" rx="1.5" />
                  <rect x="0" y="9" width="7" height="7" rx="1.5" />
                  <rect x="9" y="9" width="7" height="7" rx="1.5" />
                </svg>
              </button>
            </div>

            {/* Photo count badge — shows real count from API data */}
            <span
              className="text-xs font-bold px-3 py-1.5 rounded-full"
              style={{
                background: darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
                color: darkMode ? "rgba(255,255,255,0.4)" : "rgba(30,40,80,0.5)",
                border: `0.5px solid ${darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}`,
              }}
            >
              {filtered.length} photo{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>
        </motion.div>


        {/* ══════════════════════════════════════════════════════
            EMPTY STATE — NO GALLERY ITEMS FROM API AT ALL
            Shown when the backend returned an empty array.
            Different from "no photos in this category" below.
        ══════════════════════════════════════════════════════ */}
        {galleryItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-28"
          >
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 1.2, delay: 0.3 }}
              className="text-6xl mb-5"
            >
              📷
            </motion.div>
            <p
              className="text-lg font-bold mb-2"
              style={{ color: darkMode ? "rgba(255,255,255,0.5)" : "rgba(30,40,80,0.5)" }}
            >
              No gallery photos yet
            </p>
            <p
              className="text-sm"
              style={{ color: darkMode ? "rgba(255,255,255,0.25)" : "rgba(30,40,80,0.3)" }}
            >
              Photos will appear here once they're added via the admin dashboard.
            </p>
          </motion.div>
        ) : (
          <>
            {/* ══════════════════════════════════════════════════
                PHOTO GRID
                HOW THE RESPONSIVE GRID WORKS:
                ─────────────────────────────────
                Masonry mode uses CSS Grid with explicit span classes.
                The grid itself is defined with:
                  gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))"
                    → fills available width with columns of at least 260px
                  gridAutoRows: "180px"
                    → every row is 180px tall

                Cards with size="tall" have class "row-span-2" → 360px+gap
                Cards with size="wide" have class "col-span-2" → 2 columns wide
                Cards with size="normal" are standard 1×1 cells

                AnimatePresence + key={activeFilter + layout} means:
                  When the user clicks a filter or layout toggle, the
                  old grid fades out (exit animation), and the new grid
                  fades in (entrance animation) with staggered card arrivals.
            ══════════════════════════════════════════════════ */}
            <AnimatePresence mode="wait">
              {layout === "masonry" ? (
                <motion.div
                  key={`masonry-${activeFilter}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="grid gap-4"
                  style={{
                    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                    gridAutoRows: "180px",
                  }}
                >
                  {filtered.map((item, i) => (
                    <GalleryCard
                      key={item._id || item.id}
                      item={item}
                      index={i}
                      onClick={openLightbox}
                      darkMode={darkMode}
                    />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key={`grid-${activeFilter}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
                >
                  {filtered.map((item, i) => (
                    <GalleryCard
                      key={item._id || item.id}
                      item={{ ...item, size: "normal" }}
                      index={i}
                      onClick={openLightbox}
                      darkMode={darkMode}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── No items in CATEGORY (but gallery has other items) ── */}
            {filtered.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="text-center py-24"
              >
                <div className="text-5xl mb-4">🗂️</div>
                <p
                  className="font-bold"
                  style={{
                    color: darkMode ? "rgba(255,255,255,0.4)" : "rgba(30,40,80,0.4)",
                  }}
                >
                  No photos in "{activeFilter}" yet
                </p>
              </motion.div>
            )}
          </>
        )}

        {/* ── Bottom hint ── */}
        {galleryItems.length > 0 && (
          <div className="text-center mt-14">
            <p
              className="text-xs"
              style={{
                color: darkMode ? "rgba(255,255,255,0.2)" : "rgba(30,40,80,0.3)",
              }}
            >
              Click any photo to open full view · Use arrow keys to navigate
            </p>
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════
          LIGHTBOX
          AnimatePresence plays the exit animation when
          lightboxItem becomes null (user closes lightbox).
          Without AnimatePresence, the Lightbox would disappear
          instantly with no fade-out.
      ══════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {lightboxItem && (
          <Lightbox
            item={lightboxItem}
            items={lightboxItems}
            onClose={closeLightbox}
            onPrev={goPrev}
            onNext={goNext}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default Gallery;
