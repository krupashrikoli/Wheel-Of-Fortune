"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

const COLORS = ["#C9A962", "#E8DFD0", "#8B7355", "#F5F0E8", "#D4AF37"];

export function Confetti({ count = 40 }: { count?: number }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        color: COLORS[i % COLORS.length],
        delay: Math.random() * 0.8,
        duration: 2 + Math.random() * 2,
        width: 4 + Math.random() * 6,
        height: 8 + Math.random() * 10,
        rotation: Math.random() * 360,
      })),
    [count]
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
      {pieces.map((piece) => (
        <motion.div
          key={piece.id}
          className="absolute top-0 rounded-sm"
          style={{
            left: piece.left,
            width: piece.width,
            height: piece.height,
            backgroundColor: piece.color,
          }}
          initial={{ opacity: 0, y: -20, rotate: piece.rotation }}
          animate={{
            opacity: [0, 1, 1, 0],
            y: ["0vh", "105vh"],
            rotate: piece.rotation + 360 + Math.random() * 180,
            x: [0, (Math.random() - 0.5) * 200],
          }}
          transition={{
            duration: piece.duration,
            delay: piece.delay,
            ease: "easeIn",
          }}
        />
      ))}
    </div>
  );
}
