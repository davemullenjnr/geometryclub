import {
  DEFAULT_OG_IMAGE_PATH,
  INSTAGRAM_URL,
  IOS_APP_STORE_URL,
  SITE_AUTHOR,
  SITE_NAME,
  SITE_URL,
} from "@/lib/site";

const organizationId = `${SITE_URL}/#organization`;
const websiteId = `${SITE_URL}/#website`;

const organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": organizationId,
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/logo/geometry-club-icon.svg`,
  sameAs: [INSTAGRAM_URL],
};

const website = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": websiteId,
  name: SITE_NAME,
  url: SITE_URL,
  inLanguage: "en-GB",
  publisher: { "@id": organizationId },
};

export default function SiteJsonLd() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
    </>
  );
}

export function WebPageJsonLd({
  path,
  name,
  description,
  imagePath,
}: {
  path: string;
  name: string;
  description: string;
  /** Path only (leading slash); defaults to site default OG image */
  imagePath?: string;
}) {
  const pathname = path.startsWith("/") ? path : `/${path}`;
  const url = `${SITE_URL}${pathname === "/" ? "" : pathname}`;
  const primaryImageUrl = `${SITE_URL}${imagePath ?? DEFAULT_OG_IMAGE_PATH}`;
  const page = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}/#webpage`,
    url,
    name,
    description,
    isPartOf: { "@id": websiteId },
    about: { "@id": organizationId },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: primaryImageUrl,
    },
    author: {
      "@type": "Person",
      name: SITE_AUTHOR,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(page) }}
    />
  );
}

export function MobileApplicationJsonLd() {
  const appUrl = `${SITE_URL}/app`;
  const data = {
    "@context": "https://schema.org",
    "@type": "MobileApplication",
    name: SITE_NAME,
    operatingSystem: "iOS",
    url: appUrl,
    downloadUrl: IOS_APP_STORE_URL,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "GBP",
    },
    publisher: { "@id": organizationId },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
