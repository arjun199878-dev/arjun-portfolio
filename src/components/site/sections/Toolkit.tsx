import type { ToolGroup } from "@/lib/content";
import { Reveal } from "../motion/Reveal";
import { STAGGER, stagger } from "../motion/tokens";
import { SectionHeader } from "../ui/SectionHeader";
import styles from "./Toolkit.module.css";

type ToolkitProps = {
  heading: { eyebrow: string; title: string };
  groups: readonly ToolGroup[];
};

export function Toolkit({ heading, groups }: ToolkitProps) {
  return (
    <section id="toolkit" className={styles.section} aria-labelledby="toolkit-title">
      <div className="site-container-wide">
        <SectionHeader id="toolkit-title" eyebrow={heading.eyebrow} title={heading.title} />
        <ul className={styles.grid}>
          {groups.map((g, i) => (
            <Reveal as="li" key={g.id} delay={stagger(i, STAGGER.tile)} className={`${styles.tile} ${styles[`tile${i + 1}`] ?? ""}`}>
              <h3 className={styles.title}>{g.title}</h3>
              <p className={styles.summary}>{g.summary}</p>
              <p className={styles.tools}>{g.tools.join(" · ")}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
