"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import { seededRandom } from "@/lib/random";

const COLORS = ["#C9A962", "#E8DFD0", "#8B7355", "#F5F0E8", "#D4AF37"];

export function Confetti({ count = 40 }: { count?: number }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const seed = i + 1;
        return {
          id: i,
          left: `${seededRandom(seed) * 100}%`,
          color: COLORS[i % COLORS.length],
          delay: seededRandom(seed + 0.1) * 0.8,
          duration: 2 + seededRandom(seed + 0.2) * 2,
          width: 4 + seededRandom(seed + 0.3) * 6,
          height: 8 + seededRandom(seed + 0.4) * 10,
          rotation: seededRandom(seed + 0.5) * 360,
          driftX: (seededRandom(seed + 0.6) - 0.5) * 200,
          spinEnd: seededRandom(seed + 0.7) * 180,
        };
      }),
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
            rotate: piece.rotation + 360 + piece.spinEnd,
            x: [0, piece.driftX],
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
