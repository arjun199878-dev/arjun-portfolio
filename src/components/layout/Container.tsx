import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";
import styles from "./Container.module.css";

type ContainerProps = ComponentPropsWithoutRef<"div"> & {
  size?: "default" | "narrow" | "wide";
};

/** Centred, max-width content column with fluid side gutters. */
export function Container({ size = "default", className, ...rest }: ContainerProps) {
  return <div className={cn(styles.container, styles[size], className)} {...rest} />;
}
