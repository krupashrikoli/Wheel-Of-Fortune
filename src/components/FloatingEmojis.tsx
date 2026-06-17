"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

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
      Array.from({ length: count }, (_, i) => ({
        id: i,
        emoji: emojis[i % emojis.length],
        left: `${8 + Math.random() * 84}%`,
        delay: Math.random() * 0.6,
        duration: variant === "failure" ? 1.2 + Math.random() * 0.6 : 2.4 + Math.random() * 1.4,
        size: variant === "failure" ? 1.2 + Math.random() * 0.8 : 1.4 + Math.random() * 1.2,
      })),
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
                  x: [0, (Math.random() - 0.5) * 30],
                  y: [0, -20],
                  rotate: [0, (Math.random() - 0.5) * 20],
                  scale: [0.4, 1, 0.9],
                }
              : {
                  opacity: [0, 1, 1, 0],
                  y: [-20, -280 - Math.random() * 180],
                  x: [0, (Math.random() - 0.5) * 120],
                  rotate: [0, (Math.random() - 0.5) * 90],
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
