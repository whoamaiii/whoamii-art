"use client";

import { useMemo, useState } from "react";
import { usePerformanceMode } from "@/hooks/use-performance-mode";

interface BeforeAfterRevealProps {
  afterSrc?: string;
  fallbackGradient: string;
  label: string;
}

export function BeforeAfterReveal({ afterSrc, fallbackGradient, label }: BeforeAfterRevealProps) {
  const [position, setPosition] = useState(58);
  const [showAfter, setShowAfter] = useState(true);
  const { reducedMotion } = usePerformanceMode();

  const beforeStyle = useMemo(() => {
    return {
      backgroundImage: afterSrc ? `url(${afterSrc}), ${fallbackGradient}` : fallbackGradient,
      backgroundPosition: "center",
      backgroundSize: "cover",
      clipPath: `inset(0 ${100 - position}% 0 0)`
    };
  }, [afterSrc, fallbackGradient, position]);

  const afterStyle = useMemo(() => {
    return {
      backgroundImage: afterSrc ? `url(${afterSrc}), ${fallbackGradient}` : fallbackGradient,
      backgroundPosition: "center",
      backgroundSize: "cover",
      clipPath: `inset(0 0 0 ${position}%)`
    };
  }, [afterSrc, fallbackGradient, position]);

  return (
    <section className="compare-panel">
      <h2>Before / After</h2>
      <p className="muted">
        {reducedMotion
          ? "Reduced motion is active. Toggle between before and after states."
          : "Drag to compare the raw capture treatment and final psychedelic composite."}
      </p>
      {reducedMotion ? (
        <div className="work-actions">
          <button type="button" className="ghost-button" onClick={() => setShowAfter(false)}>
            Show Before
          </button>
          <button type="button" className="glow-button" onClick={() => setShowAfter(true)}>
            Show After
          </button>
        </div>
      ) : null}
      <div className="compare-stage" aria-label={`${label} before and after reveal`}>
        <div
          className="compare-layer compare-before"
          style={reducedMotion ? { ...beforeStyle, clipPath: showAfter ? "inset(0 100% 0 0)" : "none" } : beforeStyle}
        >
          <span>Before: Photography + Capture</span>
        </div>
        <div
          className="compare-layer compare-after"
          style={reducedMotion ? { ...afterStyle, clipPath: showAfter ? "none" : "inset(0 0 0 100%)" } : afterStyle}
        >
          <span>After: Blender + AE Composite</span>
        </div>
        {reducedMotion ? null : <div className="compare-divider" style={{ left: `${position}%` }} />}
      </div>
      {reducedMotion ? null : (
        <input
          className="compare-slider"
          type="range"
          min={1}
          max={99}
          value={position}
          aria-label="Reveal before and after"
          onChange={(event) => setPosition(Number(event.target.value))}
        />
      )}
    </section>
  );
}
