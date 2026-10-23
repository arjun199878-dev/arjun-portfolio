/**
 * Spring physics, cubic-bezier interpolation, and seamless loop math
 * for Arjun's 6.0-second deterministic motion engine.
 */

/**
 * Critically damped or under-damped harmonic spring oscillator.
 * Produces crisp Apple-style physical momentum with controlled overshoot.
 *
 * @param progress Normalized progress between 0 and 1.
 * @param stiffness Spring tension (higher = snappier). Defaults to 6.2.
 * @param damping Friction dampening (higher = less oscillation). Defaults to 5.5.
 */
export function springOvershoot(
  progress: number,
  stiffness = 6.2,
  damping = 5.5
): number {
  const p = Math.max(0, Math.min(1, progress));
  if (p === 0) return 0;
  if (p === 1) return 1;
  return 1 - Math.exp(-damping * p) * Math.cos(stiffness * p);
}

/**
 * Standard cubic ease-in-out curve.
 */
export function easeInOutCubic(x: number): number {
  const clamped = Math.max(0, Math.min(1, x));
  return clamped < 0.5
    ? 4 * clamped * clamped * clamped
    : 1 - Math.pow(-2 * clamped + 2, 3) / 2;
}

/**
 * Standard smooth ease-out curve.
 */
export function easeOutQuad(x: number): number {
  const clamped = Math.max(0, Math.min(1, x));
  return 1 - (1 - clamped) * (1 - clamped);
}

/**
 * Smoothstep interpolation: 3x^2 - 2x^3.
 */
export function smoothstep(x: number): number {
  const clamped = Math.max(0, Math.min(1, x));
  return clamped * clamped * (3 - 2 * clamped);
}

/**
 * Computes normalized progress for an item in a staggered sequence.
 *
 * @param time Current elapsed seconds within the transition window.
 * @param index Index of the item (0-based).
 * @param totalCount Total number of items in sequence.
 * @param windowStart Time when the staggered group begins (in seconds).
 * @param windowDuration Total duration for the entire sequence (in seconds).
 * @param itemDuration Duration for each individual item's transition (in seconds).
 */
export function getStaggeredProgress(
  time: number,
  index: number,
  totalCount: number,
  windowStart: number,
  windowDuration: number,
  itemDuration?: number
): number {
  if (totalCount <= 1) {
    const p = (time - windowStart) / windowDuration;
    return Math.max(0, Math.min(1, p));
  }

  const effectiveItemDuration =
    itemDuration ?? windowDuration / (1 + (totalCount - 1) * 0.4);
  const step =
    (windowDuration - effectiveItemDuration) / Math.max(1, totalCount - 1);
  const itemStart = windowStart + index * step;

  const raw = (time - itemStart) / effectiveItemDuration;
  return Math.max(0, Math.min(1, raw));
}

/**
 * Seamless loop envelope helper.
 * Returns an interpolation factor guarantee that f(0.0) === f(6.0).
 *
 * @param elapsedSeconds Time in seconds (0.0 to 6.0).
 * @param resetStart Time in seconds when the reset phase begins (default 5.2s).
 * @param loopEnd Total loop duration (default 6.0s).
 */
export function getLoopEnvelope(
  elapsedSeconds: number,
  resetStart = 5.2,
  loopEnd = 6.0
): number {
  const t = Math.max(0, Math.min(loopEnd, elapsedSeconds));
  if (t < resetStart) return 1;
  const progress = (t - resetStart) / (loopEnd - resetStart);
  return 1 - easeInOutCubic(progress);
}

/**
 * Interpolates smoothly between two numerical values.
 */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * Math.max(0, Math.min(1, t));
}
