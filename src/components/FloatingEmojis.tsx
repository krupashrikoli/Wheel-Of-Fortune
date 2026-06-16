"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

type FloatingEmojisProps = {
  emojis: string[];
  count?: number;
};

export function FloatingEmojis({ emojis, count = 18 }: FloatingEmojisProps) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        emoji: emojis[i % emojis.length],
        left: `${8 + Math.random() * 84}%`,
        delay: Math.random() * 0.6,
        duration: 2.4 + Math.random() * 1.4,
        size: 1.4 + Math.random() * 1.2,
      })),
    [count, emojis]
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className="absolute bottom-0 select-none"
          style={{ left: particle.left, fontSize: `${particle.size}rem` }}
          initial={{ opacity: 0, y: 0, scale: 0.4 }}
          animate={{
            opacity: [0, 1, 1, 0],
            y: [-20, -280 - Math.random() * 180],
            x: [0, (Math.random() - 0.5) * 120],
            rotate: [0, (Math.random() - 0.5) * 90],
            scale: [0.4, 1, 0.8],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            ease: "easeOut",
          }}
        >
          {particle.emoji}
        </motion.span>
      ))}
    </div>
  );
}
