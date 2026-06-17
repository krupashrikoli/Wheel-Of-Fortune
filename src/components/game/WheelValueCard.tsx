"use client";

import { motion } from "framer-motion";

type WheelValueCardProps = {
  value: number;
  className?: string;
};

export function WheelValueCard({ value, className = "" }: WheelValueCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`glass-card rounded-2xl border-[3px] border-game-yellow/50 px-3 py-1.5 text-center sm:rounded-[24px] sm:px-4 sm:py-2 ${className}`}
    >
      <p className="text-sm font-extrabold tracking-[0.15em] text-game-orange uppercase sm:text-base">
        Wheel Value
      </p>
      <p className="font-display text-[clamp(1.5rem,3vh,2.25rem)] font-extrabold text-primary-blue">
        {value.toLocaleString()}
      </p>
    </motion.div>
  );
}
