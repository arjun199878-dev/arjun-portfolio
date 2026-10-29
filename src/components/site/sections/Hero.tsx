"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Fragment, useLayoutEffect, useRef, useState } from "react";
import type { SectionKey } from "@/lib/content";
import { Button } from "../ui/Button";
import { DIST, DUR, EASE, HERO, STAGGER } from "../motion/tokens";
import styles from "./Hero.module.css";

type HeroProps = {
  name: string;
  location: string;
  headline: string;
  intro: string;
  labels: { heroPrimaryCta: string; heroSecondaryCta: string };
  visibleSections: readonly SectionKey[];
};

export function Hero({ name, location, headline, intro, labels, visibleSections }: HeroProps) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0, HERO.scrollOutEnd], [1, HERO.scaleTo]);
  const opacity = useTransform(scrollYProgress, [0, HERO.scrollOutEnd], [1, 0]);
  const words = headline.split(" ");
  const lastWordDelay = HERO.introDelay + (words.length - 1) * STAGGER.word;
  const tailDelay = lastWordDelay + HERO.tailGap;

  // Loaded already scrolled (reload halfway down): skip the intro and show the final state.
  const [skipIntro, setSkipIntro] = useState(false);
  useLayoutEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- must read scroll position after mount
    if (window.scrollY > 0) setSkipIntro(true);
  }, []);
  const noIntro = reduced || skipIntro;

  const showResults = visibleSections.includes("results");
  const showContact = visibleSections.includes("contact");

  return (
    <section ref={ref} className={styles.hero} aria-labelledby="hero-title">
      {/* Outer wrapper owns the scroll-out; inner elements own the intro, so they never fight. */}
      <motion.div className={styles.scrollOut} style={reduced ? undefined : { scale, opacity }}>
      <div key={noIntro ? "static" : "intro"} className={styles.content}>
        <motion.p
          className={styles.eyebrow}
          initial={noIntro ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: DUR.reveal, ease: EASE }}
        >
          {name} · {location}
        </motion.p>
        <h1 id="hero-title" className={styles.title}>
          {noIntro
            ? headline
            : words.map((word, i) => (
                <Fragment key={i}>
                  <motion.span
                    className={styles.word}
                    initial={{ opacity: 0, y: DIST.word }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: DUR.reveal, ease: EASE, delay: HERO.introDelay + i * STAGGER.word }}
                  >
                    {word}
                  </motion.span>
                  {i < words.length - 1 ? " " : ""}
                </Fragment>
              ))}
        </h1>
        <motion.div
          initial={noIntro ? false : { opacity: 0, y: DIST.word }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DUR.reveal, ease: EASE, delay: tailDelay }}
        >
          <p className={styles.intro}>{intro}</p>
          <div className={styles.actions}>
            {showResults ? (
              <Button href="#results" variant="primary">
                {labels.heroPrimaryCta}
              </Button>
            ) : null}
            {showContact ? (
              <Button href="#contact" variant="link">
                {labels.heroSecondaryCta}
              </Button>
            ) : null}
          </div>
        </motion.div>
      </div>
      </motion.div>
    </section>
  );
}
