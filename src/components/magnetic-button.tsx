"use client";

import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { cloneElement, isValidElement, useEffect, useMemo, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { usePerformanceMode } from "@/hooks/use-performance-mode";

interface MagneticButtonProps {
  children: React.ReactElement<{ className?: string; children?: React.ReactNode }>;
  variant?: "glow" | "ghost";
  disabled?: boolean;
}

interface Ripple {
  id: number;
  x: number;
  y: number;
}

const BODY_SPRING = { stiffness: 380, damping: 28, mass: 0.24 };
const TEXT_SPRING = { stiffness: 420, damping: 30, mass: 0.19 };
const RIPPLE_TRANSITION = { duration: 0.4, ease: [0.23, 1, 0.32, 1] } as const;
const H7_LOG_FLAG = "__agent_h7_logged_once__";

function mergeClassName(...values: Array<string | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function MagneticButton({ children, variant = "ghost", disabled = false }: MagneticButtonProps) {
  const { motionTier } = usePerformanceMode();
  const movementScale = motionTier === "immersive" ? 0.32 : motionTier === "normal" ? 0.14 : 0;
  const interactive = !disabled && movementScale > 0;
  const wrapperRef = useRef<HTMLSpanElement | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const textX = useMotionValue(0);
  const textY = useMotionValue(0);
  const springX = useSpring(x, BODY_SPRING);
  const springY = useSpring(y, BODY_SPRING);
  const springTextX = useSpring(textX, TEXT_SPRING);
  const springTextY = useSpring(textY, TEXT_SPRING);

  const [glowPoint, setGlowPoint] = useState({ x: "50%", y: "50%" });
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const rippleTimeoutsRef = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      for (const timeoutId of rippleTimeoutsRef.current) {
        window.clearTimeout(timeoutId);
      }
      rippleTimeoutsRef.current = [];
    };
  }, []);

  const childElement = useMemo(() => {
    if (!isValidElement(children)) {
      return null;
    }
    const childClass = mergeClassName(children.props.className, "magnetic-button-target", `magnetic-target-${variant}`);
    return cloneElement(children, {
      className: childClass,
      children: (
        <motion.span className="magnetic-button-inner" style={{ x: springTextX, y: springTextY }}>
          {children.props.children}
        </motion.span>
      )
    });
  }, [children, springTextX, springTextY, variant]);

  const reset = () => {
    x.set(0);
    y.set(0);
    textX.set(0);
    textY.set(0);
  };

  const onMove = (event: ReactPointerEvent<HTMLSpanElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;
    const dx = offsetX - rect.width / 2;
    const dy = offsetY - rect.height / 2;

    setGlowPoint({ x: `${offsetX}px`, y: `${offsetY}px` });

    if (!interactive) {
      return;
    }

    x.set(dx * movementScale);
    y.set(dy * movementScale);
    textX.set(dx * movementScale * 0.5);
    textY.set(dy * movementScale * 0.5);
  };

  const onClick = (event: ReactPointerEvent<HTMLSpanElement>) => {
    if (disabled) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const ripple = {
      id: Date.now() + Math.random(),
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
    setRipples((prev) => [...prev, ripple]);
    const timeoutId = window.setTimeout(() => {
      setRipples((prev) => prev.filter((entry) => entry.id !== ripple.id));
      rippleTimeoutsRef.current = rippleTimeoutsRef.current.filter((id) => id !== timeoutId);
    }, 420);
    rippleTimeoutsRef.current.push(timeoutId);
  };

  useEffect(() => {
    if (variant !== "glow") {
      return;
    }
    const globalWindow = window as Window & { [H7_LOG_FLAG]?: boolean };
    if (globalWindow[H7_LOG_FLAG]) {
      return;
    }
    const wrapper = wrapperRef.current;
    if (!wrapper) {
      return;
    }
    const target = wrapper.querySelector(".magnetic-button-target");
    if (!(target instanceof HTMLElement)) {
      return;
    }
    const styles = window.getComputedStyle(target);
    // #region agent log H7 glow button style collision
    fetch("http://127.0.0.1:7242/ingest/ff9c1328-0a4a-45f8-8ea5-81952b6584c2", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        runId: "initial",
        hypothesisId: "H7",
        location: "src/components/magnetic-button.tsx:112",
        message: "Glow magnetic target computed styles",
        data: {
          className: target.className,
          position: styles.position,
          pointerEvents: styles.pointerEvents,
          opacity: styles.opacity
        },
        timestamp: Date.now()
      })
    }).catch(() => {});
    // #endregion
    globalWindow[H7_LOG_FLAG] = true;
  }, [variant]);

  return (
    <motion.span
      ref={wrapperRef}
      className={mergeClassName(
        "magnetic-button-wrap",
        `magnetic-wrap-${variant}`,
        disabled ? "magnetic-button-disabled" : undefined
      )}
      style={interactive ? { x: springX, y: springY } : undefined}
      onPointerMove={onMove}
      onPointerLeave={reset}
      onPointerCancel={reset}
      onPointerDown={onClick}
      data-motion-tier={motionTier}
    >
      <span className="magnetic-button-glow" style={{ left: glowPoint.x, top: glowPoint.y }} aria-hidden />
      {childElement}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            className="magnetic-button-ripple"
            style={{ left: ripple.x, top: ripple.y }}
            initial={{ opacity: 0.55, scale: 0.2 }}
            animate={{ opacity: 0, scale: 2.1 }}
            exit={{ opacity: 0 }}
            transition={RIPPLE_TRANSITION}
            aria-hidden
          />
        ))}
      </AnimatePresence>
    </motion.span>
  );
}
