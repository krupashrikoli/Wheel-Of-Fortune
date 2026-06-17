"use client";

import { motion } from "framer-motion";

export function Mascot() {
  return (
    <motion.div
      className="pointer-events-none fixed right-2 bottom-2 z-20 hidden xl:block"
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    >
      <div className="flex items-center gap-2 rounded-full bg-white/95 px-3 py-2 shadow-lg">
        <span className="text-4xl leading-none drop-shadow-sm sm:text-5xl" role="img" aria-label="Friendly fox mascot">
          🦊
        </span>
        <p className="font-display text-base font-bold text-primary-blue sm:text-lg">
          You got this!
        </p>
      </div>
    </motion.div>
  );
}
