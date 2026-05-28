// ─────────────────────────────────────────────────────────────
//  axiosInstance.js
//  Path: frontend/src/api/axiosInstance.js
//
//  Why we create a custom instance instead of importing axios directly:
//   • Set the base URL once — all calls like axiosInstance.get("/projects")
//     automatically hit http://localhost:5000/api/projects
//   • If the backend URL ever changes, you only update .env, not 20 files
// ─────────────────────────────────────────────────────────────
 
import axios from "axios";

const axiosInstance = axios.create({
  // Reads VITE_API_URL from frontend/.env
  // Vite exposes env vars prefixed with VITE_ via import.meta.env
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",

  // Abort the request if backend doesn't respond in 10 seconds
  timeout: 10000,

  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
