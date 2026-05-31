import Projects from "../../views/Projects";
import { serverFetch } from "../../lib/serverFetch";

export const metadata = {
  title: "Projects | Saksham Khadka — MERN Stack Portfolio",
  description: "Explore full-stack web projects by Saksham Khadka built with React, Node.js, Express, and MongoDB.",
  keywords: "Saksham Khadka Projects, MERN Stack Projects Nepal, React Projects, Node.js Projects, Full Stack Portfolio Nepal",
  alternates: { canonical: "https://saksham-profile.vercel.app/project" },
  openGraph: { title: "Projects | Saksham Khadka", url: "https://saksham-profile.vercel.app/project" },
};

export default async function ProjectsPage() {
  const initialProjects = await serverFetch("/api/projects");
  return <Projects initialProjects={initialProjects} />;
}
