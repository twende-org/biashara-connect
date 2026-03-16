import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  jsonLd?: object | object[];
}

const BASE_URL = "https://duka.twendedigital.tech";

export default function SEO({
  title,
  description,
  keywords = "duka, dukasmart, duka smart, twendedigital, twende digital, POS Tanzania, duka pos system, shop management, mfumo wa duka, biashara, inventory management, mauzo, stoo, point of sale, smart shop management",
  canonical,
  ogImage = `${BASE_URL}/icon_duka.png`,
  ogType = "website",
  jsonLd,
}: SEOProps) {
  const fullTitle = `${title} | DukaSmart by TwendeDigital`;
  const canonicalUrl = canonical ? `${BASE_URL}${canonical}` : undefined;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Twende Digital" />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* OpenGraph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="DukaSmart" />
      <meta property="og:locale" content="sw_TZ" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* JSON-LD */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(Array.isArray(jsonLd) ? jsonLd : jsonLd)}
        </script>
      )}
    </Helmet>
  );
}
