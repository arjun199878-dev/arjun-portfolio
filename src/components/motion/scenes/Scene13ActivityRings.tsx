"use client";

import React, { useMemo } from "react";
import type { MetricVerificationStatus } from "@/lib/types";
import { MotionStageFrame } from "../MotionStageFrame";
import { springOvershoot, easeInOutCubic } from "@/lib/motion/easing";

export interface Scene13ActivityRingsProps {
  title?: string;
  centerText?: string;
  verificationStatus?: MetricVerificationStatus;
  sourceNote?: string;
  showFrame?: boolean;
  time?: number;
  className?: string;
}

const CENTER_X = 540;
const CENTER_Y = 460;

const RING_DEFS = [
  {
    id: "outer",
    label: "Product Velocity",
    radius: 260,
    strokeWidth: 30,
    color: "#E65D3F",
    softColor: "rgba(230, 93, 63, 0.2)",
    baseProgress: 0.12,
    staggerStart: 0.8,
    duration: 1.6,
  },
  {
    id: "middle",
    label: "Acquisition Efficiency",
    radius: 212,
    strokeWidth: 30,
    color: "#D8FF3E",
    softColor: "rgba(216, 255, 62, 0.16)",
    baseProgress: 0.08,
    staggerStart: 0.95,
    duration: 1.55,
  },
  {
    id: "inner",
    label: "Automation Coverage",
    radius: 164,
    strokeWidth: 30,
    color: "#A8CC28",
    softColor: "rgba(216, 255, 62, 0.14)",
    baseProgress: 0.15,
    staggerStart: 1.1,
    duration: 1.5,
  },
] as const;

export function Scene13ActivityRingsSvg({
  time = 0,
  title = "STRUCTURED EXECUTION // SYSTEM VELOCITY RINGS",
  centerText = "Goal hit.",
}: {
  time?: number;
  title?: string;
  centerText?: string;
}) {
  const t = Math.max(0, Math.min(6.0, time));

  // Compute ring progress and tip locations
  const ringsData = useMemo(() => {
    return RING_DEFS.map((ring) => {
      const circ = 2 * Math.PI * ring.radius;
      let currentProgress: number;

      if (t < 0.8) {
        currentProgress = ring.baseProgress;
      } else if (t >= 0.8 && t < 2.8) {
        if (t < ring.staggerStart) {
          currentProgress = ring.baseProgress;
        } else {
          const raw = (t - ring.staggerStart) / ring.duration;
          const spring = springOvershoot(Math.min(1, raw), 6.5, 5.2);
          currentProgress = ring.baseProgress + (1.0 - ring.baseProgress) * spring;
        }
      } else if (t >= 2.8 && t < 5.2) {
        currentProgress = 1.0;
      } else {
        const p = (t - 5.2) / 0.8;
        const ease = easeInOutCubic(Math.min(1, Math.max(0, p)));
        currentProgress = 1.0 - (1.0 - ring.baseProgress) * ease;
      }

      // Tip angle in radians starting at -PI / 2 (12 o'clock)
      const angle = -Math.PI / 2 + Math.min(1.0, currentProgress) * Math.PI * 2;
      const tipX = Number((CENTER_X + ring.radius * Math.cos(angle)).toFixed(2));
      const tipY = Number((CENTER_Y + ring.radius * Math.sin(angle)).toFixed(2));

      // Dashoffset for SVG circle
      const strokeDashoffset = Number((circ * (1 - Math.min(1.0, currentProgress))).toFixed(2));

      return {
        ...ring,
        circ: Number(circ.toFixed(2)),
        progress: currentProgress,
        strokeDashoffset,
        tipX,
        tipY,
      };
    });
  }, [t]);

  // Center Hero Typography & State
  let centerPrimary = "Pacing";
  let centerPrimaryColor = "#C8BFAD";
  let centerSecondary = "3 Pipeline Streams";
  let centerScale = 1;

  if (t < 0.8) {
    centerPrimary = "Pacing";
    centerPrimaryColor = "#C8BFAD";
    centerSecondary = "Baseline Ingestion";
    centerScale = 0.95;
  } else if (t >= 0.8 && t < 2.8) {
    const p = (t - 0.8) / 2.0;
    const pct = Math.round(35 + 65 * p);
    centerPrimary = `${pct}%`;
    centerPrimaryColor = "#E8E0D1";
    centerSecondary = "Approaching Target";
    centerScale = 1.0;
  } else if (t >= 2.8 && t < 5.2) {
    centerPrimary = centerText;
    centerPrimaryColor = "#D8FF3E";
    centerSecondary = "3/3 Objectives 100%";
    const p = (t - 2.8) / 0.6;
    centerScale = 1 + 0.08 * springOvershoot(Math.min(1, p));
  } else {
    const p = (t - 5.2) / 0.8;
    centerPrimary = "Cycle Reset";
    centerPrimaryColor = "#C8BFAD";
    centerSecondary = "Re-aligning Tracks";
    centerScale = 1 - 0.05 * p;
  }

  // Apex completion bursts (Phase 3: 2.8s to 3.6s)
  let burstRadius = 0;
  let burstOpacity = 0;
  if (t >= 2.8 && t < 3.8) {
    const burstT = (t - 2.8) / 1.0;
    burstRadius = 10 + burstT * 40;
    burstOpacity = Math.max(0, 1 - burstT * 1.2);
  }

  return (
    <svg
      viewBox="0 0 1080 960"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", height: "100%", display: "block" }}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="s13Lighting" cx="540" cy="460" r="500" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#20241C" stopOpacity="0.9" />
          <stop offset="70%" stopColor="#171914" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#0E100C" stopOpacity="0.25" />
        </radialGradient>

        <linearGradient id="s13SpecularBorder" x1="120" y1="120" x2="960" y2="840" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#20241C" stopOpacity="0.95" />
          <stop offset="35%" stopColor="#20241C" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#E8E0D1" stopOpacity="0.08" />
        </linearGradient>

        <filter id="s13CardShadow" x="80" y="80" width="920" height="800" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="24" stdDeviation="32" floodColor="#E8E0D1" floodOpacity="0.08" />
        </filter>

        <filter id="s13TipGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect width="1080" height="960" rx="36" fill="url(#s13Lighting)" />

      {/* Outer Registration & Grid Ticks */}
      <g stroke="#E8E0D1" strokeOpacity="0.15" strokeWidth="1.2">
        <path d="M 50 60 L 70 60 M 60 50 L 60 70" />
        <path d="M 1010 60 L 1030 60 M 1020 50 L 1020 70" />
        <path d="M 50 900 L 70 900 M 60 890 L 60 910" />
        <path d="M 1010 900 L 1030 900 M 1020 890 L 1020 910" />
      </g>
      <g fontFamily="var(--font-mono, monospace)" fontSize="11" fill="#C8BFAD" letterSpacing="0.08em">
        <text x="60" y="38">SCENE:13 // CONCENTRIC ACTIVITY RINGS</text>
        <text x="960" y="38" textAnchor="end">100% TRIPLE CLOSURE</text>
      </g>

      {/* ── PRIMARY FROSTED CARD HOUSING (65% of Stage Frame) ── */}
      <g filter="url(#s13CardShadow)">
        <rect x="140" y="110" width="800" height="740" rx="28" fill="#20241C" fillOpacity="0.84" />
        <rect x="140.5" y="110.5" width="799" height="739" rx="27.5" stroke="url(#s13SpecularBorder)" strokeWidth="1.5" />
      </g>

      {/* Title Header Inside Card */}
      <g transform="translate(180, 160)">
        <text
          x="0"
          y="0"
          fontFamily="var(--font-mono, monospace)"
          fontSize="12"
          fontWeight="700"
          fill="#C8BFAD"
          letterSpacing="0.1em"
        >
          {title}
        </text>
      </g>

      {/* ── 3 CONCENTRIC ACTIVITY RINGS ── */}
      <g id="concentricRings">
        {/* Background Track Grooves */}
        {ringsData.map((ring) => (
          <circle
            key={`track-${ring.id}`}
            cx={CENTER_X}
            cy={CENTER_Y}
            r={ring.radius}
            fill="none"
            stroke={ring.softColor}
            strokeWidth={ring.strokeWidth}
          />
        ))}

        {/* Dynamic Active Rings */}
        {ringsData.map((ring) => (
          <circle
            key={`active-${ring.id}`}
            cx={CENTER_X}
            cy={CENTER_Y}
            r={ring.radius}
            fill="none"
            stroke={ring.color}
            strokeWidth={ring.strokeWidth}
            strokeLinecap="round"
            strokeDasharray={ring.circ}
            strokeDashoffset={ring.strokeDashoffset}
            transform={`rotate(-90 ${CENTER_X} ${CENTER_Y})`}
          />
        ))}

        {/* Luminous Leading Tips */}
        {ringsData.map((ring) => (
          <g key={`tip-${ring.id}`} transform={`translate(${ring.tipX}, ${ring.tipY})`} filter="url(#s13TipGlow)">
            <circle cx="0" cy="0" r={ring.strokeWidth / 2 - 2} fill="#20241C" />
            <circle cx="0" cy="0" r={ring.strokeWidth / 2 - 6} fill={ring.color} />
          </g>
        ))}

        {/* Geometric Apex Completion Bursts (At 12 o'clock: x=540, y=200..300) */}
        {burstOpacity > 0 && (
          <g transform={`translate(${CENTER_X}, ${CENTER_Y - 260})`} opacity={burstOpacity}>
            <circle cx="0" cy="0" r={burstRadius} fill="none" stroke="#D8FF3E" strokeWidth="2.5" />
            <line x1="-15" y1="0" x2="15" y2="0" stroke="#D8FF3E" strokeWidth="2" strokeLinecap="round" />
            <line x1="0" y1="-15" x2="0" y2="15" stroke="#D8FF3E" strokeWidth="2" strokeLinecap="round" />
          </g>
        )}
      </g>

      {/* ── CENTER HERO TYPOGRAPHY CALLOUT (Inside Concentric Rings) ── */}
      <g
        transform={`translate(${CENTER_X}, ${CENTER_Y}) scale(${centerScale})`}
        style={{ transformOrigin: `${CENTER_X}px ${CENTER_Y}px` }}
      >
        <text
          x="0"
          y="18"
          fontFamily="var(--font-sans, system-ui, sans-serif)"
          fontSize={centerPrimary === centerText ? "64" : "72"}
          fontWeight="800"
          fill={centerPrimaryColor}
          letterSpacing="-0.03em"
          textAnchor="middle"
        >
          {centerPrimary}
        </text>

        <text
          x="0"
          y="52"
          fontFamily="var(--font-mono, monospace)"
          fontSize="12"
          fontWeight="600"
          fill="#C8BFAD"
          letterSpacing="0.05em"
          textAnchor="middle"
        >
          {centerSecondary.toUpperCase()}
        </text>
      </g>

      {/* ── BOTTOM LEGEND STRIP: 3 TRACK COMPLETION CHIPS ── */}
      <g transform="translate(180, 770)">
        {/* Ring 1 Pill: Coral-Orange */}
        <g transform="translate(0, 0)">
          <rect x="0" y="0" width="220" height="38" rx="19" fill="#20241C" stroke="#2E3426" strokeWidth="1" />
          <circle cx="20" cy="19" r="6" fill="#E65D3F" />
          <text x="36" y="17" fontFamily="var(--font-mono, monospace)" fontSize="11" fontWeight="700" fill="#E8E0D1">
            Product Velocity
          </text>
          <text x="36" y="29" fontFamily="var(--font-mono, monospace)" fontSize="10" fill="#C8BFAD">
            {t >= 2.8 && t < 5.2 ? "100% Complete" : "Target: 4 Shipped"}
          </text>
        </g>

        {/* Ring 2 Pill: Positive Green */}
        <g transform="translate(236, 0)">
          <rect x="0" y="0" width="220" height="38" rx="19" fill="#20241C" stroke="#2E3426" strokeWidth="1" />
          <circle cx="20" cy="19" r="6" fill="#D8FF3E" />
          <text x="36" y="17" fontFamily="var(--font-mono, monospace)" fontSize="11" fontWeight="700" fill="#E8E0D1">
            Acquisition CAC
          </text>
          <text x="36" y="29" fontFamily="var(--font-mono, monospace)" fontSize="10" fill="#C8BFAD">
            {t >= 2.8 && t < 5.2 ? "100% Efficient" : "CAC Target Met"}
          </text>
        </g>

        {/* Ring 3 Pill: Data Blue */}
        <g transform="translate(472, 0)">
          <rect x="0" y="0" width="220" height="38" rx="19" fill="#20241C" stroke="#2E3426" strokeWidth="1" />
          <circle cx="20" cy="19" r="6" fill="#A8CC28" />
          <text x="36" y="17" fontFamily="var(--font-mono, monospace)" fontSize="11" fontWeight="700" fill="#E8E0D1">
            Automation Sync
          </text>
          <text x="36" y="29" fontFamily="var(--font-mono, monospace)" fontSize="10" fill="#C8BFAD">
            {t >= 2.8 && t < 5.2 ? "100% Coverage" : "Zero Error Rate"}
          </text>
        </g>
      </g>
    </svg>
  );
}

export function Scene13ActivityRings({
  title = "Structured Schema Graph: Concentric Execution Rings",
  centerText = "Goal hit.",
  verificationStatus = "illustrative",
  sourceNote = "Illustrative target tracking simulation showing multi-track performance convergence",
  showFrame = true,
  time,
  className,
}: Scene13ActivityRingsProps) {
  if (!showFrame && time !== undefined) {
    return (
      <Scene13ActivityRingsSvg
        time={time}
        title={title}
        centerText={centerText}
      />
    );
  }

  return (
    <MotionStageFrame
      sceneNumber={13}
      sceneTitle={title}
      dataStatus={verificationStatus}
      sourceNote={sourceNote}
      accessibilitySummary="Scene 13: Three concentric activity rings in coral-orange, green, and blue sweep clockwise to 100% completion, culminating in a bold 'Goal hit.' center payoff."
      className={className}
    >
      {(timeline) => (
        <Scene13ActivityRingsSvg
          time={timeline.time}
          title={title}
          centerText={centerText}
        />
      )}
    </MotionStageFrame>
  );
}
