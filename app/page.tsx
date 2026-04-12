import type { Metadata } from "next";
import Link from "next/link";
import HomePhotoGrid from "@/components/HomePhotoGrid";
import { WebPageJsonLd } from "@/components/SiteJsonLd";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE_PATH,
  SITE_NAME,
} from "@/lib/site";
import {
  getHomeGridInitialVisible,
  HOME_GRID_IMAGE_PATHS,
} from "@/lib/homeGridImages";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: { absolute: SITE_NAME },
  alternates: { canonical: "/" },
  openGraph: {
    url: "/",
    title: SITE_NAME,
    images: [{ url: DEFAULT_OG_IMAGE_PATH }],
  },
  twitter: {
    title: SITE_NAME,
    images: [DEFAULT_OG_IMAGE_PATH],
  },
};

export default function HomePage() {
  const initialVisible = getHomeGridInitialVisible();

  return (
    <>
      <WebPageJsonLd
        path="/"
        name={SITE_NAME}
        description={DEFAULT_DESCRIPTION}
      />
      <div className={styles.home}>
        {HOME_GRID_IMAGE_PATHS.map((href) => (
          <link key={href} rel="preload" as="image" href={href} />
        ))}
        <section className={styles.hero}>
          <div className={styles.heroInner}>
            <img
              src="/logo/geometry-club-icon.svg"
              alt="geometry club icon"
              className={styles.heroIcon}
            />
            <h1 className={styles.heroTitle}>Geometry Club</h1>
            <p className={styles.heroTagline}>
              Celebrating the beauty of architecture with precisely aligned
              photographs from around the world.
            </p>
          </div>
        </section>

        <section className={styles.gridSection} aria-label="Featured photos">
          <HomePhotoGrid
            images={HOME_GRID_IMAGE_PATHS}
            initialVisible={initialVisible}
          />
        </section>

        <section className={styles.intro}>
          <div className={styles.introContent}>
            <p className={styles.introText}>
              Geometry Club is an architecture photography project on{" "}
              <a
                href="https://instagram.com/geometryclub"
                rel="nofollow noopener noreferrer"
                target="_blank"
              >
                Instagram
              </a>{" "}
              where people from around the world follow the{" "}
              <Link href="/submit">guidelines</Link>,{" "}
              <Link href="/submit">submit</Link> their photos, and join the
              club.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
