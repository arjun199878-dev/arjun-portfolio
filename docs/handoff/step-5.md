# Handoff: Apple-style redesign, Step 5 (motion pass)

**For:** the agent building this (Sonnet 5.5, medium effort)
**Project:** `/Users/arjuntr/Downloads/arjun` (Next.js 16.4.2, React 19.3, `framer-motion` 14.6)
**Prerequisite:** Steps 1, 2, 2b, 3 and 4 are done (`docs/handoff/steps-1-2.md`, `docs/handoff/step-2b-sanity.md`, `docs/handoff/steps-3-4.md`). Content comes from Sanity through `getSiteContent()`. Don't hard-code any copy while polishing motion, and remember that counts of items (stats aside) can change in Sanity. The new site renders from `src/components/site/`. If it doesn't, stop and say so.
**Scope:** make the motion **consistent, smooth and correct** across the site. Steps 3–4 built each animation. This step puts all timing in one place, fixes the edge cases, and adds one finishing touch (the nav changes colour over the black numbers chapter). **No new sections, no new animations beyond what's listed here.**

---

## Read first

1. `AGENTS.md`.
2. Everything in `src/components/site/motion/` and `src/components/site/sections/{Hero,NumbersChapter,SiteNav}.tsx`.
3. `src/styles/theme.css` (motion variables: `--site-ease`, `--site-dur-fast`, `--site-dur-reveal`, `--site-reveal-distance`).

## The motion rules (the standard to check against)

1. **Motion only explains or reveals.** Text and visuals fade and rise once on entry. Numbers count to their true value. Charts draw. Nothing else moves.
2. **Scroll is the only driver after load.** Nothing loops, nothing plays on a timer after the hero intro, and there are no hover animations beyond colour changes.
3. **One feel everywhere:** the same easing curve, a small set of durations, small distances (≤ 40px), and scale changes ≤ 8%.
4. **Numbers always land exactly** on the stat's `to` value (from Sanity, or the fallback), never one digit off and never mid-count when the visitor stops.
5. **The true value is in the HTML** before any JavaScript runs.
6. **Reduced motion means no movement.** Everything is visible instantly.
7. **60fps:** only `opacity` and `transform` animate; no layout reads inside animation callbacks.

---

## 5.1 Put all timing in one file

Create **`src/components/site/motion/tokens.ts`** and move every motion constant there. Then replace every inline duration, delay, ease, distance or scale value in `src/components/site/**` with an import from it. (Steps 3–4 created `SITE_EASE` in `motion/constants.ts`. Move it here as `EASE`, update the imports, and delete `constants.ts` if it ends up empty.)

```ts
export const EASE = [0.28, 0.11, 0.32, 1] as const;       // Apple-like, matches --site-ease
export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;   // number counting only

export const DUR = {
  fast: 0.24,      // nav, menu, colour changes
  reveal: 0.8,     // fade-and-rise
  count: 1.2,      // CountUp
  grow: 1.2,       // before/after bar
  draw: 1.6,       // line chart
} as const;

export const STAGGER = {
  word: 0.08,      // hero headline words
  tile: 0.08,      // toolkit tiles
  step: 0.15,      // funnel steps
} as const;

export const DIST = {
  reveal: 30,      // px, fade-and-rise
  numberIn: 40,    // px, numbers chapter enter/exit
  word: 20,        // px, hero words
} as const;

export const VIEWPORT = { once: true, amount: 0.25 } as const;
export const COUNT_VIEWPORT = { once: true, amount: 0.6 } as const;

export const NUMBERS = {
  trackScreens: 5,          // height of the numbers chapter in screens (4 stats + run-out)
  phases: { enterEnd: 0.15, countEnd: 0.7, holdEnd: 0.85 }, // within each stat's quarter
} as const;

export const HERO = {
  scrollOutEnd: 0.7,        // fraction of hero scrolled when fully faded
  scaleTo: 0.92,
} as const;
```

**Check:** `grep -rnE "duration: ?[0-9]|delay: ?[0-9]|ease: ?\[" src/components/site` returns only lines that use these tokens. CSS modules may keep using `var(--site-ease)` / `var(--site-dur-fast)`.

## 5.2 Numbers chapter: correctness fixes

In `NumbersChapter.tsx`:

1. **Exact landing.** The value written during the hold phase must be exactly `to`. Clamp the eased progress to `[0, 1]` and, when local progress ≥ `phases.countEnd`, write `formatValue(to, …)` directly instead of computing it. Same for ≤ 0: write the start value.
2. **Correct on reload and anchor jumps.** `useMotionValueEvent` only fires on *change*. On mount, read `scrollYProgress.get()` once and run the same update function, so a visitor who reloads mid-chapter or clicks "See the results" sees the right stat and value immediately.
3. **One update function.** Use a single `useMotionValueEvent(scrollYProgress, "change", update)` that loops over the 4 stats and writes each number's `textContent`. Opacity and transforms stay as `useTransform` motion values (no React state per frame). Hold refs to the 4 number spans in an array.
4. **Progress dots** update via a ref and `classList`/`dataset`, not React state, so the chapter doesn't re-render while scrolling.
5. **Track height** comes from `NUMBERS.trackScreens` (set the track's `height` via an inline CSS variable, e.g. `style={{ "--track": NUMBERS.trackScreens }}` with `height: calc(100svh * var(--track))` in the module CSS).
6. **Sticky sanity:** confirm `getComputedStyle(document.body).overflowX === "clip"` and that no ancestor of the sticky stage has `overflow: hidden|auto|scroll` or a `transform`. If one does, fix that ancestor's style in `src/components/site/**`, not in old files.
7. **Mobile address bar:** use `100svh` (not `100vh`) for the sticky stage and track, so iOS Safari's collapsing toolbar doesn't make the stage jump.

## 5.3 Hero: smooth hand-off

1. The word-by-word intro and the scroll-out must not fight. Apply the scroll-out `scale`/`opacity` to an **outer** wrapper and the intro animation to the **inner** words, never to the same element.
2. If the page loads already scrolled (reload halfway down), skip the intro: if `window.scrollY > 0` on mount, render the words in their final state.
3. The scroll-out uses `HERO.scrollOutEnd` and `HERO.scaleTo`.
4. `transform-origin: center top` on the scroll-out wrapper, so it shrinks toward the nav rather than sliding down.

## 5.4 Nav: switch to dark over the numbers chapter (new)

Apple's nav turns dark over dark sections. Do the same:

- In `SiteNav.tsx`, use an `IntersectionObserver` on `#results` with `rootMargin: "-48px 0px -95% 0px"`, so it triggers when the chapter is directly under the nav bar. While it's intersecting, set `data-tone="dark"` on the `<header>`.
- In `SiteNav.module.css`, `[data-tone="dark"]` changes:
  - background → `rgba(0,0,0,0.72)`
  - bottom border → `rgba(255,255,255,0.08)`
  - name and link colour → `--site-text-on-dark`
  - the Contact pill stays blue
- Transition `background-color` and `color` over `var(--site-dur-fast) var(--site-ease)`.
- The mobile menu panel stays white regardless.
- Disconnect the observer on unmount.

## 5.5 Reveal and CountUp polish

1. **No flash before hydration.** Server-rendered `Reveal` content starts at `opacity: 0`. For content already in view on first paint, that's a visible flash. If an element is already in the viewport at mount, render it in its final state immediately. Apply that only to elements inside the first screen; leave the rest as they are.
2. **No double animation.** Elements inside the pinned numbers chapter must not also use `Reveal`.
3. **Background tabs:** if `document.hidden` is true when a `CountUp` triggers, write the final value instead of animating.
4. **Stagger cap:** a list's total stagger must not exceed 0.5s. With 5 toolkit tiles × 0.08 = 0.4s, that's fine; enforce `Math.min(i * STAGGER.tile, 0.5)` anyway.

## 5.6 Reduced motion: one more pass

- `MotionConfig reducedMotion="user"` turns off **transform** animations but still fades opacity. For this site, opacity fades must also be off under reduced motion. So in `Reveal`, `CountUp`, the visuals and the hero, check `useReducedMotion()` and render the final state with no motion props.
- The numbers chapter already switches to the stacked layout via CSS; confirm that the stacked numbers show final values instantly.
- Smooth anchor scrolling is already disabled under reduced motion by `globals.css`; leave it.

## 5.7 Performance check

- `will-change` only on: the 4 numbers-chapter stat wrappers and the hero scroll-out wrapper. Remove it anywhere else.
- No `getBoundingClientRect`, `offsetHeight` or other layout reads inside scroll or animation callbacks.
- No React state updates on scroll. (The menu-open state and the nav tone via `data-` attribute are fine; they change rarely.)
- If your tools allow, record a Performance trace while scrolling from the top through the numbers chapter at 1440px. Look for dropped frames or long tasks over 50ms, and report what you saw.

---

## Hard rules

- Edit only files in `src/components/site/**`, plus `src/app/globals.css` **only** if a sticky/overflow fix requires it (explain why in your report).
- Don't delete old files (that's Step 6). Don't change any text or numbers. Don't add new animations, libraries or dependencies.
- Don't commit.

## Done when

1. `npm run typecheck` and `npm run lint` pass with no new errors.
2. The grep in 5.1 shows no stray timing values.
3. **Desktop, 1440×900:**
   - Scroll slowly through the numbers chapter, stopping mid-count and mid-hold. Each stat comes to rest on exactly `+482%`, `11%`, `~3x`, `631`, and the dots match.
   - Reload while halfway through the chapter: the right stat shows with the right value, no flicker.
   - Click "See the results" in the hero: it lands on stat 1 showing its starting value.
   - The nav turns dark over the chapter and light again after it.
4. **Hero:** reload at the top and the words animate in; reload scrolled down and they appear without animating. The scroll-out shrinks it toward the top, and the two animations don't fight.
5. **Phone, 375×812:** the stacked numbers each count once. The nav works and turns dark over the numbers. There's no horizontal scroll, and the address-bar collapse doesn't make anything jump (check in a real iOS Safari if available; otherwise say it wasn't checked).
6. **Reduced motion emulated:** nothing fades, moves or counts, and all values and content are visible. If you can't emulate it, say so.
7. No console errors or hydration warnings.
8. `git status`: edits only under `src/components/site/` (and `globals.css` only if justified), plus the new `motion/tokens.ts`.

## Report back

- Files changed and why.
- The typecheck/lint output.
- What you checked and how, and what you couldn't check (real iOS Safari, reduced motion, the performance trace).
- Any value that didn't land exactly, or any jank you couldn't fix. Describe it rather than hiding it.
