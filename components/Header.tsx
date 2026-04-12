"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import styles from "./Header.module.css";

const navLinks = [
  { href: "/submit", label: "Submit" },
  { href: "/app", label: "App" },
  { href: "https://instagram.com/geometryclub", label: "Instagram", external: true },
  { href: "/info", label: "Info" },
  { href: "/prints", label: "Prints" },
];

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className={`${styles.header} ${isHome ? styles.headerHome : ""}`}
    >
      {!isHome && (
        <Link href="/" className={styles.logoLink} aria-label="Geometry Club home">
          <img
            src="/logo/geometry-club-icon.svg"
            alt=""
            className={styles.logo}
          />
        </Link>
      )}

      <button
        type="button"
        className={`${styles.hamburger} ${menuOpen ? styles.menuOpen : ""}`}
        aria-expanded={menuOpen}
        aria-controls="main-menu"
        aria-label="Toggle menu"
        onClick={() => setMenuOpen(!menuOpen)}
      />

      <nav className={styles.nav} id="main-menu" aria-label="Main">
        <ul className={`${styles.navList} ${menuOpen ? styles.menuOpen : ""}`}>
          {navLinks.map(({ href, label, external }) => (
            <li key={href}>
              {external ? (
                <a
                  href={href}
                  className={styles.navLink}
                  rel="nofollow noopener noreferrer"
                  target="_blank"
                >
                  {label}
                </a>
              ) : (
                <Link href={href} className={styles.navLink}>
                  {label}
                </Link>
              )}
            </li>
          ))}
          <li className={styles.coffeeItem}>
            <a
              href="https://buymeacoffee.com/davemullenjnr"
              className={styles.coffeeBox}
              rel="nofollow noopener noreferrer"
              target="_blank"
            >
              buy me a coffee
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
