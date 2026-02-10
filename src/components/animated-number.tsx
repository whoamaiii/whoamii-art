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
  const [display, setDisplay] = useState(() => (motionTier === "lite" ? value : 0));

  useEffect(() => {
    if (!inView) {
      return;
    }

    if (motionTier === "lite") {
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
