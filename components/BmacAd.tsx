import Image from "next/image";
import { BMAC_URL } from "@/lib/site";
import styles from "./BmacAd.module.css";

export function BmacAd() {
  return (
    <aside className={styles.ad} aria-label="Support Geometry Club">
      <a href={BMAC_URL} className={styles.iconLink} rel="" target="_blank">
        <Image
          src="/logo/buy-me-a-coffee.svg"
          alt="Buy Me a Coffee"
          width={44}
          height={44}
          className={styles.icon}
        />
      </a>
      <p className={styles.text}>
        Geometry Club is a self-funded project by Dave Mullen Jnr. If you&apos;d
        like to support it, please{" "}
        <a
          href={BMAC_URL}
          className={styles.link}
          rel="nofollow noopener noreferrer"
          target="_blank"
        >
          buy me a coffee
        </a>
        .
      </p>
    </aside>
  );
}
