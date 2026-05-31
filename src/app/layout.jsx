import "./globals.css";
import Providers from "../components/Providers";
import Header from "../components/Header";
import Footer from "../components/Footer";

const BASE_URL = "https://saksham-profile.vercel.app";
const IMAGE    = `${BASE_URL}/assets/sakshamport.jpeg`;

export const metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    default:  "Saksham Khadka | MERN Stack Developer Nepal",
    template: "%s | Saksham Khadka",
  },

  description:
    "Saksham Khadka — MERN Stack Developer & BCSIT student from Kathmandu, Nepal. I build full-stack web apps with React.js, Node.js, Express and MongoDB. Available for freelance & internships.",

  keywords: [
    "Saksham Khadka",
    "MERN Stack Developer Nepal",
    "Full Stack Developer Kathmandu",
    "React Developer Nepal",
    "Node.js Developer Nepal",
    "JavaScript Developer Nepal",
    "Web Developer Nepal",
    "BCSIT Student Developer",
    "Freelance Web Developer Nepal",
    "Portfolio Nepal",
    "MongoDB Developer Nepal",
    "Flutter Developer Nepal",
  ],

  authors: [{ name: "Saksham Khadka", url: BASE_URL }],
  creator: "Saksham Khadka",
  publisher: "Saksham Khadka",

  // ── Favicon / Icons ──
  // Next.js auto-serves src/app/icon.jpg and apple-icon.jpg as favicons.
  // No manual icons config needed — the file presence handles it.

  // ── Open Graph (Facebook, WhatsApp, LinkedIn previews) ──
  openGraph: {
    type:        "website",
    locale:      "en_US",
    url:         BASE_URL,
    siteName:    "Saksham Khadka Portfolio",
    title:       "Saksham Khadka | MERN Stack Developer Nepal",
    description: "Full Stack Developer from Kathmandu, Nepal — React, Node.js, MongoDB, Flutter.",
    images: [
      {
        url:    IMAGE,
        width:  800,
        height: 900,
        alt:    "Saksham Khadka — MERN Stack Developer from Nepal",
      },
    ],
  },

  // ── Twitter / X card ──
  twitter: {
    card:        "summary_large_image",
    title:       "Saksham Khadka | MERN Stack Developer Nepal",
    description: "Full Stack Developer from Kathmandu, Nepal — React, Node.js, MongoDB, Flutter.",
    images:      [IMAGE],
    creator:     "@sakshamkhadka",
  },

  // ── Robots ──
  robots: {
    index:               true,
    follow:              true,
    googleBot: {
      index:             true,
      follow:            true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet":       -1,
    },
  },

  alternates: { canonical: BASE_URL },
};

// ── JSON-LD structured data (Person schema) ──
const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name:     "Saksham Khadka",
  jobTitle: "MERN Stack Developer",
  url:      BASE_URL,
  image:    IMAGE,
  email:    "khadkashaksham07@gmail.com",
  address: {
    "@type":          "PostalAddress",
    addressLocality:  "Kathmandu",
    addressCountry:   "NP",
  },
  sameAs: [
    "https://github.com/Sakshamkhadka7",
    "https://www.linkedin.com/in/saksham-khadka-9981a4328/",
    "https://instagram.com/sakshamkhadka84",
    "https://saksham-profile.vercel.app",
  ],
  knowsAbout: [
    "React.js", "Node.js", "Express.js", "MongoDB",
    "JavaScript", "TypeScript", "Flutter", "Tailwind CSS",
    "Full Stack Web Development", "MERN Stack", "REST API",
    "JWT Authentication", "Cloudinary", "Git",
  ],
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name:    "Quest International College — Pokhara University",
  },
  hasOccupation: {
    "@type":            "Occupation",
    name:               "Full Stack Web Developer",
    occupationLocation: { "@type": "Country", name: "Nepal" },
    skills:             "React.js, Node.js, MongoDB, Express.js, Flutter",
  },
};

const websiteSchema = {
  "@context":   "https://schema.org",
  "@type":      "WebSite",
  name:         "Saksham Khadka Portfolio",
  url:          BASE_URL,
  description:  "Portfolio of Saksham Khadka — MERN Stack Developer from Kathmandu, Nepal.",
  author: { "@type": "Person", name: "Saksham Khadka" },
  potentialAction: {
    "@type":       "SearchAction",
    target:        `${BASE_URL}/blog?search={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&display=swap"
          rel="stylesheet"
        />
        {/* Person structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        {/* WebSite structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body>
        <Providers>
          <Header />
          <main className="w-full">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
