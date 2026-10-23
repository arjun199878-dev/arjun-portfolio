"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "./PerformanceSection.module.css";

const ORGANIC_BARS = [
  { month: "M1", height: 22, yTop: 154 },
  { month: "M3", height: 34, yTop: 142 },
  { month: "M5", height: 48, yTop: 128 },
  { month: "M7", height: 64, yTop: 112 },
  { month: "M9", height: 82, yTop: 94 },
  { month: "M11", height: 96, yTop: 80 },
  { month: "M12", height: 124, yTop: 52 },
] as const;

// Smooth cubic easing
function easeOutCubic(x: number): number {
  return 1 - Math.pow(1 - Math.max(0, Math.min(1, x)), 3);
}

// Smooth spring overshoot easing for bars
function easeOutBack(x: number): number {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  const t = Math.max(0, Math.min(1, x));
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

// Evaluate point on the cubic bezier spline for the traveling tracer dot
function getSplinePoint(progress: number): { x: number; y: number } {
  const t = Math.max(0, Math.min(1, progress));
  // Piecewise cubic bezier matching path:
  // M 58 154 C 160 146, 260 120, 360 88 C 445 60, 515 38, 582 22
  if (t <= 0.5) {
    const u = t * 2;
    const inv = 1 - u;
    const x =
      inv * inv * inv * 58 +
      3 * inv * inv * u * 160 +
      3 * inv * u * u * 260 +
      u * u * u * 360;
    const y =
      inv * inv * inv * 154 +
      3 * inv * inv * u * 146 +
      3 * inv * u * u * 120 +
      u * u * u * 88;
    return { x, y };
  } else {
    const u = (t - 0.5) * 2;
    const inv = 1 - u;
    const x =
      inv * inv * inv * 360 +
      3 * inv * inv * u * 445 +
      3 * inv * u * u * 515 +
      u * u * u * 582;
    const y =
      inv * inv * inv * 88 +
      3 * inv * inv * u * 60 +
      3 * inv * u * u * 38 +
      u * u * u * 22;
    return { x, y };
  }
}

export function PerformanceSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  // Continuous 6.5-second loop time `t` (0 -> 6.5) so motion graphics are ALWAYS alive
  const [t, setT] = useState<number>(3.8);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    let rafId = 0;
    let isVisible = true;
    const start = performance.now();
    const LOOP_MS = 6500;

    const el = sectionRef.current;
    let observer: IntersectionObserver | null = null;
    if (el && "IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        ([entry]) => {
          isVisible = entry.isIntersecting;
        },
        { threshold: 0.05 }
      );
      observer.observe(el);
    }

    const tick = (now: number) => {
      if (isVisible) {
        const elapsed = (now - start) % LOOP_MS;
        setT(elapsed / 1000);
      }
      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);
    return () => {
      window.cancelAnimationFrame(rafId);
      if (observer) observer.disconnect();
    };
  }, []);

  // Normalized envelope:
  // 0.0s -> 2.4s: Build & animate up with spring physics
  // 2.4s -> 5.4s: Hold completed peak state with subtle live breathing/shimmer
  // 5.4s -> 6.5s: Smooth reset transition for next cycle
  const getPhaseProgress = (delaySec: number, durationSec: number): number => {
    if (t < 5.4) {
      const raw = (t - delaySec) / durationSec;
      return easeOutCubic(raw);
    }
    // Smooth fade/reset between 5.4s and 6.5s
    const exitRaw = (t - 5.4) / 1.1;
    return 1 - easeOutCubic(exitRaw);
  };

  // Card 1 Progresses
  const splineProgress = getPhaseProgress(0.35, 1.75);
  const areaOpacity = getPhaseProgress(0.65, 1.4);
  const imprValue = Math.round(482 * getPhaseProgress(0.15, 1.65));
  const clicksValue = Math.round(167 * getPhaseProgress(0.25, 1.65));
  const tracerPt = getSplinePoint(splineProgress);

  // Card 2 Progresses (Rings)
  const outerRingProg = getPhaseProgress(0.2, 1.7);
  const innerRingProg = getPhaseProgress(0.45, 1.65);
  const roasValue = (3.0 * outerRingProg).toFixed(1);
  const cacValue = Math.round(28 * innerRingProg);

  // Outer ring end-cap dot coordinates (r=70, center=90,90, max sweep = 86%)
  const outerAngleRad = (-90 + outerRingProg * 0.86 * 360) * (Math.PI / 180);
  const outerCapX = 90 + 70 * Math.cos(outerAngleRad);
  const outerCapY = 90 + 70 * Math.sin(outerAngleRad);

  // Inner ring end-cap dot coordinates (r=50, center=90,90, max sweep = 72%)
  const innerAngleRad = (-90 + innerRingProg * 0.72 * 360) * (Math.PI / 180);
  const innerCapX = 90 + 50 * Math.cos(innerAngleRad);
  const innerCapY = 90 + 50 * Math.sin(innerAngleRad);

  // Card 3 Progresses (Conversion & Speed Bars)
  const bar1Prog = getPhaseProgress(0.15, 1.3);
  const bar2Prog = getPhaseProgress(0.4, 1.55);
  const bar3Prog = getPhaseProgress(0.65, 1.55);
  const cvrBaseVal = (6.0 * bar1Prog).toFixed(1);
  const cvrAfterVal = (6.0 + 5.0 * bar2Prog).toFixed(1);
  const speedLiftVal = Math.round(47 * bar3Prog);

  // Card 4 Progresses (SERP & Audience Scale)
  const visitsProg = getPhaseProgress(0.2, 1.65);
  const rankProg = getPhaseProgress(0.35, 1.55);
  const followersProg = getPhaseProgress(0.5, 1.6);
  const dailyVisitsVal = Math.round(47 + (631 - 47) * visitsProg);
  const currentRankVal = Math.round(22 - (22 - 9) * rankProg);
  const followersK = (24 + 12 * followersProg).toFixed(1);

  return (
    <section
      id="performance"
      ref={sectionRef}
      className={styles.section}
      aria-labelledby="performance-title"
    >
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <div className={styles.eyebrow}>Performance in Motion</div>
            <h2 id="performance-title" className={styles.title}>
              Verified Outcomes
            </h2>
          </div>
          <p className={styles.subtitle}>
            Live motion telemetry across organic search, ₹10–15L/mo paid media, and
            automated WhatsApp conversion.
          </p>
        </div>

        {/* 4-Card Apple-Grade Motion Grid */}
        <div className={styles.bentoGrid}>
          {/* ── GRAPH 01: Clean Fanatics 12-Month Search Velocity ── */}
          <div className={styles.bentoCardWide}>
            <div className={styles.cardTop}>
              <div>
                <span className={styles.cardTag}>
                  <span className={styles.liveDotAcid} />
                  Clean Fanatics · 12-Month Search Velocity
                </span>
                <h3 className={styles.cardTitle}>SEO, AEO &amp; Topic-Cluster Growth</h3>
              </div>
              <div className={styles.kpiGroup}>
                <div className={styles.kpiPrimary}>
                  <span className={styles.kpiNumberAcid} data-numeric>
                    +{imprValue}%
                  </span>
                  <span className={styles.kpiCaption}>Impressions</span>
                </div>
                <div className={styles.kpiDivider} />
                <div className={styles.kpiSecondary}>
                  <span className={styles.kpiNumberParchment} data-numeric>
                    +{clicksValue}%
                  </span>
                  <span className={styles.kpiCaption}>Organic Clicks</span>
                </div>
              </div>
            </div>

            <div className={styles.chartStage}>
              <svg
                className={styles.areaSvg}
                viewBox="0 0 640 210"
                fill="none"
                aria-label="Animated 12-month organic search impression trajectory"
              >
                <defs>
                  <linearGradient id="acidAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#D8FF3E" stopOpacity="0.32" />
                    <stop offset="100%" stopColor="#D8FF3E" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="barHighlightGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#D8FF3E" stopOpacity="1" />
                    <stop offset="100%" stopColor="#D8FF3E" stopOpacity="0.35" />
                  </linearGradient>
                  <linearGradient id="barMutedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#E8E0D1" stopOpacity="0.28" />
                    <stop offset="100%" stopColor="#E8E0D1" stopOpacity="0.06" />
                  </linearGradient>
                </defs>

                {/* Horizontal Grid Lines */}
                <line x1="28" y1="32" x2="612" y2="32" stroke="#2E3426" strokeDasharray="3 4" />
                <line x1="28" y1="88" x2="612" y2="88" stroke="#2E3426" strokeDasharray="3 4" />
                <line x1="28" y1="144" x2="612" y2="144" stroke="#2E3426" strokeDasharray="3 4" />
                <line x1="28" y1="176" x2="612" y2="176" stroke="#2E3426" />

                {/* Illuminated Area Under Curve */}
                <path
                  d="M 58 154 C 160 146, 260 120, 360 88 C 445 60, 515 38, 582 22 L 582 176 L 58 176 Z"
                  fill="url(#acidAreaGrad)"
                  style={{ opacity: areaOpacity }}
                />

                {/* 7 Staggered Spring Bars */}
                {ORGANIC_BARS.map((bar, idx) => {
                  const x = 44 + idx * 86;
                  const isLast = idx === ORGANIC_BARS.length - 1;
                  const delay = 0.1 + idx * 0.12;
                  const rawBar =
                    t < 5.4
                      ? easeOutBack(Math.max(0, Math.min(1, (t - delay) / 0.85)))
                      : 1 - easeOutCubic((t - 5.4) / 1.1);
                  const currentH = Math.max(2, bar.height * Math.max(0, rawBar));
                  const currentY = 176 - currentH;

                  return (
                    <g key={bar.month}>
                      <rect
                        x={x}
                        y={currentY}
                        width="28"
                        height={currentH}
                        rx="4"
                        fill={isLast ? "url(#barHighlightGrad)" : "url(#barMutedGrad)"}
                      />
                      <text
                        x={x + 14}
                        y="196"
                        textAnchor="middle"
                        fill={isLast ? "#D8FF3E" : "#8F887A"}
                        fontSize="11"
                        fontWeight={isLast ? "700" : "400"}
                        fontFamily="var(--font-mono)"
                      >
                        {bar.month}
                      </text>
                    </g>
                  );
                })}

                {/* Drawn Spline Curve */}
                <path
                  d="M 58 154 C 160 146, 260 120, 360 88 C 445 60, 515 38, 582 22"
                  stroke="#D8FF3E"
                  strokeWidth="3.25"
                  strokeLinecap="round"
                  pathLength="100"
                  strokeDasharray="100"
                  strokeDashoffset={100 - splineProgress * 100}
                />

                {/* Traveling Live Tracer Node Along Spline */}
                {splineProgress > 0.02 && (
                  <g>
                    <circle
                      cx={tracerPt.x}
                      cy={tracerPt.y}
                      r="12"
                      fill="rgba(216, 255, 62, 0.24)"
                    />
                    <circle
                      cx={tracerPt.x}
                      cy={tracerPt.y}
                      r="5.5"
                      fill="#D8FF3E"
                      stroke="#171914"
                      strokeWidth="2"
                    />
                  </g>
                )}

                {/* Floating Peak Callout Pill at M12 */}
                {splineProgress > 0.82 && (
                  <g
                    style={{
                      opacity: Math.min(1, (splineProgress - 0.82) * 5.5),
                    }}
                  >
                    <rect
                      x="466"
                      y="6"
                      width="98"
                      height="24"
                      rx="12"
                      fill="#171914"
                      stroke="#D8FF3E"
                      strokeWidth="1.2"
                    />
                    <text
                      x="515"
                      y="22"
                      textAnchor="middle"
                      fill="#D8FF3E"
                      fontSize="11"
                      fontWeight="700"
                      fontFamily="var(--font-mono)"
                    >
                      +482% PEAK
                    </text>
                  </g>
                )}
              </svg>
            </div>

            <div className={styles.cardFooter}>
              <span>On-Page · Technical SEO · AEO/GEO AI Search Optimization</span>
              <span className={styles.footerBadge}>Google Search Console Verified</span>
            </div>
          </div>

          {/* ── GRAPH 02: Paid Media Efficiency (Apple Activity Rings) ── */}
          <div className={styles.bentoCard}>
            <div className={styles.cardTopCompact}>
              <span className={styles.cardTag}>
                <span className={styles.liveDotAcid} />
                Google &amp; Meta Ads · ₹10–15L/Mo
              </span>
              <h3 className={styles.cardTitle}>Paid Media Efficiency</h3>
            </div>

            <div className={styles.ringsStage}>
              <div className={styles.ringsVisual}>
                <svg
                  className={styles.ringsSvg}
                  viewBox="0 0 180 180"
                  aria-label="Concentric efficiency rings for ROAS and CAC reduction"
                >
                  {/* Outer Track & Sweep (~3.0x ROAS -> 86% arc) */}
                  <circle
                    cx="90"
                    cy="90"
                    r="70"
                    stroke="rgba(232, 224, 209, 0.08)"
                    strokeWidth="12"
                    fill="none"
                  />
                  <circle
                    cx="90"
                    cy="90"
                    r="70"
                    stroke="#D8FF3E"
                    strokeWidth="12"
                    strokeLinecap="round"
                    fill="none"
                    pathLength="100"
                    strokeDasharray="100"
                    strokeDashoffset={100 - outerRingProg * 86}
                    transform="rotate(-90 90 90)"
                  />
                  {outerRingProg > 0.05 && (
                    <circle
                      cx={outerCapX}
                      cy={outerCapY}
                      r="4"
                      fill="#171914"
                    />
                  )}

                  {/* Inner Track & Sweep (-28% CAC -> 72% arc) */}
                  <circle
                    cx="90"
                    cy="90"
                    r="50"
                    stroke="rgba(232, 224, 209, 0.08)"
                    strokeWidth="12"
                    fill="none"
                  />
                  <circle
                    cx="90"
                    cy="90"
                    r="50"
                    stroke="#E65D3F"
                    strokeWidth="12"
                    strokeLinecap="round"
                    fill="none"
                    pathLength="100"
                    strokeDasharray="100"
                    strokeDashoffset={100 - innerRingProg * 72}
                    transform="rotate(-90 90 90)"
                  />
                  {innerRingProg > 0.05 && (
                    <circle
                      cx={innerCapX}
                      cy={innerCapY}
                      r="3.5"
                      fill="#171914"
                    />
                  )}
                </svg>

                <div className={styles.ringsCenterLabel}>
                  <span className={styles.ringsBigVal} data-numeric>
                    ~{roasValue}×
                  </span>
                  <span className={styles.ringsSubVal}>ROAS</span>
                </div>
              </div>

              <div className={styles.ringsLegend}>
                <div className={styles.legendRow}>
                  <span className={styles.legendDotAcid} />
                  <div>
                    <div className={styles.legendValue} data-numeric>
                      ~{roasValue}× Return on Ad Spend
                    </div>
                    <div className={styles.legendSub}>₹10–15 Lakhs monthly spend</div>
                  </div>
                </div>
                <div className={styles.legendRow}>
                  <span className={styles.legendDotVermilion} />
                  <div>
                    <div className={styles.legendValue} data-numeric>
                      -{cacValue}% Acquisition Cost (CAC)
                    </div>
                    <div className={styles.legendSub}>GoMarble AI creative diagnostics</div>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.cardFooter}>
              <span>Search · Display · PMax · Meta</span>
              <span className={styles.footerBadgeVermilion} data-numeric>
                -{cacValue}% CAC
              </span>
            </div>
          </div>

          {/* ── GRAPH 03: Conversion & Speed Lift (Animated Benchmark Bars + Shimmer) ── */}
          <div className={styles.bentoCard}>
            <div className={styles.cardTopCompact}>
              <span className={styles.cardTag}>
                <span className={styles.liveDotVermilion} />
                WhatsApp AI Bot &amp; Claude Cowork
              </span>
              <h3 className={styles.cardTitle}>Conversion &amp; Speed Lift</h3>
            </div>

            <div className={styles.benchmarksStage}>
              {/* Benchmark 1: Baseline CVR */}
              <div className={styles.benchRow}>
                <div className={styles.benchMeta}>
                  <span className={styles.benchLabelMuted}>Baseline Lead-to-Booking CVR</span>
                  <span className={styles.benchValMuted} data-numeric>
                    {cvrBaseVal}%
                  </span>
                </div>
                <div className={styles.benchTrack}>
                  <div
                    className={styles.benchFillMuted}
                    style={{ width: `${54 * bar1Prog}%` }}
                  />
                </div>
              </div>

              {/* Benchmark 2: WhatsApp AI Bot CVR */}
              <div className={styles.benchRow}>
                <div className={styles.benchMeta}>
                  <span className={styles.benchLabelBright}>
                    WhatsApp AI Bot + Automated Drip
                  </span>
                  <span className={styles.benchValAcid} data-numeric>
                    {cvrAfterVal}% CVR
                  </span>
                </div>
                <div className={styles.benchTrack}>
                  <div
                    className={styles.benchFillAcid}
                    style={{ width: `${100 * bar2Prog}%` }}
                  >
                    <span className={styles.barShimmer} />
                  </div>
                </div>
              </div>

              {/* Benchmark 3: No-Code AI Landers & UI Speed */}
              <div className={styles.benchRow}>
                <div className={styles.benchMeta}>
                  <span className={styles.benchLabelBright}>
                    No-Code AI Landers &amp; UI Speed
                  </span>
                  <span className={styles.benchValVermilion} data-numeric>
                    +{speedLiftVal}% Score
                  </span>
                </div>
                <div className={styles.benchTrack}>
                  <div
                    className={styles.benchFillVermilion}
                    style={{ width: `${86 * bar3Prog}%` }}
                  >
                    <span className={styles.barShimmer} />
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.cardFooter}>
              <span>Claude Cowork · Codex · Zoho CRM</span>
              <span className={styles.footerBadge}>+83% Rel. CVR Lift</span>
            </div>
          </div>

          {/* ── GRAPH 04: SERP & Audience Scale (Live Sparklines + Animated Counters) ── */}
          <div className={styles.bentoCard}>
            <div className={styles.cardTopCompact}>
              <span className={styles.cardTag}>
                <span className={styles.liveDotAcid} />
                BharatAgri &amp; Alchemy Techsol
              </span>
              <h3 className={styles.cardTitle}>SERP &amp; Audience Scale</h3>
            </div>

            <div className={styles.serpStage}>
              <div className={styles.serpComparisonGrid}>
                {/* Sub-card A: Daily Organic Visits + Live Sparkline */}
                <div className={styles.serpStatBox}>
                  <div className={styles.serpStatTop}>
                    <span className={styles.serpSmallLabel}>Daily Organic Visits</span>
                    <svg
                      width="56"
                      height="22"
                      viewBox="0 0 56 22"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M 2 19 C 16 18, 30 12, 54 3"
                        stroke="#D8FF3E"
                        strokeWidth="2"
                        strokeLinecap="round"
                        pathLength="100"
                        strokeDasharray="100"
                        strokeDashoffset={100 - visitsProg * 100}
                      />
                      {visitsProg > 0.8 && (
                        <circle cx="54" cy="3" r="2.5" fill="#D8FF3E" />
                      )}
                    </svg>
                  </div>
                  <div className={styles.serpBigFlow}>
                    <span className={styles.serpBefore}>47</span>
                    <span className={styles.serpArrow}>→</span>
                    <span className={styles.serpAfterAcid} data-numeric>
                      {dailyVisitsVal}
                    </span>
                  </div>
                  <span className={styles.serpNote}>10K → 54K Impressions (6M)</span>
                </div>

                {/* Sub-card B: Target Keyword Rank + Climb Vector */}
                <div className={styles.serpStatBox}>
                  <div className={styles.serpStatTop}>
                    <span className={styles.serpSmallLabel}>Target Keyword Rank</span>
                    <svg
                      width="56"
                      height="22"
                      viewBox="0 0 56 22"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M 2 18 L 18 15 L 36 8 L 54 4"
                        stroke="#E65D3F"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        pathLength="100"
                        strokeDasharray="100"
                        strokeDashoffset={100 - rankProg * 100}
                      />
                      {rankProg > 0.8 && (
                        <circle cx="54" cy="4" r="2.5" fill="#E65D3F" />
                      )}
                    </svg>
                  </div>
                  <div className={styles.serpBigFlow}>
                    <span className={styles.serpBefore}>#22</span>
                    <span className={styles.serpArrow}>→</span>
                    <span className={styles.serpAfterVermilion} data-numeric>
                      #{currentRankVal}
                    </span>
                  </div>
                  <span className={styles.serpNote}>Page-1 Google SERP Climb</span>
                </div>
              </div>

              {/* Animated Follower Trajectory Bar */}
              <div className={styles.socialGrowthBar}>
                <div className={styles.socialMeta}>
                  <span>Alchemy Techsol Organic Followers</span>
                  <span className={styles.acidMono} data-numeric>
                    24.0K → {followersK}K (+50%)
                  </span>
                </div>
                <div className={styles.benchTrack}>
                  <div
                    className={styles.benchFillAcid}
                    style={{ width: `${78 * followersProg}%` }}
                  >
                    <span className={styles.barShimmer} />
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.cardFooter}>
              <span>20+ SEO Blogs &amp; Whitepapers</span>
              <span className={styles.footerBadge}>+15% Brand Visibility</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
