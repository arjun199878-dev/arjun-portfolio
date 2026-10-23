"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAnimatedNumber, useInView } from "@/lib/motion/useInViewMotion";
import styles from "./HeroSection.module.css";

const TYPED_PHRASES = [
  "forward.",
  "into profit.",
  "at scale.",
  "with AI speed.",
  "measurably.",
] as const;

export function HeroSection() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charCount, setCharCount] = useState(TYPED_PHRASES[0].length);
  const [isDeleting, setIsDeleting] = useState(false);

  const { ref: metricsRef, inView: metricsInView } = useInView<HTMLDivElement>({
    threshold: 0.15,
  });

  const imprVal = useAnimatedNumber(482, metricsInView, 1400, 0);
  const roasVal = useAnimatedNumber(3.0, metricsInView, 1300, 1);
  const cvrVal = useAnimatedNumber(11, metricsInView, 1300, 0);
  const speedVal = useAnimatedNumber(47, metricsInView, 1300, 0);

  useEffect(() => {
    const currentPhrase = TYPED_PHRASES[phraseIndex];

    let timeoutMs = isDeleting ? 42 : 75;

    if (!isDeleting && charCount === currentPhrase.length) {
      timeoutMs = 2400;
    } else if (isDeleting && charCount === 0) {
      timeoutMs = 220;
    }

    const timer = window.setTimeout(() => {
      if (!isDeleting && charCount === currentPhrase.length) {
        setIsDeleting(true);
      } else if (isDeleting && charCount === 0) {
        setIsDeleting(false);
        setPhraseIndex((prev) => (prev + 1) % TYPED_PHRASES.length);
      } else {
        setCharCount((prev) => prev + (isDeleting ? -1 : 1));
      }
    }, timeoutMs);

    return () => window.clearTimeout(timer);
  }, [charCount, isDeleting, phraseIndex]);

  const displayedWord = TYPED_PHRASES[phraseIndex].slice(0, charCount);

  return (
    <section id="hero" className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.container}>
        {/* Minimalist Eyebrow */}
        <div className={styles.topMeta}>
          <div className={styles.statusBadge}>
            <span className={styles.statusDot} />
            <span>ARJUN T.R — BENGALURU, INDIA</span>
          </div>
          <span className={styles.roleTag}>
            Digital Marketing &amp; Growth Technologist · 3+ Years Experience
          </span>
        </div>

        {/* Pure Editorial Typography + Kinetic Typing Motion */}
        <div className={styles.editorialBlock}>
          <h1 id="hero-title" className={styles.headline}>
            I build systems that move businesses{" "}
            <span className={styles.typedWrapper}>
              <span className={styles.typedWord}>{displayedWord}</span>
              <span className={styles.cursor} aria-hidden="true" />
            </span>
          </h1>

          <p className={styles.leadCopy}>
            From search architecture and high-ROAS paid acquisition to GTM/CRM tracking and
            no-code AI automation—I turn complex growth bottlenecks into clean, measurable
            systems without developer dependency.
          </p>

          {/* Clean Action Row */}
          <div className={styles.ctaRow}>
            <Link href="#work" className={styles.primaryCta}>
              <span>View Selected Work</span>
              <span aria-hidden="true">→</span>
            </Link>
            <Link href="#performance" className={styles.secondaryCta}>
              <span>Performance Graphs</span>
            </Link>
            <Link href="#experience" className={styles.secondaryCta}>
              <span>Career Timeline</span>
            </Link>
          </div>
        </div>

        {/* Minimalist 4-Column Verified Impact Bar with Count-Up & Micro-Sparklines */}
        <div
          ref={metricsRef}
          className={styles.metricsBar}
          aria-label="Verified career outcomes"
        >
          {/* Pillar 1: +482% Impressions */}
          <div className={styles.metricCell}>
            <div className={styles.metricTopLine}>
              <div className={styles.metricValueAcid} data-numeric>
                +{imprVal}%
              </div>
              <svg
                className={styles.sparklineSvg}
                viewBox="0 0 64 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M 2 21 C 18 20, 34 13, 62 3"
                  stroke="#D8FF3E"
                  strokeWidth="2"
                  strokeLinecap="round"
                  pathLength="1"
                  className={metricsInView ? styles.sparkDrawn : styles.sparkHidden}
                />
              </svg>
            </div>
            <div className={styles.metricLabel}>Organic Search Impressions</div>
            <div className={styles.metricSub}>
              +167% clicks in 12 months · SEO &amp; AEO/GEO
            </div>
          </div>

          {/* Pillar 2: ~3.0x ROAS */}
          <div className={styles.metricCell}>
            <div className={styles.metricTopLine}>
              <div className={styles.metricValueParchment} data-numeric>
                ~{roasVal}×
              </div>
              <svg
                className={styles.sparklineSvg}
                viewBox="0 0 64 24"
                fill="none"
                aria-hidden="true"
              >
                <rect x="6" y="14" width="8" height="8" rx="1.5" fill="#2E3426" />
                <rect x="20" y="10" width="8" height="12" rx="1.5" fill="#2E3426" />
                <rect x="34" y="6" width="8" height="16" rx="1.5" fill="#C8BFAD" />
                <rect x="48" y="2" width="8" height="20" rx="1.5" fill="#D8FF3E" />
              </svg>
            </div>
            <div className={styles.metricLabel}>ROAS on ₹10–15L/Mo Ads</div>
            <div className={styles.metricSub}>
              -28% CAC via Google, Meta &amp; GoMarble AI
            </div>
          </div>

          {/* Pillar 3: 6% -> 11% CVR */}
          <div className={styles.metricCell}>
            <div className={styles.metricTopLine}>
              <div className={styles.metricValueVermilion} data-numeric>
                6% → {cvrVal}%
              </div>
              <svg
                className={styles.sparklineSvg}
                viewBox="0 0 64 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M 2 18 L 26 18 L 38 6 L 62 6"
                  stroke="#E65D3F"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  pathLength="1"
                  className={metricsInView ? styles.sparkDrawn : styles.sparkHidden}
                />
              </svg>
            </div>
            <div className={styles.metricLabel}>Lead-to-Booking Conversion</div>
            <div className={styles.metricSub}>
              WhatsApp AI Chatbot &amp; automated drip flows
            </div>
          </div>

          {/* Pillar 4: +47% Speed */}
          <div className={styles.metricCell}>
            <div className={styles.metricTopLine}>
              <div className={styles.metricValueAcid} data-numeric>
                +{speedVal}%
              </div>
              <svg
                className={styles.sparklineSvg}
                viewBox="0 0 64 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M 2 20 Q 32 18, 62 4"
                  stroke="#D8FF3E"
                  strokeWidth="2"
                  strokeLinecap="round"
                  pathLength="1"
                  className={metricsInView ? styles.sparkDrawn : styles.sparkHidden}
                />
              </svg>
            </div>
            <div className={styles.metricLabel}>Page Performance Score</div>
            <div className={styles.metricSub}>
              No-code AI dashboards, landers &amp; calculators
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
