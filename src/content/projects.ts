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
    title: "Hand + Mandala Spiral",
    oneLiner: "A signature hand study where mandala geometry unfolds into a living loop.",
    category: "ReplicaVisions",
    year: "2025",
    duration: "00:09",
    featured: true,
    toolStack: ["Blender", "AfterEffects", "AIModel", "Compositing"],
    processLayers: ["Sketch prompt frame", "Depth pass", "Chromatic pass", "Master composite"],
    vibe: ["sacred geometry", "hand study", "spiral bloom"],
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
    title: "Enlarged Eye",
    oneLiner: "Photoreal skin collides with an impossible iris expansion and surreal atmosphere.",
    category: "ReplicaVisions",
    year: "2025",
    duration: "00:06",
    featured: true,
    toolStack: ["Blender", "AfterEffects", "Compositing"],
    processLayers: ["3D eye base", "Lens warp", "Aura particles", "Contrast crush"],
    vibe: ["eye portal", "uncanny awe", "psychedelic realism"],
    heroGradient: "radial-gradient(circle at 30% 50%, #FF2DA0 0%, #140A1A 55%, #00F0D3 100%)",
    media: {
      loopSrc: "/media/loops/inner-eye.mp4",
      posterSrc: "/media/posters/inner-eye.jpg"
    }
  },
  {
    slug: "dump-dump",
    title: "Dump Dump Sequence",
    oneLiner: "A tonal collage of playful and reverent fragments across one evolving sequence.",
    category: "PureCraft",
    year: "2025",
    duration: "00:14",
    featured: false,
    toolStack: ["AfterEffects", "Compositing"],
    processLayers: ["Clip picks", "Rhythm cuts", "Grain pass", "Audio sync"],
    vibe: ["tonal range", "collage energy", "surreal humor"],
    heroGradient: "radial-gradient(circle at 50% 20%, #7A3EFF 0%, #06060B 60%, #00F0D3 100%)",
    media: {
      loopSrc: "/media/loops/dump-dump.mp4",
      posterSrc: "/media/posters/dump-dump.jpg"
    }
  },
  {
    slug: "cosmicbass-visual-teaser",
    title: "Portal Man",
    oneLiner: "A figure-centered portal study where geometry behaves like a consciousness gateway.",
    category: "ReplicaVisions",
    year: "2025",
    duration: "00:08",
    featured: true,
    toolStack: ["Blender", "AfterEffects", "SoundDesign"],
    processLayers: ["Promo typography", "Bass-reactive particles", "Trailer composite", "Output master"],
    vibe: ["portal consciousness", "figure + geometry", "cinematic pulse"],
    heroGradient: "radial-gradient(circle at 10% 15%, #00F0D3 0%, #06060B 50%, #FF2DA0 100%)",
    media: {
      loopSrc: "/media/loops/cosmicbass-visual-teaser.mp4",
      posterSrc: "/media/posters/cosmicbass-visual-teaser.jpg"
    }
  },
  {
    slug: "gausing-spatial-ritual-01",
    title: "Woman + Portal",
    oneLiner: "A balanced landscape portrait where subtle portal geometry elevates natural beauty.",
    category: "SpatialScans",
    year: "2025",
    duration: "00:12",
    featured: true,
    toolStack: ["3DScan", "Blender", "AfterEffects", "Compositing"],
    processLayers: ["Field scan", "Mesh cleanup", "Deform pass", "Atmosphere build"],
    vibe: ["landscape trance", "subtle geometry", "portal atmosphere"],
    heroGradient: "radial-gradient(circle at 70% 35%, #7A3EFF 0%, #06060B 44%, #00F0D3 100%)",
    media: {
      loopSrc: "/media/loops/gausing-spatial-ritual-01.mp4",
      posterSrc: "/media/posters/gausing-spatial-ritual-01.jpg"
    }
  },
  {
    slug: "gausing-spatial-ritual-02",
    title: "Neon Hand (Field)",
    oneLiner: "A restrained neon treatment proving minimal interventions can still feel transcendent.",
    category: "SpatialScans",
    year: "2024",
    duration: "00:10",
    featured: false,
    toolStack: ["3DScan", "Blender", "Compositing"],
    processLayers: ["Scan capture", "Topology pass", "Shadow chamber", "Grade"],
    vibe: ["minimal surrealism", "neon contour", "field presence"],
    heroGradient: "radial-gradient(circle at 20% 65%, #00F0D3 0%, #06060B 48%, #7A3EFF 100%)",
    media: {
      loopSrc: "/media/loops/gausing-spatial-ritual-02.mp4",
      posterSrc: "/media/posters/gausing-spatial-ritual-02.jpg"
    }
  },
  {
    slug: "drawn-serpent-morph",
    title: "Face with Hexagon Mesh",
    oneLiner: "Bio-digital texture crawl across portrait skin using hex mesh overlays.",
    category: "DrawingToMotion",
    year: "2024",
    duration: "00:07",
    featured: false,
    toolStack: ["AfterEffects", "AIModel", "Compositing"],
    processLayers: ["Ink source", "Rigged points", "AI in-betweens", "Luma finish"],
    vibe: ["bio-digital skin", "hex mesh", "portrait mutation"],
    heroGradient: "radial-gradient(circle at 30% 30%, #FF2DA0 0%, #06060B 46%, #7A3EFF 100%)",
    media: {
      loopSrc: "/media/loops/drawn-serpent-morph.mp4",
      posterSrc: "/media/posters/drawn-serpent-morph.jpg"
    }
  },
  {
    slug: "paper-glyph-orbit",
    title: "Eyes + Particles",
    oneLiner: "Meditative particle ambience framing gaze as a luminous focal anchor.",
    category: "DrawingToMotion",
    year: "2024",
    duration: "00:05",
    featured: false,
    toolStack: ["AfterEffects", "Blender", "AIModel"],
    processLayers: ["Glyph crop", "Vector prep", "3D orbit", "Glow balancing"],
    vibe: ["particle veil", "ambient gaze", "cinematic calm"],
    heroGradient: "radial-gradient(circle at 68% 22%, #00F0D3 0%, #111022 45%, #FF2DA0 100%)",
    media: {
      loopSrc: "/media/loops/paper-glyph-orbit.mp4",
      posterSrc: "/media/posters/paper-glyph-orbit.jpg"
    }
  },
  {
    slug: "aftereffects-only-trance",
    title: "Cosmic Cat Loop",
    oneLiner: "Magic applied to a familiar subject, turning mundane form into cosmic character.",
    category: "PureCraft",
    year: "2024",
    duration: "00:13",
    featured: true,
    toolStack: ["AfterEffects", "Compositing", "SoundDesign"],
    processLayers: ["Shape choreography", "Echo trails", "Color maps", "Sync polish"],
    vibe: ["surreal humor", "cosmic familiar", "loop charm"],
    heroGradient: "radial-gradient(circle at 52% 48%, #7A3EFF 0%, #090912 55%, #00F0D3 100%)",
    media: {
      loopSrc: "/media/loops/aftereffects-only-trance.mp4",
      posterSrc: "/media/posters/aftereffects-only-trance.jpg"
    }
  },
  {
    slug: "blender-only-radiant-cave",
    title: "Organic Form (Vein Traces)",
    oneLiner: "Pure procedural 3D study focused on organic surface networks and sculptural light.",
    category: "PureCraft",
    year: "2024",
    duration: "00:10",
    featured: false,
    toolStack: ["Blender", "Compositing"],
    processLayers: ["Geo nodes", "Material stacks", "Camera drift", "Render pass"],
    vibe: ["procedural anatomy", "vein traces", "sculptural render"],
    heroGradient: "radial-gradient(circle at 16% 48%, #00F0D3 0%, #05060D 54%, #7A3EFF 100%)",
    media: {
      loopSrc: "/media/loops/blender-only-radiant-cave.mp4",
      posterSrc: "/media/posters/blender-only-radiant-cave.jpg"
    }
  },
  {
    slug: "replication-signal-v1",
    title: "Glitchy Face Animation",
    oneLiner: "Expressionist portrait energy amplified through glitch, color, and motion distortion.",
    category: "ReplicaVisions",
    year: "2024",
    duration: "00:08",
    featured: false,
    toolStack: ["AIModel", "AfterEffects", "Compositing"],
    processLayers: ["Source moodboard", "Model run", "Temporal clean", "Color unification"],
    vibe: ["glitch portrait", "expressionist chaos", "color shock"],
    heroGradient: "radial-gradient(circle at 74% 72%, #FF2DA0 0%, #0D0A17 50%, #00F0D3 100%)",
    media: {
      loopSrc: "/media/loops/replication-signal-v1.mp4",
      posterSrc: "/media/posters/replication-signal-v1.jpg"
    }
  },
  {
    slug: "replication-signal-v2",
    title: "Hand Mandala Study II",
    oneLiner: "Second-generation hand geometry pass with tighter rhythmic motion and glow balance.",
    category: "ReplicaVisions",
    year: "2025",
    duration: "00:09",
    featured: false,
    toolStack: ["AIModel", "Blender", "AfterEffects"],
    processLayers: ["Prompt tuning", "Depth cleanup", "Lens FX", "Edit lock"],
    vibe: ["iterative craft", "mandala evolution", "rhythmic glow"],
    heroGradient: "radial-gradient(circle at 35% 18%, #7A3EFF 0%, #070710 52%, #FF2DA0 100%)",
    media: {
      loopSrc: "/media/loops/replication-signal-v2.mp4",
      posterSrc: "/media/posters/replication-signal-v2.jpg"
    }
  },
  {
    slug: "field-scan-memory-loop",
    title: "Portal Drift",
    oneLiner: "A transition-focused portal sequence exploring drift between physical and synthetic space.",
    category: "SpatialScans",
    year: "2024",
    duration: "00:07",
    featured: false,
    toolStack: ["3DScan", "AfterEffects", "Compositing"],
    processLayers: ["Scan walk", "Mesh stylization", "Pulse overlays", "Master loop"],
    vibe: ["threshold state", "spatial transition", "portal drift"],
    heroGradient: "radial-gradient(circle at 44% 67%, #00F0D3 0%, #08090F 50%, #FF2DA0 100%)",
    media: {
      loopSrc: "/media/loops/field-scan-memory-loop.mp4",
      posterSrc: "/media/posters/field-scan-memory-loop.jpg"
    }
  }
];

export const featuredProjects = projects.filter((project) => project.featured);
