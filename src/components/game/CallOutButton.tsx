"use client";

import { motion } from "framer-motion";

type CallOutButtonProps = {
  onClick: () => void;
  disabled?: boolean;
};

export function CallOutButton({ onClick, disabled }: CallOutButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.03 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      className="relative w-full shrink-0 overflow-hidden rounded-full bg-gradient-to-r from-game-pink to-[#FF3D8E] px-4 py-2.5 text-white shadow-[0_8px_24px_rgba(255,92,168,0.4)] disabled:opacity-40 sm:py-3"
    >
      <div className="shine-sweep pointer-events-none absolute inset-0 opacity-30" />
      <span className="relative block text-base font-extrabold tracking-[0.12em] uppercase sm:text-lg">
        Call Out Answer
      </span>
      <span className="relative mt-0.5 block text-sm font-bold opacity-95 sm:text-base">
        +50,000 / −50,000
      </span>
    </motion.button>
  );
}
