"use client";

import React from "react";
import Link from "next/link";
import { useTheme } from "../context/ThemeContext";

const NAV_LINKS = [
  { href: "/",        label: "Home"    },
  { href: "/about",   label: "About"   },
  { href: "/project", label: "Projects" },
  { href: "/gallery", label: "Gallery" },
  { href: "/skills",  label: "Skills"  },
  { href: "/blog",    label: "Blog"    },
  { href: "/contact", label: "Contact" },
];

const SOCIALS = [
  {
    label: "GitHub",
    href: "https://github.com/Sakshamkhadka7",
    color: "#3ddc97",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/saksham-khadka-9981a4328/",
    color: "#0ea5e9",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "Email",
    href: "mailto:sakshamcode12@gmail.com",
    color: "#6c9fff",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://instagram.com/sakshamkhadka84",
    color: "#e1306c",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
];

const Footer = () => {
  const { darkMode } = useTheme();
  const year = new Date().getFullYear();

  const border  = darkMode ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)";
  const muted   = darkMode ? "rgba(255,255,255,0.35)" : "rgba(30,40,80,0.45)";
  const heading = darkMode ? "#fff" : "#1a2050";

  return (
    <footer
      style={{
        background: darkMode ? "#080d1a" : "#f7f8fc",
        borderTop: `1px solid ${border}`,
      }}
    >
      {/* ── Main grid ── */}
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-3 gap-12">

        {/* Brand column */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <img
              src="/assets/sakshamport.jpeg"
              alt="Saksham"
              className="w-10 h-10 rounded-2xl object-cover"
            />
            <div>
              <p className="font-extrabold text-base leading-tight" style={{ color: heading }}>
                Saksham Khadka
              </p>
              <p className="text-xs font-medium" style={{ color: "#6c9fff" }}>
                MERN Stack Developer
              </p>
            </div>
          </div>
          <p className="text-sm leading-relaxed max-w-xs" style={{ color: muted }}>
            Building clean, full-stack web applications with a passion for great UX and solid backend architecture.
          </p>

          {/* Social icons */}
          <div className="flex items-center gap-3 mt-1">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target={s.href.startsWith("mailto") ? undefined : "_blank"}
                rel="noopener noreferrer"
                title={s.label}
                className="flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  background: darkMode ? `${s.color}15` : `${s.color}10`,
                  color: s.color,
                  border: `0.5px solid ${s.color}40`,
                }}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Quick links column */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color: "#6c9fff" }}>
            Quick Links
          </p>
          <ul className="flex flex-col gap-3">
            {NAV_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-sm font-medium transition-colors hover:text-blue-400"
                  style={{ color: muted }}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact info column */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color: "#6c9fff" }}>
            Get In Touch
          </p>
          <ul className="flex flex-col gap-4">
            <li className="flex items-start gap-3">
              <span className="mt-0.5" style={{ color: "#6c9fff" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </span>
              <a href="mailto:sakshamkhadka@gmail.com" className="text-sm hover:text-blue-400 transition-colors" style={{ color: muted }}>
                sakshamkhadka@gmail.com
              </a>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5" style={{ color: "#3ddc97" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </span>
              <a href="https://github.com/Sakshamkhadka7" target="_blank" rel="noopener noreferrer" className="text-sm hover:text-blue-400 transition-colors" style={{ color: muted }}>
                github.com/Sakshamkhadka7
              </a>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5" style={{ color: "#0ea5e9" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </span>
              <a href="https://www.linkedin.com/in/saksham-khadka-9981a4328/" target="_blank" rel="noopener noreferrer" className="text-sm hover:text-blue-400 transition-colors" style={{ color: muted }}>
                linkedin.com/in/sakshamkhadka
              </a>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5" style={{ color: muted }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </span>
              <span className="text-sm" style={{ color: muted }}>
                Kathmandu, Nepal
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div style={{ borderTop: `1px solid ${border}` }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs" style={{ color: muted }}>
            © {year} Saksham Khadka. All rights reserved.
          </p>
          <p className="text-xs" style={{ color: muted }}>
            Built with React · Node.js · MongoDB
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
