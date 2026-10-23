"use client";

import React from "react";
import { MotionStageFrame } from "../MotionStageFrame";
import { springOvershoot, easeInOutCubic } from "@/lib/motion/easing";

export interface Scene02SegmentedPricingProps {
  title?: string;
  monthlyPrice?: number;
  yearlyPrice?: number;
  showFrame?: boolean;
  time?: number;
  className?: string;
}

export function Scene02SegmentedPricingSvg({
  time = 0,
  monthlyPrice = 149,
  yearlyPrice = 119,
}: {
  time?: number;
  monthlyPrice?: number;
  yearlyPrice?: number;
}) {
  const t = Math.max(0, Math.min(6.0, time));

  // Segmented Pill Animation (0.8s to 2.8s)
  // Track width: 440px. Half-width: 216px. Pill moves from x=4 to x=220 (dx=216px).
  let toggleProgress = 0;
  if (t < 0.8) {
    toggleProgress = 0;
  } else if (t >= 0.8 && t < 2.8) {
    const p = (t - 0.8) / 1.6;
    toggleProgress = springOvershoot(Math.min(1, p), 7.0, 5.0);
  } else if (t >= 2.8 && t < 5.2) {
    toggleProgress = 1.0;
  } else {
    const p = (t - 5.2) / 0.8;
    toggleProgress = 1.0 - easeInOutCubic(Math.min(1, Math.max(0, p)));
  }

  const pillX = toggleProgress * 216;

  // Price Numeral rolling from 149 to 119
  // Hundreds digit: '1' constant
  // Tens digit: 4 -> 1
  // Units digit: 9 constant
  let priceStr = `$${monthlyPrice}`;
  if (t < 0.8) {
    priceStr = `$${monthlyPrice}`;
  } else if (t >= 0.8 && t < 2.8) {
    const p = (t - 0.8) / 1.6;
    const spring = springOvershoot(Math.min(1, p));
    const currentPrice = Math.round(monthlyPrice - (monthlyPrice - yearlyPrice) * spring);
    priceStr = `$${currentPrice}`;
  } else if (t >= 2.8 && t < 5.2) {
    priceStr = `$${yearlyPrice}`;
  } else {
    const p = (t - 5.2) / 0.8;
    const ease = easeInOutCubic(Math.min(1, Math.max(0, p)));
    const currentPrice = Math.round(yearlyPrice + (monthlyPrice - yearlyPrice) * ease);
    priceStr = `$${currentPrice}`;
  }

  // Savings Badge entrance (Phase 3: 2.8s - 4.0s)
  let badgeScale = 0;
  let badgeOpacity = 0;
  if (t < 2.7) {
    badgeScale = 0;
    badgeOpacity = 0;
  } else if (t >= 2.7 && t < 4.0) {
    const p = (t - 2.7) / 0.8;
    badgeScale = springOvershoot(Math.min(1, p), 6.5, 5.0);
    badgeOpacity = Math.min(1, p * 2);
  } else if (t >= 4.0 && t < 5.2) {
    badgeScale = 1.0;
    badgeOpacity = 1.0;
  } else {
    const p = (t - 5.2) / 0.6;
    badgeScale = Math.max(0, 1.0 - p);
    badgeOpacity = Math.max(0, 1.0 - p * 2);
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
        <radialGradient id="s2Lighting" cx="540" cy="400" r="500" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#20241C" stopOpacity="0.95" />
          <stop offset="70%" stopColor="#171914" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#0E100C" stopOpacity="0.25" />
        </radialGradient>

        <linearGradient id="s2SpecularBorder" x1="180" y1="120" x2="900" y2="820" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#20241C" stopOpacity="0.95" />
          <stop offset="35%" stopColor="#20241C" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#E8E0D1" stopOpacity="0.08" />
        </linearGradient>

        <filter id="s2CardShadow" x="120" y="80" width="840" height="780" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="24" stdDeviation="32" floodColor="#E8E0D1" floodOpacity="0.08" />
        </filter>

        <filter id="s2PillShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#E8E0D1" floodOpacity="0.08" />
        </filter>

        <clipPath id="tensDigitClip">
          <rect x="0" y="0" width="70" height="130" />
        </clipPath>
      </defs>

      <rect width="1080" height="960" rx="36" fill="url(#s2Lighting)" />

      {/* Outer Registration & Coordinates */}
      <g stroke="#E8E0D1" strokeOpacity="0.15" strokeWidth="1.2">
        <path d="M 50 60 L 70 60 M 60 50 L 60 70" />
        <path d="M 1010 60 L 1030 60 M 1020 50 L 1020 70" />
        <path d="M 50 900 L 70 900 M 60 890 L 60 910" />
        <path d="M 1010 900 L 1030 900 M 1020 890 L 1020 910" />
      </g>
      <g fontFamily="var(--font-mono, monospace)" fontSize="11" fill="#C8BFAD" letterSpacing="0.08em">
        <text x="60" y="38">SCENE:02 // SEGMENTED PRICING CONTROL</text>
        <text x="960" y="38" textAnchor="end">ANNUAL SAVINGS OPTIMIZATION</text>
      </g>

      {/* ── PRIMARY FROSTED PRICING CARD (Occupies 65% of Frame) ── */}
      <g filter="url(#s2CardShadow)">
        <rect x="180" y="110" width="720" height="710" rx="28" fill="#20241C" fillOpacity="0.86" />
        <rect x="180.5" y="110.5" width="719" height="709" rx="27.5" stroke="url(#s2SpecularBorder)" strokeWidth="1.5" />
      </g>

      {/* Card Header & Tier Badge */}
      <g transform="translate(240, 160)">
        <text x="0" y="0" fontFamily="var(--font-mono, monospace)" fontSize="11" fontWeight="700" fill="#C8BFAD" letterSpacing="0.08em">
          GROWTH STACK // ENTERPRISE SUBSCRIPTION
        </text>
        <g transform="translate(0, 16)">
          <text x="0" y="24" fontFamily="var(--font-sans, system-ui, sans-serif)" fontSize="26" fontWeight="800" fill="#E8E0D1">
            Full-Stack Technologist Tier
          </text>
          <text x="0" y="44" fontFamily="var(--font-mono, monospace)" fontSize="12" fill="#C8BFAD">
            Architected for scalable digital products, telemetry & automation loops
          </text>
        </g>
      </g>

      {/* ── IOS-STYLE SEGMENTED CONTROL ── */}
      <g transform="translate(320, 260)">
        {/* Track */}
        <rect x="0" y="0" width="440" height="52" rx="26" fill="#0E100C" stroke="#2E3426" strokeWidth="1" />

        {/* Sliding Pill */}
        <rect
          x={4 + pillX}
          y="4"
          width="216"
          height="44"
          rx="22"
          fill="#20241C"
          stroke="#2E3426"
          strokeWidth="1"
          filter="url(#s2PillShadow)"
        />

        {/* Monthly Option */}
        <text
          x="112"
          y="31"
          fontFamily="var(--font-sans, system-ui, sans-serif)"
          fontSize="13"
          fontWeight="700"
          fill={toggleProgress < 0.5 ? "#E8E0D1" : "#C8BFAD"}
          textAnchor="middle"
        >
          Monthly Billing
        </text>

        {/* Yearly Option */}
        <text
          x="328"
          y="31"
          fontFamily="var(--font-sans, system-ui, sans-serif)"
          fontSize="13"
          fontWeight="700"
          fill={toggleProgress >= 0.5 ? "#E8E0D1" : "#C8BFAD"}
          textAnchor="middle"
        >
          Yearly · Save 20%
        </text>
      </g>

      {/* ── HERO DISPLAY PRICE NUMERAL (≥120px scale) ── */}
      <g transform="translate(240, 440)">
        {/* Primary Hero Numeral */}
        <text
          x="0"
          y="70"
          fontFamily="var(--font-sans, system-ui, sans-serif)"
          fontSize="130"
          fontWeight="800"
          fill="#E8E0D1"
          letterSpacing="-0.04em"
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          {priceStr}
        </text>

        <g transform="translate(370, 18)">
          <text x="0" y="24" fontFamily="var(--font-sans, system-ui, sans-serif)" fontSize="20" fontWeight="700" fill="#C8BFAD">
            {toggleProgress >= 0.5 ? "/mo billed yearly" : "/mo billed monthly"}
          </text>
          <text x="0" y="44" fontFamily="var(--font-mono, monospace)" fontSize="12" fill="#8F887A">
            Includes all 4 core capability pillars
          </text>
        </g>

        {/* Spring Savings Badge */}
        {badgeOpacity > 0 && (
          <g
            transform={`translate(370, 72) scale(${badgeScale})`}
            opacity={badgeOpacity}
            style={{ transformOrigin: "0 0" }}
          >
            <rect x="0" y="0" width="220" height="34" rx="17" fill="rgba(216, 255, 62, 0.16)" stroke="rgba(216, 255, 62, 0.16)" strokeWidth="1" />
            <circle cx="16" cy="17" r="4" fill="#D8FF3E" />
            <text x="28" y="21" fontFamily="var(--font-mono, monospace)" fontSize="11" fontWeight="700" fill="#D8FF3E">
              SAVE $360/YR · ANNUAL ACTIVE
            </text>
          </g>
        )}
      </g>

      {/* ── 3 INCLUDED CAPABILITY FEATURE CHECKS ── */}
      <g transform="translate(240, 580)">
        <line x1="0" y1="0" x2="600" y2="0" stroke="#2E3426" strokeWidth="1" />

        <g transform="translate(0, 24)">
          <g transform="translate(0, 0)">
            <circle cx="12" cy="12" r="10" fill="rgba(216, 255, 62, 0.16)" />
            <path d="M 8 12 L 11 15 L 16 9" stroke="#D8FF3E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <text x="32" y="16" fontFamily="var(--font-sans, system-ui, sans-serif)" fontSize="14" fontWeight="700" fill="#E8E0D1">
              Full Next.js App Router Architecture
            </text>
            <text x="32" y="34" fontFamily="var(--font-mono, monospace)" fontSize="11" fill="#C8BFAD">
              Production performance, responsive glass design tokens, zero runtime bloat
            </text>
          </g>

          <g transform="translate(0, 56)">
            <circle cx="12" cy="12" r="10" fill="rgba(216, 255, 62, 0.16)" />
            <path d="M 8 12 L 11 15 L 16 9" stroke="#D8FF3E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <text x="32" y="16" fontFamily="var(--font-sans, system-ui, sans-serif)" fontSize="14" fontWeight="700" fill="#E8E0D1">
              Unified Server & Client Telemetry (GA4 + Mixpanel)
            </text>
            <text x="32" y="34" fontFamily="var(--font-mono, monospace)" fontSize="11" fill="#C8BFAD">
              Dual governance auditing between verified and illustrative metrics
            </text>
          </g>

          <g transform="translate(0, 112)">
            <circle cx="12" cy="12" r="10" fill="rgba(216, 255, 62, 0.16)" />
            <path d="M 8 12 L 11 15 L 16 9" stroke="#D8FF3E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <text x="32" y="16" fontFamily="var(--font-sans, system-ui, sans-serif)" fontSize="14" fontWeight="700" fill="#E8E0D1">
              Model Context Protocol (MCP) & API Workflows
            </text>
            <text x="32" y="34" fontFamily="var(--font-mono, monospace)" fontSize="11" fill="#C8BFAD">
              Connected agent loops with verified tool calling and automated CRM writes
            </text>
          </g>
        </g>
      </g>
    </svg>
  );
}

export function Scene02SegmentedPricing({
  title = "Scene 02: Segmented Pricing Control",
  monthlyPrice = 149,
  yearlyPrice = 119,
  showFrame = true,
  time,
  className,
}: Scene02SegmentedPricingProps) {
  if (!showFrame && time !== undefined) {
    return <Scene02SegmentedPricingSvg time={time} monthlyPrice={monthlyPrice} yearlyPrice={yearlyPrice} />;
  }

  return (
    <MotionStageFrame
      sceneNumber={2}
      sceneTitle={title}
      dataStatus="illustrative"
      sourceNote="Hypothetical product tier demonstrating segmented control, mechanical price odometer, and annual savings badge"
      accessibilitySummary="Segmented pricing control visualization switching between monthly $149 and yearly $119 with spring physics and an active savings badge."
      className={className}
    >
      {(timeline) => (
        <Scene02SegmentedPricingSvg
          time={timeline.time}
          monthlyPrice={monthlyPrice}
          yearlyPrice={yearlyPrice}
        />
      )}
    </MotionStageFrame>
  );
}
