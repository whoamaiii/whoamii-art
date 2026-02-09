"use client";

import { useState } from "react";

interface ProcessLayerToggleProps {
  layers: string[];
}

export function ProcessLayerToggle({ layers }: ProcessLayerToggleProps) {
  const [revealed, setRevealed] = useState(false);

  return (
    <section className="process-layer">
      <button className="glow-button" type="button" onClick={() => setRevealed((value) => !value)}>
        {revealed ? "Hide Process Layer" : "Reveal Process Layer"}
      </button>
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
