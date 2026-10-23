import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Container } from "./Container";
import styles from "./Section.module.css";

type SectionProps = ComponentPropsWithoutRef<"section"> & {
  id: string;
  tone?: "default" | "surface";
  containerSize?: "default" | "narrow" | "wide";
};

/**
 * Anchorable page section with consistent vertical rhythm.
 * Pair with <SectionHeader titleId> and pass `aria-labelledby` for a named landmark.
 */
export function Section({
  tone = "default",
  containerSize = "default",
  className,
  children,
  ...rest
}: SectionProps) {
  return (
    <section className={cn(styles.section, styles[tone], className)} {...rest}>
      <Container size={containerSize}>{children}</Container>
    </section>
  );
}

interface SectionHeaderProps {
  titleId: string;
  eyebrow?: ReactNode;
  title: ReactNode;
  lede?: ReactNode;
  className?: string;
}

export function SectionHeader({ titleId, eyebrow, title, lede, className }: SectionHeaderProps) {
  return (
    <header className={cn(styles.header, className)}>
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h2 id={titleId} className={styles.title}>
        {title}
      </h2>
      {lede ? <p className={styles.lede}>{lede}</p> : null}
    </header>
  );
}
