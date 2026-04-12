import type { Metadata } from "next";
import "./globals.css";
import layoutStyles from "./layout.module.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SiteJsonLd from "@/components/SiteJsonLd";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE_PATH,
  SITE_AUTHOR,
  SITE_NAME,
  SITE_URL,
} from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  icons: {
    icon: "/logo/favicon.ico",
  },
  title: {
    default: SITE_NAME,
    template: `%s — ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  authors: [{ name: SITE_AUTHOR }],
  openGraph: {
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    url: "/",
    locale: "en_GB",
    type: "website",
    images: [{ url: DEFAULT_OG_IMAGE_PATH }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    creator: "@geometryclub",
    images: [DEFAULT_OG_IMAGE_PATH],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB">
      <body className={layoutStyles.root}>
        <SiteJsonLd />
        <Header />
        <main className={layoutStyles.main}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
