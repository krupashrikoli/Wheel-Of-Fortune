"use client";

import { motion } from "framer-motion";

const CLOUDS = [
  { left: "8%", top: "12%", scale: 1, delay: 0 },
  { left: "55%", top: "8%", scale: 0.8, delay: 1 },
  { left: "78%", top: "18%", scale: 0.65, delay: 0.5 },
];

const CONFETTI = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: `${(i * 17) % 100}%`,
  delay: (i % 7) * 0.4,
  color: ["#FFD54A", "#FF5CA8", "#8B5CFF", "#64D948", "#FF9D2E"][i % 5],
}));

export function GameBackground() {
  return (
    <div className="game-sky-bg pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.35),transparent_55%)]" />

      {CLOUDS.map((cloud) => (
        <motion.div
          key={cloud.left}
          className="absolute h-16 w-32 rounded-full bg-white/70 blur-[1px] sm:h-20 sm:w-40"
          style={{ left: cloud.left, top: cloud.top, scale: cloud.scale }}
          animate={{ x: [0, 18, 0] }}
          transition={{ duration: 8 + cloud.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      <div className="absolute right-0 bottom-0 left-0 h-32 bg-gradient-to-t from-[#64D948]/40 to-transparent sm:h-40" />
      <div className="absolute right-0 bottom-0 left-0 h-20 rounded-t-[50%] bg-[#4CBF38]/50 sm:h-28" />

      {CONFETTI.map((piece) => (
        <motion.span
          key={piece.id}
          className="absolute h-2 w-2 rounded-full opacity-60"
          style={{ left: piece.left, top: `${10 + (piece.id % 5) * 12}%`, backgroundColor: piece.color }}
          animate={{ y: [0, 12, 0], opacity: [0.4, 0.9, 0.4] }}
          transition={{ duration: 3 + piece.delay, repeat: Infinity, delay: piece.delay }}
        />
      ))}
    </div>
  );
}
