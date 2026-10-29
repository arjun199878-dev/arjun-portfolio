# Arjun T.R — portfolio site

A one-page portfolio for a digital marketing and growth specialist, built with Next.js and edited through Sanity.

## Run it

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev                  # http://localhost:7898
```

## Where content lives

- Sanity Studio at `/studio` is the place to edit text, numbers, sections and their order.
- `src/lib/content.ts` is the fallback. The site uses it when Sanity isn't configured, is unreachable, or a field is empty.
- Colours, fonts, spacing and motion timing stay in code (`src/styles/theme.css`, `src/components/site/motion/tokens.ts`).

## Seed Sanity

```bash
npx sanity login
npm run seed:sanity
```

This copies the content from `src/lib/content.ts` into the dataset. Re-running it replaces the same documents.

## Live updates

Publishing in Sanity calls the webhook at `/api/revalidate`. Set `SANITY_REVALIDATE_SECRET` on the host and use the same secret in the Sanity webhook. The webhook should fire on create, update and delete.

## Folder map

- `src/app/(site)` — the page and its layout (nav, footer, metadata)
- `src/app/studio` — the embedded Sanity Studio
- `src/app/api/revalidate` — the Sanity webhook route
- `src/components/site` — sections, visuals, motion helpers and UI
- `src/sanity` — client, schema, queries and the content loader
- `src/lib` — `content.ts` (types and fallback), `format.ts` (number formatting)
- `src/styles/theme.css` — design tokens (`--site-*`)
- `docs/handoff` — the build notes for each step
- `docs/archive` — experiments kept out of the build

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the dev server on port 7898 |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | Generate route types and run `tsc` |
| `npm run seed:sanity` | Write the fallback content into Sanity |
