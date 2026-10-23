"use client";

import React from "react";
import { MotionStageFrame } from "../MotionStageFrame";
import { springOvershoot, easeInOutCubic } from "@/lib/motion/easing";

export interface Scene07ConfirmationCardProps {
  title?: string;
  showFrame?: boolean;
  time?: number;
  className?: string;
}

export function Scene07ConfirmationCardSvg({ time = 0 }: { time?: number }) {
  const t = Math.max(0, Math.min(6.0, time));

  // 3D Card Elevation & Orbit Ring (0.8s to 2.8s)
  let elevationProgress = 0;
  if (t < 0.8) {
    elevationProgress = 0;
  } else if (t >= 0.8 && t < 2.8) {
    const p = (t - 0.8) / 1.8;
    elevationProgress = springOvershoot(Math.min(1, p), 6.5, 5.0);
  } else if (t >= 2.8 && t < 5.2) {
    elevationProgress = 1.0;
  } else {
    const p = (t - 5.2) / 0.8;
    elevationProgress = 1.0 - easeInOutCubic(Math.min(1, Math.max(0, p)));
  }

  const cardScale = 0.95 + elevationProgress * 0.07;
  const cardTranslateY = -elevationProgress * 28;

  // Luminous Orbit Angle (0.8s to 2.8s)
  const orbitAngle = t < 0.8 ? 0 : (t - 0.8) * Math.PI * 2;

  // Checkmark spring lock in (Phase 3: 2.8s to 4.0s)
  let checkScale = 0;
  let checkProgress = 0;
  if (t >= 2.8 && t < 3.6) {
    const p = (t - 2.8) / 0.8;
    checkScale = springOvershoot(Math.min(1, p), 7.0, 5.2);
    checkProgress = Math.min(1, p * 1.5);
  } else if (t >= 3.6 && t < 5.2) {
    checkScale = 1.0;
    checkProgress = 1.0;
  } else if (t >= 5.2) {
    const p = (t - 5.2) / 0.6;
    checkScale = Math.max(0, 1.0 - p);
    checkProgress = Math.max(0, 1.0 - p);
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
        <radialGradient id="s7Lighting" cx="540" cy="400" r="500" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#20241C" stopOpacity="0.95" />
          <stop offset="70%" stopColor="#171914" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#0E100C" stopOpacity="0.25" />
        </radialGradient>

        <linearGradient id="s7SpecularBorder" x1="200" y1="120" x2="880" y2="800" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#20241C" stopOpacity="0.95" />
          <stop offset="35%" stopColor="#20241C" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#E8E0D1" stopOpacity="0.08" />
        </linearGradient>

        <filter id="s7ElevatedShadow" x="120" y="80" width="840" height="740" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy={20 + elevationProgress * 24} stdDeviation={24 + elevationProgress * 16} floodColor="#E8E0D1" floodOpacity={0.06 + elevationProgress * 0.08} />
        </filter>

        <filter id="s7MedallionGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect width="1080" height="960" rx="36" fill="url(#s7Lighting)" />

      {/* Outer Registration & Coordinates */}
      <g stroke="#E8E0D1" strokeOpacity="0.15" strokeWidth="1.2">
        <path d="M 50 60 L 70 60 M 60 50 L 60 70" />
        <path d="M 1010 60 L 1030 60 M 1020 50 L 1020 70" />
        <path d="M 50 900 L 70 900 M 60 890 L 60 910" />
        <path d="M 1010 900 L 1030 900 M 1020 890 L 1020 910" />
      </g>
      <g fontFamily="var(--font-mono, monospace)" fontSize="11" fill="#C8BFAD" letterSpacing="0.08em">
        <text x="60" y="38">SCENE:07 // CONFIRMATION & DEPLOYMENT CARD</text>
        <text x="960" y="38" textAnchor="end">3D ELEVATION · VERIFIED PROTOCOL</text>
      </g>

      {/* ── 3D ELEVATED FROSTED WALLET CARD (Occupies 65% of Frame) ── */}
      <g
        transform={`translate(540, ${440 + cardTranslateY}) scale(${cardScale})`}
        style={{ transformOrigin: "0 0" }}
        filter="url(#s7ElevatedShadow)"
      >
        {/* Card Body */}
        <rect
          x="-340"
          y="-260"
          width="680"
          height="520"
          rx="32"
          fill="#20241C"
          fillOpacity="0.9"
        />
        <rect
          x="-339.5"
          y="-259.5"
          width="679"
          height="519"
          rx="31.5"
          stroke="url(#s7SpecularBorder)"
          strokeWidth="1.5"
        />

        {/* Card Chip & Network Logo Header */}
        <g transform="translate(-290, -210)">
          {/* Metallic Smart Chip */}
          <rect x="0" y="0" width="56" height="42" rx="8" fill="#0E100C" stroke="#2E3426" strokeWidth="1" />
          <line x1="0" y1="21" x2="56" y2="21" stroke="#2E3426" />
          <line x1="28" y1="0" x2="28" y2="42" stroke="#2E3426" />

          {/* Network / Brand Pill */}
          <text x="580" y="26" fontFamily="var(--font-mono, monospace)" fontSize="13" fontWeight="800" fill="#E8E0D1" textAnchor="end" letterSpacing="0.08em">
            ARJUN // PROTOCOL
          </text>
        </g>

        {/* Central Verification Medallion (Center at 0, -30 in card coordinate) */}
        <g transform="translate(0, -30)">
          {/* Outer Base Orbit Track */}
          <circle cx="0" cy="0" r="78" fill="none" stroke="#2E3426" strokeWidth="3" />

          {/* Medallion Disc */}
          <circle cx="0" cy="0" r="62" fill={checkScale > 0.5 ? "rgba(216, 255, 62, 0.16)" : "#171914"} stroke={checkScale > 0.5 ? "#D8FF3E" : "#2E3426"} strokeWidth="2" />

          {/* Orbiting Luminous Ring Beacon */}
          {t >= 0.8 && t < 2.8 && (
            <circle
              cx={Math.cos(orbitAngle) * 78}
              cy={Math.sin(orbitAngle) * 78}
              r="6"
              fill="#A8CC28"
              filter="url(#s7MedallionGlow)"
            />
          )}

          {/* Self-drawing Verified Checkmark */}
          {checkScale > 0 && (
            <g transform={`scale(${checkScale})`}>
              <path
                d="M -22 2 L -8 16 L 22 -14"
                stroke="#D8FF3E"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                strokeDasharray="60"
                strokeDashoffset={60 * (1 - checkProgress)}
              />
            </g>
          )}
        </g>

        {/* Amount & Settlement Info */}
        <g transform="translate(0, 110)">
          <text x="0" y="0" fontFamily="var(--font-mono, monospace)" fontSize="12" fontWeight="700" fill="#C8BFAD" letterSpacing="0.08em" textAnchor="middle">
            TRANSACTION AUDIT // SETTLEMENT VERIFIED
          </text>
          <text x="0" y="42" fontFamily="var(--font-sans, system-ui, sans-serif)" fontSize="48" fontWeight="800" fill="#E8E0D1" letterSpacing="-0.02em" textAnchor="middle">
            $1,240.00
          </text>
          <text x="0" y="74" fontFamily="var(--font-mono, monospace)" fontSize="12" fill="#D8FF3E" fontWeight="600" textAnchor="middle">
            {t >= 2.8 && t < 5.2 ? "✓ 0.0ms Finality · Smart Contract Released" : "Awaiting Authorization Block"}
          </text>
        </g>
      </g>

      {/* ── LOWER HERO READOUT (≥120px scale display) ── */}
      <g transform="translate(540, 830)">
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
          {t >= 2.8 && t < 5.2 ? "Verified" : "Pending"}
        </text>
      </g>
    </svg>
  );
}

export function Scene07ConfirmationCard({
  title = "Scene 07: Payment & Deployment Confirmation",
  showFrame = true,
  time,
  className,
}: Scene07ConfirmationCardProps) {
  if (!showFrame && time !== undefined) {
    return <Scene07ConfirmationCardSvg time={time} />;
  }

  return (
    <MotionStageFrame
      sceneNumber={7}
      sceneTitle={title}
      dataStatus="illustrative"
      sourceNote="Illustrative transaction confirmation simulation demonstrating 3D elevation and verified state lock"
      accessibilitySummary="Confirmation card visualization where a frosted card elevates in 3D perspective while a light ring orbits into a large green Verified checkmark."
      className={className}
    >
      {(timeline) => <Scene07ConfirmationCardSvg time={timeline.time} />}
    </MotionStageFrame>
  );
}
