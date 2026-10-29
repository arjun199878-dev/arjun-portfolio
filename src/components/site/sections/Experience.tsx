import type { Role } from "@/lib/content";
import { Reveal } from "../motion/Reveal";
import { SectionHeader } from "../ui/SectionHeader";
import styles from "./Experience.module.css";

type ExperienceProps = {
  heading: { eyebrow: string; title: string };
  roles: readonly Role[];
};

export function Experience({ heading, roles }: ExperienceProps) {
  return (
    <section id="experience" className={styles.section} aria-labelledby="experience-title">
      <div className="site-container">
        <SectionHeader id="experience-title" eyebrow={heading.eyebrow} title={heading.title} />
        <Reveal>
          <ol>
            {roles.map((r) => (
              <li key={r.id} className={styles.role}>
                <div>
                  <p className={`${styles.period} site-numeric`}>{r.period}</p>
                  <p className={styles.location}>{r.location}</p>
                </div>
                <div>
                  <h3 className={styles.title}>
                    {r.title} <span className={styles.company}>— {r.company}</span>
                  </h3>
                  <ul className={styles.points}>
                    {r.points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}
