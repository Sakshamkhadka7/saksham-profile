// ─────────────────────────────────────────────────────────────
//  galleryService.js
//  Path: frontend/src/services/galleryService.js
//
//  WHY a separate service file?
//  ─────────────────────────────
//  Gallery.jsx should only care about rendering UI.
//  All HTTP/API logic lives here so:
//    • If the backend route changes, only this file needs updating.
//    • The service can be reused from any component (e.g., Home page).
//    • Unit testing the API logic is easy — no need to render a component.
//
//  BACKEND ROUTE EXPECTED:
//    GET /api/gallery
//
//  EXPECTED RESPONSE SHAPE FROM BACKEND (MongoDB + Cloudinary URLs):
//  {
//    success: true,
//    data: [
//      {
//        _id:      "64abc...",
//        src:      "https://res.cloudinary.com/your-cloud/image/upload/v1/gallery/img.jpg",
//        thumb:    "https://res.cloudinary.com/your-cloud/image/upload/c_thumb,w_400/gallery/img.jpg",
//        title:    "Code & Coffee",
//        category: "Development",
//        tags:     ["coding", "workspace"],
//        size:     "tall",       // "tall" | "wide" | "normal"
//        accent:   "#6c9fff"
//      },
//      ...
//    ]
//  }
// ─────────────────────────────────────────────────────────────

import axiosInstance from "../api/axiosInstance";

// ── fetchGallery ───────────────────────────────────────────────
// Calls GET /api/gallery and returns the data array.
// Throws if the request fails so the calling component can catch it.
export const fetchGallery = async () => {
  // axiosInstance baseURL = http://localhost:5000/api  (set in .env)
  // Full URL: GET http://localhost:5000/api/gallery
  const response = await axiosInstance.get("/gallery");

  // Supports both common backend response shapes:
  //   { success: true, data: [...] }   ← recommended Express pattern
  //   [...]                            ← plain array (some backends do this)
  return response.data?.data ?? response.data;
};
