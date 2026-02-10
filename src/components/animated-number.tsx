"use client";

import { animate, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { usePerformanceMode } from "@/hooks/use-performance-mode";

interface AnimatedNumberProps {
  value: number;
  className?: string;
}

export function AnimatedNumber({ value, className }: AnimatedNumberProps) {
  const { motionTier } = usePerformanceMode();
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const [display, setDisplay] = useState(() => value);

  useEffect(() => {
    // #region agent log H8 animated number state
    fetch("http://127.0.0.1:7242/ingest/ff9c1328-0a4a-45f8-8ea5-81952b6584c2", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        runId: "initial",
        hypothesisId: "H8",
        location: "src/components/animated-number.tsx:12",
        message: "Animated number render state",
        data: { value, display, inView, motionTier },
        timestamp: Date.now()
      })
    }).catch(() => {});
    // #endregion
  }, [value, display, inView, motionTier]);

  useEffect(() => {
    if (!inView) {
      return;
    }

    if (motionTier !== "immersive") {
      setDisplay(value);
      return;
    }

    const controls = animate(0, value, {
      duration: 1.1,
      ease: [0.23, 1, 0.32, 1],
      onUpdate: (latest) => setDisplay(Math.round(latest))
    });

    return () => controls.stop();
  }, [inView, motionTier, value]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
