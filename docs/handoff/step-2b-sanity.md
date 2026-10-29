# Handoff: Apple-style redesign, Step 2b (Sanity CMS)

**For:** the agent building this (Sonnet 5.5, medium effort)
**Project:** `/Users/arjuntr/Downloads/arjun` (Next.js 16.4.2 with `cacheComponents: true`, React 19.3, App Router)
**Prerequisite:** Steps 1 & 2 are done (`docs/handoff/steps-1-2.md`): `src/lib/content.ts` and `src/styles/theme.css` exist.
**Run before:** Steps 3–4 (`docs/handoff/steps-3-4.md`). Those sections receive their content from what you build here.

## Goal

**All site content becomes editable in Sanity**: every word, number, list, chart point, screenshot, button label and section heading, plus section order and visibility. It's edited in a Sanity Studio embedded at **`/studio`**, and published changes appear on the live site **without a redeploy**.

Colours, fonts, spacing and motion stay in code. They are **not** in Sanity.

`content.ts` stays as a **fallback**. If Sanity isn't configured yet, is unreachable, or a field is empty, the site renders from `content.ts`, so it never breaks or shows blanks.

---

## Read first

1. `AGENTS.md`. This Next.js differs from your training data.
2. `node_modules/next/dist/docs/01-app/03-api-reference/01-directives/use-cache.md`, `.../04-functions/cacheTag.md`, `.../04-functions/cacheLife.md`, `.../04-functions/revalidateTag.md`, `.../03-file-conventions/route-groups.md`, and `.../02-guides/migrating-to-cache-components.md`.
   - **Key facts:** with `cacheComponents: true`, route segment configs such as `export const dynamic = …` or `export const revalidate = …` **cause a build error**. Use `'use cache'` + `cacheTag` + `cacheLife` instead.
   - `revalidateTag` takes **two arguments**: `revalidateTag(tag, "max")`. The one-argument form is deprecated.
3. After installing, read `node_modules/next-sanity/README.md` (or its docs folder) for the current `NextStudio`, `createClient` and `parseBody` APIs. Sanity's own templates often include `export const dynamic = 'force-static'` on the Studio page. **Don't copy that line** (see above).
4. `src/lib/content.ts`, `src/app/layout.tsx` and `src/app/page.tsx`.

## Hard rules

- **Don't ask for or handle secrets in chat.** Values go in `.env.local`, which the owner fills in. Never print them. Never commit `.env.local`; check it's in `.gitignore`, and add it if not.
- **Don't create the Sanity project or log in on the owner's behalf.** The owner does the steps marked 👤. Everything else must work **before** those steps are done, using the fallback.
- **Installing packages:** if `npm install` reports peer-dependency conflicts with React 19.3 or Next 16.4, **stop and report the exact message**. Don't use `--force` or `--legacy-peer-deps` without the owner's OK.
- Don't delete old components (Step 6). Don't build the new sections (Steps 3–4).
- Don't commit.

---

## 2b.1 Packages and environment

Install: `sanity`, `next-sanity`, `@sanity/image-url`, `styled-components` (a Studio peer dependency). Use the latest versions npm resolves; report the versions installed.

`.gitignore` already contains `.env*`, which would also hide `.env.example`. Add the line `!.env.example` directly below `.env*` so the example file can be committed, while `.env.local` stays ignored.

Create **`.env.example`** (committed, values empty):

```
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_REVALIDATE_SECRET=
```

Create **`.env.local`** only if it doesn't exist, as a copy of `.env.example` with empty values. The owner fills it in.

- No read token is needed: the dataset is public-read, as is Sanity's default for `production`.
- No write token is needed: the seed script uses the owner's own login (2b.7).

## 2b.2 Route groups: separate the Studio from the site

The Studio must not get the site's nav, footer, skip link or motion provider. Restructure `src/app/`:

```
src/app/
  layout.tsx                 # ROOT: <html>, <body>, Inter font, globals.css, base metadata/viewport. Nothing else.
  icon.svg                   # unchanged
  globals.css                # unchanged
  (site)/
    layout.tsx               # skip link, <Header/> (old, for now), <main id="main-content">, <Footer/> (old), JSON-LD <script>
    page.tsx                 # moved from src/app/page.tsx, unchanged for now
  studio/
    [[...tool]]/
      page.tsx               # Sanity Studio
  api/
    revalidate/
      route.ts               # webhook → revalidateTag
```

- Move, don't rewrite. `(site)/page.tsx` keeps rendering the old sections until Steps 3–4 replace them.
- The root `layout.tsx` keeps `metadata`, `viewport` and the `Inter` setup from Step 1. Move the JSON-LD `<script>` and the skip link into `(site)/layout.tsx`. (The JSON-LD becomes data-driven in 2b.6.)
- **Studio page** (`studio/[[...tool]]/page.tsx`):
  - Render `<NextStudio config={config} />` from `next-sanity/studio`.
  - Re-export `metadata` and `viewport` from `next-sanity/studio` if the README says to.
  - **No `dynamic` export.**
  - If it needs to be a client component per the README, follow that.
- Check that `/studio` renders full-screen and isn't affected by `globals.css` body styles. If `body { display:flex }` or the font rules break the Studio layout, scope those rules to the site: add a `site` class on the `(site)` layout's wrapper and target that instead. Explain any change in your report.

## 2b.3 Sanity config files

- **`sanity.config.ts`** (project root):
  - `basePath: "/studio"`
  - `projectId` and `dataset` from `src/sanity/env.ts`
  - title "Arjun T.R — Site"
  - plugins: `structureTool({ structure })`
  - `schema: { types: schemaTypes }`
  - singleton handling: hide "create new" for `siteSettings` and `homePage`, and disable delete/duplicate for them. Use `document.actions` and `document.newDocumentOptions` (check the current API in the `sanity` package types).
- **`sanity.cli.ts`** (project root): `defineCliConfig({ api: { projectId, dataset } })`.
- **`src/sanity/env.ts`**:
  - exports `projectId`, `dataset`, `apiVersion` (use today's date `"2026-10-28"`)
  - `isSanityConfigured = Boolean(projectId)`
  - **must not throw** when the variables are missing
- **`src/sanity/client.ts`**: `createClient({ projectId, dataset, apiVersion, useCdn: true, perspective: "published" })`. Export `null` when not configured.
- **`src/sanity/image.ts`**: `urlFor(source)` using `@sanity/image-url`.
- **`next.config.ts`**: add `images.remotePatterns` for `https://cdn.sanity.io/images/**`. Keep `cacheComponents` and `partialPrefetching` as they are.

## 2b.4 Schema (`src/sanity/schemaTypes/`)

Use `defineType` / `defineField` / `defineArrayMember`. Every field gets a `title` and a short `description` written for a non-developer. Add validation as listed. Give every document type a `preview`.

### Shared object types

**`stat`**
| Field | Type | Validation | Description |
|---|---|---|---|
| `key` | slug | required | Internal id, e.g. `impressions` |
| `from` | number | optional | Starting value. Leave empty to count from 0. |
| `to` | number | required | Final value |
| `decimals` | number | 0–2, default 0 | |
| `prefix` | string | max 3 chars | e.g. `+` or `~` |
| `suffix` | string | max 3 chars | e.g. `%` or `x` |
| `label` | string | required, max 40 | |
| `context` | string | required, max 110 | One sentence: where and when |

There is **no `display` field**: the site builds it from `from`/`to`/`prefix`/`suffix` (2b.5). Preview: show the built display text plus the label.

**`resultItem`**: `value` (string, required, max 16), `label` (string, required, max 40).

**`sectionHeading`**: `eyebrow` (string, max 40), `title` (string, required, max 70).

**`seriesPoint`**: `label` (string, required, e.g. `Jan 2025`), `value` (number, required, ≥ 0).

**`caseVisual`** has a `kind` field (string, radio list: `line` | `beforeAfter` | `funnel` | `screenshot`, required) and `caption` (string, required). The other fields show only for the matching kind (`hidden: ({parent}) => parent?.kind !== "…"`):
- **line:** `series` (array of `seriesPoint`; 0 or 3–24 items), `fallbackStatKey` (string). The description says: "If there's no chart data, the site shows this headline stat as a big number instead. Use the key of one of the 4 headline stats, e.g. impressions."
- **beforeAfter:** `before`, `after` (numbers, required when this kind), `unit`, `beforeLabel`, `afterLabel` (strings).
- **funnel:** `steps` (array of strings, 2–6), `resultValue` (string, e.g. `6% → 11%`), `resultLabel` (string).
- **screenshot:** `image` (image with `hotspot: true`, required when this kind) with a required `alt` string field.

Use custom validation for the "required when this kind" rules.

### Singleton documents

**`siteSettings`** (fixed `_id: "siteSettings"`)
- **Profile:** `name`, `title`, `specialties`, `location`, `email` (email validation), `phoneDisplay`, `phoneHref`, `whatsappHref`, `linkedin` (url), `linkedinDisplay`.
- **SEO:** `seoTitle` (max 70), `seoDescription` (max 160), `ogImage` (image, optional).
- **Navigation:** `navItems`, an array of `{ section: string (list: work | experience | about | contact | toolkit | results), label: string }`, 1–6 items.
- **Sections:** `sections`, an array of `{ key: string (list: hero | results | work | toolkit | experience | about | contact), visible: boolean }`. Validation: exactly those 7 keys, each once, and `hero` first. Description: "Drag to reorder sections. Untick to hide one."
- **Labels:** an object `labels` with these string fields (all required). Defaults come from the seed (2b.7):
  `skipLink`, `heroPrimaryCta`, `heroSecondaryCta`, `resultsHeading`, `emailCta`, `whatsappLabel`, `linkedinLabel`, `formName`, `formEmail`, `formMessage`, `formSubmit`, `educationHeading`, `menuOpen`, `menuClose`.

**`homePage`** (fixed `_id: "homePage"`)
- **Hero:** `heroHeadline` (required, max 40), `heroIntro` (required, max 140).
- **Headline stats:** `headlineStats`, an array of `stat`, **exactly 4**.
- **Section headings:** `workHeading`, `toolkitHeading` and `experienceHeading` (each a `sectionHeading`), plus `aboutEyebrow` (string).
- **About:** `aboutHeadline` (string, required), `aboutParagraphs` (array of text, 1–4).
- **Contact:** `contactHeadline`, `contactIntro`, `contactReplyNote` (strings, required).
- **Summary:** `summary` (text, used for the JSON-LD description).

### Collection documents (each has `order`: number, required, used for sorting)

- **`caseStudy`:**
  - `company` (required), `period` (required), `eyebrow` (required), `headline` (required, max 60), `summary` (text, required, max 400)
  - `actions` (array of strings, 2–6)
  - `results` (array of `resultItem`, exactly 3)
  - `tools` (array of strings, tags layout)
  - `visual` (`caseVisual`, required)
  - `visible` (boolean, default true)
- **`role`:** `title`, `company`, `period`, `location` (all required); `points` (array of strings, 1–4).
- **`toolGroup`:** `title`, `summary` (required); `tools` (array of strings, tags layout).
- **`education`:** `degree`, `institution`, `period` (all required).

### Studio structure (`src/sanity/structure.ts`)

Sidebar, in this order:
1. **Site settings** (opens the `siteSettings` singleton directly)
2. **Home page** (the `homePage` singleton)
3. Divider
4. **Case studies**, **Experience**, **Toolkit**, **Education**: lists sorted by `order` ascending

## 2b.5 Types, formatting and fallback (`src/lib/`)

**`src/lib/format.ts`** (new, shared by the loader and later by the site's motion components):
- `formatValue(n, { decimals?, prefix?, suffix? })`: round to `decimals` (default 0), `toLocaleString("en-IN")`, then wrap with prefix/suffix.
- `formatStatDisplay(stat)`: if `from` is set, `${formatValue(from, {decimals, suffix})} → ${formatValue(to, {decimals, prefix, suffix})}`; otherwise `formatValue(to, {decimals, prefix, suffix})`. Use a no-break space before and after `→`.
- Results to check with a quick script or test: `impressions` → `+482%`, `conversion` → `6% → 11%`, `roas` → `~3x`, `visits` → `47 → 631`.

**`src/lib/content.ts`** (update, keeping the existing exports):
- `Stat`: rename `id` → `key`. Keep `display`, but it's now **always computed** with `formatStatDisplay`. Fix the 4 existing entries to use `key`.
- `CaseVisual`: replace with:
  ```ts
  | { kind: "line"; caption: string; series: { label: string; value: number }[] | null; fallbackStatKey: string }
  | { kind: "beforeAfter"; caption: string; before: number; after: number; unit: string; beforeLabel: string; afterLabel: string }
  | { kind: "funnel"; caption: string; steps: string[]; resultValue: string; resultLabel: string }
  | { kind: "screenshot"; caption: string; image: { url: string; alt: string; width: number; height: number } }
  ```
  - Update case 1 to `fallbackStatKey: "impressions"`.
  - Update case 2 to `resultValue: "6% → 11%", resultLabel: "Lead-to-booking conversion"`.
- Add `SectionKey = "hero" | "results" | "work" | "toolkit" | "experience" | "about" | "contact"`.
- `NavItem` becomes `{ section: SectionKey; label: string; href: string }`, where `href` = `#${section}`. Fallback: `work` "Work", `experience` "Experience", `about` "About", `contact` "Contact".
- Add `sections: { key: SectionKey; visible: boolean }[]`. Fallback: the 7 keys in the order hero, results, work, toolkit, experience, about, contact, all visible.
- Add `sectionHeadings`:
  - `work: { eyebrow: "Selected work", title: "Three results, and how they happened." }`
  - `toolkit: { eyebrow: "Toolkit", title: "What I work with." }`
  - `experience: { eyebrow: "Experience", title: "Four roles. One thread: results." }`
  - `aboutEyebrow: "About"`
- Add `labels`:
  | Key | Value |
  |---|---|
  | `skipLink` | `Skip to main content` |
  | `heroPrimaryCta` | `See the results` |
  | `heroSecondaryCta` | `Get in touch` |
  | `resultsHeading` | `Results` |
  | `emailCta` | `Email me` |
  | `whatsappLabel` | `WhatsApp` |
  | `linkedinLabel` | `LinkedIn` |
  | `formName` | `Name` |
  | `formEmail` | `Email` |
  | `formMessage` | `Message` |
  | `formSubmit` | `Send message` |
  | `educationHeading` | `Education` |
  | `menuOpen` | `Open menu` |
  | `menuClose` | `Close menu` |
- Add `seo: { title, description, ogImageUrl: string | null }`, using the Step 1 title and description and `null`.
- Add **`SiteContent`**, one type holding everything: `profile`, `navItems`, `sections`, `labels`, `seo`, `headlineStats`, `sectionHeadings`, `caseStudies`, `roles`, `toolGroups`, `education`, `about`, `contact`.
- Export **`fallbackContent: SiteContent`**, built from the existing constants.

## 2b.6 The loader: `src/sanity/getSiteContent.ts`

```ts
export async function getSiteContent(): Promise<SiteContent>
```
- First lines: `'use cache'`, then `cacheTag("sanity")`, then `cacheLife("max")` (imports from `next/cache`).
- If `!isSanityConfigured`, return `fallbackContent`.
- Otherwise run **one** GROQ query (in `src/sanity/queries.ts`) that fetches:
  - `siteSettings`
  - `homePage`
  - all `caseStudy` where `visible != false`, ordered by `order asc`
  - all `role`, `toolGroup` and `education`, ordered by `order asc`
  
  Project image fields to `{ "url": asset->url, "alt": alt, "width": asset->metadata.dimensions.width, "height": asset->metadata.dimensions.height }`.
- **Map to `SiteContent` with per-field fallback:** any missing or empty string, array or object falls back to the matching `fallbackContent` value. Specifically:
  - `headlineStats`: use Sanity's only if there are exactly 4 and each has `label`, `context` and a finite `to`. Otherwise use the fallback stats. Compute `display` with `formatStatDisplay`.
  - `sections`: use Sanity's only if it passes the same rule as the schema (7 unique keys, hero first). Otherwise use the fallback.
  - `navItems`: compute `href` from `section`.
  - Collections: if Sanity returns 0 items, use the fallback list.
- Wrap the fetch in `try/catch`. On any error, `console.error` one line and return `fallbackContent`. The site must never crash because of Sanity.
- In `(site)/layout.tsx`, change the JSON-LD and the page `metadata` to use `getSiteContent()` (`generateMetadata` in the `(site)` layout or page; check the Next 16 docs for whether `generateMetadata` works with `'use cache'` data under `cacheComponents`).

## 2b.7 Seed script: copy the current content into Sanity once

**`scripts/seed-sanity.ts`**, run by the owner with:
```bash
npx sanity exec scripts/seed-sanity.ts --with-user-token
```
- It imports `fallbackContent` and writes everything with `client.createOrReplace` (from `getCliClient()` in `sanity/cli`), using **fixed `_id`s** so re-running replaces instead of duplicating: `siteSettings`, `homePage`, `caseStudy.<id>`, `role.<id>`, `toolGroup.<id>`, `education.<n>`.
- `order` = the item's position × 10.
- Array items get a `_key` (use the stat `key` or a slug of the text).
- Skips `screenshot` images (none exist yet).
- Prints a one-line summary of the counts written.
- Add `"seed:sanity": "sanity exec scripts/seed-sanity.ts --with-user-token"` to `package.json` scripts.
- **Don't run it yourself.** It needs the owner's login.

## 2b.8 Instant updates: the webhook route

**`src/app/api/revalidate/route.ts`**, `POST` only:
- Verify the request with `parseBody(req, process.env.SANITY_REVALIDATE_SECRET)` from `next-sanity/webhook`. If the secret is missing or the signature is invalid, return 401 and revalidate nothing.
- On success: `revalidateTag("sanity", "max")` and return `{ revalidated: true }`.
- **Behaviour to note in your report:** with `"max"`, the first visit after a publish still gets the old page while the new one renders in the background, and the next visit gets the new one. That's the documented recommendation. Don't switch to `{ expire: 0 }` without asking.

---

## 👤 Owner steps (list these back in your report; don't do them)

1. Go to **sanity.io/manage**, create a free project, and choose the **production** dataset (public).
2. Copy the **Project ID** into `.env.local` → `NEXT_PUBLIC_SANITY_PROJECT_ID`.
3. In the project's **API → CORS origins**, add `http://localhost:3000` with **Allow credentials** ticked. Later, add the live site's address the same way.
4. Run `npx sanity login` in the project folder, then `npm run seed:sanity`.
5. Restart the dev server and open `http://localhost:3000/studio`. Everything should be there.
6. **When the site is live:**
   - make up a long random secret and put it in the host's environment as `SANITY_REVALIDATE_SECRET`
   - in Sanity **API → Webhooks**, add one: URL `https://<your-site>/api/revalidate`, trigger on create/update/delete, the same secret, filter `_type in ["siteSettings","homePage","caseStudy","role","toolGroup","education"]`

---

## Done when

1. `npm install` succeeded with no forced flags. Report the package versions.
2. `npm run typecheck` and `npm run lint` show no new errors.
3. **Without** a project ID in `.env.local`:
   - `http://localhost:3000` renders exactly as before (old sections, from the fallback/old data)
   - no errors in the console or server log beyond one clear "Sanity not configured, using fallback" line at most
   - `/studio` shows Sanity's "missing project ID" style message, or the Studio shell, without crashing the server
4. `formatStatDisplay` returns `+482%`, `6% → 11%`, `~3x` and `47 → 631` for the 4 fallback stats.
5. `POST /api/revalidate` with no or a wrong signature returns 401.
6. `npm run build` succeeds. This catches `cacheComponents` violations: no `dynamic`/`revalidate` exports and no uncached dynamic calls.
7. `git check-ignore .env.local` prints the path (it's ignored), and `git check-ignore .env.example` prints nothing (it isn't).
8. `git status`:
   - new: `sanity.config.ts`, `sanity.cli.ts`, `src/sanity/**`, `src/lib/format.ts`, `src/app/(site)/**`, `src/app/studio/**`, `src/app/api/revalidate/route.ts`, `scripts/seed-sanity.ts`, `.env.example`
   - modified: `src/app/layout.tsx`, `src/lib/content.ts`, `next.config.ts`, `package.json`, `package-lock.json`, maybe `.gitignore`
   - moved: `src/app/page.tsx` → `src/app/(site)/page.tsx`

## Report back

- Files created, modified and moved.
- Installed versions, and typecheck, lint and build output.
- The 👤 owner steps, copied as-is.
- Any API that differed from this note (next-sanity, Studio page, `generateMetadata` with cache), and what you did instead.
