"use client";

import { motion } from "framer-motion";

export function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative shrink-0 text-center"
    >
      <div className="inline-flex items-center gap-2 sm:gap-3">
        <motion.span
          animate={{ rotate: [0, 12, -12, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="text-2xl sm:text-3xl md:text-4xl"
          aria-hidden
        >
          🎡
        </motion.span>
        <h1
          className="font-display text-[clamp(1.5rem,4vh,2.75rem)] font-bold tracking-wide"
          style={{
            background: "linear-gradient(180deg, #FFF8DC 0%, #FFD54A 40%, #FF9D2E 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            filter: "drop-shadow(0 2px 0 rgba(255,120,0,0.4)) drop-shadow(0 4px 10px rgba(0,0,0,0.15))",
          }}
        >
          WHEEL OF FORTUNE
        </h1>
        <motion.span
          animate={{ rotate: [0, -12, 12, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="text-2xl sm:text-3xl md:text-4xl"
          aria-hidden
        >
          🎡
        </motion.span>
      </div>
    </motion.header>
  );
}
