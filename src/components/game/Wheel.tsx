"use client";

import { motion, useAnimation } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { playSpinTick, playWheelLand } from "@/lib/audio";
import type { WheelSegment } from "@/lib/types";
import {
  getSegmentAngle,
  getSegmentAtPointer,
  getTargetRotation,
} from "@/lib/wheel-math";

type WheelProps = {
  segments: WheelSegment[];
  layoutKey: number;
  isSpinning: boolean;
  targetSegmentIndex: number | null;
  onSpinComplete: (segmentIndex: number) => void;
  onSpinStart: () => number | null;
  disabled?: boolean;
};

const SPIN_DURATION = 6.4;
const SPIN_EASE: [number, number, number, number] = [0.15, 0.9, 0.15, 1];
const WHEEL_INNER_RADIUS = 58;
const WHEEL_OUTER_RADIUS = 185;
const LABEL_START_RADIUS = WHEEL_INNER_RADIUS + 18;
const LABEL_END_MARGIN = 12;

function getSegmentFontSize(charCount: number): number {
  if (charCount > 9) return 13;
  if (charCount > 7) return 15;
  if (charCount > 4) return 16;
  return 18;
}

function getCharSpacing(charCount: number): number {
  if (charCount <= 1) return 0;
  const available = WHEEL_OUTER_RADIUS - LABEL_END_MARGIN - LABEL_START_RADIUS;
  return Math.min(11, Math.max(8.5, available / (charCount - 1)));
}

const BRIGHT_COLORS = [
  "#FF5C5C",
  "#FF9D2E",
  "#FFD54A",
  "#64D948",
  "#2EEAFF",
  "#2EA8FF",
  "#8B5CFF",
  "#FF5CA8",
];

function segmentFill(segment: WheelSegment, index: number): string {
  if (segment.type === "bankrupt" || segment.type === "nagin") return "#FF4444";
  if (segment.type === "freeSpin") return "#64D948";
  return BRIGHT_COLORS[index % BRIGHT_COLORS.length];
}

function isDangerSegment(segment: WheelSegment): boolean {
  return segment.type === "bankrupt" || segment.type === "nagin";
}

export function Wheel({
  segments,
  layoutKey,
  isSpinning,
  targetSegmentIndex,
  onSpinComplete,
  onSpinStart,
  disabled,
}: WheelProps) {
  const controls = useAnimation();
  const pointerControls = useAnimation();
  const rimControls = useAnimation();
  const [wheelRotation, setWheelRotation] = useState(0);
  const [isSettling, setIsSettling] = useState(false);
  const rotationRef = useRef(0);
  const tickTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const segmentCount = segments.length;
  const showSpinning = isSpinning || isSettling;

  useEffect(() => {
    rotationRef.current = wheelRotation;
  }, [wheelRotation]);

  const clearTicks = () => {
    if (tickTimeoutRef.current) {
      clearTimeout(tickTimeoutRef.current);
      tickTimeoutRef.current = null;
    }
  };

  const startDeceleratingTicks = (durationMs: number) => {
    clearTicks();
    const start = performance.now();

    const tick = () => {
      const elapsed = performance.now() - start;
      if (elapsed >= durationMs) return;

      const progress = elapsed / durationMs;
      playSpinTick(1 - progress);
      const delay = Math.min(45 + progress * progress * 320, 380);
      tickTimeoutRef.current = setTimeout(tick, delay);
    };

    tick();
  };

  const playSnakeShake = async (targetRotation: number) => {
    rimControls.start({
      filter: [
        "drop-shadow(0 0 10px rgba(229,115,115,0.2))",
        "drop-shadow(0 0 30px rgba(229,115,115,0.6))",
        "drop-shadow(0 0 10px rgba(229,115,115,0.2))",
      ],
      transition: { duration: 0.5 },
    });
    await controls.start({
      rotate: [targetRotation, targetRotation - 4, targetRotation + 4, targetRotation - 2, targetRotation],
      transition: { duration: 0.5, ease: "easeInOut" },
    });
  };

  const playLandingWobble = async (targetRotation: number, isDanger: boolean) => {
    setIsSettling(true);
    pointerControls.start({
      rotate: [0, -14, 10, -6, 0],
      y: [0, 2, 0],
      transition: { duration: 0.75, ease: "easeOut" },
    });

    if (isDanger) {
      await playSnakeShake(targetRotation);
    } else {
      await controls.start({
        rotate: [targetRotation + 7, targetRotation - 3, targetRotation],
        transition: { duration: 0.85, ease: [0.34, 1.45, 0.64, 1] },
      });
    }

    rotationRef.current = targetRotation;
    setWheelRotation(targetRotation);
    setIsSettling(false);
  };

  useEffect(() => {
    if (!isSpinning || targetSegmentIndex === null) return;

    const targetRotation = getTargetRotation(
      rotationRef.current,
      targetSegmentIndex,
      segmentCount
    );
    startDeceleratingTicks(SPIN_DURATION * 1000);

    controls
      .start({
        rotate: targetRotation,
        transition: { duration: SPIN_DURATION, ease: SPIN_EASE },
      })
      .then(async () => {
        clearTicks();
        playWheelLand();
        const landedIndex = getSegmentAtPointer(targetRotation, segmentCount);
        const landed = segments[landedIndex];
        const isDanger = landed ? isDangerSegment(landed) : false;
        await playLandingWobble(targetRotation, isDanger);

        controls.set({ rotate: targetRotation });
        onSpinComplete(landedIndex);
      });

    return () => {
      clearTicks();
      setIsSettling(false);
    };
  }, [controls, isSpinning, onSpinComplete, pointerControls, rimControls, segmentCount, segments, targetSegmentIndex]);

  const handleSpin = () => {
    if (disabled || showSpinning) return;
    onSpinStart();
  };

  return (
    <div className="flex h-full min-h-0 w-full items-center justify-center">
      <div className="relative aspect-square h-full max-h-full w-auto max-w-full">
        <motion.div
          animate={pointerControls}
          className="pointer-events-none absolute -top-[8%] left-1/2 z-20 -translate-x-1/2"
          style={{ transformOrigin: "50% 100%" }}
        >
          <svg
            width="36"
            height="44"
            viewBox="0 0 36 44"
            className="h-[8%] min-h-7 w-auto drop-shadow-[0_4px_8px_rgba(0,0,0,0.35)]"
            fill="none"
            aria-hidden
          >
            <path
              d="M18 44 L3 10 L33 10 Z"
              fill="#FFD54A"
              stroke="#FF9D2E"
              strokeWidth="2"
            />
            <path d="M18 38 L8 14 L28 14 Z" fill="#F5F0E8" opacity="0.45" />
            <rect x="12" y="0" width="12" height="10" rx="3" fill="#E3C37A" stroke="#F1D48F" strokeWidth="1.5" />
          </svg>
        </motion.div>

        <motion.div
          animate={rimControls}
          initial={{ filter: "drop-shadow(0 0 16px rgba(255,213,74,0.5))" }}
          className="relative h-full w-full"
        >
          <motion.div
            animate={
              showSpinning
                ? {
                    filter: [
                      "drop-shadow(0 0 16px rgba(255,213,74,0.5))",
                      "drop-shadow(0 0 32px rgba(255,157,46,0.7))",
                      "drop-shadow(0 0 20px rgba(255,213,74,0.55))",
                    ],
                  }
                : { filter: "drop-shadow(0 0 16px rgba(255,213,74,0.5))" }
            }
            transition={
              showSpinning
                ? { duration: 1.2, repeat: Infinity, ease: "easeInOut" }
                : { duration: 0.4 }
            }
            className="relative h-full w-full overflow-hidden rounded-full p-1.5"
            style={{
              background: "linear-gradient(135deg, #FFD54A 0%, #FFF8DC 50%, #FF9D2E 100%)",
            }}
          >
            <motion.div
              animate={controls}
              initial={false}
              className="relative h-full w-full overflow-hidden rounded-full"
              style={{ transformOrigin: "50% 50%" }}
            >
              <motion.svg
                key={layoutKey}
                initial={{ opacity: 0.55, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                viewBox="0 0 400 400"
                className="h-full w-full"
                preserveAspectRatio="xMidYMid meet"
              >
                <defs>
                  <linearGradient id={`goldMetal-${layoutKey}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FF9D2E" />
                    <stop offset="45%" stopColor="#FFD54A" />
                    <stop offset="100%" stopColor="#FF9D2E" />
                  </linearGradient>
                  <radialGradient id={`hubGlow-${layoutKey}`} cx="50%" cy="40%" r="60%">
                    <stop offset="0%" stopColor="#5CE85C" />
                    <stop offset="100%" stopColor="#2E9E2E" />
                  </radialGradient>
                </defs>

                <circle cx="200" cy="200" r="198" fill={`url(#goldMetal-${layoutKey})`} />

                {Array.from({ length: 24 }, (_, i) => {
                  const a = ((i / 24) * 360 - 90) * (Math.PI / 180);
                  const lx = 200 + 196 * Math.cos(a);
                  const ly = 200 + 196 * Math.sin(a);
                  return (
                    <circle
                      key={`led-${i}`}
                      cx={lx}
                      cy={ly}
                      r={showSpinning ? 3.5 : 3}
                      fill={showSpinning && i % 2 === 0 ? "#FFFFFF" : "#FFE566"}
                      opacity={showSpinning ? 0.95 : 0.75}
                    />
                  );
                })}

                {segments.map((segment, index) => {
                  const segmentAngle = getSegmentAngle(segments.length);
                  const startAngle = (index * segmentAngle - 90) * (Math.PI / 180);
                  const endAngle = ((index + 1) * segmentAngle - 90) * (Math.PI / 180);
                  const x1o = 200 + WHEEL_OUTER_RADIUS * Math.cos(startAngle);
                  const y1o = 200 + WHEEL_OUTER_RADIUS * Math.sin(startAngle);
                  const x2o = 200 + WHEEL_OUTER_RADIUS * Math.cos(endAngle);
                  const y2o = 200 + WHEEL_OUTER_RADIUS * Math.sin(endAngle);
                  const x1i = 200 + WHEEL_INNER_RADIUS * Math.cos(endAngle);
                  const y1i = 200 + WHEEL_INNER_RADIUS * Math.sin(endAngle);
                  const x2i = 200 + WHEEL_INNER_RADIUS * Math.cos(startAngle);
                  const y2i = 200 + WHEEL_INNER_RADIUS * Math.sin(startAngle);
                  const largeArc = segmentAngle > 180 ? 1 : 0;
                  const midAngle = ((index + 0.5) * segmentAngle - 90) * (Math.PI / 180);
                  const radialDeg = (midAngle * 180) / Math.PI;
                  let textRotate = radialDeg;
                  if (textRotate > 90 || textRotate < -90) {
                    textRotate += 180;
                  }

                  const displayLabel = segment.label;
                  const chars = [...displayLabel];
                  const charSpacing = getCharSpacing(chars.length);
                  const startRadius = LABEL_START_RADIUS;
                  const fontSize = getSegmentFontSize(chars.length);

                  return (
                    <g key={`${layoutKey}-${segment.label}-${index}`}>
                      <path
                        d={`M ${x1o} ${y1o} A ${WHEEL_OUTER_RADIUS} ${WHEEL_OUTER_RADIUS} 0 ${largeArc} 1 ${x2o} ${y2o} L ${x1i} ${y1i} A ${WHEEL_INNER_RADIUS} ${WHEEL_INNER_RADIUS} 0 ${largeArc} 0 ${x2i} ${y2i} Z`}
                        fill={segmentFill(segment, index)}
                        stroke="#F5F0E8"
                        strokeOpacity={0.35}
                        strokeWidth="1"
                      />
                      {chars.map((char, charIndex) => {
                        const radius = startRadius + charIndex * charSpacing;
                        const charX = 200 + radius * Math.cos(midAngle);
                        const charY = 200 + radius * Math.sin(midAngle);
                        const isLightText =
                          isDangerSegment(segment) ||
                          segment.type === "freeSpin" ||
                          segment.type === "value";

                        return (
                          <text
                            key={`${char}-${charIndex}`}
                            x={charX}
                            y={charY}
                            fill={isLightText ? "#FFFFFF" : "#111111"}
                            stroke={isLightText ? "rgba(0,0,0,0.55)" : "rgba(255,255,255,0.35)"}
                            strokeWidth={isLightText ? 1 : 0.45}
                            paintOrder="stroke fill"
                            fontSize={char === "🐍" ? fontSize + 3 : fontSize}
                            fontWeight="900"
                            fontFamily="var(--font-display), Fredoka, system-ui, sans-serif"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            transform={`rotate(${textRotate}, ${charX}, ${charY})`}
                          >
                            {char}
                          </text>
                        );
                      })}
                    </g>
                  );
                })}

                <circle
                  cx="200"
                  cy="200"
                  r={WHEEL_INNER_RADIUS - 1}
                  fill={`url(#goldMetal-${layoutKey})`}
                  stroke="#FFD54A"
                  strokeWidth="3"
                />
                <circle cx="200" cy="200" r={WHEEL_INNER_RADIUS - 10} fill={`url(#hubGlow-${layoutKey})`} stroke="#FFD54A" strokeWidth="3" />
                <circle cx="200" cy="200" r="8" fill="#64D948" stroke="#3CB82C" strokeWidth="2" />
                <ellipse cx="200" cy="194" rx="10" ry="4" fill="#F5F0E8" opacity="0.12" />
              </motion.svg>
            </motion.div>
          </motion.div>
        </motion.div>

        <button
          type="button"
          onClick={handleSpin}
          disabled={disabled || showSpinning}
          aria-label={showSpinning ? "Spinning" : "Spin the wheel"}
          className="absolute top-1/2 left-1/2 z-30 flex h-[19%] w-[19%] min-h-10 min-w-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-[3px] border-[#3CB82C] bg-gradient-to-b from-[#8AF078] to-game-green font-display text-xs font-extrabold tracking-wide text-white uppercase shadow-[0_4px_0_#3CB82C,0_6px_16px_rgba(0,0,0,0.2)] transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(100,217,72,0.6)] active:translate-y-0.5 active:shadow-[0_2px_0_#3CB82C] disabled:cursor-not-allowed disabled:opacity-40 sm:text-sm"
        >
          {showSpinning ? "…" : "SPIN"}
        </button>
      </div>
    </div>
  );
}
