export type TechniqueFilter =
  | "Photography + Overlay"
  | "Hand-Drawn"
  | "3D Render"
  | "Hybrid";

export type SubjectFilter = "Faces" | "Hands" | "Landscape" | "Objects" | "Animals";

export type IntensityFilter = "Meditative" | "Moderate" | "Intense";

export type ColorFilter = "Warm" | "Cool" | "Multi";

export interface ProjectTaxonomy {
  technique: TechniqueFilter;
  subject: SubjectFilter;
  intensity: IntensityFilter;
  color: ColorFilter;
  audioCredit?: string;
  bpm?: number;
  mood: string;
}

export const projectTaxonomyBySlug: Record<string, ProjectTaxonomy> = {
  "everywhere-i-seem-to-look": {
    technique: "Hybrid",
    subject: "Faces",
    intensity: "Intense",
    color: "Multi",
    audioCredit: "Instagram Reel Audio",
    mood: "Surreal"
  },
  "bringing-my-drawings-to-life": {
    technique: "Hand-Drawn",
    subject: "Faces",
    intensity: "Intense",
    color: "Multi",
    mood: "Energetic"
  },
  "inner-eye": {
    technique: "Photography + Overlay",
    subject: "Faces",
    intensity: "Intense",
    color: "Warm",
    mood: "Surreal"
  },
  "dump-dump": {
    technique: "Hybrid",
    subject: "Landscape",
    intensity: "Moderate",
    color: "Multi",
    mood: "Abstract"
  },
  "cosmicbass-visual-teaser": {
    technique: "Hybrid",
    subject: "Objects",
    intensity: "Intense",
    color: "Warm",
    audioCredit: "COSMICBASS Promo Cut",
    bpm: 140,
    mood: "Energetic"
  },
  "gausing-spatial-ritual-01": {
    technique: "3D Render",
    subject: "Landscape",
    intensity: "Moderate",
    color: "Cool",
    mood: "Abstract"
  },
  "gausing-spatial-ritual-02": {
    technique: "3D Render",
    subject: "Landscape",
    intensity: "Meditative",
    color: "Cool",
    mood: "Meditative"
  },
  "drawn-serpent-morph": {
    technique: "Hand-Drawn",
    subject: "Objects",
    intensity: "Intense",
    color: "Warm",
    mood: "Surreal"
  },
  "paper-glyph-orbit": {
    technique: "Hand-Drawn",
    subject: "Objects",
    intensity: "Moderate",
    color: "Cool",
    mood: "Abstract"
  },
  "aftereffects-only-trance": {
    technique: "Hybrid",
    subject: "Faces",
    intensity: "Moderate",
    color: "Cool",
    bpm: 128,
    mood: "Energetic"
  },
  "blender-only-radiant-cave": {
    technique: "3D Render",
    subject: "Landscape",
    intensity: "Meditative",
    color: "Cool",
    mood: "Meditative"
  },
  "replication-signal-v1": {
    technique: "Photography + Overlay",
    subject: "Faces",
    intensity: "Intense",
    color: "Warm",
    mood: "Surreal"
  },
  "replication-signal-v2": {
    technique: "Photography + Overlay",
    subject: "Faces",
    intensity: "Intense",
    color: "Multi",
    mood: "Surreal"
  },
  "field-scan-memory-loop": {
    technique: "Hybrid",
    subject: "Landscape",
    intensity: "Moderate",
    color: "Cool",
    mood: "Meditative"
  }
};

export const techniqueFilters: Array<TechniqueFilter | "All"> = [
  "All",
  "Photography + Overlay",
  "Hand-Drawn",
  "3D Render",
  "Hybrid"
];

export const subjectFilters: Array<SubjectFilter | "All"> = [
  "All",
  "Faces",
  "Hands",
  "Landscape",
  "Objects",
  "Animals"
];

export const intensityFilters: Array<IntensityFilter | "All"> = [
  "All",
  "Meditative",
  "Moderate",
  "Intense"
];

export const colorFilters: Array<ColorFilter | "All"> = ["All", "Warm", "Cool", "Multi"];
