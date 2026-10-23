import { Section, SectionHeader } from "@/components/layout/Section";
import type { SiteSection } from "@/lib/site";
import styles from "./PlaceholderSection.module.css";

interface PlaceholderSectionProps {
  section: SiteSection;
  index: number;
  /** Short note describing what will fill this space. */
  upcoming: string;
  tone?: "default" | "surface";
}

/** Anchored section shell used until each section is built out. */
export function PlaceholderSection({ section, index, upcoming, tone }: PlaceholderSectionProps) {
  const titleId = `${section.id}-title`;
  const number = String(index).padStart(2, "0");

  return (
    <Section id={section.id} tone={tone} aria-labelledby={titleId}>
      <SectionHeader
        titleId={titleId}
        eyebrow={`${number} / ${section.label}`}
        title={section.title}
        lede={section.lede}
      />
      <div className={styles.reserved}>
        <span className={styles.reservedLabel}>{upcoming}</span>
      </div>
    </Section>
  );
}
