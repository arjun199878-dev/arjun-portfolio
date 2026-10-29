import { cacheLife, cacheTag } from "next/cache";
import {
  fallbackContent,
  type CaseStudy,
  type CaseVisual,
  type Education,
  type NavItem,
  type Role,
  type SectionKey,
  type SiteContent,
  type Stat,
  type ToolGroup,
} from "@/lib/content";
import { formatStatDisplay } from "@/lib/format";
import { client } from "./client";
import { siteContentQuery } from "./queries";

/* eslint-disable @typescript-eslint/no-explicit-any */
type Raw = Record<string, any> | null | undefined;

const SECTION_KEYS: SectionKey[] = ["hero", "results", "work", "toolkit", "experience", "about", "contact"];

const str = (v: unknown, fb: string) => (typeof v === "string" && v.trim() ? v : fb);
const strList = (v: unknown, fb: readonly string[]) =>
  Array.isArray(v) && v.length > 0 && v.every((x) => typeof x === "string" && x.trim()) ? (v as string[]) : [...fb];
const list = <T,>(v: unknown, fb: readonly T[], map: (item: any, i: number) => T | null): readonly T[] => {
  if (!Array.isArray(v) || v.length === 0) return fb;
  const mapped = v.map(map).filter((x): x is T => x !== null);
  return mapped.length > 0 ? mapped : fb;
};
const num = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);
const heading = (v: Raw, fb: { eyebrow: string; title: string }) => ({
  eyebrow: typeof v?.eyebrow === "string" ? v.eyebrow : fb.eyebrow,
  title: str(v?.title, fb.title),
});

function mapStats(v: unknown): readonly Stat[] {
  const fb = fallbackContent.headlineStats;
  if (!Array.isArray(v) || v.length !== 4) return fb;
  const ok = v.every((s) => s && str(s.label, "") && str(s.context, "") && num(s.to));
  if (!ok) return fb;
  return v.map((s) => {
    const stat = {
      key: str(s.key?.current ?? s.key, "stat"),
      from: num(s.from) ? s.from : undefined,
      to: s.to as number,
      decimals: num(s.decimals) ? s.decimals : 0,
      prefix: typeof s.prefix === "string" && s.prefix ? s.prefix : undefined,
      suffix: typeof s.suffix === "string" && s.suffix ? s.suffix : undefined,
      label: s.label as string,
      context: s.context as string,
    };
    return { ...stat, display: formatStatDisplay(stat) };
  });
}

function mapSections(v: unknown): SiteContent["sections"] {
  if (!Array.isArray(v) || v.length !== 7) return fallbackContent.sections;
  const keys = v.map((s) => s?.key);
  const valid = new Set(keys).size === 7 && SECTION_KEYS.every((k) => keys.includes(k)) && keys[0] === "hero";
  return valid ? v.map((s) => ({ key: s.key as SectionKey, visible: s.visible !== false })) : fallbackContent.sections;
}

function mapVisual(v: Raw, fb: CaseVisual): CaseVisual {
  if (!v?.kind) return fb;
  const caption = str(v.caption, fb.caption);
  switch (v.kind) {
    case "line": {
      const series = Array.isArray(v.series) && v.series.length > 0 ? v.series.map((p: any) => ({ label: String(p.label), value: Number(p.value) })) : null;
      return { kind: "line", caption, series, fallbackStatKey: str(v.fallbackStatKey, "impressions") };
    }
    case "beforeAfter":
      return num(v.before) && num(v.after)
        ? { kind: "beforeAfter", caption, before: v.before, after: v.after, unit: str(v.unit, ""), beforeLabel: str(v.beforeLabel, "Before"), afterLabel: str(v.afterLabel, "After") }
        : fb;
    case "funnel":
      return Array.isArray(v.steps) && v.steps.length >= 2
        ? { kind: "funnel", caption, steps: v.steps, resultValue: str(v.resultValue, ""), resultLabel: str(v.resultLabel, "") }
        : fb;
    case "screenshot":
      return v.image?.url && num(v.image.width) && num(v.image.height)
        ? { kind: "screenshot", caption, image: { url: v.image.url, alt: str(v.image.alt, caption), width: v.image.width, height: v.image.height } }
        : fb;
    default:
      return fb;
  }
}

export async function getSiteContent(): Promise<SiteContent> {
  "use cache";
  cacheTag("sanity");
  cacheLife("max");

  const fb = fallbackContent;
  if (!client) return fb;

  try {
    const data = await client.fetch<Record<string, any>>(siteContentQuery);
    const s: Raw = data.settings;
    const h: Raw = data.home;

    const profile = {
      name: str(s?.name, fb.profile.name),
      title: str(s?.title, fb.profile.title),
      specialties: str(s?.specialties, fb.profile.specialties),
      location: str(s?.location, fb.profile.location),
      email: str(s?.email, fb.profile.email),
      phoneDisplay: str(s?.phoneDisplay, fb.profile.phoneDisplay),
      phoneHref: str(s?.phoneHref, fb.profile.phoneHref),
      whatsappHref: str(s?.whatsappHref, fb.profile.whatsappHref),
      linkedin: str(s?.linkedin, fb.profile.linkedin),
      linkedinDisplay: str(s?.linkedinDisplay, fb.profile.linkedinDisplay),
      heroHeadline: str(h?.heroHeadline, fb.profile.heroHeadline),
      heroIntro: str(h?.heroIntro, fb.profile.heroIntro),
      summary: str(h?.summary, fb.profile.summary),
    };

    const labels = Object.fromEntries(
      Object.entries(fb.labels).map(([k, v]) => [k, str(s?.labels?.[k], v)]),
    ) as SiteContent["labels"];

    const navItems = list<NavItem>(s?.navItems, fb.navItems, (n) =>
      SECTION_KEYS.includes(n?.section) && str(n?.label, "") ? { section: n.section, label: n.label, href: `#${n.section}` } : null,
    );

    const caseStudies = list<CaseStudy>(data.caseStudies, fb.caseStudies, (c, i) => {
      const f = fb.caseStudies[i] ?? fb.caseStudies[0];
      const results = Array.isArray(c.results) && c.results.length === 3 ? c.results.map((r: any) => ({ value: str(r.value, ""), label: str(r.label, "") })) : f.results;
      return {
        id: str(c._id, f.id).replace(/^caseStudy\./, ""),
        company: str(c.company, f.company),
        period: str(c.period, f.period),
        eyebrow: str(c.eyebrow, f.eyebrow),
        headline: str(c.headline, f.headline),
        summary: str(c.summary, f.summary),
        actions: strList(c.actions, f.actions),
        results,
        tools: strList(c.tools, f.tools),
        visual: mapVisual(c.visual, f.visual),
      };
    });

    const roles = list<Role>(data.roles, fb.roles, (r) =>
      str(r.title, "") && str(r.company, "")
        ? { id: str(r._id, "role").replace(/^role\./, ""), title: r.title, company: r.company, period: str(r.period, ""), location: str(r.location, ""), points: strList(r.points, []) }
        : null,
    );

    const toolGroups = list<ToolGroup>(data.toolGroups, fb.toolGroups, (g) =>
      str(g.title, "") ? { id: str(g._id, "group").replace(/^toolGroup\./, ""), title: g.title, summary: str(g.summary, ""), tools: strList(g.tools, []) } : null,
    );

    const education = list<Education>(data.education, fb.education, (e) =>
      str(e.degree, "") ? { degree: e.degree, institution: str(e.institution, ""), period: str(e.period, "") } : null,
    );

    return {
      profile,
      navItems,
      sections: mapSections(s?.sections),
      labels,
      seo: {
        title: str(s?.seoTitle, fb.seo.title),
        description: str(s?.seoDescription, fb.seo.description),
        ogImageUrl: typeof s?.ogImageUrl === "string" ? s.ogImageUrl : null,
      },
      headlineStats: mapStats(h?.headlineStats),
      sectionHeadings: {
        work: heading(h?.workHeading, fb.sectionHeadings.work),
        toolkit: heading(h?.toolkitHeading, fb.sectionHeadings.toolkit),
        experience: heading(h?.experienceHeading, fb.sectionHeadings.experience),
        aboutEyebrow: str(h?.aboutEyebrow, fb.sectionHeadings.aboutEyebrow),
      },
      caseStudies,
      roles,
      toolGroups,
      education,
      about: { headline: str(h?.aboutHeadline, fb.about.headline), paragraphs: strList(h?.aboutParagraphs, fb.about.paragraphs) },
      contact: {
        headline: str(h?.contactHeadline, fb.contact.headline),
        intro: str(h?.contactIntro, fb.contact.intro),
        replyNote: str(h?.contactReplyNote, fb.contact.replyNote),
      },
    };
  } catch (error) {
    console.error("[sanity] fetch failed, using fallback content:", error instanceof Error ? error.message : error);
    return fb;
  }
}
