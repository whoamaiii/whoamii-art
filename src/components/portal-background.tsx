"use client";

import { motion } from "framer-motion";
import { usePerformanceMode } from "@/hooks/use-performance-mode";

export function PortalBackground() {
  const { reducedMotion, motionTier, motionScale } = usePerformanceMode();

  if (reducedMotion) {
    return (
      <div className="portal-bg" aria-hidden>
        <div className="portal-gradient" />
        <div className="orb orb-a" />
        <div className="vignette-layer" />
      </div>
    );
  }

  return (
    <div className="portal-bg" aria-hidden>
      <motion.div
        className="portal-gradient"
        animate={{ opacity: [0.55, 0.8, 0.55], rotate: [0, 6, 0] }}
        transition={{ duration: 26, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
      <motion.div
        className="orb orb-a"
        animate={{ scale: [1, 1.1, 1], opacity: [0.48, 0.75, 0.48] }}
        transition={{
          duration: 11 / motionScale,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="orb orb-b"
        animate={{ x: [0, 20 * motionScale, -10 * motionScale, 0], y: [0, -30, 10, 0], rotate: [0, 20, 0] }}
        transition={{
          duration: 15 / motionScale,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="orb orb-c"
        animate={{ scale: [1.2, 0.9, 1.2], opacity: [0.4, 0.65, 0.4] }}
        transition={{
          duration: 17 / motionScale,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut"
        }}
      />
      {motionTier === "immersive" ? (
        <motion.div
          className="particle-layer"
          animate={{ backgroundPosition: ["0px 0px", "140px 120px", "0px 0px"] }}
          transition={{ duration: 30, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        />
      ) : (
        <div className="noise-layer" />
      )}
      <div className="vignette-layer" />
    </div>
  );
}
