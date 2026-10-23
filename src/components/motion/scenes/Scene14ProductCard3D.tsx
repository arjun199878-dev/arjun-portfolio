"use client";

import React from "react";
import { MotionStageFrame } from "../MotionStageFrame";
import { springOvershoot } from "@/lib/motion/easing";

export interface Scene14ProductCard3DProps {
  title?: string;
  showFrame?: boolean;
  time?: number;
  className?: string;
}

export function Scene14ProductCard3DSvg({ time = 0 }: { time?: number }) {
  const t = Math.max(0, Math.min(6.0, time));

  // 360-degree 3D Rotation Animation (0.8s to 2.8s)
  // rotateY: 0deg -> 360deg
  let rotDeg = 0;
  if (t < 0.8) {
    rotDeg = 0;
  } else if (t >= 0.8 && t < 2.8) {
    const p = (t - 0.8) / 2.0;
    const spring = springOvershoot(Math.min(1, p), 6.5, 4.8);
    rotDeg = spring * 360;
  } else if (t >= 2.8 && t < 5.2) {
    rotDeg = 360;
  } else {
    rotDeg = 360;
  }

  // Normalized rotation in [0, 360)
  const normRot = rotDeg % 360;
  // Front face visible when < 90 or > 270. Back face visible when 90 <= rot <= 270.
  const isBackFace = normRot >= 90 && normRot <= 270;

  // Perspective compression scaleX = |cos(rotDeg)|
  const scaleX = Math.abs(Math.cos((normRot * Math.PI) / 180));
  // Specular sheen shift based on angle
  const sheenOffset = Math.sin((normRot * Math.PI) / 180) * 300;

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
        <radialGradient id="s14Lighting" cx="540" cy="400" r="500" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#20241C" stopOpacity="0.95" />
          <stop offset="70%" stopColor="#171914" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#0E100C" stopOpacity="0.25" />
        </radialGradient>

        <linearGradient id="s14SpecularBorder" x1="180" y1="120" x2="900" y2="820" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#20241C" stopOpacity="0.95" />
          <stop offset="35%" stopColor="#20241C" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#E8E0D1" stopOpacity="0.08" />
        </linearGradient>

        <filter id="s14CardShadow" x="120" y="80" width="840" height="780" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="24" stdDeviation="32" floodColor="#E8E0D1" floodOpacity="0.09" />
        </filter>

        <filter id="s14SheenGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect width="1080" height="960" rx="36" fill="url(#s14Lighting)" />

      {/* Outer Registration & Coordinates */}
      <g stroke="#E8E0D1" strokeOpacity="0.15" strokeWidth="1.2">
        <path d="M 50 60 L 70 60 M 60 50 L 60 70" />
        <path d="M 1010 60 L 1030 60 M 1020 50 L 1020 70" />
        <path d="M 50 900 L 70 900 M 60 890 L 60 910" />
        <path d="M 1010 900 L 1030 900 M 1020 890 L 1020 910" />
      </g>
      <g fontFamily="var(--font-mono, monospace)" fontSize="11" fill="#C8BFAD" letterSpacing="0.08em">
        <text x="60" y="38">SCENE:14 // 3D PRODUCT CARD</text>
        <text x="960" y="38" textAnchor="end">360° PERSPECTIVE ROTATION</text>
      </g>

      {/* ── 3D ROTATING PRODUCT CARD (Occupies 65% of Frame) ── */}
      <g transform="translate(540, 440)" filter="url(#s14CardShadow)">
        <g transform={`scale(${Math.max(0.04, scaleX)}, 1)`} style={{ transformOrigin: "0 0" }}>
          {/* Card Body */}
          <rect
            x="-320"
            y="-270"
            width="640"
            height="540"
            rx="32"
            fill="#20241C"
            fillOpacity="0.92"
          />
          <rect
            x="-319.5"
            y="-269.5"
            width="639"
            height="539"
            rx="31.5"
            stroke="url(#s14SpecularBorder)"
            strokeWidth="1.5"
          />

          {/* Front Face Content */}
          {!isBackFace ? (
            <g>
              {/* Product Badge Header */}
              <g transform="translate(-270, -210)">
                <text x="0" y="0" fontFamily="var(--font-mono, monospace)" fontSize="11" fontWeight="700" fill="#C8BFAD" letterSpacing="0.08em">
                  HARDWARE ARCHITECTURE // WIRELESS MODULE
                </text>
                <text x="0" y="28" fontFamily="var(--font-sans, system-ui, sans-serif)" fontSize="26" fontWeight="800" fill="#E8E0D1">
                  Studio Pro System
                </text>
              </g>

              {/* Product Visual Center Medallion */}
              <g transform="translate(0, -30)">
                <circle cx="0" cy="0" r="85" fill="#171914" stroke="#2E3426" strokeWidth="2" />
                <circle cx="0" cy="0" r="65" fill="#E8E0D1" />
                {/* Acoustic diaphragm concentric rings */}
                <circle cx="0" cy="0" r="45" fill="none" stroke="#A8CC28" strokeWidth="2" strokeDasharray="4 4" />
                <circle cx="0" cy="0" r="25" fill="#D8FF3E" />
              </g>

              {/* Bottom Price Hero Numeral */}
              <g transform="translate(0, 160)">
                <text
                  x="0"
                  y="40"
                  fontFamily="var(--font-sans, system-ui, sans-serif)"
                  fontSize="72"
                  fontWeight="800"
                  fill="#E8E0D1"
                  letterSpacing="-0.03em"
                  textAnchor="middle"
                >
                  £129
                </text>
                <text x="0" y="70" fontFamily="var(--font-mono, monospace)" fontSize="12" fill="#D8FF3E" fontWeight="600" textAnchor="middle">
                  {t >= 2.8 && t < 5.2 ? "✓ 3/3 VERIFIED SPECIFICATIONS LOCKED" : "High-Fidelity Acoustic Driver"}
                </text>
              </g>
            </g>
          ) : (
            /* Reverse Specification Face Content */
            <g transform="scale(-1, 1)">
              <g transform="translate(-260, -180)">
                <text x="0" y="0" fontFamily="var(--font-mono, monospace)" fontSize="11" fontWeight="700" fill="#A8CC28" letterSpacing="0.08em">
                  REVERSE SPECIFICATION MATRIX
                </text>
                <text x="0" y="28" fontFamily="var(--font-sans, system-ui, sans-serif)" fontSize="24" fontWeight="800" fill="#E8E0D1">
                  Technical Specifications
                </text>

                {/* 3 Green Feature Ticks */}
                <g transform="translate(0, 70)">
                  <g transform="translate(0, 0)">
                    <circle cx="12" cy="12" r="10" fill="rgba(216, 255, 62, 0.16)" />
                    <path d="M 8 12 L 11 15 L 16 9" stroke="#D8FF3E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    <text x="32" y="17" fontFamily="var(--font-sans, system-ui, sans-serif)" fontSize="15" fontWeight="700" fill="#E8E0D1">
                      Spatial Telemetry Ingestion
                    </text>
                  </g>

                  <g transform="translate(0, 50)">
                    <circle cx="12" cy="12" r="10" fill="rgba(216, 255, 62, 0.16)" />
                    <path d="M 8 12 L 11 15 L 16 9" stroke="#D8FF3E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    <text x="32" y="17" fontFamily="var(--font-sans, system-ui, sans-serif)" fontSize="15" fontWeight="700" fill="#E8E0D1">
                      Zero-Latency Mesh Sync
                    </text>
                  </g>

                  <g transform="translate(0, 100)">
                    <circle cx="12" cy="12" r="10" fill="rgba(216, 255, 62, 0.16)" />
                    <path d="M 8 12 L 11 15 L 16 9" stroke="#D8FF3E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    <text x="32" y="17" fontFamily="var(--font-sans, system-ui, sans-serif)" fontSize="15" fontWeight="700" fill="#E8E0D1">
                      Automated Room Calibration
                    </text>
                  </g>
                </g>
              </g>
            </g>
          )}

          {/* Dynamic Specular Sheen highlight line */}
          <line
            x1={sheenOffset}
            y1="-260"
            x2={sheenOffset + 80}
            y2="260"
            stroke="#20241C"
            strokeWidth="12"
            strokeOpacity="0.4"
            filter="url(#s14SheenGlow)"
          />
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
          fill="#E8E0D1"
          letterSpacing="-0.04em"
          textAnchor="middle"
        >
          £129
        </text>
      </g>
    </svg>
  );
}

export function Scene14ProductCard3D({
  title = "Scene 14: 3D Product Card",
  showFrame = true,
  time,
  className,
}: Scene14ProductCard3DProps) {
  if (!showFrame && time !== undefined) {
    return <Scene14ProductCard3DSvg time={time} />;
  }

  return (
    <MotionStageFrame
      sceneNumber={14}
      sceneTitle={title}
      dataStatus="illustrative"
      sourceNote="Illustrative 3D card rotation simulation showing 360-degree perspective flip and reverse specifications"
      accessibilitySummary="3D product card visualization rotating through 360 degrees in perspective space to reveal reverse specification features before settling into the £129 hero display state."
      className={className}
    >
      {(timeline) => <Scene14ProductCard3DSvg time={timeline.time} />}
    </MotionStageFrame>
  );
}
