"use client";

import React, { useMemo } from "react";
import type { MetricVerificationStatus } from "@/lib/types";
import { MotionStageFrame } from "../MotionStageFrame";
import { springOvershoot, easeInOutCubic } from "@/lib/motion/easing";

export interface Scene08RollingCounterProps {
  title?: string;
  metricLabel?: string;
  targetValue?: number; // e.g. 12480
  baselineValue?: number; // e.g. 10500
  deltaText?: string; // e.g. "+18% this month"
  verificationStatus?: MetricVerificationStatus;
  sourceNote?: string;
  showFrame?: boolean;
  time?: number;
  className?: string;
}

const DIGIT_HEIGHT = 150;
const DIGIT_FONT_SIZE = 136;

export function Scene08RollingCounterSvg({
  time = 0,
  title = "MARKETING TELEMETRY // UNIFIED KPI ODOMETER",
  metricLabel = "Subscribers",
  targetValue = 12480,
  baselineValue = 10500,
  deltaText = "+18% this month",
}: {
  time?: number;
  title?: string;
  metricLabel?: string;
  targetValue?: number;
  baselineValue?: number;
  deltaText?: string;
}) {
  const t = Math.max(0, Math.min(6.0, time));

  // Compute drum offsets for each digit in "12,480"
  // Digits: [1, 2, 4, 8, 0]
  // Baseline: [1, 0, 5, 0, 0]
  // Higher order digits settle earlier with fewer revolutions;
  // Lower order digits spin through additional cycles before locking with spring overshoot!
  const drumData = useMemo(() => {
    // Digits configuration: [target, baseline, extraSpins, settleStart, duration]
    const configs = [
      { id: "d0", target: 1, base: 1, extraSpins: 0, tStart: 0.8, dur: 0.9 },
      { id: "d1", target: 2, base: 0, extraSpins: 1, tStart: 0.85, dur: 1.1 },
      { id: "d2", target: 4, base: 5, extraSpins: 2, tStart: 0.95, dur: 1.3 },
      { id: "d3", target: 8, base: 0, extraSpins: 3, tStart: 1.05, dur: 1.45 },
      { id: "d4", target: 0, base: 0, extraSpins: 4, tStart: 1.15, dur: 1.55 },
    ];

    return configs.map((c) => {
      let currentVal = c.base;

      if (t < 0.8) {
        currentVal = c.base;
      } else if (t >= 0.8 && t < 2.8) {
        if (t < c.tStart) {
          currentVal = c.base;
        } else {
          const raw = (t - c.tStart) / c.dur;
          const spring = springOvershoot(Math.min(1, raw), 7.0, 5.0);
          const totalDistance = c.extraSpins * 10 + (c.target - c.base);
          currentVal = c.base + totalDistance * spring;
        }
      } else if (t >= 2.8 && t < 5.2) {
        currentVal = c.target;
      } else {
        // Return phase
        const p = (t - 5.2) / 0.8;
        const ease = easeInOutCubic(Math.min(1, Math.max(0, p)));
        currentVal = c.target - (c.target - c.base) * ease;
      }

      return {
        ...c,
        val: currentVal,
        // Y offset inside drum: each digit shift = DIGIT_HEIGHT
        yOffset: -(currentVal % 10) * DIGIT_HEIGHT,
      };
    });
  }, [t]);

  // Delta chip spring entrance (Phase 3: 2.8s to 4.0s)
  let chipOpacity = 0;
  let chipTranslateY = 20;

  if (t < 2.7) {
    chipOpacity = 0;
    chipTranslateY = 20;
  } else if (t >= 2.7 && t < 4.0) {
    const p = (t - 2.7) / 0.8;
    const spring = springOvershoot(Math.min(1, p));
    chipOpacity = Math.min(1, p * 2);
    chipTranslateY = 20 * (1 - spring);
  } else if (t >= 4.0 && t < 5.2) {
    chipOpacity = 1;
    chipTranslateY = 0;
  } else {
    const p = (t - 5.2) / 0.6;
    chipOpacity = Math.max(0, 1 - p);
    chipTranslateY = 15 * p;
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
        <radialGradient id="s8Lighting" cx="540" cy="400" r="500" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#20241C" stopOpacity="0.9" />
          <stop offset="70%" stopColor="#171914" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#0E100C" stopOpacity="0.25" />
        </radialGradient>

        <linearGradient id="s8SpecularBorder" x1="120" y1="120" x2="960" y2="840" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#20241C" stopOpacity="0.95" />
          <stop offset="35%" stopColor="#20241C" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#E8E0D1" stopOpacity="0.08" />
        </linearGradient>

        {/* Aperture vertical cylinder depth shadows */}
        <linearGradient id="apertureMaskGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E8E0D1" stopOpacity="0.18" />
          <stop offset="18%" stopColor="#E8E0D1" stopOpacity="0.0" />
          <stop offset="82%" stopColor="#E8E0D1" stopOpacity="0.0" />
          <stop offset="100%" stopColor="#E8E0D1" stopOpacity="0.18" />
        </linearGradient>

        {/* Clip path for the 5-column mechanical odometer aperture */}
        <clipPath id="odometerClip">
          <rect x="0" y="0" width="580" height={DIGIT_HEIGHT} rx="14" />
        </clipPath>

        <filter id="s8CardShadow" x="60" y="80" width="960" height="780" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="24" stdDeviation="32" floodColor="#E8E0D1" floodOpacity="0.09" />
          <feDropShadow dx="0" dy="6" stdDeviation="12" floodColor="#E8E0D1" floodOpacity="0.05" />
        </filter>

        <filter id="s8Glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect width="1080" height="960" rx="36" fill="url(#s8Lighting)" />

      {/* Outer Registration & Grid Ticks */}
      <g stroke="#E8E0D1" strokeOpacity="0.15" strokeWidth="1.2">
        <path d="M 50 60 L 70 60 M 60 50 L 60 70" />
        <path d="M 1010 60 L 1030 60 M 1020 50 L 1020 70" />
        <path d="M 50 900 L 70 900 M 60 890 L 60 910" />
        <path d="M 1010 900 L 1030 900 M 1020 890 L 1020 910" />
      </g>
      <g fontFamily="var(--font-mono, monospace)" fontSize="11" fill="#C8BFAD" letterSpacing="0.08em">
        <text x="60" y="38">SCENE:08 // MECHANICAL ODOMETER</text>
        <text x="960" y="38" textAnchor="end">PRECISION ROLLING DRUMS</text>
      </g>

      {/* ── PRIMARY FROSTED CARD HOUSING (65% of Stage) ── */}
      <g filter="url(#s8CardShadow)">
        <rect x="120" y="130" width="840" height="640" rx="28" fill="#20241C" fillOpacity="0.84" />
        <rect x="120.5" y="130.5" width="839" height="639" rx="27.5" stroke="url(#s8SpecularBorder)" strokeWidth="1.5" />
      </g>

      {/* Header Info Inside Card */}
      <g transform="translate(160, 180)">
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

        {/* 3 Status Pills */}
        <g transform="translate(0, 18)">
          <rect x="0" y="0" width="136" height="26" rx="13" fill="#171914" stroke="#2E3426" strokeWidth="1" />
          <circle cx="12" cy="13" r="3.5" fill="#A8CC28" />
          <text x="24" y="17" fontFamily="var(--font-mono, monospace)" fontSize="10" fontWeight="600" fill="#E8E0D1">
            GA4 BigQuery Sync
          </text>

          <rect x="146" y="0" width="146" height="26" rx="13" fill="#171914" stroke="#2E3426" strokeWidth="1" />
          <circle cx="12" cy="13" r="3.5" fill="#D8FF3E" />
          <text x="24" y="17" fontFamily="var(--font-mono, monospace)" fontSize="10" fontWeight="600" fill="#E8E0D1">
            Mixpanel Server CAPI
          </text>
        </g>
      </g>

      {/* Metric Context Title */}
      <g transform="translate(160, 290)">
        <text
          x="0"
          y="0"
          fontFamily="var(--font-sans, system-ui, sans-serif)"
          fontSize="24"
          fontWeight="700"
          fill="#E8E0D1"
          letterSpacing="-0.01em"
        >
          {metricLabel}
        </text>
        <text
          x="0"
          y="24"
          fontFamily="var(--font-mono, monospace)"
          fontSize="12"
          fill="#C8BFAD"
        >
          Baseline: {baselineValue.toLocaleString()} → Target: {targetValue.toLocaleString()} active profiles
        </text>
      </g>

      {/* ── MECHANICAL ODOMETER DRUM HOUSING ── */}
      <g transform="translate(160, 360)">
        {/* Outer Beveled Aperture Frame */}
        <rect
          x="-14"
          y="-14"
          width="608"
          height={DIGIT_HEIGHT + 28}
          rx="22"
          fill="#0E100C"
          stroke="#2E3426"
          strokeWidth="1.5"
        />

        {/* Inner Darker Inset Track */}
        <rect
          x="0"
          y="0"
          width="580"
          height={DIGIT_HEIGHT}
          rx="14"
          fill="#20241C"
          stroke="#2E3426"
          strokeWidth="1"
        />

        {/* Vertical Drum Slot Dividers */}
        <g stroke="#2E3426" strokeWidth="1">
          <line x1="90" y1="0" x2="90" y2={DIGIT_HEIGHT} />
          <line x1="180" y1="0" x2="180" y2={DIGIT_HEIGHT} />
          <line x1="240" y1="0" x2="240" y2={DIGIT_HEIGHT} />
          <line x1="330" y1="0" x2="330" y2={DIGIT_HEIGHT} />
          <line x1="420" y1="0" x2="420" y2={DIGIT_HEIGHT} />
          <line x1="510" y1="0" x2="510" y2={DIGIT_HEIGHT} />
        </g>

        {/* Clipped Rolling Digits Container */}
        <g clipPath="url(#odometerClip)">
          {/* Digit Column 0 ("1") */}
          <g transform="translate(45, 0)">
            <g transform={`translate(0, ${drumData[0].yOffset})`}>
              {Array.from({ length: 12 }, (_, idx) => (
                <text
                  key={idx}
                  x="0"
                  y={idx * DIGIT_HEIGHT + 118}
                  fontFamily="var(--font-sans, system-ui, sans-serif)"
                  fontSize={DIGIT_FONT_SIZE}
                  fontWeight="800"
                  fill="#E8E0D1"
                  textAnchor="middle"
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {idx % 10}
                </text>
              ))}
            </g>
          </g>

          {/* Digit Column 1 ("2") */}
          <g transform="translate(135, 0)">
            <g transform={`translate(0, ${drumData[1].yOffset})`}>
              {Array.from({ length: 12 }, (_, idx) => (
                <text
                  key={idx}
                  x="0"
                  y={idx * DIGIT_HEIGHT + 118}
                  fontFamily="var(--font-sans, system-ui, sans-serif)"
                  fontSize={DIGIT_FONT_SIZE}
                  fontWeight="800"
                  fill="#E8E0D1"
                  textAnchor="middle"
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {idx % 10}
                </text>
              ))}
            </g>
          </g>

          {/* Comma Column (Static) */}
          <g transform="translate(210, 118)">
            <text
              x="0"
              y="0"
              fontFamily="var(--font-sans, system-ui, sans-serif)"
              fontSize={DIGIT_FONT_SIZE}
              fontWeight="800"
              fill="#E8E0D1"
              textAnchor="middle"
            >
              ,
            </text>
          </g>

          {/* Digit Column 2 ("4") */}
          <g transform="translate(285, 0)">
            <g transform={`translate(0, ${drumData[2].yOffset})`}>
              {Array.from({ length: 12 }, (_, idx) => (
                <text
                  key={idx}
                  x="0"
                  y={idx * DIGIT_HEIGHT + 118}
                  fontFamily="var(--font-sans, system-ui, sans-serif)"
                  fontSize={DIGIT_FONT_SIZE}
                  fontWeight="800"
                  fill="#E8E0D1"
                  textAnchor="middle"
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {idx % 10}
                </text>
              ))}
            </g>
          </g>

          {/* Digit Column 3 ("8") */}
          <g transform="translate(375, 0)">
            <g transform={`translate(0, ${drumData[3].yOffset})`}>
              {Array.from({ length: 12 }, (_, idx) => (
                <text
                  key={idx}
                  x="0"
                  y={idx * DIGIT_HEIGHT + 118}
                  fontFamily="var(--font-sans, system-ui, sans-serif)"
                  fontSize={DIGIT_FONT_SIZE}
                  fontWeight="800"
                  fill="#E8E0D1"
                  textAnchor="middle"
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {idx % 10}
                </text>
              ))}
            </g>
          </g>

          {/* Digit Column 4 ("0") */}
          <g transform="translate(465, 0)">
            <g transform={`translate(0, ${drumData[4].yOffset})`}>
              {Array.from({ length: 12 }, (_, idx) => (
                <text
                  key={idx}
                  x="0"
                  y={idx * DIGIT_HEIGHT + 118}
                  fontFamily="var(--font-sans, system-ui, sans-serif)"
                  fontSize={DIGIT_FONT_SIZE}
                  fontWeight="800"
                  fill="#E8E0D1"
                  textAnchor="middle"
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {idx % 10}
                </text>
              ))}
            </g>
          </g>
        </g>

        {/* Optical Aperture Convex Cylinder Shadow Overlay */}
        <rect
          x="0"
          y="0"
          width="580"
          height={DIGIT_HEIGHT}
          rx="14"
          fill="url(#apertureMaskGradient)"
          pointerEvents="none"
        />
        {/* Subtle Horizontal Lens Glare */}
        <line x1="10" y1="2" x2="570" y2="2" stroke="#20241C" strokeWidth="2" strokeOpacity="0.8" />
        <line x1="10" y1={DIGIT_HEIGHT - 2} x2="570" y2={DIGIT_HEIGHT - 2} stroke="#2E3426" strokeWidth="1" />
      </g>

      {/* ── TACTILE GREEN CHANGE-INDICATOR CHIP (Springs up in Payoff: 2.8s - 4.0s) ── */}
      <g
        transform={`translate(160, ${560 + chipTranslateY})`}
        opacity={chipOpacity}
      >
        <rect
          x="0"
          y="0"
          width="180"
          height="42"
          rx="21"
          fill="rgba(216, 255, 62, 0.16)"
          stroke="rgba(216, 255, 62, 0.16)"
          strokeWidth="1.2"
        />
        {/* Upward vector arrow */}
        <g transform="translate(18, 14)" stroke="#D8FF3E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="7" y1="13" x2="7" y2="1" />
          <polyline points="2 6 7 1 12 6" />
        </g>
        <text
          x="44"
          y="26"
          fontFamily="var(--font-mono, monospace)"
          fontSize="14"
          fontWeight="700"
          fill="#D8FF3E"
          letterSpacing="0.02em"
        >
          {deltaText}
        </text>
      </g>

      {/* Auxiliary Operational Context Note */}
      <g transform="translate(360, 582)" opacity={chipOpacity}>
        <text
          x="0"
          y="0"
          fontFamily="var(--font-mono, monospace)"
          fontSize="12"
          fill="#C8BFAD"
        >
          Server-Side Event Attributed · Measurement Validated
        </text>
      </g>
    </svg>
  );
}

export function Scene08RollingCounter({
  title = "Topic-Cluster Topology: Performance Odometer",
  metricLabel = "Subscribers",
  targetValue = 12480,
  baselineValue = 10500,
  deltaText = "+18% this month",
  verificationStatus = "illustrative",
  sourceNote = "Illustrative rolling metric odometer demonstrating telemetry and event logging",
  showFrame = true,
  time,
  className,
}: Scene08RollingCounterProps) {
  if (!showFrame && time !== undefined) {
    return (
      <Scene08RollingCounterSvg
        time={time}
        title={title}
        metricLabel={metricLabel}
        targetValue={targetValue}
        baselineValue={baselineValue}
        deltaText={deltaText}
      />
    );
  }

  return (
    <MotionStageFrame
      sceneNumber={8}
      sceneTitle={title}
      dataStatus={verificationStatus}
      sourceNote={sourceNote}
      accessibilitySummary="Scene 8: Precision mechanical digit odometer rolling from 10,500 to 12,480 with an accompanying +18% monthly growth indicator chip."
      className={className}
    >
      {(timeline) => (
        <Scene08RollingCounterSvg
          time={timeline.time}
          title={title}
          metricLabel={metricLabel}
          targetValue={targetValue}
          baselineValue={baselineValue}
          deltaText={deltaText}
        />
      )}
    </MotionStageFrame>
  );
}
