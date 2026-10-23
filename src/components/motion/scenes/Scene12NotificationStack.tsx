"use client";

import React, { useMemo } from "react";
import { MotionStageFrame } from "../MotionStageFrame";
import { springOvershoot, easeInOutCubic } from "@/lib/motion/easing";

export interface Scene12NotificationStackProps {
  title?: string;
  showFrame?: boolean;
  time?: number;
  className?: string;
}

export function Scene12NotificationStackSvg({ time = 0 }: { time?: number }) {
  const t = Math.max(0, Math.min(6.0, time));

  // 3-Card Stack Animation (0.8s to 2.8s)
  const cardStates = useMemo(() => {
    const cards = [
      {
        id: "c1",
        title: "New order £42",
        sub: "Booked · Automated Flow",
        timeText: "Just now",
        accent: "#A8CC28",
        tStart: 0.85,
        dur: 0.7,
        targetY: 0,
        targetScale: 1.0,
      },
      {
        id: "c2",
        title: "New order £96",
        sub: "Confirmed · Express Slot",
        timeText: "2m ago",
        accent: "#E65D3F",
        tStart: 1.3,
        dur: 0.7,
        targetY: -50,
        targetScale: 0.94,
      },
      {
        id: "c3",
        title: "12 new orders",
        sub: "Batch Synced · Pipeline Active",
        timeText: "5m ago",
        accent: "#D8FF3E",
        tStart: 1.75,
        dur: 0.7,
        targetY: -100,
        targetScale: 0.88,
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
          const spring = springOvershoot(Math.min(1, raw), 6.5, 4.8);
          progress = Math.min(1, raw);
          opacity = Math.min(1, raw * 2);
          y = 140 - (140 - c.targetY) * spring;
          scale = 0.85 + (c.targetScale - 0.85) * spring;
        }
      } else if (t >= 2.8 && t < 5.2) {
        progress = 1.0;
        opacity = 1.0;
        y = c.targetY;
        scale = c.targetScale;
      } else {
        const p = (t - 5.2) / 0.8;
        const ease = easeInOutCubic(Math.min(1, Math.max(0, p)));
        opacity = Math.max(0, 1.0 - ease * 1.5);
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

  // Hero Counter: 0 -> 12
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
        <radialGradient id="s12Lighting" cx="540" cy="400" r="500" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#20241C" stopOpacity="0.95" />
          <stop offset="70%" stopColor="#171914" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#0E100C" stopOpacity="0.25" />
        </radialGradient>

        <linearGradient id="s12SpecularBorder" x1="120" y1="100" x2="960" y2="860" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#20241C" stopOpacity="0.95" />
          <stop offset="35%" stopColor="#20241C" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#E8E0D1" stopOpacity="0.08" />
        </linearGradient>

        <filter id="s12CardShadow" x="80" y="80" width="920" height="800" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="24" stdDeviation="32" floodColor="#E8E0D1" floodOpacity="0.08" />
        </filter>
      </defs>

      <rect width="1080" height="960" rx="36" fill="url(#s12Lighting)" />

      {/* Outer Registration & Coordinates */}
      <g stroke="#E8E0D1" strokeOpacity="0.15" strokeWidth="1.2">
        <path d="M 50 60 L 70 60 M 60 50 L 60 70" />
        <path d="M 1010 60 L 1030 60 M 1020 50 L 1020 70" />
        <path d="M 50 900 L 70 900 M 60 890 L 60 910" />
        <path d="M 1010 900 L 1030 900 M 1020 890 L 1020 910" />
      </g>
      <g fontFamily="var(--font-mono, monospace)" fontSize="11" fill="#C8BFAD" letterSpacing="0.08em">
        <text x="60" y="38">SCENE:12 // NOTIFICATION STACK</text>
        <text x="960" y="38" textAnchor="end">PERSPECTIVE SPRING PILE</text>
      </g>

      {/* ── BASE MONITOR FRAME (Occupies 65% of Frame) ── */}
      <g filter="url(#s12CardShadow)">
        <rect x="140" y="110" width="800" height="660" rx="28" fill="#20241C" fillOpacity="0.86" />
        <rect x="140.5" y="110.5" width="799" height="659" rx="27.5" stroke="url(#s12SpecularBorder)" strokeWidth="1.5" />
      </g>

      {/* Header Inside Card */}
      <g transform="translate(190, 160)">
        <text x="0" y="0" fontFamily="var(--font-mono, monospace)" fontSize="11" fontWeight="700" fill="#C8BFAD" letterSpacing="0.08em">
          REAL-TIME TELEMETRY // ORDER & BOOKING DISPATCH
        </text>
        <text x="0" y="24" fontFamily="var(--font-sans, system-ui, sans-serif)" fontSize="20" fontWeight="800" fill="#E8E0D1">
          3D Perspective Notification Queue
        </text>
      </g>

      {/* ── 3D PERSPECTIVE NOTIFICATION STACK (Center at 540, 430) ── */}
      <g transform="translate(540, 430)">
        {[...cardStates].reverse().map((c) => (
          <g
            key={c.id}
            transform={`translate(0, ${c.y}) scale(${c.scale})`}
            opacity={c.opacity}
            style={{ transformOrigin: "0 0" }}
          >
            <rect
              x="-320"
              y="-60"
              width="640"
              height="120"
              rx="20"
              fill="#20241C"
              stroke="#2E3426"
              strokeWidth="1.2"
            />
            {/* Color stripe */}
            <rect x="-320" y="-60" width="8" height="120" rx="4" fill={c.accent} />

            <g transform="translate(-290, -26)">
              <text x="0" y="0" fontFamily="var(--font-mono, monospace)" fontSize="11" fontWeight="700" fill={c.accent} letterSpacing="0.04em">
                {c.sub.toUpperCase()}
              </text>
              <text x="560" y="0" fontFamily="var(--font-mono, monospace)" fontSize="11" fill="#8F887A" textAnchor="end">
                {c.timeText}
              </text>

              <text x="0" y="30" fontFamily="var(--font-sans, system-ui, sans-serif)" fontSize="22" fontWeight="800" fill="#E8E0D1">
                {c.title}
              </text>
              <text x="0" y="52" fontFamily="var(--font-mono, monospace)" fontSize="11" fill="#C8BFAD">
                Stripe & Cart Webhook Acknowledged · Dispatched
              </text>
            </g>
          </g>
        ))}
      </g>

      {/* ── LOWER HERO READOUT (≥120px scale display) ── */}
      <g transform="translate(540, 770)">
        <text
          x="-30"
          y="70"
          fontFamily="var(--font-sans, system-ui, sans-serif)"
          fontSize="120"
          fontWeight="800"
          fill={counterColor}
          letterSpacing="-0.04em"
          textAnchor="end"
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          {counterVal}
        </text>

        <g transform="translate(0, 16)">
          <text x="0" y="24" fontFamily="var(--font-sans, system-ui, sans-serif)" fontSize="26" fontWeight="800" fill="#E8E0D1">
            New Orders Synced
          </text>
          <text x="0" y="48" fontFamily="var(--font-mono, monospace)" fontSize="12" fontWeight="600" fill="#D8FF3E" letterSpacing="0.04em">
            BATCH QUEUE ACTIVE // 100% INGESTION
          </text>
          <text x="0" y="66" fontFamily="var(--font-mono, monospace)" fontSize="11" fill="#C8BFAD">
            Zero Drop-off Event Pipeline
          </text>
        </g>
      </g>
    </svg>
  );
}

export function Scene12NotificationStack({
  title = "Scene 12: Notification Stack",
  showFrame = true,
  time,
  className,
}: Scene12NotificationStackProps) {
  if (!showFrame && time !== undefined) {
    return <Scene12NotificationStackSvg time={time} />;
  }

  return (
    <MotionStageFrame
      sceneNumber={12}
      sceneTitle={title}
      dataStatus="illustrative"
      sourceNote="Illustrative order stream simulation demonstrating 3D perspective notification piling and badge counter"
      accessibilitySummary="Notification stack visualization demonstrating real-time order notifications arriving with spring physics into a 3D perspective stack with an incrementing badge counter."
      className={className}
    >
      {(timeline) => <Scene12NotificationStackSvg time={timeline.time} />}
    </MotionStageFrame>
  );
}
