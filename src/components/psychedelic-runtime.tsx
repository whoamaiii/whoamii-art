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
    const prevTier = document.documentElement.getAttribute("data-motion-tier");
    document.documentElement.setAttribute("data-motion-tier", motionTier);
    if (motionTier === "immersive") {
      document.body.classList.add("psych-grain-enabled");
    } else {
      document.body.classList.remove("psych-grain-enabled");
    }

    // #region agent log H18 tier transition flash check
    fetch("http://127.0.0.1:7242/ingest/ff9c1328-0a4a-45f8-8ea5-81952b6584c2", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        runId: "post-fix-color-flash",
        hypothesisId: "H18",
        location: "src/components/psychedelic-runtime.tsx:30",
        message: "Tier attribute transition",
        data: {
          prevTier,
          newTier: motionTier,
          changed: prevTier !== motionTier
        },
        timestamp: Date.now()
      })
    }).catch(() => {});
    // #endregion

    return () => {
      document.documentElement.removeAttribute("data-motion-tier");
      document.body.classList.remove("psych-grain-enabled");
      document.body.classList.remove("psych-cursor-active");
      document.documentElement.style.setProperty("--scroll-progress", "0");
    };
  }, [motionTier]);

  useEffect(() => {
    let frame = 0;
    let frameCount = 0;
    let slowFrameCount = 0;
    let previous = performance.now();
    const startedAt = previous;
    let longTaskCount = 0;
    let longTaskDuration = 0;
    let observer: PerformanceObserver | null = null;

    if ("PerformanceObserver" in window) {
      try {
        observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            longTaskCount += 1;
            longTaskDuration += entry.duration;
          }
        });
        observer.observe({ type: "longtask", buffered: true });
      } catch {
        observer = null;
      }
    }

    let steadyStateStart = 0;
    let steadyFrameCount = 0;
    let steadySlowFrameCount = 0;

    const tick = (now: number) => {
      const delta = now - previous;
      previous = now;
      frameCount += 1;
      if (delta > 20) {
        slowFrameCount += 1;
      }

      const elapsed = now - startedAt;

      // Track steady-state window (5s–7.5s)
      if (elapsed >= 5000 && !steadyStateStart) {
        steadyStateStart = now;
        steadyFrameCount = 0;
        steadySlowFrameCount = 0;
      }
      if (steadyStateStart) {
        steadyFrameCount += 1;
        if (delta > 20) steadySlowFrameCount += 1;
      }

      if (elapsed >= 7500) {
        const seconds = Math.max((now - startedAt) / 1000, 0.001);
        // Lightweight spot-check: just test one project card for backdrop-filter
        const sampleCard = document.querySelector(".project-card");
        const sampleBf = sampleCard instanceof HTMLElement
          ? window.getComputedStyle(sampleCard).backdropFilter
          : "n/a";

        // #region agent log H10 runtime frame health
        fetch("http://127.0.0.1:7242/ingest/ff9c1328-0a4a-45f8-8ea5-81952b6584c2", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            runId: "post-fix-v2",
            hypothesisId: "H10",
            location: "src/components/psychedelic-runtime.tsx:48",
            message: "Runtime frame health sample",
            data: {
              motionTier,
              fullWindowSeconds: Number(seconds.toFixed(2)),
              fullFrameCount: frameCount,
              fullFps: Number((frameCount / seconds).toFixed(1)),
              fullSlowRatio: Number((slowFrameCount / Math.max(frameCount, 1)).toFixed(3)),
              steadySeconds: steadyStateStart ? Number(((now - steadyStateStart) / 1000).toFixed(2)) : 0,
              steadyFrameCount,
              steadyFps: steadyStateStart ? Number((steadyFrameCount / Math.max((now - steadyStateStart) / 1000, 0.001)).toFixed(1)) : 0,
              steadySlowRatio: Number((steadySlowFrameCount / Math.max(steadyFrameCount, 1)).toFixed(3)),
              longTaskCount,
              longTaskDurationMs: Number(longTaskDuration.toFixed(1)),
              sampleCardBackdropFilter: sampleBf,
              dataMotionTier: document.documentElement.getAttribute("data-motion-tier")
            },
            timestamp: Date.now()
          })
        }).catch(() => {});
        // #endregion
        return;
      }

      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);

    return () => {
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
      observer?.disconnect();
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
