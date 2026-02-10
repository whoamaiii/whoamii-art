"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import type { MotionTier } from "@/components/psychedelic-background";

interface FloatingSacredGeometryProps {
  motionTier: MotionTier;
}

interface Motif {
  id: string;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  shape: "flower" | "metatron" | "spiral" | "triangle";
}

const motifs: Motif[] = [
  { id: "m1", x: 8, y: 14, size: 150, delay: 0, duration: 64, shape: "flower" },
  { id: "m2", x: 78, y: 10, size: 126, delay: 4, duration: 58, shape: "metatron" },
  { id: "m3", x: 15, y: 62, size: 120, delay: 1.5, duration: 72, shape: "spiral" },
  { id: "m4", x: 64, y: 68, size: 132, delay: 2.8, duration: 68, shape: "triangle" },
  { id: "m5", x: 44, y: 24, size: 180, delay: 0.9, duration: 84, shape: "flower" },
  { id: "m6", x: 90, y: 54, size: 96, delay: 3.2, duration: 55, shape: "metatron" },
  { id: "m7", x: 30, y: 78, size: 108, delay: 1.1, duration: 61, shape: "spiral" },
  { id: "m8", x: 54, y: 6, size: 110, delay: 4.1, duration: 69, shape: "triangle" },
  { id: "m9", x: 3, y: 42, size: 104, delay: 2.3, duration: 74, shape: "metatron" },
  { id: "m10", x: 74, y: 38, size: 142, delay: 5, duration: 78, shape: "flower" }
];

function renderMotif(shape: Motif["shape"]) {
  switch (shape) {
    case "flower":
      return (
        <svg viewBox="0 0 100 100" className="sacred-svg">
          <circle cx="50" cy="50" r="14" />
          <circle cx="50" cy="28" r="14" />
          <circle cx="69" cy="39" r="14" />
          <circle cx="69" cy="61" r="14" />
          <circle cx="50" cy="72" r="14" />
          <circle cx="31" cy="61" r="14" />
          <circle cx="31" cy="39" r="14" />
        </svg>
      );
    case "metatron":
      return (
        <svg viewBox="0 0 100 100" className="sacred-svg">
          <circle cx="50" cy="50" r="38" />
          <circle cx="50" cy="50" r="8" />
          <line x1="50" y1="12" x2="50" y2="88" />
          <line x1="12" y1="50" x2="88" y2="50" />
          <line x1="22" y1="22" x2="78" y2="78" />
          <line x1="78" y1="22" x2="22" y2="78" />
        </svg>
      );
    case "spiral":
      return (
        <svg viewBox="0 0 100 100" className="sacred-svg">
          <path d="M50 50 m0-6 a6 6 0 1 1 -0.01 0" />
          <path d="M50 50 m0-14 a14 14 0 1 1 -0.01 0" />
          <path d="M50 50 m0-22 a22 22 0 1 1 -0.01 0" />
          <path d="M50 50 m0-30 a30 30 0 1 1 -0.01 0" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 100 100" className="sacred-svg">
          <polygon points="50,12 88,82 12,82" />
          <polygon points="50,22 78,74 22,74" />
          <line x1="50" y1="12" x2="50" y2="82" />
        </svg>
      );
  }
}

export function FloatingSacredGeometry({ motionTier }: FloatingSacredGeometryProps) {
  const { scrollY } = useScroll();
  const parallax = useTransform(scrollY, [0, 1800], [0, motionTier === "immersive" ? -70 : -20]);

  if (motionTier === "lite") {
    return null;
  }

  const active = motionTier === "immersive" ? motifs : motifs.slice(0, 5);

  return (
    <div className="sacred-layer" aria-hidden>
      {active.map((motif) => (
        <motion.div
          key={motif.id}
          className="sacred-motif"
          style={{
            left: `${motif.x}%`,
            top: `${motif.y}%`,
            width: motif.size,
            height: motif.size,
            y: parallax
          }}
        >
          <motion.div
            animate={
              motionTier === "immersive"
                ? { rotate: [0, 360], y: [0, -16, 12, 0], scale: [0.95, 1.05, 0.97, 1] }
                : { y: [0, -6, 0], opacity: [0.03, 0.07, 0.03] }
            }
            transition={{
              duration: motif.duration,
              delay: motif.delay,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut"
            }}
          >
            {renderMotif(motif.shape)}
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}
