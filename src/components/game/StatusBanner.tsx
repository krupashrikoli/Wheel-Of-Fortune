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
      initial={{ scale: 0.96, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
      className="relative shrink-0 overflow-hidden rounded-full bg-gradient-to-r from-game-purple via-[#A56CFF] to-game-purple px-4 py-2 shadow-[0_8px_24px_rgba(139,92,255,0.35)] sm:px-6 sm:py-2.5"
    >
      <div className="shine-sweep pointer-events-none absolute inset-0 opacity-40" />
      <div className="relative flex items-center justify-center gap-2 text-center text-white">
        {isTurnPass ? (
          <Sparkles className="h-5 w-5 shrink-0 sm:h-6 sm:w-6" />
        ) : (
          <Star className="h-5 w-5 shrink-0 fill-game-yellow text-game-yellow sm:h-6 sm:w-6" />
        )}
        <div>
          <p className="text-sm font-extrabold tracking-[0.15em] uppercase sm:text-base">
            {isTurnPass ? "Chance Passed" : `Team ${activeTeam}'s Turn`}
          </p>
          <p className="font-display text-base font-bold sm:text-lg">{action}</p>
        </div>
        {isTurnPass ? (
          <Sparkles className="h-5 w-5 shrink-0 sm:h-6 sm:w-6" />
        ) : (
          <Star className="h-5 w-5 shrink-0 fill-game-yellow text-game-yellow sm:h-6 sm:w-6" />
        )}
      </div>
    </motion.div>
  );
}
