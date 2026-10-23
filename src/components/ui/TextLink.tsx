import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";
import { ArrowRight } from "./icons";
import styles from "./TextLink.module.css";

type TextLinkProps = ComponentPropsWithoutRef<typeof Link> & {
  /** Show a trailing arrow that nudges on hover. */
  arrow?: boolean;
  tone?: "ink" | "muted";
};

export function TextLink({ arrow, tone = "ink", className, children, ...rest }: TextLinkProps) {
  return (
    <Link className={cn(styles.link, styles[tone], className)} {...rest}>
      <span className={styles.label}>{children}</span>
      {arrow ? <ArrowRight className={styles.arrow} /> : null}
    </Link>
  );
}
