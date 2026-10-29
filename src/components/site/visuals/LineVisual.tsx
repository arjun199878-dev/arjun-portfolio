"use client";

import { motion, useReducedMotion } from "framer-motion";
import { DUR, EASE } from "../motion/tokens";
import { Tile } from "./Tile";
import styles from "./LineVisual.module.css";

type Props = {
  caption: string;
  series: readonly { label: string; value: number }[];
};

const W = 600;
const H = 300;
const PAD = { l: 16, r: 24, t: 24, b: 36 };

export function LineVisual({ caption, series }: Props) {
  const reduced = useReducedMotion();
  const values = series.map((p) => p.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const lo = min - span * 0.1;
  const hi = max + span * 0.1;
  const x = (i: number) => PAD.l + (series.length === 1 ? 0 : (i / (series.length - 1)) * (W - PAD.l - PAD.r));
  const y = (v: number) => PAD.t + (1 - (v - lo) / (hi - lo)) * (H - PAD.t - PAD.b);
  const d = series.map((p, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(p.value).toFixed(1)}`).join(" ");

  const maxLabels = 6;
  const step = Math.max(1, Math.ceil((series.length - 1) / (maxLabels - 1)));
  const labelIdx = series.map((_, i) => i).filter((i) => i % step === 0 || i === series.length - 1);
  const lastIdx = series.length - 1;
  const gridYs = [0, 1, 2, 3].map((g) => PAD.t + (g / 3) * (H - PAD.t - PAD.b));

  const lastPoint = (
    <>
          <circle cx={x(lastIdx)} cy={y(values[lastIdx])} r={5} className={styles.dot} />
          <text x={x(lastIdx)} y={y(values[lastIdx]) - 12} textAnchor="end" className={styles.valueLabel}>
            {values[lastIdx].toLocaleString("en-IN")}
          </text>
    </>
  );

  return (
    <Tile caption={caption}>
      <svg viewBox={`0 0 ${W} ${H}`} className={styles.svg} role="img" aria-label={caption}>
        {gridYs.map((gy) => (
          <line key={gy} x1={PAD.l} x2={W - PAD.r} y1={gy} y2={gy} className={styles.grid} />
        ))}
        {reduced ? (
          <path d={d} className={styles.line} />
        ) : (
          <motion.path
            d={d}
            className={styles.line}
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: DUR.draw, ease: EASE }}
          />
        )}
        {reduced ? (
          <g>{lastPoint}</g>
        ) : (
          <motion.g
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: DUR.fadeLate, ease: EASE, delay: DUR.draw }}
          >
            {lastPoint}
          </motion.g>
        )}
        {labelIdx.map((i) => (
          <text key={i} x={x(i)} y={H - 10} textAnchor={i === 0 ? "start" : i === lastIdx ? "end" : "middle"} className={styles.axis}>
            {series[i].label}
          </text>
        ))}
      </svg>
      <table className="site-visually-hidden">
        <caption>{caption}</caption>
        <tbody>
          {series.map((p) => (
            <tr key={p.label}>
              <th scope="row">{p.label}</th>
              <td>{p.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Tile>
  );
}
