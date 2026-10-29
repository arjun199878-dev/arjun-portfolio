# Handoff: Apple-style redesign, Steps 3 & 4

**For:** the agent building this (Sonnet 5.5, medium effort)
**Project:** `/Users/arjuntr/Downloads/arjun` (Next.js 16.4.2, React 19.3, App Router, CSS Modules, `framer-motion` 14.6)
**Scope:** Step 3 (building blocks) and Step 4 (page sections), then wiring them into the page.
**Prerequisite:** Steps 1, 2 and **2b** are done (`docs/handoff/steps-1-2.md`, `docs/handoff/step-2b-sanity.md`). These must exist: `src/styles/theme.css` (all `--site-*` variables), `src/lib/content.ts` (types and `fallbackContent`), `src/lib/format.ts`, `src/sanity/getSiteContent.ts`, and the `src/app/(site)/` route group. If any is missing, stop and say so.

## Content source: read this before anything else

All content is **controlled in Sanity**. Sections never import text or numbers.

- `src/app/(site)/page.tsx` and `src/app/(site)/layout.tsx` call `await getSiteContent()`, which returns a `SiteContent` object (Sanity data, with `fallbackContent` filling any gaps). They pass the slices each component needs **as props**.
- Components in `src/components/site/**` may import **types** from `@/lib/content` (`import type …`) and helpers from `@/lib/format`. They must **never** import `fallbackContent`, the content constants, or anything from `@/sanity`.
- Wherever this note quotes a literal string (a heading, button label, form label, menu label), **it is the fallback value only**. Read it from `SiteContent` (`labels.*`, `sectionHeadings.*`, `about.*`, `contact.*`, `profile.*`). The mapping is listed in each section below as *(from `…`)*.
- Sections render in the order of `content.sections`, skipping any with `visible: false`.

---

## Read first

1. `AGENTS.md`. Next.js 16 differs from your training data; check `node_modules/next/dist/docs/` before using any Next API you're unsure of. `next.config.ts` has `cacheComponents: true`, so **don't** call `new Date()`, `Math.random()` or other dynamic values in server components.
2. `src/styles/theme.css` for colours, sizes and timing, and the `SiteContent` type in `src/lib/content.ts` for the shape of the props. No hard-coded hex values, font sizes or copy in components.
3. `src/components/sections/ContactSection.tsx` (lines 1–25): reuse its `mailto:` form-submit logic.
4. framer-motion API: verify signatures in `node_modules/framer-motion/dist/index.d.ts` before use. You'll need `motion`, `MotionConfig`, `useScroll`, `useTransform`, `useMotionValueEvent`, `useInView`, `useReducedMotion` and `animate`. Import from `"framer-motion"`.

## Design intent (one paragraph)

Apple-style product page: white and soft-grey sections, near-black text, a single blue for actions, huge headlines, lots of space, and **one idea per screen**. The centrepiece is a black "numbers" chapter that stays pinned while the visitor scrolls, and **the scroll drives each real number counting to its true value**. Everywhere else, motion is quiet: things fade and rise ~30px **once** when they enter the screen. Nothing loops, blinks, glows or has play/pause controls.

## Hard rules

- **Don't delete, rename or edit any old file** under `src/components/{sections,hero,layout,projects,motion,ui}`, `src/lib/motion`, `portfolio-data.ts`, `site.ts` or `tokens.css`. They stop being rendered after this step; Step 6 removes them.
- All new code goes in **`src/components/site/`**. The only existing files you edit are `src/app/(site)/page.tsx`, `src/app/(site)/layout.tsx` and the few lines of `src/app/globals.css` listed in §4.0. Don't touch `src/sanity/**`, `src/lib/content.ts`, `src/lib/format.ts`, the root `src/app/layout.tsx` or `src/app/studio/**`.
- **Server components by default.** Add `"use client"` only to files that use hooks, motion or event handlers (marked ⚡ below).
- **Animate only `opacity` and `transform`.** No `<canvas>`, no box-shadow/blur/filter animation, no layout animations (`layout` prop).
- **The true value is always in the HTML.** Every animated number renders its final `display` text on the server; the animation only runs after hydration. Screen readers get the final value, never mid-count digits.
- **Reduced motion:** wrap the app in `<MotionConfig reducedMotion="user">`, and also follow the per-component rules below.
- **Content comes only from the `SiteContent` props** (see "Content source" above). Don't add numbers, claims, buzzwords or copy of your own. If a string you need isn't in `SiteContent`, stop and report it; don't hard-code it.
- **Don't commit.**

---

## Step 3: Building blocks

Folder layout:

```
src/components/site/
  motion/
    MotionProvider.tsx        ⚡
    Reveal.tsx                ⚡
    CountUp.tsx               ⚡
    constants.ts
  ui/
    Button.tsx + Button.module.css
    SectionHeader.tsx + SectionHeader.module.css
  visuals/
    BigNumberVisual.tsx + .module.css   ⚡ (uses CountUp)
    BeforeAfterVisual.tsx + .module.css ⚡
    FunnelVisual.tsx + .module.css      ⚡
    LineVisual.tsx + .module.css        ⚡
    ScreenshotVisual.tsx + .module.css  ⚡
    CaseVisual.tsx                      (switch on visual.kind)
  sections/
    SiteNav.tsx ⚡, Hero.tsx ⚡, NumbersChapter.tsx ⚡, Work.tsx, CaseStudy.tsx,
    Toolkit.tsx, Experience.tsx, About.tsx, Contact.tsx ⚡, SiteFooter.tsx
    (each with its own .module.css)
```

### 3.1 `MotionProvider` ⚡
- Renders `<MotionConfig reducedMotion="user" transition={{ duration: 0.8, ease: [0.28, 0.11, 0.32, 1] }}>{children}</MotionConfig>`.
- That ease array is the same curve as `--site-ease`. Export it as `export const SITE_EASE = [0.28, 0.11, 0.32, 1] as const` from `motion/constants.ts` and reuse it everywhere.

### 3.2 `Reveal` ⚡: fade and rise once
- Props: `children`, `as?: "div" | "section" | "li" | "article"` (default `div`), `delay?: number` (seconds), `className?`.
- Behaviour: `initial={{ opacity: 0, y: 30 }}`, `whileInView={{ opacity: 1, y: 0 }}`, `viewport={{ once: true, amount: 0.25 }}`, duration 0.8s, `SITE_EASE`, plus `delay`.
- If `useReducedMotion()` is true, render the plain element with no motion props (fully visible).
- For staggered lists, the parent passes `delay={index * 0.08}`.

### 3.3 Number formatting
- **Don't write a new formatter.** Import `formatValue` from `@/lib/format` (created in Step 2b). It rounds, groups with `en-IN`, and wraps with prefix/suffix: `formatValue(482,{prefix:"+",suffix:"%"})` → `+482%`.
- Each stat's ready-made text is `stat.display`, already computed by the loader.

### 3.4 `CountUp` ⚡: counts once when it enters the screen
- Props: `from?: number` (default 0), `to: number`, `decimals?`, `prefix?`, `suffix?`, `duration?: number` (default 1.2), `className?`.
- **Server render:** the final value `formatValue(to, …)`.
- On mount, if not reduced motion: set the text to `formatValue(from)`; when `useInView(ref, { once: true, amount: 0.6 })` turns true, run `animate(from, to, { duration, ease: [0.16, 1, 0.3, 1], onUpdate })`. **Write `textContent` directly** in `onUpdate` rather than setting React state each frame. The final frame must be exactly `to`.
- Markup: `<span className="site-numeric">` holding the visible animated text with `aria-hidden="true"`, next to `<span className="site-visually-hidden">{final text}</span>`.
- Reduced motion: show the final value and never animate.

### 3.5 `Button` (server)
- Props: `href`, `children`, `variant: "primary" | "link"`, `external?: boolean`.
- Renders an `<a>`; when `external`, add `target="_blank" rel="noopener noreferrer"`.
- **`primary`:** pill shape (`--site-radius-pill`), background `--site-link`, white text, padding `0.75rem 1.4rem`, `--site-fs-small` at weight 500 rising to 17px on desktop. Hover: `--site-link-hover`. Transition `background-color var(--site-dur-fast) var(--site-ease)`.
- **`link`:** no background, colour `--site-link`, with a trailing ` ›`. Hover: underline.
- **Focus (both):** `outline: 2px solid var(--site-link); outline-offset: 3px;`

### 3.6 `SectionHeader` (server)
- Props: `eyebrow?`, `title`, `intro?`, `align?: "left" | "center"` (default left), `tone?: "light" | "dark"`, `id` (for the `h2`).
- Eyebrow: `--site-fs-eyebrow`, weight 600, sentence case, colour `--site-text-muted`. **Never uppercase, no monospace, no dot or pill decoration.**
- Title `h2`: `--site-fs-h2`, weight 700, `--site-lh-heading`, `--site-tracking-heading`, max width ~16ch.
- Intro: body size, muted colour, max width ~38ch.
- Wrap the whole block in `Reveal`.

### 3.7 Visuals (inside a case study's grey tile)

Every visual sits in a tile: background `--site-bg-alt`, radius `--site-radius-tile`, padding `clamp(1.5rem, 4vw, 3rem)`, min-height ~360px on desktop, content centred. Each tile has a `<figure>` with a `<figcaption>` (= `visual.caption`, small muted text under the visual).

**`BigNumberVisual` ⚡:** the fallback when there's no chart.
- Props: `stat` string (e.g. `"+482%"`), `label`, plus count settings `to`, `prefix`, `suffix`.
- A huge `CountUp` (`--site-fs-h1`, weight 700, `--site-tracking-number`, colour `--site-text`) with the label below.

**`BeforeAfterVisual` ⚡:** for `kind: "beforeAfter"`.
- Two vertical bars side by side, bottom-aligned, fixed bar area height ~240px.
- **Before** bar: height `max(4%, before/after × 100%)`, colour `--site-line`, label `beforeLabel` and value `before` underneath.
- **After** bar: full height, colour `--site-link`, label `afterLabel` underneath, with a `CountUp from={before} to={after}` above the bar (h3 size, bold).
- Motion: on enter (`whileInView`, once), the after bar animates `scaleY` from `before/after` to 1 with `transform-origin: bottom`, 1.2s, `SITE_EASE`. Reduced motion: final state.
- Below the bars, the unit (`visits/day`) in small muted text.
- Accessibility: `role="img"` on the bar group with `aria-label` like "Daily organic visits rose from 47 to 631".

**`FunnelVisual` ⚡:** for `kind: "funnel"`.
- The `steps` laid out as a horizontal row of 4 rounded white pills (radius 14px, padding 1rem 1.25rem, `--site-fs-small`, weight 600) joined by thin `--site-line` connectors. On screens under 768px the row becomes a vertical column.
- The last step ("Booking") uses `--site-link` as background with white text.
- Motion: pills reveal left to right (`Reveal` with `delay={i * 0.15}`). Each connector grows `scaleX` 0 → 1 (`scaleY` on mobile) just before the next pill appears.
- Below the row, show `visual.resultValue` (e.g. `6% → 11%`) large and bold, with `visual.resultLabel` under it. If either is empty, leave this line out.
- The number of pills comes from `visual.steps` (2–6), so the layout must not assume 4. The **last** pill is the highlighted one.
- Use an `<ol>` for semantics.

**`LineVisual` ⚡:** for `kind: "line"`.
- **If `series` is `null`, render nothing.** `CaseVisual` falls back to `BigNumberVisual` (see 3.8).
- If `series` has data: an inline SVG line chart, `viewBox="0 0 600 300"`, scaling to its width.
  - Light gridlines (`--site-line`), x-axis labels from `series[].label`.
  - Line stroke `--site-link`, 3px, round caps.
  - A dot and a value label on the last point.
  - Motion: `motion.path` with `pathLength` 0 → 1 on enter, 1.6s, `SITE_EASE`. The last-point label fades in after.
  - Include a visually hidden `<table>` of the data.
  - The y-axis scales to the data's min and max (with 10% headroom). The point count varies (3–24), so space the points evenly and show at most ~6 x-axis labels (first, last and evenly spaced ones in between).

**`ScreenshotVisual` ⚡:** for `kind: "screenshot"`.
- `next/image` with `src={visual.image.url}`, `alt={visual.image.alt}`, and `width`/`height` from `visual.image`. `sizes="(min-width: 960px) 58vw, 100vw"`. (`cdn.sanity.io` is already allowed in `next.config.ts` by Step 2b.)
- Shown inside a minimal browser frame: a 28px top bar in `--site-line` with three 8px grey dots, radius 12px, `overflow: hidden`, and a soft shadow `0 20px 60px rgba(0,0,0,0.12)`.
- Motion: on enter, `scale` 0.92 → 1 and opacity 0 → 1, `DUR` 1s, `SITE_EASE`, once. Reduced motion: static.

### 3.8 `CaseVisual` (server)
- Props: `visual`, plus `stats` (the 4 headline stats, passed down from the page).
- `switch (visual.kind)`:
  - `"line"` → if `series` is null or empty, find the stat whose `key === visual.fallbackStatKey` and render `BigNumberVisual` with its `to`, `prefix`, `suffix`, `decimals` and `label`. If no stat matches, render nothing. Otherwise render `LineVisual`.
  - `"beforeAfter"` → `BeforeAfterVisual`.
  - `"funnel"` → `FunnelVisual`.
  - `"screenshot"` → `ScreenshotVisual`.
- If a case has no visual it can render, its `CaseStudy` falls back to a single centred text column.

---

## Step 4: Sections

### 4.0 Wiring (do this last)

**`src/app/(site)/layout.tsx`:**
- `const content = await getSiteContent();` (the call is cached, so the layout and page share one fetch).
- Replace `<Header />` → `<SiteNav profile={…} navItems={…} labels={…} />` and `<Footer />` → `<SiteFooter profile={…} labels={…} />`.
- Wrap `<main>…</main>` in `<MotionProvider>`.
- The skip link's text comes from `content.labels.skipLink`.
- Keep the JSON-LD from Step 2b.

**`src/app/(site)/page.tsx`:**
- `const content = await getSiteContent();`
- Build a map from `SectionKey` to its element: `hero` → `<Hero …/>`, `results` → `<NumbersChapter …/>`, `work` → `<Work …/>`, `toolkit` → `<Toolkit …/>`, `experience` → `<Experience …/>`, `about` → `<About …/>`, `contact` → `<Contact …/>`.
- Render `content.sections.filter(s => s.visible).map(s => map[s.key])`, each with a `key`.
- Pass each component only the props it needs.
- Remove the old section imports from this file only; leave the old files on disk.
- **Hidden section rule:** if `results` or `contact` is hidden, any button or nav link pointing to it must not render. `Hero` and `SiteNav` receive `visibleSections: SectionKey[]` and drop links whose target isn't visible.

**`src/app/globals.css`:**
- In the `html` rule: `scroll-padding-top: calc(var(--site-nav-h) + 1rem);`
- **In both the `html` and `body` rules, change `overflow-x: hidden;` → `overflow-x: clip;`.** This one is required. `hidden` turns `body` into a scroll container, which breaks `position: sticky` and `useScroll`, so the numbers chapter would never pin. `clip` still prevents sideways scrolling without that side effect. Don't touch the other `overflow` rules in the file.
- In `.skip-link`: background `--site-link`, colour `#fff`, `font-family: var(--site-font)`, radius `--site-radius-pill`.
- In `.skip-link:focus-visible`: outline colour `--site-link`.
- In the `h1, h2, h3, h4` rule: `font-family: var(--site-font); font-weight: 700; line-height: var(--site-lh-heading); letter-spacing: var(--site-tracking-heading);`. Otherwise every heading falls back to the old Syne font stack, which isn't loaded any more.
- In `::selection`: `background-color: rgba(0, 113, 227, 0.2); color: var(--site-text);`
- In `:focus-visible`: `outline: 2px solid var(--site-link); outline-offset: 3px;`

Nothing else in `globals.css`. Step 6 removes the remaining old rules.

### 4.1 `SiteNav` ⚡
- Fixed at top, full width, height `--site-nav-h`, `z-index: 100`.
- Background `rgba(255,255,255,0.72)` with `backdrop-filter: saturate(180%) blur(20px)` (plus `-webkit-` prefix), and a bottom border `1px solid rgba(0,0,0,0.08)`.
- Inside `.site-container-wide`:
  - left: `profile.name` as a link to `#top` (weight 600, 17px)
  - right: the `navItems` in their Sanity order, using each item's `label` and `href` (14px, colour `--site-text` at 80% opacity, hover 100%). The item whose `section === "contact"` is rendered as a small primary pill (height 28px, padding 0 0.9rem, 12–13px). Skip items whose section is hidden.
- **Under 768px:** hide the links and show a 44×44 menu button (two-line "hamburger" drawn in CSS, `aria-expanded`, `aria-controls`). Opening it slides down a full-width white panel (opacity + `translateY(-8px → 0)`, 240ms) with large links (24px, weight 600, 56px rows). The button's `aria-label` switches between `labels.menuOpen` and `labels.menuClose`. Close on link click, on Escape, and when the viewport grows past 768px. While it's open, set `document.documentElement.dataset.menuOpen` (globals already locks scroll via `html[data-menu-open]`).
- No logo box, no "A." monogram, no numbering, no badges.

### 4.2 `Hero` ⚡ (`id="top"` is on `<body>` already; give the section `aria-labelledby="hero-title"`)
- White, `min-height: 92svh`, content centred vertically and horizontally, centre-aligned text, top padding `calc(var(--site-nav-h) + 4rem)`.
- Content (all from `profile`):
  1. Eyebrow: `{name} · {location}`, eyebrow style, muted.
  2. `h1#hero-title` = `heroHeadline` ("Growth, measured."): `--site-fs-h1`, weight 700, `--site-tracking-heading`, `--site-lh-heading`.
  3. Paragraph = `heroIntro`: body size, muted, max 34ch, centred.
  4. Buttons, in a row with a 1.5rem gap: primary `labels.heroPrimaryCta` ("See the results") → `#results`; link `labels.heroSecondaryCta` ("Get in touch") → `#contact`. Drop a button whose target section is hidden.
- **Load motion:** split the h1 into words; each word is an inline-block `motion.span` from `{opacity:0, y:20}` to `{opacity:1, y:0}`, staggered 0.08s, 0.8s each. The eyebrow fades in first; the paragraph and buttons fade up 0.3s after the last word. Keep the full headline text in the h1 for SEO (the spans are just wrappers around each word plus a space).
- **Scroll-out motion:** `useScroll({ target: heroRef, offset: ["start start", "end start"] })`; map `scrollYProgress` 0 → 0.7 to `scale` 1 → 0.92 and `opacity` 1 → 0 on the inner content wrapper.
- Reduced motion: no word split, no scroll-out; everything static and visible.
- **No** chart, canvas, typing effect, status chips or decorative grid.

### 4.3 `NumbersChapter` ⚡: the centrepiece
`<section id="results" aria-labelledby="results-title">`, background `--site-bg-dark`, text `--site-text-on-dark`. Contains a visually hidden `<h2 id="results-title">` with `labels.resultsHeading` ("Results").

**Render two layouts and let CSS pick one** (no JS branching, so no hydration mismatch):
- `.pinned`: shown by default.
- `.stacked`: shown instead under `@media (max-width: 767px), (prefers-reduced-motion: reduce)`. In that media query, `.pinned { display: none }`; otherwise `.stacked { display: none }`.

**Pinned layout (desktop and tablet):**
- Outer track: `height: calc(100svh * 5)` (4 stats + 1 screen of run-out). Inner stage: `position: sticky; top: 0; height: 100svh;` with content centred.
- `const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start start", "end end"] })`.
- 4 stats (`headlineStats`, in order), each owning a quarter of the progress: stat *i* covers `[i/4, (i+1)/4]`. Within its quarter, with local progress `p`:
  - **0 → 0.15:** fade in: opacity 0 → 1, `y` 40 → 0, scale 0.96 → 1.
  - **0.15 → 0.70:** count: the number goes from `from ?? 0` to `to`, eased (`p'` → `1 - (1 - p')^3`). Write `textContent` via `useMotionValueEvent`, formatted with `formatValue`.
  - **0.70 → 0.85:** hold on the **exact** `to` value.
  - **0.85 → 1:** fade out: opacity → 0, `y` 0 → −40. **The last stat (i = 3) doesn't fade out.**
- All 4 stats are absolutely positioned on top of each other in the stage; only opacity decides which is visible.
- **Each stat's layout, centred:**
  - `label`: eyebrow size, weight 600, `--site-text-on-dark-muted`.
  - **The number:** `--site-fs-number`, weight 700, `--site-tracking-number`, line-height 1, `.site-numeric`, with gradient text: `background: var(--site-number-gradient); -webkit-background-clip: text; background-clip: text; color: transparent;`.
    - For stats with `from` (`conversion`, `visits`): render `formatValue(from)` and ` → ` as static text in `--site-text-on-dark-muted` at ~45% of the number's size, on the line above or to the left, and count only the `to` part in the big gradient number. The visitor reads "6% → **11%**", "47 → **631**".
  - `context`: body size, `--site-text-on-dark-muted`, max 32ch, below the number.
- **Progress dots:** 4 small dots (8px) fixed to the right edge of the stage, vertically centred, 12px apart. The active dot (`Math.min(3, Math.floor(progress * 4))`) is `--site-text-on-dark`; the others are `--site-line-dark`. `aria-hidden="true"`.
- **Accessibility:** the whole pinned visual is `aria-hidden="true"`. Before it, a visually hidden `<ul>` lists all 4 stats as `display — label. context`.
- Server render of each animated number = its final `display`/`to` value. Until hydration, stat 0 has opacity 1 and the others 0.
- `will-change: transform, opacity` only on the 4 stat wrappers.

**Stacked layout (phones and reduced motion):**
- Normal flow, padding `--site-section-space` top and bottom. Each of the 4 stats is a block with 4rem between them, left-aligned inside `.site-container`.
  - Same label / number / context styling, with the number at `clamp(4rem, 18vw, 6rem)`.
  - Use `CountUp` for the number (it already skips animation under reduced motion). For `from` stats, the same static "6% →" prefix treatment as above.
  - Each block wrapped in `Reveal`.
- This layout is real content (not `aria-hidden`), so the visually hidden `<ul>` lives inside `.pinned` only.

### 4.4 `Work` + `CaseStudy` (server; visuals are client)
- `<section id="work">`, white, vertical padding `--site-section-space`.
- `SectionHeader` *(from `sectionHeadings.work`)*: eyebrow "Selected work", title "Three results, and how they happened."
- The number of case studies comes from Sanity (it may be 1, 2, 3 or more). Alternate the visual side on every even case, not just "the 2nd".
- Then the 3 `caseStudies`, with `clamp(5rem, 10vw, 9rem)` between them.

**`CaseStudy` layout:** a 2-column grid at ≥ 960px (text 5fr, visual 7fr, gap 4rem, vertically centred). The **2nd case flips** (visual on the left), and the order resets on mobile (single column, text first). Contents:
1. Eyebrow (`eyebrow`), muted.
2. `h3` = `headline`: size `clamp(2rem, 1.5rem + 2vw, 3rem)`, weight 700, tracking-heading.
3. `summary`: body size, muted.
4. `actions` as a simple list: no bullets, each item with a top hairline (`--site-line`), padding 0.9rem 0, `--site-fs-small`, colour `--site-text`.
5. `results` as a row of 3: value at h3 size, weight 700, `.site-numeric`, colour `--site-text`; label small and muted underneath. These values are **static text, not animated**; the animation for them lives in the numbers chapter.
6. `tools` as one line of small muted text joined with ` · `.
7. Visual column: `<CaseVisual visual={…} />`.
- Wrap the text column in `Reveal` and the visual in `Reveal` with `delay={0.15}`.
- Each case is an `<article aria-labelledby>`.

### 4.5 `Toolkit` (server)
- `<section id="toolkit">`, background `--site-bg-alt`, vertical padding `--site-section-space`.
- `SectionHeader` *(from `sectionHeadings.toolkit`)*: eyebrow "Toolkit", title "What I work with."
- **Bento grid:** `display: grid; gap: 1rem;`
  - ≥ 960px: 6 columns. Tiles 1–2 (`seo`, `paid`) span 3 each; tiles 3–5 (`tracking`, `automation`, `web`) span 2 each.
  - 600–959px: 2 columns, with tile 5 spanning 2.
  - < 600px: 1 column.
- **Tile:** background `--site-bg` (white), radius `--site-radius-tile`, padding `clamp(1.5rem, 3vw, 2.25rem)`.
  - `h3` = `title` (`--site-fs-h3`, weight 700)
  - `summary` (body size, muted)
  - then `tools` as one line of `--site-fs-small` text joined with ` · `, colour `--site-text`, line-height 1.6
  - No icons, no tags or pills, no borders, no shadows.
- Tiles reveal in order: `Reveal` with `delay={i * 0.08}`.

### 4.6 `Experience` (server)
- `<section id="experience">`, white, vertical padding `--site-section-space`.
- `SectionHeader` *(from `sectionHeadings.experience`)*: eyebrow "Experience", title "Four roles. One thread: results."
- An `<ol>` of `roles`. Each `<li>` has a top hairline and padding 2rem 0, laid out as a 2-column grid at ≥ 768px (220px + 1fr).
  - Left: `period` (`--site-fs-small`, weight 600, `.site-numeric`), with `location` below in muted text.
  - Right: `h3` = `{title}` (h3 size, weight 700) with ` — {company}` in muted, then `points` as a plain list (body size, muted, 0.5rem gap, no bullets).
- Only the whole list fades in via `Reveal`; no per-row animation.

### 4.7 `About` (server)
- `<section id="about">`, background `--site-bg-alt`, vertical padding `--site-section-space`.
- 2-column grid at ≥ 960px (7fr / 5fr, gap 4rem).
  - **Left:** eyebrow *(from `sectionHeadings.aboutEyebrow`)* "About", `h2` = `about.headline` (h2 style), then `about.paragraphs` (body size, `--site-text`, 1.25rem between paragraphs).
  - **Right:** a white tile (radius `--site-radius-tile`, padding 2rem) with a heading *(from `labels.educationHeading`)* "Education" (h3) and the `education` list. Each item has the degree (weight 600), the institution (muted), and the period (`--site-fs-small`, muted, `.site-numeric`), separated by hairlines.

### 4.8 `Contact` ⚡
- `<section id="contact">`, white, vertical padding `--site-section-space`, centre-aligned.
  1. `h2` = `contact.headline` ("Let's talk."): **`--site-fs-h1`**, the biggest heading on the page after the hero.
  2. `contact.intro`: body size, muted, max 40ch, centred.
  3. Primary `Button` *(from `labels.emailCta`)* "Email me" → `mailto:{profile.email}`.
  4. A row of `link` buttons: `labels.whatsappLabel` → `whatsappHref` (external), `profile.phoneDisplay` → `phoneHref`, `labels.linkedinLabel` → `linkedin` (external). Leave out any link whose href is empty.
  5. Below that, max width 560px, left-aligned: the form with fields labelled `labels.formName`, `labels.formEmail` and `labels.formMessage` ("Name", "Email", "Message").
     - Visible labels (`--site-fs-small`, weight 600).
     - Inputs 52px tall (textarea 140px), radius 12px, border `1px solid var(--site-line)`, background white. Focus: border `--site-link` plus `box-shadow: 0 0 0 4px rgba(0,113,227,0.15)`.
     - Submit is a primary pill with `labels.formSubmit` ("Send message").
     - Submit = the same `mailto:` logic as the old `ContactSection` `handleSubmit`, but with `profile.email` and a body built from name/email/message.
     - Under the button: `contact.replyNote`, small and muted.
- Use `Reveal` on the heading block and on the form.

### 4.9 `SiteFooter` (server)
- Background `--site-bg-alt`, top hairline, padding 1.5rem 0, `--site-fs-small`, muted, inside `.site-container-wide`.
- Left: `{profile.name} · {profile.title} · {profile.location}`. Right: `profile.email` (mailto) and `labels.linkedinLabel` (external).
- They stack on mobile. **No year** (`cacheComponents` rule above).

---

## Things that must NOT appear anywhere

- Uppercase monospace labels, glowing borders, gradients other than `--site-number-gradient`, glassmorphism outside the nav, dotted grid backgrounds, emoji, "Live" badges, typing or glitch effects, auto-playing loops, play/pause/timeline controls.
- Any number, claim or piece of copy typed into a component instead of coming from `SiteContent` props. The `case-studies` "results" are static text; only the numbers chapter, `CountUp` and the visuals animate.
- Imports from old folders (`@/components/sections`, `@/components/hero`, `@/components/ui`, `@/lib/motion`, `@/lib/portfolio-data`) inside `src/components/site/**`.
- Imports of `@/sanity/**`, or value (non-type) imports of `@/lib/content`, inside `src/components/site/**`. Check with `grep -rnE "from \"@/sanity|^import \{[^}]*\} from \"@/lib/content" src/components/site` (it should print nothing).

---

## Done when

1. `npm run typecheck` and `npm run lint` pass with no **new** errors. List pre-existing ones separately; don't fix them.
2. `npm run dev` (reuse the server on :3000 if one is running) loads with **no console errors or hydration warnings**.
3. **Desktop, 1440×900:**
   - The nav is blurred and see-through.
   - The hero headline animates in word by word, then shrinks and fades as you scroll.
   - The numbers chapter pins.
   - Scroll slowly through it: each number **comes to rest on exactly** `+482%`, `11%` (after "6% →"), `~3x` and `631` (after "47 →"), and the progress dots track. After the 4th, the page scrolls on into Work.
   - The case studies alternate sides. The funnel steps reveal left to right, and the BharatAgri after-bar grows and counts 47 → 631.
4. **Tablet, 768×1024:** layout holds and the numbers chapter still pins.
5. **Phone, 375×812:**
   - The menu button opens and closes, and Escape closes it.
   - The numbers chapter is the **stacked** version, each number counting once.
   - No horizontal scroll (`document.documentElement.scrollWidth === 375`).
   - The funnel is vertical.
6. **Reduced motion** (emulate `prefers-reduced-motion: reduce` if your tools allow; if not, say it wasn't checked):
   - The stacked numbers show final values instantly.
   - Nothing fades or moves, and all content is visible.
7. With JavaScript disabled or before hydration, every final number is visible in the HTML (check view-source for `+482%`, `631`, `~3x`, `11%`).
8. In the console, `getComputedStyle(document.body).overflowX` returns `"clip"`.
9. **Sanity control check** (only if the owner has finished the Step 2b owner steps; otherwise say it was skipped): in `/studio`, change the hero headline and untick the Toolkit section, then publish. After a reload (in dev, the cache may need a server restart, or call the revalidate route), the change shows. Then undo both.
10. With **no** Sanity project ID set, the full new site still renders from the fallback content.
11. `git status`: new files only under `src/components/site/`, plus edits to `src/app/(site)/page.tsx`, `src/app/(site)/layout.tsx` and `src/app/globals.css`. Nothing deleted.

## Report back

- The list of files created and edited.
- The typecheck/lint output.
- A screenshot of each section at 1440px and 375px if your tools can take them.
- Anything you weren't sure about or couldn't verify, especially reduced motion and the exact landing values in the numbers chapter.
- If something in this note conflicts with the `SiteContent` type or the resume, **stop and ask**. Don't guess.
