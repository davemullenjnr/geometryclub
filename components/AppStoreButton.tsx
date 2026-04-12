import styles from "./AppStoreButton.module.css";
import { IOS_APP_STORE_URL } from "@/lib/site";

type AppStoreButtonProps = {
  className?: string;
};

export default function AppStoreButton({ className }: AppStoreButtonProps) {
  return (
    <a
      href={IOS_APP_STORE_URL}
      className={[styles.link, className].filter(Boolean).join(" ")}
      rel="noopener noreferrer"
      target="_blank"
    >
      <img
        className={styles.badge}
        src="/logo/app-store.png"
        alt="Download on the App Store"
        title="App Store"
      />
    </a>
  );
}
