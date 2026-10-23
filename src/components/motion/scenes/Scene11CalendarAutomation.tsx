"use client";

import React from "react";
import { MotionStageFrame } from "../MotionStageFrame";
import { springOvershoot, easeInOutCubic } from "@/lib/motion/easing";

export interface Scene11CalendarAutomationProps {
  title?: string;
  showFrame?: boolean;
  time?: number;
  className?: string;
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const TIMES = ["09:00", "10:00", "11:00", "12:00"];

export function Scene11CalendarAutomationSvg({ time = 0 }: { time?: number }) {
  const t = Math.max(0, Math.min(6.0, time));

  // Drag-and-Snap Animation (0.8s to 2.8s)
  // Thursday is index 3 (x ~ 610). 11:00 is y ~ 440.
  // Floating block starts at staging position: x=820, y=280
  // Target position: x=580, y=440
  let snapProgress = 0;
  let cursorX = 840;
  let cursorY = 300;
  let cursorOpacity = 0;

  if (t < 0.8) {
    snapProgress = 0;
    cursorOpacity = t / 0.8;
    cursorX = 880 - (t / 0.8) * 40;
    cursorY = 320 - (t / 0.8) * 20;
  } else if (t >= 0.8 && t < 2.8) {
    const p = (t - 0.8) / 1.8;
    snapProgress = springOvershoot(Math.min(1, p), 6.5, 4.8);
    cursorOpacity = 1.0;
    // Bezier arc trajectory
    cursorX = 840 - p * 260;
    cursorY = 300 + p * 140;
  } else if (t >= 2.8 && t < 5.2) {
    snapProgress = 1.0;
    cursorOpacity = Math.max(0, 1 - (t - 2.8) * 1.5);
    cursorX = 580;
    cursorY = 440;
  } else {
    const p = (t - 5.2) / 0.8;
    const ease = easeInOutCubic(Math.min(1, Math.max(0, p)));
    snapProgress = 1.0 - ease;
    cursorOpacity = 0;
  }

  const blockX = 820 - snapProgress * 240;
  const blockY = 280 + snapProgress * 160;

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
        <radialGradient id="s11Lighting" cx="540" cy="400" r="500" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#20241C" stopOpacity="0.95" />
          <stop offset="70%" stopColor="#171914" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#0E100C" stopOpacity="0.25" />
        </radialGradient>

        <linearGradient id="s11SpecularBorder" x1="120" y1="100" x2="960" y2="860" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#20241C" stopOpacity="0.95" />
          <stop offset="35%" stopColor="#20241C" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#E8E0D1" stopOpacity="0.08" />
        </linearGradient>

        <filter id="s11CardShadow" x="80" y="80" width="920" height="800" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="24" stdDeviation="32" floodColor="#E8E0D1" floodOpacity="0.08" />
        </filter>

        <filter id="s11SnapGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect width="1080" height="960" rx="36" fill="url(#s11Lighting)" />

      {/* Outer Registration & Coordinates */}
      <g stroke="#E8E0D1" strokeOpacity="0.15" strokeWidth="1.2">
        <path d="M 50 60 L 70 60 M 60 50 L 60 70" />
        <path d="M 1010 60 L 1030 60 M 1020 50 L 1020 70" />
        <path d="M 50 900 L 70 900 M 60 890 L 60 910" />
        <path d="M 1010 900 L 1030 900 M 1020 890 L 1020 910" />
      </g>
      <g fontFamily="var(--font-mono, monospace)" fontSize="11" fill="#C8BFAD" letterSpacing="0.08em">
        <text x="60" y="38">SCENE:11 // CALENDAR AUTOMATION</text>
        <text x="960" y="38" textAnchor="end">DRAG-AND-SNAP SCHEDULER</text>
      </g>

      {/* ── CALENDAR WINDOW (Occupies 65% of Frame) ── */}
      <g filter="url(#s11CardShadow)">
        <rect x="130" y="110" width="820" height="640" rx="28" fill="#20241C" fillOpacity="0.86" />
        <rect x="130.5" y="110.5" width="819" height="639" rx="27.5" stroke="url(#s11SpecularBorder)" strokeWidth="1.5" />
      </g>

      {/* Calendar Header */}
      <g transform="translate(180, 160)">
        <text x="0" y="0" fontFamily="var(--font-mono, monospace)" fontSize="11" fontWeight="700" fill="#C8BFAD" letterSpacing="0.08em">
          AUTONOMOUS DISPATCH // WEEKLY CALENDAR GRID
        </text>
        <text x="0" y="24" fontFamily="var(--font-sans, system-ui, sans-serif)" fontSize="20" fontWeight="800" fill="#E8E0D1">
          Magnetic Time-Slot Alignment
        </text>
      </g>

      {/* Days of the Week Header Columns */}
      <g transform="translate(240, 220)">
        {DAYS.map((day, i) => (
          <text
            key={day}
            x={i * 125 + 50}
            y="0"
            fontFamily="var(--font-mono, monospace)"
            fontSize="12"
            fontWeight="700"
            fill={i === 3 && snapProgress > 0.8 ? "#D8FF3E" : "#C8BFAD"}
            textAnchor="middle"
          >
            {day.toUpperCase()}
          </text>
        ))}
      </g>

      {/* Grid Lines */}
      <g transform="translate(180, 240)" stroke="#2E3426" strokeWidth="1">
        {/* Horizontal time rows */}
        {TIMES.map((timeStr, idx) => (
          <g key={timeStr} transform={`translate(0, ${idx * 85})`}>
            <text x="0" y="14" fontFamily="var(--font-mono, monospace)" fontSize="11" fill="#8F887A" stroke="none">
              {timeStr}
            </text>
            <line x1="50" y1="10" x2="680" y2="10" />
          </g>
        ))}

        {/* Vertical day columns */}
        {Array.from({ length: 6 }, (_, i) => (
          <line key={i} x1={60 + i * 125} y1="0" x2={60 + i * 125} y2="340" />
        ))}
      </g>

      {/* Target Drop Outline at Thursday 11:00 (x: 580, y: 440) */}
      <rect
        x="555"
        y="420"
        width="115"
        height="75"
        rx="12"
        fill={snapProgress > 0.8 ? "rgba(216, 255, 62, 0.16)" : "none"}
        stroke={snapProgress > 0.8 ? "#D8FF3E" : "#A8CC28"}
        strokeWidth={snapProgress > 0.8 ? "2" : "1.5"}
        strokeDasharray={snapProgress > 0.8 ? "none" : "4 4"}
      />

      {/* ── DRAGGED / SNAPPED SCHEDULE BLOCK ── */}
      <g
        transform={`translate(${blockX}, ${blockY})`}
        filter={snapProgress > 0.8 ? "url(#s11SnapGlow)" : undefined}
      >
        <rect
          x="-55"
          y="-35"
          width="115"
          height="75"
          rx="12"
          fill={snapProgress > 0.8 ? "#D8FF3E" : "#E8E0D1"}
        />
        <text x="-42" y="-12" fontFamily="var(--font-mono, monospace)" fontSize="10" fontWeight="700" fill="#171914">
          11:00 · THU
        </text>
        <text x="-42" y="8" fontFamily="var(--font-sans, system-ui, sans-serif)" fontSize="12" fontWeight="800" fill="#171914">
          Call with Sam
        </text>

        {/* Avatar badge ("SM") */}
        <circle cx="40" cy="18" r="10" fill="#20241C" fillOpacity="0.25" />
        <text x="40" y="21" fontFamily="var(--font-mono, monospace)" fontSize="8" fontWeight="800" fill="#171914" textAnchor="middle">
          SM
        </text>
      </g>

      {/* Animated Cursor */}
      {cursorOpacity > 0 && (
        <g transform={`translate(${cursorX}, ${cursorY})`} opacity={cursorOpacity}>
          <path d="M 0 0 L 14 36 L 22 24 L 38 22 Z" fill="#E8E0D1" stroke="#20241C" strokeWidth="2" />
        </g>
      )}

      {/* ── LOWER HERO READOUT (≥120px display scale) ── */}
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
          {t >= 2.8 && t < 5.2 ? "11:00" : "Open"}
        </text>
      </g>
    </svg>
  );
}

export function Scene11CalendarAutomation({
  title = "Scene 11: Calendar Automation",
  showFrame = true,
  time,
  className,
}: Scene11CalendarAutomationProps) {
  if (!showFrame && time !== undefined) {
    return <Scene11CalendarAutomationSvg time={time} />;
  }

  return (
    <MotionStageFrame
      sceneNumber={11}
      sceneTitle={title}
      dataStatus="illustrative"
      sourceNote="Illustrative calendar automation simulation showing drag-and-snap magnetic event scheduling into Thursday 11:00"
      accessibilitySummary="Calendar automation visualization demonstrating an animated cursor dragging a meeting block and snapping it into an open Thursday 11:00 slot."
      className={className}
    >
      {(timeline) => <Scene11CalendarAutomationSvg time={timeline.time} />}
    </MotionStageFrame>
  );
}
