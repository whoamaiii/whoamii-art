"use client";

import { motion } from "framer-motion";
import { createContext, createElement, useContext, useEffect, useMemo, useRef, useState } from "react";
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

const SECTION_ITEM_VARIANTS = {
  hidden: { y: 60, opacity: 0, filter: "blur(6px)", rotateX: 4 },
  visible: {
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    rotateX: 0,
    transition: { duration: 0.62, ease: [0.23, 1, 0.32, 1] }
  }
} as const;

const GRID_ITEM_VARIANTS = {
  hidden: { y: 40, opacity: 0, filter: "blur(4px)" },
  visible: {
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.56, ease: [0.23, 1, 0.32, 1] }
  }
} as const;

export function StaggerContainer({
  children,
  className,
  id,
  tabIndex,
  as = "div",
  kind = "grid"
}: StaggerContainerProps) {
  const { motionTier, resolved } = usePerformanceMode();
  const ref = useRef<HTMLDivElement | null>(null);
  const hasEnteredViewRef = useRef(false);
  const [observerReady, setObserverReady] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const shouldAnimate = resolved && motionTier !== "lite";

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

  useEffect(() => {
    if (!shouldAnimate) {
      hasEnteredViewRef.current = false;
      setObserverReady(false);
      setIsVisible(true);
      return;
    }

    const target = ref.current;
    if (!target) {
      setObserverReady(true);
      setIsVisible(true);
      return;
    }

    const intersectionObserverCtor = (
      window as Window & { IntersectionObserver?: typeof IntersectionObserver }
    ).IntersectionObserver;

    if (!intersectionObserverCtor) {
      setObserverReady(true);
      setIsVisible(true);
      return;
    }

    let fallbackTimer = window.setTimeout(() => {
      setObserverReady(true);
      setIsVisible(true);
    }, 650);

    const observer = new intersectionObserverCtor(
      (entries) => {
        const [entry] = entries;
        if (!entry) return;

        if (entry.isIntersecting) {
          hasEnteredViewRef.current = true;
          observer.unobserve(entry.target);
        }

        setObserverReady(true);
        setIsVisible(entry.isIntersecting || hasEnteredViewRef.current);

        if (fallbackTimer) {
          window.clearTimeout(fallbackTimer);
          fallbackTimer = 0;
        }
      },
      { rootMargin: "-10% 0px", threshold: 0.01 }
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
      if (fallbackTimer) {
        window.clearTimeout(fallbackTimer);
      }
    };
  }, [shouldAnimate]);

  if (!shouldAnimate) {
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
        initial={false}
        animate={observerReady && !isVisible ? "hidden" : "visible"}
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

  const variants = kind === "section" ? SECTION_ITEM_VARIANTS : GRID_ITEM_VARIANTS;

  if (motionTier === "lite") {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div className={className} variants={variants}>
      {children}
    </motion.div>
  );
}
