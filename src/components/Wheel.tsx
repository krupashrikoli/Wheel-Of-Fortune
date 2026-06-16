"use client";

import { motion, useAnimation } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { playSpinTick, playWheelLand } from "@/lib/audio";
import type { WheelSegment } from "@/lib/types";
import {
  SEGMENT_ANGLE,
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

const SEGMENT_COLORS = [
  "#5C2E2E",
  "#2A2826",
  "#3D3832",
  "#4A433C",
  "#5C4F3A",
  "#2A2826",
  "#4A2828",
  "#3D3832",
  "#6B5A3E",
  "#4A433C",
  "#2A2826",
  "#3D3832",
];

const SPIN_DURATION = 6.4;
const SPIN_EASE: [number, number, number, number] = [0.06, 0.88, 0.12, 1];

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
    let delay = 45;

    const tick = () => {
      const elapsed = performance.now() - start;
      if (elapsed >= durationMs) return;

      const progress = elapsed / durationMs;
      const speed = 1 - progress;
      playSpinTick(speed);
      delay = Math.min(45 + progress * progress * 320, 380);
      tickTimeoutRef.current = setTimeout(tick, delay);
    };

    tick();
  };

  const playLandingWobble = async (targetRotation: number) => {
    setIsSettling(true);
    pointerControls.start({
      rotate: [0, -14, 10, -6, 0],
      y: [0, 2, 0],
      transition: { duration: 0.75, ease: "easeOut" },
    });

    await controls.start({
      rotate: [targetRotation + 7, targetRotation - 3, targetRotation],
      transition: { duration: 0.85, ease: [0.34, 1.45, 0.64, 1] },
    });

    rotationRef.current = targetRotation;
    setWheelRotation(targetRotation);
    setIsSettling(false);
  };

  useEffect(() => {
    if (!isSpinning || targetSegmentIndex === null) return;

    const targetRotation = getTargetRotation(rotationRef.current, targetSegmentIndex);
    startDeceleratingTicks(SPIN_DURATION * 1000);

    controls
      .start({
        rotate: targetRotation,
        transition: { duration: SPIN_DURATION, ease: SPIN_EASE },
      })
      .then(async () => {
        clearTicks();
        playWheelLand();
        await playLandingWobble(targetRotation);

        controls.set({ rotate: targetRotation });
        const landedSegment = getSegmentAtPointer(targetRotation, segmentCount);
        onSpinComplete(landedSegment);
      });

    return () => {
      clearTicks();
      setIsSettling(false);
    };
  }, [
    controls,
    isSpinning,
    onSpinComplete,
    pointerControls,
    segmentCount,
    targetSegmentIndex,
  ]);

  const handleSpin = () => {
    if (disabled || showSpinning) return;
    onSpinStart();
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <motion.div
          animate={pointerControls}
          className="pointer-events-none absolute -top-5 left-1/2 z-20 -translate-x-1/2"
          style={{ transformOrigin: "50% 100%" }}
        >
          <svg
            width="22"
            height="28"
            viewBox="0 0 28 36"
            className="h-7 w-[22px] drop-shadow-[0_2px_8px_rgba(201,169,98,0.6)]"
            fill="none"
            aria-hidden
          >
            <rect x="9" y="0" width="10" height="8" rx="2" fill="#C9A962" />
            <path d="M14 36 L4 9 L24 9 Z" fill="#C9A962" />
            <path d="M14 33 L7 12 L21 12 Z" fill="#E8DFD0" opacity="0.35" />
          </svg>
        </motion.div>

        <motion.div
          animate={
            showSpinning
              ? {
                  scale: [1, 1.03, 1.01],
                  boxShadow: [
                    "0 0 40px rgba(201,169,98,0.12)",
                    "0 0 72px rgba(201,169,98,0.35)",
                    "0 0 48px rgba(201,169,98,0.2)",
                  ],
                }
              : {
                  scale: 1,
                  boxShadow: "0 0 40px rgba(201,169,98,0.12)",
                }
          }
          transition={
            showSpinning
              ? { duration: 1.2, repeat: Infinity, ease: "easeInOut" }
              : { duration: 0.4 }
          }
          className="relative rounded-full border-[3px] border-gold/40"
        >
          <motion.div
            animate={controls}
            initial={false}
            className="relative h-48 w-48 sm:h-52 sm:w-52"
            style={{ transformOrigin: "50% 50%" }}
          >
            <motion.svg
              key={layoutKey}
              initial={{ opacity: 0.55, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              viewBox="0 0 400 400"
              className="h-full w-full"
            >
              {segments.map((segment, index) => {
                const startAngle = (index * SEGMENT_ANGLE - 90) * (Math.PI / 180);
                const endAngle = ((index + 1) * SEGMENT_ANGLE - 90) * (Math.PI / 180);
                const x1 = 200 + 190 * Math.cos(startAngle);
                const y1 = 200 + 190 * Math.sin(startAngle);
                const x2 = 200 + 190 * Math.cos(endAngle);
                const y2 = 200 + 190 * Math.sin(endAngle);
                const largeArc = SEGMENT_ANGLE > 180 ? 1 : 0;
                const midAngle = ((index + 0.5) * SEGMENT_ANGLE - 90) * (Math.PI / 180);
                const labelX = 200 + 125 * Math.cos(midAngle);
                const labelY = 200 + 125 * Math.sin(midAngle);
                const labelRotation = index * SEGMENT_ANGLE + SEGMENT_ANGLE / 2;

                return (
                  <g key={`${layoutKey}-${segment.label}-${index}`}>
                    <path
                      d={`M 200 200 L ${x1} ${y1} A 190 190 0 ${largeArc} 1 ${x2} ${y2} Z`}
                      fill={SEGMENT_COLORS[index % SEGMENT_COLORS.length]}
                      stroke="#C9A962"
                      strokeWidth="0.5"
                      opacity={segment.isBankrupt ? 0.95 : 1}
                    />
                    <text
                      x={labelX}
                      y={labelY}
                      fill={segment.isBankrupt ? "#E8A0A0" : "#F5F0E8"}
                      fontSize={segment.label.length > 5 ? "14" : "16"}
                      fontWeight="700"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      transform={`rotate(${labelRotation}, ${labelX}, ${labelY})`}
                      className="font-sans tracking-wide"
                    >
                      {segment.isBankrupt ? "🐍" : segment.label}
                    </text>
                  </g>
                );
              })}
              <circle cx="200" cy="200" r="28" fill="#1C1B19" stroke="#C9A962" strokeWidth="2" />
              <circle cx="200" cy="200" r="8" fill="#C9A962" />
            </motion.svg>
          </motion.div>
        </motion.div>
      </div>

      <button
        type="button"
        onClick={handleSpin}
        disabled={disabled || showSpinning}
        className="min-h-14 min-w-44 cursor-pointer rounded-2xl border-2 border-gold bg-gold/20 px-12 py-4 text-base font-bold tracking-[0.15em] text-cream uppercase shadow-[0_4px_24px_rgba(201,169,98,0.25)] transition-all hover:scale-[1.03] hover:border-gold hover:bg-gold/30 hover:shadow-[0_6px_32px_rgba(201,169,98,0.35)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100 sm:min-h-16 sm:min-w-52 sm:text-lg"
      >
        {showSpinning ? "Spinning..." : "Spin"}
      </button>
    </div>
  );
}
