// ─────────────────────────────────────────────────────────────
//  aboutService.js
//  Path: frontend/src/services/aboutService.js
//
//  WHY a separate service file?
//  ─────────────────────────────
//  About.jsx should only care about rendering UI.
//  All HTTP/API logic lives here so:
//    • If the backend route changes, only this file needs updating.
//    • The service can be reused from other components (e.g. Home page).
//    • Unit testing the API logic is easy — no need to render a component.
//
//  BACKEND ROUTE EXPECTED:
//    GET /api/about
//
//  WHY a single /api/about endpoint?
//  ─────────────────────────────────
//  The About page needs three related datasets:
//    1. timeline (education journey)
//    2. works    (project highlights)
//    3. resume   (download link + stats)
//
//  Combining them in one API call means ONE network request instead
//  of three. Faster page load, simpler error handling.
//
//  EXPECTED RESPONSE SHAPE FROM BACKEND:
//  {
//    success: true,
//    data: {
//      timeline: [
//        {
//          _id:         "64abc...",
//          period:      "2025 – Semester III",
//          type:        "uni",        // "school" | "uni" | "current" | "future"
//          title:       "BCSIT — Third Semester",
//          institution: "Bachelor of Computer Science & Information Technology",
//          description: "Dived deep into full-stack JavaScript...",
//          tags:        ["MongoDB", "Express", "React", "Node.js"],
//          accent:      "#10b981",
//          icon:        "⚡",
//          order:       3             // used to sort items chronologically
//        },
//        ...
//      ],
//      works: [
//        {
//          _id:   "64def...",
//          title: "Portfolio Website",
//          tech:  "MERN + Tailwind",
//          desc:  "This very site — a responsive, animated personal portfolio.",
//          color: "#6c9fff",
//          order: 1
//        },
//        ...
//      ],
//      resume: {
//        downloadUrl: "https://res.cloudinary.com/your-cloud/raw/upload/v1/resume.pdf",
//        stats: [
//          { label: "Semesters Done", value: "4"  },
//          { label: "Languages",      value: "5+" },
//          { label: "Projects",       value: "20+" }
//        ],
//        note: "My latest CV — updated for current semester"
//      }
//    }
//  }
// ─────────────────────────────────────────────────────────────

import axiosInstance from "../api/axiosInstance";

// ── fetchAbout ─────────────────────────────────────────────────
// Calls GET /api/about and returns the data object.
// The object contains { timeline, works, resume }.
// Throws an error if the request fails — the calling component
// should wrap this in try/catch and show an error screen.
export const fetchAbout = async () => {
  // axiosInstance baseURL = http://localhost:5000/api  (set in .env)
  // Full URL: GET http://localhost:5000/api/about
  const response = await axiosInstance.get("/about");

  // Supports both common backend response shapes:
  //   { success: true, data: { timeline, works, resume } }  ← standard
  //   { timeline, works, resume }                           ← plain object
  return response.data?.data ?? response.data;
};
