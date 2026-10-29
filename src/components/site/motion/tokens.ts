export const EASE = [0.28, 0.11, 0.32, 1] as const; // Apple-like, matches --site-ease
export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const; // number counting only

export const DUR = {
  fast: 0.24, // nav, menu, colour changes
  reveal: 0.8, // fade-and-rise
  count: 1.2, // CountUp
  grow: 1.2, // before/after bar
  draw: 1.6, // line chart
  image: 1, // screenshot scale-in
  connector: 0.3, // funnel connector
  fadeLate: 0.5, // line chart end label
} as const;

export const STAGGER = {
  word: 0.08, // hero headline words
  tile: 0.08, // toolkit tiles
  step: 0.15, // funnel steps
  max: 0.5, // total stagger cap for any list
} as const;

export const DIST = {
  reveal: 30, // px, fade-and-rise
  numberIn: 40, // px, numbers chapter enter/exit
  word: 20, // px, hero words
} as const;

export const SCALE = {
  numberIn: 0.96,
  image: 0.92,
} as const;

export const VIEWPORT = { once: true, amount: 0.25 } as const;
export const COUNT_VIEWPORT = { once: true, amount: 0.6 } as const;

export const FADE_OUT = {
  start: "start 22%", // fade begins when the element's top is 22% down the screen
  end: "end 0%", // fully gone when its bottom reaches the top of the screen
  lift: 24, // px it drifts up while fading
} as const;

export const NUMBERS = {
  trackScreens: 5, // height of the numbers chapter in screens (4 stats + run-out)
  phases: { enterEnd: 0.15, countEnd: 0.7, holdEnd: 0.85 }, // within each stat's quarter
} as const;

export const HERO = {
  scrollOutEnd: 0.7, // fraction of hero scrolled when fully faded
  scaleTo: 0.92,
  introDelay: 0.2,
  tailGap: 0.3,
} as const;

/** Delay for item `i` of a staggered list, capped so long lists don't drag. */
export const stagger = (i: number, per: number) => Math.min(i * per, STAGGER.max);
