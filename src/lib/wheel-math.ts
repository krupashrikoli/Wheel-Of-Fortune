import type { WheelSegment } from "./types";

export function getSegmentAngle(segmentCount: number): number {
  return 360 / segmentCount;
}

export function shuffleWheelSegments(segments: WheelSegment[]): WheelSegment[] {
  const shuffled = [...segments];

  for (let pass = 0; pass < 2; pass++) {
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
  }

  if (isSameOrder(shuffled, segments)) {
    const a = Math.floor(Math.random() * shuffled.length);
    let b = Math.floor(Math.random() * shuffled.length);
    while (b === a) b = Math.floor(Math.random() * shuffled.length);
    [shuffled[a], shuffled[b]] = [shuffled[b], shuffled[a]];
  }

  return shuffled;
}

function isSameOrder(a: WheelSegment[], b: WheelSegment[]): boolean {
  return a.every((segment, index) => segment.label === b[index]?.label);
}

export function getSegmentCenterAngle(segmentIndex: number, segmentCount: number): number {
  const segmentAngle = getSegmentAngle(segmentCount);
  return segmentIndex * segmentAngle + segmentAngle / 2;
}

export function getLandingModulo(segmentIndex: number, segmentCount: number): number {
  const center = getSegmentCenterAngle(segmentIndex, segmentCount);
  return (360 - center + 360) % 360;
}

export function getTargetRotation(
  currentRotation: number,
  segmentIndex: number,
  segmentCount: number,
  fullSpins = 9 + Math.floor(Math.random() * 5)
): number {
  const landingMod = getLandingModulo(segmentIndex, segmentCount);
  const currentMod = ((currentRotation % 360) + 360) % 360;
  let delta = (landingMod - currentMod + 360) % 360;
  if (delta === 0) delta = 360;

  const rawTarget = currentRotation + fullSpins * 360 + delta;
  const fullTurns = Math.round((rawTarget - landingMod) / 360);
  return fullTurns * 360 + landingMod;
}

export function getSegmentAtPointer(rotation: number, segmentCount: number): number {
  const segmentAngle = getSegmentAngle(segmentCount);
  const normalized = ((rotation % 360) + 360) % 360;
  const pointerAngle = (360 - normalized + 360) % 360;
  return Math.floor(pointerAngle / segmentAngle) % segmentCount;
}
