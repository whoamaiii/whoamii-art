export type ProjectCategory =
  | "ReplicaVisions"
  | "DrawingToMotion"
  | "PureCraft"
  | "SpatialScans";

export type ToolTag =
  | "Blender"
  | "AfterEffects"
  | "AIModel"
  | "3DScan"
  | "Compositing"
  | "SoundDesign";

export interface Project {
  slug: string;
  title: string;
  oneLiner: string;
  category: ProjectCategory;
  year: string;
  duration: string;
  featured: boolean;
  toolStack: ToolTag[];
  processLayers: string[];
  vibe: string[];
  heroGradient: string;
  media: {
    loopSrc?: string;
    posterSrc?: string;
  };
}

export interface IdentitySystem {
  portalName: string;
  tone: string[];
  palette: {
    abyssBlack: string;
    plasmaViolet: string;
    toxicCyan: string;
    emberMagenta: string;
    ghostWhite: string;
  };
  typography: {
    display: string;
    utility: string;
  };
  textureMotifs: string[];
  motionRules: string[];
}
