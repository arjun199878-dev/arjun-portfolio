"use client";

import React from "react";
import { MotionStageFrame } from "../MotionStageFrame";
import { springOvershoot, easeInOutCubic } from "@/lib/motion/easing";

export interface Scene04LiveActivityPillProps {
  title?: string;
  showFrame?: boolean;
  time?: number;
  className?: string;
}

export function Scene04LiveActivityPillSvg({ time = 0 }: { time?: number }) {
  const t = Math.max(0, Math.min(6.0, time));

  // Dynamic Pill Expansion Animation (0.8s to 2.8s)
  // Compact: w: 220, h: 48
  // Expanded: w: 720, h: 440
  let expandProgress = 0;
  if (t < 0.8) {
    expandProgress = 0;
  } else if (t >= 0.8 && t < 2.8) {
    const p = (t - 0.8) / 1.8;
    expandProgress = springOvershoot(Math.min(1, p), 6.5, 5.0);
  } else if (t >= 2.8 && t < 5.2) {
    expandProgress = 1.0;
  } else {
    const p = (t - 5.2) / 0.8;
    expandProgress = 1.0 - easeInOutCubic(Math.min(1, Math.max(0, p)));
  }

  const pillWidth = 220 + expandProgress * 500;
  const pillHeight = 48 + expandProgress * 400;

  // Countdown / Hero String: 00:03 -> 00:02 -> 00:01 -> LIVE
  let heroText = "00:03";
  let heroColor = "#8F887A";
  if (t < 1.3) {
    heroText = "00:03";
    heroColor = "#8F887A";
  } else if (t >= 1.3 && t < 1.9) {
    heroText = "00:02";
    heroColor = "#E65D3F";
  } else if (t >= 1.9 && t < 2.5) {
    heroText = "00:01";
    heroColor = "#E65D3F";
  } else if (t >= 2.5 && t < 5.2) {
    heroText = "LIVE";
    heroColor = "#D8FF3E";
  } else {
    heroText = "00:03";
    heroColor = "#8F887A";
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
        <radialGradient id="s4Lighting" cx="540" cy="380" r="500" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#20241C" stopOpacity="0.95" />
          <stop offset="70%" stopColor="#171914" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#0E100C" stopOpacity="0.25" />
        </radialGradient>

        <linearGradient id="s4SpecularBorder" x1="180" y1="120" x2="900" y2="820" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#20241C" stopOpacity="0.95" />
          <stop offset="35%" stopColor="#20241C" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#E8E0D1" stopOpacity="0.08" />
        </linearGradient>

        <filter id="s4CardShadow" x="100" y="80" width="880" height="800" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="24" stdDeviation="32" floodColor="#E8E0D1" floodOpacity="0.09" />
        </filter>

        <filter id="s4PillGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect width="1080" height="960" rx="36" fill="url(#s4Lighting)" />

      {/* Outer Registration & Coordinates */}
      <g stroke="#E8E0D1" strokeOpacity="0.15" strokeWidth="1.2">
        <path d="M 50 60 L 70 60 M 60 50 L 60 70" />
        <path d="M 1010 60 L 1030 60 M 1020 50 L 1020 70" />
        <path d="M 50 900 L 70 900 M 60 890 L 60 910" />
        <path d="M 1010 900 L 1030 900 M 1020 890 L 1020 910" />
      </g>
      <g fontFamily="var(--font-mono, monospace)" fontSize="11" fill="#C8BFAD" letterSpacing="0.08em">
        <text x="60" y="38">SCENE:04 // LIVE ACTIVITY PILL</text>
        <text x="960" y="38" textAnchor="end">DYNAMIC WORKFLOW EXPANSION</text>
      </g>

      {/* ── DEVICE BEZEL CONTAINER (Occupies 65% of Frame) ── */}
      <g filter="url(#s4CardShadow)">
        <rect x="150" y="100" width="780" height="660" rx="32" fill="#20241C" fillOpacity="0.88" />
        <rect x="150.5" y="100.5" width="779" height="659" rx="31.5" stroke="url(#s4SpecularBorder)" strokeWidth="1.5" />
      </g>

      {/* Card Header & Status */}
      <g transform="translate(190, 140)">
        <text x="0" y="0" fontFamily="var(--font-mono, monospace)" fontSize="11" fontWeight="700" fill="#C8BFAD" letterSpacing="0.08em">
          IOS HARDWARE METAPHOR // DYNAMIC ACTIVITY SURFACE
        </text>
      </g>

      {/* ── EXPANDING DYNAMIC PILL (Scene 4 Hero) ── */}
      <g transform="translate(540, 180)">
        {/* Pill Surface */}
        <rect
          x={-pillWidth / 2}
          y={0}
          width={pillWidth}
          height={pillHeight}
          rx={pillHeight / 2 > 36 ? 32 : pillHeight / 2}
          fill="#0E100C" stroke="#D8FF3E"
          strokeWidth="1.5"
          filter="url(#s4PillGlow)"
        />

        {/* Compact View Content (0.0s to 0.8s) */}
        {expandProgress < 0.4 ? (
          <g transform="translate(0, 30)">
            <circle cx="-70" cy="0" r="4.5" fill="#E65D3F">
              <animate attributeName="opacity" values="1;0.3;1" dur="1.4s" repeatCount="indefinite" />
            </circle>
            <text x="-54" y="4" fontFamily="var(--font-mono, monospace)" fontSize="12" fontWeight="700" fill="#E8E0D1">
              STREAM IN {heroText}
            </text>
          </g>
        ) : (
          /* Expanded Activity Content (0.8s to 5.2s) */
          <g transform={`translate(${-pillWidth / 2 + 36}, 36)`}>
            {/* Top Bar inside expanded card */}
            <g transform="translate(0, 0)">
              <circle cx="10" cy="10" r="5" fill="#E65D3F">
                <animate attributeName="r" values="5;7;5" dur="1.2s" repeatCount="indefinite" />
              </circle>
              <text x="26" y="14" fontFamily="var(--font-mono, monospace)" fontSize="11" fontWeight="700" fill="#E65D3F" letterSpacing="0.08em">
                BROADCAST PIPELINE ACTIVE
              </text>
              <text x="540" y="14" fontFamily="var(--font-mono, monospace)" fontSize="11" fill="#8F887A">
                248 Joined
              </text>
            </g>

            {/* Event Title */}
            <g transform="translate(0, 48)">
              <text x="0" y="0" fontFamily="var(--font-sans, system-ui, sans-serif)" fontSize="24" fontWeight="800" fill="#E8E0D1">
                Webinar starts now
              </text>
              <text x="0" y="24" fontFamily="var(--font-mono, monospace)" fontSize="12" fill="#8F887A">
                Live Growth Stream · High-Velocity Acquisition Architecture
              </text>
            </g>

            {/* Hero Countdown / LIVE Numeral (≥120px display scale) */}
            <g transform="translate(0, 160)">
              <text
                x="0"
                y="90"
                fontFamily="var(--font-sans, system-ui, sans-serif)"
                fontSize="120"
                fontWeight="800"
                fill={heroColor}
                letterSpacing="-0.04em"
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {heroText}
              </text>

              <g transform="translate(360, 30)">
                <rect x="0" y="0" width="160" height="32" rx="16" fill="rgba(216, 255, 62, 0.16)" stroke="rgba(216, 255, 62, 0.16)" strokeWidth="1" />
                <circle cx="16" cy="16" r="4" fill="#D8FF3E" />
                <text x="28" y="20" fontFamily="var(--font-mono, monospace)" fontSize="11" fontWeight="700" fill="#D8FF3E">
                  STREAM ONLINE
                </text>
                <text x="0" y="54" fontFamily="var(--font-sans, system-ui, sans-serif)" fontSize="14" fontWeight="700" fill="#E8E0D1">
                  Real-time MCP Webhook Active
                </text>
              </g>
            </g>
          </g>
        )}
      </g>

      {/* ── LOWER DESCRIPTIVE TELEMETRY ── */}
      <g transform="translate(540, 810)">
        <text x="0" y="0" fontFamily="var(--font-mono, monospace)" fontSize="12" fill="#C8BFAD" textAnchor="middle">
          Dynamic Island Spring Expansion · 60fps Spring Interpolation · Event-Driven State
        </text>
      </g>
    </svg>
  );
}

export function Scene04LiveActivityPill({
  title = "Scene 04: Live Activity Pill",
  showFrame = true,
  time,
  className,
}: Scene04LiveActivityPillProps) {
  if (!showFrame && time !== undefined) {
    return <Scene04LiveActivityPillSvg time={time} />;
  }

  return (
    <MotionStageFrame
      sceneNumber={4}
      sceneTitle={title}
      dataStatus="illustrative"
      sourceNote="Illustrative live event stream simulation demonstrating dynamic island pill expansion and countdown"
      accessibilitySummary="Live activity pill visualization expanding from a compact top island into a full live broadcast telemetry card with a countdown ticking into LIVE."
      className={className}
    >
      {(timeline) => <Scene04LiveActivityPillSvg time={timeline.time} />}
    </MotionStageFrame>
  );
}
