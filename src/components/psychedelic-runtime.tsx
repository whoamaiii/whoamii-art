"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import { usePerformanceMode } from "@/hooks/use-performance-mode";

const PsychedelicBackground = dynamic(
  () => import("@/components/psychedelic-background").then((mod) => mod.PsychedelicBackground),
  { ssr: false }
);

const FloatingSacredGeometry = dynamic(
  () => import("@/components/floating-sacred-geometry").then((mod) => mod.FloatingSacredGeometry),
  { ssr: false }
);

const CustomCursor = dynamic(
  () => import("@/components/custom-cursor").then((mod) => mod.CustomCursor),
  { ssr: false }
);

const ScrollProgress = dynamic(
  () => import("@/components/scroll-progress").then((mod) => mod.ScrollProgress),
  { ssr: false }
);

export function PsychedelicRuntime() {
  const { motionTier } = usePerformanceMode();

  useEffect(() => {
    document.documentElement.setAttribute("data-motion-tier", motionTier);
    if (motionTier === "immersive") {
      document.body.classList.add("psych-grain-enabled");
    } else {
      document.body.classList.remove("psych-grain-enabled");
    }

    return () => {
      document.documentElement.removeAttribute("data-motion-tier");
      document.body.classList.remove("psych-grain-enabled");
      document.body.classList.remove("psych-cursor-active");
      document.documentElement.style.setProperty("--scroll-progress", "0");
    };
  }, [motionTier]);

  return (
    <>
      <PsychedelicBackground motionTier={motionTier} />
      <FloatingSacredGeometry motionTier={motionTier} />
      {motionTier === "lite" ? null : <ScrollProgress />}
      {motionTier === "immersive" ? <CustomCursor motionTier={motionTier} /> : null}
    </>
  );
}
