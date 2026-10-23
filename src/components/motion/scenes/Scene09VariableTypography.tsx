"use client";

import React from "react";
import { MotionStageFrame } from "../MotionStageFrame";
import { springOvershoot, easeInOutCubic } from "@/lib/motion/easing";

export interface Scene09VariableTypographyProps {
  title?: string;
  showFrame?: boolean;
  time?: number;
  className?: string;
}

export function Scene09VariableTypographySvg({ time = 0 }: { time?: number }) {
  const t = Math.max(0, Math.min(6.0, time));

  // Variable Font Weight interpolation (200 -> 900)
  // Tracking / Letter-spacing (-0.01em to -0.05em)
  let fontWeight = 200;
  let letterSpacing = 2; // px
  let scaleRatio = 1.0;

  if (t < 0.8) {
    fontWeight = 200;
    letterSpacing = 4;
    scaleRatio = 1.0;
  } else if (t >= 0.8 && t < 2.8) {
    const p = (t - 0.8) / 1.8;
    const spring = springOvershoot(Math.min(1, p), 6.5, 4.8);
    fontWeight = Math.round(200 + 700 * spring);
    letterSpacing = 4 - 8 * spring;
    scaleRatio = 1.0 + 0.06 * spring;
  } else if (t >= 2.8 && t < 5.2) {
    fontWeight = 900;
    letterSpacing = -4;
    scaleRatio = 1.06;
  } else {
    const p = (t - 5.2) / 0.8;
    const ease = easeInOutCubic(Math.min(1, Math.max(0, p)));
    fontWeight = Math.round(900 - 700 * ease);
    letterSpacing = -4 + 8 * ease;
    scaleRatio = 1.06 - 0.06 * ease;
  }

  // Coral Punctuation Dot Gravity Bounce (Phase 3: 2.8s to 3.8s)
  let bounceY = 0;
  let squashScaleX = 1.0;
  let squashScaleY = 1.0;
  let isDetached = false;

  if (t >= 2.8 && t < 5.2) {
    isDetached = true;
    if (t < 3.8) {
      const bounceT = (t - 2.8) / 1.0;
      const decay = Math.exp(-3.5 * bounceT);
      const osc = Math.abs(Math.sin(bounceT * Math.PI * 3.5));
      bounceY = -osc * 54 * decay;

      // Subtle squash on impact
      if (Math.abs(bounceY) < 4) {
        squashScaleX = 1.25;
        squashScaleY = 0.8;
      }
    } else {
      bounceY = 0;
      squashScaleX = 1.0;
      squashScaleY = 1.0;
    }
  } else if (t >= 5.2) {
    isDetached = false;
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
        <radialGradient id="s9Lighting" cx="540" cy="420" r="500" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#20241C" stopOpacity="0.95" />
          <stop offset="70%" stopColor="#171914" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#0E100C" stopOpacity="0.25" />
        </radialGradient>

        <linearGradient id="s9SpecularBorder" x1="120" y1="120" x2="960" y2="840" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#20241C" stopOpacity="0.95" />
          <stop offset="35%" stopColor="#20241C" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#E8E0D1" stopOpacity="0.08" />
        </linearGradient>

        <filter id="s9CardShadow" x="80" y="80" width="920" height="800" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="24" stdDeviation="32" floodColor="#E8E0D1" floodOpacity="0.08" />
        </filter>

        <filter id="s9DotGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect width="1080" height="960" rx="36" fill="url(#s9Lighting)" />

      {/* Outer Registration & Coordinates */}
      <g stroke="#E8E0D1" strokeOpacity="0.15" strokeWidth="1.2">
        <path d="M 50 60 L 70 60 M 60 50 L 60 70" />
        <path d="M 1010 60 L 1030 60 M 1020 50 L 1020 70" />
        <path d="M 50 900 L 70 900 M 60 890 L 60 910" />
        <path d="M 1010 900 L 1030 900 M 1020 890 L 1020 910" />
      </g>
      <g fontFamily="var(--font-mono, monospace)" fontSize="11" fill="#C8BFAD" letterSpacing="0.08em">
        <text x="60" y="38">SCENE:09 // VARIABLE TYPOGRAPHY</text>
        <text x="960" y="38" textAnchor="end">WEIGHT AXIS 200 → 900</text>
      </g>

      {/* ── EDITORIAL SPECIMEN CARD (Occupies 65% of Frame) ── */}
      <g filter="url(#s9CardShadow)">
        <rect x="130" y="110" width="820" height="710" rx="28" fill="#20241C" fillOpacity="0.86" />
        <rect x="130.5" y="110.5" width="819" height="709" rx="27.5" stroke="url(#s9SpecularBorder)" strokeWidth="1.5" />
      </g>

      {/* Card Header & Typographic Specimen Info */}
      <g transform="translate(180, 160)">
        <text x="0" y="0" fontFamily="var(--font-mono, monospace)" fontSize="11" fontWeight="700" fill="#C8BFAD" letterSpacing="0.08em">
          EDITORIAL SPECIMEN // LIVING VARIABLE TYPOGRAPHY
        </text>
        <text x="0" y="24" fontFamily="var(--font-mono, monospace)" fontSize="12" fill="#A8CC28">
          Axis: wght({fontWeight}) · Optical Size: 136pt · Tracking: {letterSpacing}px
        </text>
      </g>

      {/* Subtle baseline grid hairlines */}
      <g stroke="#2E3426" strokeWidth="1">
        <line x1="180" y1="360" x2="900" y2="360" />
        <line x1="180" y1="520" x2="900" y2="520" />
        <line x1="180" y1="680" x2="900" y2="680" />
      </g>

      {/* ── MASSIVE DISPLAY HEADLINE: "Make it move." (≥136px reference scale) ── */}
      <g
        transform={`translate(540, 480) scale(${scaleRatio})`}
        style={{ transformOrigin: "0 0" }}
      >
        <text
          x="-320"
          y="0"
          fontFamily="var(--font-sans, system-ui, sans-serif)"
          fontSize="140"
          fontWeight={fontWeight}
          fill="#E8E0D1"
          letterSpacing={`${letterSpacing}px`}
        >
          Make it
        </text>
        <text
          x="-320"
          y="150"
          fontFamily="var(--font-sans, system-ui, sans-serif)"
          fontSize="140"
          fontWeight={fontWeight}
          fill="#E8E0D1"
          letterSpacing={`${letterSpacing}px`}
        >
          move
        </text>

        {/* Coral Punctuation Dot with Gravity Bounce */}
        {isDetached ? (
          <g
            transform={`translate(150, ${150 + bounceY}) scale(${squashScaleX}, ${squashScaleY})`}
            filter="url(#s9DotGlow)"
          >
            <circle cx="0" cy="0" r="14" fill="#E65D3F" />
          </g>
        ) : (
          <text
            x="135"
            y="150"
            fontFamily="var(--font-sans, system-ui, sans-serif)"
            fontSize="140"
            fontWeight={fontWeight}
            fill="#E8E0D1"
          >
            .
          </text>
        )}
      </g>

      {/* ── LOWER HERO AXIS READOUT (≥120px display scale) ── */}
      <g transform="translate(540, 770)">
        <text
          x="0"
          y="20"
          fontFamily="var(--font-mono, monospace)"
          fontSize="14"
          fontWeight="700"
          fill="#D8FF3E"
          letterSpacing="0.08em"
          textAnchor="middle"
        >
          {fontWeight >= 850 ? "BLACK 900 // MAXIMUM KINETIC WEIGHT LOCKED" : "TRANSITIONING VARIABLE AXIS"}
        </text>
        <text
          x="0"
          y="42"
          fontFamily="var(--font-mono, monospace)"
          fontSize="11"
          fill="#C8BFAD"
          textAnchor="middle"
        >
          Sub-pixel Anti-aliasing · Pure Vector Interpolation
        </text>
      </g>
    </svg>
  );
}

export function Scene09VariableTypography({
  title = "Scene 09: Variable Typography",
  showFrame = true,
  time,
  className,
}: Scene09VariableTypographyProps) {
  if (!showFrame && time !== undefined) {
    return <Scene09VariableTypographySvg time={time} />;
  }

  return (
    <MotionStageFrame
      sceneNumber={9}
      sceneTitle={title}
      dataStatus="illustrative"
      sourceNote="Illustrative variable font specimen demonstrating dynamic weight interpolation (200 to 900) and bouncing coral accent"
      accessibilitySummary="Variable typography visualization animating the phrase 'Make it move.' from ultra-light 200 weight to black 900 weight with a gravity-bouncing coral period."
      className={className}
    >
      {(timeline) => <Scene09VariableTypographySvg time={timeline.time} />}
    </MotionStageFrame>
  );
}
