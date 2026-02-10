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
  reducedMotion: true,
  lowPowerDevice: true,
  motionScale: 0,
  motionTier: "lite",
  shouldAutoplayMedia: false,
  resolved: false
};

const PerformanceModeContext = createContext<PerformanceMode>(defaultPerformanceMode);

function usePerformanceModeState(): PerformanceMode {
  const [reducedMotion, setReducedMotion] = useState(true);
  const [lowPowerDevice, setLowPowerDevice] = useState(true);
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
    setLowPowerDevice(memory <= 4 || cores <= 4);
    setResolved(true);

    return () => {
      if (typeof mediaQuery.removeEventListener === "function") {
        mediaQuery.removeEventListener("change", updateMotionPreference);
      } else {
        mediaQuery.removeListener(updateMotionPreference);
      }
    };
  }, []);

  const motionScale = useMemo(() => {
    if (!resolved) return 0;
    if (reducedMotion) return 0;
    if (lowPowerDevice) return 0.5;
    return 1;
  }, [lowPowerDevice, reducedMotion, resolved]);

  const motionTier = useMemo<PerformanceMode["motionTier"]>(() => {
    if (!resolved) return "lite";
    if (reducedMotion) return "lite";
    if (lowPowerDevice) return "normal";
    return "immersive";
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
