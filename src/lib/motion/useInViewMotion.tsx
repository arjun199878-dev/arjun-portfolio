"use client";

import React, { useEffect, useRef, useState } from "react";

/**
 * Lightweight Apple-style viewport observer & spring counter hooks.
 * Triggers smooth entrance / count-up animations when elements enter the viewport.
 */
export function useInView<T extends HTMLElement = HTMLDivElement>(
  options: IntersectionObserverInit = { threshold: 0.18, rootMargin: "0px 0px -40px 0px" }
) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  const threshold = options.threshold ?? 0.18;
  const rootMargin = options.rootMargin ?? "0px 0px -40px 0px";

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof window !== "undefined") {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) {
        const id = window.requestAnimationFrame(() => setInView(true));
        return () => window.cancelAnimationFrame(id);
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return { ref, inView };
}

export function useAnimatedNumber(
  target: number,
  inView: boolean,
  durationMs = 1400,
  decimals = 0
): string {
  const [current, setCurrent] = useState<number>(0);

  useEffect(() => {
    if (!inView) return;

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      const id = window.requestAnimationFrame(() => setCurrent(target));
      return () => window.cancelAnimationFrame(id);
    }

    let rafId = 0;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / durationMs);
      // Apple-style expo ease-out: 1 - Math.pow(1 - t, 4)
      const eased = 1 - Math.pow(1 - t, 4);
      setCurrent(target * eased);
      if (t < 1) {
        rafId = window.requestAnimationFrame(tick);
      } else {
        setCurrent(target);
      }
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, [target, inView, durationMs]);

  return current.toFixed(decimals);
}

interface AppleRevealProps {
  children: React.ReactNode;
  delayMs?: number;
  className?: string;
}

export function AppleReveal({ children, delayMs = 0, className = "" }: AppleRevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translate3d(0, 0, 0) scale(1)" : "translate3d(0, 22px, 0) scale(0.99)",
        transition: `opacity 780ms cubic-bezier(0.16, 1, 0.3, 1) ${delayMs}ms, transform 780ms cubic-bezier(0.16, 1, 0.3, 1) ${delayMs}ms`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}
