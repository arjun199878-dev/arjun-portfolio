import { Reveal } from "../motion/Reveal";
import { ScrollFade } from "../motion/ScrollFade";
import styles from "./SectionHeader.module.css";

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  intro?: string;
  align?: "left" | "center";
  tone?: "light" | "dark";
  id: string;
};

export function SectionHeader({ eyebrow, title, intro, align = "left", tone = "light", id }: SectionHeaderProps) {
  return (
    <ScrollFade className={styles.header}>
    <Reveal className={`${styles.inner} ${align === "center" ? styles.center : ""} ${tone === "dark" ? styles.dark : ""}`}>
      {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
      <h2 id={id} className={styles.title}>
        {title}
      </h2>
      {intro ? <p className={styles.intro}>{intro}</p> : null}
    </Reveal>
    </ScrollFade>
  );
}
