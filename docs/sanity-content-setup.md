# Sanity Content Setup

Use this checklist after connecting project ID/dataset.

## 1. Create Site Settings document
- `siteTitle`: WHOAMIII
- `siteDescription`: Structured maximalist portfolio for commissions and process-driven artwork.
- `manifestoKicker`: Structured Maximalist Motion
- `manifestoTitle`: Composed intensity for cinematic visual worlds.
- `manifestoBody`: Add your launch manifesto text.
- `contactEmail`: studio email
- `instagramUrl`: public profile URL

## 2. Create categories
Examples:
- Music Visual
- Campaign Motion
- Immersive Installation
- Process Experiment

## 3. Create first project
- Set `status` to `published`
- Assign at least one category
- Add `coverImage`
- Add optional `coverVideo` (Cloudinary URL)
- Fill `summary`, `challenge`, `solution`, `outcome`
- Add at least one `processBlock`

## 4. Configure webhook
- URL: `https://your-domain.com/api/revalidate`
- Header: `x-revalidate-token: <REVALIDATE_SECRET>`
- Body examples:
  - `{ "type": "project", "slug": "my-project" }`
  - `{ "type": "settings" }`
