/**
 * Strict TypeScript schemas for Arjun's Portfolio.
 * Enforces explicit verification and implementation statuses (anti-fabrication rules).
 */

export type MetricVerificationStatus = "verified" | "illustrative" | "unavailable";

export type ImplementationStatus = "deployed" | "prototype" | "conceptual";

export interface PortfolioMetric {
  id: string;
  label: string;
  value: string;
  delta?: string;
  verification: MetricVerificationStatus;
  /** Explicit source or indication if sample/demo data */
  sourceNote: string;
}

export interface TechnologyItem {
  name: string;
  status: ImplementationStatus;
}

export interface ProjectNarrative {
  problem: string;
  approach: string;
  implementation: string;
  evidence: string;
  outcome: string;
  nextOpportunity: string;
}

export interface ProjectCaseStudy {
  id: string;
  slug: string;
  title: string;
  category: string;
  implementationStatus: ImplementationStatus;
  summary: string;
  narrative: ProjectNarrative;
  technologies: readonly TechnologyItem[];
  metrics: readonly PortfolioMetric[];
  pairedSceneIds: readonly number[];
}

export type SceneNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14;

export interface MotionSceneSpec {
  sceneNumber: SceneNumber;
  id: string;
  title: string;
  summary: string;
  heroObjectDescription: string;
  referencePayoffLabel: string;
  dataStatus: MetricVerificationStatus;
  domainAdaptation: string;
}

export interface CapabilityPillar {
  id: string;
  title: string;
  description: string;
  deliverables: readonly string[];
  techTags: readonly string[];
}

export interface OperatingPrinciple {
  number: string;
  title: string;
  description: string;
  focus: string;
}
