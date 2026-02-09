"use client";

import { useMemo, useState } from "react";

interface BeforeAfterRevealProps {
  afterSrc?: string;
  fallbackGradient: string;
  label: string;
}

export function BeforeAfterReveal({ afterSrc, fallbackGradient, label }: BeforeAfterRevealProps) {
  const [position, setPosition] = useState(58);

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
      <p className="muted">Drag to compare the raw capture treatment and final psychedelic composite.</p>
      <div className="compare-stage" aria-label={`${label} before and after reveal`}>
        <div className="compare-layer compare-before" style={beforeStyle}>
          <span>Before</span>
        </div>
        <div className="compare-layer compare-after" style={afterStyle}>
          <span>After</span>
        </div>
        <div className="compare-divider" style={{ left: `${position}%` }} />
      </div>
      <input
        className="compare-slider"
        type="range"
        min={1}
        max={99}
        value={position}
        aria-label="Reveal before and after"
        onChange={(event) => setPosition(Number(event.target.value))}
      />
    </section>
  );
}
