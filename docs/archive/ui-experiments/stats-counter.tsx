"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

export interface StatsCounterProps {
  /** Target numeric value to count up to */
  value: number;
  /** Duration of the count animation in seconds (default: 1.5) */
  duration?: number;
  /** Text or symbol placed before the counter value */
  prefix?: string;
  /** Text or symbol placed after the counter value (e.g. "+", "%") */
  suffix?: string;
  /** Number of decimal places to display (default: 0) */
  decimals?: number;
  /** Format number with locale thousand separators (e.g. 12,000) */
  separator?: boolean;
  /** Margin for the intersection observer trigger */
  inViewMargin?: string;
  /** Additional CSS class names */
  className?: string;
  /** Optional inline styles */
  style?: React.CSSProperties;
}

export function StatsCounter({
  value,
  duration = 1.5,
  prefix = "",
  suffix = "",
  decimals = 0,
  separator = false,
  inViewMargin = "0px",
  className,
  style,
}: StatsCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, {
    once: true,
    margin: inViewMargin as any,
  });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    duration: duration * 1000,
    bounce: 0,
  });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, value, motionValue]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      setDisplayValue(latest);
    });
    return () => unsubscribe();
  }, [springValue]);

  const formattedNumber = separator
    ? Number(displayValue.toFixed(decimals)).toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })
    : displayValue.toFixed(decimals);

  return (
    <span
      ref={ref}
      className={cn("tabular-nums", className)}
      style={{
        fontVariantNumeric: "tabular-nums",
        ...style,
      }}
    >
      {prefix}
      {formattedNumber}
      {suffix}
    </span>
  );
}

export function StatsCounterDemo() {
  return (
    <StatsCounter
      value={12000}
      suffix="+"
      duration={2}
    />
  );
}

export default StatsCounter;
