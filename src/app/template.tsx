"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { usePerformanceMode } from "@/hooks/use-performance-mode";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { motionTier } = usePerformanceMode();
  const isLite = motionTier === "lite";
  const transitionsEnabled = !isLite;

  const initial = transitionsEnabled
    ? { opacity: 0, filter: "blur(8px) saturate(2) hue-rotate(30deg)" }
    : { opacity: 1, filter: "none" };
  const animateState = transitionsEnabled
    ? { opacity: 1, filter: "blur(0px) saturate(1) hue-rotate(0deg)" }
    : { opacity: 1, filter: "none" };

  const exit = transitionsEnabled
    ? { opacity: 0, filter: "blur(8px) saturate(3) hue-rotate(-30deg)" }
    : { opacity: 1, filter: "none" };

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={initial}
        animate={animateState}
        exit={exit}
        transition={{ duration: transitionsEnabled ? 0.5 : 0, ease: [0.23, 1, 0.32, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
