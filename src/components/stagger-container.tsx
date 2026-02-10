"use client";

import { motion, useInView } from "framer-motion";
import { createContext, createElement, useContext, useMemo, useRef } from "react";
import type { ReactNode } from "react";
import { usePerformanceMode } from "@/hooks/use-performance-mode";

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  id?: string;
  tabIndex?: number;
  as?: keyof HTMLElementTagNameMap;
  kind?: "grid" | "section";
}

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
}

const StaggerKindContext = createContext<"grid" | "section">("grid");

export function StaggerContainer({
  children,
  className,
  id,
  tabIndex,
  as = "div",
  kind = "grid"
}: StaggerContainerProps) {
  const { motionTier } = usePerformanceMode();
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });

  const containerVariants = useMemo(
    () => ({
      hidden: { opacity: 0.001 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: kind === "grid" ? 0.06 : 0.08,
          delayChildren: 0.04
        }
      }
    }),
    [kind]
  );

  if (motionTier === "lite") {
    return (
      <StaggerKindContext.Provider value={kind}>
        {createElement(as, { className, id, tabIndex }, children)}
      </StaggerKindContext.Provider>
    );
  }

  return (
    <StaggerKindContext.Provider value={kind}>
      <motion.div
        ref={ref}
        id={as === "div" ? id : undefined}
        tabIndex={as === "div" ? tabIndex : undefined}
        className={as === "div" ? className : undefined}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        {as === "div" ? children : createElement(as, { className, id, tabIndex }, children)}
      </motion.div>
    </StaggerKindContext.Provider>
  );
}

export function StaggerItem({ children, className }: StaggerItemProps) {
  const { motionTier } = usePerformanceMode();
  const kind = useContext(StaggerKindContext);

  const variants =
    kind === "section"
      ? {
          hidden: { y: 60, opacity: 0, filter: "blur(6px)", rotateX: 4 },
          visible: {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            rotateX: 0,
            transition: { duration: 0.62, ease: [0.23, 1, 0.32, 1] }
          }
        }
      : {
          hidden: { y: 40, opacity: 0, filter: "blur(4px)" },
          visible: {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            transition: { duration: 0.56, ease: [0.23, 1, 0.32, 1] }
          }
        };

  if (motionTier === "lite") {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div className={className} variants={variants}>
      {children}
    </motion.div>
  );
}
