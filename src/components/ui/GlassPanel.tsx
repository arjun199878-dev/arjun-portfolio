import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";
import styles from "./GlassPanel.module.css";

type GlassPanelProps = ComponentPropsWithoutRef<"div"> & {
  as?: "div" | "section" | "article" | "aside";
  elevation?: "flat" | "raised" | "floating";
  padding?: "none" | "sm" | "md" | "lg";
  radius?: "md" | "lg" | "xl";
};

/** Frosted-glass surface. Falls back to a near-opaque fill without backdrop-filter. */
export function GlassPanel({
  as: Tag = "div",
  elevation = "raised",
  padding = "md",
  radius = "lg",
  className,
  ...rest
}: GlassPanelProps) {
  return (
    <Tag
      className={cn(
        styles.panel,
        styles[elevation],
        styles[`pad-${padding}`],
        styles[`radius-${radius}`],
        className,
      )}
      {...rest}
    />
  );
}
