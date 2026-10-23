import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import styles from "./Eyebrow.module.css";

interface EyebrowProps {
  children: ReactNode;
  /** Small coral marker before the label. */
  dot?: boolean;
  as?: "p" | "span";
  className?: string;
}

/** Monospaced uppercase label for section kickers and technical metadata. */
export function Eyebrow({ children, dot, as: Tag = "p", className }: EyebrowProps) {
  return (
    <Tag className={cn(styles.eyebrow, className)}>
      {dot ? <span className={styles.dot} aria-hidden="true" /> : null}
      {children}
    </Tag>
  );
}
