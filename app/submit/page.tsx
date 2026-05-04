import type { Metadata } from "next";
import styles from "./page.module.css";
import { SubmitPhotoRotator } from "@/components/SubmitPhotoRotator";
import { SubmitForm } from "@/components/SubmitForm";
import { WebPageJsonLd } from "@/components/SiteJsonLd";
import { SITE_NAME } from "@/lib/site";

const SUBMIT_TITLE = `Submit — ${SITE_NAME}`;

const SUBMIT_DESCRIPTION =
  "Submit your precisely-aligned architecture photos to be featured by Geometry Club.";

const SUBMIT_OG_IMAGE = "/images/submit/Submit-to-Geometry-Club-Grid.png";

const GUIDELINES = [
  {
    title: "Guideline 1",
    description:
      "Your apex needs to be aligned centrally on both the X and Y axis.",
  },
  {
    title: "Guideline 2",
    description:
      "Edges should fall off the image at the same point, symmetrically.",
  },
];

export const metadata: Metadata = {
  title: "Submit",
  description: SUBMIT_DESCRIPTION,
  alternates: { canonical: "/submit" },
  openGraph: {
    url: "/submit",
    title: SUBMIT_TITLE,
    images: [{ url: SUBMIT_OG_IMAGE }],
  },
  twitter: {
    title: SUBMIT_TITLE,
    images: [SUBMIT_OG_IMAGE],
  },
};

export default function SubmitPage() {
  return (
    <>
      <WebPageJsonLd
        path="/submit"
        name={SUBMIT_TITLE}
        description={SUBMIT_DESCRIPTION}
        imagePath={SUBMIT_OG_IMAGE}
      />
      <div className={styles.page}>
        <section className={styles.guideSection}>
          <SubmitPhotoRotator
            gridSrc="/images/submit/Submit-to-Geometry-Club-Grid.png"
            photos={[
              "/images/submit/Submit-to-Geometry-Club-photo-1.jpg",
              "/images/submit/Submit-to-Geometry-Club-photo-2.jpg",
              "/images/submit/Submit-to-Geometry-Club-photo-3.jpg",
            ]}
          />
        </section>

        <section className={styles.introSection}>
          <h1 className={styles.kicker}>Submit your photo</h1>
          <p className={styles.introText}>
            Compose your architecture photographs to meet these two guidelines and
            join the club!
          </p>
          <div className={styles.guidelines}>
            {GUIDELINES.map((guideline) => (
              <article className={styles.guidelineBox} key={guideline.title}>
                <p className={styles.guidelineTitle}>{guideline.title}</p>
                <p className={styles.guidelineDescription}>{guideline.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.formSection}>
          <div className={styles.submitForm}>
            <h2 className={styles.formHeading}>Submit</h2>
            <p className={styles.formCopy}>
              Please use the form below to submit your photo to Geometry Club.
            </p>
            <SubmitForm />
            <p className={styles.disclaimer}>
              By submitting, you agree for your image to be published on the{" "}
              <a
                href="https://instagram.com/geometryclub"
                rel="nofollow noopener noreferrer"
                target="_blank"
                className={styles.textLink}
              >
                @geometryclub
              </a>{" "}
              Instagram account, website, and any other promotional materials.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
