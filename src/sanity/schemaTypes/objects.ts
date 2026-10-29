import { defineArrayMember, defineField, defineType } from "sanity";
import { formatStatDisplay } from "../../lib/format";

export const stat = defineType({
  name: "stat",
  title: "Headline stat",
  type: "object",
  fields: [
    defineField({ name: "key", title: "Key", type: "slug", description: "Internal id, e.g. impressions. Don't change after publishing.", validation: (r) => r.required() }),
    defineField({ name: "from", title: "From", type: "number", description: "Starting value. Leave empty to count from 0." }),
    defineField({ name: "to", title: "To", type: "number", description: "Final value", validation: (r) => r.required() }),
    defineField({ name: "decimals", title: "Decimals", type: "number", initialValue: 0, validation: (r) => r.min(0).max(2).integer() }),
    defineField({ name: "prefix", title: "Prefix", type: "string", description: "e.g. + or ~", validation: (r) => r.max(3) }),
    defineField({ name: "suffix", title: "Suffix", type: "string", description: "e.g. % or x", validation: (r) => r.max(3) }),
    defineField({ name: "label", title: "Label", type: "string", description: "Short name for the number", validation: (r) => r.required().max(40) }),
    defineField({ name: "context", title: "Context", type: "string", description: "One sentence: where and when", validation: (r) => r.required().max(110) }),
  ],
  preview: {
    select: { from: "from", to: "to", decimals: "decimals", prefix: "prefix", suffix: "suffix", label: "label" },
    prepare: ({ label, ...rest }) => ({
      title: typeof rest.to === "number" ? formatStatDisplay(rest) : "—",
      subtitle: label,
    }),
  },
});

export const resultItem = defineType({
  name: "resultItem",
  title: "Result",
  type: "object",
  fields: [
    defineField({ name: "value", title: "Value", type: "string", description: "e.g. +482%", validation: (r) => r.required().max(16) }),
    defineField({ name: "label", title: "Label", type: "string", validation: (r) => r.required().max(40) }),
  ],
  preview: { select: { title: "value", subtitle: "label" } },
});

export const sectionHeading = defineType({
  name: "sectionHeading",
  title: "Section heading",
  type: "object",
  fields: [
    defineField({ name: "eyebrow", title: "Small line above", type: "string", validation: (r) => r.max(40) }),
    defineField({ name: "title", title: "Heading", type: "string", validation: (r) => r.required().max(70) }),
  ],
});

export const seriesPoint = defineType({
  name: "seriesPoint",
  title: "Chart point",
  type: "object",
  fields: [
    defineField({ name: "label", title: "Label", type: "string", description: "e.g. Jan 2025", validation: (r) => r.required() }),
    defineField({ name: "value", title: "Value", type: "number", validation: (r) => r.required().min(0) }),
  ],
  preview: { select: { title: "label", subtitle: "value" }, prepare: ({ title, subtitle }) => ({ title, subtitle: String(subtitle) }) },
});

type Parent = { kind?: string } | undefined;
const only = (kind: string) => ({ parent }: { parent?: unknown }) => (parent as Parent)?.kind !== kind;
const requiredWhen = (kind: string) => (r: { custom: (fn: (v: unknown, ctx: { parent?: unknown }) => true | string) => unknown }) =>
  r.custom((value, ctx) => ((ctx.parent as Parent)?.kind === kind && (value === undefined || value === null || value === "") ? "Required for this kind of visual" : true));

export const caseVisual = defineType({
  name: "caseVisual",
  title: "Visual",
  type: "object",
  fields: [
    defineField({
      name: "kind",
      title: "Kind of visual",
      type: "string",
      options: {
        list: [
          { title: "Line chart (or big number)", value: "line" },
          { title: "Before / after bars", value: "beforeAfter" },
          { title: "Funnel steps", value: "funnel" },
          { title: "Screenshot", value: "screenshot" },
        ],
        layout: "radio",
      },
      validation: (r) => r.required(),
    }),
    defineField({ name: "caption", title: "Caption", type: "string", validation: (r) => r.required() }),
    // line
    defineField({
      name: "series",
      title: "Chart data",
      type: "array",
      of: [defineArrayMember({ type: "seriesPoint" })],
      hidden: only("line"),
      validation: (r) => r.custom((v) => (!v || v.length === 0 || (v.length >= 3 && v.length <= 24) ? true : "Use 0 points, or between 3 and 24")),
    }),
    defineField({
      name: "fallbackStatKey",
      title: "Fallback headline stat",
      type: "string",
      description: "If there's no chart data, the site shows this headline stat as a big number instead. Use the key of one of the 4 headline stats, e.g. impressions.",
      hidden: only("line"),
    }),
    // beforeAfter
    defineField({ name: "before", title: "Before", type: "number", hidden: only("beforeAfter"), validation: requiredWhen("beforeAfter") as never }),
    defineField({ name: "after", title: "After", type: "number", hidden: only("beforeAfter"), validation: requiredWhen("beforeAfter") as never }),
    defineField({ name: "unit", title: "Unit", type: "string", description: "e.g. visits/day", hidden: only("beforeAfter") }),
    defineField({ name: "beforeLabel", title: "Before label", type: "string", hidden: only("beforeAfter") }),
    defineField({ name: "afterLabel", title: "After label", type: "string", hidden: only("beforeAfter") }),
    // funnel
    defineField({
      name: "steps",
      title: "Steps",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      hidden: only("funnel"),
      validation: (r) => r.custom((v, ctx) => ((ctx.parent as Parent)?.kind === "funnel" && (!v || v.length < 2 || v.length > 6) ? "Use 2 to 6 steps" : true)),
    }),
    defineField({ name: "resultValue", title: "Result value", type: "string", description: "e.g. 6% → 11%", hidden: only("funnel") }),
    defineField({ name: "resultLabel", title: "Result label", type: "string", hidden: only("funnel") }),
    // screenshot
    defineField({
      name: "image",
      title: "Screenshot",
      type: "image",
      options: { hotspot: true },
      hidden: only("screenshot"),
      fields: [defineField({ name: "alt", title: "Alt text", type: "string", description: "Describe the image for people who can't see it.", validation: (r) => r.required() })],
      validation: requiredWhen("screenshot") as never,
    }),
  ],
  preview: { select: { title: "caption", subtitle: "kind" } },
});
