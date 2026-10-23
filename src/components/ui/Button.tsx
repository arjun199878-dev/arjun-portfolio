import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";
import styles from "./Button.module.css";

type Variant = "primary" | "accent" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

interface BaseProps {
  variant?: Variant;
  size?: Size;
  /** Trailing icon; decorative, hidden from assistive tech. */
  icon?: ReactNode;
  className?: string;
  children: ReactNode;
}

type LinkButtonProps = BaseProps &
  Omit<ComponentPropsWithoutRef<typeof Link>, keyof BaseProps | "href"> & { href: string };

type NativeButtonProps = BaseProps &
  Omit<ComponentPropsWithoutRef<"button">, keyof BaseProps> & { href?: undefined };

export type ButtonProps = LinkButtonProps | NativeButtonProps;

function Content({ children, icon }: Pick<BaseProps, "children" | "icon">) {
  return (
    <>
      <span>{children}</span>
      {icon ? (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      ) : null}
    </>
  );
}

/** Renders a Next.js link when given `href`, otherwise a native button. */
export function Button(props: ButtonProps) {
  if (props.href !== undefined) {
    const { variant = "primary", size = "md", icon, className, children, ...rest } = props;
    return (
      <Link className={cn(styles.button, styles[variant], styles[size], className)} {...rest}>
        <Content icon={icon}>{children}</Content>
      </Link>
    );
  }

  const {
    variant = "primary",
    size = "md",
    icon,
    className,
    children,
    type = "button",
    ...rest
  } = props;
  return (
    <button
      type={type}
      className={cn(styles.button, styles[variant], styles[size], className)}
      {...rest}
    >
      <Content icon={icon}>{children}</Content>
    </button>
  );
}
