import Home from "../views/Home";
import { serverFetch } from "../lib/serverFetch";

export const metadata = {
  title: "Saksham Khadka | MERN Stack Developer Nepal",
  description: "Hi, I'm Saksham Khadka — a MERN Stack Developer from Kathmandu, Nepal. I build full-stack web apps using React, Node.js, Express, and MongoDB. Available for freelance.",
  keywords: "Saksham Khadka, MERN Stack Developer Nepal, Full Stack Developer Kathmandu, React Developer Nepal, Node.js Developer Nepal",
  alternates: { canonical: "https://saksham-profile.vercel.app/" },
  openGraph: { title: "Saksham Khadka | MERN Stack Developer Nepal", url: "https://saksham-profile.vercel.app/" },
};

export default async function HomePage() {
  const raw = await serverFetch("/api/projects");
  const projects = Array.isArray(raw) ? raw.slice(0, 2) : [];
  return <Home initialProjects={projects} />;
}
