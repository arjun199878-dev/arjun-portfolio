import { defineArrayMember, defineField, defineType } from "sanity";

const order = defineField({ name: "order", title: "Order", type: "number", description: "Lower numbers appear first.", validation: (r) => r.required() });
const tagList = (name: string, title: string) =>
  defineField({ name, title, type: "array", of: [defineArrayMember({ type: "string" })], options: { layout: "tags" } });

export const caseStudy = defineType({
  name: "caseStudy",
  title: "Case study",
  type: "document",
  fields: [
    order,
    defineField({ name: "company", title: "Company", type: "string", validation: (r) => r.required() }),
    defineField({ name: "period", title: "Period", type: "string", validation: (r) => r.required() }),
    defineField({ name: "eyebrow", title: "Small line above", type: "string", validation: (r) => r.required() }),
    defineField({ name: "headline", title: "Headline", type: "string", validation: (r) => r.required().max(60) }),
    defineField({ name: "summary", title: "Summary", type: "text", rows: 4, validation: (r) => r.required().max(400) }),
    defineField({ name: "actions", title: "What I did", type: "array", of: [defineArrayMember({ type: "string" })], validation: (r) => r.min(2).max(6) }),
    defineField({ name: "results", title: "Results", type: "array", of: [defineArrayMember({ type: "resultItem" })], validation: (r) => r.length(3) }),
    tagList("tools", "Tools"),
    defineField({ name: "visual", title: "Visual", type: "caseVisual", validation: (r) => r.required() }),
    defineField({ name: "visible", title: "Visible", type: "boolean", initialValue: true }),
  ],
  orderings: [{ title: "Order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "headline", subtitle: "company" } },
});

export const role = defineType({
  name: "role",
  title: "Role",
  type: "document",
  fields: [
    order,
    defineField({ name: "title", title: "Job title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "company", title: "Company", type: "string", validation: (r) => r.required() }),
    defineField({ name: "period", title: "Period", type: "string", validation: (r) => r.required() }),
    defineField({ name: "location", title: "Location", type: "string", validation: (r) => r.required() }),
    defineField({ name: "points", title: "Highlights", type: "array", of: [defineArrayMember({ type: "string" })], validation: (r) => r.min(1).max(4) }),
  ],
  orderings: [{ title: "Order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "title", subtitle: "company" } },
});

export const toolGroup = defineType({
  name: "toolGroup",
  title: "Tool group",
  type: "document",
  fields: [
    order,
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "summary", title: "Summary", type: "string", validation: (r) => r.required() }),
    tagList("tools", "Tools"),
  ],
  orderings: [{ title: "Order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "title", subtitle: "summary" } },
});

export const education = defineType({
  name: "education",
  title: "Education",
  type: "document",
  fields: [
    order,
    defineField({ name: "degree", title: "Degree", type: "string", validation: (r) => r.required() }),
    defineField({ name: "institution", title: "Institution", type: "string", validation: (r) => r.required() }),
    defineField({ name: "period", title: "Period", type: "string", validation: (r) => r.required() }),
  ],
  orderings: [{ title: "Order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "degree", subtitle: "institution" } },
});
