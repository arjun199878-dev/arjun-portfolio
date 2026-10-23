"use client";

import React, { useRef } from "react";
import { DataStatusBadge } from "@/components/ui/DataStatusBadge";
import { useSixSecondTimeline } from "@/lib/useSixSecondTimeline";
import { HeroTrendCanvasSvg } from "./HeroTrendCanvasSvg";
import styles from "./HeroMotionStage.module.css";

function PlayIcon() {
  return (
    <svg className={styles.hudButtonIcon} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M4 2.5v11l9-5.5-9-5.5z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg className={styles.hudButtonIcon} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M3.5 2.5h3v11h-3v-11zm6 0h3v11h-3v-11z" />
    </svg>
  );
}

function ReplayIcon() {
  return (
    <svg className={styles.hudButtonIcon} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <path d="M2.5 8a5.5 5.5 0 1 1 1.6 3.9L2 14" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 9.5V14h4.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const PHASE_CLASS_MAP: Record<string, string> = {
  intro: styles.phaseIntro,
  transform: styles.phaseTransform,
  payoff: styles.phasePayoff,
  hold: styles.phaseHold,
  loop: styles.phaseLoop,
};

export function HeroMotionStage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineTrackRef = useRef<HTMLDivElement>(null);

  const {
    time,
    progress,
    isPlaying,
    phase,
    togglePlay,
    replay,
    seek,
  } = useSixSecondTimeline({
    autoPlay: true,
    durationMs: 6000,
    reducedMotionFrame: 4.5,
    containerRef,
  });

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineTrackRef.current) return;
    const rect = timelineTrackRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    seek(ratio * 6.0);
  };

  return (
    <div
      ref={containerRef}
      className={styles.stageWrapper}
      aria-label="Interactive 6-second growth simulation stage"
    >
      {/* Screen-reader descriptive summary */}
      <div className="sr-only">
        Animated 6-second frosted-glass growth chart demonstrating a seven-period trend rising
        to +200% illustrative weekly sign-ups, held for 1.2 seconds before looping cleanly.
      </div>

      {/* 1080x960 Logical Coordinate Reference Stage */}
      <div className={styles.stageFrame}>
        <HeroTrendCanvasSvg
          time={time}
          phaseId={phase.id}
          className={styles.vectorCanvas}
        />
      </div>

      {/* HUD Control Bezel */}
      <div className={styles.hudBar} role="region" aria-label="Motion stage timeline controls">
        <div className={styles.hudControls}>
          <button
            type="button"
            className={styles.hudButton}
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause 6-second motion loop" : "Play 6-second motion loop"}
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
            <span>{isPlaying ? "Pause" : "Play"}</span>
          </button>

          <button
            type="button"
            className={styles.hudButton}
            onClick={replay}
            aria-label="Replay motion loop from beginning"
          >
            <ReplayIcon />
            <span>0.0s</span>
          </button>
        </div>

        {/* Timeline Scrubber & Phase Readout */}
        <div className={styles.timelineSection}>
          <div
            ref={timelineTrackRef}
            className={styles.timelineTrack}
            onClick={handleTrackClick}
            role="slider"
            tabIndex={0}
            aria-label="Timeline scrubber"
            aria-valuemin={0}
            aria-valuemax={6}
            aria-valuenow={Math.round(time * 10) / 10}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") seek(Math.min(6, time + 0.5));
              if (e.key === "ArrowLeft") seek(Math.max(0, time - 0.5));
            }}
          >
            <div
              className={styles.timelineProgress}
              style={{ width: `${Math.min(100, progress * 100)}%` }}
            />
          </div>

          <div className={styles.timelineReadout}>
            <span className={styles.timeVal}>{time.toFixed(1)}s</span>
            <span>/ 6.0s</span>
            <span className={`${styles.phaseBadge} ${PHASE_CLASS_MAP[phase.id] || styles.phaseIntro}`}>
              {phase.label}
            </span>
          </div>
        </div>

        {/* Illustrative System Simulation Data Integrity Pill */}
        <div className={styles.hudBadge}>
          <DataStatusBadge
            status="illustrative"
            sourceNote="Illustrative demonstration model of a product growth telemetry system"
          />
        </div>
      </div>
    </div>
  );
}
