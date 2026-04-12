import type { Metadata } from "next";
import ImageCarousel, {
  type CarouselSlide,
} from "@/components/ImageCarousel";
import AppStoreButton from "@/components/AppStoreButton";
import { MobileApplicationJsonLd, WebPageJsonLd } from "@/components/SiteJsonLd";
import { SITE_NAME } from "@/lib/site";
import styles from "./page.module.css";

const SLIDE_ONE: CarouselSlide[] = [
  {
    src: "/images/app/Geometry-Club-iOS-App-web-1.jpg",
    alt: "Photo of woman using Geometry Club app on iPhone",
  },
  {
    src: "/images/app/Geometry-Club-iOS-App-web-2.jpg",
    alt: "Photo of woman using Geometry Club app on iPhone",
  },
  {
    src: "/images/app/Geometry-Club-iOS-App-web-3.jpg",
    alt: "Photo of woman using Geometry Club app on iPhone",
  },
];

const SLIDE_TWO: CarouselSlide[] = [
  {
    src: "/images/app/Geometry-Club-App-library-screen.jpg",
    alt: "Geometry Club app library screen",
  },
  {
    src: "/images/app/Geometry-Club-App-screen.jpg",
    alt: "Geometry Club app camera screen",
  },
];

const APP_TITLE = `iOS Camera App — ${SITE_NAME}`;
const APP_DESCRIPTION =
  "A purpose-built camera app for your iPhone that helps to line up your Geometry Club architecture photos, in real time.";
const APP_OG_IMAGE = "/images/app/Geometry-Club-iOS-App-web-1.jpg";

export const metadata: Metadata = {
  title: "iOS Camera App",
  description: APP_DESCRIPTION,
  alternates: { canonical: "/app" },
  openGraph: {
    url: "/app",
    title: APP_TITLE,
    images: [{ url: APP_OG_IMAGE }],
  },
  twitter: {
    title: APP_TITLE,
    images: [APP_OG_IMAGE],
  },
};

export default function AppPage() {
  return (
    <>
      <WebPageJsonLd
        path="/app"
        name={APP_TITLE}
        description={APP_DESCRIPTION}
        imagePath={APP_OG_IMAGE}
      />
      <MobileApplicationJsonLd />
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.appIconBox}>
            <img
              src="/logo/geometry-club-icon.svg"
              alt=""
              className={styles.appIcon}
            />
          </div>
          <img
            src="/logo/geometry-club-text-logo-black.svg"
            alt="Geometry Club"
            className={styles.wordmark}
          />
          <p className={styles.heroSubtitle}>iOS App</p>
          <AppStoreButton />
        </div>
      </section>

      <div className={styles.arrowWrap}>
        <img
          src="/logo/Arrow.svg"
          alt=""
          className={styles.arrow}
          width={23}
          height={57}
        />
      </div>

      <section className={styles.sectionWhite}>
        <div className={styles.sectionInner}>
          <p className={styles.intro}>
            A purpose-built camera app for your iPhone that helps to line up
            your{" "}
            <a
              href="https://instagram.com/geometryclub"
              className={styles.linkBorder}
              rel="nofollow noopener noreferrer"
              target="_blank"
            >
              @geometryclub
            </a>{" "}
            photos, in real time.
          </p>
          <div className={styles.carouselWrap}>
            <ImageCarousel slides={SLIDE_ONE} intervalMs={4000} />
          </div>
        </div>
      </section>

      <section className={styles.sectionGrey}>
        <div className={styles.sectionInner}>
          <p className={styles.intro}>
            Photos taken with the app are neatly catalogued where you can
            easily view and share directly to Instagram.
          </p>
          <div className={styles.carouselWrap}>
            <ImageCarousel slides={SLIDE_TWO} intervalMs={4000} />
          </div>
        </div>
      </section>

      <section className={styles.videoBand}>
        <video
          className={styles.video}
          poster="/images/app/Geometry-Club-iOS-App-web-bg.jpg"
          autoPlay
          muted
          loop
          playsInline
        >
          <source
            src="/video/Geometry-Club-iOS-App-Loop-720.webm"
            type="video/webm"
          />
          <source
            src="/video/Geometry-Club-iOS-App-Loop-480.mp4"
            type="video/mp4"
          />
        </video>
        <div className={styles.videoOverlay}>
          <p className={styles.videoCtaLabel}>Available on the</p>
          <AppStoreButton />
        </div>
      </section>

      <section className={styles.credits}>
        <div className={styles.creditsInner}>
          <p>
            <b>Credits</b>
            <br />
            Development by{" "}
            <a
              href="https://www.alexedge.co.uk/"
              rel="noopener noreferrer"
              target="_blank"
            >
              Alexander Edge
            </a>
            <br />
            Design by{" "}
            <a
              href="https://davemullenjnr.co.uk/"
              rel="noopener noreferrer"
              target="_blank"
            >
              Dave Mullen Jnr
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
