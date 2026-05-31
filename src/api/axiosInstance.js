import axios from "axios";

const axiosInstance = axios.create({
  // /api/proxy is rewritten by Next.js to the backend server-side — no CORS.
  // Falls back to localhost:5000 when running outside of Next.js (e.g. tests).
  baseURL:
    typeof window !== "undefined"
      ? "/api/proxy"
      : process.env.BACKEND_URL
        ? `${process.env.BACKEND_URL}/api`
        : "http://localhost:5000/api",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

export default axiosInstance;
