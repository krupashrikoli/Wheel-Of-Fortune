"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import { seededRandom } from "@/lib/random";

type FloatingEmojisProps = {
  emojis: string[];
  count?: number;
  variant?: "success" | "failure";
};

export function FloatingEmojis({
  emojis,
  count = 18,
  variant = "success",
}: FloatingEmojisProps) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const seed = i + variant.length * 17;
        const isFailure = variant === "failure";
        return {
          id: i,
          emoji: emojis[i % emojis.length],
          left: `${8 + seededRandom(seed) * 84}%`,
          delay: seededRandom(seed + 0.1) * 0.6,
          duration: isFailure
            ? 1.2 + seededRandom(seed + 0.2) * 0.6
            : 2.4 + seededRandom(seed + 0.2) * 1.4,
          size: isFailure
            ? 1.2 + seededRandom(seed + 0.3) * 0.8
            : 1.4 + seededRandom(seed + 0.3) * 1.2,
          driftX: (seededRandom(seed + 0.4) - 0.5) * (isFailure ? 30 : 120),
          driftY: isFailure ? -20 : -280 - seededRandom(seed + 0.5) * 180,
          rotateEnd: (seededRandom(seed + 0.6) - 0.5) * (isFailure ? 20 : 90),
        };
      }),
    [count, emojis, variant]
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className="absolute select-none"
          style={{
            left: particle.left,
            fontSize: `${particle.size}rem`,
            bottom: variant === "failure" ? "45%" : 0,
          }}
          initial={{ opacity: 0, scale: 0.4 }}
          animate={
            variant === "failure"
              ? {
                  opacity: [0, 1, 1, 0],
                  x: [0, particle.driftX],
                  y: [0, particle.driftY],
                  rotate: [0, particle.rotateEnd],
                  scale: [0.4, 1, 0.9],
                }
              : {
                  opacity: [0, 1, 1, 0],
                  y: [-20, particle.driftY],
                  x: [0, particle.driftX],
                  rotate: [0, particle.rotateEnd],
                  scale: [0.4, 1, 0.8],
                }
          }
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            ease: variant === "failure" ? "easeInOut" : "easeOut",
          }}
        >
          {particle.emoji}
        </motion.span>
      ))}
    </div>
  );
}
