"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MutableRefObject,
  type TransitionEvent,
} from "react";
import styles from "./HomePhotoGrid.module.css";

const SWAP_INTERVAL_MS = 2400;
const SWAP_INTERVAL_MS_REDUCED_MOTION = SWAP_INTERVAL_MS * 2;

function usePrefersReducedMotion(): boolean {
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduce(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return reduce;
}

const VISIBLE_SLOT_COUNT = 9;

/** Grid rows: top, middle, bottom (visual 3x3). */
const ROW_SECTIONS: readonly [
  readonly [number, number, number],
  readonly [number, number, number],
  readonly [number, number, number],
] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
];

function pickSwap(
  visible: string[],
  poolFrom: readonly string[],
  lastSectionIndexRef: MutableRefObject<number | null>,
  lastSlotIndexRef: MutableRefObject<number | null>,
): string[] | null {
  const pool = poolFrom.filter((u) => !visible.includes(u));
  if (pool.length < 1) return null;

  const prevSection = lastSectionIndexRef.current;
  const sectionIdx =
    prevSection === null
      ? Math.floor(Math.random() * 3)
      : (prevSection + 1) % 3;

  lastSectionIndexRef.current = sectionIdx;

  const slots = ROW_SECTIONS[sectionIdx];
  const prevSlot = lastSlotIndexRef.current;
  let slotCandidates =
    prevSlot === null ? [...slots] : slots.filter((s) => s !== prevSlot);
  if (slotCandidates.length === 0) slotCandidates = [...slots];

  const slot =
    slotCandidates[Math.floor(Math.random() * slotCandidates.length)]!;
  lastSlotIndexRef.current = slot;

  const incoming = pool[Math.floor(Math.random() * pool.length)]!;
  const next = [...visible];
  next[slot] = incoming;
  return next;
}

function PhotoCell({
  src,
  alt,
  reduceMotion,
  sizes,
}: {
  src: string;
  alt: string;
  reduceMotion: boolean;
  sizes: string;
}) {
  const lastCommitted = useRef(src);
  const [base, setBase] = useState(src);
  const [incoming, setIncoming] = useState<string | null>(null);
  const [incomingVisible, setIncomingVisible] = useState(false);

  useEffect(() => {
    if (src === lastCommitted.current) return;

    if (reduceMotion) {
      lastCommitted.current = src;
      setBase(src);
      setIncoming(null);
      setIncomingVisible(false);
      return;
    }

    setIncoming(src);
    setIncomingVisible(false);
    const id = requestAnimationFrame(() => {
      setIncomingVisible(true);
    });
    return () => cancelAnimationFrame(id);
  }, [src, reduceMotion]);

  const onIncomingTransitionEnd = useCallback(
    (e: TransitionEvent<HTMLDivElement>) => {
      if (e.propertyName !== "opacity" || !incoming) return;
      lastCommitted.current = incoming;
      setBase(incoming);
      setIncoming(null);
      setIncomingVisible(false);
    },
    [incoming],
  );

  return (
    <div className={styles.photoCell}>
      <div className={styles.cellLayer} aria-hidden={alt === ""}>
        <Image
          src={base}
          alt={alt}
          fill
          sizes={sizes}
          className={styles.cover}
        />
      </div>
      {incoming !== null && (
        <div
          className={`${styles.cellLayer} ${styles.cellLayerFade} ${incomingVisible ? styles.cellLayerFadeVisible : ""}`}
          onTransitionEnd={onIncomingTransitionEnd}
          aria-hidden={alt === ""}
        >
          <Image
            src={incoming}
            alt={alt}
            fill
            sizes={sizes}
            className={styles.cover}
          />
        </div>
      )}
    </div>
  );
}

type Props = {
  images: readonly string[];
  initialVisible: string[];
};

export default function HomePhotoGrid({ images, initialVisible }: Props) {
  const reduceMotion = usePrefersReducedMotion();
  const [visible, setVisible] = useState<string[]>(() => initialVisible);
  const lastSectionIndexRef = useRef<number | null>(null);
  const lastSlotIndexRef = useRef<number | null>(null);

  const imagesKey = images.join("\0");

  useEffect(() => {
    lastSectionIndexRef.current = null;
    lastSlotIndexRef.current = null;
  }, [imagesKey]);

  useEffect(() => {
    if (images.length <= VISIBLE_SLOT_COUNT) return;

    const tick = () => {
      setVisible((prev) => {
        const next = pickSwap(
          prev,
          images,
          lastSectionIndexRef,
          lastSlotIndexRef,
        );
        return next ?? prev;
      });
    };

    const id = window.setInterval(
      tick,
      reduceMotion ? SWAP_INTERVAL_MS_REDUCED_MOTION : SWAP_INTERVAL_MS,
    );
    return () => window.clearInterval(id);
  }, [images, imagesKey, reduceMotion]);

  const sizes =
    "(max-width: 35em) 32vw, (max-width: 52em) 28vw, min(16rem, 28vw)";

  return (
    <div className={styles.photoGrid}>
      {visible.map((src, i) => (
        <PhotoCell
          key={i}
          src={src}
          alt=""
          reduceMotion={reduceMotion}
          sizes={sizes}
        />
      ))}
    </div>
  );
}
