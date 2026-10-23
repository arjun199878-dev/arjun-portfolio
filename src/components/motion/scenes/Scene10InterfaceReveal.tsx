"use client";

import React from "react";
import { MotionStageFrame } from "../MotionStageFrame";
import { springOvershoot, easeInOutCubic } from "@/lib/motion/easing";

export interface Scene10InterfaceRevealProps {
  title?: string;
  showFrame?: boolean;
  time?: number;
  className?: string;
}

export function Scene10InterfaceRevealSvg({ time = 0 }: { time?: number }) {
  const t = Math.max(0, Math.min(6.0, time));

  // Laser wipe across screen (x: 230 to 850, span = 620px)
  let wipeProgress = 0;
  if (t < 0.8) {
    wipeProgress = 0;
  } else if (t >= 0.8 && t < 2.8) {
    const p = (t - 0.8) / 1.8;
    wipeProgress = springOvershoot(Math.min(1, p), 6.5, 5.0);
  } else if (t >= 2.8 && t < 5.2) {
    wipeProgress = 1.0;
  } else {
    const p = (t - 5.2) / 0.8;
    wipeProgress = 1.0 - easeInOutCubic(Math.min(1, Math.max(0, p)));
  }

  const wipeX = 230 + Math.max(0, Math.min(1, wipeProgress)) * 620;

  // Ring chart in full color dashboard
  const ringProgress = Math.min(1.0, wipeProgress);

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
        <radialGradient id="s10Lighting" cx="540" cy="400" r="500" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#20241C" stopOpacity="0.95" />
          <stop offset="70%" stopColor="#171914" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#0E100C" stopOpacity="0.25" />
        </radialGradient>

        <linearGradient id="s10SpecularBorder" x1="180" y1="100" x2="900" y2="860" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#20241C" stopOpacity="0.95" />
          <stop offset="35%" stopColor="#20241C" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#E8E0D1" stopOpacity="0.08" />
        </linearGradient>

        {/* Clip paths for wireframe vs full color layers */}
        <clipPath id="s10WireframeClip">
          <rect x={wipeX} y="110" width={850 - wipeX + 20} height="700" />
        </clipPath>

        <clipPath id="s10FullColorClip">
          <rect x="230" y="110" width={Math.max(0, wipeX - 230)} height="700" />
        </clipPath>

        <filter id="s10CardShadow" x="160" y="70" width="760" height="780" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="24" stdDeviation="32" floodColor="#E8E0D1" floodOpacity="0.08" />
        </filter>

        <filter id="s10LaserGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect width="1080" height="960" rx="36" fill="url(#s10Lighting)" />

      {/* Outer Registration & Coordinates */}
      <g stroke="#E8E0D1" strokeOpacity="0.15" strokeWidth="1.2">
        <path d="M 50 60 L 70 60 M 60 50 L 60 70" />
        <path d="M 1010 60 L 1030 60 M 1020 50 L 1020 70" />
        <path d="M 50 900 L 70 900 M 60 890 L 60 910" />
        <path d="M 1010 900 L 1030 900 M 1020 890 L 1020 910" />
      </g>
      <g fontFamily="var(--font-mono, monospace)" fontSize="11" fill="#C8BFAD" letterSpacing="0.08em">
        <text x="60" y="38">SCENE:10 // APP INTERFACE REVEAL</text>
        <text x="960" y="38" textAnchor="end">BLUEPRINT TO HIGH-CRAFT WIPE</text>
      </g>

      {/* ── LAYER 1: ARCHITECTURAL PENCIL-LINE BLUEFRAME WIREFRAME ── */}
      <g clipPath="url(#s10WireframeClip)" filter="url(#s10CardShadow)">
        <rect x="230" y="110" width="620" height="700" rx="28" fill="#171914" stroke="#2E3426" strokeWidth="1.5" strokeDasharray="5 5" />

        {/* Blueprint Wireframe Content */}
        <g transform="translate(280, 160)" stroke="#2E3426" strokeWidth="1">
          <text x="0" y="0" fontFamily="var(--font-mono, monospace)" fontSize="11" fill="#C8BFAD" stroke="none">
            [ARCHITECTURAL BLUEPRINT SCHEMA]
          </text>
          <text x="0" y="28" fontFamily="var(--font-sans, system-ui, sans-serif)" fontSize="24" fontWeight="700" fill="#C8BFAD" stroke="none">
            Daily Focus
          </text>

          {/* Wireframe Ring placeholder */}
          <circle cx="260" cy="180" r="90" fill="none" strokeDasharray="4 6" />

          {/* Wireframe KPI card boxes */}
          <rect x="0" y="320" width="240" height="120" rx="14" fill="none" strokeDasharray="3 3" />
          <rect x="260" y="320" width="240" height="120" rx="14" fill="none" strokeDasharray="3 3" />

          <line x1="0" y1="480" x2="500" y2="480" strokeDasharray="2 4" />
        </g>
      </g>

      {/* ── LAYER 2: FULL-COLOR FROSTED GLASS INTERFACE ── */}
      <g clipPath="url(#s10FullColorClip)" filter="url(#s10CardShadow)">
        <rect x="230" y="110" width="620" height="700" rx="28" fill="#20241C" fillOpacity="0.94" />
        <rect x="230.5" y="110.5" width="619" height="699" rx="27.5" stroke="url(#s10SpecularBorder)" strokeWidth="1.5" />

        {/* Full-Color UI Content */}
        <g transform="translate(280, 160)">
          {/* Header */}
          <text x="0" y="0" fontFamily="var(--font-mono, monospace)" fontSize="11" fontWeight="700" fill="#C8BFAD" letterSpacing="0.08em">
            EXECUTIVE TELEMETRY // PRODUCT DASHBOARD
          </text>
          <text x="0" y="28" fontFamily="var(--font-sans, system-ui, sans-serif)" fontSize="26" fontWeight="800" fill="#E8E0D1">
            Daily Focus
          </text>

          {/* Hero Ring & 92% Focus Numeral (≥120px scale) */}
          <g transform="translate(250, 190)">
            <circle cx="0" cy="0" r="95" fill="none" stroke="#2E3426" strokeWidth="18" />
            <circle
              cx="0"
              cy="0"
              r="95"
              fill="none"
              stroke="#D8FF3E"
              strokeWidth="18"
              strokeLinecap="round"
              strokeDasharray="597"
              strokeDashoffset={597 * (1 - 0.92 * ringProgress)}
              transform="rotate(-90)"
            />
            {/* Center Hero Numeral (92%) */}
            <text
              x="0"
              y="22"
              fontFamily="var(--font-sans, system-ui, sans-serif)"
              fontSize="68"
              fontWeight="800"
              fill="#E8E0D1"
              textAnchor="middle"
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              92%
            </text>
            <text x="0" y="48" fontFamily="var(--font-mono, monospace)" fontSize="11" fontWeight="700" fill="#D8FF3E" textAnchor="middle">
              ALIGNMENT INDEX
            </text>
          </g>

          {/* Two KPI Summary Cards */}
          <g transform="translate(0, 340)">
            {/* Card 1 */}
            <rect x="0" y="0" width="240" height="130" rx="16" fill="#171914" stroke="#2E3426" strokeWidth="1" />
            <text x="20" y="28" fontFamily="var(--font-mono, monospace)" fontSize="11" fill="#C8BFAD">
              Deep Work Target
            </text>
            <text x="20" y="76" fontFamily="var(--font-sans, system-ui, sans-serif)" fontSize="44" fontWeight="800" fill="#E8E0D1">
              4.5h
            </text>
            <text x="20" y="104" fontFamily="var(--font-mono, monospace)" fontSize="11" fill="#D8FF3E" fontWeight="600">
              ✓ Focus Window Met
            </text>

            {/* Card 2 */}
            <rect x="260" y="0" width="240" height="130" rx="16" fill="#171914" stroke="#2E3426" strokeWidth="1" />
            <text x="20" y="28" fontFamily="var(--font-mono, monospace)" fontSize="11" fill="#C8BFAD">
              Systems Shipped
            </text>
            <text x="20" y="76" fontFamily="var(--font-sans, system-ui, sans-serif)" fontSize="44" fontWeight="800" fill="#A8CC28">
              12
            </text>
            <text x="20" y="104" fontFamily="var(--font-mono, monospace)" fontSize="11" fill="#A8CC28" fontWeight="600">
              Production Verified
            </text>
          </g>
        </g>
      </g>

      {/* ── VERTICAL GLOWING LASER WIPE BAR (Scene 10 Mechanics) ── */}
      {wipeProgress > 0.02 && wipeProgress < 0.98 && (
        <g transform={`translate(${wipeX}, 110)`}>
          <line x1="0" y1="0" x2="0" y2="700" stroke="#E65D3F" strokeWidth="4" filter="url(#s10LaserGlow)" />
          <line x1="0" y1="0" x2="0" y2="700" stroke="#20241C" strokeWidth="1.5" />
          <circle cx="0" cy="12" r="6" fill="#E65D3F" />
          <circle cx="0" cy="688" r="6" fill="#E65D3F" />
        </g>
      )}

      {/* ── LOWER HERO READOUT (≥120px display scale) ── */}
      <g transform="translate(540, 850)">
        <text
          x="0"
          y="40"
          fontFamily="var(--font-sans, system-ui, sans-serif)"
          fontSize="120"
          fontWeight="800"
          fill={t >= 2.8 && t < 5.2 ? "#D8FF3E" : "#2E3426"}
          letterSpacing="-0.04em"
          textAnchor="middle"
        >
          {t >= 2.8 && t < 5.2 ? "92%" : "Wireframe"}
        </text>
      </g>
    </svg>
  );
}

export function Scene10InterfaceReveal({
  title = "Scene 10: App Interface Reveal",
  showFrame = true,
  time,
  className,
}: Scene10InterfaceRevealProps) {
  if (!showFrame && time !== undefined) {
    return <Scene10InterfaceRevealSvg time={time} />;
  }

  return (
    <MotionStageFrame
      sceneNumber={10}
      sceneTitle={title}
      dataStatus="illustrative"
      sourceNote="Illustrative interface reveal simulation transitioning an architectural blueprint wireframe to a full-color dashboard via vertical laser wipe"
      accessibilitySummary="App interface reveal visualization where a glowing vertical laser wipe sweeps across a wireframe to reveal the completed Daily Focus dashboard."
      className={className}
    >
      {(timeline) => <Scene10InterfaceRevealSvg time={timeline.time} />}
    </MotionStageFrame>
  );
}
