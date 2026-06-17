export function getSegmentAngle(segmentCount: number): number {
  return 360 / segmentCount;
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
