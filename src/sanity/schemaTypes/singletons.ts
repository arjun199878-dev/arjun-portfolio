import { defineArrayMember, defineField, defineType } from "sanity";

const SECTION_KEYS = ["hero", "results", "work", "toolkit", "experience", "about", "contact"];
const LABEL_FIELDS: [string, string][] = [
  ["skipLink", "Skip link"],
  ["heroPrimaryCta", "Hero main button"],
  ["heroSecondaryCta", "Hero second link"],
  ["resultsHeading", "Results heading (screen readers)"],
  ["emailCta", "Email button"],
  ["whatsappLabel", "WhatsApp link"],
  ["linkedinLabel", "LinkedIn link"],
  ["formName", "Form: name"],
  ["formEmail", "Form: email"],
  ["formMessage", "Form: message"],
  ["formSubmit", "Form: submit button"],
  ["educationHeading", "Education heading"],
  ["menuOpen", "Menu button (open)"],
  ["menuClose", "Menu button (close)"],
];

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  groups: [
    { name: "profile", title: "Profile", default: true },
    { name: "seo", title: "SEO" },
    { name: "navigation", title: "Navigation" },
    { name: "sections", title: "Sections" },
    { name: "labels", title: "Labels" },
  ],
  fields: [
    defineField({ name: "name", title: "Name", type: "string", group: "profile", validation: (r) => r.required() }),
    defineField({ name: "title", title: "Job title", type: "string", group: "profile", validation: (r) => r.required() }),
    defineField({ name: "specialties", title: "Specialties", type: "string", group: "profile" }),
    defineField({ name: "location", title: "Location", type: "string", group: "profile" }),
    defineField({ name: "email", title: "Email", type: "string", group: "profile", validation: (r) => r.required().email() }),
    defineField({ name: "phoneDisplay", title: "Phone (as shown)", type: "string", group: "profile" }),
    defineField({ name: "phoneHref", title: "Phone link", type: "string", description: "e.g. tel:+919620759032", group: "profile" }),
    defineField({ name: "whatsappHref", title: "WhatsApp link", type: "url", group: "profile", validation: (r) => r.uri({ scheme: ["https"] }) }),
    defineField({ name: "linkedin", title: "LinkedIn URL", type: "url", group: "profile" }),
    defineField({ name: "linkedinDisplay", title: "LinkedIn (as shown)", type: "string", group: "profile" }),
    defineField({ name: "seoTitle", title: "Page title", type: "string", group: "seo", validation: (r) => r.max(70) }),
    defineField({ name: "seoDescription", title: "Page description", type: "text", rows: 3, group: "seo", validation: (r) => r.max(160) }),
    defineField({ name: "ogImage", title: "Share image", type: "image", group: "seo" }),
    defineField({
      name: "navItems",
      title: "Menu links",
      type: "array",
      group: "navigation",
      of: [
        defineArrayMember({
          type: "object",
          name: "navItem",
          fields: [
            defineField({ name: "section", title: "Goes to", type: "string", options: { list: ["work", "experience", "about", "contact", "toolkit", "results"] }, validation: (r) => r.required() }),
            defineField({ name: "label", title: "Label", type: "string", validation: (r) => r.required() }),
          ],
          preview: { select: { title: "label", subtitle: "section" } },
        }),
      ],
      validation: (r) => r.min(1).max(6),
    }),
    defineField({
      name: "sections",
      title: "Sections",
      description: "Drag to reorder sections. Untick to hide one.",
      type: "array",
      group: "sections",
      of: [
        defineArrayMember({
          type: "object",
          name: "sectionItem",
          fields: [
            defineField({ name: "key", title: "Section", type: "string", options: { list: SECTION_KEYS }, validation: (r) => r.required() }),
            defineField({ name: "visible", title: "Visible", type: "boolean", initialValue: true }),
          ],
          preview: { select: { title: "key", visible: "visible" }, prepare: ({ title, visible }) => ({ title, subtitle: visible === false ? "Hidden" : "Visible" }) },
        }),
      ],
      validation: (r) =>
        r.custom((v) => {
          const keys = ((v as { key?: string }[] | undefined) ?? []).map((i) => i.key);
          const ok = keys.length === 7 && new Set(keys).size === 7 && SECTION_KEYS.every((k) => keys.includes(k)) && keys[0] === "hero";
          return ok ? true : "Use each of the 7 sections once, with hero first";
        }),
    }),
    defineField({
      name: "labels",
      title: "Button and form labels",
      type: "object",
      group: "labels",
      fields: LABEL_FIELDS.map(([name, title]) => defineField({ name, title, type: "string", validation: (r) => r.required() })),
    }),
  ],
  preview: { prepare: () => ({ title: "Site settings" }) },
});

export const homePage = defineType({
  name: "homePage",
  title: "Home page",
  type: "document",
  fields: [
    defineField({ name: "heroHeadline", title: "Hero headline", type: "string", validation: (r) => r.required().max(40) }),
    defineField({ name: "heroIntro", title: "Hero intro", type: "string", validation: (r) => r.required().max(140) }),
    defineField({ name: "headlineStats", title: "Headline numbers", description: "The 4 big numbers in the black chapter.", type: "array", of: [defineArrayMember({ type: "stat" })], validation: (r) => r.length(4) }),
    defineField({ name: "workHeading", title: "Work heading", type: "sectionHeading" }),
    defineField({ name: "toolkitHeading", title: "Toolkit heading", type: "sectionHeading" }),
    defineField({ name: "experienceHeading", title: "Experience heading", type: "sectionHeading" }),
    defineField({ name: "aboutEyebrow", title: "About: small line", type: "string" }),
    defineField({ name: "aboutHeadline", title: "About headline", type: "string", validation: (r) => r.required() }),
    defineField({ name: "aboutParagraphs", title: "About paragraphs", type: "array", of: [defineArrayMember({ type: "text", rows: 4 })], validation: (r) => r.min(1).max(4) }),
    defineField({ name: "contactHeadline", title: "Contact headline", type: "string", validation: (r) => r.required() }),
    defineField({ name: "contactIntro", title: "Contact intro", type: "text", rows: 3, validation: (r) => r.required() }),
    defineField({ name: "contactReplyNote", title: "Reply note", type: "string", validation: (r) => r.required() }),
    defineField({ name: "summary", title: "Summary", description: "Used for search engines (JSON-LD).", type: "text", rows: 5 }),
  ],
  preview: { prepare: () => ({ title: "Home page" }) },
});
