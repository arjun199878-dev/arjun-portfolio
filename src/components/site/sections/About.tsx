import type { Education } from "@/lib/content";
import { Reveal } from "../motion/Reveal";
import styles from "./About.module.css";

type AboutProps = {
  eyebrow: string;
  headline: string;
  paragraphs: readonly string[];
  educationHeading: string;
  education: readonly Education[];
};

export function About({ eyebrow, headline, paragraphs, educationHeading, education }: AboutProps) {
  return (
    <section id="about" className={styles.section} aria-labelledby="about-title">
      <div className={`site-container-wide ${styles.grid}`}>
        <Reveal>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h2 id="about-title" className={styles.title}>
            {headline}
          </h2>
          {paragraphs.map((p) => (
            <p key={p} className={styles.paragraph}>
              {p}
            </p>
          ))}
        </Reveal>
        <Reveal delay={0.15} className={styles.tile}>
          <h3 className={styles.eduHeading}>{educationHeading}</h3>
          <ul>
            {education.map((e) => (
              <li key={e.degree} className={styles.edu}>
                <p className={styles.degree}>{e.degree}</p>
                <p className={styles.muted}>{e.institution}</p>
                <p className={`${styles.muted} ${styles.period} site-numeric`}>{e.period}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
