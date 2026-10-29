import type { CaseStudy as CaseStudyType, Stat } from "@/lib/content";
import { Reveal } from "../motion/Reveal";
import { CaseVisual } from "../visuals/CaseVisual";
import styles from "./CaseStudy.module.css";

type CaseStudyProps = {
  study: CaseStudyType;
  stats: readonly Stat[];
  flip?: boolean;
};

export function CaseStudy({ study, stats, flip }: CaseStudyProps) {
  const titleId = `case-${study.id}`;
  const visual = <CaseVisual visual={study.visual} stats={stats} />;

  return (
    <article aria-labelledby={titleId} className={`${styles.case} ${flip ? styles.flip : ""}`}>
      <Reveal className={styles.text}>
        <p className={styles.eyebrow}>{study.eyebrow}</p>
        <h3 id={titleId} className={styles.headline}>
          {study.headline}
        </h3>
        <p className={styles.summary}>{study.summary}</p>
        <ul className={styles.actions}>
          {study.actions.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
        <dl className={styles.results}>
          {study.results.map((r) => (
            <div key={r.label}>
              <dt className={`${styles.resultValue} site-numeric`}>{r.value}</dt>
              <dd className={styles.resultLabel}>{r.label}</dd>
            </div>
          ))}
        </dl>
        <p className={styles.tools}>{study.tools.join(" · ")}</p>
      </Reveal>
      <Reveal delay={0.15} className={styles.visual}>
        {visual}
      </Reveal>
    </article>
  );
}
