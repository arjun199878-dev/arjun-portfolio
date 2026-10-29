import { formatStatDisplay } from "./format";

export type Stat = {
  key: string;
  /** Exact text shown when not animating, and in the HTML for SEO/screen readers */
  display: string;
  /** Animation targets. `from` omitted = count from 0 */
  from?: number;
  to: number;
  decimals?: number;
  prefix?: string; // e.g. "+", "~"
  suffix?: string; // e.g. "%", "x"
  label: string; // short noun phrase
  context: string; // one sentence: where/when
};

export type ResultItem = { value: string; label: string };

export type CaseVisual =
  | { kind: "line"; caption: string; series: { label: string; value: number }[] | null; fallbackStatKey: string }
  | { kind: "beforeAfter"; caption: string; before: number; after: number; unit: string; beforeLabel: string; afterLabel: string }
  | { kind: "funnel"; caption: string; steps: string[]; resultValue: string; resultLabel: string }
  | { kind: "screenshot"; caption: string; image: { url: string; alt: string; width: number; height: number } };

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
export type SectionKey = "hero" | "results" | "work" | "toolkit" | "experience" | "about" | "contact";
export type NavItem = { section: SectionKey; label: string; href: string };

export const profile = {
  name: "Arjun T.R",
  title: "Digital Marketing & Growth Specialist",
  specialties: "SEO, Paid Media & Marketing Automation",
  location: "Bengaluru, India",
  email: "ajarjuntr@gmail.com",
  phoneDisplay: "+91 96207 59032",
  phoneHref: "tel:+919620759032",
  whatsappHref: "https://wa.me/919620759032",
  linkedin: "https://www.linkedin.com/in/arjun-tr-digital-marketing-seo-ppc",
  linkedinDisplay: "linkedin.com/in/arjun-tr-digital-marketing-seo-ppc",
  heroHeadline: "Growth, measured.",
  heroIntro:
    "I grow businesses with search, paid ads and AI automation — and I track every result.",
  summary:
    "Digital marketer with 3+ years of hands-on experience in SEO, AEO/GEO, paid ads and marketing automation. I set up conversion tracking in Google Tag Manager, GA4 and Zoho PageSense, manage Zoho CRM and WhatsApp chatbot flows, and use no-code AI tools — Claude, Codex and GoMarble AI — to build marketing dashboards, landing pages and interactive calculators without relying on developers.",
} as const;

export const navItems: readonly NavItem[] = [
  { section: "work", label: "Work", href: "#work" },
  { section: "experience", label: "Experience", href: "#experience" },
  { section: "about", label: "About", href: "#about" },
  { section: "contact", label: "Contact", href: "#contact" },
];

const rawHeadlineStats: readonly Omit<Stat, "display">[] = [
  {
    key: "impressions",
    to: 482,
    decimals: 0,
    prefix: "+",
    suffix: "%",
    label: "Organic search impressions",
    context: "In 12 months at Clean Fanatics, with clicks up 167%.",
  },
  {
    key: "conversion",
    from: 6,
    to: 11,
    decimals: 0,
    suffix: "%",
    label: "Lead-to-booking conversion",
    context: "After setting up a WhatsApp AI chatbot and automated follow-ups.",
  },
  {
    key: "roas",
    to: 3,
    decimals: 0,
    prefix: "~",
    suffix: "x",
    label: "Return on ad spend",
    context: "On ₹10–15 lakh a month across Google and Meta Ads, with CAC down 28%.",
  },
  {
    key: "visits",
    from: 47,
    to: 631,
    decimals: 0,
    label: "Organic visits per day",
    context: "In 6 months at BharatAgri, with target keywords moving from position 22 to 9.",
  },
];

export const headlineStats: readonly Stat[] = rawHeadlineStats.map((stat) => ({
  ...stat,
  display: formatStatDisplay(stat),
}));

export const caseStudies: readonly CaseStudy[] = [
  {
    id: "clean-fanatics-seo",
    company: "Clean Fanatics",
    period: "06/2024 – Present",
    eyebrow: "Clean Fanatics · SEO & AEO",
    headline: "Impressions up 482%. In 12 months.",
    summary:
      "Clean Fanatics needed more people finding it through search — on Google and in AI answers. I ran on-page, off-page and technical SEO, planned content around what customers actually search for, and optimised pages for AI search results.",
    actions: [
      "On-page, off-page and technical SEO across the site",
      "Structured content planning based on keyword research",
      "AEO/GEO optimisation so pages surface in AI search answers",
      "Conversion tracking set up in Google Tag Manager and GA4",
    ],
    results: [
      { value: "+482%", label: "Organic impressions" },
      { value: "+167%", label: "Organic clicks" },
      { value: "12 months", label: "Time frame" },
    ],
    tools: [
      "Google Search Console",
      "Ahrefs",
      "SEMrush",
      "Sanity CMS",
      "Google Tag Manager",
      "GA4",
    ],
    // TODO(owner): monthly Search Console impressions. While null, the UI shows the big number with no chart.
    visual: {
      kind: "line",
      caption: "Organic impressions, month by month",
      series: null,
      fallbackStatKey: "impressions",
    },
  },
  {
    id: "clean-fanatics-funnel",
    company: "Clean Fanatics",
    period: "06/2024 – Present",
    eyebrow: "Clean Fanatics · Paid ads to bookings",
    headline: "More leads, turned into bookings.",
    summary:
      "I manage ₹10–15 lakh a month across Google and Meta Ads. To make that spend count, I set up and migrated a WhatsApp AI chatbot with automated follow-ups, and tracked every lead from ad click to booking in Zoho CRM.",
    actions: [
      "Google Ads (Search, Display, PMax) and Meta Ads on a ₹10–15 lakh monthly budget",
      "GoMarble AI for campaign performance insights",
      "WhatsApp AI chatbot set up and migrated, with automated follow-up sequences",
      "Lead tracking through Google Tag Manager, Zoho PageSense, Zoho Forms and Zoho CRM workflows",
    ],
    results: [
      { value: "~3x", label: "Return on ad spend" },
      { value: "−28%", label: "Customer acquisition cost" },
      { value: "6% → 11%", label: "Lead-to-booking conversion" },
    ],
    tools: [
      "Google Ads",
      "Meta Ads",
      "GoMarble AI",
      "WhatsApp AI chatbot",
      "Zoho CRM",
      "Zoho PageSense",
      "Google Tag Manager",
    ],
    visual: {
      kind: "funnel",
      caption: "From ad click to booking",
      steps: ["Google & Meta Ads", "Landing page", "WhatsApp AI chatbot", "Booking"],
      resultValue: "6% → 11%",
      resultLabel: "Lead-to-booking conversion",
    },
  },
  {
    id: "bharatagri-seo",
    company: "BharatAgri",
    period: "12/2022 – 05/2023",
    eyebrow: "BharatAgri · Technical SEO",
    headline: "From page three to page one.",
    summary:
      "As an SEO intern at BharatAgri, I worked through the fundamentals page by page. In six months, daily organic visits went from 47 to 631 and target keywords climbed from position 22 to position 9.",
    actions: [
      "Keyword research and meta title and description updates",
      "H1 tags, internal linking, image alt text and URL structure checks",
      "Canonical tags and 301 redirects",
      "Mobile responsiveness checks",
    ],
    results: [
      { value: "47 → 631", label: "Organic visits per day" },
      { value: "10K → 54K", label: "Search impressions" },
      { value: "#22 → #9", label: "Target keyword position" },
    ],
    tools: ["Google Search Console", "Ahrefs", "SEMrush", "Ubersuggest", "GTmetrix"],
    visual: {
      kind: "beforeAfter",
      caption: "Daily organic visits",
      before: 47,
      after: 631,
      unit: "visits/day",
      beforeLabel: "Before",
      afterLabel: "After 6 months",
    },
  },
] as const;

export const roles: readonly Role[] = [
  {
    id: "clean-fanatics",
    title: "SEO & Digital Marketing Specialist",
    company: "Clean Fanatics",
    period: "06/2024 – Present",
    location: "Bengaluru, India",
    points: [
      "Grew organic impressions by 482% and clicks by 167% in 12 months.",
      "Manage ₹10–15 lakh a month in Google and Meta Ads at ~3x ROAS, with CAC down 28%.",
      "Built dashboards, calculators and landing pages with no-code AI tools, and guided UI/UX updates that improved page performance scores by 47%.",
    ],
  },
  {
    id: "alchemy-techsol",
    title: "Digital Marketing Executive",
    company: "Alchemy Techsol",
    period: "10/2023 – 06/2024",
    location: "Bengaluru, India",
    points: [
      "Grew organic social followers 50%, from 24,000 to 36,000 in 6 months.",
      "Improved brand visibility 15% with 20+ SEO blogs and white papers.",
    ],
  },
  {
    id: "bharatagri",
    title: "SEO Intern",
    company: "BharatAgri",
    period: "12/2022 – 05/2023",
    location: "Bengaluru, India",
    points: [
      "Grew daily organic visits from 47 to 631 in 6 months.",
      "Moved target keywords from position 22 to 9.",
    ],
  },
  {
    id: "wedigitiz",
    title: "Junior Project Coordinator (Intern)",
    company: "WeDigitiz",
    period: "03/2021 – 06/2021",
    location: "Chennai, India",
    points: [
      "Organised campaign data, updated databases and supported daily campaign follow-ups.",
    ],
  },
] as const;

export const toolGroups: readonly ToolGroup[] = [
  {
    id: "seo",
    title: "SEO & Content",
    summary: "Getting found on Google and in AI answers.",
    tools: [
      "On-page & off-page SEO",
      "Technical SEO",
      "AEO & GEO",
      "Keyword research",
      "Content planning",
      "Ahrefs",
      "SEMrush",
      "Ubersuggest",
      "Google Search Console",
      "GTmetrix",
    ],
  },
  {
    id: "paid",
    title: "Paid Media",
    summary: "Spend that pays for itself.",
    tools: [
      "Google Ads (Search, Display, PMax)",
      "Meta Ads",
      "GoMarble AI",
      "Budget management (₹10–15L/mo)",
      "ROAS & CAC optimisation",
    ],
  },
  {
    id: "tracking",
    title: "Tracking & CRM",
    summary: "Every lead, traced to its source.",
    tools: [
      "Google Tag Manager",
      "GA4",
      "Zoho CRM",
      "Zoho PageSense",
      "Zoho Forms",
      "Marketing data preparation",
    ],
  },
  {
    id: "automation",
    title: "No-code AI & Automation",
    summary: "Built without waiting on developers.",
    tools: [
      "AI marketing dashboards",
      "Landing pages & calculators (Claude & Codex)",
      "WhatsApp AI chatbot",
      "WhatsApp follow-up sequences",
    ],
  },
  {
    id: "web",
    title: "CMS, Web & Design",
    summary: "The pages everything runs on.",
    tools: [
      "WordPress",
      "Sanity CMS",
      "Shopify",
      "Website UI/UX improvements",
      "Mail migrations",
      "Google Workspace",
      "Figma",
      "Canva",
    ],
  },
] as const;

export const education: readonly Education[] = [
  {
    degree: "Master of Commerce (M.Com)",
    institution: "ASC Degree College, Bengaluru",
    period: "06/2021 – 11/2023",
  },
  {
    degree: "Professional Diploma in Digital Marketing",
    institution: "National Institute of Digital Education (NIDE), Bengaluru",
    period: "12/2022 – 08/2023",
  },
  {
    degree: "Bachelor of Commerce (B.Com)",
    institution: "ASC Degree College, Bengaluru",
    period: "08/2016 – 12/2020",
  },
] as const;

export const about: { headline: string; paragraphs: string[] } = {
  headline: "Where marketing meets the numbers.",
  paragraphs: [
    "I'm a digital marketer in Bengaluru with 3+ years of hands-on work across SEO, paid ads, tracking and automation.",
    "I care about what happens after the click: whether a visitor becomes a lead, and whether a lead becomes a booking. That's why I set up the tracking myself, and why I build the dashboards, calculators and chatbots that close the gap.",
  ],
};

export const contact: { headline: string; intro: string; replyNote: string } = {
  headline: "Let's talk.",
  intro:
    "Open to full-time growth and digital marketing roles, and to SEO, paid media and automation projects — in Bengaluru or remote.",
  replyNote: "I reply within 24 hours.",
};

/** Order the sections render in, and whether each is shown. */
export const sections: readonly { key: SectionKey; visible: boolean }[] = [
  { key: "hero", visible: true },
  { key: "results", visible: true },
  { key: "work", visible: true },
  { key: "toolkit", visible: true },
  { key: "experience", visible: true },
  { key: "about", visible: true },
  { key: "contact", visible: true },
];

export const labels = {
  skipLink: "Skip to main content",
  menuOpen: "Open menu",
  menuClose: "Close menu",
  heroPrimaryCta: "See the results",
  heroSecondaryCta: "Get in touch",
  resultsHeading: "Results",
  educationHeading: "Education",
  emailCta: "Email me",
  whatsappLabel: "WhatsApp",
  linkedinLabel: "LinkedIn",
  formName: "Name",
  formEmail: "Email",
  formMessage: "Message",
  formSubmit: "Send message",
} as const;

export const sectionHeadings = {
  work: { eyebrow: "Selected work", title: "Three results, and how they happened." },
  toolkit: { eyebrow: "Toolkit", title: "What I work with." },
  experience: { eyebrow: "Experience", title: "Four roles. One thread: results." },
  aboutEyebrow: "About",
} as const;

export const seo = {
  title: "Arjun T.R — Digital Marketing & Growth Specialist",
  description:
    "Digital marketer in Bengaluru: SEO, AEO/GEO, paid ads and automation. Grew organic impressions 482%; ₹10–15 lakh a month in ads at ~3x ROAS.",
  ogImageUrl: null as string | null,
};

type Widen<T> = { -readonly [K in keyof T]: string };
export type Profile = Widen<typeof profile>;
export type Labels = Widen<typeof labels>;

export type SiteContent = {
  profile: Profile;
  navItems: readonly NavItem[];
  sections: readonly { key: SectionKey; visible: boolean }[];
  labels: Labels;
  seo: { title: string; description: string; ogImageUrl: string | null };
  headlineStats: readonly Stat[];
  sectionHeadings: {
    work: { eyebrow: string; title: string };
    toolkit: { eyebrow: string; title: string };
    experience: { eyebrow: string; title: string };
    aboutEyebrow: string;
  };
  caseStudies: readonly CaseStudy[];
  roles: readonly Role[];
  toolGroups: readonly ToolGroup[];
  education: readonly Education[];
  about: { headline: string; paragraphs: readonly string[] };
  contact: { headline: string; intro: string; replyNote: string };
};

export const fallbackContent: SiteContent = {
  profile,
  navItems,
  sections,
  labels,
  seo,
  headlineStats,
  sectionHeadings,
  caseStudies,
  roles,
  toolGroups,
  education,
  about,
  contact,
};
