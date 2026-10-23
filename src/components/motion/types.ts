import type { SCENE_DURATION_S } from "./constants";

/** Seconds from the start of a scene, within 0…SCENE_DURATION_S. */
export type SceneTime = number;

/** A named moment on the timeline that elements can key their animation from. */
export interface SceneBeat {
  id: string;
  at: SceneTime;
}

/**
 * Contract every motion-graphics scene implements. Scenes are self-contained,
 * fixed-length (six seconds) and must offer a static frame for reduced motion.
 */
export interface MotionScene<BeatId extends string = string> {
  id: string;
  title: string;
  /** Fixed scene length; typed to the shared constant so scenes cannot drift. */
  duration: typeof SCENE_DURATION_S;
  /** Ordered beats, each `at` within 0…duration. */
  beats: readonly (SceneBeat & { id: BeatId })[];
  /** Restart at 0 after the final beat. */
  loop: boolean;
  /** Timeline position rendered statically when prefers-reduced-motion is set. */
  reducedMotionFrame: SceneTime;
}
