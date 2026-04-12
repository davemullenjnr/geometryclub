"use client";

import { useEffect, useState } from "react";
import styles from "./SubmitPhotoRotator.module.css";

type SubmitPhotoRotatorProps = {
  gridSrc: string;
  photos: string[];
};

export function SubmitPhotoRotator({ gridSrc, photos }: SubmitPhotoRotatorProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (photos.length <= 1) return;

    const interval = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % photos.length);
    }, 1000);

    return () => window.clearInterval(interval);
  }, [photos.length]);

  return (
    <div className={styles.guideContainer}>
      <div className={styles.guidePlaceholder} aria-hidden />
      <div className={styles.guideImages}>
        <img src={gridSrc} className={styles.guideOverlay} alt="" aria-hidden />
        <div id="gc-photos" className={styles.gcPhotos}>
          {photos.map((src, index) => (
            <img
              key={src}
              src={src}
              alt=""
              aria-hidden
              className={index === activeIndex ? styles.subVisible : styles.subHidden}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
