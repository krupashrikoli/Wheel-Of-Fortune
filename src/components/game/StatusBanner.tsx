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
      className="relative w-full shrink-0 overflow-hidden rounded-xl bg-gradient-to-r from-game-purple via-[#A56CFF] to-game-purple px-2.5 py-1 shadow-[0_4px_14px_rgba(139,92,255,0.3)] sm:px-3 sm:py-1.5"
    >
      <div className="shine-sweep pointer-events-none absolute inset-0 opacity-35" />
      <div className="relative flex items-center gap-1.5 text-white">
        {isTurnPass ? (
          <Sparkles className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
        ) : (
          <Star className="h-3.5 w-3.5 shrink-0 fill-game-yellow text-game-yellow sm:h-4 sm:w-4" />
        )}
        <div className="min-w-0 leading-tight">
          <p className="text-[10px] font-extrabold tracking-wide uppercase sm:text-xs">
            {isTurnPass ? "Chance Passed" : `Team ${activeTeam}'s Turn`}
          </p>
          <p className="font-display text-xs font-bold leading-snug sm:text-sm">{action}</p>
        </div>
      </div>
    </motion.div>
  );
}
