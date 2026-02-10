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
    technique: "Photography + Overlay",
    subject: "Hands",
    intensity: "Intense",
    color: "Warm",
    audioCredit: "@SONIC_LABS",
    bpm: 124,
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
    audioCredit: "@NOISE_ARCH",
    bpm: 110,
    mood: "Surreal"
  },
  "dump-dump": {
    technique: "Hybrid",
    subject: "Landscape",
    intensity: "Moderate",
    color: "Multi",
    audioCredit: "@DEEP_SPACE",
    bpm: 140,
    mood: "Energetic"
  },
  "cosmicbass-visual-teaser": {
    technique: "Hybrid",
    subject: "Faces",
    intensity: "Intense",
    color: "Warm",
    audioCredit: "@FUTURE_BEATS",
    bpm: 98,
    mood: "Energetic"
  },
  "gausing-spatial-ritual-01": {
    technique: "Photography + Overlay",
    subject: "Landscape",
    intensity: "Moderate",
    color: "Cool",
    mood: "Meditative"
  },
  "gausing-spatial-ritual-02": {
    technique: "Photography + Overlay",
    subject: "Hands",
    intensity: "Moderate",
    color: "Warm",
    mood: "Meditative"
  },
  "drawn-serpent-morph": {
    technique: "Hybrid",
    subject: "Faces",
    intensity: "Moderate",
    color: "Cool",
    mood: "Surreal"
  },
  "paper-glyph-orbit": {
    technique: "Photography + Overlay",
    subject: "Faces",
    intensity: "Meditative",
    color: "Cool",
    audioCredit: "@TECHNO_MIN",
    bpm: 85,
    mood: "Meditative"
  },
  "aftereffects-only-trance": {
    technique: "Hybrid",
    subject: "Animals",
    intensity: "Moderate",
    color: "Cool",
    bpm: 128,
    mood: "Surreal"
  },
  "blender-only-radiant-cave": {
    technique: "3D Render",
    subject: "Landscape",
    intensity: "Meditative",
    color: "Cool",
    mood: "Meditative"
  },
  "replication-signal-v1": {
    technique: "Hand-Drawn",
    subject: "Faces",
    intensity: "Intense",
    color: "Warm",
    mood: "Energetic"
  },
  "replication-signal-v2": {
    technique: "Photography + Overlay",
    subject: "Hands",
    intensity: "Moderate",
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
