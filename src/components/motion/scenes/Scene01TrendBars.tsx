"use client";

import React, { useMemo } from "react";
import type { MetricVerificationStatus } from "@/lib/types";
import { MotionStageFrame } from "../MotionStageFrame";
import { springOvershoot, easeInOutCubic } from "@/lib/motion/easing";

export interface Scene01TrendBarsProps {
  title?: string;
  subtitle?: string;
  heroDelta?: string;
  baselineDelta?: string;
  periodLabels?: readonly string[];
  barPeakHeights?: readonly number[];
  verificationStatus?: MetricVerificationStatus;
  sourceNote?: string;
  showFrame?: boolean;
  /** Direct elapsed time in seconds (0.0 to 6.0) if controlled externally */
  time?: number;
  className?: string;
}

const DEFAULT_BARS = [
  { id: "b0", label: "W01", x: 232, baselineH: 46, defaultPeakH: 80 },
  { id: "b1", label: "W02", x: 328, baselineH: 52, defaultPeakH: 122 },
  { id: "b2", label: "W03", x: 424, baselineH: 48, defaultPeakH: 172 },
  { id: "b3", label: "W04", x: 520, baselineH: 58, defaultPeakH: 224 },
  { id: "b4", label: "W05", x: 616, baselineH: 54, defaultPeakH: 284 },
  { id: "b5", label: "W06", x: 712, baselineH: 64, defaultPeakH: 346 },
  { id: "b6", label: "W07", x: 808, baselineH: 60, defaultPeakH: 412 },
] as const;

const BAR_WIDTH = 50;
const BASELINE_Y = 718;

function catmullRomToBezier(points: readonly { x: number; y: number }[]): string {
  if (points.length < 2) return "";
  let d = `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(i - 1, 0)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(i + 2, points.length - 1)];

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    d += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  }
  return d;
}

export function Scene01TrendBarsSvg({
  time = 0,
  title = "SYSTEM SIMULATION // GROWTH VELOCITY ENGINE",
  subtitle = "Weekly Sign-ups · System Growth Demo",
  heroDelta = "+200%",
  baselineDelta = "+24%",
  periodLabels,
  barPeakHeights,
}: Omit<Scene01TrendBarsProps, "showFrame" | "verificationStatus">) {
  const t = Math.max(0, Math.min(6.0, time));

  const barData = useMemo(() => {
    return DEFAULT_BARS.map((bar, i) => {
      const peakH = barPeakHeights?.[i] ?? bar.defaultPeakH;
      const label = periodLabels?.[i] ?? bar.label;
      let currentHeight: number;

      if (t < 0.8) {
        currentHeight = bar.baselineH;
      } else if (t >= 0.8 && t < 2.8) {
        const tStart = 0.8 + i * 0.13;
        const duration = 0.72;
        if (t < tStart) {
          currentHeight = bar.baselineH;
        } else {
          const rawProgress = (t - tStart) / duration;
          const spring = springOvershoot(rawProgress);
          currentHeight = bar.baselineH + (peakH - bar.baselineH) * spring;
        }
      } else if (t >= 2.8 && t < 5.2) {
        currentHeight = peakH;
      } else {
        const returnProgress = (t - 5.2) / 0.8;
        const ease = easeInOutCubic(Math.min(1, Math.max(0, returnProgress)));
        currentHeight = peakH - (peakH - bar.baselineH) * ease;
      }

      const topY = BASELINE_Y - currentHeight;
      const centerX = bar.x + BAR_WIDTH / 2;

      return {
        ...bar,
        label,
        height: currentHeight,
        topY,
        centerX,
      };
    });
  }, [t, barPeakHeights, periodLabels]);

  const splineData = useMemo(() => {
    const points = barData.map((b) => ({ x: b.centerX, y: b.topY }));
    const curvePath = catmullRomToBezier(points);

    const first = points[0];
    const last = points[points.length - 1];
    const areaPath = `${curvePath} L ${last.x.toFixed(2)} ${BASELINE_Y} L ${first.x.toFixed(2)} ${BASELINE_Y} Z`;

    let revealProgress = 0;
    if (t < 0.8) {
      revealProgress = 0;
    } else if (t >= 0.8 && t < 2.8) {
      revealProgress = Math.min(1, (t - 0.8) / 1.8);
    } else if (t >= 2.8 && t < 5.2) {
      revealProgress = 1;
    } else {
      const retProgress = (t - 5.2) / 0.8;
      revealProgress = Math.max(0, 1 - easeInOutCubic(retProgress));
    }

    const leadBarIndex = Math.min(6, Math.floor(revealProgress * 6));
    const currentLeadBar = barData[leadBarIndex];

    let bounceY = 0;
    let bounceOpacity = 0;
    if (t >= 2.9 && t < 5.2) {
      bounceOpacity = 1;
      if (t < 3.8) {
        const bounceT = (t - 2.9) / 0.9;
        const decay = Math.exp(-3.8 * bounceT);
        const osc = Math.abs(Math.sin(bounceT * Math.PI * 3.5));
        bounceY = -osc * 42 * decay;
      } else {
        bounceY = 0;
      }
    } else if (t >= 5.2) {
      bounceOpacity = Math.max(0, 1 - (t - 5.2) / 0.4);
    }

    return {
      curvePath,
      areaPath,
      revealProgress,
      leadX: currentLeadBar.centerX,
      leadY: currentLeadBar.topY,
      bounceY,
      bounceOpacity,
    };
  }, [barData, t]);

  const ESTIMATED_PATH_LENGTH = 700;
  const strokeDashoffset = ESTIMATED_PATH_LENGTH * (1 - splineData.revealProgress);

  // Dynamic Display Numeral
  let metricStr = baselineDelta;
  let metricFill = "#E8E0D1";
  let statusText = "System Idle";
  let statusColor = "#C8BFAD";

  if (t < 0.8) {
    metricStr = baselineDelta;
    metricFill = "#C8BFAD";
    statusText = "Baseline State";
    statusColor = "#C8BFAD";
  } else if (t >= 0.8 && t < 2.8) {
    const prog = (t - 0.8) / 2.0;
    const baseVal = parseInt(baselineDelta.replace(/[^0-9]/g, ""), 10) || 24;
    const targetVal = parseInt(heroDelta.replace(/[^0-9]/g, ""), 10) || 200;
    const currentVal = Math.round(baseVal + (targetVal - baseVal) * springOvershoot(prog));
    metricStr = `+${Math.min(targetVal, currentVal)}%`;
    metricFill = "#E8E0D1";
    statusText = "Transforming";
    statusColor = "#E65D3F";
  } else if (t >= 2.8 && t < 5.2) {
    metricStr = heroDelta;
    metricFill = "#D8FF3E";
    statusText = "Pipeline Active";
    statusColor = "#D8FF3E";
  } else {
    const prog = (t - 5.2) / 0.8;
    const baseVal = parseInt(baselineDelta.replace(/[^0-9]/g, ""), 10) || 24;
    const targetVal = parseInt(heroDelta.replace(/[^0-9]/g, ""), 10) || 200;
    const currentVal = Math.round(targetVal - (targetVal - baseVal) * easeInOutCubic(prog));
    metricStr = `+${Math.max(baseVal, currentVal)}%`;
    metricFill = "#E8E0D1";
    statusText = "Resetting Cycle";
    statusColor = "#A8CC28";
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
        <radialGradient id="s1StageLighting" cx="540" cy="420" r="480" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#20241C" stopOpacity="0.85" />
          <stop offset="70%" stopColor="#171914" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#0E100C" stopOpacity="0.2" />
        </radialGradient>

        <linearGradient id="s1SpecularBorder" x1="120" y1="110" x2="960" y2="790" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#20241C" stopOpacity="0.95" />
          <stop offset="35%" stopColor="#20241C" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#E8E0D1" stopOpacity="0.08" />
        </linearGradient>

        <linearGradient id="s1BarGradientActive" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#A8CC28" stopOpacity="0.95" />
          <stop offset="40%" stopColor="#7A9918" stopOpacity="0.88" />
          <stop offset="100%" stopColor="#E8E0D1" stopOpacity="0.75" />
        </linearGradient>

        <linearGradient id="s1TrendSplineGradient" x1="230" y1="700" x2="810" y2="300" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#A8CC28" />
          <stop offset="45%" stopColor="#C6ED2E" />
          <stop offset="100%" stopColor="#D8FF3E" />
        </linearGradient>

        <linearGradient id="s1TrendAreaGradient" x1="540" y1="300" x2="540" y2="720" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#D8FF3E" stopOpacity="0.18" />
          <stop offset="60%" stopColor="#A8CC28" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#A8CC28" stopOpacity="0.0" />
        </linearGradient>

        <filter id="s1CardShadow" x="60" y="70" width="960" height="800" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="24" stdDeviation="32" floodColor="#E8E0D1" floodOpacity="0.09" />
          <feDropShadow dx="0" dy="6" stdDeviation="12" floodColor="#E8E0D1" floodOpacity="0.05" />
        </filter>

        <filter id="s1NodeGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect width="1080" height="960" rx="36" fill="url(#s1StageLighting)" />

      {/* Outer Coordinates */}
      <g stroke="#E8E0D1" strokeOpacity="0.16" strokeWidth="1.2">
        <path d="M 50 60 L 70 60 M 60 50 L 60 70" />
        <path d="M 1010 60 L 1030 60 M 1020 50 L 1020 70" />
        <path d="M 50 900 L 70 900 M 60 890 L 60 910" />
        <path d="M 1010 900 L 1030 900 M 1020 890 L 1020 910" />
      </g>
      <g fontFamily="var(--font-mono, monospace)" fontSize="11" fill="#C8BFAD" letterSpacing="0.08em">
        <text x="60" y="38">SYS:1080×960</text>
        <text x="960" y="38" textAnchor="end">FPS:60 · LOOP:6.0S</text>
      </g>

      {/* Primary Frosted-Glass Card (65% of stage) */}
      <g filter="url(#s1CardShadow)">
        <rect x="120" y="110" width="840" height="680" rx="28" fill="#20241C" fillOpacity="0.82" />
        <rect x="120.5" y="110.5" width="839" height="679" rx="27.5" stroke="url(#s1SpecularBorder)" strokeWidth="1.5" />
      </g>

      {/* Header Inside Card */}
      <g transform="translate(160, 150)">
        <text
          x="0"
          y="14"
          fontFamily="var(--font-mono, monospace)"
          fontSize="12"
          fontWeight="700"
          fill="#C8BFAD"
          letterSpacing="0.1em"
        >
          {title}
        </text>

        <g transform="translate(0, 32)">
          <rect x="0" y="0" width="112" height="28" rx="14" fill="#171914" stroke="#2E3426" strokeWidth="1" />
          <circle cx="14" cy="14" r="3.5" fill="#A8CC28" />
          <text x="26" y="18" fontFamily="var(--font-mono, monospace)" fontSize="11" fontWeight="600" fill="#E8E0D1">
            Product UI
          </text>

          <rect x="122" y="0" width="148" height="28" rx="14" fill="#171914" stroke="#2E3426" strokeWidth="1" />
          <circle cx="136" cy="14" r="3.5" fill="#E65D3F" />
          <text x="148" y="18" fontFamily="var(--font-mono, monospace)" fontSize="11" fontWeight="600" fill="#E8E0D1">
            Analytics Pipeline
          </text>

          <rect x="280" y="0" width="144" height="28" rx="14" fill="#171914" stroke="#2E3426" strokeWidth="1" />
          <circle cx="294" cy="14" r="3.5" fill="#D8FF3E" />
          <text x="306" y="18" fontFamily="var(--font-mono, monospace)" fontSize="11" fontWeight="600" fill="#E8E0D1">
            Automation Loop
          </text>
        </g>
      </g>

      {/* Hero Display Typography (≥120px reference) */}
      <g transform="translate(160, 240)">
        <text
          x="0"
          y="88"
          fontFamily="var(--font-sans, system-ui, sans-serif)"
          fontSize="128"
          fontWeight="800"
          fill={metricFill}
          letterSpacing="-0.04em"
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          {metricStr}
        </text>

        <g transform="translate(480, 24)">
          <rect
            x="0"
            y="0"
            width="144"
            height="30"
            rx="15"
            fill="#20241C"
            stroke={statusColor}
            strokeWidth="1.2"
            strokeOpacity="0.4"
          />
          <circle cx="16" cy="15" r="4" fill={statusColor} />
          <text
            x="28"
            y="19"
            fontFamily="var(--font-mono, monospace)"
            fontSize="11"
            fontWeight="700"
            fill="#E8E0D1"
            letterSpacing="0.04em"
          >
            {statusText.toUpperCase()}
          </text>

          <text
            x="0"
            y="54"
            fontFamily="var(--font-sans, system-ui, sans-serif)"
            fontSize="17"
            fontWeight="600"
            fill="#E8E0D1"
          >
            {subtitle}
          </text>
          <text
            x="0"
            y="74"
            fontFamily="var(--font-mono, monospace)"
            fontSize="12"
            fill="#C8BFAD"
          >
            Baseline: 1.2k → Scaled: 3.6k sign-ups / wk
          </text>
        </g>
      </g>

      {/* Grid Lines */}
      <g stroke="#E8E0D1" strokeOpacity="0.06" strokeWidth="1">
        <line x1="200" y1="718" x2="880" y2="718" />
        <line x1="200" y1="618" x2="880" y2="618" strokeDasharray="4 6" />
        <line x1="200" y1="518" x2="880" y2="518" strokeDasharray="4 6" />
        <line x1="200" y1="418" x2="880" y2="418" strokeDasharray="4 6" />
        <line x1="200" y1="318" x2="880" y2="318" strokeDasharray="4 6" />
      </g>

      {/* Spline Area */}
      {splineData.revealProgress > 0.05 && (
        <path
          d={splineData.areaPath}
          fill="url(#s1TrendAreaGradient)"
          opacity={Math.min(1, splineData.revealProgress * 1.5)}
        />
      )}

      {/* 7 Vertical Bars */}
      <g>
        {barData.map((bar, idx) => {
          const isHighest = idx === 6;
          return (
            <g key={bar.id}>
              <rect
                x={bar.x}
                y={bar.topY}
                width={BAR_WIDTH}
                height={bar.height}
                rx="14"
                fill={isHighest ? "#D8FF3E" : "url(#s1BarGradientActive)"}
                opacity={isHighest ? 0.95 : 0.88}
              />
              <rect
                x={bar.x + 2}
                y={bar.topY + 1.5}
                width={BAR_WIDTH - 4}
                height="8"
                rx="4"
                fill="#20241C"
                fillOpacity="0.45"
              />
              <text
                x={bar.centerX}
                y={BASELINE_Y + 24}
                fontFamily="var(--font-mono, monospace)"
                fontSize="12"
                fontWeight="600"
                fill="#C8BFAD"
                textAnchor="middle"
              >
                {bar.label}
              </text>
            </g>
          );
        })}
      </g>

      {/* Glowing Spline */}
      <path
        d={splineData.curvePath}
        fill="none"
        stroke="url(#s1TrendSplineGradient)"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={ESTIMATED_PATH_LENGTH}
        strokeDashoffset={strokeDashoffset}
      />
      <path
        d={splineData.curvePath}
        fill="none"
        stroke="#D8FF3E"
        strokeWidth="10"
        strokeLinecap="round"
        strokeOpacity={splineData.revealProgress > 0.6 ? 0.25 : 0.0}
        strokeDasharray={ESTIMATED_PATH_LENGTH}
        strokeDashoffset={strokeDashoffset}
        filter="url(#s1NodeGlow)"
      />

      {/* Traveling Node */}
      {splineData.revealProgress > 0.02 && (
        <g transform={`translate(${splineData.leadX}, ${splineData.leadY})`} filter="url(#s1NodeGlow)">
          <circle cx="0" cy="0" r="10" fill="#20241C" />
          <circle cx="0" cy="0" r="6" fill="#D8FF3E" />
        </g>
      )}

      {/* Coral-Orange Bouncing Punctuation Accent */}
      {splineData.bounceOpacity > 0 && (
        <g
          transform={`translate(833, ${306 + splineData.bounceY})`}
          opacity={splineData.bounceOpacity}
          filter="url(#s1NodeGlow)"
        >
          <line
            x1="0"
            y1="0"
            x2="0"
            y2={-splineData.bounceY}
            stroke="#E65D3F"
            strokeWidth="1.5"
            strokeDasharray="2 3"
            strokeOpacity="0.6"
          />
          <circle cx="0" cy="0" r="11" fill="#E65D3F" />
          <circle cx="0" cy="0" r="5" fill="#20241C" fillOpacity="0.9" />
        </g>
      )}

      {/* Hold State Shimmer */}
      {t >= 4.0 && t <= 5.2 && (
        <line
          x1="160"
          y1="788"
          x2="920"
          y2="788"
          stroke="#D8FF3E"
          strokeWidth="2"
          strokeOpacity={0.4 + 0.3 * Math.sin(((t - 4.0) / 1.2) * Math.PI)}
        />
      )}
    </svg>
  );
}

export function Scene01TrendBars({
  title = "CleanFanatics: Conversion Flywheel",
  subtitle = "Weekly Sign-ups · Growth Engine",
  heroDelta = "+200%",
  verificationStatus = "illustrative",
  sourceNote = "Illustrative simulation of acquisition momentum and campaign trend velocity",
  showFrame = true,
  time,
  className,
}: Scene01TrendBarsProps) {
  if (!showFrame && time !== undefined) {
    return (
      <Scene01TrendBarsSvg
        time={time}
        title={title}
        subtitle={subtitle}
        heroDelta={heroDelta}
      />
    );
  }

  return (
    <MotionStageFrame
      sceneNumber={1}
      sceneTitle={title}
      dataStatus={verificationStatus}
      sourceNote={sourceNote}
      accessibilitySummary="Scene 1: Seven precision vertical bars spring up sequentially as a glowing trend spline maps growth to +200% weekly sign-ups."
      className={className}
    >
      {(timeline) => (
        <Scene01TrendBarsSvg
          time={timeline.time}
          title={title}
          subtitle={subtitle}
          heroDelta={heroDelta}
        />
      )}
    </MotionStageFrame>
  );
}
