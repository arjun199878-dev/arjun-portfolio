# Handoff: Apple-style redesign, Step 6 (cleanup)

**For:** the agent building this (Sonnet 5.5, medium effort)
**Project:** `/Users/arjuntr/Downloads/arjun` (Next.js 16.4.2, `cacheComponents: true`)
**Prerequisite:** Steps 1, 2, 2b, 3, 4 and 5 are done. The live page renders only from `src/components/site/**`, with content from `getSiteContent()`. If `src/app/(site)/page.tsx` or `src/app/(site)/layout.tsx` still imports anything from the old folders, **stop and report it**.
**Scope:** remove the old site's code, styles and leftovers so only the new site remains. **No visual or behaviour changes.** The page must look and move exactly the same before and after this step.

---

## Read first

1. `AGENTS.md`.
2. `src/app/(site)/layout.tsx`, `src/app/(site)/page.tsx`, `src/app/globals.css` and `src/styles/theme.css`.

## Hard rules

- **Before deleting anything, prove it's unused.** For every file or folder below, run `grep -rn "<path-or-export-name>" src scripts sanity.config.ts` (excluding the file itself) and confirm that nothing outside the delete list imports it. If something does, **don't delete it**; report it.
- **Untracked files need the owner's OK** (6.2). They have never been saved in git, so deleting them is permanent.
- Only delete files tracked by git without asking. They can be restored with `git restore` / `git checkout`.
- Don't touch `src/components/site/**`, `src/sanity/**`, `src/lib/content.ts`, `src/lib/format.ts`, `src/app/(site)/**`, `src/app/studio/**`, `src/app/api/**`, `scripts/**`, `docs/**`, `.claude/**`, `AGENTS.md` or `.env*`.
- Keep `framer-motion` (the new site uses it). Don't add packages.
- Don't commit. The owner reviews and commits.

---

## 6.1 Delete these tracked files and folders

**Old sections and hero:**
- `src/components/sections/` (whole folder: About, Capabilities, Contact, Hero, HowIThink, MotionLab, Performance, Placeholder, SelectedWork sections and their CSS)
- `src/components/hero/` (whole folder: HeroSection, HeroMotionStage, HeroPlaceholder, HeroTrendCanvasSvg and CSS)

**Motion Lab and the six-second engine:**
- `src/components/motion/` (whole folder, including `scenes/` with all 14 scenes and `sceneRegistry.tsx`)
- `src/lib/motion/` (whole folder: `easing.ts`, `useInViewMotion.tsx`, `useSixSecondTimeline.ts`)
- `src/lib/useSixSecondTimeline.ts` (the duplicate)

**Old case-study cards:**
- `src/components/projects/` (whole folder, including `visuals/`)

**Old layout (duplicates included):**
- `src/components/layout/` (whole folder: `Header`, `SiteHeader`, `Footer`, `SiteFooter`, `Container`, `Section`, `SectionShell` and their CSS)

**Old UI primitives (tracked ones only):**
- `src/components/ui/Button.tsx`, `Button.module.css`
- `src/components/ui/DataStatusBadge.tsx`, `.module.css`
- `src/components/ui/Eyebrow.tsx`, `.module.css`
- `src/components/ui/GlassPanel.tsx`, `.module.css`
- `src/components/ui/SceneStagePlaceholder.tsx`, `.module.css`
- `src/components/ui/TextLink.tsx`, `.module.css`
- `src/components/ui/icons.tsx`

**Old data and helpers:**
- `src/lib/portfolio-data.ts`
- `src/lib/site.ts`
- `src/lib/types.ts`
- `src/lib/cn.ts`

**Old design tokens:**
- `src/styles/tokens.css`. Also remove its `@import` line from `globals.css` (see 6.3).

## 6.2 Untracked files: ask the owner first

These were added outside git, so they can't be restored once deleted. None of them is used by the new site.

```
src/components/ui/ascii-glitch-ripple.tsx
src/components/ui/ascii-glitch-ripple-demo.tsx
src/components/ui/creepy-button.tsx
src/components/ui/creepy-button.module.css
src/components/ui/creepy-button-demo.tsx
src/components/ui/flip-text.tsx
src/components/ui/flip-text.module.css
src/components/ui/flip-text-demo.tsx
src/components/ui/stats-counter.tsx
src/components/ui/stats-counter-demo.tsx
src/lib/utils.ts
```

Before you touch them, ask the owner exactly this:

> "11 experimental files (creepy-button, flip-text, ascii-glitch-ripple, stats-counter, their demos, and lib/utils.ts) were never saved in git and aren't used. Delete them permanently, or move them to `docs/archive/ui-experiments/` so they're kept but out of the build?"

- **Delete:** delete them.
- **Archive (or no answer):** move them, keeping their file names, into `docs/archive/ui-experiments/`. Then confirm that `tsconfig.json`'s `include` doesn't type-check `docs/`. If it does (e.g. `**/*.tsx`), add `"docs"` to `exclude` so the archive can't break the build.

If `src/components/ui/` is empty after 6.1 and 6.2, remove the folder.

## 6.3 Trim `src/app/globals.css` down to the new site

The goal is a short file: a reset, base element rules using `--site-*` variables, the skip link, and the reduced-motion block.

- **Remove** the `@import "../styles/tokens.css";` line, keeping the `theme.css` import.
- **Remove these old-theme rules entirely:** `.bg-grain`, all `.custom-scrollbar*`, `.animate-marquee*` (and its `@keyframes`), `.animate-ping` (and its `@keyframes`), `.text-4xl`, `.text-lg`, `.font-mono`, `.font-bold`, `.hover\:text-white:hover`, and all `.flip-char*` rules (and their `@keyframes`).
- Keep `.tabular-nums, [data-numeric]` **only** if something under `src/components/site/**` uses those class names or the attribute. Check with grep, and otherwise remove it. The new site uses `.site-numeric` from `theme.css`.
- Keep `.visually-hidden, .sr-only` only if something still uses them; the new site uses `.site-visually-hidden`.
- **Every remaining `var(--…)` must be a `--site-*` variable** or one defined in `globals.css` itself. Replace any leftover old ones:
  - `--z-modal` → a literal `1000`
  - `--ink`, `--acid`, `--parchment` → their `--site-*` equivalents
  - old font or spacing variables → the matching `--site-*` ones
- Keep the reduced-motion block as it is.
- **Check:**
  ```bash
  grep -oE "var\(--[a-z0-9-]+" src/app/globals.css src/components/site -r | grep -v "var(--site-" | sort -u
  ```
  It should print nothing, except variables that `globals.css` or a component module defines locally (e.g. `--track` in the numbers chapter). List any you keep and why.

## 6.4 Favicon: match the new palette

`src/app/icon.svg` is currently a navy square with an orange dot. Replace its colours only (same shapes): square fill `#1D1D1F`, letter stroke `#FFFFFF`, dot fill `#0071E3`. Keep `viewBox`, size and shapes identical.

## 6.5 Dependencies

- Check `package.json`. `framer-motion`, `next`, `react`, `react-dom`, `sanity`, `next-sanity`, `@sanity/image-url` and `styled-components` must remain.
- If any other dependency is no longer imported anywhere in `src/`, `scripts/`, `sanity.config.ts` or `sanity.cli.ts`, list it in your report. **Don't uninstall it**; the owner decides.

## 6.6 README

Replace the default create-next-app `README.md` with a short project README (under 60 lines):
- **What the site is:** one line.
- **How to run it:** `npm install`, copy `.env.example` → `.env.local`, `npm run dev`.
- **Where content lives:** Sanity Studio at `/studio`; `src/lib/content.ts` is the fallback used when Sanity isn't configured.
- **How to seed Sanity:** `npx sanity login`, then `npm run seed:sanity`.
- **How live updates work:** the webhook to `/api/revalidate` with `SANITY_REVALIDATE_SECRET`.
- **Folder map:** `src/app/(site)`, `src/app/studio`, `src/app/api/revalidate`, `src/components/site`, `src/sanity`, `src/lib`, `src/styles/theme.css`, `docs/handoff`.
- **Scripts:** `dev`, `build`, `lint`, `typecheck`, `seed:sanity`.

No marketing copy and no emoji.

---

## Done when

1. These all print nothing:
   ```bash
   grep -rnE "portfolio-data|lib/site|lib/types|lib/cn|lib/motion|useSixSecondTimeline|components/(sections|hero|motion|projects|layout)|components/ui/" src scripts sanity.config.ts
   grep -rn "tokens.css" src
   ```
2. The `var(--…)` check in 6.3 prints nothing unexpected.
3. `npm run typecheck`, `npm run lint` and `npm run build` all pass.
4. **Visual no-change check:**
   - Take screenshots of the hero, numbers chapter, work, toolkit, experience, about and contact at 1440px and at 375px, **before** starting this step and again **after**. They should match.
   - Scroll through the numbers chapter once more and confirm the numbers still land exactly.
   - If your tools can't take screenshots, compare the page with `get_page_text`-style text output and check the computed `font-family` of an `h2` (must start with the Inter variable).
5. `/studio` still loads.
6. `git status` shows:
   - deletions only of the files in 6.1
   - the 6.2 files deleted or moved, as the owner chose
   - edits to `globals.css`, `icon.svg`, `README.md`, and `tsconfig.json` only if needed for the archive
   - nothing else

## Report back

- Everything deleted or moved, plus anything you **didn't** delete because it was still in use.
- The owner's answer for 6.2.
- Any unused dependencies found (not removed).
- Typecheck, lint and build output, and the result of the visual no-change check.
