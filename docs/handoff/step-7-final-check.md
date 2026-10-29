# Handoff: Apple-style redesign, Step 7 (final check)

**For:** the agent building this (Sonnet 5.5, medium effort)
**Project:** `/Users/arjuntr/Downloads/arjun`
**Prerequisite:** Steps 1–6 are done (see `docs/handoff/README.md`).
**Scope:** check the finished site end to end and write a report. **This is an inspection step.** Fix only small, clearly in-scope bugs (see "What you may fix"). Everything else goes in the report for the owner to decide.

**Output:** `docs/handoff/final-check-report.md`, with a pass/fail table plus notes (format at the end).

---

## Read first

1. `AGENTS.md` and `docs/handoff/README.md`.
2. Skim each earlier note's "Done when" section (`steps-1-2.md`, `step-2b-sanity.md`, `steps-3-4.md`, `step-5.md`, `step-6-cleanup.md`). This step re-checks the important items together.

## What you may fix

- A bug that takes **under ~20 lines** to fix, inside `src/components/site/**`, `src/sanity/**`, `src/lib/**`, `src/app/**` or `globals.css`/`theme.css`, **and** that clearly breaks something an earlier note required. For example: a number landing on the wrong value, a missing `alt`, a broken anchor, a console error, a contrast failure caused by a wrong variable.
- For every fix, record what was wrong, what you changed (file:line) and how you re-checked it.

## What you must NOT do

- Change design decisions: colours, sizes, layout or motion feel.
- Rewrite components, add features or packages.
- Change any wording or number.
- Delete files.
- Commit, push or deploy.
- **Edit content in Sanity**, except the temporary test in C2, which you must undo.

If something needs more than a small fix, describe it in the report with a suggested fix and move on.

---

## A. Build health

| # | Check | How |
|---|---|---|
| A1 | Typecheck passes | `npm run typecheck` |
| A2 | Lint passes | `npm run lint` |
| A3 | Production build passes | `npm run build`. Note any warnings, and the route list showing `/` as static or partially prerendered. |
| A4 | Production server runs | `npm run start` on a free port (not 3000 if dev is running), then load `/` and `/studio` |
| A5 | No console errors or hydration warnings | Browser console on `/`, at desktop and mobile widths |
| A6 | No leftover old code | `grep -rnE "portfolio-data\|useSixSecondTimeline\|MotionLab\|components/(sections\|hero\|motion\|projects\|layout)" src` prints nothing |

## B. Content accuracy (the most important section)

Compare what the page shows against the resume facts below. **Every number on the page must appear in this table**; anything not in it is a failure. Check the rendered page text, not the source.

| Fact | Exact value |
|---|---|
| Organic impressions growth, Clean Fanatics, 12 months | +482% |
| Organic clicks growth, same period | +167% |
| Monthly ad spend, Google + Meta | ₹10–15 lakh |
| Return on ad spend | ~3x |
| CAC reduction | 28% (shown as −28%) |
| Lead-to-booking conversion | 6% → 11% |
| Page performance score improvement | 47% |
| Alchemy Techsol social followers | 24,000 → 36,000 (+50%), 6 months |
| Alchemy brand visibility | +15%, 20+ blogs and white papers |
| BharatAgri daily organic visits | 47 → 631, 6 months |
| BharatAgri impressions | 10K → 54K |
| BharatAgri keyword position | #22 → #9 |
| Experience | 3+ years |
| Clean Fanatics | 06/2024 – Present |
| Alchemy Techsol | 10/2023 – 06/2024 |
| BharatAgri | 12/2022 – 05/2023 |
| WeDigitiz | 03/2021 – 06/2021, Chennai |
| M.Com | 06/2021 – 11/2023 |
| Diploma (NIDE) | 12/2022 – 08/2023 |
| B.Com | 08/2016 – 12/2020 |
| Email / phone | ajarjuntr@gmail.com / +91 96207 59032 |

**Checks:**
- **B1:** every number visible on the page matches this table exactly.
- **B2:** none of these appear anywhere:
  - "batch waste", "bakery", "12–18%"
  - "Live Production", "illustrative", "sample"
  - "12M" (as a period)
  - "velocity", "telemetry", "topology", "ecosystem", "autonomous", "compounding", "seamlessly"
- **B3:** each of the 4 big stats appears in the numbers chapter, and nowhere else as an animated figure. The case-study results rows may repeat them as static text.
- **B4:** view-source (or `curl -s localhost:<port>/`) contains `+482%`, `11%`, `~3x` and `631`. The true values are in the HTML before JavaScript runs.

## C. Sanity control

| # | Check | How |
|---|---|---|
| C1 | Fallback works | Temporarily rename `.env.local` → `.env.local.bak`, restart dev, and confirm the full site renders with no crash. **Rename it back afterwards.** If there is no `.env.local` with a project ID, mark C2–C4 as "skipped: Sanity not configured". |
| C2 | Edits reach the site | In `/studio`, change the hero headline to "Test headline" and untick the Toolkit section, then publish. Reload the site (restart dev if the cache holds; or, on the production server, call the revalidate route with a correctly signed request if you can, otherwise note it). Confirm both changes show. **Then undo both, publish, and confirm the site is back to normal.** |
| C3 | Studio validation | In a draft (don't publish), try 3 headline stats instead of 4, and a case study with 2 results. The Studio must show validation errors. Discard the draft. |
| C4 | Revalidate route | `curl -X POST localhost:<port>/api/revalidate` with no signature → 401. |
| C5 | Secrets safe | `git check-ignore .env.local` prints the path; `git ls-files \| grep -E "\.env"` shows only `.env.example`; and no token or secret value appears in any tracked file (`git grep -nE "sk[A-Za-z0-9]{20,}"` prints nothing). |

## D. Motion

Test at 1440×900 unless stated.

| # | Check |
|---|---|
| D1 | Hero: the words animate in on load at the top; on a reload scrolled down, they appear without animating; scrolling shrinks and fades the hero. |
| D2 | Numbers chapter pins. Stopping at any scroll point mid-count and mid-hold, each stat comes to rest on exactly its true value. Progress dots match. The page continues to Work after the 4th stat. |
| D3 | Reload halfway through the numbers chapter: the correct stat and value appear immediately. |
| D4 | The nav turns dark over the numbers chapter and light after it. |
| D5 | Case visuals: the funnel reveals in order, the before/after bar grows and counts, and any screenshot scales in. Each plays **once**. |
| D6 | Nothing loops, blinks or animates without scrolling (watch the page idle for 10 seconds at 3 different scroll positions). |
| D7 | **Reduced motion** (emulate `prefers-reduced-motion: reduce`): the numbers use the stacked layout with final values, and nothing fades, moves or counts. If you can't emulate it, mark it "not checked" and say why. |
| D8 | Smoothness: if your tools allow, record a performance trace scrolling top → bottom and report long tasks over 50ms and any visible jank. Otherwise mark it "not checked". |

## E. Layout and devices

| # | Check |
|---|---|
| E1 | 1440×900, 1024×768, 768×1024, 390×844 and 375×667: no horizontal scroll (`document.documentElement.scrollWidth === innerWidth`), no overlapping or clipped text, and the nav works. |
| E2 | Phones: the menu opens and closes, Escape closes it, links close it, and the page doesn't scroll behind it. |
| E3 | Phones: the numbers chapter is the stacked version, the funnel is vertical, and case studies are single-column with text first. |
| E4 | Browsers: Chrome and Safari at minimum; Firefox if available. Note in particular whether the numbers chapter pins in Safari and Firefox. Mark any browser you couldn't test as "not checked". |
| E5 | Page length: report the page height at 1440px and at 375px (the old site was about 28,500px on mobile). |

## F. Accessibility

| # | Check |
|---|---|
| F1 | One `h1` (the hero). `h2`s for each section, `h3`s inside them, and no skipped levels. Report the heading outline. |
| F2 | Keyboard only: Tab from the top. The skip link appears first and works. Every link, button and form field is reachable in a sensible order with a visible blue focus ring, and the menu is usable by keyboard. |
| F3 | All images have meaningful `alt` text. Decorative SVGs and dots are `aria-hidden`. |
| F4 | Contrast, by computing ratios: body text, muted text on white and on `#F5F5F7`, muted text on black, the blue button text and the link text. Body text needs ≥ 4.5:1 and large text ≥ 3:1. List the ratios. |
| F5 | The numbers chapter's pinned visual is `aria-hidden`, and the hidden list gives screen readers all 4 stats with labels and context. |
| F6 | Form: every field has a visible label, and submitting opens the email app with name, email and message filled in (check the generated `mailto:` URL rather than sending anything). |

## G. SEO and sharing

| # | Check |
|---|---|
| G1 | `<title>` and meta description match Sanity (or the fallback) and are under 70 and 160 characters. |
| G2 | Open Graph and Twitter tags are present; `og:image` is present if one is set in Sanity. |
| G3 | The JSON-LD Person data is valid JSON with the correct name, job title, email and LinkedIn. |
| G4 | `<html lang="en">` is set. The favicon is the new dark square with a blue dot. |
| G5 | Lighthouse (mobile) on the **production** server, if available: report Performance, Accessibility, Best Practices and SEO scores. **Targets:** Performance ≥ 90 and the other three ≥ 95. Note the top 3 suggestions for anything below target. Don't chase scores with design changes. |

---

## Report format: `docs/handoff/final-check-report.md`

```markdown
# Final check report — <date>

## Summary
<2–4 sentences: overall state, number of failures, anything blocking launch>

## Results
| ID | Check | Result | Notes |
|---|---|---|---|
| A1 | Typecheck | PASS / FAIL / NOT CHECKED | … |
… (every check A1–G5, in order)

## Fixes made in this step
- <what was wrong> → <file:line changed> → <how re-checked>

## Open issues (not fixed)
1. <issue> — <where> — <suggested fix> — <severity: blocks launch / should fix / nice to have>

## Not checked
- <check> — <why>

## Measurements
- Page height: desktop … px, mobile … px
- Contrast ratios: …
- Lighthouse: P … / A … / BP … / SEO …
- Packages: next …, react …, framer-motion …, sanity …, next-sanity …
```

**Be honest in the report:** mark "PASS" only for things you actually saw work. "NOT CHECKED" is fine; a false "PASS" is not.

## Done when

- `docs/handoff/final-check-report.md` exists and covers every check A1–G5.
- Any fixes are listed with file:line, and A1–A3 still pass after them.
- `.env.local` and the Sanity content are exactly as they were before this step.
- `git status` shows only the new report plus the files touched by listed fixes.
