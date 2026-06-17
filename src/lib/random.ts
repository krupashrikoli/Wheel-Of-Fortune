/** Deterministic 0–1 value for stable visual randomness without impure render calls. */
export function seededRandom(seed: number): number {
  const value = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return value - Math.floor(value);
}
