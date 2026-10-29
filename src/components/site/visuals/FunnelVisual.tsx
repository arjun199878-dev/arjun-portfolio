"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Reveal } from "../motion/Reveal";
import { DUR, EASE, STAGGER, stagger } from "../motion/tokens";
import { Tile } from "./Tile";
import styles from "./FunnelVisual.module.css";

type Props = {
  caption: string;
  steps: readonly string[];
  resultValue?: string;
  resultLabel?: string;
};

export function FunnelVisual({ caption, steps, resultValue, resultLabel }: Props) {
  const reduced = useReducedMotion();
  const last = steps.length - 1;

  return (
    <Tile caption={caption}>
      <ol className={styles.row}>
        {steps.map((step, i) => (
          <li key={step} className={styles.item}>
            {i > 0 ? (
              reduced ? (
                <span className={styles.connector} aria-hidden="true" />
              ) : (
                <motion.span
                  className={styles.connector}
                  aria-hidden="true"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: DUR.connector, ease: EASE, delay: Math.max(0, stagger(i, STAGGER.step) - 0.1) }}
                />
              )
            ) : null}
            <Reveal delay={stagger(i, STAGGER.step)} className={`${styles.pill} ${i === last ? styles.last : ""}`}>
              {step}
            </Reveal>
          </li>
        ))}
      </ol>
      {resultValue && resultLabel ? (
        <div className={styles.result}>
          <p className={`${styles.resultValue} site-numeric`}>{resultValue}</p>
          <p className={styles.resultLabel}>{resultLabel}</p>
        </div>
      ) : null}
    </Tile>
  );
}
