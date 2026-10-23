import type {
  CapabilityPillar,
  MotionSceneSpec,
  OperatingPrinciple,
  ProjectCaseStudy,
} from "./types";

export const siteProfile = {
  name: "ARJUN T.R",
  shortName: "ARJUN",
  role: "Product & Growth Technologist",
  resumeSubtitle:
    "Digital Marketing & Growth Specialist — SEO, Paid Media & Marketing Automation",
  location: "Bengaluru, Karnataka, India",
  phone: "+91 9620759032",
  email: "ajarjuntr@gmail.com",
  linkedin: "https://www.linkedin.com/in/arjun-tr-digital-marketing-seo-ppc",
  linkedinDisplay: "linkedin.com/in/arjun-tr-digital-marketing-seo-ppc",
  heroLead: "I build things that move businesses forward.",
  coreStatement:
    "From digital products and marketing systems to analytics and AI-powered automation, I turn complex problems into useful solutions.",
  supportingStatement:
    "3+ years of hands-on execution across SEO, AEO/GEO, ₹10–15L/mo Google & Meta Ads, GTM/GA4/Zoho CRM tracking, and no-code AI dashboards, calculators & WhatsApp chatbot flows.",
  navItems: [
    { href: "#work", label: "Work", num: "01" },
    { href: "#capabilities", label: "Capabilities", num: "02" },
    { href: "#performance", label: "Performance", num: "03" },
    { href: "#motion-lab", label: "Motion Lab", num: "04", badge: "14 SCENES" },
    { href: "#process", label: "Process", num: "05" },
    { href: "#about", label: "About", num: "06" },
  ],
  contactHref: "#contact",
} as const;

export interface WorkExperienceEntry {
  id: string;
  role: string;
  company: string;
  period: string;
  location: string;
  badge: string;
  highlights: readonly {
    title: string;
    metric?: string;
    detail: string;
  }[];
}

export const workExperienceData: readonly WorkExperienceEntry[] = [
  {
    id: "clean-fanatics",
    role: "SEO & Digital Marketing Specialist",
    company: "Clean Fanatics",
    period: "06/2024 – Present",
    location: "Bengaluru, India",
    badge: "CURRENT ROLE // FULL-STACK GROWTH",
    highlights: [
      {
        title: "SEO, AEO & Content Growth",
        metric: "+482% Impressions · +167% Clicks",
        detail:
          "Grew organic search impressions by 482% and clicks by 167% over 12 months through on-page, off-page, and technical SEO, structured content planning, and AEO/GEO optimization for AI search results.",
      },
      {
        title: "Google & Meta Ads (₹10–15L/Month)",
        metric: "~3x ROAS · -28% CAC",
        detail:
          "Managed ₹10–15 Lakhs in monthly ad spend across Google and Meta Ads, delivering a ~3x ROAS and reducing customer acquisition cost (CAC) by 28% using GoMarble AI for campaign performance insights.",
      },
      {
        title: "No-Code AI Dashboards, Pages & Calculators",
        metric: "+47% Page Performance Score",
        detail:
          "Used Claude Cowork and Codex to build automated marketing performance dashboards, interactive service calculators, and landing pages without developer dependency; guided UI/UX updates that improved page performance scores by 47%.",
      },
      {
        title: "WhatsApp Bot & Lead Nurturing",
        metric: "6% → 11% Lead-to-Booking CVR",
        detail:
          "Increased lead-to-booking conversion rate from 6% to 11% by setting up and migrating a WhatsApp AI chatbot and automated WhatsApp follow-up drip sequences.",
      },
      {
        title: "GTM & CRM Tracking",
        metric: "GTM + GA4 + Zoho CRM",
        detail:
          "Added and configured Google Tags, conversion events, and triggers through Google Tag Manager and Zoho PageSense, and customized Zoho CRM lead workflows and Zoho Forms for accurate lead capture.",
      },
      {
        title: "CMS & Operations Support",
        metric: "Sanity CMS + Booking Engine",
        detail:
          "Provided UX feedback and workflow inputs for a new booking engine, partner application, and loyalty programs, while managing Sanity CMS content updates and email migrations.",
      },
    ],
  },
  {
    id: "alchemy-techsol",
    role: "Digital Marketing Executive",
    company: "Alchemy Techsol",
    period: "10/2023 – 06/2024",
    location: "Bengaluru, India",
    badge: "ORGANIC SOCIAL & WEB REVAMP",
    highlights: [
      {
        title: "Organic Social Media Growth",
        metric: "24,000 → 36,000 Followers (+50%)",
        detail:
          "Increased organic social media followers by 50% (from 24,000 to 36,000 in 6 months) through regular content scheduling and audience engagement.",
      },
      {
        title: "Content & SEO Execution",
        metric: "+15% Brand Visibility · 20+ Assets",
        detail:
          "Improved brand visibility by 15% by planning and publishing 20+ SEO-friendly blogs and white papers.",
      },
      {
        title: "Website Management & Revamp",
        metric: "WordPress + On-Page SEO",
        detail:
          "Managed the company WordPress website and contributed to a website revamp, updating page layouts, navigation, and on-page SEO elements.",
      },
    ],
  },
  {
    id: "bharatagri",
    role: "SEO Intern",
    company: "BharatAgri",
    period: "12/2022 – 05/2023",
    location: "Bengaluru, India",
    badge: "TECHNICAL SEO & SERP VELOCITY",
    highlights: [
      {
        title: "Organic Traffic & Ranking Growth",
        metric: "47 → 631 Visits/Day · SERP #22 → #9",
        detail:
          "Grew daily organic traffic from 47 to 631 visits/day and increased search impressions from 10K to 54K in 6 months, moving target keywords from SERP position 22 to position 9.",
      },
      {
        title: "On-Page & Technical SEO",
        metric: "10K → 54K Impressions",
        detail:
          "Executed keyword research, meta title and description updates, H1 tag optimization, internal linking, image alt tags, URL structure cleanup, canonical tags, 301 redirects, and mobile responsiveness checks.",
      },
    ],
  },
  {
    id: "wedigitiz",
    role: "Junior Project Coordinator (Intern)",
    company: "WeDigitiz",
    period: "03/2021 – 06/2021",
    location: "Chennai, India",
    badge: "CAMPAIGN DATA & COORDINATION",
    highlights: [
      {
        title: "Campaign Data & Coordination",
        metric: "Database & Campaign Ops",
        detail:
          "Collected and organized marketing campaign data, updated databases, and assisted with daily campaign follow-ups.",
      },
    ],
  },
];

export const educationData = [
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

export const capabilitiesData: readonly CapabilityPillar[] = [
  {
    id: "seo-aeo-content-architecture",
    title: "SEO, AEO/GEO & Web Architecture",
    description:
      "On-page, off-page, and technical SEO paired with AEO/GEO optimization for AI search results, Sanity CMS & WordPress architectures, and +47% faster Core Web Vitals.",
    deliverables: [
      "Technical SEO, Canonical & 301 Architecture (+482% Impressions)",
      "AEO & GEO Ranking Optimization for AI Search Discovery",
      "Topic-Cluster Content Planning (Ahrefs, SEMrush, GSC)",
      "Sanity CMS, WordPress, Shopify & High-Conversion Landing Pages",
    ],
    techTags: ["Ahrefs", "SEMrush", "Search Console", "AEO/GEO", "Sanity CMS", "WordPress", "GTmetrix"],
  },
  {
    id: "paid-media-performance-systems",
    title: "Paid Media & Growth Systems",
    description:
      "Managing ₹10–15 Lakhs in monthly ad spend across Google Ads (Search, Display, PMax) and Meta Ads at ~3x ROAS while reducing CAC by 28% with AI performance analysis.",
    deliverables: [
      "Google Ads (Search, Display, PMax) & Meta Ads Management",
      "₹10–15L/Month Budget Allocation & ~3x ROAS Optimization",
      "GoMarble AI Ad Performance & Creative Fatigue Diagnostics (-28% CAC)",
      "Full-Funnel Landing Page & Interactive Service Calculator CRO",
    ],
    techTags: ["Google Ads", "Meta Ads", "GoMarble AI", "PMax", "ROAS Optimization", "CRO"],
  },
  {
    id: "nocode-ai-whatsapp-automation",
    title: "No-Code AI & Workflow Automation",
    description:
      "Building automated marketing dashboards, interactive service calculators, and landing pages via Claude Cowork & Codex, plus WhatsApp AI chatbots that lifted booking conversion from 6% to 11%.",
    deliverables: [
      "AI-Generated Marketing Dashboards via Claude Cowork & Codex",
      "No-Code Interactive Service Calculators & Dynamic Landers",
      "WhatsApp AI Chatbot Setup & Migration (6% → 11% Booking CVR)",
      "Automated WhatsApp Drip Sequences & Lead Nurturing Loops",
    ],
    techTags: ["Claude Cowork", "Codex", "GoMarble AI", "WhatsApp AI Bot", "Drip Sequences"],
  },
  {
    id: "gtm-ga4-crm-telemetry",
    title: "Tag Management, GA4 & Zoho CRM",
    description:
      "End-to-end conversion tracking in Google Tag Manager (GTM), GA4, and Zoho PageSense seamlessly wired into Zoho CRM lead workflows and Zoho Forms.",
    deliverables: [
      "Google Tag Manager (Tags, Custom Triggers & Conversion Events)",
      "Google Analytics 4 (GA4) & Zoho PageSense Funnel Telemetry",
      "Zoho CRM Lead Workflow Customization & Pipeline Hygiene",
      "Zoho Forms Integration & Multi-Channel Attribution Data Prep",
    ],
    techTags: ["Google Tag Manager", "GA4", "Zoho CRM", "Zoho PageSense", "Zoho Forms"],
  },
];

export const projectCaseStudies: readonly ProjectCaseStudy[] = [
  {
    id: "cleanfanatics",
    slug: "cleanfanatics",
    title: "CleanFanatics Digital Growth & Booking Ecosystem",
    category: "SEO, Paid Media & Booking Ecosystem",
    implementationStatus: "deployed",
    summary:
      "Full-funnel growth and digital ecosystem at Clean Fanatics (06/2024–Present): +482% organic impressions, ₹10–15L/mo Google & Meta Ads at ~3x ROAS, Sanity CMS, GTM/Zoho CRM telemetry, and WhatsApp AI bot automation.",
    narrative: {
      problem:
        "High acquisition costs across competitive home-service keywords, developer bottlenecks for launching landing pages and calculators, and lead drop-off between inquiry and confirmed booking.",
      approach:
        "Built an integrated growth engine combining technical SEO + AEO/GEO topic clusters, AI-assisted ad optimization on ₹10–15L/mo spend, no-code AI interactive calculators, and automated WhatsApp chatbot nurturing.",
      implementation:
        "Executed technical/on-page SEO and Sanity CMS updates, configured GTM/GA4/Zoho PageSense conversion triggers into Zoho CRM, used Claude Cowork & Codex to ship calculators/landers (+47% page speed), and migrated the WhatsApp AI bot.",
      evidence:
        "Organic impressions grew +482% and clicks +167% over 12 months; paid ads delivered ~3x ROAS with 28% lower CAC; WhatsApp AI chatbot lifted lead-to-booking conversion from 6% to 11%.",
      outcome:
        "Transformed Clean Fanatics' digital acquisition into a measurable, self-reinforcing growth system across organic search, paid media, and automated CRM/WhatsApp fulfillment.",
      nextOpportunity:
        "Expanding programmatic neighborhood-level service calculators and predictive repeat-booking WhatsApp triggers.",
    },
    technologies: [
      { name: "Sanity CMS", status: "deployed" },
      { name: "GTM & GA4", status: "deployed" },
      { name: "Zoho CRM & PageSense", status: "deployed" },
      { name: "Google & Meta Ads", status: "deployed" },
      { name: "WhatsApp AI Bot", status: "deployed" },
      { name: "Claude Cowork & Codex", status: "deployed" },
    ],
    metrics: [
      {
        id: "cf-1",
        label: "Organic Impressions (12M)",
        value: "+482%",
        delta: "+167% Clicks",
        verification: "verified",
        sourceNote: "Verified Google Search Console telemetry at Clean Fanatics",
      },
      {
        id: "cf-2",
        label: "Paid Media (₹10–15L/mo)",
        value: "~3x ROAS",
        delta: "-28% CAC",
        verification: "verified",
        sourceNote: "Google & Meta Ads optimized with GoMarble AI insights",
      },
      {
        id: "cf-3",
        label: "Lead-to-Booking CVR",
        value: "6% → 11%",
        delta: "+47% Page Speed",
        verification: "verified",
        sourceNote: "WhatsApp AI chatbot migration & UI/UX performance lift",
      },
    ],
    pairedSceneIds: [1, 2, 7],
  },
  {
    id: "marketing-intelligence-dashboard",
    slug: "marketing-intelligence-dashboard",
    title: "No-Code AI Marketing Intelligence Dashboards & Calculators",
    category: "AI Dashboards & Attribution Telemetry",
    implementationStatus: "deployed",
    summary:
      "Automated marketing performance dashboards, interactive service cost calculators, and conversion landing pages built with Claude Cowork, Codex, and GoMarble AI—eliminating developer wait times.",
    narrative: {
      problem:
        "Marketing teams often wait weeks for engineering bandwidth to ship interactive service calculators, custom campaign landing pages, or unified cross-channel ROAS/CAC dashboards.",
      approach:
        "Leveraged no-code AI workflows (Claude Cowork, Codex, GoMarble AI) wired to GTM, GA4, Google/Meta Ads, Search Console, and Zoho CRM data to build and iterate marketing tools autonomously.",
      implementation:
        "Created live performance dashboards tracking ₹10–15L/mo ad spend, interactive home-service calculators that qualify user intent, and guided UI/UX speed optimizations.",
      evidence:
        "Reduced CAC by 28% via GoMarble AI ad performance analysis and improved website page performance scores by 47% without engineering bottlenecks.",
      outcome:
        "Empowered rapid weekly experimentation across landing pages, calculators, and ad creatives while keeping full attribution visibility in GA4 and Zoho CRM.",
      nextOpportunity:
        "Connecting real-time Zoho CRM closed-won revenue back into automated daily budget pacing alerts.",
    },
    technologies: [
      { name: "Claude Cowork", status: "deployed" },
      { name: "Codex", status: "deployed" },
      { name: "GoMarble AI", status: "deployed" },
      { name: "GA4 & GSC", status: "deployed" },
      { name: "Zoho PageSense", status: "deployed" },
    ],
    metrics: [
      {
        id: "mid-1",
        label: "Page Performance Score",
        value: "+47% Lift",
        verification: "verified",
        sourceNote: "Verified UI/UX & GTmetrix/Lighthouse optimization at Clean Fanatics",
      },
      {
        id: "mid-2",
        label: "CAC Reduction",
        value: "-28% CAC",
        delta: "GoMarble AI",
        verification: "verified",
        sourceNote: "Verified across ₹10–15L/mo Google & Meta Ads spend",
      },
      {
        id: "mid-3",
        label: "Developer Dependency",
        value: "Zero Wait",
        verification: "verified",
        sourceNote: "Built autonomously via Claude Cowork & Codex",
      },
    ],
    pairedSceneIds: [3, 4, 11],
  },
  {
    id: "ai-workflow-automation",
    slug: "ai-workflow-automation",
    title: "WhatsApp AI Chatbot, Drip Sequences & Zoho CRM Automation",
    category: "Conversational AI & Lifecycle Automation",
    implementationStatus: "deployed",
    summary:
      "End-to-end lead capture and nurturing pipeline connecting GTM/Zoho Forms → Zoho CRM workflows → WhatsApp AI Chatbot triage & automated follow-up drip sequences.",
    narrative: {
      problem:
        "Inbound service leads from paid ads and organic search experienced response delays during peak and off-peak hours, keeping lead-to-booking conversion stuck at 6%.",
      approach:
        "Designed an automated conversational and CRM lifecycle workflow: instant WhatsApp AI bot qualification, structured Zoho CRM stage routing, and timed WhatsApp follow-up sequences.",
      implementation:
        "Set up and migrated the WhatsApp AI chatbot, built automated multi-step WhatsApp drip sequences, and customized Zoho CRM lead workflows and Zoho Forms with GTM conversion tracking.",
      evidence:
        "Lifted lead-to-booking conversion rate from 6% to 11% (+83% relative conversion lift) across inbound leads.",
      outcome:
        "Turned WhatsApp and Zoho CRM into an always-on conversion engine that qualifies, nurtures, and books high-intent customers automatically.",
      nextOpportunity:
        "Integrating MCP-driven dynamic slot availability lookups directly inside the WhatsApp conversational flow.",
    },
    technologies: [
      { name: "WhatsApp AI Chatbot", status: "deployed" },
      { name: "WhatsApp Drip Sequences", status: "deployed" },
      { name: "Zoho CRM Workflows", status: "deployed" },
      { name: "Zoho Forms", status: "deployed" },
      { name: "Google Tag Manager", status: "deployed" },
    ],
    metrics: [
      {
        id: "ai-1",
        label: "Lead-to-Booking CVR",
        value: "6% → 11%",
        delta: "+83% Rel. Lift",
        verification: "verified",
        sourceNote: "Verified conversion lift after WhatsApp AI bot & drip setup",
      },
      {
        id: "ai-2",
        label: "Pipeline Stages",
        value: "4-Stage Flow",
        verification: "verified",
        sourceNote: "Capture (Zoho Forms/GTM) → Triage (WA Bot) → CRM → Drip Booking",
      },
      {
        id: "ai-3",
        label: "Response Cadence",
        value: "24/7 Automated",
        verification: "verified",
        sourceNote: "Instant WhatsApp AI chatbot engagement & scheduled follow-ups",
      },
    ],
    pairedSceneIds: [5, 6, 12],
  },
  {
    id: "seo-content-strategy",
    slug: "seo-content-strategy",
    title: "High-Velocity SEO, AEO/GEO & Topic-Cluster Architecture",
    category: "Organic Search & AI Discovery",
    implementationStatus: "deployed",
    summary:
      "Proven organic search engines across Clean Fanatics (+482% impressions, +167% clicks), BharatAgri (47 → 631 daily visits, SERP #22 → #9), and Alchemy Techsol (20+ SEO blogs/whitepapers, +50% social growth).",
    narrative: {
      problem:
        "Competing in high-CPC categories requires durable organic authority—both in traditional Google SERPs and emerging AI Answer Engines (AEO/GEO)—rather than disjointed blog posts.",
      approach:
        "Combined rigorous technical SEO (canonicals, 301s, schema, internal link graphs, mobile speed) with structured topic-cluster content planning (such as Home Painting pillars + cost/coverage/prep spokes) and AEO/GEO formatting.",
      implementation:
        "Executed across Clean Fanatics (Sanity CMS), BharatAgri (scaling impressions 10K → 54K in 6 months), and Alchemy Techsol (WordPress revamp + 20+ blogs/whitepapers).",
      evidence:
        "Clean Fanatics: +482% impressions & +167% clicks in 12 months. BharatAgri: 47 → 631 visits/day (+1,242%) and SERP #22 → #9 in 6 months. Alchemy Techsol: +15% brand visibility & 24K → 36K organic followers.",
      outcome:
        "Repeatable, multi-industry SEO & AEO/GEO playbook that compounds non-paid traffic and feeds high-intent leads into the booking funnel.",
      nextOpportunity:
        "Scaling interactive calculator spokes to capture bottom-of-funnel commercial estimation queries.",
    },
    technologies: [
      { name: "Technical & On-Page SEO", status: "deployed" },
      { name: "AEO & GEO Optimization", status: "deployed" },
      { name: "Ahrefs & SEMrush", status: "deployed" },
      { name: "Google Search Console", status: "deployed" },
      { name: "Sanity CMS & WordPress", status: "deployed" },
    ],
    metrics: [
      {
        id: "seo-1",
        label: "Clean Fanatics SEO (12M)",
        value: "+482% Impr.",
        delta: "+167% Clicks",
        verification: "verified",
        sourceNote: "Verified 12-month growth via SEO & AEO/GEO optimization",
      },
      {
        id: "seo-2",
        label: "BharatAgri Daily Traffic",
        value: "47 → 631/day",
        delta: "SERP #22 → #9",
        verification: "verified",
        sourceNote: "10K → 54K impressions in 6 months at BharatAgri",
      },
      {
        id: "seo-3",
        label: "Alchemy Techsol Growth",
        value: "24K → 36K",
        delta: "+50% Followers",
        verification: "verified",
        sourceNote: "50% organic follower growth & 20+ SEO blogs/whitepapers",
      },
    ],
    pairedSceneIds: [8, 9, 13],
  },
  {
    id: "business-experiments",
    slug: "business-experiments",
    title: "Booking Engine UX, Partner App Workflows & Operations Lab",
    category: "Product UX & Operational Systems",
    implementationStatus: "prototype",
    summary:
      "Hands-on product UX feedback and workflow design for booking engines, partner applications, loyalty programs, and practical retail/bakery batch operations tracking.",
    narrative: {
      problem:
        "Operational businesses suffer when digital booking flows, partner dispatch apps, and daily inventory/batch schedules are disconnected from ground-level unit economics.",
      approach:
        "Bridged marketing data and commerce fundamentals (M.Com background) with practical product UX inputs—designing frictionless booking steps, partner app workflows, and batch yield trackers.",
      implementation:
        "Contributed UX feedback and workflow specifications for Clean Fanatics' new booking engine, partner application, and loyalty programs, alongside micro-tools for batch ordering and yield tracking.",
      evidence:
        "Streamlined booking and calculator flows contributed to the +47% page performance improvement and smoother customer-to-partner handoffs.",
      outcome:
        "Demonstrated that practical tools grounded in unit economics and clean data beat bloated software every time.",
      nextOpportunity:
        "Automated loyalty tier triggers tied directly to repeat booking intervals in Zoho CRM.",
    },
    technologies: [
      { name: "Booking Engine UX", status: "deployed" },
      { name: "Partner App Workflows", status: "deployed" },
      { name: "Loyalty Program Logic", status: "deployed" },
      { name: "Figma & Canva", status: "deployed" },
      { name: "Batch Yield Calculators", status: "prototype" },
    ],
    metrics: [
      {
        id: "be-1",
        label: "Page Performance Lift",
        value: "+47% Score",
        verification: "verified",
        sourceNote: "Guided UI/UX updates & interactive calculator deployment",
      },
      {
        id: "be-2",
        label: "Operational Scope",
        value: "Booking + Partner",
        verification: "verified",
        sourceNote: "Booking engine, partner app & loyalty workflow inputs",
      },
      {
        id: "be-3",
        label: "Batch Waste Reduction",
        value: "~12-18%",
        verification: "illustrative",
        sourceNote: "Illustrative operational lab model for perishable batch yields",
      },
    ],
    pairedSceneIds: [10, 14],
  },
];

export const motionSceneSpecs: readonly MotionSceneSpec[] = [
  {
    sceneNumber: 1,
    id: "scene-01",
    title: "Bars into a Trend",
    summary:
      "Seven bars spring into position. A trend line draws through their tops, a data point travels along it, and a prominent metric appears.",
    heroObjectDescription:
      "Seven vertical precision bars with spring overshoot and glowing acid spline.",
    referencePayoffLabel: "+482% Organic Impressions",
    dataStatus: "verified",
    domainAdaptation: "Clean Fanatics SEO & Growth Velocity",
  },
  {
    sceneNumber: 2,
    id: "scene-02",
    title: "Segmented Control",
    summary:
      "A selection pill slides between options. The selected state changes, and a price rolls smoothly to its new value.",
    heroObjectDescription:
      "Segmented pill sliding above a tier card with mechanical price odometer.",
    referencePayoffLabel: "$119/mo (Save 20%)",
    dataStatus: "illustrative",
    domainAdaptation: "Service Calculator & Tier Selection",
  },
  {
    sceneNumber: 3,
    id: "scene-03",
    title: "Logo Assembly",
    summary:
      "Small glossy particles converge to form an original geometric mark with spring dynamics.",
    heroObjectDescription:
      "120 glossy 3D spheres swirling inward along vortex spirals into Arjun's architectural mark.",
    referencePayoffLabel: "Arjun Systems Monogram",
    dataStatus: "verified",
    domainAdaptation: "Acid Editorial Brand Identity",
  },
  {
    sceneNumber: 4,
    id: "scene-04",
    title: "Live Activity",
    summary:
      "A compact status pill expands into a live activity card, updates its state, and returns to its initial appearance.",
    heroObjectDescription:
      "Upper hardware bezel pill expanding with spring physics into a live broadcast activity card.",
    referencePayoffLabel: "LIVE · Crew #04 Dispatch",
    dataStatus: "illustrative",
    domainAdaptation: "WhatsApp Bot & Real-Time Lead Triage",
  },
  {
    sceneNumber: 5,
    id: "scene-05",
    title: "Results Funnel",
    summary:
      "Glowing particles flow through a translucent funnel and converge into a result counter.",
    heroObjectDescription:
      "3-tier translucent funnel with 96 converging data particles.",
    referencePayoffLabel: "6% → 11% Booking CVR",
    dataStatus: "verified",
    domainAdaptation: "Full-Funnel GTM + Zoho CRM Conversion",
  },
  {
    sceneNumber: 6,
    id: "scene-06",
    title: "Action Completion",
    summary:
      "A button compresses, transforms into a progress ring, fills, and resolves into a confirmation tick.",
    heroObjectDescription:
      "Tactile button clicked by vector cursor, morphing to progress ring and Acid Published badge.",
    referencePayoffLabel: "Published · Campaign Live",
    dataStatus: "verified",
    domainAdaptation: "No-Code AI Lander & Tag Deployment",
  },
  {
    sceneNumber: 7,
    id: "scene-07",
    title: "Confirmation Card",
    summary:
      "A premium card enters, a light ring travels around the main action, and a success indicator appears.",
    heroObjectDescription:
      "Elevated wallet card with orbiting light ring locking into an Acid Verified medallion.",
    referencePayoffLabel: "Verified · Booking Confirmed",
    dataStatus: "verified",
    domainAdaptation: "Booking Engine & Payment Settlement",
  },
  {
    sceneNumber: 8,
    id: "scene-08",
    title: "Rolling Metric",
    summary:
      "Individual digits roll into position at different speeds, followed by a small change indicator.",
    heroObjectDescription:
      "Mechanical 5-column digit odometer inside optical shadow housing.",
    referencePayoffLabel: "+167% Organic Clicks",
    dataStatus: "verified",
    domainAdaptation: "GA4, Search Console & Zoho PageSense",
  },
  {
    sceneNumber: 9,
    id: "scene-09",
    title: "Variable Typography",
    summary:
      "A headline transitions from light to bold weight. The punctuation becomes a small animated accent.",
    heroObjectDescription:
      "Editorial headline 'Make it move.' transitioning from thin 200 to heavy 900 with bouncing vermilion period.",
    referencePayoffLabel: "Make it move. (900 wght)",
    dataStatus: "verified",
    domainAdaptation: "Acid Editorial Kinetic Typography",
  },
  {
    sceneNumber: 10,
    id: "scene-10",
    title: "App Reveal",
    summary:
      "A wireframe application transitions into a finished dashboard through a precise reveal wipe.",
    heroObjectDescription:
      "Architectural blueprint wireframe wiped top-to-bottom by a laser bar to reveal live dashboard.",
    referencePayoffLabel: "+47% Page Performance",
    dataStatus: "verified",
    domainAdaptation: "Claude Cowork & Codex Dashboard Build",
  },
  {
    sceneNumber: 11,
    id: "scene-11",
    title: "Calendar Automation",
    summary:
      "An event is dragged into a calendar slot and snaps into place with a confirmation state.",
    heroObjectDescription:
      "Animated cursor dragging an unscheduled block and snapping it into an open Thursday 11:00 slot.",
    referencePayoffLabel: "Thursday 11:00 · Slot Locked",
    dataStatus: "illustrative",
    domainAdaptation: "Automated WhatsApp Booking & Crew Slot",
  },
  {
    sceneNumber: 12,
    id: "scene-12",
    title: "Notification Stack",
    summary:
      "Notifications appear sequentially and stack neatly while a counter updates.",
    heroObjectDescription:
      "Real-time incoming bookings arriving with spring physics into a 3D perspective pile.",
    referencePayoffLabel: "12 New Bookings Active",
    dataStatus: "illustrative",
    domainAdaptation: "Zoho CRM & WhatsApp Bot Lead Ingestion",
  },
  {
    sceneNumber: 13,
    id: "scene-13",
    title: "Activity Rings",
    summary:
      "Three concentric rings sweep into position around a central goal statement.",
    heroObjectDescription:
      "Three concentric rings in vermilion, acid, and parchment sweeping clockwise to 100% triple closure.",
    referencePayoffLabel: "~3x ROAS · -28% CAC",
    dataStatus: "verified",
    domainAdaptation: "SEO × Paid Media × Automation Closure",
  },
  {
    sceneNumber: 14,
    id: "scene-14",
    title: "Product Rotation",
    summary:
      "A premium card rotates, reveals feature details on its reverse, and settles into its original orientation.",
    heroObjectDescription:
      "Spatial card rotating 360° in true perspective, cascading 3 reverse ticks and hero display.",
    referencePayoffLabel: "3/3 Systems Verified",
    dataStatus: "verified",
    domainAdaptation: "Full-Stack Growth Architecture Card",
  },
];

export const operatingPrinciples: readonly OperatingPrinciple[] = [
  {
    number: "01",
    title: "Understand the Problem",
    description:
      "Interrogate root causes, examine unit economics (CAC, ROAS, lead-to-booking drop-off), and isolate real business bottlenecks vs cosmetic symptoms.",
    focus: "AUDIT & UNIT ECONOMICS",
  },
  {
    number: "02",
    title: "Design the System",
    description:
      "Map topic-cluster topology, GTM/GA4 event triggers, Zoho CRM workflows, and WhatsApp bot decision trees before launching campaigns.",
    focus: "TOPOLOGY & TRACKING SCHEMAS",
  },
  {
    number: "03",
    title: "Build the Product",
    description:
      "Ship high-converting landing pages, interactive service calculators, and automated dashboards using Sanity CMS, WordPress, Claude Cowork, and Codex without waiting on dev queues.",
    focus: "NO-CODE AI × CMS EXECUTION",
  },
  {
    number: "04",
    title: "Measure Outcome",
    description:
      "Verify every rupee of ₹10–15L/mo ad spend and organic click through GTM, GA4, Search Console, Zoho PageSense, and GoMarble AI.",
    focus: "GA4, GTM & ZOHOCRM TELEMETRY",
  },
  {
    number: "05",
    title: "Improve Continuously",
    description:
      "Feed real search query data, ad creative insights, and WhatsApp chat transcripts back into the growth engine to compound ROAS and organic rankings.",
    focus: "COMPOUNDING ITERATION",
  },
];
