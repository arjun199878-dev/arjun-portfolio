"use client";

import React from "react";
import { MotionStageFrame } from "@/components/motion/MotionStageFrame";
import { springOvershoot, easeInOutCubic } from "@/lib/motion/easing";

export interface BusinessExperimentsVisualProps {
  time?: number;
  showFrame?: boolean;
  className?: string;
}

const SCHEDULE_SLOTS = [
  { id: "slot-1", time: "05:30", label: "Ingredient Scaling & Proofing", status: "Completed", isLocked: true },
  { id: "slot-2", time: "07:00", label: "Batch #04 Sourdough Deck Oven", status: "Baking Active", isLocked: false },
  { id: "slot-3", time: "08:30", label: "Retail & Pre-Order Packaging", status: "Scheduled", isLocked: false },
  { id: "slot-4", time: "10:00", label: "Direct Delivery Dispatch", status: "Pending", isLocked: false },
] as const;

export function BusinessExperimentsSvg({ time = 0 }: { time?: number }) {
  const t = Math.max(0, Math.min(6.0, time));

  // Segmented Control Toggle (Scene 2 mechanics)
  // Toggle track: x: 300, y: 150, width: 480, height: 50.
  // Pill position 0 (Mode 1: Daily Bakery Batch) to position 1 (Mode 2: Direct Online Order).
  let toggleProgress = 0;
  if (t < 0.8) {
    toggleProgress = 0;
  } else if (t >= 0.8 && t < 2.8) {
    const p = (t - 0.8) / 1.6;
    toggleProgress = springOvershoot(Math.min(1, p), 7.0, 5.2);
  } else if (t >= 2.8 && t < 5.2) {
    toggleProgress = 1.0;
  } else {
    const p = (t - 5.2) / 0.8;
    toggleProgress = 1.0 - easeInOutCubic(Math.min(1, Math.max(0, p)));
  }

  // Pill slides from x: 0 to x: 236
  const pillOffsetX = toggleProgress * 236;

  // Calendar / Schedule Slot Snap (Scene 11 mechanics)
  // Incoming block starts above (y: 350) and snaps into Slot 2 at y: 470
  let slotSnapProgress = 0;
  let cursorX = 720;
  let cursorY = 400;
  let cursorOpacity = 0;

  if (t < 1.0) {
    slotSnapProgress = 0;
    cursorOpacity = 0;
  } else if (t >= 1.0 && t < 2.8) {
    const p = (t - 1.0) / 1.4;
    slotSnapProgress = springOvershoot(Math.min(1, p), 6.5, 5.0);
    cursorOpacity = Math.min(1, p * 2);
    // Cursor guides block into slot
    cursorX = 720 - p * 180;
    cursorY = 400 + p * 80;
  } else if (t >= 2.8 && t < 5.2) {
    slotSnapProgress = 1.0;
    cursorOpacity = Math.max(0, 1 - (t - 2.8) * 1.5);
    cursorX = 540;
    cursorY = 480;
  } else {
    slotSnapProgress = Math.max(0, 1.0 - (t - 5.2) / 0.8);
    cursorOpacity = 0;
  }

  // Hero Unit Economics Yield Figure: 82.5% -> 98.4%
  let yieldVal = "82.5%";
  let yieldColor = "#E8E0D1";

  if (t < 0.8) {
    yieldVal = "82.5%";
    yieldColor = "#C8BFAD";
  } else if (t >= 0.8 && t < 2.8) {
    const p = (t - 0.8) / 2.0;
    const currentNum = (82.5 + 15.9 * springOvershoot(p)).toFixed(1);
    yieldVal = `${currentNum}%`;
    yieldColor = "#E8E0D1";
  } else if (t >= 2.8 && t < 5.2) {
    yieldVal = "98.4%";
    yieldColor = "#D8FF3E";
  } else {
    const p = (t - 5.2) / 0.8;
    const currentNum = (98.4 - 15.9 * easeInOutCubic(p)).toFixed(1);
    yieldVal = `${currentNum}%`;
    yieldColor = "#E8E0D1";
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
        <radialGradient id="bizLighting" cx="540" cy="400" r="520" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#20241C" stopOpacity="0.95" />
          <stop offset="70%" stopColor="#171914" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#0E100C" stopOpacity="0.25" />
        </radialGradient>

        <linearGradient id="bizSpecularBorder" x1="120" y1="100" x2="960" y2="860" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#20241C" stopOpacity="0.95" />
          <stop offset="35%" stopColor="#20241C" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#E8E0D1" stopOpacity="0.08" />
        </linearGradient>

        <filter id="bizCardShadow" x="80" y="80" width="920" height="800" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="24" stdDeviation="32" floodColor="#E8E0D1" floodOpacity="0.08" />
        </filter>

        <filter id="bizGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect width="1080" height="960" rx="36" fill="url(#bizLighting)" />

      {/* Outer Registration & Coordinates */}
      <g stroke="#E8E0D1" strokeOpacity="0.15" strokeWidth="1.2">
        <path d="M 50 60 L 70 60 M 60 50 L 60 70" />
        <path d="M 1010 60 L 1030 60 M 1020 50 L 1020 70" />
        <path d="M 50 900 L 70 900 M 60 890 L 60 910" />
        <path d="M 1010 900 L 1030 900 M 1020 890 L 1020 910" />
      </g>
      <g fontFamily="var(--font-mono, monospace)" fontSize="11" fill="#C8BFAD" letterSpacing="0.08em">
        <text x="60" y="38">PROJECT:E // BUSINESS & OPERATIONAL EXPERIMENTS</text>
        <text x="960" y="38" textAnchor="end">SEGMENTED OPS + DISPATCH GRID</text>
      </g>

      {/* ── PRIMARY OPERATIONAL CONSOLE CARD (Occupies 65% of Frame) ── */}
      <g filter="url(#bizCardShadow)">
        <rect x="130" y="100" width="820" height="620" rx="28" fill="#20241C" fillOpacity="0.86" />
        <rect x="130.5" y="100.5" width="819" height="619" rx="27.5" stroke="url(#bizSpecularBorder)" strokeWidth="1.5" />
      </g>

      {/* Card Header Inside */}
      <g transform="translate(170, 140)">
        <text x="0" y="0" fontFamily="var(--font-mono, monospace)" fontSize="11" fontWeight="700" fill="#C8BFAD" letterSpacing="0.08em">
          OPERATIONAL PROTOTYPE // BATCH YIELD & DISPATCH ENGINE
        </text>
      </g>

      {/* ── IOS-STYLE SEGMENTED OPERATIONS MODE CONTROL (Scene 2 mechanics) ── */}
      <g transform="translate(300, 170)">
        {/* Track Housing */}
        <rect x="0" y="0" width="480" height="52" rx="26" fill="#0E100C" stroke="#2E3426" strokeWidth="1" />

        {/* Sliding Selection Pill */}
        <rect
          x={4 + pillOffsetX}
          y="4"
          width="236"
          height="44"
          rx="22"
          fill="#20241C"
          stroke="#2E3426"
          strokeWidth="1"
          filter="url(#bizGlow)"
        />

        {/* Mode 1 Label */}
        <text
          x="122"
          y="31"
          fontFamily="var(--font-sans, system-ui, sans-serif)"
          fontSize="13"
          fontWeight="700"
          fill={toggleProgress < 0.5 ? "#E8E0D1" : "#C8BFAD"}
          textAnchor="middle"
        >
          Daily Bakery Batch
        </text>

        {/* Mode 2 Label */}
        <text
          x="358"
          y="31"
          fontFamily="var(--font-sans, system-ui, sans-serif)"
          fontSize="13"
          fontWeight="700"
          fill={toggleProgress >= 0.5 ? "#E8E0D1" : "#C8BFAD"}
          textAnchor="middle"
        >
          Direct Online Order
        </text>
      </g>

      {/* ── AUTOMATED PRODUCTION & ORDER SCHEDULE GRID (Scene 11 mechanics) ── */}
      <g transform="translate(170, 260)">
        {/* Grid Title */}
        <text x="0" y="0" fontFamily="var(--font-sans, system-ui, sans-serif)" fontSize="16" fontWeight="800" fill="#E8E0D1">
          Morning Production Timeline
        </text>
        <text x="0" y="18" fontFamily="var(--font-mono, monospace)" fontSize="11" fill="#C8BFAD">
          Deck Oven Capacity & Scheduled Dispatches
        </text>

        {/* 4 Time Slots List */}
        <g transform="translate(0, 36)">
          {SCHEDULE_SLOTS.map((slot, idx) => {
            const isTargetSlot = slot.id === "slot-2";
            const slotBg = isTargetSlot && slotSnapProgress > 0.8 ? "rgba(216, 255, 62, 0.16)" : "#171914";
            const slotStroke = isTargetSlot && slotSnapProgress > 0.8 ? "#D8FF3E" : "#2E3426";

            return (
              <g key={slot.id} transform={`translate(0, ${idx * 68})`}>
                <rect x="0" y="0" width="740" height="56" rx="14" fill={slotBg} stroke={slotStroke} strokeWidth={isTargetSlot && slotSnapProgress > 0.8 ? "1.5" : "1"} />

                {/* Time Badge */}
                <rect x="12" y="11" width="68" height="34" rx="8" fill="#20241C" stroke="#2E3426" strokeWidth="1" />
                <text x="46" y="32" fontFamily="var(--font-mono, monospace)" fontSize="12" fontWeight="700" fill="#E8E0D1" textAnchor="middle">
                  {slot.time}
                </text>

                {/* Slot Description */}
                <text x="96" y="33" fontFamily="var(--font-sans, system-ui, sans-serif)" fontSize="14" fontWeight="700" fill="#E8E0D1">
                  {slot.label}
                </text>

                {/* Status indicator on the right */}
                <g transform="translate(620, 18)">
                  <rect
                    x="0"
                    y="0"
                    width="105"
                    height="22"
                    rx="11"
                    fill={isTargetSlot && slotSnapProgress > 0.8 ? "#D8FF3E" : "#2E3426"}
                    fillOpacity={isTargetSlot && slotSnapProgress > 0.8 ? "0.15" : "1"}
                  />
                  <text
                    x="52"
                    y="15"
                    fontFamily="var(--font-mono, monospace)"
                    fontSize="10"
                    fontWeight="700"
                    fill={isTargetSlot && slotSnapProgress > 0.8 ? "#D8FF3E" : "#C8BFAD"}
                    textAnchor="middle"
                  >
                    {isTargetSlot && slotSnapProgress > 0.8 ? "LOCKED & VERIFIED" : slot.status.toUpperCase()}
                  </text>
                </g>
              </g>
            );
          })}
        </g>
      </g>

      {/* Animated Drag-and-Snap Cursor */}
      {cursorOpacity > 0 && (
        <g transform={`translate(${cursorX}, ${cursorY})`} opacity={cursorOpacity} filter="url(#bizGlow)">
          <path d="M 0 0 L 14 36 L 22 24 L 38 22 Z" fill="#E8E0D1" stroke="#20241C" strokeWidth="2" />
        </g>
      )}

      {/* ── LOWER HERO BATCH YIELD READOUT (≥120px scale display) ── */}
      <g transform="translate(540, 750)" filter="url(#bizCardShadow)">
        <rect x="-350" y="0" width="700" height="150" rx="24" fill="#20241C" fillOpacity="0.9" stroke="rgba(216, 255, 62, 0.25)" strokeWidth="1.5" />

        {/* Hero Figure */}
        <text
          x="-30"
          y="108"
          fontFamily="var(--font-sans, system-ui, sans-serif)"
          fontSize="120"
          fontWeight="800"
          fill={yieldColor}
          letterSpacing="-0.04em"
          textAnchor="end"
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          {yieldVal}
        </text>

        <g transform="translate(0, 42)">
          <text x="0" y="24" fontFamily="var(--font-sans, system-ui, sans-serif)" fontSize="26" fontWeight="800" fill="#E8E0D1">
            Batch Formula Yield
          </text>
          <text x="0" y="48" fontFamily="var(--font-mono, monospace)" fontSize="12" fontWeight="600" fill="#D8FF3E" letterSpacing="0.04em">
            ZERO-WASTE INGREDIENT SCALING PROTOTYPE
          </text>
          <text x="0" y="66" fontFamily="var(--font-mono, monospace)" fontSize="11" fill="#C8BFAD">
            Unit Economics · Recipe Multipliers · Touch-First UI
          </text>
        </g>
      </g>
    </svg>
  );
}

export function BusinessExperimentsVisual({
  time,
  showFrame = true,
  className,
}: BusinessExperimentsVisualProps) {
  if (!showFrame && time !== undefined) {
    return <BusinessExperimentsSvg time={time} />;
  }

  return (
    <MotionStageFrame
      sceneNumber={10}
      sceneTitle="Operations: Segmented Control & Dispatch Grid"
      dataStatus="illustrative"
      sourceNote="Concept and operational experiment demonstrating batch yield calculation, segmented control, and schedule slot snapping"
      accessibilitySummary="Operational tooling visualization showing a segmented toggle switching modes while a production batch snaps into an automated morning dispatch schedule slot."
      className={className}
    >
      {(timeline) => <BusinessExperimentsSvg time={timeline.time} />}
    </MotionStageFrame>
  );
}
