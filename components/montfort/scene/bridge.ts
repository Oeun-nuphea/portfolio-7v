/*
 * Shared, mutable state between the DOM side (GSAP timeline + camera rig in montfort.tsx)
 * and the WebGL scene. Mutated every frame, never stored in React state.
 */
export interface SceneBridge {
  /* Current master timeline time, in timeline units (0 - TOTAL). Follows the scrubbed (smoothed) playhead. */
  time: number
  /* Smoothed pointer / gyro position, -1..1 on each axis. Stays 0 when reduced motion is on. */
  camX: number
  camY: number
}

