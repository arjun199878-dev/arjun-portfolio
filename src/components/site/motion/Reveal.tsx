"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { DIST, DUR, EASE, VIEWPORT } from "./tokens";

type RevealProps = {
  children: ReactNode;
  as?: "div" | "section" | "li" | "article";
  delay?: number;
  className?: string;
};

export function Reveal({ children, as = "div", delay = 0, className }: RevealProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  // Content already on screen at mount renders in its final state, so there's no flash.
  const [inFirstScreen, setInFirstScreen] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) setInFirstScreen(true);
  }, [reduced]);

  if (reduced) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  const MotionTag = motion[as] as typeof motion.div;
  return (
    <MotionTag
      key={inFirstScreen ? "static" : "reveal"}
      ref={ref as React.Ref<HTMLDivElement>}
      className={className}
      initial={inFirstScreen ? false : { opacity: 0, y: DIST.reveal }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: DUR.reveal, ease: EASE, delay }}
    >
      {children}
    </MotionTag>
  );
}
