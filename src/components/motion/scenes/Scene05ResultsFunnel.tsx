"use client";

import React, { useMemo } from "react";
import type { MetricVerificationStatus } from "@/lib/types";
import { MotionStageFrame } from "../MotionStageFrame";
import { springOvershoot, easeInOutCubic } from "@/lib/motion/easing";

export interface Scene05ResultsFunnelProps {
  title?: string;
  heroOutcome?: string;
  heroLabel?: string;
  verificationStatus?: MetricVerificationStatus;
  sourceNote?: string;
  showFrame?: boolean;
  time?: number;
  className?: string;
}

// 96 Deterministic data particles with precalculated trajectory seeds
interface ParticleSeed {
  id: number;
  color: string;
  radius: number;
  startAngle: number;
  radialDist: number;
  delayOffset: number;
  speedMultiplier: number;
}

const PARTICLES: ParticleSeed[] = Array.from({ length: 96 }, (_, i) => {
  const colors = ["#A8CC28", "#E65D3F", "#D8FF3E", "#7A9918"];
  return {
    id: i,
    color: colors[i % colors.length],
    radius: 2.2 + ((i * 7) % 3.5),
    startAngle: (i * 137.5 * Math.PI) / 180,
    radialDist: 40 + ((i * 19) % 210),
    delayOffset: ((i * 31) % 100) / 100, // 0 to 1 stagger
    speedMultiplier: 0.85 + ((i * 13) % 40) / 100,
  };
});

export function Scene05ResultsFunnelSvg({
  time = 0,
  title = "3D CONVERSION ARCHITECTURE // STREAM SIMULATION",
  heroOutcome = "600",
  heroLabel = "sales",
}: {
  time?: number;
  title?: string;
  heroOutcome?: string;
  heroLabel?: string;
}) {
  const t = Math.max(0, Math.min(6.0, time));

  // Compute Funnel Stream Progress
  // 0.0s - 0.8s: Intro
  // 0.8s - 2.8s: Transform (Particles stream & funnel illuminates)
  // 2.8s - 4.0s: Payoff (600 counter locks + stage pills illuminate)
  // 4.0s - 5.2s: Hold (1.2s)
  // 5.2s - 6.0s: Reset cleanly

  // Counter animation
  let counterVal = 0;
  let counterColor = "#E8E0D1";
  let beamOpacity = 0;

  if (t < 0.8) {
    counterVal = 0;
    counterColor = "#C8BFAD";
    beamOpacity = 0.05;
  } else if (t >= 0.8 && t < 2.8) {
    const p = (t - 0.8) / 2.0;
    const target = parseInt(heroOutcome, 10) || 600;
    counterVal = Math.round(target * springOvershoot(p));
    counterColor = "#E8E0D1";
    beamOpacity = 0.2 + 0.6 * p;
  } else if (t >= 2.8 && t < 5.2) {
    counterVal = parseInt(heroOutcome, 10) || 600;
    counterColor = "#D8FF3E";
    beamOpacity = 0.95;
  } else {
    const p = (t - 5.2) / 0.8;
    const target = parseInt(heroOutcome, 10) || 600;
    counterVal = Math.round(target * (1 - easeInOutCubic(p)));
    counterColor = "#E8E0D1";
    beamOpacity = Math.max(0.05, 0.95 * (1 - p));
  }

  // Active Particle Positions
  const activeParticles = useMemo(() => {
    return PARTICLES.map((pt) => {
      let x = 540;
      let y = 160;
      let opacity = 0;

      if (t < 0.8) {
        // Idle gentle hover above top rim
        const hover = Math.sin(t * 3 + pt.id) * 6;
        x = 540 + Math.cos(pt.startAngle) * pt.radialDist * 0.9;
        y = 140 + Math.sin(pt.startAngle) * 26 + hover;
        opacity = 0.35;
      } else if (t >= 0.8 && t < 2.8) {
        // Spiraling down through funnel
        const animT = (t - 0.8) / 2.0; // 0 to 1
        // Progress of this particle factoring delay
        const ptProgress = Math.max(
          0,
          Math.min(1, (animT - pt.delayOffset * 0.4) * pt.speedMultiplier * 1.5)
        );

        // Height from y=140 to y=620 (funnel outlet)
        y = 140 + ptProgress * 480;

        // Radius narrows from 240 down to 18
        const currentRadius = 240 * (1 - ptProgress * 0.92);
        const spiralAngle = pt.startAngle + ptProgress * Math.PI * 5;

        x = 540 + Math.cos(spiralAngle) * currentRadius;
        opacity = ptProgress > 0 && ptProgress < 0.98 ? 0.85 : 0.2;
      } else if (t >= 2.8 && t < 5.2) {
        // Hold state: continuous steady stream into collector
        const loopLocalT = (t - 2.8) * 1.5;
        const ptProgress = ((loopLocalT + pt.delayOffset) % 1.0);
        y = 150 + ptProgress * 470;
        const currentRadius = 230 * (1 - ptProgress * 0.9);
        const spiralAngle = pt.startAngle + ptProgress * Math.PI * 4;
        x = 540 + Math.cos(spiralAngle) * currentRadius;
        opacity = 0.75;
      } else {
        // Resetting
        const resetT = (t - 5.2) / 0.8;
        x = 540 + Math.cos(pt.startAngle) * pt.radialDist * (1 - resetT * 0.3);
        y = 140 + (1 - resetT) * 100;
        opacity = Math.max(0.1, 0.7 * (1 - resetT));
      }

      return {
        ...pt,
        x,
        y,
        opacity,
      };
    });
  }, [t]);

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
        {/* Soft radial backdrop illumination */}
        <radialGradient id="s5Lighting" cx="540" cy="400" r="500" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#20241C" stopOpacity="0.9" />
          <stop offset="70%" stopColor="#171914" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#0E100C" stopOpacity="0.25" />
        </radialGradient>

        {/* 3D Glass Funnel Shading: Translucent layered frosted gradients */}
        <linearGradient id="funnelTier1Glass" x1="270" y1="160" x2="810" y2="300" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#20241C" stopOpacity="0.7" />
          <stop offset="35%" stopColor="#A8CC28" stopOpacity="0.12" />
          <stop offset="70%" stopColor="#20241C" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#E8E0D1" stopOpacity="0.1" />
        </linearGradient>

        <linearGradient id="funnelTier2Glass" x1="350" y1="300" x2="730" y2="440" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#20241C" stopOpacity="0.75" />
          <stop offset="40%" stopColor="#E65D3F" stopOpacity="0.15" />
          <stop offset="75%" stopColor="#20241C" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#E8E0D1" stopOpacity="0.12" />
        </linearGradient>

        <linearGradient id="funnelTier3Glass" x1="420" y1="440" x2="660" y2="580" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#20241C" stopOpacity="0.8" />
          <stop offset="40%" stopColor="#D8FF3E" stopOpacity="0.2" />
          <stop offset="80%" stopColor="#20241C" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#E8E0D1" stopOpacity="0.15" />
        </linearGradient>

        {/* Concentrated bottom beam gradient */}
        <linearGradient id="convergedBeam" x1="540" y1="580" x2="540" y2="700" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#D8FF3E" stopOpacity={beamOpacity} />
          <stop offset="70%" stopColor="#C6ED2E" stopOpacity={beamOpacity * 0.8} />
          <stop offset="100%" stopColor="#A8CC28" stopOpacity="0.0" />
        </linearGradient>

        <filter id="s5Glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <filter id="s5CardShadow" x="60" y="60" width="960" height="840" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="20" stdDeviation="28" floodColor="#E8E0D1" floodOpacity="0.08" />
        </filter>
      </defs>

      <rect width="1080" height="960" rx="36" fill="url(#s5Lighting)" />

      {/* Outer Registration & Grid Ticks */}
      <g stroke="#E8E0D1" strokeOpacity="0.15" strokeWidth="1.2">
        <path d="M 50 60 L 70 60 M 60 50 L 60 70" />
        <path d="M 1010 60 L 1030 60 M 1020 50 L 1020 70" />
        <path d="M 50 900 L 70 900 M 60 890 L 60 910" />
        <path d="M 1010 900 L 1030 900 M 1020 890 L 1020 910" />
      </g>
      <g fontFamily="var(--font-mono, monospace)" fontSize="11" fill="#C8BFAD" letterSpacing="0.08em">
        <text x="60" y="38">SCENE:05 // 3D CONVERSION FUNNEL</text>
        <text x="960" y="38" textAnchor="end">100% → 42% → 14.8%</text>
      </g>

      {/* ── 3D TIERED FROSTED-GLASS FUNNEL BODY (65% of Stage Frame) ── */}
      {/* Background Ellipses (Back Rim) */}
      <ellipse cx="540" cy="160" rx="260" ry="32" fill="#20241C" fillOpacity="0.3" stroke="#2E3426" strokeWidth="1.5" />
      <ellipse cx="540" cy="300" rx="190" ry="24" fill="#20241C" fillOpacity="0.3" stroke="#2E3426" strokeWidth="1.2" />
      <ellipse cx="540" cy="440" rx="120" ry="16" fill="#20241C" fillOpacity="0.3" stroke="#2E3426" strokeWidth="1.2" />

      {/* Tier 1 Body: Acquisition */}
      <path
        d="M 280 160 C 280 160 340 300 350 300 L 730 300 C 740 300 800 160 800 160 Z"
        fill="url(#funnelTier1Glass)"
        stroke="rgba(216, 255, 62, 0.25)"
        strokeWidth="1.5"
      />

      {/* Tier 2 Body: Intent */}
      <path
        d="M 350 300 C 350 300 410 440 420 440 L 660 440 C 670 440 730 300 730 300 Z"
        fill="url(#funnelTier2Glass)"
        stroke="rgba(216, 255, 62, 0.25)"
        strokeWidth="1.5"
      />

      {/* Tier 3 Body: Conversion */}
      <path
        d="M 420 440 C 420 440 480 580 490 580 L 590 580 C 600 580 660 440 660 440 Z"
        fill="url(#funnelTier3Glass)"
        stroke="rgba(216, 255, 62, 0.25)"
        strokeWidth="1.5"
      />

      {/* Front Specular Rim Ellipses */}
      <ellipse cx="540" cy="160" rx="260" ry="32" fill="none" stroke="rgba(216, 255, 62, 0.25)" strokeWidth="2.5" />
      <ellipse cx="540" cy="300" rx="190" ry="24" fill="none" stroke="rgba(216, 255, 62, 0.25)" strokeWidth="2" />
      <ellipse cx="540" cy="440" rx="120" ry="16" fill="none" stroke="rgba(216, 255, 62, 0.25)" strokeWidth="2" />

      {/* Converged Luminous Bottom Beam */}
      <path
        d="M 490 580 L 460 700 L 620 700 L 590 580 Z"
        fill="url(#convergedBeam)"
        filter="url(#s5Glow)"
      />

      {/* ── 96 Glowing Data Particles Streaming Through Funnel ── */}
      <g>
        {activeParticles.map((pt) => (
          <circle
            key={pt.id}
            cx={pt.x.toFixed(2)}
            cy={pt.y.toFixed(2)}
            r={pt.radius.toFixed(2)}
            fill={pt.color}
            opacity={Number(pt.opacity.toFixed(3))}
            filter={pt.opacity > 0.6 ? "url(#s5Glow)" : undefined}
          />
        ))}
      </g>

      {/* ── Funnel Stage Metric Pills (Flanking Funnel Tiers) ── */}
      {/* Tier 1 Pill */}
      <g transform="translate(130, 210)">
        <rect x="0" y="0" width="180" height="36" rx="18" fill="#20241C" fillOpacity="0.9" stroke="#2E3426" strokeWidth="1" />
        <circle cx="18" cy="18" r="4.5" fill="#A8CC28" />
        <text x="32" y="16" fontFamily="var(--font-mono, monospace)" fontSize="10" fontWeight="700" fill="#E8E0D1">
          1. ACQUISITION
        </text>
        <text x="32" y="27" fontFamily="var(--font-mono, monospace)" fontSize="10" fill="#C8BFAD">
          100% · 4,050 visits
        </text>
      </g>

      {/* Tier 2 Pill */}
      <g transform="translate(170, 350)">
        <rect x="0" y="0" width="170" height="36" rx="18" fill="#20241C" fillOpacity="0.9" stroke="#2E3426" strokeWidth="1" />
        <circle cx="18" cy="18" r="4.5" fill="#E65D3F" />
        <text x="32" y="16" fontFamily="var(--font-mono, monospace)" fontSize="10" fontWeight="700" fill="#E8E0D1">
          2. INTENT
        </text>
        <text x="32" y="27" fontFamily="var(--font-mono, monospace)" fontSize="10" fill="#C8BFAD">
          42% · 1,700 leads
        </text>
      </g>

      {/* Tier 3 Pill */}
      <g transform="translate(760, 480)">
        <rect x="0" y="0" width="180" height="36" rx="18" fill="#20241C" fillOpacity="0.9" stroke="#2E3426" strokeWidth="1" />
        <circle cx="18" cy="18" r="4.5" fill="#D8FF3E" />
        <text x="32" y="16" fontFamily="var(--font-mono, monospace)" fontSize="10" fontWeight="700" fill="#E8E0D1">
          3. CONVERSION
        </text>
        <text x="32" y="27" fontFamily="var(--font-mono, monospace)" fontSize="10" fill="#C8BFAD">
          14.8% · 600 bookings
        </text>
      </g>

      {/* ── LOWER COLLECTION BADGE & HERO DISPLAY NUMERAL (≥120px) ── */}
      <g transform="translate(540, 710)" filter="url(#s5CardShadow)">
        {/* Base Frosted Surface Card */}
        <rect
          x="-290"
          y="0"
          width="580"
          height="190"
          rx="26"
          fill="#20241C"
          fillOpacity="0.9"
          stroke="rgba(216, 255, 62, 0.25)"
          strokeWidth="1.5"
        />

        {/* Collector Intake Rim */}
        <ellipse cx="0" cy="0" rx="90" ry="14" fill="#D8FF3E" fillOpacity="0.25" stroke="#D8FF3E" strokeWidth="2" filter="url(#s5Glow)" />

        {/* Hero Figure (≥120px display) */}
        <text
          x="-30"
          y="120"
          fontFamily="var(--font-sans, system-ui, sans-serif)"
          fontSize="124"
          fontWeight="800"
          fill={counterColor}
          letterSpacing="-0.04em"
          textAnchor="end"
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          {counterVal}
        </text>

        {/* Hero Label & Subtitle */}
        <g transform="translate(0, 52)">
          <text
            x="0"
            y="32"
            fontFamily="var(--font-sans, system-ui, sans-serif)"
            fontSize="48"
            fontWeight="800"
            fill="#E8E0D1"
            letterSpacing="-0.02em"
          >
            {heroLabel}
          </text>
          <text
            x="0"
            y="64"
            fontFamily="var(--font-mono, monospace)"
            fontSize="13"
            fontWeight="600"
            fill="#D8FF3E"
            letterSpacing="0.04em"
          >
            QUALIFIED OUTCOME // 14.8% CONVERSION
          </text>
          <text
            x="0"
            y="84"
            fontFamily="var(--font-mono, monospace)"
            fontSize="11"
            fill="#C8BFAD"
          >
            Full-Funnel Instrumentation Model
          </text>
        </g>
      </g>

      {/* Top Title Label */}
      <g transform="translate(160, 96)">
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
    </svg>
  );
}

export function Scene05ResultsFunnel({
  title = "3D Results Funnel: Full-Funnel Architecture",
  heroOutcome = "600",
  heroLabel = "sales",
  verificationStatus = "illustrative",
  sourceNote = "Illustrative simulation of multi-tier conversion and customer qualification volume",
  showFrame = true,
  time,
  className,
}: Scene05ResultsFunnelProps) {
  if (!showFrame && time !== undefined) {
    return (
      <Scene05ResultsFunnelSvg
        time={time}
        heroOutcome={heroOutcome}
        heroLabel={heroLabel}
      />
    );
  }

  return (
    <MotionStageFrame
      sceneNumber={5}
      sceneTitle={title}
      dataStatus={verificationStatus}
      sourceNote={sourceNote}
      accessibilitySummary="Scene 5: 3D frosted-glass conversion funnel showing data particles converging through three qualification stages into a resolved 600 sales payoff."
      className={className}
    >
      {(timeline) => (
        <Scene05ResultsFunnelSvg
          time={timeline.time}
          heroOutcome={heroOutcome}
          heroLabel={heroLabel}
        />
      )}
    </MotionStageFrame>
  );
}
