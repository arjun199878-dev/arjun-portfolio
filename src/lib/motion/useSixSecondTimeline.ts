"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type MotionPhaseId = "intro" | "transform" | "payoff" | "hold" | "reset";

export interface MotionPhaseInfo {
  id: MotionPhaseId;
  label: string;
  start: number;
  end: number;
  /** Normalized progress within this specific phase (0.0 to 1.0). */
  phaseProgress: number;
}

export const MOTION_PHASE_DEFS: readonly {
  id: MotionPhaseId;
  label: string;
  start: number;
  end: number;
}[] = [
  { id: "intro", label: "Intro", start: 0.0, end: 0.8 },
  { id: "transform", label: "Transform", start: 0.8, end: 2.8 },
  { id: "payoff", label: "Payoff", start: 2.8, end: 4.0 },
  { id: "hold", label: "Hold", start: 4.0, end: 5.2 },
  { id: "reset", label: "Loop", start: 5.2, end: 6.0 },
] as const;

export function getPhaseForTime(timeS: number): MotionPhaseInfo {
  const clamped = Math.max(0, Math.min(6.0, timeS));
  for (const def of MOTION_PHASE_DEFS) {
    if (clamped >= def.start && clamped <= def.end) {
      const span = def.end - def.start;
      const phaseProgress = span > 0 ? (clamped - def.start) / span : 0;
      return {
        ...def,
        phaseProgress: Math.max(0, Math.min(1, phaseProgress)),
      };
    }
  }
  const first = MOTION_PHASE_DEFS[0];
  return { ...first, phaseProgress: 0 };
}

export interface UseSixSecondTimelineOptions {
  /** If true, scene starts playing automatically on mount. Default true. */
  autoPlay?: boolean;
  /** Fixed loop duration in milliseconds. Defaults to 6000ms. */
  durationMs?: number;
  /** Time (in seconds) to pause at when prefers-reduced-motion is active. Defaults to 4.5s (Hold). */
  reducedMotionFrame?: number;
  /** Optional container ref to attach an IntersectionObserver to pause when out of view. */
  containerRef?: React.RefObject<HTMLElement | null>;
}

export interface SixSecondTimeline {
  /** Current elapsed time in seconds (0.000 ... 6.000). */
  time: number;
  /** Alias for time in seconds. */
  elapsedSeconds: number;
  /** Current elapsed time in milliseconds (0 ... 6000). */
  timeMs: number;
  /** Normalized progress from 0.0 to 1.0 across the entire 6.0s scene. */
  progress: number;
  /** Whether the animation is currently running. */
  isPlaying: boolean;
  /** Current active choreographic phase with normalized phaseProgress. */
  phase: MotionPhaseInfo;
  /** Whether the user's system prefers reduced motion. */
  isReducedMotion: boolean;
  /** Play the timeline. */
  play: () => void;
  /** Pause the timeline. */
  pause: () => void;
  /** Toggle play / pause. */
  togglePlay: () => void;
  /** Replay immediately from 0.0s. */
  replay: () => void;
  /** Seek to a specific timestamp in seconds (0.0 to 6.0). */
  seek: (targetTimeS: number) => void;
}

export function useSixSecondTimeline(
  options: UseSixSecondTimelineOptions = {}
): SixSecondTimeline {
  const {
    autoPlay = true,
    durationMs = 6000,
    reducedMotionFrame = 4.5,
    containerRef,
  } = options;

  const [timeMs, setTimeMs] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isReducedMotion, setIsReducedMotion] = useState<boolean>(false);

  const isPlayingRef = useRef(false);
  const rafIdRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);
  const accumulatedMsRef = useRef<number>(0);
  const isVisibleRef = useRef<boolean>(true);
  const tickRef = useRef<(timestamp: number) => void>(() => {});

  // Keep isPlayingRef updated in effect to adhere to React 19 ref rules
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // Maintain tick callback in ref so recursive animation loop has zero closure capture warnings
  useEffect(() => {
    tickRef.current = (timestamp: number) => {
      if (!isPlayingRef.current || !isVisibleRef.current) {
        rafIdRef.current = null;
        lastTimestampRef.current = null;
        return;
      }

      if (lastTimestampRef.current !== null) {
        const delta = timestamp - lastTimestampRef.current;
        const safeDelta = Math.min(delta, 100);
        accumulatedMsRef.current = (accumulatedMsRef.current + safeDelta) % durationMs;
        setTimeMs(accumulatedMsRef.current);
      }

      lastTimestampRef.current = timestamp;
      rafIdRef.current = requestAnimationFrame((ts) => tickRef.current(ts));
    };
  }, [durationMs]);

  // 1. Check prefers-reduced-motion on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const checkMotion = () => {
      const prefersReduced = mediaQuery.matches;
      setIsReducedMotion(prefersReduced);

      if (prefersReduced) {
        const holdMs = reducedMotionFrame * 1000;
        accumulatedMsRef.current = holdMs;
        setTimeMs(holdMs);
        setIsPlaying(false);
      } else if (autoPlay) {
        setIsPlaying(true);
      }
    };

    checkMotion();
    try {
      mediaQuery.addEventListener("change", checkMotion);
      return () => mediaQuery.removeEventListener("change", checkMotion);
    } catch {
      mediaQuery.addListener(checkMotion);
      return () => mediaQuery.removeListener(checkMotion);
    }
  }, [autoPlay, reducedMotionFrame]);

  // 2. IntersectionObserver to auto-pause when out of viewport
  useEffect(() => {
    const element = containerRef?.current;
    if (!element || typeof window === "undefined" || !("IntersectionObserver" in window)) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        const isVisible = entry?.isIntersecting ?? true;
        isVisibleRef.current = isVisible;

        if (!isVisible && isPlayingRef.current) {
          if (rafIdRef.current !== null) {
            cancelAnimationFrame(rafIdRef.current);
            rafIdRef.current = null;
          }
          lastTimestampRef.current = null;
        } else if (isVisible && isPlayingRef.current && rafIdRef.current === null) {
          lastTimestampRef.current = null;
          rafIdRef.current = requestAnimationFrame((ts) => tickRef.current(ts));
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [containerRef]);

  // 3. Manage RAF lifecycle when isPlaying changes
  useEffect(() => {
    if (isPlaying && isVisibleRef.current) {
      lastTimestampRef.current = null;
      rafIdRef.current = requestAnimationFrame((ts) => tickRef.current(ts));
    } else {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      lastTimestampRef.current = null;
    }

    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [isPlaying]);

  // Controls
  const play = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const replay = useCallback(() => {
    accumulatedMsRef.current = 0;
    setTimeMs(0);
    lastTimestampRef.current = null;
    setIsPlaying(true);
  }, []);

  const seek = useCallback(
    (targetTimeS: number) => {
      const clampedS = Math.max(0, Math.min(targetTimeS, durationMs / 1000));
      const targetMs = clampedS * 1000;
      accumulatedMsRef.current = targetMs;
      setTimeMs(targetMs);
      lastTimestampRef.current = null;
    },
    [durationMs]
  );

  const timeSeconds = timeMs / 1000;
  const progress = timeMs / durationMs;
  const currentPhase = getPhaseForTime(timeSeconds);

  return {
    time: timeSeconds,
    elapsedSeconds: timeSeconds,
    timeMs,
    progress,
    isPlaying,
    phase: currentPhase,
    isReducedMotion,
    play,
    pause,
    togglePlay,
    replay,
    seek,
  };
}
