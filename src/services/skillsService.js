// ─────────────────────────────────────────────────────────────
//  skillsService.js
//  Path: frontend/src/services/skillsService.js
//
//  WHY a separate service file?
//  ─────────────────────────────
//  Instead of writing axiosInstance.get("/skills") directly inside
//  Skills.jsx, we put it here. This means:
//    • If the backend route changes, you update it in ONE place.
//    • Skills.jsx stays clean — it only deals with UI, not HTTP.
//    • You can reuse fetchSkills() in other components (e.g., Home page).
//
//  BACKEND ROUTE EXPECTED:
//    GET /api/skills
//
//  EXPECTED RESPONSE SHAPE FROM BACKEND (MongoDB via Mongoose):
//  Option A — Categories with nested skills (recommended):
//  {
//    success: true,
//    data: [
//      {
//        id: "frontend",
//        label: "Frontend",
//        icon: "🎨",
//        accent: "#6c9fff",
//        skills: [
//          { name: "React", level: 82, icon: "⚛️", color: "#61dafb", desc: "Hooks, Context, SPA" },
//          ...
//        ]
//      },
//      { id: "backend", label: "Backend", ... },
//      { id: "mobile",  label: "Mobile",  ... }
//    ]
//  }
//
//  Option B — Flat array (also handled):
//  {
//    success: true,
//    data: [
//      { name: "React", level: 82, icon: "⚛️", color: "#61dafb",
//        desc: "...", category: "Frontend", categoryAccent: "#6c9fff",
//        categoryIcon: "🎨" }
//    ]
//  }
//  ─────────────────────────────────────────────────────────────

import axiosInstance from "../api/axiosInstance";

// ── fetchSkills ────────────────────────────────────────────────
// Calls GET /api/skills and returns the data array.
// Throws an error if the request fails (caller handles it with try/catch).
export const fetchSkills = async () => {
  // axiosInstance already has baseURL = http://localhost:5000/api
  // so this hits: GET http://localhost:5000/api/skills
  const response = await axiosInstance.get("/skills");

  // Handle both response shapes:
  //   { success: true, data: [...] }  ← standard backend format
  //   [...]                           ← plain array (rare)
  return response.data?.data ?? response.data;
};
