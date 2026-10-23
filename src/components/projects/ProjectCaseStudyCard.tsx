"use client";

import React, { useState } from "react";
import { DataStatusBadge } from "@/components/ui/DataStatusBadge";
import type { ProjectCaseStudy } from "@/lib/types";
import styles from "./ProjectCaseStudyCard.module.css";

export interface ProjectCaseStudyCardProps {
  project: ProjectCaseStudy;
  index: number;
  pairedVisual: React.ReactNode;
}

const NARRATIVE_STEPS = [
  { key: "problem", label: "Problem", num: "01" },
  { key: "approach", label: "Approach", num: "02" },
  { key: "implementation", label: "Implementation", num: "03" },
  { key: "evidence", label: "Evidence", num: "04" },
  { key: "outcome", label: "Outcome", num: "05" },
  { key: "nextOpportunity", label: "Next", num: "06" },
] as const;

export function ProjectCaseStudyCard({
  project,
  index,
  pairedVisual,
}: ProjectCaseStudyCardProps) {
  const [activeStepKey, setActiveStepKey] =
    useState<keyof typeof project.narrative>("evidence");

  const paddedIndex = String(index + 1).padStart(2, "0");
  const activeStepMeta =
    NARRATIVE_STEPS.find((s) => s.key === activeStepKey) || NARRATIVE_STEPS[3];

  const statusLabel =
    project.implementationStatus === "deployed"
      ? "Implemented System"
      : project.implementationStatus === "prototype"
      ? "Operational Prototype"
      : "System Concept";

  return (
    <article id={`project-${project.slug}`} className={styles.cardRoot}>
      {/* Top Bar */}
      <div className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <span className={styles.projectCode}>PROJECT_{paddedIndex}</span>
          <span className={styles.slash}>{"//"}</span>
          <span className={styles.categoryName}>{project.category.toUpperCase()}</span>
        </div>
        <span
          className={
            project.implementationStatus === "deployed"
              ? styles.statusAcid
              : styles.statusVermilion
          }
        >
          {statusLabel}
        </span>
      </div>

      {/* 12-Col Split Layout */}
      <div className={styles.cardGrid}>
        {/* Left 6 Cols: Editorial Narrative & Telemetry */}
        <div className={styles.narrativeCol}>
          <h3 className={styles.projectTitle}>{project.title}</h3>
          <p className={styles.projectSummary}>{project.summary}</p>

          {/* 4-Box Stitch Metadata Matrix */}
          <div className={styles.metaMatrix}>
            <div>
              <span className={styles.metaLabel}>The Problem</span>
              <span className={styles.metaValue}>{project.narrative.problem}</span>
            </div>
            <div>
              <span className={styles.metaLabel}>The Approach</span>
              <span className={styles.metaValue}>{project.narrative.approach}</span>
            </div>
            <div>
              <span className={styles.metaLabel}>The Implementation</span>
              <span className={styles.metaValue}>{project.narrative.implementation}</span>
            </div>
            <div>
              <span className={styles.metaLabel}>Next Opportunity</span>
              <span className={styles.metaValueAcid}>
                {project.narrative.nextOpportunity}
              </span>
            </div>
          </div>

          {/* Highlighted Evidence & Outcome Callout */}
          <div className={styles.evidenceCallout}>
            <div className={styles.stepTabsRow} role="tablist" aria-label="Case study step">
              {NARRATIVE_STEPS.map((step) => {
                const isActive = activeStepKey === step.key;
                return (
                  <button
                    key={step.key}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    className={`${styles.stepBtn} ${isActive ? styles.stepBtnActive : ""}`}
                    onClick={() => setActiveStepKey(step.key)}
                  >
                    {step.num} {step.label}
                  </button>
                );
              })}
            </div>
            <strong className={styles.calloutHeader}>
              {activeStepMeta.num} {"//"} {activeStepMeta.label.toUpperCase()}:
            </strong>
            <p className={styles.calloutText}>{project.narrative[activeStepKey]}</p>
          </div>

          {/* Verified Metrics Row */}
          <div className={styles.metricsGrid}>
            {project.metrics.map((metric) => (
              <div key={metric.id} className={styles.metricCard}>
                <div className={styles.metricTop}>
                  <span className={styles.metricVal} data-numeric>
                    {metric.value}
                  </span>
                  {metric.delta && (
                    <span className={styles.metricDelta}>{metric.delta}</span>
                  )}
                </div>
                <span className={styles.metricLbl}>{metric.label}</span>
                <div className={styles.metricBadgeWrap}>
                  <DataStatusBadge
                    status={metric.verification}
                    sourceNote={metric.sourceNote}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Tech Stack Pills */}
          <div className={styles.techRow}>
            {project.technologies.map((tech) => (
              <span key={tech.name} className={styles.techPill}>
                <span className={styles.techDot} />
                {tech.name}
              </span>
            ))}
          </div>
        </div>

        {/* Right 6 Cols: Paired 6-Second Interactive SVG Domain Visual */}
        <div className={styles.stageCol}>
          <div className={styles.stageConsole}>{pairedVisual}</div>
        </div>
      </div>
    </article>
  );
}
