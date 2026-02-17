# WHOAMIII Portfolio

Art-first, commission-focused portfolio built with Next.js, TypeScript, Sanity, and Cloudinary.

## Stack
- Next.js App Router
- Sanity CMS (`project`, `projectCategory`, `siteSettings`)
- Cloudinary-hosted video delivery
- Resend-powered inquiry email API

## Local Setup

0. Use Node `20.19.0` (repo includes `.node-version`):
```bash
fnm use
```

1. Install dependencies:
```bash
corepack npm install
```

2. Create `.env.local` from `.env.example` and fill required values.

3. Run the app:
```bash
corepack npm run dev
```

4. Open `http://localhost:3000`.

## Routes
- `/` Manifesto + featured projects
- `/work` Filterable project archive
- `/work/[slug]` Deep case-study page
- `/about`
- `/contact`
- `/api/inquiries`
- `/api/revalidate`

## Sanity Integration

Schema source lives at:
- `src/sanity/schemaTypes/project.ts`
- `src/sanity/schemaTypes/projectCategory.ts`
- `src/sanity/schemaTypes/siteSettings.ts`
- `src/sanity/schemaTypes/processBlocks.ts`

Studio config entrypoint:
- `sanity.config.ts`

Run Studio:
```bash
corepack npm run studio
```

## Revalidation Webhook

Configure your Sanity webhook to `POST /api/revalidate` with:
- JSON body containing `{ "type": "project", "slug": "your-project-slug" }` or `{ "type": "settings" }`
- `x-revalidate-token` header set to `REVALIDATE_SECRET`

## Inquiry API

`POST /api/inquiries` expects JSON:
```json
{
  "name": "...",
  "email": "...",
  "projectType": "...",
  "budget": "...",
  "timeline": "...",
  "message": "...",
  "website": ""
}
```

`website` is a honeypot and must remain empty.

## Notes
- Existing files under `public/media` are intentionally kept but not wired into runtime.
- All portfolio content should be published through Sanity.
