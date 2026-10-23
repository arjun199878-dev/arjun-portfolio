/**
 * Site-wide content and navigation. Header, footer, metadata and the home page
 * all read from here so copy and anchors stay in sync.
 */

export const site = {
  name: "Arjun",
  role: "Product & Growth Technologist",
  message:
    "I turn business problems into digital products, intelligent systems, and measurable growth.",
} as const;

export type SectionId = "work" | "capabilities" | "experiments" | "about" | "contact";

export interface SiteSection {
  id: SectionId;
  label: string;
  title: string;
  lede: string;
}

export const sections: readonly SiteSection[] = [
  {
    id: "work",
    label: "Work",
    title: "Selected work",
    lede: "Case studies that trace a business problem through the product, the system behind it, and the outcome it produced.",
  },
  {
    id: "capabilities",
    label: "Capabilities",
    title: "Product, engineering, and growth as one discipline",
    lede: "Deciding what to build, building it well, and proving that it moved the numbers that matter.",
  },
  {
    id: "experiments",
    label: "Experiments",
    title: "Motion lab",
    lede: "Short, six-second studies in motion, interaction, and intelligent interfaces.",
  },
  {
    id: "about",
    label: "About",
    title: "About Arjun",
    lede: "A technologist who cares about the problem as much as the product.",
  },
  {
    id: "contact",
    label: "Contact",
    title: "Let’s build what’s next",
    lede: "Have a problem worth solving? I’d like to hear about it.",
  },
];

/** Primary nav links; Contact is rendered separately as the CTA. */
export const navItems = sections
  .filter((section) => section.id !== "contact")
  .map(({ id, label }) => ({ href: `#${id}`, label }));

export const contactHref = "#contact";
