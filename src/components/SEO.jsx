import { Helmet } from "react-helmet-async";

const BASE_URL = "https://saksham-profile.vercel.app";
const DEFAULT_IMAGE = `${BASE_URL}/assets/sakshamport.jpeg`;

const SEO = ({
  title = "Saksham Khadka | MERN Stack Developer Nepal",
  description = "Saksham Khadka — Full Stack Developer from Nepal. React, Node.js, Express, MongoDB. Building modern web apps. Available for freelance.",
  keywords = "Saksham Khadka, MERN Stack Developer, Full Stack Developer Nepal, React Developer, Node.js Developer",
  canonical,
  image = DEFAULT_IMAGE,
  type = "website",
}) => {
  const url = canonical ? `${BASE_URL}${canonical}` : BASE_URL;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Saksham Khadka Portfolio" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
};

export default SEO;
