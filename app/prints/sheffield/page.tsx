import type { Metadata } from "next";
import ImageCarousel from "@/components/ImageCarousel";
import { WebPageJsonLd } from "@/components/SiteJsonLd";
import { SITE_NAME } from "@/lib/site";
import styles from "./page.module.css";

const SLIDES = [
  {
    src: "/images/prints/geometry-club-sheffield-print-framed.jpg",
    alt: "Sheffield buildings print shown in a frame on the wall",
  },
  {
    src: "/images/prints/geometry-club-sheffield-first-edition-seal.jpg",
    alt: "Close-up photo of the first edition seal on the black packaging tube",
  },
  {
    src: "/images/prints/geometry-club-sheffield-print-on-concrete-wall.jpg",
    alt: "Geometry Club Sheffield b2 print resting on a concrete wall",
  },
  {
    src: "/images/prints/geometry-club-sheffield-packaging-and-branding.jpg",
    alt: "Product photo of the Sheffield print packaging with Geometry Club branding",
  },
  {
    src: "/images/prints/geometry-club-sheffield-print-close-up-detail.jpg",
    alt: "Close-up photo of the Sheffield print from the side showing the paper curl up",
  },
  {
    src: "/images/prints/geometry-club-sheffield-print-framed-held-up.jpg",
    alt: "Woman holding a framed print of Sheffield's architecture photographed in the Geometry Club style",
  },
];

const SHEFFIELD_TITLE = `Sheffield — Prints — ${SITE_NAME}`;
const SHEFFIELD_DESCRIPTION = "70cm x 50cm print of architecture in Sheffield.";
const SHEFFIELD_OG_IMAGE = "/images/prints/geometry-club-sheffield-print-framed.jpg";

export const metadata: Metadata = {
  title: "Sheffield — Prints",
  description: SHEFFIELD_DESCRIPTION,
  alternates: { canonical: "/prints/sheffield" },
  openGraph: {
    url: "/prints/sheffield",
    title: SHEFFIELD_TITLE,
    images: [{ url: SHEFFIELD_OG_IMAGE }],
  },
  twitter: {
    title: SHEFFIELD_TITLE,
    images: [SHEFFIELD_OG_IMAGE],
  },
};

export default function SheffieldPrintPage() {
  return (
    <>
      <WebPageJsonLd
        path="/prints/sheffield"
        name={SHEFFIELD_TITLE}
        description={SHEFFIELD_DESCRIPTION}
        imagePath={SHEFFIELD_OG_IMAGE}
      />
      <section className={styles.darkMode}>
        <div className={styles.container}>
          <p className={styles.swipeHint}>Swipe to view more images</p>

          <div className={styles.carouselArea}>
            <ImageCarousel
              slides={SLIDES}
              intervalMs={4000}
              dotsOnDarkBackground
            />
          </div>

          <div className={styles.printsPageStyles}>
            <div className={styles.pt5}>
              <h1 className={styles.h1}>Sheffield</h1>
              <p className={styles.lead}>
                I&apos;m excited to introduce the first ever Geometry Club print, and
                naturally I wanted to honour the city where it all started. I&apos;ve
                taken hundreds of photos and spent countless hours selecting,
                editing, and composing this final collection. Hope you love it
                as much as I do!
              </p>
              <p className={styles.lead}>
                The print includes many of the classics; Crucible Theatre, The
                Arts Tower, Cheese Grater, Diamond Building etc.
              </p>
            </div>

            <div className={styles.sectionBlock}>
              <h2 className={styles.h2}>Details</h2>
              <div className={styles.detailsBox}>
                <div className={styles.firstEdition}>
                  <img src="/images/prints/first-edition.svg" alt="" />
                </div>

                <h3 className={styles.detailsHeading}>First Edition</h3>
                <p>
                  Limited run of 25 prints{" "}
                  <span className={styles.soldOut}>sold out</span>
                </p>

                <h3 className={styles.detailsHeading}>Print Size</h3>
                <p>70cm x 50cm</p>

                <h3 className={styles.detailsHeading}>Paper Type</h3>
                <p>Fuji Professional Velvet (matt)</p>

                <h3 className={styles.detailsHeading}>Locale</h3>
                <p>UK delivery only</p>
              </div>
            </div>

            <div className={styles.sectionBlock}>
              <h2 className={styles.h2}>Quality</h2>
              <p className={styles.lead}>
                I&apos;ve opted to print on velvet professional coated paper which has
                a zero-reflective top layer and a soft, matt finish. (Looks and
                feels beaut!)
              </p>
            </div>

            <div className={styles.sectionBlock}>
              <h2 className={styles.h2}>Price</h2>

              <div className={`${styles.detailsBox} ${styles.printPrice}`}>
                <div className={styles.priceInner}>
                  <div className={styles.priceCol}>
                    <h3 className={styles.detailsHeading}>Print + Packaging</h3>
                    <p>
                      <del className={styles.greyDark}>£120</del> £80*
                    </p>
                  </div>
                  <div className={styles.priceCol}>
                    <h3 className={styles.detailsHeading}>
                      Delivery (UK only)
                    </h3>
                    <p>£6</p>
                  </div>
                </div>
              </div>

              <p className={styles.note}>
                <b>*</b> This is an introductory price to thank you for
                supporting the project.
              </p>
            </div>

            <div className={styles.sectionBlock}>
              <h2 className={styles.h2}>How To Order</h2>
              <p className={styles.lead}>
                As this is just for a limited run of prints, I&apos;m going to take
                orders via direct message and a bank transfer. Here&apos;s how to get
                in touch:
              </p>
              <p className={styles.lead}>
                Instagram:{" "}
                <a
                  className={styles.link}
                  href="https://instagram.com/geometryclub"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  @geometryclub
                </a>
              </p>
              <p className={styles.lead}>
                Email:{" "}
                <a
                  className={styles.link}
                  href="mailto:dave@geometryclub?subject=Sheffield Print"
                >
                  dave@geometryclub.org
                </a>
              </p>
            </div>

            <div className={styles.sectionBlock}>
              <h2 className={styles.h2}>Close-up</h2>
              <div className={styles.midGreyCard}>
                <img
                  className={styles.closeUpImage}
                  src="/images/prints/geometry-club-sheffield-print-close-up.jpg"
                  alt="Geometry Club Sheffield Print"
                />
              </div>
            </div>

            <div className={styles.sectionBlock}>
              <h2 className={styles.h2}>Framing</h2>
              <p className={styles.lead}>
                I&apos;ve sourced a couple of suppliers that provide frames for this
                print size:
              </p>
              <p className={styles.lead}>
                <a
                  className={styles.link}
                  href="https://www.ikea.com/gb/en/p/lomviken-frame-black-70286773/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Lomviken by IKEA (£19)
                </a>{" "}
                <i className={styles.recommended}>recommended</i>
              </p>
              <p className={styles.lead}>
                <a
                  className={styles.link}
                  href="https://desenio.co.uk/en/black-picture-frame-50x70"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Desenio (£30)
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
