import type { Metadata } from "next";
import Link from "next/link";
import { WebPageJsonLd } from "@/components/SiteJsonLd";
import { DEFAULT_OG_IMAGE_PATH, SITE_NAME } from "@/lib/site";
import styles from "./page.module.css";

const INFO_TITLE = `Info — ${SITE_NAME}`;

const INFO_DESCRIPTION =
  "Geometry Club is a series of architecture photographs that are identical in composition, giving us a unique perspective to contrast and compare the differences in form, design, and construction of each facade.";

const ARTICLES: { author: string; url: string }[] = [
  {
    author: "Creative Review",
    url: "https://www.creativereview.co.uk/instagram-project-geometry-club-collates-perfectly-aligned-architectural-photos",
  },
  {
    author: "Surface Magazine",
    url: "http://www.surfacemag.com/articles/architecture-dave-mullen-geometry-club-instagram/",
  },
  {
    author: "Aisle One",
    url: "http://www.aisleone.net/2016/03/23/geometry-club/",
  },
  {
    author: "Swiss Miss",
    url: "http://www.swiss-miss.com/2016/03/23/geometry-club.html",
  },
  {
    author: "Design Taxi",
    url: "http://designtaxi.com/news/384115/Geometry-Club-An-Instagram-Filled-With-Precisely-Aligned-Architectural-Photos/",
  },
  {
    author: "Quipsologies",
    url: "http://www.underconsideration.com/quipsologies/archives/february_2016/arminvit_5.php",
  },
  {
    author: "FrizziFrizzi",
    url: "http://www.frizzifrizzi.it/2016/02/02/geometry-club/",
  },
  {
    author: "The Guardian",
    url: "https://www.theguardian.com/artanddesign/gallery/2017/jan/28/architecture-photography-corner-in-pictures",
  },
  {
    author: "TenMag",
    url: "http://www.tendenciasfashionmag.com/geometry-club-tenmag/",
  },
  {
    author: "Sheffielders",
    url: "https://sheffielders.org/collective/geometry-club",
  },
  {
    author: "Fstoppers",
    url: "https://fstoppers.com/architecture/if-precise-lines-and-architecture-your-passion-check-out-instagram-project-385756",
  },
];

export const metadata: Metadata = {
  title: "Info",
  description: INFO_DESCRIPTION,
  alternates: { canonical: "/info" },
  openGraph: {
    url: "/info",
    title: INFO_TITLE,
    images: [{ url: DEFAULT_OG_IMAGE_PATH }],
  },
  twitter: {
    title: INFO_TITLE,
    images: [DEFAULT_OG_IMAGE_PATH],
  },
};

export default function InfoPage() {
  return (
    <>
      <WebPageJsonLd
        path="/info"
        name={INFO_TITLE}
        description={INFO_DESCRIPTION}
      />
      <div className={styles.page}>
        <section className={styles.section}>
          <h2 className={styles.heading}>The Project</h2>
          <p className={styles.paragraph}>
            Geometry Club is a series of architecture photographs that are
            identical in composition, giving us a unique perspective to contrast
            and compare the differences in form, design, and construction of
            each facade.
          </p>
          <p className={styles.paragraph}>
            Launched in 2014, Geometry Club currently has over 150 contributors in
            more than 30 countries.{" "}
            <span className={styles.emphasis}>
              The project relies on contributors from around the world to{" "}
              <Link href="/submit" className={styles.textLink}>
                submit
              </Link>{" "}
              their photographs and join the club.
            </span>{" "}
            Featured photographs are published via{" "}
            <a
              href="https://instagram.com/geometryclub"
              className={styles.textLink}
              rel="nofollow noopener noreferrer"
              target="_blank"
            >
              Instagram
            </a>
            .
          </p>
          <p className={styles.attribution}>
            —{" "}
            <a
              href="https://davemullenjnr.co.uk/"
              className={styles.attributionLink}
              rel="noopener noreferrer"
              target="_blank"
            >
              Dave Mullen Jnr
            </a>
            .
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>Contact</h2>
          <p className={styles.paragraphTight}>
            Please send any enquiries to{" "}
            <span className={styles.emphasis}>
              <a
                href="mailto:dave@geometryclub.org"
                className={styles.textLink}
              >
                dave@geometryclub.org
              </a>
            </span>
          </p>
        </section>

        <section className={styles.sectionLast}>
          <h2 className={styles.heading}>Published</h2>
          <ul className={styles.publishedList}>
            {ARTICLES.map((article) => (
              <li key={article.url} className={styles.publishedItem}>
                <a
                  href={article.url}
                  className={styles.textLink}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {article.author}
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
