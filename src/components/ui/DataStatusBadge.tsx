import type { ImplementationStatus, MetricVerificationStatus } from "@/lib/types";
import { cn } from "@/lib/cn";
import styles from "./DataStatusBadge.module.css";

interface DataStatusBadgeProps {
  status: MetricVerificationStatus | ImplementationStatus;
  type?: "verification" | "implementation";
  className?: string;
  sourceNote?: string;
}

const statusLabels: Record<MetricVerificationStatus | ImplementationStatus, string> = {
  verified: "Verified Data",
  illustrative: "Illustrative Sample",
  unavailable: "Measurement Pending",
  deployed: "Live Production",
  prototype: "Functional Prototype",
  conceptual: "System Concept",
};

export function DataStatusBadge({
  status,
  type = "verification",
  className,
  sourceNote,
}: DataStatusBadgeProps) {
  const label = statusLabels[status] || status;

  return (
    <span
      className={cn(styles.badge, styles[status], styles[type], className)}
      title={sourceNote || label}
      data-status={status}
    >
      <span className={styles.dot} aria-hidden="true" />
      <span className={styles.label}>{label}</span>
    </span>
  );
}
