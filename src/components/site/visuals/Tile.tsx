import type { ReactNode } from "react";
import styles from "./Tile.module.css";

export function Tile({ caption, children }: { caption: string; children: ReactNode }) {
  return (
    <figure className={styles.tile}>
      <div className={styles.body}>{children}</div>
      <figcaption className={styles.caption}>{caption}</figcaption>
    </figure>
  );
}
