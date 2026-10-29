# Redesign handoff notes: run order

Run each in a fresh Sonnet 5.5 (medium) session in this folder. Review the result before starting the next one.

| # | Prompt to paste | What it does |
|---|---|---|
| 1 | `Follow docs/handoff/steps-1-2.md exactly` | New colours, Inter font, light page, and the content file (`content.ts`) as the fallback |
| 2 | `Follow docs/handoff/step-2b-sanity.md exactly` | Sanity Studio at `/studio`, schema, content loader, publish → refresh route, seed script |
| — | **You:** do the 👤 owner steps listed at the end of step 2b (create the Sanity project, add the project ID, set up CORS, log in, run `npm run seed:sanity`) | Your content goes into Sanity |
| 3 | `Follow docs/handoff/steps-3-4.md exactly` | All new sections and the scroll-driven numbers chapter, reading from Sanity. If it feels rushed, run "Step 3 only" and then "Step 4 only". |
| 4 | `Follow docs/handoff/step-5.md exactly` | Motion polish: one timing file, exact number landings, dark nav over the numbers, reduced motion |
| 5 | `Follow docs/handoff/step-6-cleanup.md exactly` | Removes the old site (sections, Motion Lab, six-second engine, old styles), updates the favicon and README. **It will ask you** whether to delete or archive 11 experimental files that were never saved in git. |
| 6 | `Follow docs/handoff/step-7-final-check.md exactly` | Checks everything end to end (numbers against your resume, Sanity, motion, phones, accessibility, SEO) and writes `docs/handoff/final-check-report.md` |

**Tip:** commit after each step you're happy with. Then if a later step goes wrong, you can go back to the last good state.

Step 3 still works if you haven't finished the owner steps yet: the site falls back to `content.ts`. Only the "change it in Sanity" check gets skipped.
