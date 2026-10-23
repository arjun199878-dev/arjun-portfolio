import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Container } from "./Container";
import styles from "./SectionShell.module.css";

interface SectionShellProps extends Omit<ComponentPropsWithoutRef<"section">, "title"> {
  id: string;
  eyebrow?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  tone?: "default" | "surface" | "subtle";
  containerSize?: "default" | "narrow" | "wide";
  children: ReactNode;
}

export function SectionShell({
  id,
  eyebrow,
  title,
  subtitle,
  tone = "default",
  containerSize = "default",
  className,
  children,
  ...rest
}: SectionShellProps) {
  const titleId = `${id}-title`;

  return (
    <section
      id={id}
      aria-labelledby={titleId}
      className={cn(styles.section, styles[tone], className)}
      {...rest}
    >
      <Container size={containerSize}>
        <header className={styles.header}>
          {eyebrow ? <Eyebrow dot>{eyebrow}</Eyebrow> : null}
          <h2 id={titleId} className={styles.title}>
            {title}
          </h2>
          {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
        </header>

        <div className={styles.content}>{children}</div>
      </Container>
    </section>
  );
}
