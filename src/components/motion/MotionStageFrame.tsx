"use client";

import React, { useRef } from "react";
import type { MetricVerificationStatus } from "@/lib/types";
import {
  SixSecondTimeline,
  useSixSecondTimeline,
} from "@/lib/motion/useSixSecondTimeline";
import styles from "./MotionStageFrame.module.css";

export interface MotionStageFrameProps {
  sceneNumber?: number;
  sceneTitle?: string;
  dataStatus?: MetricVerificationStatus;
  sourceNote?: string;
  accessibilitySummary: string;
  showHeader?: boolean;
  autoPlay?: boolean;
  className?: string;
  children: ((timeline: SixSecondTimeline) => React.ReactNode) | React.ReactNode;
}

export function MotionStageFrame({
  accessibilitySummary,
  autoPlay = true,
  className,
  children,
}: MotionStageFrameProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const timeline = useSixSecondTimeline({
    autoPlay,
    durationMs: 6000,
    reducedMotionFrame: 4.5,
    containerRef,
  });

  return (
    <div
      ref={containerRef}
      className={`${styles.stageContainer} ${className || ""}`}
      aria-label={accessibilitySummary}
    >
      <div className="sr-only">{accessibilitySummary}</div>

      {/* Pure Minimalist Stage Frame — Zero Timer / Loop / Hold HUD */}
      <div className={styles.stageFrame}>
        <div className={styles.stageContent}>
          {typeof children === "function" ? children(timeline) : children}
        </div>
      </div>
    </div>
  );
}
