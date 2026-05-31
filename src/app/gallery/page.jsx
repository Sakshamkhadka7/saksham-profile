import Gallery from "../../views/Gallery";
import { serverFetch } from "../../lib/serverFetch";

export const metadata = {
  title: "Gallery | Saksham Khadka Portfolio",
  description: "Photo gallery of Saksham Khadka — a MERN Stack developer from Nepal.",
  alternates: { canonical: "https://saksham-profile.vercel.app/gallery" },
  openGraph: { url: "https://saksham-profile.vercel.app/gallery" },
};

export default async function GalleryPage() {
  const initialItems = await serverFetch("/api/gallery");
  return <Gallery initialItems={initialItems} />;
}
