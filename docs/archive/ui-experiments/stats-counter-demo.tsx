"use client";

import StatsCounter from "@/components/ui/stats-counter";

export function StatsCounterDemo() {
  return (
    <StatsCounter
      value={12000}
      suffix="+"
      duration={2}
    />
  );
}

export default StatsCounterDemo;
