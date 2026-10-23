"use client";

import React from "react";
import { capabilitiesData } from "@/lib/portfolio-data";
import { AppleReveal } from "@/lib/motion/useInViewMotion";
import styles from "./CapabilitiesSection.module.css";

export function CapabilitiesSection() {
  return (
    <section id="capabilities" className={styles.section} aria-labelledby="capabilities-title">
      <div className={styles.container}>
        <AppleReveal>
          <div className={styles.header}>
            <div>
              <div className={styles.eyebrow}>Core Disciplines</div>
              <h2 id="capabilities-title" className={styles.title}>
                Capabilities
              </h2>
            </div>
            <p className={styles.subtitle}>
              Four integrated domains grounded in 3+ years of hands-on execution across SEO &amp;
              AEO/GEO, ₹10–15L/mo paid acquisition, GTM/GA4/Zoho CRM tracking, and no-code AI
              automation.
            </p>
          </div>
        </AppleReveal>

        <div className={styles.grid}>
          {capabilitiesData.map((pillar, idx) => {
            const isParchment = idx === 1;
            const num = String(idx + 1).padStart(2, "0");

            return (
              <AppleReveal key={pillar.id} delayMs={idx * 80}>
                <div className={isParchment ? styles.cardParchment : styles.cardDark}>
                  <div>
                    <div className={styles.cardTop}>
                      <span className={isParchment ? styles.numInk : styles.numAcid}>
                        {num}
                      </span>
                      <span className={isParchment ? styles.tagInk : styles.tagDark}>
                        {idx === 0
                          ? "Organic Search & CMS"
                          : idx === 1
                          ? "Google & Meta Ads"
                          : idx === 2
                          ? "No-Code AI & Chatbots"
                          : "Analytics & CRM"}
                      </span>
                    </div>

                    <h3 className={isParchment ? styles.cardTitleInk : styles.cardTitle}>
                      {pillar.title}
                    </h3>
                    <p className={isParchment ? styles.cardDescInk : styles.cardDesc}>
                      {pillar.description}
                    </p>

                    <ul className={styles.deliverableList}>
                      {pillar.deliverables.map((item) => (
                        <li
                          key={item}
                          className={
                            isParchment ? styles.deliverableItemInk : styles.deliverableItem
                          }
                        >
                          <span
                            className={
                              isParchment ? styles.bulletInk : styles.bulletAcid
                            }
                            aria-hidden="true"
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className={isParchment ? styles.techRowInk : styles.techRow}>
                    {pillar.techTags.map((tag) => (
                      <span
                        key={tag}
                        className={isParchment ? styles.techPillInk : styles.techPill}
                      >
                        {tag}
                      </span>
                    ))}
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
