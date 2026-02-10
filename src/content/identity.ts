import type { IdentitySystem } from "@/types/portfolio";

export const identitySystem: IdentitySystem = {
  portalName: "Quentin Qmann",
  tone: ["poetic", "cryptic", "ceremonial", "charged"],
  palette: {
    abyssBlack: "#0A0A0A",
    plasmaViolet: "#9D4EDD",
    toxicCyan: "#00D4D4",
    emberMagenta: "#FF6B35",
    ghostWhite: "#F5F5F5"
  },
  typography: {
    display: "Manrope",
    utility: "JetBrains Mono"
  },
  textureMotifs: [
    "chromatic bleed edges",
    "micro scanline noise",
    "fractal halo around call-to-actions",
    "eye glyph pulse"
  ],
  motionRules: [
    "Ambient low-frequency breathing in background fields",
    "Hover interactions feel fluid and magnetic, never rigid",
    "Section transitions behave like phase shifts with gentle blur trails",
    "Respect prefers-reduced-motion and degrade to static layers"
  ]
};
