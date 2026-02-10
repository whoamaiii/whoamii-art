"use client";

import dynamic from "next/dynamic";
import { useCallback, useState } from "react";

export type MotionTier = "lite" | "normal" | "immersive";

interface PsychedelicBackgroundProps {
  motionTier: MotionTier;
}

const ImmersiveAuroraCanvas = dynamic(
  () => import("@/components/immersive-aurora-canvas").then((mod) => mod.ImmersiveAuroraCanvas),
  { ssr: false }
);

export function PsychedelicBackground({ motionTier }: PsychedelicBackgroundProps) {
  const [webglFailed, setWebglFailed] = useState(false);
  const handleWebglError = useCallback(() => {
    setWebglFailed(true);
  }, []);
  const immersiveActive = motionTier === "immersive" && !webglFailed;
  const fallbackTier = motionTier === "lite" ? "lite" : "normal";

  return (
    <div
      className={
        immersiveActive
          ? "psychedelic-bg psychedelic-bg-immersive"
          : `psychedelic-bg psychedelic-bg-${fallbackTier}`
      }
      aria-hidden
    >
      {immersiveActive ? <ImmersiveAuroraCanvas onError={handleWebglError} /> : null}
    </div>
  );
}
