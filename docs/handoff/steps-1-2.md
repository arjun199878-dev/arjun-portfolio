# Handoff: Apple-style redesign, Steps 1 & 2

**For:** the agent building this (Sonnet 5.5, medium effort)
**Project:** `/Users/arjuntr/Downloads/arjun` (Next.js 16.4.2, React 19.3, App Router, CSS Modules)
**Scope:** Step 1 (foundation: font, colours, page frame) and Step 2 (single content file). **Nothing else.**

---

## Read first

1. `AGENTS.md`: this Next.js version differs from your training data. Read `node_modules/next/dist/docs/01-app/01-getting-started/13-fonts.md` and `node_modules/next/dist/docs/01-app/03-api-reference/02-components/font.md` before touching fonts.
2. `src/app/layout.tsx`, `src/app/globals.css`, `src/styles/tokens.css`, `src/lib/portfolio-data.ts`.

## Context (why)

The current site is a dark "acid editorial" theme (olive `#171914`, lime `#D8FF3E`, Syne / Space Grotesk / JetBrains Mono). It is being replaced with a light, premium, Apple-inspired design: white and soft-grey pages, near-black text, one blue for actions, and a black "numbers" chapter where the owner's real results animate on scroll. Steps 3–7 (components, sections, motion, cleanup) come later in separate handoffs.

## Hard rules

- **Do not delete or rename any existing file, component or CSS variable.** Old sections still import the old tokens and `portfolio-data.ts`. They will look wrong on the new white background after Step 1. **That is expected**; they get replaced in Step 4 and removed in Step 6.
- **Do not build any sections, components or animations.** Do not touch `src/components/**` or `src/app/page.tsx`.
- **Do not invent numbers or claims.** Every fact below comes from the owner's resume. Copy values exactly.
- Every new CSS variable starts with `--site-`, so none collide with the ~120 old tokens in `tokens.css`.
- Do not commit. Leave changes in the working tree for the owner to review.
- Leave `AGENTS.md` and `.claude/launch.json` alone.

---

## Step 1: Foundation

### 1a. Font: Inter through `next/font/google`

In `src/app/layout.tsx`:

- Import `Inter` from `next/font/google`. Use `subsets: ['latin']`, `display: 'swap'`, `variable: '--site-font-inter'`. It's a variable font, so don't pass `weight`.
- Add `inter.variable` to the `<html>` element's `className`.
- **Remove** the three `<link>` tags for `fonts.googleapis.com` / `fonts.gstatic.com` and the `eslint-disable-next-line @next/next/no-page-custom-font` comment. Keep the JSON-LD `<script>` in `<head>`.

### 1b. New theme file: `src/styles/theme.css`

Create it, and import it in `src/app/globals.css` on the line **directly after** `@import "../styles/tokens.css";`.

Define these on `:root`:

| Variable | Value | Use |
|---|---|---|
| `--site-bg` | `#FFFFFF` | Main page background |
| `--site-bg-alt` | `#F5F5F7` | Alternate sections, tiles |
| `--site-bg-dark` | `#000000` | Numbers chapter |
| `--site-text` | `#1D1D1F` | Body and headlines |
| `--site-text-muted` | `#6E6E73` | Secondary text |
| `--site-text-on-dark` | `#F5F5F7` | Text on black |
| `--site-text-on-dark-muted` | `#86868B` | Secondary text on black |
| `--site-link` | `#0071E3` | Buttons, links |
| `--site-link-hover` | `#0077ED` | Hover |
| `--site-line` | `#D2D2D7` | Hairline dividers on light |
| `--site-line-dark` | `#424245` | Hairline dividers on dark |
| `--site-number-gradient` | `linear-gradient(90deg, #2997FF 0%, #A970FF 100%)` | Big numbers on black (used with `background-clip: text`) |
| `--site-font` | `var(--site-font-inter), -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif` | Everything |

**Type scale** (fluid, use `clamp()`):

| Variable | Value | Use |
|---|---|---|
| `--site-fs-body` | `clamp(1.0625rem, 0.98rem + 0.35vw, 1.3125rem)` | 17px → 21px |
| `--site-fs-small` | `clamp(0.875rem, 0.84rem + 0.15vw, 0.9375rem)` | 14px → 15px |
| `--site-fs-eyebrow` | `clamp(1.0625rem, 1rem + 0.3vw, 1.3125rem)` | Small line above headlines (sentence case, semibold, not uppercase) |
| `--site-fs-h3` | `clamp(1.5rem, 1.3rem + 0.9vw, 2rem)` | Tile/card titles |
| `--site-fs-h2` | `clamp(2.5rem, 1.8rem + 3vw, 4rem)` | Section headlines |
| `--site-fs-h1` | `clamp(3rem, 1.8rem + 5.2vw, 6rem)` | Hero |
| `--site-fs-number` | `clamp(5rem, 2rem + 13vw, 15rem)` | Numbers chapter |

**Text styling:**

| Variable | Value |
|---|---|
| `--site-lh-body` | `1.47` |
| `--site-lh-heading` | `1.07` |
| `--site-tracking-heading` | `-0.015em` |
| `--site-tracking-number` | `-0.04em` |

**Layout:**

| Variable | Value |
|---|---|
| `--site-content` | `980px` |
| `--site-content-wide` | `1200px` |
| `--site-gutter` | `clamp(1rem, 4vw, 1.5rem)` |
| `--site-section-space` | `clamp(6rem, 4rem + 8vw, 10rem)` (vertical padding between sections) |
| `--site-radius-tile` | `28px` |
| `--site-radius-pill` | `980px` |
| `--site-nav-h` | `48px` |

**Motion** (defined now, used in Step 3):

| Variable | Value |
|---|---|
| `--site-ease` | `cubic-bezier(0.28, 0.11, 0.32, 1)` |
| `--site-dur-fast` | `240ms` |
| `--site-dur-reveal` | `800ms` |
| `--site-reveal-distance` | `30px` |

Also add these small global rules in `theme.css`:

- `.site-numeric { font-variant-numeric: tabular-nums; }` (counting digits don't jiggle)
- `.site-container { width: min(100% - 2 * var(--site-gutter), var(--site-content)); margin-inline: auto; }`
- `.site-container-wide`: same, but using `--site-content-wide`.
- `.site-visually-hidden`: the standard screen-reader-only utility.

### 1c. Switch the page frame to light

In `src/app/globals.css`, change **only** the `html` and `body` rules:

- `html`: `color-scheme: light;` and `background-color: var(--site-bg);`
- `body`: `background-color: var(--site-bg); color: var(--site-text); font-family: var(--site-font); font-size: var(--site-fs-body); line-height: var(--site-lh-body); letter-spacing: normal;`

Leave everything else in `globals.css` as it is.

### 1d. Metadata in `src/app/layout.tsx`

- `pageTitle` → `"Arjun T.R — Digital Marketing & Growth Specialist"`
- `pageDescription` → `"Digital marketer in Bengaluru with 3+ years in SEO, AEO/GEO, paid ads and marketing automation. Grew organic impressions 482% and manages ₹10–15 lakh a month in Google and Meta Ads at ~3x ROAS."`
- `viewport.themeColor` → `"#FFFFFF"`, `viewport.colorScheme` → `"light"`
- JSON-LD `jobTitle` → `"Digital Marketing & Growth Specialist — SEO, Paid Media & Marketing Automation"`
- Leave `<Header />` and `<Footer />` in place for now (replaced in Step 3).

---

## Step 2: One content file

Create **`src/lib/content.ts`**. It becomes the single source of truth for the new site. Leave `portfolio-data.ts` untouched; old sections still use it.

- Export typed, `as const` data plus the TypeScript types below.
- No React, no JSX. Plain data only.
- Copy all text exactly as given (it matches the resume). Use the en dash `–` in ranges and the arrow `→` in before/after values.

### Types

```ts
export type Stat = {
  id: string;
  /** Exact text shown when not animating, and in the HTML for SEO/screen readers */
  display: string;
  /** Animation targets. `from` omitted = count from 0 */
  from?: number;
  to: number;
  decimals?: number;
  prefix?: string;   // e.g. "+", "~"
  suffix?: string;   // e.g. "%", "x"
  label: string;     // short noun phrase
  context: string;   // one sentence: where/when
};

export type ResultItem = { value: string; label: string };

export type CaseVisual =
  | { kind: "line"; caption: string; series: { label: string; value: number }[] | null }
  | { kind: "beforeAfter"; caption: string; before: number; after: number; unit: string; beforeLabel: string; afterLabel: string }
  | { kind: "funnel"; caption: string; steps: string[] };

export type CaseStudy = {
  id: string;
  company: string;
  period: string;
  eyebrow: string;
  headline: string;
  summary: string;
  actions: string[];
  results: ResultItem[];
  tools: string[];
  visual: CaseVisual;
};

export type Role = {
  id: string;
  title: string;
  company: string;
  period: string;
  location: string;
  points: string[];
};

export type ToolGroup = { id: string; title: string; summary: string; tools: string[] };
export type Education = { degree: string; institution: string; period: string };
export type NavItem = { href: string; label: string };
```

### `profile`

| Field | Value |
|---|---|
| `name` | `Arjun T.R` |
| `title` | `Digital Marketing & Growth Specialist` |
| `specialties` | `SEO, Paid Media & Marketing Automation` |
| `location` | `Bengaluru, India` |
| `email` | `ajarjuntr@gmail.com` |
| `phoneDisplay` | `+91 96207 59032` |
| `phoneHref` | `tel:+919620759032` |
| `whatsappHref` | `https://wa.me/919620759032` |
| `linkedin` | `https://www.linkedin.com/in/arjun-tr-digital-marketing-seo-ppc` |
| `linkedinDisplay` | `linkedin.com/in/arjun-tr-digital-marketing-seo-ppc` |
| `heroHeadline` | `Growth, measured.` |
| `heroIntro` | `I grow businesses with search, paid ads and AI automation — and I track every result.` |
| `summary` | `Digital marketer with 3+ years of hands-on experience in SEO, AEO/GEO, paid ads and marketing automation. I set up conversion tracking in Google Tag Manager, GA4 and Zoho PageSense, manage Zoho CRM and WhatsApp chatbot flows, and use no-code AI tools — Claude, Codex and GoMarble AI — to build marketing dashboards, landing pages and interactive calculators without relying on developers.` |

### `navItems: NavItem[]`

`#work` "Work" · `#experience` "Experience" · `#about` "About" · `#contact` "Contact"

(The numbers chapter's anchor is `#results`; it's linked from the hero button, not the nav.)

### `headlineStats: Stat[]` (exactly 4, in this order)

| id | display | from | to | decimals | prefix | suffix | label | context |
|---|---|---|---|---|---|---|---|---|
| `impressions` | `+482%` | — | 482 | 0 | `+` | `%` | `Organic search impressions` | `In 12 months at Clean Fanatics, with clicks up 167%.` |
| `conversion` | `6% → 11%` | 6 | 11 | 0 | — | `%` | `Lead-to-booking conversion` | `After setting up a WhatsApp AI chatbot and automated follow-ups.` |
| `roas` | `~3x` | — | 3 | 0 | `~` | `x` | `Return on ad spend` | `On ₹10–15 lakh a month across Google and Meta Ads, with CAC down 28%.` |
| `visits` | `47 → 631` | 47 | 631 | 0 | — | — | `Organic visits per day` | `In 6 months at BharatAgri, with target keywords moving from position 22 to 9.` |

### `caseStudies: CaseStudy[]` (exactly 3, in this order)

**1. `clean-fanatics-seo`**
- company: `Clean Fanatics` · period: `06/2024 – Present`
- eyebrow: `Clean Fanatics · SEO & AEO`
- headline: `Impressions up 482%. In 12 months.`
- summary: `Clean Fanatics needed more people finding it through search — on Google and in AI answers. I ran on-page, off-page and technical SEO, planned content around what customers actually search for, and optimised pages for AI search results.`
- actions:
  - `On-page, off-page and technical SEO across the site`
  - `Structured content planning based on keyword research`
  - `AEO/GEO optimisation so pages surface in AI search answers`
  - `Conversion tracking set up in Google Tag Manager and GA4`
- results: `+482%` "Organic impressions" · `+167%` "Organic clicks" · `12 months` "Time frame"
- tools: `Google Search Console`, `Ahrefs`, `SEMrush`, `Sanity CMS`, `Google Tag Manager`, `GA4`
- visual: `{ kind: "line", caption: "Organic impressions, month by month", series: null }`. **`series` stays `null`.** The owner will supply real Search Console data later. Add a comment: `// TODO(owner): monthly Search Console impressions. While null, the UI shows the big number with no chart.`

**2. `clean-fanatics-funnel`**
- company: `Clean Fanatics` · period: `06/2024 – Present`
- eyebrow: `Clean Fanatics · Paid ads to bookings`
- headline: `More leads, turned into bookings.`
- summary: `I manage ₹10–15 lakh a month across Google and Meta Ads. To make that spend count, I set up and migrated a WhatsApp AI chatbot with automated follow-ups, and tracked every lead from ad click to booking in Zoho CRM.`
- actions:
  - `Google Ads (Search, Display, PMax) and Meta Ads on a ₹10–15 lakh monthly budget`
  - `GoMarble AI for campaign performance insights`
  - `WhatsApp AI chatbot set up and migrated, with automated follow-up sequences`
  - `Lead tracking through Google Tag Manager, Zoho PageSense, Zoho Forms and Zoho CRM workflows`
- results: `~3x` "Return on ad spend" · `−28%` "Customer acquisition cost" · `6% → 11%` "Lead-to-booking conversion"
- tools: `Google Ads`, `Meta Ads`, `GoMarble AI`, `WhatsApp AI chatbot`, `Zoho CRM`, `Zoho PageSense`, `Google Tag Manager`
- visual: `{ kind: "funnel", caption: "From ad click to booking", steps: ["Google & Meta Ads", "Landing page", "WhatsApp AI chatbot", "Booking"] }`

**3. `bharatagri-seo`**
- company: `BharatAgri` · period: `12/2022 – 05/2023`
- eyebrow: `BharatAgri · Technical SEO`
- headline: `From page three to page one.`
- summary: `As an SEO intern at BharatAgri, I worked through the fundamentals page by page. In six months, daily organic visits went from 47 to 631 and target keywords climbed from position 22 to position 9.`
- actions:
  - `Keyword research and meta title and description updates`
  - `H1 tags, internal linking, image alt text and URL structure checks`
  - `Canonical tags and 301 redirects`
  - `Mobile responsiveness checks`
- results: `47 → 631` "Organic visits per day" · `10K → 54K` "Search impressions" · `#22 → #9` "Target keyword position"
- tools: `Google Search Console`, `Ahrefs`, `SEMrush`, `Ubersuggest`, `GTmetrix`
- visual: `{ kind: "beforeAfter", caption: "Daily organic visits", before: 47, after: 631, unit: "visits/day", beforeLabel: "Before", afterLabel: "After 6 months" }`

### `roles: Role[]` (exactly 4, newest first)

| id | title | company | period | location | points |
|---|---|---|---|---|---|
| `clean-fanatics` | SEO & Digital Marketing Specialist | Clean Fanatics | 06/2024 – Present | Bengaluru, India | `Grew organic impressions by 482% and clicks by 167% in 12 months.` / `Manage ₹10–15 lakh a month in Google and Meta Ads at ~3x ROAS, with CAC down 28%.` / `Built dashboards, calculators and landing pages with no-code AI tools, and guided UI/UX updates that improved page performance scores by 47%.` |
| `alchemy-techsol` | Digital Marketing Executive | Alchemy Techsol | 10/2023 – 06/2024 | Bengaluru, India | `Grew organic social followers 50%, from 24,000 to 36,000 in 6 months.` / `Improved brand visibility 15% with 20+ SEO blogs and white papers.` |
| `bharatagri` | SEO Intern | BharatAgri | 12/2022 – 05/2023 | Bengaluru, India | `Grew daily organic visits from 47 to 631 in 6 months.` / `Moved target keywords from position 22 to 9.` |
| `wedigitiz` | Junior Project Coordinator (Intern) | WeDigitiz | 03/2021 – 06/2021 | Chennai, India | `Organised campaign data, updated databases and supported daily campaign follow-ups.` |

### `toolGroups: ToolGroup[]` (exactly 5, the resume's categories)

| id | title | summary | tools |
|---|---|---|---|
| `seo` | SEO & Content | `Getting found on Google and in AI answers.` | On-page & off-page SEO, Technical SEO, AEO & GEO, Keyword research, Content planning, Ahrefs, SEMrush, Ubersuggest, Google Search Console, GTmetrix |
| `paid` | Paid Media | `Spend that pays for itself.` | Google Ads (Search, Display, PMax), Meta Ads, GoMarble AI, Budget management (₹10–15L/mo), ROAS & CAC optimisation |
| `tracking` | Tracking & CRM | `Every lead, traced to its source.` | Google Tag Manager, GA4, Zoho CRM, Zoho PageSense, Zoho Forms, Marketing data preparation |
| `automation` | No-code AI & Automation | `Built without waiting on developers.` | AI marketing dashboards, Landing pages & calculators (Claude & Codex), WhatsApp AI chatbot, WhatsApp follow-up sequences |
| `web` | CMS, Web & Design | `The pages everything runs on.` | WordPress, Sanity CMS, Shopify, Website UI/UX improvements, Mail migrations, Google Workspace, Figma, Canva |

### `education: Education[]` (exactly 3)

| degree | institution | period |
|---|---|---|
| Master of Commerce (M.Com) | ASC Degree College, Bengaluru | 06/2021 – 11/2023 |
| Professional Diploma in Digital Marketing | National Institute of Digital Education (NIDE), Bengaluru | 12/2022 – 08/2023 |
| Bachelor of Commerce (B.Com) | ASC Degree College, Bengaluru | 08/2016 – 12/2020 |

### `about: { headline: string; paragraphs: string[] }`

- headline: `Where marketing meets the numbers.`
- paragraphs:
  1. `I'm a digital marketer in Bengaluru with 3+ years of hands-on work across SEO, paid ads, tracking and automation.`
  2. `I care about what happens after the click: whether a visitor becomes a lead, and whether a lead becomes a booking. That's why I set up the tracking myself, and why I build the dashboards, calculators and chatbots that close the gap.`

### `contact: { headline: string; intro: string; replyNote: string }`

- headline: `Let's talk.`
- intro: `Open to full-time growth and digital marketing roles, and to SEO, paid media and automation projects — in Bengaluru or remote.`
- replyNote: `I reply within 24 hours.`

### Things that must NOT be in `content.ts`

- "Batch waste reduction" / bakery / "~12–18%". It's not on the resume.
- "Live Production" badges, "12M", "illustrative" or sample data, or any number not listed above.
- Words: velocity, engine, telemetry, topology, ecosystem, autonomous, compounding, seamlessly.

---

## Done when

1. `npm run typecheck` and `npm run lint` both pass with no new errors. Report pre-existing errors separately; don't fix them.
2. `npm run dev` loads `http://localhost:3000` without errors. A dev server may already be running on port 3000; if so, reuse it.
3. In the browser: the page background is white, body text is near-black, and the computed `font-family` on `body` starts with the Inter variable. Old sections looking broken or dark-on-white is expected.
4. The page `<head>` no longer requests `fonts.googleapis.com`.
5. `src/lib/content.ts` exists, compiles, and nothing imports it yet.
6. `git status` shows only these changes: `src/app/layout.tsx`, `src/app/globals.css`, new `src/styles/theme.css`, new `src/lib/content.ts`.

## Report back

List the files changed, the typecheck/lint output, and anything you weren't sure about. Don't guess on content: if something here conflicts with the resume, stop and ask.
