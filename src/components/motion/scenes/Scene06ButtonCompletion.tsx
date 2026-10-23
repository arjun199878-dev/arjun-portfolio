"use client";

import React from "react";
import { MotionStageFrame } from "../MotionStageFrame";
import { springOvershoot, easeInOutCubic } from "@/lib/motion/easing";

export interface Scene06ButtonCompletionProps {
  title?: string;
  showFrame?: boolean;
  time?: number;
  className?: string;
}

export function Scene06ButtonCompletionSvg({ time = 0 }: { time?: number }) {
  const t = Math.max(0, Math.min(6.0, time));

  // Button Morph States:
  // 0.0s - 0.8s: Wide button (w: 420, h: 96) "Publish"
  // 0.8s - 1.2s: Cursor clicks, button compresses scale(0.94) and morphs to circle (w: 96, h: 96)
  // 1.2s - 2.8s: Progress ring sweeps 0% -> 100%
  // 2.8s - 4.0s: Expands into green "Published" badge (w: 520, h: 104) with checkmark
  // 4.0s - 5.2s: Hold (1.2s)
  // 5.2s - 6.0s: Resets to "Publish"

  let buttonWidth = 420;
  let buttonHeight = 96;
  let buttonBg = "#E8E0D1";
  let ringProgress = 0;
  let cursorOpacity = 0;
  let cursorX = 720;
  let cursorY = 560;

  if (t < 0.8) {
    buttonWidth = 420;
    buttonHeight = 96;
    buttonBg = "#E8E0D1";
    ringProgress = 0;
    cursorOpacity = t / 0.8;
    cursorX = 720 - (t / 0.8) * 180;
    cursorY = 560 - (t / 0.8) * 100;
  } else if (t >= 0.8 && t < 1.2) {
    const p = (t - 0.8) / 0.4;
    cursorOpacity = 1.0;
    cursorX = 540;
    cursorY = 460;
    buttonWidth = 420 - p * 324; // morphs to 96
    buttonHeight = 96;
    buttonBg = "#E8E0D1";
  } else if (t >= 1.2 && t < 2.8) {
    const p = (t - 1.2) / 1.6;
    cursorOpacity = Math.max(0, 1 - p * 3);
    buttonWidth = 96;
    buttonHeight = 96;
    buttonBg = "#E8E0D1";
    ringProgress = Math.min(1.0, p);
  } else if (t >= 2.8 && t < 5.2) {
    const p = (t - 2.8) / 0.8;
    const spring = springOvershoot(Math.min(1, p), 6.5, 4.8);
    cursorOpacity = 0;
    buttonWidth = 96 + spring * 424; // expands to 520
    buttonHeight = 96 + spring * 8; // expands to 104
    buttonBg = "#D8FF3E";
    ringProgress = 1.0;
  } else {
    const p = (t - 5.2) / 0.8;
    const ease = easeInOutCubic(Math.min(1, Math.max(0, p)));
    cursorOpacity = 0;
    buttonWidth = 520 - ease * 100;
    buttonHeight = 104 - ease * 8;
    buttonBg = "#E8E0D1";
    ringProgress = 0;
  }

  // Checkmark drawing progress (Phase 3: 2.8s to 3.4s)
  let checkProgress = 0;
  if (t >= 2.8 && t < 3.6) {
    checkProgress = Math.min(1, (t - 2.8) / 0.6);
  } else if (t >= 3.6 && t < 5.2) {
    checkProgress = 1.0;
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
        <radialGradient id="s6Lighting" cx="540" cy="400" r="500" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#20241C" stopOpacity="0.95" />
          <stop offset="70%" stopColor="#171914" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#0E100C" stopOpacity="0.25" />
        </radialGradient>

        <linearGradient id="s6SpecularBorder" x1="120" y1="100" x2="960" y2="860" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#20241C" stopOpacity="0.95" />
          <stop offset="35%" stopColor="#20241C" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#E8E0D1" stopOpacity="0.08" />
        </linearGradient>

        <filter id="s6CardShadow" x="80" y="80" width="920" height="800" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="24" stdDeviation="32" floodColor="#E8E0D1" floodOpacity="0.08" />
        </filter>

        <filter id="s6ButtonShadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="16" stdDeviation="24" floodColor="#E8E0D1" floodOpacity="0.14" />
        </filter>
      </defs>

      <rect width="1080" height="960" rx="36" fill="url(#s6Lighting)" />

      {/* Outer Registration & Coordinates */}
      <g stroke="#E8E0D1" strokeOpacity="0.15" strokeWidth="1.2">
        <path d="M 50 60 L 70 60 M 60 50 L 60 70" />
        <path d="M 1010 60 L 1030 60 M 1020 50 L 1020 70" />
        <path d="M 50 900 L 70 900 M 60 890 L 60 910" />
        <path d="M 1010 900 L 1030 900 M 1020 890 L 1020 910" />
      </g>
      <g fontFamily="var(--font-mono, monospace)" fontSize="11" fill="#C8BFAD" letterSpacing="0.08em">
        <text x="60" y="38">SCENE:06 // BUTTON TO COMPLETION</text>
        <text x="960" y="38" textAnchor="end">TACTILE STATE MORPHING</text>
      </g>

      {/* ── CONSOLE BASE CARD (Occupies 65% of Frame) ── */}
      <g filter="url(#s6CardShadow)">
        <rect x="140" y="110" width="800" height="710" rx="28" fill="#20241C" fillOpacity="0.86" />
        <rect x="140.5" y="110.5" width="799" height="709" rx="27.5" stroke="url(#s6SpecularBorder)" strokeWidth="1.5" />
      </g>

      {/* Header Inside Card */}
      <g transform="translate(190, 160)">
        <text x="0" y="0" fontFamily="var(--font-mono, monospace)" fontSize="11" fontWeight="700" fill="#C8BFAD" letterSpacing="0.08em">
          DEPLOYMENT CONTROLLER // RELEASE WORKFLOW
        </text>
        <text x="0" y="26" fontFamily="var(--font-sans, system-ui, sans-serif)" fontSize="20" fontWeight="800" fill="#E8E0D1">
          Interactive State Morphing & Verification
        </text>
      </g>

      {/* ── THE MORPHING TACTILE BUTTON (Center at 540, 420) ── */}
      <g transform="translate(540, 420)">
        {/* Button Surface */}
        <rect
          x={-buttonWidth / 2}
          y={-buttonHeight / 2}
          width={buttonWidth}
          height={buttonHeight}
          rx={buttonHeight / 2}
          fill={buttonBg}
          filter="url(#s6ButtonShadow)"
        />

        {/* Specular Inner Rim */}
        <rect
          x={-buttonWidth / 2 + 1}
          y={-buttonHeight / 2 + 1}
          width={buttonWidth - 2}
          height={buttonHeight - 2}
          rx={buttonHeight / 2 - 1}
          fill="none"
          stroke="rgba(216, 255, 62, 0.25)"
          strokeWidth="1.5"
        />

        {/* State 1: "Publish" Text (0.0s to 1.0s) */}
        {t < 1.0 && (
          <g>
            <text x="-16" y="9" fontFamily="var(--font-sans, system-ui, sans-serif)" fontSize="24" fontWeight="800" fill="#171914" textAnchor="middle">
              Publish
            </text>
            <path d="M 28 0 L 38 -10 L 48 0 M 38 -10 L 38 10" stroke="#171914" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        )}

        {/* State 2: Progress Ring (1.2s to 2.8s) */}
        {t >= 1.0 && t < 2.8 && (
          <g>
            <circle cx="0" cy="0" r="36" fill="none" stroke="rgba(216, 255, 62, 0.25)" strokeWidth="5" />
            <circle
              cx="0"
              cy="0"
              r="36"
              fill="none"
              stroke="#A8CC28"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray="226"
              strokeDashoffset={226 * (1 - ringProgress)}
              transform="rotate(-90)"
            />
          </g>
        )}

        {/* State 3: "Published" + Checkmark (2.8s to 5.2s) */}
        {t >= 2.8 && t < 5.2 && (
          <g>
            {/* Self-drawing checkmark */}
            <path
              d="M -110 0 L -98 12 L -78 -8"
              stroke="#171914" strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              strokeDasharray="40"
              strokeDashoffset={40 * (1 - checkProgress)}
            />
            <text x="-50" y="10" fontFamily="var(--font-sans, system-ui, sans-serif)" fontSize="28" fontWeight="800" fill="#171914">
              Published
            </text>
            <text x="110" y="9" fontFamily="var(--font-mono, monospace)" fontSize="12" fontWeight="700" fill="#171914">
              RELEASE #408 · 0.0MS
            </text>
          </g>
        )}
      </g>

      {/* Animated Cursor */}
      {cursorOpacity > 0 && (
        <g transform={`translate(${cursorX}, ${cursorY})`} opacity={cursorOpacity}>
          <path d="M 0 0 L 14 36 L 22 24 L 38 22 Z" fill="#E8E0D1" stroke="#20241C" strokeWidth="2" />
        </g>
      )}

      {/* ── LOWER HERO READOUT (≥120px scale display) ── */}
      <g transform="translate(540, 720)">
        <text
          x="0"
          y="50"
          fontFamily="var(--font-sans, system-ui, sans-serif)"
          fontSize="120"
          fontWeight="800"
          fill={t >= 2.8 && t < 5.2 ? "#D8FF3E" : "#2E3426"}
          letterSpacing="-0.04em"
          textAnchor="middle"
        >
          {t >= 2.8 && t < 5.2 ? "100%" : "0%"}
        </text>
        <text
          x="0"
          y="80"
          fontFamily="var(--font-mono, monospace)"
          fontSize="12"
          fontWeight="700"
          fill="#C8BFAD"
          letterSpacing="0.08em"
          textAnchor="middle"
        >
          {t >= 2.8 && t < 5.2 ? "AUDITED DEPLOYMENT PIPELINE // VERIFIED" : "AWAITING USER INTERACTION CLICK"}
        </text>
      </g>
    </svg>
  );
}

export function Scene06ButtonCompletion({
  title = "Scene 06: Button to Completion",
  showFrame = true,
  time,
  className,
}: Scene06ButtonCompletionProps) {
  if (!showFrame && time !== undefined) {
    return <Scene06ButtonCompletionSvg time={time} />;
  }

  return (
    <MotionStageFrame
      sceneNumber={6}
      sceneTitle={title}
      dataStatus="illustrative"
      sourceNote="Illustrative deployment button simulation demonstrating morphing geometry and state completion"
      accessibilitySummary="Button to completion visualization where an animated cursor clicks a Publish button, causing it to morph into a progress ring and expand into a green Published state."
      className={className}
    >
      {(timeline) => <Scene06ButtonCompletionSvg time={timeline.time} />}
    </MotionStageFrame>
  );
}
