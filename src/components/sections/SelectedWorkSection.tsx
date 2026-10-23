"use client";

import React from "react";
import { projectCaseStudies, workExperienceData } from "@/lib/portfolio-data";
import { AppleReveal } from "@/lib/motion/useInViewMotion";
import styles from "./SelectedWorkSection.module.css";

function CaseVisualStrip({ slug }: { slug: string }) {
  if (slug === "cleanfanatics") {
    return (
      <div className={styles.visualStrip}>
        <div className={styles.stripHeader}>
          <span>Full-Funnel Growth Architecture</span>
          <span className={styles.stripAccentAcid}>+482% Impr · ~3x ROAS · 11% CVR</span>
        </div>
        <div className={styles.flowTrack}>
          <div className={styles.flowNode}>
            <span className={styles.flowStep}>01</span>
            <span className={styles.flowLabel}>SEO / AEO + ₹10–15L Ads</span>
          </div>
          <div className={styles.flowConnector}>
            <span className={styles.flowPulse} />
          </div>
          <div className={styles.flowNode}>
            <span className={styles.flowStep}>02</span>
            <span className={styles.flowLabel}>AI Calculators &amp; GTM</span>
          </div>
          <div className={styles.flowConnector}>
            <span className={styles.flowPulse} style={{ animationDelay: "0.7s" }} />
          </div>
          <div className={styles.flowNodeAcid}>
            <span className={styles.flowStepAcid}>03</span>
            <span className={styles.flowLabel}>WhatsApp Bot &amp; Zoho CRM</span>
          </div>
        </div>
      </div>
    );
  }

  if (slug === "marketing-intelligence-dashboard") {
    return (
      <div className={styles.visualStrip}>
        <div className={styles.stripHeader}>
          <span>Autonomous No-Code AI Velocity</span>
          <span className={styles.stripAccentAcid}>+47% Page Speed · -28% CAC</span>
        </div>
        <div className={styles.miniMeterList}>
          <div className={styles.miniMeterRow}>
            <span>Page Performance Score (Claude Cowork &amp; Codex)</span>
            <div className={styles.miniMeterBar}>
              <div className={styles.miniMeterFillAcid} style={{ width: "92%" }} />
            </div>
          </div>
          <div className={styles.miniMeterRow}>
            <span>Ad Spend Efficiency (GoMarble AI Diagnostics)</span>
            <div className={styles.miniMeterBar}>
              <div className={styles.miniMeterFillVermilion} style={{ width: "78%" }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (slug === "ai-workflow-automation") {
    return (
      <div className={styles.visualStrip}>
        <div className={styles.stripHeader}>
          <span>24/7 Conversational Triage</span>
          <span className={styles.stripAccentVermilion}>6.0% → 11.0% Booking CVR</span>
        </div>
        <div className={styles.miniMeterList}>
          <div className={styles.miniMeterRow}>
            <span>Before WhatsApp AI Bot</span>
            <div className={styles.miniMeterBar}>
              <div className={styles.miniMeterFillMuted} style={{ width: "54%" }} />
            </div>
          </div>
          <div className={styles.miniMeterRow}>
            <span>After WhatsApp AI Bot + Drip Sequences</span>
            <div className={styles.miniMeterBar}>
              <div className={styles.miniMeterFillAcid} style={{ width: "100%" }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (slug === "seo-content-strategy") {
    return (
      <div className={styles.visualStrip}>
        <div className={styles.stripHeader}>
          <span>Multi-Brand Organic Compounding</span>
          <span className={styles.stripAccentAcid}>SERP #22 → #9 · +482% Impr.</span>
        </div>
        <svg
          className={styles.miniCurveSvg}
          viewBox="0 0 420 52"
          fill="none"
          aria-hidden="true"
        >
          <line x1="0" y1="44" x2="420" y2="44" stroke="#2E3426" />
          <path
            d="M 8 40 C 110 38, 220 26, 410 8"
            stroke="#D8FF3E"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle cx="145" cy="33" r="3.5" fill="#C8BFAD" />
          <circle cx="285" cy="19" r="3.5" fill="#E65D3F" />
          <circle cx="410" cy="8" r="4.5" fill="#D8FF3E" />
        </svg>
      </div>
    );
  }

  return (
    <div className={styles.visualStrip}>
      <div className={styles.stripHeader}>
        <span>Product UX &amp; Operational Systems</span>
        <span className={styles.stripAccentAcid}>Booking Engine · Partner App · Loyalty</span>
      </div>
      <div className={styles.miniMeterList}>
        <div className={styles.miniMeterRow}>
          <span>Booking Checkout &amp; Partner Handoff Speed</span>
          <div className={styles.miniMeterBar}>
            <div className={styles.miniMeterFillAcid} style={{ width: "88%" }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function SelectedWorkSection() {
  return (
    <>
      {/* ── SECTION 01: SELECTED CASE STUDIES ── */}
      <section id="work" className={styles.section} aria-labelledby="work-title">
        <div className={styles.container}>
          <AppleReveal>
            <div className={styles.header}>
              <div>
                <div className={styles.eyebrow}>Selected Work</div>
                <h2 id="work-title" className={styles.title}>
                  Systems &amp; Case Studies
                </h2>
              </div>
              <p className={styles.headerNote}>
                Production growth architectures across SEO/AEO, ₹10–15L/mo paid acquisition,
                no-code AI dashboards, and automated WhatsApp/CRM conversion flows.
              </p>
            </div>
          </AppleReveal>

          <div className={styles.caseGrid}>
            {projectCaseStudies.map((project, idx) => {
              const isFeatured = idx === 0;
              return (
                <AppleReveal
                  key={project.id}
                  delayMs={idx * 70}
                  className={isFeatured ? styles.caseCardFeaturedWrap : ""}
                >
                  <article
                    id={`project-${project.slug}`}
                    className={styles.caseCard}
                  >
                    {/* Card Top Meta */}
                    <div className={styles.cardTop}>
                      <span className={styles.cardCategory}>
                        0{idx + 1} · {project.category}
                      </span>
                      <span
                        className={
                          project.implementationStatus === "deployed"
                            ? styles.badgeDeployed
                            : styles.badgePrototype
                        }
                      >
                        {project.implementationStatus === "deployed"
                          ? "Live Production"
                          : "Operational Lab"}
                      </span>
                    </div>

                    {/* Title & Summary */}
                    <h3 className={styles.cardTitle}>{project.title}</h3>
                    <p className={styles.cardSummary}>{project.summary}</p>

                    {/* Clean Apple-Style Visual Strip */}
                    <CaseVisualStrip slug={project.slug} />

                    {/* 3-Column Metrics Strip */}
                    <div className={styles.metricsStrip}>
                      {project.metrics.map((metric) => (
                        <div key={metric.id} className={styles.metricBox}>
                          <div className={styles.metricTopRow}>
                            <span className={styles.metricVal} data-numeric>
                              {metric.value}
                            </span>
                            {metric.delta && (
                              <span className={styles.metricDelta}>{metric.delta}</span>
                            )}
                          </div>
                          <span className={styles.metricLbl}>{metric.label}</span>
                        </div>
                      ))}
                    </div>

                    {/* Clean Problem → System → Outcome Breakdown */}
                    <div className={styles.narrativeList}>
                      <div className={styles.narrativeRow}>
                        <span className={styles.narrativeKey}>Challenge</span>
                        <p className={styles.narrativeText}>{project.narrative.problem}</p>
                      </div>
                      <div className={styles.narrativeRow}>
                        <span className={styles.narrativeKey}>Execution</span>
                        <p className={styles.narrativeText}>
                          {project.narrative.implementation}
                        </p>
                      </div>
                      <div className={styles.narrativeRow}>
                        <span className={styles.narrativeKeyAcid}>Outcome</span>
                        <p className={styles.narrativeTextBright}>
                          {project.narrative.evidence}
                        </p>
                      </div>
                    </div>

                    {/* Tooling Pills */}
                    <div className={styles.techRow}>
                      {project.technologies.map((tech) => (
                        <span key={tech.name} className={styles.techPill}>
                          {tech.name}
                        </span>
                      ))}
                    </div>
                  </article>
                </AppleReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── SECTION 02: CHRONOLOGICAL CAREER EXPERIENCE ── */}
      <section
        id="experience"
        className={styles.experienceSection}
        aria-labelledby="experience-title"
      >
        <div className={styles.container}>
          <AppleReveal>
            <div className={styles.header}>
              <div>
                <div className={styles.eyebrow}>Career History · 3+ Years</div>
                <h2 id="experience-title" className={styles.title}>
                  Work Experience
                </h2>
              </div>
              <p className={styles.headerNote}>
                Chronological record across Clean Fanatics, Alchemy Techsol, BharatAgri, and
                WeDigitiz in Bengaluru &amp; Chennai.
              </p>
            </div>
          </AppleReveal>

          <div className={styles.rolesList}>
            {workExperienceData.map((job, idx) => (
              <AppleReveal key={job.id} delayMs={idx * 75}>
                <div className={styles.roleCard}>
                  <div className={styles.roleHeader}>
                    <div>
                      <h3 className={styles.roleTitle}>
                        {job.role}{" "}
                        <span className={styles.roleCompany}>— {job.company}</span>
                      </h3>
                      <span className={styles.roleLocation}>{job.location}</span>
                    </div>
                    <span className={styles.rolePeriod}>{job.period}</span>
                  </div>

                  <div className={styles.highlightsGrid}>
                    {job.highlights.map((hl) => (
                      <div key={hl.title} className={styles.highlightItem}>
                        <div className={styles.highlightHead}>
                          <span className={styles.highlightTitle}>{hl.title}</span>
                          {hl.metric && (
                            <span className={styles.highlightMetric}>{hl.metric}</span>
                          )}
                        </div>
                        <p className={styles.highlightDetail}>{hl.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </AppleReveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
