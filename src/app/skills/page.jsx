import Skills from "../../views/Skills";
import { serverFetch } from "../../lib/serverFetch";

export const metadata = {
  title: "Skills | Saksham Khadka — React, Node.js, MongoDB Developer",
  description: "Technical skills of Saksham Khadka: React.js, Node.js, Express.js, MongoDB, Flutter, Dart, Tailwind CSS, JavaScript, PHP.",
  keywords: "Saksham Khadka Skills, React Developer, Node.js Developer, MongoDB Nepal, Flutter Developer Nepal",
  alternates: { canonical: "https://saksham-profile.vercel.app/skills" },
  openGraph: { title: "Skills | Saksham Khadka", url: "https://saksham-profile.vercel.app/skills" },
};

export default async function SkillsPage() {
  const initialData = await serverFetch("/api/skills");
  return <Skills initialData={initialData} />;
}
