import type { IdentitySystem } from "@/types/portfolio";

export const identitySystem: IdentitySystem = {
  portalName: "Inner Eye Signal",
  tone: ["poetic", "cryptic", "ceremonial", "charged"],
  palette: {
    abyssBlack: "#06060B",
    plasmaViolet: "#7A3EFF",
    toxicCyan: "#00F0D3",
    emberMagenta: "#FF2DA0",
    ghostWhite: "#EAE8FF"
  },
  typography: {
    display: "Space Grotesk",
    utility: "Inter"
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
