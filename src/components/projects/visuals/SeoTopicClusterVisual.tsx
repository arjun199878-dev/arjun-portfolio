"use client";

import React, { useMemo } from "react";
import { MotionStageFrame } from "@/components/motion/MotionStageFrame";
import { springOvershoot, easeInOutCubic } from "@/lib/motion/easing";

export interface SeoTopicClusterVisualProps {
  time?: number;
  showFrame?: boolean;
  className?: string;
}

const CENTER_X = 540;
const CENTER_Y = 380;
const ORBIT_RADIUS = 210;

const CLUSTERS = [
  { id: "prep", label: "Preparation", sub: "Surface Primer & Prep", angleDeg: -90, x: 540, y: 170, color: "#E65D3F" },
  { id: "select", label: "Paint Selection", sub: "Sheen & Formulation", angleDeg: -18, x: 740, y: 315, color: "#A8CC28" },
  { id: "durability", label: "Durability", sub: "Weather & Washability", angleDeg: 54, x: 663, y: 550, color: "#D8FF3E" },
  { id: "cost", label: "Cost", sub: "Estimator & Sqft Rates", angleDeg: 126, x: 417, y: 550, color: "#7A9918" },
  { id: "coverage", label: "Coverage", sub: "Liters per Sq Meter", angleDeg: 198, x: 340, y: 315, color: "#E65D3F" },
] as const;

export function SeoTopicClusterSvg({ time = 0 }: { time?: number }) {
  const t = Math.max(0, Math.min(6.0, time));

  // Satellite expansion & link drawing (0.8s to 2.8s)
  const clusterStates = useMemo(() => {
    return CLUSTERS.map((cl, i) => {
      let progress = 0;
      let nodeScale = 0.8;
      let opacity = 0.3;

      if (t < 0.8) {
        progress = 0;
        nodeScale = 0.8;
        opacity = 0.3;
      } else if (t >= 0.8 && t < 2.8) {
        const tStart = 0.8 + i * 0.14;
        const dur = 0.8;
        if (t < tStart) {
          progress = 0;
          nodeScale = 0.8;
          opacity = 0.3;
        } else {
          const raw = (t - tStart) / dur;
          const spring = springOvershoot(Math.min(1, raw), 6.5, 5.0);
          progress = Math.min(1, raw);
          nodeScale = 0.8 + 0.25 * spring;
          opacity = 0.3 + 0.7 * Math.min(1, raw * 1.5);
        }
      } else if (t >= 2.8 && t < 5.2) {
        progress = 1.0;
        nodeScale = 1.0;
        opacity = 1.0;
      } else {
        const p = (t - 5.2) / 0.8;
        const ease = easeInOutCubic(Math.min(1, Math.max(0, p)));
        progress = 1.0 - ease;
        nodeScale = 1.0 - 0.2 * ease;
        opacity = 1.0 - 0.7 * ease;
      }

      return {
        ...cl,
        progress,
        nodeScale,
        opacity,
      };
    });
  }, [t]);

  // Telemetry Curve (Search Console Impressions & Clicks)
  let curveProgress = 0;
  if (t < 0.8) {
    curveProgress = 0;
  } else if (t >= 0.8 && t < 2.8) {
    curveProgress = Math.min(1, (t - 0.8) / 1.8);
  } else if (t >= 2.8 && t < 5.2) {
    curveProgress = 1.0;
  } else {
    curveProgress = Math.max(0, 1.0 - (t - 5.2) / 0.8);
  }

  // Hero Figure: "6/6" Cluster Nodes Linked
  const heroColor = t >= 2.8 && t < 5.2 ? "#D8FF3E" : "#E8E0D1";

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
        <radialGradient id="seoLighting" cx="540" cy="380" r="500" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#20241C" stopOpacity="0.95" />
          <stop offset="70%" stopColor="#171914" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#0E100C" stopOpacity="0.25" />
        </radialGradient>

        <linearGradient id="seoSpecularBorder" x1="120" y1="90" x2="960" y2="870" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#20241C" stopOpacity="0.95" />
          <stop offset="35%" stopColor="#20241C" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#E8E0D1" stopOpacity="0.08" />
        </linearGradient>

        <filter id="seoCardShadow" x="80" y="60" width="920" height="840" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="24" stdDeviation="32" floodColor="#E8E0D1" floodOpacity="0.08" />
        </filter>

        <filter id="seoNodeGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect width="1080" height="960" rx="36" fill="url(#seoLighting)" />

      {/* Outer Registration & Coordinates */}
      <g stroke="#E8E0D1" strokeOpacity="0.15" strokeWidth="1.2">
        <path d="M 50 60 L 70 60 M 60 50 L 60 70" />
        <path d="M 1010 60 L 1030 60 M 1020 50 L 1020 70" />
        <path d="M 50 900 L 70 900 M 60 890 L 60 910" />
        <path d="M 1010 900 L 1030 900 M 1020 890 L 1020 910" />
      </g>
      <g fontFamily="var(--font-mono, monospace)" fontSize="11" fill="#C8BFAD" letterSpacing="0.08em">
        <text x="60" y="38">PROJECT:D // TOPIC CLUSTER ARCHITECTURE</text>
        <text x="960" y="38" textAnchor="end">1 PILLAR HUB + 5 SPOKES</text>
      </g>

      {/* ── TOPIC CLUSTER NETWORK CARD (Occupies 65% of Frame) ── */}
      <g filter="url(#seoCardShadow)">
        <rect x="130" y="90" width="820" height="600" rx="28" fill="#20241C" fillOpacity="0.86" />
        <rect x="130.5" y="90.5" width="819" height="599" rx="27.5" stroke="url(#seoSpecularBorder)" strokeWidth="1.5" />
      </g>

      {/* Card Header Inside */}
      <g transform="translate(170, 135)">
        <text x="0" y="0" fontFamily="var(--font-mono, monospace)" fontSize="11" fontWeight="700" fill="#C8BFAD" letterSpacing="0.08em">
          ORGANIC DISCOVERY TOPOLOGY // HUB & SPOKE LINK EQUITY
        </text>
      </g>

      {/* Background Orbit Ring */}
      <circle cx={CENTER_X} cy={CENTER_Y} r={ORBIT_RADIUS} fill="none" stroke="#2E3426" strokeWidth="1.5" strokeDasharray="4 6" />

      {/* ── BIDIRECTIONAL LINK PATHS FROM CENTER TO 5 SATELLITES ── */}
      <g id="spokeLines">
        {clusterStates.map((cl) => {
          const currentX = CENTER_X + (cl.x - CENTER_X) * cl.progress;
          const currentY = CENTER_Y + (cl.y - CENTER_Y) * cl.progress;
          return (
            <g key={`spoke-${cl.id}`}>
              {/* Conduit base */}
              <line x1={CENTER_X} y1={CENTER_Y} x2={cl.x} y2={cl.y} stroke="#2E3426" strokeWidth="1.5" />
              {/* Dynamic growing link line */}
              <line
                x1={CENTER_X}
                y1={CENTER_Y}
                x2={currentX}
                y2={currentY}
                stroke={cl.color}
                strokeWidth="2.5"
                strokeLinecap="round"
                opacity={cl.progress > 0 ? 0.9 : 0}
              />
              {/* Bidirectional pulse indicator */}
              {cl.progress > 0.4 && (
                <circle cx={currentX} cy={currentY} r="4" fill={cl.color} filter="url(#seoNodeGlow)" />
              )}
            </g>
          );
        })}
      </g>

      {/* ── 5 SUPPORTING CLUSTER NODES ── */}
      <g id="clusterSatellites">
        {clusterStates.map((cl) => (
          <g
            key={`node-${cl.id}`}
            transform={`translate(${cl.x}, ${cl.y}) scale(${cl.nodeScale})`}
            opacity={cl.opacity}
            style={{ transformOrigin: "0 0" }}
          >
            {/* Frosted satellite card */}
            <rect
              x="-85"
              y="-32"
              width="170"
              height="64"
              rx="16"
              fill="#20241C"
              stroke={cl.progress >= 0.9 ? cl.color : "#2E3426"}
              strokeWidth={cl.progress >= 0.9 ? "2" : "1"}
            />
            <circle cx="-62" cy="0" r="5" fill={cl.color} />
            <text x="-48" y="-4" fontFamily="var(--font-sans, system-ui, sans-serif)" fontSize="13" fontWeight="800" fill="#E8E0D1">
              {cl.label}
            </text>
            <text x="-48" y="14" fontFamily="var(--font-mono, monospace)" fontSize="10" fill="#C8BFAD">
              {cl.sub}
            </text>
          </g>
        ))}
      </g>

      {/* ── CENTRAL PILLAR HUB: "HOME PAINTING" ── */}
      <g transform={`translate(${CENTER_X}, ${CENTER_Y})`} filter="url(#seoNodeGlow)">
        {/* Outer pulsating ring */}
        <circle cx="0" cy="0" r="66" fill="#20241C" fillOpacity="0.95" stroke="#E65D3F" strokeWidth="2.5" />
        <circle cx="0" cy="0" r="56" fill="#0E100C" />

        <text x="0" y="-8" fontFamily="var(--font-mono, monospace)" fontSize="10" fontWeight="700" fill="#E65D3F" letterSpacing="0.08em" textAnchor="middle">
          PILLAR HUB
        </text>
        <text x="0" y="16" fontFamily="var(--font-sans, system-ui, sans-serif)" fontSize="18" fontWeight="800" fill="#D8FF3E" textAnchor="middle">
          Home Painting
        </text>
      </g>

      {/* ── LOWER SEARCH CONSOLE TRAJECTORY & HERO PAYOFF (≥120px scale) ── */}
      <g transform="translate(130, 720)" filter="url(#seoCardShadow)">
        <rect x="0" y="0" width="820" height="170" rx="24" fill="#20241C" fillOpacity="0.9" stroke="rgba(216, 255, 62, 0.25)" strokeWidth="1.5" />

        {/* Hero Figure */}
        <text
          x="190"
          y="118"
          fontFamily="var(--font-sans, system-ui, sans-serif)"
          fontSize="120"
          fontWeight="800"
          fill={heroColor}
          letterSpacing="-0.04em"
          textAnchor="end"
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          {t >= 2.8 && t < 5.2 ? "6/6" : "1/6"}
        </text>

        {/* Labels & Telemetry */}
        <g transform="translate(220, 48)">
          <text x="0" y="24" fontFamily="var(--font-sans, system-ui, sans-serif)" fontSize="26" fontWeight="800" fill="#E8E0D1">
            Cluster Nodes Linked
          </text>
          <text x="0" y="48" fontFamily="var(--font-mono, monospace)" fontSize="12" fontWeight="600" fill="#D8FF3E" letterSpacing="0.04em">
            HOME PAINTING + 5 SATELLITE CHAPTERS
          </text>
          <text x="0" y="66" fontFamily="var(--font-mono, monospace)" fontSize="11" fill="#C8BFAD">
            Internal Linking Equity & Schema.org Semantic Mesh
          </text>
        </g>

        {/* Mini rising Search Console Trajectory curve on the right */}
        <g transform="translate(580, 50)">
          <rect x="0" y="0" width="200" height="85" rx="12" fill="#171914" stroke="#2E3426" strokeWidth="1" />
          <text x="14" y="22" fontFamily="var(--font-mono, monospace)" fontSize="10" fill="#C8BFAD">
            Organic Search Curve
          </text>
          {/* Sparkline curve */}
          <path
            d="M 20 65 C 60 60, 90 48, 120 38 C 150 28, 170 18, 185 15"
            stroke="#D8FF3E"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            strokeDasharray="200"
            strokeDashoffset={200 * (1 - curveProgress)}
          />
          <text x="185" y="72" fontFamily="var(--font-mono, monospace)" fontSize="10" fontWeight="700" fill="#D8FF3E" textAnchor="end">
            +180% Lift
          </text>
        </g>
      </g>
    </svg>
  );
}

export function SeoTopicClusterVisual({
  time,
  showFrame = true,
  className,
}: SeoTopicClusterVisualProps) {
  if (!showFrame && time !== undefined) {
    return <SeoTopicClusterSvg time={time} />;
  }

  return (
    <MotionStageFrame
      sceneNumber={8}
      sceneTitle="SEO Architecture: Home Painting Topic Cluster"
      dataStatus="illustrative"
      sourceNote="Illustrative topic-cluster simulation showing 'Home Painting' pillar linked to Paint Selection, Coverage, Durability, Preparation, and Cost"
      accessibilitySummary="Topic-cluster SEO visualization demonstrating Home Painting as the primary pillar node connected to five satellite clusters (Paint Selection, Coverage, Durability, Preparation, and Cost) with a rising organic impression trajectory."
      className={className}
    >
      {(timeline) => <SeoTopicClusterSvg time={timeline.time} />}
    </MotionStageFrame>
  );
}
