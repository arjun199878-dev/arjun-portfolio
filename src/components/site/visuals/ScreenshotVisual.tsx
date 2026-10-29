"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { DUR, EASE, SCALE } from "../motion/tokens";
import { Tile } from "./Tile";
import styles from "./ScreenshotVisual.module.css";

type Props = {
  caption: string;
  image: { url: string; alt: string; width: number; height: number };
};

export function ScreenshotVisual({ caption, image }: Props) {
  const reduced = useReducedMotion();
  const frame = (
    <div className={styles.frame}>
      <div className={styles.bar} aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <Image
        src={image.url}
        alt={image.alt}
        width={image.width}
        height={image.height}
        sizes="(min-width: 960px) 58vw, 100vw"
        className={styles.image}
      />
    </div>
  );

  return (
    <Tile caption={caption}>
      {reduced ? (
        frame
      ) : (
        <motion.div
          className={styles.wrap}
          initial={{ opacity: 0, scale: SCALE.image }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: DUR.image, ease: EASE }}
        >
          {frame}
        </motion.div>
      )}
    </Tile>
  );
}
