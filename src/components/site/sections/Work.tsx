import type { CaseStudy as CaseStudyType, Stat } from "@/lib/content";
import { SectionHeader } from "../ui/SectionHeader";
import { CaseStudy } from "./CaseStudy";
import styles from "./Work.module.css";

type WorkProps = {
  heading: { eyebrow: string; title: string };
  caseStudies: readonly CaseStudyType[];
  stats: readonly Stat[];
};

export function Work({ heading, caseStudies, stats }: WorkProps) {
  return (
    <section id="work" className={styles.section} aria-labelledby="work-title">
      <div className="site-container-wide">
        <SectionHeader id="work-title" eyebrow={heading.eyebrow} title={heading.title} />
        <div className={styles.list}>
          {caseStudies.map((cs, i) => (
            <CaseStudy key={cs.id} study={cs} stats={stats} flip={i % 2 === 1} />
          ))}
        </div>
      </div>
    </section>
  );
}
