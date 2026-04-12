import type { Metadata } from "next";
import Link from "next/link";
import { WebPageJsonLd } from "@/components/SiteJsonLd";
import { SITE_NAME } from "@/lib/site";
import styles from "./page.module.css";

const PRINTS_TITLE = `Prints — ${SITE_NAME}`;
const PRINTS_DESCRIPTION = "Geometry Club prints.";
const PRINTS_OG_IMAGE = "/images/prints/geometry-club-sheffield-print-framed.jpg";

export const metadata: Metadata = {
  title: "Prints",
  description: PRINTS_DESCRIPTION,
  alternates: { canonical: "/prints" },
  openGraph: {
    url: "/prints",
    title: PRINTS_TITLE,
    images: [{ url: PRINTS_OG_IMAGE }],
  },
  twitter: {
    title: PRINTS_TITLE,
    images: [PRINTS_OG_IMAGE],
  },
};

export default function PrintsPage() {
  return (
    <>
      <WebPageJsonLd
        path="/prints"
        name={PRINTS_TITLE}
        description={PRINTS_DESCRIPTION}
        imagePath={PRINTS_OG_IMAGE}
      />
      <section className={styles.darkMode}>
        <div className={styles.container}>
          <h1 className={styles.title}>Prints</h1>

          <div className={styles.cardList}>
            <Link href="/prints/sheffield" className={styles.cardLink}>
              <img
                className={styles.cardImage}
                src="/images/prints/geometry-club-sheffield-print-framed.jpg"
                alt=""
              />
              <h2 className={styles.cardHeading}>Sheffield</h2>
              <p className={styles.cardSubtitle}>70cm x 50cm</p>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
