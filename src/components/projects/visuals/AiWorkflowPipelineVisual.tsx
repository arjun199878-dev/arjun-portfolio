"use client";

import React, { useMemo } from "react";
import { MotionStageFrame } from "@/components/motion/MotionStageFrame";
import { springOvershoot, easeInOutCubic } from "@/lib/motion/easing";

export interface AiWorkflowPipelineVisualProps {
  time?: number;
  showFrame?: boolean;
  className?: string;
}

const STAGES = [
  { id: "s1", num: "01", name: "Input Trigger", sub: "Webhook Ingestion", color: "#A8CC28", x: 210, y: 520 },
  { id: "s2", num: "02", name: "AI Reasoning", sub: "Intent Extraction", color: "#E65D3F", x: 430, y: 520 },
  { id: "s3", num: "03", name: "MCP & Retrieval", sub: "Tool Context Sync", color: "#A8CC28", x: 650, y: 520 },
  { id: "s4", num: "04", name: "Action Output", sub: "Audited Mutation", color: "#D8FF3E", x: 870, y: 520 },
] as const;

export function AiWorkflowPipelineSvg({ time = 0 }: { time?: number }) {
  const t = Math.max(0, Math.min(6.0, time));

  // Dynamic Island / Live Activity Pill Expansion (Scene 4 mechanics)
  // 0.0s - 0.8s: Compact pill (w: 240, h: 42)
  // 0.8s - 2.8s: Expands with spring physics into live card (w: 580, h: 140)
  // 2.8s - 5.2s: Holds expanded state with live active badge
  // 5.2s - 6.0s: Collapses back to compact pill
  let pillProgress = 0;
  if (t < 0.8) {
    pillProgress = 0;
  } else if (t >= 0.8 && t < 2.8) {
    const p = (t - 0.8) / 2.0;
    pillProgress = springOvershoot(p, 6.2, 5.2);
  } else if (t >= 2.8 && t < 5.2) {
    pillProgress = 1.0;
  } else {
    const p = (t - 5.2) / 0.8;
    pillProgress = 1.0 - easeInOutCubic(p);
  }

  const pillWidth = 240 + pillProgress * 340;
  const pillHeight = 44 + pillProgress * 96;

  // Payload Traversal across the 4 stages (x: 210 -> 870, span = 660)
  let payloadProgress = 0;
  if (t < 0.8) {
    payloadProgress = 0;
  } else if (t >= 0.8 && t < 2.8) {
    payloadProgress = Math.min(1, (t - 0.8) / 1.8);
  } else if (t >= 2.8 && t < 5.2) {
    payloadProgress = 1.0;
  } else {
    payloadProgress = Math.max(0, 1.0 - (t - 5.2) / 0.8);
  }

  const payloadX = 210 + payloadProgress * 660;

  // Active status per node
  const nodeStates = useMemo(() => {
    return STAGES.map((stg, i) => {
      const threshold = i / 3;
      const isReached = payloadProgress >= threshold;
      const isCurrent = payloadProgress >= threshold && payloadProgress < (i + 1) / 3;
      return {
        ...stg,
        isReached,
        isCurrent,
      };
    });
  }, [payloadProgress]);

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
        <radialGradient id="aiLighting" cx="540" cy="400" r="520" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#20241C" stopOpacity="0.95" />
          <stop offset="70%" stopColor="#171914" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#0E100C" stopOpacity="0.25" />
        </radialGradient>

        <linearGradient id="aiSpecularBorder" x1="120" y1="120" x2="960" y2="840" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#20241C" stopOpacity="0.95" />
          <stop offset="35%" stopColor="#20241C" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#E8E0D1" stopOpacity="0.08" />
        </linearGradient>

        <filter id="aiCardShadow" x="80" y="80" width="920" height="800" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="24" stdDeviation="32" floodColor="#E8E0D1" floodOpacity="0.08" />
        </filter>

        <filter id="aiPillGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect width="1080" height="960" rx="36" fill="url(#aiLighting)" />

      {/* Outer Registration & Coordinates */}
      <g stroke="#E8E0D1" strokeOpacity="0.15" strokeWidth="1.2">
        <path d="M 50 60 L 70 60 M 60 50 L 60 70" />
        <path d="M 1010 60 L 1030 60 M 1020 50 L 1020 70" />
        <path d="M 50 900 L 70 900 M 60 890 L 60 910" />
        <path d="M 1010 900 L 1030 900 M 1020 890 L 1020 910" />
      </g>
      <g fontFamily="var(--font-mono, monospace)" fontSize="11" fill="#C8BFAD" letterSpacing="0.08em">
        <text x="60" y="38">PROJECT:C // AI WORKFLOW PIPELINE</text>
        <text x="960" y="38" textAnchor="end">INPUT → PROCESSING → MCP → OUTPUT</text>
      </g>

      {/* ── TOP DYNAMIC LIVE ACTIVITY PILL (Scene 4 mechanics) ── */}
      <g transform="translate(540, 160)">
        <rect
          x={-pillWidth / 2}
          y={0}
          width={pillWidth}
          height={pillHeight}
          rx={pillHeight / 2 > 28 ? 26 : pillHeight / 2}
          fill="#E8E0D1"
          stroke="rgba(216, 255, 62, 0.25)"
          strokeWidth="1.5"
          filter="url(#aiPillGlow)"
        />

        {/* Compact vs Expanded Pill Content */}
        {pillProgress < 0.35 ? (
          <g transform="translate(0, 26)">
            <circle cx="-80" cy="0" r="4.5" fill="#A8CC28">
              <animate attributeName="opacity" values="1;0.4;1" dur="1.8s" repeatCount="indefinite" />
            </circle>
            <text
              x="-65"
              y="4"
              fontFamily="var(--font-mono, monospace)"
              fontSize="12"
              fontWeight="600"
              fill="#E8E0D1"
              letterSpacing="0.04em"
            >
              MCP PIPELINE STANDING BY
            </text>
          </g>
        ) : (
          <g transform={`translate(${-pillWidth / 2 + 28}, 28)`}>
            {/* Expanded Header */}
            <circle cx="8" cy="8" r="5" fill="#D8FF3E" />
            <text x="24" y="12" fontFamily="var(--font-mono, monospace)" fontSize="11" fontWeight="700" fill="#D8FF3E" letterSpacing="0.06em">
              AGENT LOOP ACTIVE // RUNNING JOB #4082
            </text>
            <text x="470" y="12" fontFamily="var(--font-mono, monospace)" fontSize="11" fill="#8F887A">
              0.0ms Latency
            </text>

            <text x="0" y="44" fontFamily="var(--font-sans, system-ui, sans-serif)" fontSize="18" fontWeight="800" fill="#E8E0D1">
              Context Ingestion → Dynamic MCP Server Query
            </text>
            <text x="0" y="66" fontFamily="var(--font-mono, monospace)" fontSize="12" fill="#8F887A">
              Validated Tools: CRM Writer · Postgres Sync · Notification Dispatcher
            </text>
          </g>
        )}
      </g>

      {/* ── 4-STAGE PIPELINE HOUSING CARD (Occupies 65% of Stage Frame) ── */}
      <g filter="url(#aiCardShadow)">
        <rect x="130" y="340" width="820" height="420" rx="28" fill="#20241C" fillOpacity="0.86" />
        <rect x="130.5" y="340.5" width="819" height="419" rx="27.5" stroke="url(#aiSpecularBorder)" strokeWidth="1.5" />
      </g>

      {/* Card Header Inside */}
      <g transform="translate(170, 385)">
        <text x="0" y="0" fontFamily="var(--font-mono, monospace)" fontSize="11" fontWeight="700" fill="#C8BFAD" letterSpacing="0.08em">
          FOUR-STAGE AGENTIC WORKFLOW PIPELINE
        </text>
        <text x="0" y="24" fontFamily="var(--font-sans, system-ui, sans-serif)" fontSize="18" fontWeight="800" fill="#E8E0D1">
          Deterministic Tool Execution with MCP Standard
        </text>
      </g>

      {/* Horizontal Pipeline Connecting Conduit */}
      <g>
        <line x1="210" y1="520" x2="870" y2="520" stroke="#2E3426" strokeWidth="4" strokeLinecap="round" />
        <line
          x1="210"
          y1="520"
          x2={payloadX}
          y2="520"
          stroke="#D8FF3E"
          strokeWidth="4"
          strokeLinecap="round"
          strokeOpacity={payloadProgress > 0 ? 0.9 : 0}
        />
      </g>

      {/* Traveling Luminous Payload Node */}
      {payloadProgress > 0.02 && payloadProgress < 0.98 && (
        <g transform={`translate(${payloadX}, 520)`} filter="url(#aiPillGlow)">
          <circle cx="0" cy="0" r="14" fill="#20241C" />
          <circle cx="0" cy="0" r="9" fill="#D8FF3E" />
        </g>
      )}

      {/* 4 Pipeline Stage Nodes */}
      <g id="pipelineNodes">
        {nodeStates.map((stg) => {
          const nodeColor = stg.isReached ? (stg.id === "s4" ? "#D8FF3E" : stg.color) : "#2E3426";
          const bgColor = stg.isReached ? "#20241C" : "#171914";

          return (
            <g key={stg.id} transform={`translate(${stg.x}, ${stg.y})`}>
              {/* Node Outer Circle */}
              <circle cx="0" cy="0" r="32" fill={bgColor} stroke={nodeColor} strokeWidth="3" filter={stg.isReached ? "url(#aiPillGlow)" : undefined} />
              <text x="0" y="6" fontFamily="var(--font-mono, monospace)" fontSize="14" fontWeight="800" fill={stg.isReached ? "#E8E0D1" : "#8F887A"} textAnchor="middle">
                {stg.num}
              </text>

              {/* Labels below node */}
              <text x="0" y="54" fontFamily="var(--font-sans, system-ui, sans-serif)" fontSize="14" fontWeight="800" fill="#E8E0D1" textAnchor="middle">
                {stg.name}
              </text>
              <text x="0" y="72" fontFamily="var(--font-mono, monospace)" fontSize="11" fill="#C8BFAD" textAnchor="middle">
                {stg.sub}
              </text>

              {/* Verified check badge at Stage 4 on payoff */}
              {stg.id === "s4" && t >= 2.8 && t < 5.2 && (
                <g transform="translate(18, -26)" filter="url(#aiPillGlow)">
                  <circle cx="10" cy="10" r="12" fill="#D8FF3E" />
                  <path d="M 6 10 L 9 13 L 14 7" stroke="#20241C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </g>
              )}
            </g>
          );
        })}
      </g>

      {/* ── LOWER HERO READOUT (≥120px scale display) ── */}
      <g transform="translate(540, 810)">
        <text
          x="-40"
          y="72"
          fontFamily="var(--font-sans, system-ui, sans-serif)"
          fontSize="120"
          fontWeight="800"
          fill={t >= 2.8 && t < 5.2 ? "#D8FF3E" : "#E8E0D1"}
          letterSpacing="-0.04em"
          textAnchor="end"
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          {t >= 2.8 && t < 5.2 ? "4/4" : "0/4"}
        </text>

        <g transform="translate(-10, 16)">
          <text x="0" y="24" fontFamily="var(--font-sans, system-ui, sans-serif)" fontSize="26" fontWeight="800" fill="#E8E0D1">
            Stages Verified
          </text>
          <text x="0" y="48" fontFamily="var(--font-mono, monospace)" fontSize="12" fontWeight="600" fill="#D8FF3E" letterSpacing="0.04em">
            0MS MANUAL HANDOFF // CONCEPT PROTOTYPE
          </text>
          <text x="0" y="66" fontFamily="var(--font-mono, monospace)" fontSize="11" fill="#C8BFAD">
            Model Context Protocol + Tool Execution
          </text>
        </g>
      </g>
    </svg>
  );
}

export function AiWorkflowPipelineVisual({
  time,
  showFrame = true,
  className,
}: AiWorkflowPipelineVisualProps) {
  if (!showFrame && time !== undefined) {
    return <AiWorkflowPipelineSvg time={time} />;
  }

  return (
    <MotionStageFrame
      sceneNumber={5}
      sceneTitle="AI & Workflow Automation: 4-Stage MCP Engine"
      dataStatus="illustrative"
      sourceNote="Illustrative prototype simulation of multi-step AI tool calling, context retrieval, and verified mutation"
      accessibilitySummary="AI and workflow automation visualization showing a live activity pill expanding while payload traverses Input, Reasoning, MCP Retrieval, and Output stages into a 4/4 verified state."
      className={className}
    >
      {(timeline) => <AiWorkflowPipelineSvg time={timeline.time} />}
    </MotionStageFrame>
  );
}
