/** Shape of a case study; populated in the projects stage. */
export interface ProjectMetric {
  label: string;
  value: string;
  /** Direction of change, used to colour the metric. */
  trend?: "up" | "down" | "neutral";
}

export interface Project {
  slug: string;
  title: string;
  client?: string;
  year: number;
  role: string;
  problem: string;
  outcome: string;
  metrics: readonly ProjectMetric[];
  tags: readonly string[];
}
