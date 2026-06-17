"use client";

import { motion } from "framer-motion";

export function Mascot() {
  return (
    <motion.div
      className="pointer-events-none fixed right-2 bottom-2 z-20 hidden xl:block"
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    >
      <div className="relative">
        <div className="absolute -top-2 -right-2 rounded-full bg-white px-2 py-0.5 text-sm font-bold text-primary-blue shadow-md">
          You got this!
        </div>
        <span className="text-5xl drop-shadow-lg" role="img" aria-label="Friendly fox mascot">
          🦊
        </span>
      </div>
    </motion.div>
  );
}
