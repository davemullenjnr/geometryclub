import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <section className={styles.taglineSection}>
        <div className={styles.taglineRow}>
          <img
            src="/logo/buy-me-a-coffee.svg"
            alt="Buy Me A Coffee logo"
            width={140}
            height={140}
            className={styles.bmcLogo}
          />
          <p className={styles.tagline}>
            Geometry Club is a self-funded project by Dave Mullen Jnr. If
            you&apos;d like to support it, please{" "}
            <a
              href="https://buymeacoffee.com/davemullenjnr"
              rel="nofollow noopener noreferrer"
              target="_blank"
            >
              buy me a coffee
            </a>
            .
          </p>
        </div>
      </section>
    </footer>
  );
}
