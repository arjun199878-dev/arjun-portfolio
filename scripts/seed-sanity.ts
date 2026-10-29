import { getCliClient } from "sanity/cli";
import { fallbackContent as c } from "../src/lib/content";

const client = getCliClient({ apiVersion: "2026-10-28" });
const slug = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
const keyed = <T,>(items: readonly T[], keyOf: (item: T, i: number) => string) =>
  items.map((item, i) => ({ _key: keyOf(item, i), ...item }));

async function main() {
  const tx = client.transaction();

  tx.createOrReplace({
    _id: "siteSettings",
    _type: "siteSettings",
    name: c.profile.name,
    title: c.profile.title,
    specialties: c.profile.specialties,
    location: c.profile.location,
    email: c.profile.email,
    phoneDisplay: c.profile.phoneDisplay,
    phoneHref: c.profile.phoneHref,
    whatsappHref: c.profile.whatsappHref,
    linkedin: c.profile.linkedin,
    linkedinDisplay: c.profile.linkedinDisplay,
    seoTitle: c.seo.title,
    seoDescription: c.seo.description,
    navItems: c.navItems.map((n) => ({ _key: n.section, _type: "navItem", section: n.section, label: n.label })),
    sections: c.sections.map((s) => ({ _key: s.key, _type: "sectionItem", key: s.key, visible: s.visible })),
    labels: c.labels,
  });

  tx.createOrReplace({
    _id: "homePage",
    _type: "homePage",
    heroHeadline: c.profile.heroHeadline,
    heroIntro: c.profile.heroIntro,
    headlineStats: c.headlineStats.map((s) => ({
      _key: s.key,
      _type: "stat",
      key: { _type: "slug", current: s.key },
      from: s.from,
      to: s.to,
      decimals: s.decimals ?? 0,
      prefix: s.prefix,
      suffix: s.suffix,
      label: s.label,
      context: s.context,
    })),
    workHeading: { _type: "sectionHeading", ...c.sectionHeadings.work },
    toolkitHeading: { _type: "sectionHeading", ...c.sectionHeadings.toolkit },
    experienceHeading: { _type: "sectionHeading", ...c.sectionHeadings.experience },
    aboutEyebrow: c.sectionHeadings.aboutEyebrow,
    aboutHeadline: c.about.headline,
    aboutParagraphs: [...c.about.paragraphs],
    contactHeadline: c.contact.headline,
    contactIntro: c.contact.intro,
    contactReplyNote: c.contact.replyNote,
    summary: c.profile.summary,
  });

  c.caseStudies.forEach((cs, i) => {
    const v = cs.visual;
    const visual =
      v.kind === "line"
        ? { _type: "caseVisual", kind: v.kind, caption: v.caption, fallbackStatKey: v.fallbackStatKey, series: (v.series ?? []).map((p) => ({ _key: slug(p.label), _type: "seriesPoint", ...p })) }
        : v.kind === "screenshot"
          ? null
          : { _type: "caseVisual", ...v };
    if (!visual) return;
    tx.createOrReplace({
      _id: `caseStudy.${cs.id}`,
      _type: "caseStudy",
      order: i * 10,
      company: cs.company,
      period: cs.period,
      eyebrow: cs.eyebrow,
      headline: cs.headline,
      summary: cs.summary,
      actions: cs.actions,
      results: keyed(cs.results, (r) => slug(r.label)).map((r) => ({ _type: "resultItem", ...r })),
      tools: cs.tools,
      visual,
      visible: true,
    });
  });

  c.roles.forEach((r, i) =>
    tx.createOrReplace({ _id: `role.${r.id}`, _type: "role", order: i * 10, title: r.title, company: r.company, period: r.period, location: r.location, points: r.points }),
  );
  c.toolGroups.forEach((g, i) =>
    tx.createOrReplace({ _id: `toolGroup.${g.id}`, _type: "toolGroup", order: i * 10, title: g.title, summary: g.summary, tools: g.tools }),
  );
  c.education.forEach((e, i) =>
    tx.createOrReplace({ _id: `education.${i}`, _type: "education", order: i * 10, degree: e.degree, institution: e.institution, period: e.period }),
  );

  await tx.commit();
  console.log(
    `Seeded: 2 singletons, ${c.caseStudies.length} case studies, ${c.roles.length} roles, ${c.toolGroups.length} tool groups, ${c.education.length} education items.`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
