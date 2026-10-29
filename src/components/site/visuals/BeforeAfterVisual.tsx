"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CountUp } from "../motion/CountUp";
import { DUR, EASE } from "../motion/tokens";
import { Tile } from "./Tile";
import styles from "./BeforeAfterVisual.module.css";

type Props = {
  caption: string;
  before: number;
  after: number;
  unit: string;
  beforeLabel: string;
  afterLabel: string;
};

export function BeforeAfterVisual({ caption, before, after, unit, beforeLabel, afterLabel }: Props) {
  const reduced = useReducedMotion();
  const ratio = before / after;
  const beforeHeight = `${Math.max(4, ratio * 100)}%`;

  return (
    <Tile caption={caption}>
      <div
        className={styles.group}
        role="img"
        aria-label={`${caption} rose from ${before} to ${after}`}
      >
        <div className={styles.col}>
          <div className={styles.barArea}>
            <div className={styles.before} style={{ height: beforeHeight }} />
          </div>
          <p className={styles.label}>{beforeLabel}</p>
          <p className={`${styles.value} site-numeric`}>{before}</p>
        </div>
        <div className={styles.col}>
          <p className={styles.afterValue}>
            <CountUp from={before} to={after} />
          </p>
          <div className={styles.barArea}>
            {reduced ? (
              <div className={styles.after} />
            ) : (
              <motion.div
                className={styles.after}
                initial={{ scaleY: ratio }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: DUR.grow, ease: EASE }}
              />
            )}
          </div>
          <p className={styles.label}>{afterLabel}</p>
        </div>
      </div>
      <p className={styles.unit}>{unit}</p>
    </Tile>
  );
}
