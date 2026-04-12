"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./ImageCarousel.module.css";

export type CarouselSlide = {
  src: string;
  alt: string;
};

type ImageCarouselProps = {
  slides: CarouselSlide[];
  /** Auto-advance interval in ms (Flickity-style); omit or 0 to disable */
  intervalMs?: number;
  /** Grey inactive + white active dots (for dark backgrounds e.g. /prints/sheffield) */
  dotsOnDarkBackground?: boolean;
};

export default function ImageCarousel({
  slides,
  intervalMs = 4000,
  dotsOnDarkBackground = false,
}: ImageCarouselProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef(0);
  const scrollRafRef = useRef<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoAdvanceDisabled, setAutoAdvanceDisabled] = useState(false);

  const stopAutoAdvance = useCallback(() => {
    setAutoAdvanceDisabled(true);
  }, []);

  const syncIndexFromScroll = useCallback(() => {
    const el = viewportRef.current;
    if (!el || slides.length === 0) return;
    const w = el.clientWidth;
    if (w <= 0) return;
    const i = Math.round(el.scrollLeft / w);
    const clamped = Math.max(0, Math.min(i, slides.length - 1));
    indexRef.current = clamped;
    setActiveIndex(clamped);
  }, [slides.length]);

  const handleScroll = useCallback(() => {
    if (scrollRafRef.current !== null) return;
    scrollRafRef.current = requestAnimationFrame(() => {
      scrollRafRef.current = null;
      syncIndexFromScroll();
    });
  }, [syncIndexFromScroll]);

  const goTo = useCallback(
    (i: number) => {
      const el = viewportRef.current;
      if (!el) return;
      const w = el.clientWidth;
      if (w <= 0) return;
      const clamped = Math.max(0, Math.min(i, slides.length - 1));
      indexRef.current = clamped;
      setActiveIndex(clamped);
      el.scrollTo({ left: clamped * w, behavior: "smooth" });
    },
    [slides.length]
  );

  useEffect(() => {
    if (slides.length <= 1 || !intervalMs || autoAdvanceDisabled) return;

    const el = viewportRef.current;
    if (!el) return;

    const tick = () => {
      const width = el.clientWidth;
      if (width <= 0) return;
      const next = (indexRef.current + 1) % slides.length;
      indexRef.current = next;
      setActiveIndex(next);
      el.scrollTo({
        left: next * width,
        behavior: "smooth",
      });
    };

    const id = window.setInterval(tick, intervalMs);
    return () => window.clearInterval(id);
  }, [slides.length, intervalMs, autoAdvanceDisabled]);

  return (
    <div
      className={`${styles.root} ${dotsOnDarkBackground ? styles.rootDarkDots : ""}`}
    >
      <div
        className={styles.viewport}
        ref={viewportRef}
        onScroll={handleScroll}
        onPointerDown={stopAutoAdvance}
        onWheel={stopAutoAdvance}
        onTouchStart={stopAutoAdvance}
      >
        {slides.map((slide, i) => (
          <div key={i} className={styles.cell}>
            <img
              src={slide.src}
              alt={slide.alt}
              className={styles.image}
              draggable={false}
              loading={i === 0 ? "eager" : "lazy"}
            />
          </div>
        ))}
      </div>
      {slides.length > 1 ? (
        <div
          className={styles.dots}
          role="tablist"
          aria-label="Carousel slides"
        >
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={activeIndex === i}
              aria-label={`Slide ${i + 1} of ${slides.length}`}
              className={activeIndex === i ? styles.dotActive : styles.dot}
              onClick={() => {
                stopAutoAdvance();
                goTo(i);
              }}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
