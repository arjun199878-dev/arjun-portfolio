type FormatOptions = { decimals?: number; prefix?: string; suffix?: string };

const NBSP = " ";

/** Rounds, groups with en-IN, and wraps with prefix/suffix: formatValue(482, { prefix: "+", suffix: "%" }) → "+482%". */
export function formatValue(value: number, { decimals = 0, prefix = "", suffix = "" }: FormatOptions = {}): string {
  const text = new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
  return `${prefix}${text}${suffix}`;
}

type StatLike = { from?: number | null; to: number; decimals?: number | null; prefix?: string | null; suffix?: string | null };

/** The ready-made text for a stat: "+482%", "6% → 11%", "~3x", "47 → 631". */
export function formatStatDisplay(stat: StatLike): string {
  const decimals = stat.decimals ?? 0;
  const prefix = stat.prefix ?? "";
  const suffix = stat.suffix ?? "";
  const end = formatValue(stat.to, { decimals, prefix, suffix });
  if (stat.from === undefined || stat.from === null) return end;
  return `${formatValue(stat.from, { decimals, suffix })}${NBSP}→${NBSP}${end}`;
}
