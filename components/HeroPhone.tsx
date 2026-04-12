"use client";

import { useEffect, useState } from "react";
import styles from "./HeroPhone.module.css";

const GRID =
  "/images/landing-page/Geometry-Club-on-Instagram-iPhone-X-grid.jpg";
const GUIDELINES =
  "/images/landing-page/Geometry-Club-on-Instagram-iPhone-X-guidelines.jpg";

export default function HeroPhone() {
  const [showGrid, setShowGrid] = useState(true);

  useEffect(() => {
    const id = window.setInterval(() => {
      setShowGrid((g) => !g);
    }, 3000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <img
      className={styles.phone}
      src={showGrid ? GRID : GUIDELINES}
      alt="Geometry Club on Instagram on iPhone"
    />
  );
}
