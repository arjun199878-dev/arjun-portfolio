import type { ReactNode } from "react";
import styles from "./Button.module.css";

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant: "primary" | "link";
  external?: boolean;
  className?: string;
};

export function Button({ href, children, variant, external, className }: ButtonProps) {
  const cls = `${styles[variant]} ${className ?? ""}`;
  return (
    <a href={href} className={cls} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
      {children}
      {variant === "link" ? <span aria-hidden="true"> ›</span> : null}
    </a>
  );
}
