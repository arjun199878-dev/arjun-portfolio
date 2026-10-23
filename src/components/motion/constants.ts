/**
 * Timing constants for the motion-graphics engine (built in a later stage with
 * Motion for React). Kept dependency-free so they can be shared by CSS-driven
 * fallbacks and the engine alike.
 */

/** Every motion-graphics scene runs on a fixed six-second timeline. */
export const SCENE_DURATION_S = 6;
export const SCENE_DURATION_MS = SCENE_DURATION_S * 1000;

export type CubicBezier = readonly [number, number, number, number];

/** Mirrors the --ease-* tokens in src/styles/tokens.css. */
export const EASE = {
  out: [0.16, 1, 0.3, 1],
  inOut: [0.65, 0, 0.35, 1],
  standard: [0.2, 0, 0, 1],
} as const satisfies Record<string, CubicBezier>;
