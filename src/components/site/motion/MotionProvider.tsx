"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";
import { DUR, EASE } from "./tokens";

export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={{ duration: DUR.reveal, ease: EASE }}>
      {children}
    </MotionConfig>
  );
}
