"use client";

import { useEffect, useMemo, useState } from "react";

interface PerformanceMode {
  reducedMotion: boolean;
  lowPowerDevice: boolean;
  motionScale: number;
  motionTier: "lite" | "normal" | "immersive";
  shouldAutoplayMedia: boolean;
}

export function usePerformanceMode(): PerformanceMode {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [lowPowerDevice, setLowPowerDevice] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => setReducedMotion(mediaQuery.matches);
    updateMotionPreference();
    mediaQuery.addEventListener("change", updateMotionPreference);

    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
    const cores = navigator.hardwareConcurrency ?? 8;
    setLowPowerDevice(memory <= 4 || cores <= 4);

    return () => mediaQuery.removeEventListener("change", updateMotionPreference);
  }, []);

  const motionScale = useMemo(() => {
    if (reducedMotion) return 0;
    if (lowPowerDevice) return 0.5;
    return 1;
  }, [lowPowerDevice, reducedMotion]);

  const motionTier = useMemo<PerformanceMode["motionTier"]>(() => {
    if (reducedMotion) return "lite";
    if (lowPowerDevice) return "normal";
    return "immersive";
  }, [lowPowerDevice, reducedMotion]);

  return {
    reducedMotion,
    lowPowerDevice,
    motionScale,
    motionTier,
    shouldAutoplayMedia: !reducedMotion
  };
}
