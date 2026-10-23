import type { MotionSceneSpec } from "@/lib/types";
import { DataStatusBadge } from "./DataStatusBadge";
import styles from "./SceneStagePlaceholder.module.css";

interface SceneStagePlaceholderProps {
  scene: MotionSceneSpec;
  variant?: "standalone" | "compact";
  className?: string;
}

/**
 * 1080x960 Aspect-Ratio Frosted Stage Frame.
 * Serves as an intentional Architectural Spec Card for Stages 2-5 motion work.
 * Strictly avoids generic blank grey boxes.
 */
export function SceneStagePlaceholder({
  scene,
  variant = "standalone",
  className,
}: SceneStagePlaceholderProps) {
  const paddedNumber = String(scene.sceneNumber).padStart(2, "0");

  return (
    <div className={`${styles.stageFrame} ${styles[variant]} ${className || ""}`}>
      {/* Precision grid coordinate hairlines */}
      <div className={styles.gridOverlay} aria-hidden="true" />

      {/* Frame Top Header */}
      <div className={styles.frameHeader}>
        <div className={styles.badgeGroup}>
          <span className={styles.specPill}>1080 × 960</span>
          <span className={styles.loopPill}>6.0s Loop Spec</span>
          <DataStatusBadge status={scene.dataStatus} />
        </div>
        <span className={styles.sceneIndex}>SCENE #{paddedNumber}</span>
      </div>

      {/* Frame Center / Architectural Blueprint Content */}
      <div className={styles.frameBody}>
        <div className={styles.radarGraphic} aria-hidden="true">
          <div className={styles.radarRing1} />
          <div className={styles.radarRing2} />
          <div className={styles.radarAxisX} />
          <div className={styles.radarAxisY} />
          <div className={styles.radarPulse} />
        </div>

        <div className={styles.contentWrap}>
          <span className={styles.domainTag}>{scene.domainAdaptation}</span>
          <h4 className={styles.sceneTitle}>{scene.title}</h4>
          <p className={styles.heroObject}>{scene.heroObjectDescription}</p>
        </div>
      </div>

      {/* Frame Bottom Payoff Footer */}
      <div className={styles.frameFooter}>
        <div className={styles.payoffBlock}>
          <span className={styles.payoffLabel}>Target Metric / Payoff</span>
          <span className={styles.payoffValue}>{scene.referencePayoffLabel}</span>
        </div>
        <span className={styles.stageStatusBadge}>
          {scene.sceneNumber === 1 ? "Stage 2 Hero Slot" : "Stage 3-5 Motion Engine"}
        </span>
      </div>
    </div>
  );
}
