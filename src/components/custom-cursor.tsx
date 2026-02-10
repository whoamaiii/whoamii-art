"use client";

import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import type { MotionTier } from "@/components/psychedelic-background";

interface CustomCursorProps {
  motionTier: MotionTier;
}

interface Point {
  x: number;
  y: number;
}

interface Burst extends Point {
  id: number;
}

const TRAIL_COUNT = 6;

function isInteractive(target: EventTarget | null) {
  return target instanceof Element && Boolean(target.closest("a, button, input, textarea, select, [data-cursor-hit]"));
}

export function CustomCursor({ motionTier }: CustomCursorProps) {
  const [enabled, setEnabled] = useState(false);
  const [hoveringInteractive, setHoveringInteractive] = useState(false);
  const [bursts, setBursts] = useState<Burst[]>([]);
  const trailRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const pointerRef = useRef<Point>({ x: -100, y: -100 });
  const trailPointsRef = useRef<Point[]>(
    Array.from({ length: TRAIL_COUNT }, () => ({ x: -100, y: -100 }))
  );
  const frameRef = useRef<number>(0);
  const burstTimeoutsRef = useRef<number[]>([]);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const ringX = useSpring(mouseX, { stiffness: 320, damping: 28, mass: 0.25 });
  const ringY = useSpring(mouseY, { stiffness: 320, damping: 28, mass: 0.25 });
  const dotX = useSpring(mouseX, { stiffness: 640, damping: 40, mass: 0.12 });
  const dotY = useSpring(mouseY, { stiffness: 640, damping: 40, mass: 0.12 });

  const trailPalette = useMemo(
    () => ["var(--psych-pink)", "var(--psych-violet)", "var(--psych-cyan)", "var(--psych-gold)", "var(--psych-lime)", "#ffffff"],
    []
  );

  useEffect(() => {
    if (motionTier !== "immersive") {
      setEnabled(false);
      return;
    }

    const finePointerQuery = window.matchMedia("(pointer: fine)");
    const update = () => setEnabled(finePointerQuery.matches && !window.matchMedia("(hover: none)").matches);
    update();

    if (typeof finePointerQuery.addEventListener === "function") {
      finePointerQuery.addEventListener("change", update);
      return () => finePointerQuery.removeEventListener("change", update);
    }

    finePointerQuery.addListener(update);
    return () => finePointerQuery.removeListener(update);
  }, [motionTier]);

  useEffect(() => {
    const clearBurstTimeouts = () => {
      for (const timeoutId of burstTimeoutsRef.current) {
        window.clearTimeout(timeoutId);
      }
      burstTimeoutsRef.current = [];
    };

    if (!enabled) {
      document.body.classList.remove("psych-cursor-active");
      clearBurstTimeouts();
      return;
    }

    document.body.classList.add("psych-cursor-active");

    const handleMove = (event: PointerEvent) => {
      mouseX.set(event.clientX);
      mouseY.set(event.clientY);
      pointerRef.current = { x: event.clientX, y: event.clientY };
      const hit = isInteractive(event.target);
      setHoveringInteractive((prev) => (prev === hit ? prev : hit));
    };

    const handleClick = (event: PointerEvent) => {
      const burst = { id: Date.now() + Math.random(), x: event.clientX, y: event.clientY };
      setBursts((prev) => [...prev, burst]);
      const timeoutId = window.setTimeout(() => {
        setBursts((prev) => prev.filter((entry) => entry.id !== burst.id));
        burstTimeoutsRef.current = burstTimeoutsRef.current.filter((id) => id !== timeoutId);
      }, 460);
      burstTimeoutsRef.current.push(timeoutId);
    };

    window.addEventListener("pointermove", handleMove, { passive: true });
    window.addEventListener("pointerdown", handleClick, { passive: true });

    const tick = () => {
      const target = pointerRef.current;
      const points = trailPointsRef.current;

      for (let index = 0; index < points.length; index += 1) {
        const previous = index === 0 ? target : points[index - 1];
        const point = points[index];
        point.x += (previous.x - point.x) * 0.34;
        point.y += (previous.y - point.y) * 0.34;

        const element = trailRefs.current[index];
        if (element) {
          element.style.transform = `translate(${point.x}px, ${point.y}px) translate(-50%, -50%)`;
        }
      }

      frameRef.current = window.requestAnimationFrame(tick);
    };

    frameRef.current = window.requestAnimationFrame(tick);

    return () => {
      document.body.classList.remove("psych-cursor-active");
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerdown", handleClick);
      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current);
      }
      clearBurstTimeouts();
    };
  }, [enabled, mouseX, mouseY]);

  if (!enabled) {
    return null;
  }

  return (
    <div className="psych-cursor" aria-hidden>
      <motion.div
        className={hoveringInteractive ? "psych-cursor-ring psych-cursor-ring-hit" : "psych-cursor-ring"}
        style={{ x: ringX, y: ringY }}
      />
      <motion.div className="psych-cursor-dot" style={{ x: dotX, y: dotY }} />
      {Array.from({ length: TRAIL_COUNT }).map((_, index) => (
        <span
          key={`trail-${index}`}
          ref={(element) => {
            trailRefs.current[index] = element;
          }}
          className="psych-cursor-trail"
          style={{
            opacity: Math.max(0.12, 0.85 - index * 0.13),
            background: trailPalette[index % trailPalette.length]
          }}
        />
      ))}
      <AnimatePresence>
        {bursts.map((burst) => (
          <motion.span
            key={burst.id}
            className="psych-cursor-burst"
            style={{ left: burst.x, top: burst.y }}
            initial={{ opacity: 0.75, scale: 0.25 }}
            animate={{ opacity: 0, scale: 2.4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.42, ease: [0.23, 1, 0.32, 1] }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
