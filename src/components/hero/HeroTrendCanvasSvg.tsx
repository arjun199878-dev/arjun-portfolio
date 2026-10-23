"use client";

import React, { useMemo } from "react";

export interface HeroTrendCanvasSvgProps {
  /** Elapsed time in seconds (0.000 to 6.000). */
  time: number;
  /** Active phase ID. */
  phaseId: string;
  className?: string;
}

// 7 Bar Baseline & Peak Configurations in 1080x960 reference coordinates
const BAR_CONFIGS = [
  { id: "b0", label: "W01", x: 232, baselineH: 46, peakH: 80 },
  { id: "b1", label: "W02", x: 328, baselineH: 52, peakH: 122 },
  { id: "b2", label: "W03", x: 424, baselineH: 48, peakH: 172 },
  { id: "b3", label: "W04", x: 520, baselineH: 58, peakH: 224 },
  { id: "b4", label: "W05", x: 616, baselineH: 54, peakH: 284 },
  { id: "b5", label: "W06", x: 712, baselineH: 64, peakH: 346 },
  { id: "b6", label: "W07", x: 808, baselineH: 60, peakH: 412 },
] as const;

const BAR_WIDTH = 50;
const BASELINE_Y = 718;

/**
 * Catmull-Rom to Cubic Bézier spline converter.
 * Produces smooth curvature passing precisely through all control points.
 */
function catmullRomToBezier(points: readonly { x: number; y: number }[]): string {
  if (points.length < 2) return "";
  let d = `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(i - 1, 0)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(i + 2, points.length - 1)];

    // Control point 1
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;

    // Control point 2
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    d += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  }
  return d;
}

/**
 * Damped harmonic spring function for natural physical momentum with slight overshoot.
 */
function springOvershoot(progress: number): number {
  const p = Math.max(0, Math.min(1, progress));
  if (p === 0) return 0;
  if (p === 1) return 1;
  // Damped sinusoidal oscillation with ~6% overshoot settling cleanly
  return 1 - Math.exp(-5.5 * p) * Math.cos(6.2 * p);
}

/**
 * Standard cosine ease for smooth return loop.
 */
function easeInOutCubic(x: number): number {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

export function HeroTrendCanvasSvg({ time, phaseId, className }: HeroTrendCanvasSvgProps) {
  const t = Math.max(0, Math.min(6.0, time));

  // 1. Calculate deterministic height for each bar at time t
  const barData = useMemo(() => {
    return BAR_CONFIGS.map((bar, i) => {
      let currentHeight: number;

      if (t < 0.8) {
        // Phase 1: Intro resting baseline
        currentHeight = bar.baselineH;
      } else if (t >= 0.8 && t < 2.8) {
        // Phase 2: Sequential spring rise
        // Stagger: bar 0 starts at 0.8s, bar 6 starts at 0.8 + 6 * 0.12 = 1.52s
        const tStart = 0.8 + i * 0.13;
        const duration = 0.72;
        if (t < tStart) {
          currentHeight = bar.baselineH;
        } else {
          const rawProgress = (t - tStart) / duration;
          const spring = springOvershoot(rawProgress);
          currentHeight = bar.baselineH + (bar.peakH - bar.baselineH) * spring;
        }
      } else if (t >= 2.8 && t < 5.2) {
        // Phase 3 & 4: Settled Peak / 1.2s Hold
        currentHeight = bar.peakH;
      } else {
        // Phase 5: Smooth return to baseline (5.2s - 6.0s = 0.8s duration)
        const returnProgress = (t - 5.2) / 0.8;
        const ease = easeInOutCubic(Math.min(1, Math.max(0, returnProgress)));
        currentHeight = bar.peakH - (bar.peakH - bar.baselineH) * ease;
      }

      const topY = BASELINE_Y - currentHeight;
      const centerX = bar.x + BAR_WIDTH / 2;

      return {
        ...bar,
        height: currentHeight,
        topY,
        centerX,
      };
    });
  }, [t]);

  // 2. Build spline curve path passing through bar tops
  const splineData = useMemo(() => {
    const points = barData.map((b) => ({ x: b.centerX, y: b.topY }));
    const curvePath = catmullRomToBezier(points);

    // Area fill path closing down to baseline
    const first = points[0];
    const last = points[points.length - 1];
    const areaPath = `${curvePath} L ${last.x.toFixed(2)} ${BASELINE_Y} L ${first.x.toFixed(2)} ${BASELINE_Y} Z`;

    // Trend reveal progress (0.8s to 2.8s)
    let revealProgress = 0;
    if (t < 0.8) {
      revealProgress = 0;
    } else if (t >= 0.8 && t < 2.8) {
      revealProgress = Math.min(1, (t - 0.8) / 1.8);
    } else if (t >= 2.8 && t < 5.2) {
      revealProgress = 1;
    } else {
      // Retracts during loop return
      const retProgress = (t - 5.2) / 0.8;
      revealProgress = Math.max(0, 1 - easeInOutCubic(retProgress));
    }

    // Lead node position traveling to Bar 7
    const leadBarIndex = Math.min(6, Math.floor(revealProgress * 6));
    const currentLeadBar = barData[leadBarIndex];

    // Punctuation coral node gravity bounce (Phase 3: 2.9s to 3.8s)
    let bounceY = 0;
    let bounceOpacity = 0;
    if (t >= 2.9 && t < 5.2) {
      bounceOpacity = 1;
      if (t < 3.8) {
        const bounceT = (t - 2.9) / 0.9; // 0 to 1
        const decay = Math.exp(-3.8 * bounceT);
        const osc = Math.abs(Math.sin(bounceT * Math.PI * 3.5));
        bounceY = -osc * 42 * decay;
      } else {
        bounceY = 0; // Settled right above peak
      }
    } else if (t >= 5.2) {
      // Fade out on return
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

  // Total estimated spline path length ~ 650px
  const ESTIMATED_PATH_LENGTH = 700;
  const strokeDashoffset = ESTIMATED_PATH_LENGTH * (1 - splineData.revealProgress);

  return (
    <svg
      viewBox="0 0 1080 960"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="xMidYMid meet"
      data-phase={phaseId}
      aria-hidden="true"
    >
      <defs>
        {/* Subtle architectural radial lighting */}
        <radialGradient
          id="stageLighting"
          cx="540"
          cy="420"
          r="480"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#20241C" stopOpacity="0.85" />
          <stop offset="70%" stopColor="#171914" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#0E100C" stopOpacity="0.2" />
        </radialGradient>

        {/* Card Specular Border Linear Gradient */}
        <linearGradient id="specularBorder" x1="120" y1="110" x2="960" y2="790" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#20241C" stopOpacity="0.95" />
          <stop offset="35%" stopColor="#20241C" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#E8E0D1" stopOpacity="0.08" />
        </linearGradient>

        {/* Bar Gradient: Crisp deep navy to technical blue */}
        <linearGradient id="barGradientActive" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#A8CC28" stopOpacity="0.95" />
          <stop offset="40%" stopColor="#7A9918" stopOpacity="0.88" />
          <stop offset="100%" stopColor="#E8E0D1" stopOpacity="0.75" />
        </linearGradient>

        {/* Spline Glowing Trend Line Gradient: Technical Blue -> Growth Green */}
        <linearGradient id="trendSplineGradient" x1="230" y1="700" x2="810" y2="300" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#A8CC28" />
          <stop offset="45%" stopColor="#C6ED2E" />
          <stop offset="100%" stopColor="#D8FF3E" />
        </linearGradient>

        {/* Spline Area Fill Gradient */}
        <linearGradient id="trendAreaGradient" x1="540" y1="300" x2="540" y2="720" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#D8FF3E" stopOpacity="0.18" />
          <stop offset="60%" stopColor="#A8CC28" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#A8CC28" stopOpacity="0.0" />
        </linearGradient>

        {/* Soft Drop Shadow for Frosted Card */}
        <filter id="cardShadow" x="60" y="70" width="960" height="800" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="24" stdDeviation="32" floodColor="#E8E0D1" floodOpacity="0.09" />
          <feDropShadow dx="0" dy="6" stdDeviation="12" floodColor="#E8E0D1" floodOpacity="0.05" />
        </filter>

        {/* Luminous Glow for Traveling Node */}
        <filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Stage Backdrop Background with soft radial falloff */}
      <rect width="1080" height="960" rx="36" fill="url(#stageLighting)" />

      {/* ── Outer Architectural Registration Marks & Coordinate Ticks ── */}
      <g stroke="#E8E0D1" strokeOpacity="0.16" strokeWidth="1.2">
        {/* Corner registration crosshairs */}
        <path d="M 50 60 L 70 60 M 60 50 L 60 70" />
        <path d="M 1010 60 L 1030 60 M 1020 50 L 1020 70" />
        <path d="M 50 900 L 70 900 L 70 900 M 60 890 L 60 910" />
        <path d="M 1010 900 L 1030 900 M 1020 890 L 1020 910" />
        {/* Subtle architectural stage grid lines */}
        <line x1="120" y1="60" x2="960" y2="60" strokeDasharray="3 6" strokeOpacity="0.1" />
        <line x1="120" y1="900" x2="960" y2="900" strokeDasharray="3 6" strokeOpacity="0.1" />
      </g>

      {/* Outer Stage Coordinate Stamps */}
      <g fontFamily="var(--font-mono, monospace)" fontSize="11" fill="#C8BFAD" letterSpacing="0.08em">
        <text x="60" y="38">SYS:1080×960</text>
        <text x="960" y="38" textAnchor="end">FPS:60 · LOOP:6.0S</text>
      </g>

      {/* ── Secondary Floating Context Chip: Top-Right (MCP API Workflow) ── */}
      <g transform="translate(730, 68)">
        <rect
          width="230"
          height="36"
          rx="18"
          fill="#20241C"
          fillOpacity="0.88"
          stroke="#2E3426"
          strokeWidth="1"
        />
        <circle cx="20" cy="18" r="4.5" fill="#A8CC28">
          <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite" />
        </circle>
        <text
          x="34"
          y="22"
          fontFamily="var(--font-mono, monospace)"
          fontSize="11"
          fontWeight="600"
          fill="#E8E0D1"
          letterSpacing="0.04em"
        >
          EVENT TELEMETRY · 1.4K EPS
        </text>
      </g>

      {/* ── Secondary Floating Context Chip: Left-Flank (Automation Loop) ── */}
      <g transform="translate(68, 480)">
        <rect
          width="180"
          height="36"
          rx="18"
          fill="#20241C"
          fillOpacity="0.88"
          stroke="#2E3426"
          strokeWidth="1"
        />
        <circle cx="18" cy="18" r="4" fill="#D8FF3E" />
        <text
          x="30"
          y="22"
          fontFamily="var(--font-mono, monospace)"
          fontSize="11"
          fontWeight="600"
          fill="#E8E0D1"
          letterSpacing="0.04em"
        >
          PIPELINE: SYNCHRONIZED
        </text>
      </g>

      {/* ── PRIMARY HERO FROSTED-GLASS CARD (Fills 70% of Stage Frame) ── */}
      <g filter="url(#cardShadow)">
        {/* Card Body */}
        <rect
          x="120"
          y="110"
          width="840"
          height="680"
          rx="28"
          fill="#20241C"
          fillOpacity="0.82"
        />
        {/* Crisp Specular Inner Highlight & Border */}
        <rect
          x="120.5"
          y="110.5"
          width="839"
          height="679"
          rx="27.5"
          stroke="url(#specularBorder)"
          strokeWidth="1.5"
        />
      </g>

      {/* Card Header & Input System Pills */}
      <g transform="translate(160, 150)">
        {/* Eyebrow Label */}
        <text
          x="0"
          y="14"
          fontFamily="var(--font-mono, monospace)"
          fontSize="12"
          fontWeight="700"
          fill="#C8BFAD"
          letterSpacing="0.1em"
        >
          SYSTEM SIMULATION // GROWTH VELOCITY ENGINE
        </text>

        {/* 3 Input System Pills */}
        <g transform="translate(0, 32)">
          {/* Pill 1: Product UI */}
          <rect x="0" y="0" width="112" height="28" rx="14" fill="#171914" stroke="#2E3426" strokeWidth="1" />
          <circle cx="14" cy="14" r="3.5" fill="#A8CC28" />
          <text x="26" y="18" fontFamily="var(--font-mono, monospace)" fontSize="11" fontWeight="600" fill="#E8E0D1">
            Product UI
          </text>

          {/* Pill 2: Analytics Pipeline */}
          <rect x="122" y="0" width="148" height="28" rx="14" fill="#171914" stroke="#2E3426" strokeWidth="1" />
          <circle cx="136" cy="14" r="3.5" fill="#E65D3F" />
          <text x="148" y="18" fontFamily="var(--font-mono, monospace)" fontSize="11" fontWeight="600" fill="#E8E0D1">
            Analytics Pipeline
          </text>

          {/* Pill 3: Automation Loop */}
          <rect x="280" y="0" width="144" height="28" rx="14" fill="#171914" stroke="#2E3426" strokeWidth="1" />
          <circle cx="294" cy="14" r="3.5" fill="#D8FF3E" />
          <text x="306" y="18" fontFamily="var(--font-mono, monospace)" fontSize="11" fontWeight="600" fill="#E8E0D1">
            Automation Loop
          </text>
        </g>
      </g>

      {/* ── CARD HERO DISPLAY TYPOGRAPHY (Top Half of Card) ── */}
      {/* 120px+ Reference Numeral, Status & Descriptive Metadata */}
      {/* Handled in SVG for razor-sharp vector scaling at 1080x960 */}
      <g transform="translate(160, 240)">
        {/* Dynamic Display Numeral Calculation */}
        {(() => {
          let metricStr = "+82%";
          let metricFill = "#E8E0D1";
          let statusText = "System Idle";
          let statusColor = "#C8BFAD";

          if (t < 0.8) {
            metricStr = "+82%";
            metricFill = "#C8BFAD";
            statusText = "Baseline State";
            statusColor = "#C8BFAD";
          } else if (t >= 0.8 && t < 2.8) {
            // Rolling numerical counter from +82% to +482%
            const prog = (t - 0.8) / 2.0;
            const currentVal = Math.round(82 + (482 - 82) * springOvershoot(prog));
            metricStr = `+${Math.min(482, currentVal)}%`;
            metricFill = "#E8E0D1";
            statusText = "Transforming";
            statusColor = "#E65D3F";
          } else if (t >= 2.8 && t < 5.2) {
            metricStr = "+482%";
            metricFill = "#D8FF3E";
            statusText = "Confirmed GSC";
            statusColor = "#D8FF3E";
          } else {
            // Returning to baseline
            const prog = (t - 5.2) / 0.8;
            const currentVal = Math.round(482 - (482 - 82) * easeInOutCubic(prog));
            metricStr = `+${Math.max(82, currentVal)}%`;
            metricFill = "#E8E0D1";
            statusText = "Resetting Cycle";
            statusColor = "#A8CC28";
          }

          return (
            <>
              {/* Primary ≥120px Reference Numeral */}
              <text
                x="0"
                y="88"
                fontFamily="var(--font-display, system-ui, sans-serif)"
                fontSize="116"
                fontWeight="800"
                fill={metricFill}
                letterSpacing="-0.04em"
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {metricStr}
              </text>

              {/* Sub-label & Dynamic Status Pill */}
              <g transform="translate(470, 24)">
                {/* Active Status Pill */}
                <rect
                  x="0"
                  y="0"
                  width="156"
                  height="30"
                  rx="4"
                  fill="#0E100C"
                  stroke={statusColor}
                  strokeWidth="1.2"
                  strokeOpacity="0.6"
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

                {/* Metric Context Label */}
                <text
                  x="0"
                  y="54"
                  fontFamily="var(--font-sans, system-ui, sans-serif)"
                  fontSize="16"
                  fontWeight="600"
                  fill="#E8E0D1"
                >
                  Organic Search Impressions · 12M
                </text>
                <text
                  x="0"
                  y="74"
                  fontFamily="var(--font-mono, monospace)"
                  fontSize="12"
                  fill="#C8BFAD"
                >
                  +167% Clicks · ~3x ROAS on ₹10–15L/mo
                </text>
              </g>
            </>
          );
        })()}
      </g>

      {/* ── CARD VISUALIZATION AREA: 7 SPRING BARS + GLOWING TREND SPLINE ── */}
      {/* Chart Grid Lines */}
      <g stroke="#E8E0D1" strokeOpacity="0.06" strokeWidth="1">
        <line x1="200" y1="718" x2="880" y2="718" />
        <line x1="200" y1="618" x2="880" y2="618" strokeDasharray="4 6" />
        <line x1="200" y1="518" x2="880" y2="518" strokeDasharray="4 6" />
        <line x1="200" y1="418" x2="880" y2="418" strokeDasharray="4 6" />
        <line x1="200" y1="318" x2="880" y2="318" strokeDasharray="4 6" />
      </g>

      {/* Area Fill Under Spline */}
      {splineData.revealProgress > 0.05 && (
        <path
          d={splineData.areaPath}
          fill="url(#trendAreaGradient)"
          opacity={Math.min(1, splineData.revealProgress * 1.5)}
        />
      )}

      {/* The 7 Precision Vertical Bars */}
      <g>
        {barData.map((bar, idx) => {
          const isHighest = idx === 6;
          return (
            <g key={bar.id}>
              {/* Vertical Bar Column */}
              <rect
                x={bar.x}
                y={bar.topY}
                width={BAR_WIDTH}
                height={bar.height}
                rx="14"
                fill={isHighest ? "#D8FF3E" : "url(#barGradientActive)"}
                opacity={isHighest ? 0.95 : 0.88}
              />
              {/* Crisp Specular Top Cap Highlight */}
              <rect
                x={bar.x + 2}
                y={bar.topY + 1.5}
                width={BAR_WIDTH - 4}
                height="8"
                rx="4"
                fill="#20241C"
                fillOpacity="0.45"
              />
              {/* Bottom Baseline Period Label */}
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

      {/* The Glowing Trend Spline */}
      <path
        d={splineData.curvePath}
        fill="none"
        stroke="url(#trendSplineGradient)"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={ESTIMATED_PATH_LENGTH}
        strokeDashoffset={strokeDashoffset}
      />

      {/* Secondary Glow Stroke */}
      <path
        d={splineData.curvePath}
        fill="none"
        stroke="#D8FF3E"
        strokeWidth="10"
        strokeLinecap="round"
        strokeOpacity={splineData.revealProgress > 0.6 ? 0.25 : 0.0}
        strokeDasharray={ESTIMATED_PATH_LENGTH}
        strokeDashoffset={strokeDashoffset}
        filter="url(#nodeGlow)"
      />

      {/* Luminous Lead Traveling Node along Trend Spline */}
      {splineData.revealProgress > 0.02 && (
        <g transform={`translate(${splineData.leadX}, ${splineData.leadY})`} filter="url(#nodeGlow)">
          <circle cx="0" cy="0" r="10" fill="#20241C" />
          <circle cx="0" cy="0" r="6" fill="#D8FF3E" />
        </g>
      )}

      {/* Coral-Orange Punctuation Accent Node (Gravity Bouncing in Phase 3) */}
      {splineData.bounceOpacity > 0 && (
        <g
          transform={`translate(833, ${306 + splineData.bounceY})`}
          opacity={splineData.bounceOpacity}
          filter="url(#nodeGlow)"
        >
          {/* Subtle connecting tether to peak */}
          <line x1="0" y1="0" x2="0" y2={-splineData.bounceY} stroke="#E65D3F" strokeWidth="1.5" strokeDasharray="2 3" strokeOpacity="0.6" />
          {/* Accent bouncing sphere */}
          <circle cx="0" cy="0" r="11" fill="#E65D3F" />
          <circle cx="0" cy="0" r="5" fill="#20241C" fillOpacity="0.9" />
        </g>
      )}

      {/* Card Bottom Edge Shimmer / Breathing specular highlight during 1.2s Hold */}
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
