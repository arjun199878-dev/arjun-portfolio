"use client";

import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useEffect, useRef } from "react";
import type { Stat } from "@/lib/content";
import { formatValue } from "@/lib/format";
import { CountUp } from "../motion/CountUp";
import { Reveal } from "../motion/Reveal";
import { DIST, NUMBERS, SCALE } from "../motion/tokens";
import styles from "./NumbersChapter.module.css";

type NumbersChapterProps = {
  stats: readonly Stat[];
  heading: string;
};

function fmt(stat: Stat, v: number) {
  return formatValue(v, { decimals: stat.decimals, prefix: stat.prefix, suffix: stat.suffix });
}

const { enterEnd, countEnd, holdEnd } = NUMBERS.phases;

/** Text for a stat's number at overall scroll progress `v`. Lands on `to` exactly. */
function textAt(stat: Stat, index: number, total: number, v: number) {
  const p = (v * total) - index;
  const from = stat.from ?? 0;
  if (p <= enterEnd) return fmt(stat, from);
  if (p >= countEnd) return fmt(stat, stat.to);
  const t = Math.min(1, Math.max(0, (p - enterEnd) / (countEnd - enterEnd)));
  const eased = 1 - (1 - t) ** 3;
  return fmt(stat, from + (stat.to - from) * eased);
}

function PinnedStat({
  stat,
  index,
  total,
  progress,
  numberRef,
}: {
  stat: Stat;
  index: number;
  total: number;
  progress: MotionValue<number>;
  numberRef: (el: HTMLSpanElement | null) => void;
}) {
  const q = 1 / total;
  const start = index * q;
  const isLast = index === total - 1;

  const opacity = useTransform(
    progress,
    isLast ? [start, start + enterEnd * q, 1] : [start, start + enterEnd * q, start + holdEnd * q, start + q],
    isLast ? [0, 1, 1] : [0, 1, 1, 0],
  );
  const y = useTransform(
    progress,
    isLast ? [start, start + enterEnd * q] : [start, start + enterEnd * q, start + holdEnd * q, start + q],
    isLast ? [DIST.numberIn, 0] : [DIST.numberIn, 0, 0, -DIST.numberIn],
  );
  const scale = useTransform(progress, [start, start + enterEnd * q], [SCALE.numberIn, 1]);

  return (
    <motion.div className={styles.stat} style={{ opacity, y, scale }} initial={false}>
      <p className={styles.label}>{stat.label}</p>
      <p className={styles.numberRow}>
        {stat.from !== undefined ? (
          <span className={`${styles.from} site-numeric`}>{fmt(stat, stat.from)} → </span>
        ) : null}
        <span ref={numberRef} className={`${styles.number} site-numeric`} suppressHydrationWarning>
          {fmt(stat, stat.to)}
        </span>
      </p>
      <p className={styles.context}>{stat.context}</p>
    </motion.div>
  );
}

export function NumbersChapter({ stats, heading }: NumbersChapterProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const numberEls = useRef<(HTMLSpanElement | null)[]>([]);
  const dotEls = useRef<(HTMLSpanElement | null)[]>([]);
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start start", "end end"] });
  const total = stats.length;

  // One update for all numbers and dots: no React state per frame.
  const update = (v: number) => {
    stats.forEach((stat, i) => {
      const el = numberEls.current[i];
      if (el) el.textContent = textAt(stat, i, total, v);
    });
    const active = Math.min(total - 1, Math.max(0, Math.floor(v * total)));
    dotEls.current.forEach((dot, i) => {
      if (dot) dot.dataset.active = String(i === active);
    });
  };
  useMotionValueEvent(scrollYProgress, "change", update);
  // `change` only fires on movement, so sync once on mount (reloads and anchor jumps).
  useEffect(() => {
    // After a reload the browser restores the scroll position, but scroll tracking only
    // measures on a scroll event. Nudge it once so progress, opacity and numbers all catch up.
    const frame = requestAnimationFrame(() => {
      window.dispatchEvent(new Event("scroll"));
      update(scrollYProgress.get());
    });
    update(scrollYProgress.get());
    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section id="results" className={styles.section} aria-labelledby="results-title">
      <h2 id="results-title" className="site-visually-hidden">
        {heading}
      </h2>

      <div className={styles.pinned}>
        <ul className="site-visually-hidden">
          {stats.map((s) => (
            <li key={s.key}>
              {s.display} — {s.label}. {s.context}
            </li>
          ))}
        </ul>
        <div ref={trackRef} className={styles.track} style={{ "--track": NUMBERS.trackScreens } as React.CSSProperties} aria-hidden="true">
          <div className={styles.stage}>
            {stats.map((stat, i) => (
              <PinnedStat
                key={stat.key}
                stat={stat}
                index={i}
                total={total}
                progress={scrollYProgress}
                numberRef={(el) => {
                  numberEls.current[i] = el;
                }}
              />
            ))}
            <div className={styles.dots}>
              {stats.map((s, i) => (
                <span
                  key={s.key}
                  className={styles.dot}
                  data-active={i === 0 ? "true" : "false"}
                  ref={(el) => {
                    dotEls.current[i] = el;
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className={`${styles.stacked} site-container`}>
        {stats.map((stat) => (
          <Reveal key={stat.key} className={styles.block}>
            <p className={styles.label}>{stat.label}</p>
            <p className={styles.numberRow}>
              {stat.from !== undefined ? (
                <span className={`${styles.from} site-numeric`}>{fmt(stat, stat.from)} → </span>
              ) : null}
              <CountUp
                from={stat.from}
                to={stat.to}
                decimals={stat.decimals}
                prefix={stat.prefix}
                suffix={stat.suffix}
                className={styles.stackedNumber}
              />
            </p>
            <p className={styles.context}>{stat.context}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
