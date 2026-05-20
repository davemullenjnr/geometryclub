import type { Metadata } from "next";
import { BmacAd } from "@/components/BmacAd";
import { WebPageJsonLd } from "@/components/SiteJsonLd";
import { DEFAULT_OG_IMAGE_PATH, SITE_NAME } from "@/lib/site";
import styles from "./page.module.css";

const CONFIRMATION_TITLE = `Submission received — ${SITE_NAME}`;

const CONFIRMATION_DESCRIPTION =
  "Your photo has been submitted to Geometry Club. Check your email for confirmation.";

export const metadata: Metadata = {
  title: "Submission received",
  description: CONFIRMATION_DESCRIPTION,
  alternates: { canonical: "/submit/confirmation" },
  robots: { index: false, follow: true },
  openGraph: {
    url: "/submit/confirmation",
    title: CONFIRMATION_TITLE,
    images: [{ url: DEFAULT_OG_IMAGE_PATH }],
  },
  twitter: {
    title: CONFIRMATION_TITLE,
    images: [DEFAULT_OG_IMAGE_PATH],
  },
};

export default function SubmitConfirmationPage() {
  return (
    <>
      <WebPageJsonLd
        path="/submit/confirmation"
        name={CONFIRMATION_TITLE}
        description={CONFIRMATION_DESCRIPTION}
        imagePath={DEFAULT_OG_IMAGE_PATH}
      />
      <div className={styles.page}>
        <section className={styles.content}>
          <h1 className={styles.heading}>Success!</h1>
          <p className={styles.lead}>
            Thanks for submitting to <strong>Geometry Club</strong>. We will
            review your photo and may feature it on{" "}
            <a
              href="https://instagram.com/geometryclub"
              rel="nofollow noopener noreferrer"
              target="_blank"
              className={styles.textLink}
            >
              @geometryclub
            </a>
            .
          </p>
          <p className={styles.body}>
            A confirmation email is on its way to the address you provided. If
            it does not arrive within a few minutes, check your spam folder.
          </p>
          <div className={styles.bmac}>
            <BmacAd />
          </div>
        </section>
      </div>
    </>
  );
}
