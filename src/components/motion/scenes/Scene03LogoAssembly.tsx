"use client";

import React, { useMemo } from "react";
import { MotionStageFrame } from "../MotionStageFrame";
import { springOvershoot, easeInOutCubic } from "@/lib/motion/easing";

export interface Scene03LogoAssemblyProps {
  title?: string;
  showFrame?: boolean;
  time?: number;
  className?: string;
}

const CENTER_X = 540;
const CENTER_Y = 430;

// Precalculated lattice points forming an architectural 'A' + Growth Vector Prism
interface LatticePoint {
  id: number;
  targetX: number;
  targetY: number;
  perimeterAngle: number;
  perimeterRadius: number;
  color: string;
  radius: number;
}

function generateLatticePoints(): LatticePoint[] {
  const points: LatticePoint[] = [];
  const colors = ["#E8E0D1", "#A8CC28", "#E65D3F", "#D8FF3E"];

  // 1. Left leg of 'A' (from apex 540,220 down to 380,580): 32 points
  for (let i = 0; i < 32; i++) {
    const p = i / 31;
    const x = 540 - 160 * p;
    const y = 220 + 360 * p;
    points.push({
      id: points.length,
      targetX: x,
      targetY: y,
      perimeterAngle: (points.length * 137.5 * Math.PI) / 180,
      perimeterRadius: 360 + (points.length % 5) * 16,
      color: colors[i % colors.length],
      radius: 4.5,
    });
  }

  // 2. Right leg of 'A' (from apex 540,220 down to 700,580): 32 points
  for (let i = 0; i < 32; i++) {
    const p = i / 31;
    const x = 540 + 160 * p;
    const y = 220 + 360 * p;
    points.push({
      id: points.length,
      targetX: x,
      targetY: y,
      perimeterAngle: (points.length * 137.5 * Math.PI) / 180,
      perimeterRadius: 360 + (points.length % 5) * 16,
      color: colors[(i + 1) % colors.length],
      radius: 4.5,
    });
  }

  // 3. Crossbar & Growth Vector (from 440,440 to 640,440 and angling up to 690,390): 36 points
  for (let i = 0; i < 36; i++) {
    const p = i / 35;
    let x = 440 + 200 * p;
    let y = 440;
    if (p > 0.75) {
      // Upward growth vector arrow
      const arrowP = (p - 0.75) / 0.25;
      x = 590 + 70 * arrowP;
      y = 440 - 50 * arrowP;
    }
    points.push({
      id: points.length,
      targetX: x,
      targetY: y,
      perimeterAngle: (points.length * 137.5 * Math.PI) / 180,
      perimeterRadius: 370 + (points.length % 5) * 14,
      color: colors[(i + 2) % colors.length],
      radius: 4.5,
    });
  }

  // 4. Central Apex Prism (around 540, 220 to 540, 310): 20 points
  for (let i = 0; i < 20; i++) {
    const p = i / 19;
    const x = 540;
    const y = 220 + 90 * p;
    points.push({
      id: points.length,
      targetX: x,
      targetY: y,
      perimeterAngle: (points.length * 137.5 * Math.PI) / 180,
      perimeterRadius: 380 + (points.length % 5) * 12,
      color: "#D8FF3E",
      radius: 5,
    });
  }

  return points;
}

const LATTICE_POINTS = generateLatticePoints();

export function Scene03LogoAssemblySvg({ time = 0 }: { time?: number }) {
  const t = Math.max(0, Math.min(6.0, time));

  // Compute position of each glossy sphere
  // 0.0s - 0.8s: Drift in perimeter ring
  // 0.8s - 2.8s: Swirl inward along spiral trajectories into target lattice
  // 2.8s - 4.0s: Lock in lattice with specular sweep
  // 4.0s - 5.2s: Hold (1.2s)
  // 5.2s - 6.0s: Radial release back to perimeter
  const currentPoints = useMemo(() => {
    return LATTICE_POINTS.map((pt) => {
      let x = pt.targetX;
      let y = pt.targetY;
      let opacity = 0.8;

      if (t < 0.8) {
        // Perimeter ring drift
        const idleAngle = pt.perimeterAngle + t * 0.4;
        x = CENTER_X + pt.perimeterRadius * Math.cos(idleAngle);
        y = CENTER_Y + pt.perimeterRadius * 0.75 * Math.sin(idleAngle);
        opacity = 0.4;
      } else if (t >= 0.8 && t < 2.8) {
        const animT = (t - 0.8) / 2.0;
        const spring = springOvershoot(animT, 6.5, 4.8);

        // Vortex spiral interpolation
        const currentRadius = pt.perimeterRadius * (1 - spring);
        const spiralAngle = pt.perimeterAngle + (1 - spring) * Math.PI * 3;

        const startX = CENTER_X + currentRadius * Math.cos(spiralAngle);
        const startY = CENTER_Y + currentRadius * 0.75 * Math.sin(spiralAngle);

        x = startX + (pt.targetX - startX) * spring;
        y = startY + (pt.targetY - startY) * spring;
        opacity = 0.4 + 0.6 * spring;
      } else if (t >= 2.8 && t < 5.2) {
        // Locked state
        x = pt.targetX;
        y = pt.targetY;
        opacity = 1.0;
      } else {
        // Resetting to perimeter
        const resetT = (t - 5.2) / 0.8;
        const ease = easeInOutCubic(Math.min(1, Math.max(0, resetT)));
        const targetPerimX = CENTER_X + pt.perimeterRadius * Math.cos(pt.perimeterAngle);
        const targetPerimY = CENTER_Y + pt.perimeterRadius * 0.75 * Math.sin(pt.perimeterAngle);
        x = pt.targetX + (targetPerimX - pt.targetX) * ease;
        y = pt.targetY + (targetPerimY - pt.targetY) * ease;
        opacity = 1.0 - 0.6 * ease;
      }

      return {
        ...pt,
        x,
        y,
        opacity,
      };
    });
  }, [t]);

  // Specular sweep across emblem (Phase 3: 2.8s to 3.8s)
  let sweepProgress = 0;
  if (t >= 2.8 && t < 3.8) {
    sweepProgress = (t - 2.8) / 1.0;
  } else if (t >= 3.8 && t < 5.2) {
    sweepProgress = 1.0;
  }

  const sweepX = 340 + sweepProgress * 400;

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
        <radialGradient id="s3Lighting" cx="540" cy="420" r="500" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#20241C" stopOpacity="0.95" />
          <stop offset="70%" stopColor="#171914" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#0E100C" stopOpacity="0.25" />
        </radialGradient>

        <linearGradient id="s3SpecularBorder" x1="120" y1="100" x2="960" y2="860" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#20241C" stopOpacity="0.95" />
          <stop offset="35%" stopColor="#20241C" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#E8E0D1" stopOpacity="0.08" />
        </linearGradient>

        <filter id="s3CardShadow" x="80" y="70" width="920" height="820" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="24" stdDeviation="32" floodColor="#E8E0D1" floodOpacity="0.08" />
        </filter>

        <filter id="s3Glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect width="1080" height="960" rx="36" fill="url(#s3Lighting)" />

      {/* Outer Registration & Coordinates */}
      <g stroke="#E8E0D1" strokeOpacity="0.15" strokeWidth="1.2">
        <path d="M 50 60 L 70 60 M 60 50 L 60 70" />
        <path d="M 1010 60 L 1030 60 M 1020 50 L 1020 70" />
        <path d="M 50 900 L 70 900 M 60 890 L 60 910" />
        <path d="M 1010 900 L 1030 900 M 1020 890 L 1020 910" />
      </g>
      <g fontFamily="var(--font-mono, monospace)" fontSize="11" fill="#C8BFAD" letterSpacing="0.08em">
        <text x="60" y="38">SCENE:03 // LOGO ASSEMBLY</text>
        <text x="960" y="38" textAnchor="end">VORTEX LATTICE CONVERGENCE</text>
      </g>

      {/* ── PRIMARY FROSTED CARD HOUSING (Occupies 65% of Frame) ── */}
      <g filter="url(#s3CardShadow)">
        <rect x="130" y="100" width="820" height="640" rx="28" fill="#20241C" fillOpacity="0.86" />
        <rect x="130.5" y="100.5" width="819" height="639" rx="27.5" stroke="url(#s3SpecularBorder)" strokeWidth="1.5" />
      </g>

      {/* Card Header Inside */}
      <g transform="translate(170, 140)">
        <text x="0" y="0" fontFamily="var(--font-mono, monospace)" fontSize="11" fontWeight="700" fill="#C8BFAD" letterSpacing="0.08em">
          IDENTITY ARCHITECTURE // 120-PARTICLE GEOMETRIC ASSEMBLY
        </text>
      </g>

      {/* Subtle architectural guide lines */}
      <g stroke="#2E3426" strokeWidth="1">
        <circle cx={CENTER_X} cy={CENTER_Y} r="220" strokeDasharray="3 6" />
        <line x1={CENTER_X} y1="180" x2={CENTER_X} y2="680" strokeDasharray="3 6" />
        <line x1="280" y1={CENTER_Y} x2="800" y2={CENTER_Y} strokeDasharray="3 6" />
      </g>

      {/* ── 120 GLOSSY 3D SPHERES CONVERGING INTO ARJUN'S MARK ── */}
      <g id="spheres">
        {currentPoints.map((pt) => (
          <g key={pt.id} transform={`translate(${pt.x.toFixed(2)}, ${pt.y.toFixed(2)})`} opacity={Number(pt.opacity.toFixed(3))}>
            {/* Sphere Body */}
            <circle cx="0" cy="0" r={pt.radius} fill={pt.color} />
            {/* Glossy 3D Highlight */}
            <circle cx={(-pt.radius * 0.3).toFixed(2)} cy={(-pt.radius * 0.3).toFixed(2)} r={(pt.radius * 0.35).toFixed(2)} fill="#20241C" fillOpacity="0.65" />
          </g>
        ))}
      </g>

      {/* Specular Light Sweep Line in Payoff */}
      {t >= 2.8 && t < 3.8 && (
        <line
          x1={sweepX}
          y1="200"
          x2={sweepX + 30}
          y2="620"
          stroke="#20241C"
          strokeWidth="6"
          strokeOpacity="0.8"
          filter="url(#s3Glow)"
        />
      )}

      {/* ── LOWER HERO SIGNATURE & READOUT (≥120px scale display) ── */}
      <g transform="translate(540, 780)">
        {/* Monogram / Typographic Hero */}
        <text
          x="0"
          y="60"
          fontFamily="var(--font-sans, system-ui, sans-serif)"
          fontSize="120"
          fontWeight="800"
          fill={t >= 2.8 && t < 5.2 ? "#E8E0D1" : "#2E3426"}
          letterSpacing="-0.04em"
          textAnchor="middle"
        >
          ARJUN
        </text>
        <text
          x="0"
          y="90"
          fontFamily="var(--font-mono, monospace)"
          fontSize="12"
          fontWeight="700"
          fill="#E65D3F"
          letterSpacing="0.1em"
          textAnchor="middle"
        >
          {t >= 2.8 && t < 5.2 ? "SYSTEMS & PRODUCT TECHNOLOGIST // LOCKED" : "LATTICE ASSEMBLY CONVERGING"}
        </text>
      </g>
    </svg>
  );
}

export function Scene03LogoAssembly({
  title = "Scene 03: Logo Assembly",
  showFrame = true,
  time,
  className,
}: Scene03LogoAssemblyProps) {
  if (!showFrame && time !== undefined) {
    return <Scene03LogoAssemblySvg time={time} />;
  }

  return (
    <MotionStageFrame
      sceneNumber={3}
      sceneTitle={title}
      dataStatus="illustrative"
      sourceNote="Illustrative particle convergence showing 120 glossy spheres assembling into an architectural monogram mark"
      accessibilitySummary="Logo assembly visualization where 120 glossy spheres drift on a perimeter ring and swirl along spiral trajectories to assemble into Arjun's geometric emblem."
      className={className}
    >
      {(timeline) => <Scene03LogoAssemblySvg time={timeline.time} />}
    </MotionStageFrame>
  );
}
