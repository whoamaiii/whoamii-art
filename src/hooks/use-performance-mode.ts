"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { createElement } from "react";
import type { ReactNode } from "react";

interface PerformanceMode {
  reducedMotion: boolean;
  lowPowerDevice: boolean;
  motionScale: number;
  motionTier: "lite" | "normal" | "immersive";
  shouldAutoplayMedia: boolean;
  resolved: boolean;
}

const defaultPerformanceMode: PerformanceMode = {
  reducedMotion: false,
  lowPowerDevice: false,
  motionScale: 0.5,
  motionTier: "normal",
  shouldAutoplayMedia: false,
  resolved: false
};

const PerformanceModeContext = createContext<PerformanceMode>(defaultPerformanceMode);

function usePerformanceModeState(): PerformanceMode {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [lowPowerDevice, setLowPowerDevice] = useState(false);
  const [resolved, setResolved] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => setReducedMotion(mediaQuery.matches);
    updateMotionPreference();
    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", updateMotionPreference);
    } else {
      mediaQuery.addListener(updateMotionPreference);
    }

    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
    const cores = navigator.hardwareConcurrency ?? 8;
    const inferredLowPowerDevice = memory <= 4 || cores <= 4;
    setLowPowerDevice(inferredLowPowerDevice);
    setResolved(true);

    // #region agent log H1 performance mode resolve
    fetch("http://127.0.0.1:7242/ingest/ff9c1328-0a4a-45f8-8ea5-81952b6584c2", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        runId: "initial",
        hypothesisId: "H1",
        location: "src/hooks/use-performance-mode.ts:32",
        message: "Performance mode resolved",
        data: {
          reducedMotionPreferred: mediaQuery.matches,
          deviceMemory: memory,
          hardwareConcurrency: cores,
          inferredLowPowerDevice
        },
        timestamp: Date.now()
      })
    }).catch(() => {});
    // #endregion

    return () => {
      if (typeof mediaQuery.removeEventListener === "function") {
        mediaQuery.removeEventListener("change", updateMotionPreference);
      } else {
        mediaQuery.removeListener(updateMotionPreference);
      }
    };
  }, []);

  const motionScale = useMemo(() => {
    if (!resolved) return 0.5;
    if (reducedMotion) return 0;
    if (lowPowerDevice) return 0.5;
    return 1;
  }, [lowPowerDevice, reducedMotion, resolved]);

  const motionTier = useMemo<PerformanceMode["motionTier"]>(() => {
    if (!resolved) return "normal";
    if (reducedMotion) return "lite";
    if (lowPowerDevice) return "normal";
    return "normal";
  }, [lowPowerDevice, reducedMotion, resolved]);

  return {
    reducedMotion,
    lowPowerDevice,
    motionScale,
    motionTier,
    shouldAutoplayMedia: resolved && !reducedMotion && !lowPowerDevice,
    resolved
  };
}

export function PerformanceModeProvider({ children }: { children: ReactNode }) {
  const value = usePerformanceModeState();
  return createElement(PerformanceModeContext.Provider, { value }, children);
}

export function usePerformanceMode(): PerformanceMode {
  return useContext(PerformanceModeContext);
}
