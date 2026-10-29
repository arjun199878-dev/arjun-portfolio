import type { CaseVisual as CaseVisualType, Stat } from "@/lib/content";
import { BeforeAfterVisual } from "./BeforeAfterVisual";
import { BigNumberVisual } from "./BigNumberVisual";
import { FunnelVisual } from "./FunnelVisual";
import { LineVisual } from "./LineVisual";
import { ScreenshotVisual } from "./ScreenshotVisual";

export function CaseVisual({ visual, stats }: { visual: CaseVisualType; stats: readonly Stat[] }) {
  switch (visual.kind) {
    case "line": {
      if (visual.series && visual.series.length > 0) {
        return <LineVisual caption={visual.caption} series={visual.series} />;
      }
      const stat = stats.find((s) => s.key === visual.fallbackStatKey);
      if (!stat) return null;
      return (
        <BigNumberVisual
          caption={visual.caption}
          label={stat.label}
          to={stat.to}
          decimals={stat.decimals}
          prefix={stat.prefix}
          suffix={stat.suffix}
        />
      );
    }
    case "beforeAfter":
      return <BeforeAfterVisual {...visual} />;
    case "funnel":
      return <FunnelVisual {...visual} />;
    case "screenshot":
      return <ScreenshotVisual caption={visual.caption} image={visual.image} />;
  }
}
