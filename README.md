# Inner Eye Signal Portfolio

High-intensity portfolio site for Quentin Thiessen's psychedelic visual practice.

## Stack

- Next.js (App Router) + TypeScript
- Framer Motion for interaction choreography
- Structured content model in `src/content/*`
- Ready for WebGL/R3F extensions if deeper shader scenes are added

## Implemented Plan Areas

- Signature identity system (`src/content/identity.ts`)
- Curated taxonomy and hero archive (`src/content/projects.ts`)
- Immersive homepage with route exits (`src/app/page.tsx`)
- Cinematic project template with process reveal (`src/app/work/[slug]/page.tsx`)
- Performance-aware rendering based on reduced-motion and low-power detection (`src/hooks/use-performance-mode.ts`)
- Real media support with graceful fallback (`src/components/project-media.tsx`)

## Project Structure

- `src/app/page.tsx` - Portal homepage (`World`, `Works`, `Experiments`, `Live`, `Contact`)
- `src/app/work/[slug]/page.tsx` - Dynamic project detail route
- `src/components/portal-background.tsx` - Animated atmosphere layer
- `src/components/project-media.tsx` - Video/poster rendering with fallback gradient
- `src/components/project-card.tsx` - Project preview card
- `src/components/process-layer-toggle.tsx` - Behind-the-scenes reveal module
- `src/content/site.ts` - Contact and social config
- `src/content/identity.ts` - Palette/texture/motion rules
- `src/content/projects.ts` - 14 curated works in 4 story categories

## Media Pipeline Guidance

1. Export hero loops as short WebM/MP4 clips (5-12 seconds).
2. Keep dimensions near 1440px wide for desktop hero use.
3. Add poster stills for each loop and lazy-load media below first viewport.
4. Use one graded master per project and derive social cuts from that master.
5. Keep loop length short to retain the ritual feel and reduce bandwidth.

## Contact Setup

1. Copy `.env.example` to `.env.local`.
2. Set `NEXT_PUBLIC_CONTACT_EMAIL` to your booking email.
3. If no email is set, the site automatically uses Instagram DM CTAs.

## Asset Naming Convention

For each project slug in `src/content/projects.ts`, add:

- Loop video: `public/media/loops/<slug>.webm` (optional `.mp4` fallback)
- Poster image: `public/media/posters/<slug>.jpg`

If media is missing, the UI falls back to the project's gradient hero.

## Development

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.
