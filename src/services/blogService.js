// ─────────────────────────────────────────────────────────────
//  blogService.js
//  Path: frontend/src/services/blogService.js
//
//  WHY a separate service file?
//  ─────────────────────────────
//  Blog.jsx should only care about rendering UI.
//  All HTTP/API logic lives here so:
//    • If the backend route changes, only this file needs updating.
//    • The service can be reused from any other component.
//    • Unit testing the API logic is easy — no need to render a component.
//
//  BACKEND ROUTE EXPECTED:
//    GET /api/blogs
//
//  EXPECTED RESPONSE SHAPE FROM BACKEND (MongoDB + Cloudinary URLs):
//  {
//    success: true,
//    data: [
//      {
//        _id:       "64abc...",
//        title:     "How I Built My First MERN Stack App",
//        excerpt:   "From zero to full-stack in one semester...",
//        category:  "MERN Stack",
//        tags:      ["MongoDB", "Express", "React", "Node.js"],
//        date:      "2025-04-12T10:00:00Z",   // ISO string or "April 12, 2025"
//        readTime:  "8 min read",
//        accent:    "#3b82f6",
//        featured:  true,
//        emoji:     "⚡",
//        views:     "2.1k",   // string or number
//        likes:     94,
//        image:     "https://res.cloudinary.com/.../blog/cover.jpg",  // optional
//        author:    "Saksham Khadka"                                   // optional
//      },
//      ...
//    ]
//  }
// ─────────────────────────────────────────────────────────────

import axiosInstance from "../api/axiosInstance";

// ── fetchBlogs ─────────────────────────────────────────────────
// Calls GET /api/blogs and returns the data array.
// Throws if the request fails so the calling component can catch it.
export const fetchBlogs = async () => {
  // axiosInstance baseURL = http://localhost:5000/api  (set in .env)
  // Full URL: GET http://localhost:5000/api/blogs
  const response = await axiosInstance.get("/blogs");

  // Supports both common backend response shapes:
  //   { success: true, data: [...] }   ← recommended Express pattern
  //   [...]                            ← plain array (some backends do this)
  return response.data?.data ?? response.data;
};
