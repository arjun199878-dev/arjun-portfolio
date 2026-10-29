"use client";

import { CountUp } from "../motion/CountUp";
import { Tile } from "./Tile";
import styles from "./BigNumberVisual.module.css";

type BigNumberVisualProps = {
  caption: string;
  label: string;
  to: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
};

export function BigNumberVisual({ caption, label, to, decimals, prefix, suffix }: BigNumberVisualProps) {
  return (
    <Tile caption={caption}>
      <p className={styles.number}>
        <CountUp to={to} decimals={decimals} prefix={prefix} suffix={suffix} />
      </p>
      <p className={styles.label}>{label}</p>
    </Tile>
  );
}
