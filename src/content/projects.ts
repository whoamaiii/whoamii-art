import type { Project, ProjectCategory } from "@/types/portfolio";

export const projectCategories: ProjectCategory[] = [
  "ReplicaVisions",
  "DrawingToMotion",
  "PureCraft",
  "SpatialScans"
];

export const projects: Project[] = [
  {
    slug: "everywhere-i-seem-to-look",
    title: "Everywhere I Seem To Look",
    oneLiner: "A looping stare into self-similar city hallucinations.",
    category: "ReplicaVisions",
    year: "2025",
    duration: "00:09",
    featured: true,
    toolStack: ["Blender", "AfterEffects", "AIModel", "Compositing"],
    processLayers: ["Sketch prompt frame", "Depth pass", "Chromatic pass", "Master composite"],
    vibe: ["eye motif", "urban dream", "neon fog"],
    heroGradient: "radial-gradient(circle at 18% 30%, #7A3EFF 0%, #06060B 45%, #FF2DA0 100%)",
    media: {
      loopSrc: "/media/loops/everywhere-i-seem-to-look.mp4",
      posterSrc: "/media/posters/everywhere-i-seem-to-look.jpg"
    }
  },
  {
    slug: "bringing-my-drawings-to-life",
    title: "Bringing My Drawings To Life",
    oneLiner: "Hand-drawn symbols mutate into breathing creatures.",
    category: "DrawingToMotion",
    year: "2025",
    duration: "00:11",
    featured: true,
    toolStack: ["AfterEffects", "AIModel", "Compositing"],
    processLayers: ["Original paper drawing", "Keyframe morph", "AI interpolation", "Color finish"],
    vibe: ["organic line", "ritual motion", "ink to plasma"],
    heroGradient: "radial-gradient(circle at 78% 20%, #00F0D3 0%, #0D0C16 48%, #7A3EFF 100%)",
    media: {
      loopSrc: "/media/loops/bringing-my-drawings-to-life.mp4",
      posterSrc: "/media/posters/bringing-my-drawings-to-life.jpg"
    }
  },
  {
    slug: "inner-eye",
    title: "Inner Eye",
    oneLiner: "Single-eye icon expanded into a full sensory environment.",
    category: "ReplicaVisions",
    year: "2025",
    duration: "00:06",
    featured: true,
    toolStack: ["Blender", "AfterEffects", "Compositing"],
    processLayers: ["3D eye base", "Lens warp", "Aura particles", "Contrast crush"],
    vibe: ["symbol", "focus", "trance pulse"],
    heroGradient: "radial-gradient(circle at 30% 50%, #FF2DA0 0%, #140A1A 55%, #00F0D3 100%)",
    media: {
      loopSrc: "/media/loops/inner-eye.mp4",
      posterSrc: "/media/posters/inner-eye.jpg"
    }
  },
  {
    slug: "dump-dump",
    title: "Dump Dump",
    oneLiner: "A rapid collage of unfinished visions and raw experiments.",
    category: "PureCraft",
    year: "2025",
    duration: "00:14",
    featured: false,
    toolStack: ["AfterEffects", "Compositing"],
    processLayers: ["Clip picks", "Rhythm cuts", "Grain pass", "Audio sync"],
    vibe: ["chaos", "prototype", "energy dump"],
    heroGradient: "radial-gradient(circle at 50% 20%, #7A3EFF 0%, #06060B 60%, #00F0D3 100%)",
    media: {
      loopSrc: "/media/loops/dump-dump.mp4",
      posterSrc: "/media/posters/dump-dump.jpg"
    }
  },
  {
    slug: "cosmicbass-visual-teaser",
    title: "COSMICBASS Visual Teaser",
    oneLiner: "Event promo visuals forged as a cosmic signal alarm.",
    category: "ReplicaVisions",
    year: "2025",
    duration: "00:08",
    featured: true,
    toolStack: ["Blender", "AfterEffects", "SoundDesign"],
    processLayers: ["Promo typography", "Bass-reactive particles", "Trailer composite", "Output master"],
    vibe: ["event", "bass culture", "cosmic urgency"],
    heroGradient: "radial-gradient(circle at 10% 15%, #00F0D3 0%, #06060B 50%, #FF2DA0 100%)",
    media: {
      loopSrc: "/media/loops/cosmicbass-visual-teaser.mp4",
      posterSrc: "/media/posters/cosmicbass-visual-teaser.jpg"
    }
  },
  {
    slug: "gausing-spatial-ritual-01",
    title: "Gausing Spatial Ritual 01",
    oneLiner: "3D scan fragments stretched into impossible geometry.",
    category: "SpatialScans",
    year: "2025",
    duration: "00:12",
    featured: true,
    toolStack: ["3DScan", "Blender", "AfterEffects", "Compositing"],
    processLayers: ["Field scan", "Mesh cleanup", "Deform pass", "Atmosphere build"],
    vibe: ["space fold", "material noise", "ritual architecture"],
    heroGradient: "radial-gradient(circle at 70% 35%, #7A3EFF 0%, #06060B 44%, #00F0D3 100%)",
    media: {
      loopSrc: "/media/loops/gausing-spatial-ritual-01.mp4",
      posterSrc: "/media/posters/gausing-spatial-ritual-01.jpg"
    }
  },
  {
    slug: "gausing-spatial-ritual-02",
    title: "Gausing Spatial Ritual 02",
    oneLiner: "Surface memory captured and converted to moving myth.",
    category: "SpatialScans",
    year: "2024",
    duration: "00:10",
    featured: false,
    toolStack: ["3DScan", "Blender", "Compositing"],
    processLayers: ["Scan capture", "Topology pass", "Shadow chamber", "Grade"],
    vibe: ["archaeology", "digital relic", "alien cave"],
    heroGradient: "radial-gradient(circle at 20% 65%, #00F0D3 0%, #06060B 48%, #7A3EFF 100%)",
    media: {
      loopSrc: "/media/loops/gausing-spatial-ritual-02.mp4",
      posterSrc: "/media/posters/gausing-spatial-ritual-02.jpg"
    }
  },
  {
    slug: "drawn-serpent-morph",
    title: "Drawn Serpent Morph",
    oneLiner: "A pen-drawn serpent mutates through rhythmic generations.",
    category: "DrawingToMotion",
    year: "2024",
    duration: "00:07",
    featured: false,
    toolStack: ["AfterEffects", "AIModel", "Compositing"],
    processLayers: ["Ink source", "Rigged points", "AI in-betweens", "Luma finish"],
    vibe: ["mythic", "linework", "shape-shift"],
    heroGradient: "radial-gradient(circle at 30% 30%, #FF2DA0 0%, #06060B 46%, #7A3EFF 100%)",
    media: {
      loopSrc: "/media/loops/drawn-serpent-morph.mp4",
      posterSrc: "/media/posters/drawn-serpent-morph.jpg"
    }
  },
  {
    slug: "paper-glyph-orbit",
    title: "Paper Glyph Orbit",
    oneLiner: "A notebook sigil becomes an orbital audiovisual loop.",
    category: "DrawingToMotion",
    year: "2024",
    duration: "00:05",
    featured: false,
    toolStack: ["AfterEffects", "Blender", "AIModel"],
    processLayers: ["Glyph crop", "Vector prep", "3D orbit", "Glow balancing"],
    vibe: ["symbolic", "micro cosmos", "kinetic"],
    heroGradient: "radial-gradient(circle at 68% 22%, #00F0D3 0%, #111022 45%, #FF2DA0 100%)",
    media: {
      loopSrc: "/media/loops/paper-glyph-orbit.mp4",
      posterSrc: "/media/posters/paper-glyph-orbit.jpg"
    }
  },
  {
    slug: "aftereffects-only-trance",
    title: "After Effects Only Trance",
    oneLiner: "No AI, no shortcuts, only timeline craft and rhythm.",
    category: "PureCraft",
    year: "2024",
    duration: "00:13",
    featured: true,
    toolStack: ["AfterEffects", "Compositing", "SoundDesign"],
    processLayers: ["Shape choreography", "Echo trails", "Color maps", "Sync polish"],
    vibe: ["craft-first", "manual precision", "hypnotic loop"],
    heroGradient: "radial-gradient(circle at 52% 48%, #7A3EFF 0%, #090912 55%, #00F0D3 100%)",
    media: {
      loopSrc: "/media/loops/aftereffects-only-trance.mp4",
      posterSrc: "/media/posters/aftereffects-only-trance.jpg"
    }
  },
  {
    slug: "blender-only-radiant-cave",
    title: "Blender Only Radiant Cave",
    oneLiner: "Procedural cave forms lit like synthetic bioluminescence.",
    category: "PureCraft",
    year: "2024",
    duration: "00:10",
    featured: false,
    toolStack: ["Blender", "Compositing"],
    processLayers: ["Geo nodes", "Material stacks", "Camera drift", "Render pass"],
    vibe: ["terrain", "procedural", "radiant dark"],
    heroGradient: "radial-gradient(circle at 16% 48%, #00F0D3 0%, #05060D 54%, #7A3EFF 100%)",
    media: {
      loopSrc: "/media/loops/blender-only-radiant-cave.mp4",
      posterSrc: "/media/posters/blender-only-radiant-cave.jpg"
    }
  },
  {
    slug: "replication-signal-v1",
    title: "Replication Signal V1",
    oneLiner: "Reference memories reconstructed into psychedelic replicas.",
    category: "ReplicaVisions",
    year: "2024",
    duration: "00:08",
    featured: false,
    toolStack: ["AIModel", "AfterEffects", "Compositing"],
    processLayers: ["Source moodboard", "Model run", "Temporal clean", "Color unification"],
    vibe: ["replication", "dream archive", "visual echo"],
    heroGradient: "radial-gradient(circle at 74% 72%, #FF2DA0 0%, #0D0A17 50%, #00F0D3 100%)",
    media: {
      loopSrc: "/media/loops/replication-signal-v1.mp4",
      posterSrc: "/media/posters/replication-signal-v1.jpg"
    }
  },
  {
    slug: "replication-signal-v2",
    title: "Replication Signal V2",
    oneLiner: "A sharper second pass focused on eye-led transitions.",
    category: "ReplicaVisions",
    year: "2025",
    duration: "00:09",
    featured: false,
    toolStack: ["AIModel", "Blender", "AfterEffects"],
    processLayers: ["Prompt tuning", "Depth cleanup", "Lens FX", "Edit lock"],
    vibe: ["continuation", "eye trails", "dense glow"],
    heroGradient: "radial-gradient(circle at 35% 18%, #7A3EFF 0%, #070710 52%, #FF2DA0 100%)",
    media: {
      loopSrc: "/media/loops/replication-signal-v2.mp4",
      posterSrc: "/media/posters/replication-signal-v2.jpg"
    }
  },
  {
    slug: "field-scan-memory-loop",
    title: "Field Scan Memory Loop",
    oneLiner: "Real locations remixed into looping memory tunnels.",
    category: "SpatialScans",
    year: "2024",
    duration: "00:07",
    featured: false,
    toolStack: ["3DScan", "AfterEffects", "Compositing"],
    processLayers: ["Scan walk", "Mesh stylization", "Pulse overlays", "Master loop"],
    vibe: ["memory", "place distortion", "temporal fold"],
    heroGradient: "radial-gradient(circle at 44% 67%, #00F0D3 0%, #08090F 50%, #FF2DA0 100%)",
    media: {
      loopSrc: "/media/loops/field-scan-memory-loop.mp4",
      posterSrc: "/media/posters/field-scan-memory-loop.jpg"
    }
  }
];

export const featuredProjects = projects.filter((project) => project.featured);
