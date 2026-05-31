/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "latest-profile-backend.onrender.com" },
    ],
  },
  async redirects() {
    return [{ source: "/home", destination: "/", permanent: true }];
  },
  // Proxy all /api/proxy/* calls to the backend server-side.
  // The browser calls the same origin (no CORS), Next.js forwards server-to-server.
  async rewrites() {
    const backend =
      process.env.BACKEND_URL || "https://latest-profile-backend.onrender.com";
    return [
      {
        source: "/api/proxy/:path*",
        destination: `${backend}/api/:path*`,
      },
    ];
  },
};
export default nextConfig;
