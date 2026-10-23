"use client";

import React from "react";
import { operatingPrinciples } from "@/lib/portfolio-data";
import { AppleReveal } from "@/lib/motion/useInViewMotion";
import styles from "./HowIThinkSection.module.css";

export function HowIThinkSection() {
  return (
    <section id="process" className={styles.section} aria-labelledby="process-title">
      <div className={styles.container}>
        <AppleReveal>
          <div className={styles.header}>
            <div>
              <div className={styles.eyebrow}>Operating Framework</div>
              <h2 id="process-title" className={styles.title}>
                How I Work
              </h2>
            </div>
            <p className={styles.subtitle}>
              A five-step approach converting business bottlenecks into compounding search
              authority, profitable paid acquisition, and automated CRM workflows.
            </p>
          </div>
        </AppleReveal>

        <div className={styles.pathwayGrid}>
          {operatingPrinciples.map((step, idx) => {
            const isHighlighted = idx === 2;
            const isVermilion = idx === 3;
            return (
              <AppleReveal key={step.number} delayMs={idx * 70}>
                <div
                  className={
                    isHighlighted
                      ? styles.stepCardHighlight
                      : isVermilion
                      ? styles.stepCardVermilion
                      : styles.stepCard
                  }
                >
                  <span
                    className={
                      isHighlighted
                        ? styles.numHighlight
                        : isVermilion
                        ? styles.numVermilion
                        : styles.numDefault
                    }
                  >
                    {step.number}
                  </span>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p className={styles.stepDesc}>{step.description}</p>
                  <div
                    className={
                      isVermilion ? styles.stepFocusVermilion : styles.stepFocusAcid
                    }
                  >
                    {step.focus}
                  </div>
                </div>
              </AppleReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
