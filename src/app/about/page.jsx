import About from "../../views/About";
import { serverFetch } from "../../lib/serverFetch";

export const metadata = {
  title: "About Saksham Khadka | MERN Stack Developer Nepal",
  description: "Learn about Saksham Khadka — BCSIT student from Nepal, MERN Stack developer. Timeline of my journey from high school to building full-stack web apps.",
  keywords: "Saksham Khadka About, BCSIT Nepal, MERN Stack Student Nepal, Full Stack Developer Journey, Web Developer Nepal",
  alternates: { canonical: "https://saksham-profile.vercel.app/about" },
  openGraph: { title: "About Saksham Khadka", url: "https://saksham-profile.vercel.app/about" },
};

export default async function AboutPage() {
  const initialData = await serverFetch("/api/about");
  return <About initialData={initialData} />;
}
