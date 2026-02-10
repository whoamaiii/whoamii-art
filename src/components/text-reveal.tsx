"use client";

import { motion } from "framer-motion";
import { createElement, useMemo } from "react";
import { usePerformanceMode } from "@/hooks/use-performance-mode";

interface TextRevealProps {
  text: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  rgbPersist?: boolean;
}

const tagToMotion = {
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  p: motion.p,
  span: motion.span
} as const;

function classNames(...values: Array<string | undefined | false>) {
  return values.filter(Boolean).join(" ");
}

export function TextReveal({ text, as = "h1", className, rgbPersist = false }: TextRevealProps) {
  const { motionTier } = usePerformanceMode();
  const chars = useMemo(() => Array.from(text), [text]);

  if (motionTier === "lite") {
    return createElement(
      as,
      { className: classNames(className, rgbPersist && "text-rgb-persist") },
      text
    );
  }

  const MotionTag = tagToMotion[as];

  return (
    <MotionTag
      className={classNames(className, rgbPersist && "text-rgb-persist")}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.02,
            delayChildren: 0.04
          }
        }
      }}
      aria-label={text}
    >
      {chars.map((char, index) => {
        const hue = (index * 41) % 360;
        return (
          <motion.span
            key={`${char}-${index}`}
            className="text-reveal-char"
            aria-hidden="true"
            variants={{
              hidden: {
                y: 30,
                opacity: 0,
                rotateX: -60,
                filter: `hue-rotate(${hue}deg)`
              },
              visible: {
                y: 0,
                opacity: 1,
                rotateX: 0,
                filter: "hue-rotate(0deg)",
                transition: {
                  type: "spring",
                  damping: 19,
                  stiffness: 240,
                  mass: 0.6
                }
              }
            }}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        );
      })}
    </MotionTag>
  );
}
