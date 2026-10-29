import { About } from "@/components/site/sections/About";
import { Contact } from "@/components/site/sections/Contact";
import { Experience } from "@/components/site/sections/Experience";
import { Hero } from "@/components/site/sections/Hero";
import { NumbersChapter } from "@/components/site/sections/NumbersChapter";
import { Toolkit } from "@/components/site/sections/Toolkit";
import { Work } from "@/components/site/sections/Work";
import type { SectionKey } from "@/lib/content";
import { getSiteContent } from "@/sanity/getSiteContent";

export default async function Home() {
  const { profile, labels, sections, headlineStats, sectionHeadings, caseStudies, roles, toolGroups, education, about, contact } =
    await getSiteContent();
  const visibleSections = sections.filter((s) => s.visible).map((s) => s.key);

  const elements: Record<SectionKey, React.ReactNode> = {
    hero: (
      <Hero
        name={profile.name}
        location={profile.location}
        headline={profile.heroHeadline}
        intro={profile.heroIntro}
        labels={labels}
        visibleSections={visibleSections}
      />
    ),
    results: <NumbersChapter stats={headlineStats} heading={labels.resultsHeading} />,
    work: <Work heading={sectionHeadings.work} caseStudies={caseStudies} stats={headlineStats} />,
    toolkit: <Toolkit heading={sectionHeadings.toolkit} groups={toolGroups} />,
    experience: <Experience heading={sectionHeadings.experience} roles={roles} />,
    about: (
      <About
        eyebrow={sectionHeadings.aboutEyebrow}
        headline={about.headline}
        paragraphs={about.paragraphs}
        educationHeading={labels.educationHeading}
        education={education}
      />
    ),
    contact: (
      <Contact
        headline={contact.headline}
        intro={contact.intro}
        replyNote={contact.replyNote}
        email={profile.email}
        phoneDisplay={profile.phoneDisplay}
        phoneHref={profile.phoneHref}
        whatsappHref={profile.whatsappHref}
        linkedin={profile.linkedin}
        labels={labels}
      />
    ),
  };

  return (
    <>
      {visibleSections.map((key) => (
        <div key={key} style={{ display: "contents" }}>
          {elements[key]}
        </div>
      ))}
    </>
  );
}
