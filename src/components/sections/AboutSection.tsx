import React from "react";
import { educationData } from "@/lib/portfolio-data";
import styles from "./AboutSection.module.css";

const SKILL_GROUPS = [
  {
    label: "SEO, AEO & Content",
    items:
      "On-Page & Off-Page SEO, Technical SEO, AEO & GEO Ranking, Keyword Research, Content Planning, Ahrefs, SEMrush, Ubersuggest, Google Search Console, GTmetrix",
  },
  {
    label: "Paid Media & Ads",
    items:
      "Google Ads (Search, Display, PMax), Meta Ads, GoMarble AI (Ad Performance Analysis), Budget Management (₹10–15L/mo), ROAS & CAC Optimization",
  },
  {
    label: "Tag Management & CRM",
    items:
      "Google Tag Manager (Google Tags, Triggers & Conversion Tracking), Google Analytics 4 (GA4), Zoho CRM, Zoho PageSense, Zoho Forms, Marketing Data Preparation",
  },
  {
    label: "No-Code AI & Automation",
    items:
      "AI-Generated Marketing Dashboards, No-Code AI Landing Pages & Interactive Calculators (via Claude Cowork & Codex), WhatsApp Chatbot & AI Bot Setup, WhatsApp Drip Sequences",
  },
  {
    label: "CMS, Web & Design",
    items:
      "WordPress, Sanity CMS, Shopify, Website UI/UX Improvements (+47% Page Speed), Mail Migrations, Google Workspace, Microsoft Office, Figma, Canva",
  },
] as const;

export function AboutSection() {
  return (
    <section id="about" className={styles.section} aria-labelledby="about-title">
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Left Column (5 Cols): Perspective & Education */}
          <div className={styles.leftCol}>
            <div className={styles.eyebrow}>Background &amp; Credentials</div>
            <h2 id="about-title" className={styles.title}>
              Connecting systems, marketing &amp; growth.
            </h2>

            {/* Warm Parchment Perspective Card */}
            <div className={styles.parchmentCard}>
              <div className={styles.parchmentName}>Arjun T.R — Bengaluru</div>
              <p className={styles.parchmentQuote}>
                &ldquo;I work where digital systems meet business unit economics. Traffic without
                conversion is waste, and operations without automation cannot scale.&rdquo;
              </p>
              <div className={styles.parchmentFooter}>
                <span>M.Com + Digital Marketing</span>
                <span className={styles.vermilionText}>3+ Years Execution</span>
              </div>
            </div>

            {/* Education & Certifications */}
            <div className={styles.educationBox}>
              <div className={styles.eduHeader}>
                <span>Education &amp; Certifications</span>
                <span className={styles.acidText}>Bengaluru, IN</span>
              </div>
              <div className={styles.eduList}>
                {educationData.map((edu) => (
                  <div key={edu.degree} className={styles.eduItem}>
                    <div className={styles.eduTop}>
                      <span className={styles.eduDegree}>{edu.degree}</span>
                      <span className={styles.eduPeriod}>{edu.period}</span>
                    </div>
                    <span className={styles.eduInst}>{edu.institution}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column (7 Cols): Narrative & Full Skill Matrix */}
          <div className={styles.rightCol}>
            <div className={styles.narrativeProse}>
              <p>
                I am a <strong>Digital Marketing &amp; Growth Specialist</strong> based in{" "}
                <strong>Bengaluru, Karnataka</strong> with <strong>3+ years</strong> of hands-on
                experience across SEO, AEO/GEO, paid acquisition, analytics instrumentation, and
                marketing automation.
              </p>
              <p>
                At <strong>Clean Fanatics</strong>, I grew organic search impressions by{" "}
                <strong>482%</strong> and clicks by <strong>167%</strong> over 12 months, managed{" "}
                <strong>₹10–15 Lakhs in monthly ad spend</strong> across Google and Meta Ads at a{" "}
                <strong>~3x ROAS</strong> (cutting CAC by <strong>28%</strong> with GoMarble AI),
                and increased lead-to-booking conversion from <strong>6% to 11%</strong> by setting
                up and migrating a WhatsApp AI chatbot and automated drip sequences.
              </p>
              <p>
                Rather than waiting on developer queues, I use{" "}
                <strong>no-code AI tools (Claude Cowork, Codex, GoMarble AI)</strong> to build
                automated marketing dashboards, landing pages, and interactive service calculators,
                while wiring end-to-end conversion tracking across{" "}
                <strong>Google Tag Manager (GTM), GA4, Zoho PageSense, and Zoho CRM</strong>.
              </p>
            </div>

            {/* Full Resume Skills & Tooling Matrix */}
            <div className={styles.skillsMatrix}>
              <div className={styles.eduHeader}>
                <span>Technical &amp; Marketing Toolkit</span>
                <span className={styles.acidText}>5 Core Domains</span>
              </div>
              <div className={styles.skillRows}>
                {SKILL_GROUPS.map((group) => (
                  <div key={group.label} className={styles.skillRow}>
                    <span className={styles.skillLabel}>{group.label}</span>
                    <span className={styles.skillItems}>{group.items}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
