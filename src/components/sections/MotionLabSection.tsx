"use client";

import React, { useState } from "react";
import { SCENE_REGISTRY } from "@/components/motion/scenes/sceneRegistry";
import { motionSceneSpecs } from "@/lib/portfolio-data";
import styles from "./MotionLabSection.module.css";

export function MotionLabSection() {
  const [activeSceneNumber, setActiveSceneNumber] = useState<number>(1);
  const [showAllGrid, setShowAllGrid] = useState<boolean>(false);

  const activeScene =
    SCENE_REGISTRY.find((s) => s.sceneNumber === activeSceneNumber) ||
    SCENE_REGISTRY[0];
  const activeSpec =
    motionSceneSpecs.find((s) => s.sceneNumber === activeSceneNumber) ||
    motionSceneSpecs[0];

  return (
    <section
      id="motion-lab"
      className={`bg-grain ${styles.section}`}
      aria-labelledby="motion-lab-title"
    >
      <div className={styles.container}>
        {/* Section Header */}
        <div className={styles.header}>
          <div>
            <div className={styles.eyebrow}>
              <span className={styles.pingDot} />
              <span>04 // MOTION LAB (MANDATORY 14 SCENES)</span>
            </div>
            <h2 id="motion-lab-title" className={styles.title}>
              Motion Lab
            </h2>
          </div>
          <p className={styles.subtitle}>
            Curated 6-second spring physics laboratory. Select any scene below to inspect its live
            1080×960 vector transformation cycle, 1.2s completed hold, and seamless return.
          </p>
        </div>

        {/* Master Interactive Motion Console (Stitch 4-Col Drawer + 8-Col Stage) */}
        <div className={styles.consoleGrid}>
          {/* Left 4 Cols: Scene Selector Drawer */}
          <div className={`custom-scrollbar ${styles.selectorDrawer}`}>
            <div className={styles.drawerHeader}>
              <span>AVAILABLE_SCENES (14)</span>
              <span className={styles.acidText}>1080×960 REF</span>
            </div>

            <div className={styles.sceneBtnList} role="tablist" aria-label="14 Motion Scenes">
              {SCENE_REGISTRY.map((scene) => {
                const isSelected = scene.sceneNumber === activeSceneNumber;
                const padded = String(scene.sceneNumber).padStart(2, "0");
                return (
                  <button
                    key={scene.id}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    className={`${styles.sceneBtn} ${
                      isSelected ? styles.sceneBtnActive : ""
                    }`}
                    onClick={() => setActiveSceneNumber(scene.sceneNumber)}
                  >
                    <span>
                      {padded}. {scene.title}
                    </span>
                    <span className={styles.sceneDur}>6.0s</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right 8 Cols: Main Interactive Stage */}
          <div className={styles.stagePanel}>
            {/* Stage Top Bar */}
            <div className={styles.stageTopBar}>
              <div className={styles.stageTitleGroup}>
                <span className={styles.stageDot} />
                <span className={styles.stageActiveTitle}>
                  SCENE {String(activeScene.sceneNumber).padStart(2, "0")}:{" "}
                  {activeScene.title.toUpperCase()}
                </span>
              </div>

              <div className={styles.stageNavGroup}>
                <button
                  type="button"
                  className={styles.navBtn}
                  onClick={() =>
                    setActiveSceneNumber((prev) => (prev > 1 ? prev - 1 : 14))
                  }
                >
                  ← PREV
                </button>
                <button
                  type="button"
                  className={styles.navBtnAcid}
                  onClick={() =>
                    setActiveSceneNumber((prev) => (prev < 14 ? prev + 1 : 1))
                  }
                >
                  NEXT →
                </button>
                <span className={styles.holdLabel}>HOLD: 1.2s</span>
              </div>
            </div>

            {/* Live 6-Second Interactive SVG Stage Area */}
            <div className={styles.stageViewport}>
              {activeScene.render({ showFrame: true })}
            </div>

            {/* Stage Phase Breakdown Footer */}
            <div className={styles.stageFooter}>
              <div className={styles.phaseMarkers}>
                <span>0.0s [INTRO]</span>
                <span className={styles.acidText}>0.8s - 2.8s [TRANSFORM]</span>
                <span>2.8s - 4.0s [REVEAL]</span>
                <span className={styles.vermilionBold}>4.0s - 5.2s [STABLE HOLD]</span>
                <span>6.0s [RETURN]</span>
              </div>

              <div className={styles.sceneDescRow}>
                <p className={styles.sceneDescText}>{activeSpec.summary}</p>
                <span className={styles.payoffTag}>
                  PAYOFF: {activeScene.referencePayoffLabel}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Toggleable 14-Scene Overview Grid */}
        <div className={styles.overviewToggleRow}>
          <button
            type="button"
            className={styles.toggleGridBtn}
            onClick={() => setShowAllGrid((v) => !v)}
          >
            {showAllGrid
              ? "▲ HIDE ALL 14 SCENES OVERVIEW GRID"
              : "▼ EXPAND ALL 14 SCENES OVERVIEW GRID (STATIC 4.5S PREVIEWS)"}
          </button>
        </div>

        {showAllGrid && (
          <div className={styles.overviewGrid}>
            {SCENE_REGISTRY.map((scene) => {
              const isSelected = scene.sceneNumber === activeSceneNumber;
              return (
                <div
                  key={scene.id}
                  className={`${styles.overviewCard} ${
                    isSelected ? styles.overviewCardActive : ""
                  }`}
                  onClick={() => setActiveSceneNumber(scene.sceneNumber)}
                >
                  <div className={styles.overviewPreview}>
                    {scene.render({ showFrame: false, time: 4.5 })}
                  </div>
                  <div className={styles.overviewMeta}>
                    <span className={styles.overviewNum}>
                      SCENE {String(scene.sceneNumber).padStart(2, "0")}
                    </span>
                    <span className={styles.overviewTitle}>{scene.title}</span>
                    <span className={styles.overviewPayoff}>
                      {scene.referencePayoffLabel}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
