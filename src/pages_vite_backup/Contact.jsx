import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import axiosInstance from "../api/axiosInstance";
import SEO from "../components/SEO";

// ── Intersection Observer hook ──
const useInView = (options = {}) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.08, ...options }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return [ref, inView];
};

// ── Contact Info Data ──
const contactLinks = [
  {
    label: "Email",
    value: "sakshamkhadka@gmail.com",
    display: "sakshamkhadka@gmail.com",
    href: "mailto:sakshamkhadka@gmail.com",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
    accent: "#6c9fff",
    desc: "Best for project inquiries",
  },
  {
    label: "GitHub",
    value: "github.com/Sakshamkhadka7",
    display: "Sakshamkhadka7",
    href: "https://github.com/Sakshamkhadka7",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"/>
      </svg>
    ),
    accent: "#3ddc97",
    desc: "Check out my code",
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/sakshamkhadka",
    display: "Saksham Khadka",
    href: "https://www.linkedin.com/in/saksham-khadka-9981a4328/",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
    accent: "#0ea5e9",
    desc: "Professional network",
  },
  {
    label: "Location",
    value: "Kathmandu, Nepal",
    display: "Kathmandu, Nepal",
    href: "https://maps.google.com/?q=Kathmandu,Nepal",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    ),
    accent: "#f59e0b",
    desc: "GMT+5:45 · Open to remote",
  },
];

const services = [
  { icon: "🌐", label: "Web Development", desc: "Full-stack MERN apps" },
  { icon: "📱", label: "Mobile Apps", desc: "Flutter cross-platform" },
  { icon: "🎨", label: "UI/UX Design", desc: "Clean, modern interfaces" },
  { icon: "🔧", label: "API Development", desc: "RESTful Node.js APIs" },
];

// ── Floating particle canvas ──
const ParticleCanvas = ({ darkMode }) => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const parent = canvas.parentElement;
    const resize = () => {
      canvas.width = parent.offsetWidth;
      canvas.height = parent.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    const particles = Array.from({ length: 25 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.2 + 0.3,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      a: Math.random() * 0.25 + 0.05,
    }));
    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = darkMode
          ? `rgba(108,159,255,${p.a})`
          : `rgba(61,110,255,${p.a * 0.4})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, [darkMode]);
  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />;
};

// ── Contact Info Card ──
const ContactCard = ({ link, index, darkMode }) => {
  const [ref, inView] = useInView();
  const [hovered, setHovered] = useState(false);
  return (
      <a
      ref={ref}
      href={link.href}
      target={link.label !== "Email" ? "_blank" : undefined}
      rel="noopener noreferrer"
      className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-500 ease-out group ${
        inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6"
      }`}
      style={{
        transitionDelay: `${index * 80}ms`,
        background: hovered
          ? `${link.accent}12`
          : darkMode ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.8)",
        border: `1px solid ${hovered ? link.accent + "55" : darkMode ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}`,
        boxShadow: hovered
          ? `0 8px 32px ${link.accent}20`
          : darkMode ? "0 2px 16px rgba(0,0,0,0.25)" : "0 2px 16px rgba(0,0,0,0.06)",
        transform: hovered ? "translateX(4px)" : "translateX(0)",
        textDecoration: "none",
        transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Icon */}
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300"
        style={{
          background: `${link.accent}20`,
          color: link.accent,
          border: `1px solid ${link.accent}33`,
          transform: hovered ? "scale(1.1) rotate(-4deg)" : "scale(1) rotate(0deg)",
        }}
      >
        {link.icon}
      </div>
      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold uppercase tracking-wider mb-0.5"
          style={{ color: link.accent }}>
          {link.label}
        </p>
        <p className="text-sm font-bold truncate"
          style={{ color: darkMode ? "#fff" : "#1a2050" }}>
          {link.display}
        </p>
        <p className="text-xs mt-0.5"
          style={{ color: darkMode ? "rgba(255,255,255,0.35)" : "rgba(30,40,80,0.45)" }}>
          {link.desc}
        </p>
      </div>
      {/* Arrow */}
      <div
        className="flex-shrink-0 transition-all duration-300"
        style={{
          color: link.accent,
          opacity: hovered ? 1 : 0.3,
          transform: hovered ? "translateX(2px)" : "translateX(0)",
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="5" y1="12" x2="19" y2="12"/>
          <polyline points="12 5 19 12 12 19"/>
        </svg>
      </div>
    </a>
  );
};

// ── Input Field ──
const Field = ({ label, type = "text", name, value, onChange, error, darkMode, placeholder, rows }) => {
  const [focused, setFocused] = useState(false);
  const isTextarea = type === "textarea";
  const inputStyle = {
    background: focused
      ? darkMode ? "rgba(108,159,255,0.08)" : "rgba(108,159,255,0.05)"
      : darkMode ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.9)",
    border: `1px solid ${
      error ? "#ef444466"
      : focused ? "#6c9fff88"
      : darkMode ? "rgba(255,255,255,0.09)" : "rgba(0,0,0,0.1)"
    }`,
    color: darkMode ? "#fff" : "#1a2050",
    outline: "none",
    width: "100%",
    borderRadius: "0.875rem",
    padding: isTextarea ? "0.875rem 1rem" : "0.75rem 1rem",
    fontSize: "0.875rem",
    fontFamily: "inherit",
    resize: isTextarea ? "vertical" : undefined,
    transition: "all 0.25s ease",
    boxShadow: focused ? `0 0 0 3px ${error ? "#ef444418" : "#6c9fff18"}` : "none",
    caretColor: "#6c9fff",
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold uppercase tracking-wider"
        style={{ color: darkMode ? "rgba(255,255,255,0.5)" : "rgba(30,40,80,0.55)" }}>
        {label}
        <span style={{ color: "#ef4444" }}> *</span>
      </label>
      {isTextarea ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          rows={rows || 5}
          style={inputStyle}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          style={inputStyle}
        />
      )}
      {error && (
        <p className="text-xs flex items-center gap-1" style={{ color: "#ef4444" }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};

// ── Validate ──
const validate = (form) => {
  const errors = {};
  if (!form.name.trim()) errors.name = "Name is required";
  else if (form.name.trim().length < 2) errors.name = "Name too short";
  if (!form.email.trim()) errors.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = "Invalid email address";
  if (!form.subject.trim()) errors.subject = "Subject is required";
  if (!form.message.trim()) errors.message = "Message is required";
  else if (form.message.trim().length < 20) errors.message = "Message too short (min 20 chars)";
  return errors;
};

// ── Main Component ──
const Contact = () => {
  const { darkMode } = useTheme();
  const [heroRef, heroInView] = useInView();
  const [formRef, formInView] = useInView();
  const [servicesRef, servicesInView] = useInView();

  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [charCount, setCharCount] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (name === "message") setCharCount(value.length);
    if (errors[name]) setErrors(p => ({ ...p, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setStatus("sending");
    try {
      await axiosInstance.post("/contact/submit", form);
      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
      setCharCount(0);
      setTimeout(() => setStatus("idle"), 5000);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to send message. Please try again.";
      setErrors({ submit: msg });
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  const availabilityDot = true; // Set false when not available

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
        title="Contact Saksham Khadka | Hire MERN Stack Developer Nepal"
        description="Get in touch with Saksham Khadka — MERN Stack developer from Nepal. Available for freelance projects, collaborations, and full-stack web development work."
        keywords="Contact Saksham Khadka, Hire MERN Stack Developer Nepal, Freelance React Developer Nepal, Full Stack Developer for Hire Nepal"
        canonical="/contact"
      />
      <ParticleCanvas darkMode={darkMode} />

      {/* Glow orbs */}
      <div className="absolute top-20 right-0 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: "rgba(108,159,255,0.09)", filter: "blur(100px)" }} />
      <div className="absolute bottom-20 left-0 w-72 h-72 rounded-full pointer-events-none"
        style={{ background: "rgba(61,220,151,0.07)", filter: "blur(90px)" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "rgba(139,92,246,0.05)", filter: "blur(120px)" }} />

      <div className="max-w-6xl mx-auto relative z-10">

        {/* ── Header ── */}
        <div
          ref={heroRef}
          className={`text-center mb-14 transition-all duration-700 ease-out ${
            heroInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Availability badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5 text-xs font-bold uppercase tracking-widest"
            style={{
              background: availabilityDot ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.12)",
              border: `1px solid ${availabilityDot ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"}`,
              color: availabilityDot ? "#10b981" : "#ef4444",
            }}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{
                background: availabilityDot ? "#10b981" : "#ef4444",
                animation: availabilityDot ? "pulse 2s infinite" : "none",
              }}
            />
            {availabilityDot ? "Available for new projects" : "Currently unavailable"}
          </div>

          <p className="text-xs uppercase tracking-[0.3em] font-bold mb-3" style={{ color: "#6c9fff" }}>
            Get In Touch
          </p>
          <h2
            className="text-4xl md:text-5xl font-extrabold mb-4"
            style={{ fontFamily: "'DM Serif Display', serif", color: darkMode ? "#fff" : "#1a2050" }}
          >
            Let's{" "}
            <em className="not-italic" style={{ color: "#6c9fff" }}>Work</em>{" "}
            Together
          </h2>
          <p className="text-sm leading-relaxed max-w-md mx-auto"
            style={{ color: darkMode ? "rgba(255,255,255,0.45)" : "rgba(30,40,80,0.6)" }}>
            Whether you need a full-stack web app, a mobile application, or just want
            to say hello — my inbox is always open.
          </p>
        </div>

        {/* ── Main layout ── */}
        <div className="flex flex-col lg:flex-row gap-8 mb-12">

          {/* ── LEFT: Info panel ── */}
          <div className="lg:w-[42%] flex flex-col gap-5">

            {/* Contact links */}
            <div
              className="rounded-3xl p-6"
              style={{
                background: darkMode ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.75)",
                border: `1px solid ${darkMode ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}`,
                boxShadow: darkMode ? "0 8px 40px rgba(0,0,0,0.4)" : "0 8px 40px rgba(0,0,0,0.07)",
              }}
            >
              <h3 className="text-sm font-extrabold mb-4 flex items-center gap-2"
                style={{ fontFamily: "'DM Serif Display', serif", color: darkMode ? "#fff" : "#1a2050" }}>
                <span>📬</span> Contact Info
              </h3>
              <div className="flex flex-col gap-3">
                {contactLinks.map((link, i) => (
                  <ContactCard key={link.label} link={link} index={i} darkMode={darkMode} />
                ))}
              </div>
            </div>

            {/* Services */}
            <div
              ref={servicesRef}
              className={`rounded-3xl p-6 transition-all duration-600 ease-out ${
                servicesInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{
                background: darkMode ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.75)",
                border: `1px solid ${darkMode ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}`,
                boxShadow: darkMode ? "0 8px 40px rgba(0,0,0,0.4)" : "0 8px 40px rgba(0,0,0,0.07)",
              }}
            >
              <h3 className="text-sm font-extrabold mb-4"
                style={{ fontFamily: "'DM Serif Display', serif", color: darkMode ? "#fff" : "#1a2050" }}>
                🛠 What I Can Help With
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {services.map((s, i) => (
                  <div
                    key={s.label}
                    className={`rounded-2xl p-3 transition-all duration-500 ${
                      servicesInView ? "opacity-100 scale-100" : "opacity-0 scale-90"
                    }`}
                    style={{
                      transitionDelay: `${i * 80}ms`,
                      background: darkMode ? "rgba(255,255,255,0.04)" : "rgba(108,159,255,0.05)",
                      border: `0.5px solid ${darkMode ? "rgba(255,255,255,0.07)" : "rgba(108,159,255,0.15)"}`,
                    }}
                  >
                    <div className="text-xl mb-1.5">{s.icon}</div>
                    <p className="text-xs font-extrabold mb-0.5"
                      style={{ color: darkMode ? "#fff" : "#1a2050" }}>
                      {s.label}
                    </p>
                    <p className="text-xs" style={{ color: darkMode ? "rgba(255,255,255,0.35)" : "rgba(30,40,80,0.5)" }}>
                      {s.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Response time card */}
            <div
              className="rounded-3xl p-5 relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, rgba(61,110,255,0.14), rgba(108,61,255,0.14))",
                border: "1px solid rgba(108,159,255,0.25)",
              }}
            >
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full pointer-events-none"
                style={{ background: "rgba(108,159,255,0.15)", filter: "blur(24px)", transform: "translate(30%,-30%)" }} />
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
                  style={{ background: "rgba(108,159,255,0.2)" }}>
                  ⚡
                </div>
                <div>
                  <p className="text-sm font-extrabold" style={{ color: darkMode ? "#fff" : "#1a2050" }}>
                    Fast Response
                  </p>
                  <p className="text-xs" style={{ color: darkMode ? "rgba(255,255,255,0.45)" : "rgba(30,40,80,0.55)" }}>
                    Usually within 24 hours
                  </p>
                </div>
              </div>
              <div className="flex gap-3 mt-3">
                {[
                  { label: "Response", value: "< 24h", color: "#6c9fff" },
                  { label: "Timezone", value: "GMT+5:45", color: "#3ddc97" },
                  { label: "Status", value: "Open", color: "#10b981" },
                ].map(item => (
                  <div key={item.label} className="flex-1 text-center">
                    <div className="text-sm font-extrabold" style={{ color: item.color }}>{item.value}</div>
                    <div className="text-xs mt-0.5"
                      style={{ color: darkMode ? "rgba(255,255,255,0.3)" : "rgba(30,40,80,0.4)" }}>
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT: Contact Form ── */}
          <div
            ref={formRef}
            className={`flex-1 transition-all duration-700 ease-out ${
              formInView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
            }`}
          >
            <div
              className="rounded-3xl p-7 md:p-8 h-full"
              style={{
                background: darkMode ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.9)",
                border: `1px solid ${darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
                boxShadow: darkMode ? "0 12px 60px rgba(0,0,0,0.5)" : "0 12px 60px rgba(0,0,0,0.08)",
              }}
            >
              {/* Form header */}
              <div className="mb-7">
                <h3
                  className="text-xl font-extrabold mb-1"
                  style={{ fontFamily: "'DM Serif Display', serif", color: darkMode ? "#fff" : "#1a2050" }}
                >
                  Send a Message
                </h3>
                <p className="text-xs" style={{ color: darkMode ? "rgba(255,255,255,0.4)" : "rgba(30,40,80,0.5)" }}>
                  Fill out the form below and I'll get back to you shortly.
                </p>
              </div>

              {/* Success state */}
              {status === "success" ? (
                <div
                  className="flex flex-col items-center justify-center py-16 text-center"
                  style={{ animation: "fadeIn 0.5s ease" }}
                >
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-5"
                    style={{
                      background: "rgba(16,185,129,0.15)",
                      border: "2px solid rgba(16,185,129,0.4)",
                      boxShadow: "0 0 32px rgba(16,185,129,0.2)",
                    }}
                  >
                    ✅
                  </div>
                  <h4 className="text-lg font-extrabold mb-2"
                    style={{ fontFamily: "'DM Serif Display', serif", color: darkMode ? "#fff" : "#1a2050" }}>
                    Message Sent!
                  </h4>
                  <p className="text-sm max-w-xs"
                    style={{ color: darkMode ? "rgba(255,255,255,0.5)" : "rgba(30,40,80,0.6)" }}>
                    Thanks for reaching out. I'll reply within 24 hours.
                  </p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="mt-6 px-5 py-2 rounded-xl text-xs font-bold transition-all hover:-translate-y-0.5"
                    style={{
                      background: "rgba(16,185,129,0.15)",
                      color: "#10b981",
                      border: "1px solid rgba(16,185,129,0.3)",
                    }}
                  >
                    Send Another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  <div className="flex flex-col gap-5">

                    {/* Name + Email row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field
                        label="Your Name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        error={errors.name}
                        darkMode={darkMode}
                        placeholder="Saksham Khadka"
                      />
                      <Field
                        label="Email Address"
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        error={errors.email}
                        darkMode={darkMode}
                        placeholder="you@example.com"
                      />
                    </div>

                    {/* Subject */}
                    <Field
                      label="Subject"
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      error={errors.subject}
                      darkMode={darkMode}
                      placeholder="Project collaboration, freelance work..."
                    />

                 
                    <div>
                      <Field
                        label="Message"
                        type="textarea"
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        error={errors.message}
                        darkMode={darkMode}
                        placeholder="Tell me about your project, idea, or just say hello..."
                        rows={5}
                      />
                      <div className="flex justify-end mt-1">
                        <span className="text-xs"
                          style={{ color: charCount > 500 ? "#ef4444" : darkMode ? "rgba(255,255,255,0.25)" : "rgba(30,40,80,0.35)" }}>
                          {charCount} / 500
                        </span>
                      </div>
                    </div>
                    {errors.submit && (
                      <p className="text-xs font-semibold px-3 py-2 rounded-xl"
                        style={{ color: "#f87171", background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.25)" }}>
                        {errors.submit}
                      </p>
                    )}

                    {/* Submit button */}
                    <button
                      type="submit"
                      disabled={status === "sending"}
                      className="w-full py-3.5 rounded-2xl text-sm font-extrabold text-white transition-all hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
                      style={{
                        background: status === "sending"
                          ? "linear-gradient(135deg, #3d6eff99, #6c3dff99)"
                          : "linear-gradient(135deg, #3d6eff, #6c3dff)",
                        boxShadow: status === "sending" ? "none" : "0 8px 32px rgba(61,110,255,0.35)",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {status === "sending" ? (
                        <>
                          <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                          </svg>
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <line x1="22" y1="2" x2="11" y2="13"/>
                            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                          </svg>
                        </>
                      )}
                    </button>

                    {/* Privacy note */}
                    <p className="text-center text-xs"
                      style={{ color: darkMode ? "rgba(255,255,255,0.2)" : "rgba(30,40,80,0.35)" }}>
                      🔒 Your information is never shared with anyone.
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* ── Bottom: Social links + footer note ── */}
        <div
          className={`transition-all duration-700 ease-out`}
          style={{ transitionDelay: "200ms" }}
        >
          <div
            className="rounded-3xl p-6 text-center"
            style={{
              background: darkMode ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.7)",
              border: `1px solid ${darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
            }}
          >
            <p className="text-xs uppercase tracking-[0.2em] font-bold mb-4"
              style={{ color: darkMode ? "rgba(255,255,255,0.35)" : "rgba(30,40,80,0.45)" }}>
              Find Me On
            </p>
            <div className="flex items-center justify-center flex-wrap gap-3 mb-5">
              {[
                { label: "GitHub", href: "https://github.com/Sakshamkhadka7", color: "#3ddc97", icon: (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                )},
                { label: "LinkedIn", href: "https://linkedin.com/in/sakshamkhadka", color: "#0ea5e9", icon: (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                )},
                { label: "Email", href: "mailto:sakshamkhadka@gmail.com", color: "#6c9fff", icon: (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                )},
                { label: "Facebook", href: "https://www.facebook.com/saksham.khadka.561267/", color: "#1877f2", icon: (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                )},
                { label: "Instagram", href: "https://www.instagram.com/sakshamkhadka84", color: "#e1306c", icon: (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                  </svg>
                )}
              ].map(social => (
                 <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all hover:-translate-y-1 hover:shadow-lg"
                  style={{
                    background: darkMode ? `${social.color}15` : `${social.color}12`,
                    color: social.color,
                    border: `0.5px solid ${social.color}44`,
                  }}
                >
                  {social.icon}
                  {social.label}
                </a>
              ))}
            </div>

            {/* Footer line */}
            <div className="flex items-center justify-center gap-2">
              <div className="h-px w-12" style={{ background: darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)" }} />
              <p className="text-xs"
                style={{ color: darkMode ? "rgba(255,255,255,0.2)" : "rgba(30,40,80,0.35)" }}>
                Built with ⚛️ React · Styled with 💙 Tailwind · Deployed on 🔺 Vercel
              </p>
              <div className="h-px w-12" style={{ background: darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)" }} />
            </div>
          </div>
        </div>

      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </section>
  );
};

export default Contact;