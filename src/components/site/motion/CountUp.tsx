"use client";

import { animate, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";
import { formatValue } from "@/lib/format";
import { COUNT_VIEWPORT, DUR, EASE_OUT_EXPO } from "./tokens";

type CountUpProps = {
  from?: number;
  to: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
};

export function CountUp({ from = 0, to, decimals, prefix, suffix, duration = DUR.count, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const finalText = formatValue(to, { decimals, prefix, suffix });

  useEffect(() => {
    const el = ref.current;
    if (reduced || !el) return;
    const opts = { decimals, prefix, suffix };
    el.textContent = formatValue(from, opts);

    let controls: ReturnType<typeof animate> | null = null;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const passedAbove = !entry.isIntersecting && entry.boundingClientRect.bottom < 0;
        const visibleEnough = entry.intersectionRatio >= COUNT_VIEWPORT.amount;
        if (!visibleEnough && !passedAbove) return;
        observer.disconnect();
        // Scrolled past, or a background tab (frames are throttled): land on the final value.
        if (passedAbove || document.hidden) {
          el.textContent = finalText;
          return;
        }
        controls = animate(from, to, {
          duration,
          ease: EASE_OUT_EXPO,
          onUpdate: (v) => {
            el.textContent = formatValue(v, opts);
          },
          onComplete: () => {
            el.textContent = finalText;
          },
        });
      },
      { threshold: [0, COUNT_VIEWPORT.amount] },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      controls?.stop();
      el.textContent = finalText;
    };
  }, [reduced, from, to, decimals, prefix, suffix, duration, finalText]);

  return (
    <>
      <span ref={ref} className={`site-numeric ${className ?? ""}`} aria-hidden="true" suppressHydrationWarning>
        {finalText}
      </span>
      <span className="site-visually-hidden">{finalText}</span>
    </>
  );
}
