"use client";

import React, { useMemo } from "react";
import { MotionStageFrame } from "@/components/motion/MotionStageFrame";
import { springOvershoot, easeInOutCubic } from "@/lib/motion/easing";

export interface CleanFanaticsEcosystemVisualProps {
  time?: number;
  showFrame?: boolean;
  className?: string;
}

export function CleanFanaticsEcosystemSvg({ time = 0 }: { time?: number }) {
  const t = Math.max(0, Math.min(6.0, time));

  // 3-Card Stack Animation (Scene 12 mechanics)
  // Cards spring into a 3D perspective stack between 0.8s and 2.8s
  const cardStates = useMemo(() => {
    const cards = [
      {
        id: "card-1",
        channel: "Web Storefront · Next.js",
        title: "Deep Cleaning Booked",
        details: "4BHK Villa · Online Payment Verified",
        timeLabel: "Just now",
        amount: "₹6,400",
        accent: "#A8CC28",
        tStart: 0.85,
        dur: 0.7,
        targetY: 0,
        targetScale: 1.0,
      },
      {
        id: "card-2",
        channel: "Mobile App · Booking Engine",
        title: "Inspection Scheduled",
        details: "Waterproofing Assessment · Crew Assigned",
        timeLabel: "2m ago",
        amount: "₹1,800",
        accent: "#E65D3F",
        tStart: 1.25,
        dur: 0.7,
        targetY: -48,
        targetScale: 0.95,
      },
      {
        id: "card-3",
        channel: "Ops Workflow · Dispatch",
        title: "Crew Dispatched · Live Fleet",
        details: "Team Delta (2 Techs) · On Transit",
        timeLabel: "5m ago",
        amount: "En Route",
        accent: "#D8FF3E",
        tStart: 1.65,
        dur: 0.7,
        targetY: -96,
        targetScale: 0.9,
      },
    ];

    return cards.map((c) => {
      let progress = 0;
      let opacity = 0;
      let y = 140;
      let scale = 0.85;

      if (t < 0.8) {
        progress = 0;
        opacity = 0;
        y = 140;
        scale = 0.85;
      } else if (t >= 0.8 && t < 2.8) {
        if (t < c.tStart) {
          progress = 0;
          opacity = 0;
          y = 140;
          scale = 0.85;
        } else {
          const raw = (t - c.tStart) / c.dur;
          const spring = springOvershoot(Math.min(1, raw), 6.5, 5.0);
          progress = Math.min(1, raw);
          opacity = Math.min(1, raw * 2);
          y = 140 - (140 - c.targetY) * spring;
          scale = 0.85 + (c.targetScale - 0.85) * spring;
        }
      } else if (t >= 2.8 && t < 5.2) {
        progress = 1;
        opacity = 1;
        y = c.targetY;
        scale = c.targetScale;
      } else {
        // Resetting to baseline
        const p = (t - 5.2) / 0.8;
        const ease = easeInOutCubic(Math.min(1, Math.max(0, p)));
        opacity = Math.max(0, 1 - ease * 1.5);
        y = c.targetY + ease * 120;
        scale = c.targetScale - ease * 0.1;
      }

      return {
        ...c,
        progress,
        opacity,
        y,
        scale,
      };
    });
  }, [t]);

  // Hero Counter: 0 -> 12 Active Bookings
  let counterVal = 0;
  let counterColor = "#E8E0D1";

  if (t < 0.8) {
    counterVal = 0;
    counterColor = "#C8BFAD";
  } else if (t >= 0.8 && t < 2.8) {
    const p = (t - 0.8) / 2.0;
    counterVal = Math.round(12 * springOvershoot(p));
    counterColor = "#E8E0D1";
  } else if (t >= 2.8 && t < 5.2) {
    counterVal = 12;
    counterColor = "#D8FF3E";
  } else {
    const p = (t - 5.2) / 0.8;
    counterVal = Math.round(12 * (1 - easeInOutCubic(p)));
    counterColor = "#E8E0D1";
  }

  // Pipeline flow packet progress (0.8s to 2.8s)
  const streamProgress = t < 0.8 ? 0 : t < 2.8 ? (t - 0.8) / 2.0 : t < 5.2 ? 1 : Math.max(0, 1 - (t - 5.2) / 0.8);

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
        <radialGradient id="cfLighting" cx="540" cy="400" r="520" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#20241C" stopOpacity="0.95" />
          <stop offset="70%" stopColor="#171914" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#0E100C" stopOpacity="0.25" />
        </radialGradient>

        <linearGradient id="cfSpecularBorder" x1="100" y1="100" x2="980" y2="860" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#20241C" stopOpacity="0.95" />
          <stop offset="35%" stopColor="#20241C" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#E8E0D1" stopOpacity="0.08" />
        </linearGradient>

        <filter id="cfCardShadow" x="60" y="60" width="960" height="840" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="24" stdDeviation="32" floodColor="#E8E0D1" floodOpacity="0.08" />
          <feDropShadow dx="0" dy="6" stdDeviation="12" floodColor="#E8E0D1" floodOpacity="0.04" />
        </filter>

        <filter id="cfGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect width="1080" height="960" rx="36" fill="url(#cfLighting)" />

      {/* Outer Registration & Coordinates */}
      <g stroke="#E8E0D1" strokeOpacity="0.15" strokeWidth="1.2">
        <path d="M 50 60 L 70 60 M 60 50 L 60 70" />
        <path d="M 1010 60 L 1030 60 M 1020 50 L 1020 70" />
        <path d="M 50 900 L 70 900 M 60 890 L 60 910" />
        <path d="M 1010 900 L 1030 900 M 1020 890 L 1020 910" />
      </g>
      <g fontFamily="var(--font-mono, monospace)" fontSize="11" fill="#C8BFAD" letterSpacing="0.08em">
        <text x="60" y="38">PROJECT:A // CLEANFANATICS ECOSYSTEM</text>
        <text x="960" y="38" textAnchor="end">ACQUISITION → DISPATCH</text>
      </g>

      {/* ── TOP ECOSYSTEM SOURCE NODES (Next.js + Google Ads + GA4 Telemetry) ── */}
      <g transform="translate(140, 100)">
        {/* Node 1: Web & CMS */}
        <g transform="translate(0, 0)">
          <rect x="0" y="0" width="230" height="68" rx="18" fill="#20241C" fillOpacity="0.9" stroke="#2E3426" strokeWidth="1.2" />
          <circle cx="24" cy="24" r="5" fill="#A8CC28" />
          <text x="38" y="24" fontFamily="var(--font-sans, system-ui, sans-serif)" fontSize="13" fontWeight="700" fill="#E8E0D1">
            Web & CMS Storefront
          </text>
          <text x="38" y="44" fontFamily="var(--font-mono, monospace)" fontSize="11" fill="#C8BFAD">
            Next.js App Router + Sanity
          </text>
        </g>

        {/* Node 2: Acquisition Channels */}
        <g transform="translate(260, 0)">
          <rect x="0" y="0" width="240" height="68" rx="18" fill="#20241C" fillOpacity="0.9" stroke="#2E3426" strokeWidth="1.2" />
          <circle cx="24" cy="24" r="5" fill="#E65D3F" />
          <text x="38" y="24" fontFamily="var(--font-sans, system-ui, sans-serif)" fontSize="13" fontWeight="700" fill="#E8E0D1">
            Acquisition Channels
          </text>
          <text x="38" y="44" fontFamily="var(--font-mono, monospace)" fontSize="11" fill="#C8BFAD">
            Google Ads + Organic SEO
          </text>
        </g>

        {/* Node 3: Analytics Stream */}
        <g transform="translate(530, 0)">
          <rect x="0" y="0" width="240" height="68" rx="18" fill="#20241C" fillOpacity="0.9" stroke="#2E3426" strokeWidth="1.2" />
          <circle cx="24" cy="24" r="5" fill="#D8FF3E" />
          <text x="38" y="24" fontFamily="var(--font-sans, system-ui, sans-serif)" fontSize="13" fontWeight="700" fill="#E8E0D1">
            Unified Event Stream
          </text>
          <text x="38" y="44" fontFamily="var(--font-mono, monospace)" fontSize="11" fill="#C8BFAD">
            GA4 · GTM · Mixpanel CAPI
          </text>
        </g>

        {/* Connecting conduits converging down to stack */}
        <path d="M 115 68 C 115 130 380 150 400 180" stroke="#A8CC28" strokeWidth="2" strokeDasharray="4 6" strokeOpacity="0.35" fill="none" />
        <path d="M 380 68 C 380 130 400 150 400 180" stroke="#E65D3F" strokeWidth="2" strokeDasharray="4 6" strokeOpacity="0.35" fill="none" />
        <path d="M 650 68 C 650 130 420 150 400 180" stroke="#D8FF3E" strokeWidth="2" strokeDasharray="4 6" strokeOpacity="0.35" fill="none" />

        {/* Animated packet traveling down conduits */}
        {streamProgress > 0.05 && (
          <circle
            cx={115 + (400 - 115) * streamProgress}
            cy={68 + (180 - 68) * streamProgress}
            r="4.5"
            fill="#A8CC28"
            filter="url(#cfGlow)"
          />
        )}
      </g>

      {/* ── 3D LAYERED NOTIFICATION STACK (Scene 12 mechanics) ── */}
      <g transform="translate(540, 480)" filter="url(#cfCardShadow)">
        {/* Render cards back to front (card-3 -> card-2 -> card-1) */}
        {[...cardStates].reverse().map((c) => (
          <g
            key={c.id}
            transform={`translate(0, ${c.y}) scale(${c.scale})`}
            opacity={c.opacity}
            style={{ transformOrigin: "0 0" }}
          >
            {/* Frosted card surface */}
            <rect
              x="-330"
              y="-65"
              width="660"
              height="130"
              rx="22"
              fill="#20241C"
              fillOpacity="0.94"
              stroke="rgba(216, 255, 62, 0.25)"
              strokeWidth="1.5"
            />
            {/* Color accent left bar */}
            <rect x="-330" y="-65" width="8" height="130" rx="4" fill={c.accent} />

            {/* Notification content */}
            <g transform="translate(-300, -32)">
              {/* Channel Tag */}
              <text
                x="0"
                y="0"
                fontFamily="var(--font-mono, monospace)"
                fontSize="11"
                fontWeight="700"
                fill={c.accent}
                letterSpacing="0.04em"
              >
                {c.channel.toUpperCase()}
              </text>
              <text
                x="380"
                y="0"
                fontFamily="var(--font-mono, monospace)"
                fontSize="11"
                fill="#C8BFAD"
                textAnchor="end"
              >
                {c.timeLabel}
              </text>

              {/* Title */}
              <text
                x="0"
                y="28"
                fontFamily="var(--font-sans, system-ui, sans-serif)"
                fontSize="20"
                fontWeight="800"
                fill="#E8E0D1"
                letterSpacing="-0.01em"
              >
                {c.title}
              </text>

              {/* Details & Amount */}
              <text
                x="0"
                y="52"
                fontFamily="var(--font-mono, monospace)"
                fontSize="12"
                fill="#C8BFAD"
              >
                {c.details}
              </text>
              <text
                x="540"
                y="38"
                fontFamily="var(--font-sans, system-ui, sans-serif)"
                fontSize="22"
                fontWeight="800"
                fill={c.accent}
                textAnchor="end"
              >
                {c.amount}
              </text>
            </g>
          </g>
        ))}
      </g>

      {/* ── LOWER HERO TELEMETRY PAYOFF BADGE (≥120px scale) ── */}
      <g transform="translate(540, 770)" filter="url(#cfCardShadow)">
        <rect
          x="-350"
          y="0"
          width="700"
          height="140"
          rx="24"
          fill="#20241C"
          fillOpacity="0.9"
          stroke="rgba(216, 255, 62, 0.25)"
          strokeWidth="1.5"
        />

        {/* Hero Figure */}
        <text
          x="-50"
          y="102"
          fontFamily="var(--font-sans, system-ui, sans-serif)"
          fontSize="124"
          fontWeight="800"
          fill={counterColor}
          letterSpacing="-0.04em"
          textAnchor="end"
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          {counterVal}
        </text>

        {/* Hero Labels */}
        <g transform="translate(-20, 42)">
          <text
            x="0"
            y="24"
            fontFamily="var(--font-sans, system-ui, sans-serif)"
            fontSize="26"
            fontWeight="800"
            fill="#E8E0D1"
          >
            Active Bookings Flow
          </text>
          <text
            x="0"
            y="48"
            fontFamily="var(--font-mono, monospace)"
            fontSize="12"
            fontWeight="600"
            fill="#D8FF3E"
            letterSpacing="0.04em"
          >
            END-TO-END DIGITAL ECOSYSTEM
          </text>
          <text
            x="0"
            y="66"
            fontFamily="var(--font-mono, monospace)"
            fontSize="11"
            fill="#C8BFAD"
          >
            Next.js + Sanity + Analytics + Ops Dispatch
          </text>
        </g>
      </g>
    </svg>
  );
}

export function CleanFanaticsEcosystemVisual({
  time,
  showFrame = true,
  className,
}: CleanFanaticsEcosystemVisualProps) {
  if (!showFrame && time !== undefined) {
    return <CleanFanaticsEcosystemSvg time={time} />;
  }

  return (
    <MotionStageFrame
      sceneNumber={1}
      sceneTitle="CleanFanatics: Ecosystem Telemetry Stack"
      dataStatus="illustrative"
      sourceNote="Illustrative simulation of integrated web storefront, acquisition channels, and 3D dispatch notification stack"
      accessibilitySummary="CleanFanatics ecosystem visualization demonstrating acquisition telemetry flowing from Next.js web storefront and advertising channels into a 3D layered service booking notification stack."
      className={className}
    >
      {(timeline) => <CleanFanaticsEcosystemSvg time={timeline.time} />}
    </MotionStageFrame>
  );
}
