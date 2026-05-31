import Blog from "../../views/Blog";
import { serverFetch } from "../../lib/serverFetch";

export const metadata = {
  title: "Blog | Saksham Khadka — MERN Stack Developer Nepal",
  description: "Read articles by Saksham Khadka about MERN stack development, React, Node.js, and web development in Nepal.",
  alternates: { canonical: "https://saksham-profile.vercel.app/blog" },
  openGraph: { title: "Blog | Saksham Khadka", url: "https://saksham-profile.vercel.app/blog" },
};

export default async function BlogPage() {
  const initialBlogs = await serverFetch("/api/blogs");
  return <Blog initialBlogs={initialBlogs} />;
}
