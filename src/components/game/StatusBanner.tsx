"use client";

import { motion } from "framer-motion";
import { Sparkles, Star } from "lucide-react";
import type { TeamId } from "@/lib/types";

type StatusBannerProps = {
  activeTeam: TeamId;
  action: string;
  isTurnPass?: boolean;
};

export function StatusBanner({ activeTeam, action, isTurnPass }: StatusBannerProps) {
  return (
    <motion.div
      key={`${activeTeam}-${action}-${isTurnPass}`}
      initial={{ scale: 0.98, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
      className="relative w-full shrink-0 overflow-hidden rounded-xl bg-gradient-to-r from-game-purple via-[#A56CFF] to-game-purple px-3.5 py-2 shadow-[0_4px_14px_rgba(139,92,255,0.3)] sm:px-4 sm:py-2.5"
    >
      <div className="shine-sweep pointer-events-none absolute inset-0 opacity-35" />
      <div className="relative flex items-center gap-2 text-white">
        {isTurnPass ? (
          <Sparkles className="h-6 w-6 shrink-0 sm:h-7 sm:w-7" />
        ) : (
          <Star className="h-6 w-6 shrink-0 fill-game-yellow text-game-yellow sm:h-7 sm:w-7" />
        )}
        <div className="min-w-0 leading-tight">
          <p className="text-base font-extrabold tracking-wide uppercase sm:text-lg">
            {isTurnPass ? "Chance Passed" : `Team ${activeTeam}'s Turn`}
          </p>
          <p className="font-display text-lg font-bold leading-snug sm:text-xl">{action}</p>
        </div>
      </div>
    </motion.div>
  );
}
