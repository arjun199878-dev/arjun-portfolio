"use client";

import React, { useMemo } from "react";
import { MotionStageFrame } from "@/components/motion/MotionStageFrame";
import { springOvershoot, easeInOutCubic } from "@/lib/motion/easing";

export interface MarketingDashboardVisualProps {
  time?: number;
  showFrame?: boolean;
  className?: string;
}

const SOURCES = [
  { id: "s-gads", label: "Google Ads", iconColor: "#A8CC28", x: 120, y: 150 },
  { id: "s-ga4", label: "GA4 Events", iconColor: "#E65D3F", x: 120, y: 330 },
  { id: "s-gsc", label: "Search Console", iconColor: "#D8FF3E", x: 120, y: 510 },
  { id: "s-crm", label: "CRM Pipeline", iconColor: "#7A9918", x: 960, y: 150 },
  { id: "s-social", label: "Meta & Social", iconColor: "#E65D3F", x: 960, y: 330 },
  { id: "s-sheets", label: "Sheets ETL", iconColor: "#D8FF3E", x: 960, y: 510 },
] as const;

export function MarketingDashboardSvg({ time = 0 }: { time?: number }) {
  const t = Math.max(0, Math.min(6.0, time));

  // Wipe Progress across central dashboard (x: 270 to 810, span = 540)
  // 0.0s - 0.8s: Blueprint wireframe
  // 0.8s - 2.8s: Vertical glowing wipe sweeps left to right
  // 2.8s - 4.0s: Fully resolved full-color dashboard
  // 4.0s - 5.2s: Hold (1.2s)
  // 5.2s - 6.0s: Wipe retracts back to blueprint
  let wipeProgress = 0;
  if (t < 0.8) {
    wipeProgress = 0;
  } else if (t >= 0.8 && t < 2.8) {
    const p = (t - 0.8) / 2.0;
    wipeProgress = springOvershoot(p, 6.0, 5.2);
  } else if (t >= 2.8 && t < 5.2) {
    wipeProgress = 1.0;
  } else {
    const p = (t - 5.2) / 0.8;
    wipeProgress = 1.0 - easeInOutCubic(p);
  }

  const wipeX = 270 + Math.max(0, Math.min(1, wipeProgress)) * 540;

  // Luminous data packet positions streaming along bezier conduits to center (cx: 540, cy: 380)
  const packets = useMemo(() => {
    return SOURCES.map((src, i) => {
      const pStream = (t * 2 + i * 0.3) % 1.0;
      // Linear interpolation along conduit
      const targetX = 540;
      const targetY = 380;
      const x = src.x + (targetX - src.x) * pStream;
      const y = src.y + (targetY - src.y) * pStream;
      const opacity = t >= 0.8 && t < 5.2 ? Math.sin(pStream * Math.PI) * 0.9 : 0.2;
      return { id: src.id, x, y, color: src.iconColor, opacity };
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
        <radialGradient id="midLighting" cx="540" cy="400" r="520" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#20241C" stopOpacity="0.95" />
          <stop offset="70%" stopColor="#171914" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#0E100C" stopOpacity="0.25" />
        </radialGradient>

        <linearGradient id="midSpecularBorder" x1="270" y1="120" x2="810" y2="760" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#20241C" stopOpacity="0.95" />
          <stop offset="35%" stopColor="#20241C" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#E8E0D1" stopOpacity="0.08" />
        </linearGradient>

        {/* Clip paths for before and after the wipe line */}
        <clipPath id="dashboardWireframeClip">
          <rect x={wipeX} y="120" width={810 - wipeX + 20} height="640" />
        </clipPath>

        <clipPath id="dashboardFullColorClip">
          <rect x="270" y="120" width={Math.max(0, wipeX - 270)} height="640" />
        </clipPath>

        <filter id="midCardShadow" x="220" y="80" width="640" height="740" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="24" stdDeviation="32" floodColor="#E8E0D1" floodOpacity="0.09" />
        </filter>

        <filter id="midGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect width="1080" height="960" rx="36" fill="url(#midLighting)" />

      {/* Outer Registration & Coordinates */}
      <g stroke="#E8E0D1" strokeOpacity="0.15" strokeWidth="1.2">
        <path d="M 50 60 L 70 60 M 60 50 L 60 70" />
        <path d="M 1010 60 L 1030 60 M 1020 50 L 1020 70" />
        <path d="M 50 900 L 70 900 M 60 890 L 60 910" />
        <path d="M 1010 900 L 1030 900 M 1020 890 L 1020 910" />
      </g>
      <g fontFamily="var(--font-mono, monospace)" fontSize="11" fill="#C8BFAD" letterSpacing="0.08em">
        <text x="60" y="38">PROJECT:B // MARKETING INTELLIGENCE</text>
        <text x="960" y="38" textAnchor="end">6-SOURCE DATA CONVERGENCE</text>
      </g>

      {/* ── 6 PERIPHERAL SOURCE NODES & BEZIER CONDUITS ── */}
      <g id="conduits" stroke="#E8E0D1" strokeOpacity="0.1" strokeWidth="1.5" strokeDasharray="3 4">
        {SOURCES.map((src) => (
          <path
            key={`conduit-${src.id}`}
            d={`M ${src.x > 500 ? src.x - 70 : src.x + 70} ${src.y} C ${src.x > 500 ? 680 : 400} ${src.y}, ${src.x > 500 ? 640 : 440} 380, 540 380`}
            fill="none"
          />
        ))}
      </g>

      {/* Luminous data packets flowing into center */}
      <g id="packets">
        {packets.map((pkt) => (
          <circle
            key={`pkt-${pkt.id}`}
            cx={pkt.x}
            cy={pkt.y}
            r="4.5"
            fill={pkt.color}
            opacity={pkt.opacity}
            filter="url(#midGlow)"
          />
        ))}
      </g>

      {/* Source Node Badges */}
      <g id="sourceNodes">
        {SOURCES.map((src) => {
          const isLeft = src.x < 500;
          return (
            <g key={src.id} transform={`translate(${src.x - (isLeft ? 0 : 140)}, ${src.y - 24})`}>
              <rect
                x="0"
                y="0"
                width="140"
                height="48"
                rx="14"
                fill="#20241C"
                fillOpacity="0.92"
                stroke="#2E3426"
                strokeWidth="1.2"
              />
              <circle cx="18" cy="24" r="5" fill={src.iconColor} />
              <text
                x="32"
                y="28"
                fontFamily="var(--font-sans, system-ui, sans-serif)"
                fontSize="12"
                fontWeight="700"
                fill="#E8E0D1"
              >
                {src.label}
              </text>
            </g>
          );
        })}
      </g>

      {/* ── CENTRAL DASHBOARD FRAME: 540x640 (Occupies 60% of Frame) ── */}
      {/* 1. Underlying Wireframe / Blueprint Layer (Revealed when wipe hasn't passed) */}
      <g clipPath="url(#dashboardWireframeClip)" filter="url(#midCardShadow)">
        <rect x="270" y="120" width="540" height="640" rx="26" fill="#171914" stroke="#2E3426" strokeWidth="1.5" strokeDasharray="5 5" />

        {/* Blueprint Wireframe Placeholders */}
        <g transform="translate(300, 160)" stroke="#2E3426" strokeWidth="1">
          <text x="0" y="0" fontFamily="var(--font-mono, monospace)" fontSize="12" fill="#C8BFAD" stroke="none">
            [UNRESOLVED WIREFRAME SCHEMA]
          </text>
          {/* Mock wireframe boxes */}
          <rect x="0" y="24" width="220" height="120" rx="12" fill="none" />
          <rect x="240" y="24" width="220" height="120" rx="12" fill="none" />
          <rect x="0" y="170" width="460" height="180" rx="14" fill="none" />
          <rect x="0" y="370" width="460" height="160" rx="14" fill="none" />
        </g>
      </g>

      {/* 2. Full-Color Unified Telemetry Dashboard Layer (Revealed as wipe passes) */}
      <g clipPath="url(#dashboardFullColorClip)" filter="url(#midCardShadow)">
        <rect x="270" y="120" width="540" height="640" rx="26" fill="#20241C" fillOpacity="0.94" />
        <rect x="270.5" y="120.5" width="539" height="639" rx="25.5" stroke="url(#midSpecularBorder)" strokeWidth="1.5" />

        {/* Full-Color Unified Telemetry Content */}
        <g transform="translate(300, 160)">
          {/* Header */}
          <text x="0" y="0" fontFamily="var(--font-mono, monospace)" fontSize="11" fontWeight="700" fill="#C8BFAD" letterSpacing="0.08em">
            UNIFIED MARKETING COMMAND // LIVE AGGREGATION
          </text>

          {/* Metric KPI Cards (ROAS / Blended CAC) */}
          <g transform="translate(0, 24)">
            {/* ROAS Card */}
            <rect x="0" y="0" width="225" height="110" rx="16" fill="#171914" stroke="#2E3426" strokeWidth="1" />
            <text x="20" y="28" fontFamily="var(--font-mono, monospace)" fontSize="11" fill="#C8BFAD">
              Blended ROAS
            </text>
            <text x="20" y="74" fontFamily="var(--font-sans, system-ui, sans-serif)" fontSize="42" fontWeight="800" fill="#D8FF3E">
              4.28×
            </text>
            <text x="20" y="96" fontFamily="var(--font-mono, monospace)" fontSize="10" fill="#D8FF3E" fontWeight="600">
              ↑ +22% vs Target
            </text>

            {/* Blended CAC Card */}
            <rect x="245" y="0" width="225" height="110" rx="16" fill="#171914" stroke="#2E3426" strokeWidth="1" />
            <text x="20" y="28" fontFamily="var(--font-mono, monospace)" fontSize="11" fill="#C8BFAD">
              Unified CAC
            </text>
            <text x="20" y="74" fontFamily="var(--font-sans, system-ui, sans-serif)" fontSize="42" fontWeight="800" fill="#E8E0D1">
              ₹380
            </text>
            <text x="20" y="96" fontFamily="var(--font-mono, monospace)" fontSize="10" fill="#A8CC28" fontWeight="600">
              Normalized All Sources
            </text>
          </g>

          {/* Multi-Channel Efficiency Distribution Ring */}
          <g transform="translate(0, 160)">
            <rect x="0" y="0" width="470" height="170" rx="18" fill="#171914" stroke="#2E3426" strokeWidth="1" />
            {/* Left Donut Ring */}
            <g transform="translate(85, 85)">
              <circle cx="0" cy="0" r="50" fill="none" stroke="#2E3426" strokeWidth="16" />
              <circle cx="0" cy="0" r="50" fill="none" stroke="#A8CC28" strokeWidth="16" strokeDasharray="314" strokeDashoffset="130" transform="rotate(-90)" />
              <circle cx="0" cy="0" r="50" fill="none" stroke="#D8FF3E" strokeWidth="16" strokeDasharray="314" strokeDashoffset="240" transform="rotate(70)" />
              <text x="0" y="6" fontFamily="var(--font-sans, system-ui, sans-serif)" fontSize="16" fontWeight="800" fill="#E8E0D1" textAnchor="middle">
                6/6
              </text>
            </g>
            {/* Right Legend */}
            <g transform="translate(165, 40)">
              <text x="0" y="0" fontFamily="var(--font-sans, system-ui, sans-serif)" fontSize="14" fontWeight="700" fill="#E8E0D1">
                Channel Contribution Alignment
              </text>
              <g transform="translate(0, 20)">
                <circle cx="6" cy="6" r="4" fill="#A8CC28" />
                <text x="18" y="10" fontFamily="var(--font-mono, monospace)" fontSize="11" fill="#C8BFAD">
                  Paid Search & Social: 58%
                </text>
              </g>
              <g transform="translate(0, 42)">
                <circle cx="6" cy="6" r="4" fill="#D8FF3E" />
                <text x="18" y="10" fontFamily="var(--font-mono, monospace)" fontSize="11" fill="#C8BFAD">
                  Organic & Direct Inbound: 42%
                </text>
              </g>
              <g transform="translate(0, 64)">
                <text x="0" y="10" fontFamily="var(--font-mono, monospace)" fontSize="10" fill="#D8FF3E" fontWeight="600">
                  ✓ Reconciliation Discrepancy: 0.0%
                </text>
              </g>
            </g>
          </g>

          {/* Primary Hero Numeral Readout (≥120px display) */}
          <g transform="translate(0, 360)">
            <text
              x="0"
              y="100"
              fontFamily="var(--font-sans, system-ui, sans-serif)"
              fontSize="120"
              fontWeight="800"
              fill="#E8E0D1"
              letterSpacing="-0.04em"
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              100%
            </text>
            <g transform="translate(310, 48)">
              <rect x="0" y="0" width="150" height="28" rx="14" fill="#D8FF3E" fillOpacity="0.12" stroke="rgba(216, 255, 62, 0.16)" strokeWidth="1" />
              <circle cx="14" cy="14" r="3.5" fill="#D8FF3E" />
              <text x="26" y="18" fontFamily="var(--font-mono, monospace)" fontSize="11" fontWeight="700" fill="#D8FF3E">
                6 SOURCES SYNCED
              </text>
              <text x="0" y="48" fontFamily="var(--font-sans, system-ui, sans-serif)" fontSize="16" fontWeight="700" fill="#E8E0D1">
                Unified Analytics Schema
              </text>
              <text x="0" y="66" fontFamily="var(--font-mono, monospace)" fontSize="11" fill="#C8BFAD">
                Zero CSV Spreadsheet Drift
              </text>
            </g>
          </g>
        </g>
      </g>

      {/* ── VERTICAL GLOWING WIPE LINE (Scene 10 Interface Wipe Mechanics) ── */}
      {wipeProgress > 0.02 && wipeProgress < 0.98 && (
        <g transform={`translate(${wipeX}, 120)`}>
          {/* Glowing Wipe Line */}
          <line x1="0" y1="0" x2="0" y2="640" stroke="#D8FF3E" strokeWidth="4" filter="url(#midGlow)" />
          <line x1="0" y1="0" x2="0" y2="640" stroke="#20241C" strokeWidth="1.5" />
          {/* Top & bottom indicator pulses */}
          <circle cx="0" cy="10" r="5" fill="#D8FF3E" />
          <circle cx="0" cy="630" r="5" fill="#D8FF3E" />
        </g>
      )}

      {/* Bottom Architectural Caption */}
      <g transform="translate(540, 840)">
        <text
          x="0"
          y="0"
          fontFamily="var(--font-mono, monospace)"
          fontSize="12"
          fill="#C8BFAD"
          textAnchor="middle"
        >
          Automated ETL Ingestion · Hourly Polling · Normalized Campaign Taxonomy
        </text>
      </g>
    </svg>
  );
}

export function MarketingDashboardVisual({
  time,
  showFrame = true,
  className,
}: MarketingDashboardVisualProps) {
  if (!showFrame && time !== undefined) {
    return <MarketingDashboardSvg time={time} />;
  }

  return (
    <MotionStageFrame
      sceneNumber={3}
      sceneTitle="Marketing Intelligence: Cross-Channel Data Convergence"
      dataStatus="illustrative"
      sourceNote="Illustrative architectural simulation of multi-source data ingestion and interface wipe transition"
      accessibilitySummary="Marketing intelligence dashboard visualization displaying data packets from six advertising and analytics sources converging through an animated vertical wipe into a unified telemetry interface."
      className={className}
    >
      {(timeline) => <MarketingDashboardSvg time={timeline.time} />}
    </MotionStageFrame>
  );
}
