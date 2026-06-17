"use client";

import { motion } from "framer-motion";
import type { TeamId } from "@/lib/types";

type TurnBannerProps = {
  activeTeam: TeamId;
  action: string;
  isTurnPass?: boolean;
};

export function TurnBanner({ activeTeam, action, isTurnPass }: TurnBannerProps) {
  return (
    <motion.div
      key={`${activeTeam}-${action}`}
      initial={{ scale: 0.96, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className={`flex h-14 shrink-0 items-center justify-center rounded-2xl border px-4 sm:h-16 ${
        isTurnPass
          ? "border-gold/40 bg-gradient-to-r from-burgundy/40 via-maroon/30 to-burgundy/40"
          : "border-gold/30 bg-gradient-to-r from-charcoal-light via-[#3A312A] to-charcoal-light"
      }`}
    >
      <div className="text-center">
        <p className="text-xs font-bold tracking-[0.25em] text-gold/70 uppercase sm:text-sm">
          {isTurnPass ? "Chance passed" : `Team ${activeTeam}'s turn`}
        </p>
        <p className="font-display text-lg font-semibold text-cream sm:text-xl">
          {isTurnPass ? action : `🎯 ${action}`}
        </p>
      </div>
    </motion.div>
  );
}
