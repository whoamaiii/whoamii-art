"use client";

import { useState } from "react";
import { MagneticButton } from "@/components/magnetic-button";

interface ProcessLayerToggleProps {
  layers: string[];
}

export function ProcessLayerToggle({ layers }: ProcessLayerToggleProps) {
  const [revealed, setRevealed] = useState(false);

  return (
    <section className="process-layer">
      <MagneticButton variant="glow">
        <button
          className="glow-button hover-control"
          type="button"
          onClick={() => setRevealed((value) => !value)}
          data-cursor-hit
        >
          {revealed ? "Hide Process Layer" : "Reveal Process Layer"}
        </button>
      </MagneticButton>
      {revealed ? (
        <ol>
          {layers.map((layer) => (
            <li key={layer}>{layer}</li>
          ))}
        </ol>
      ) : (
        <p className="muted">Click to reveal the behind-the-scenes pipeline.</p>
      )}
    </section>
  );
}
