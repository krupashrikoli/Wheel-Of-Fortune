"use client";

import { motion } from "framer-motion";
import type { TeamId, TeamScores as TeamScoresType } from "@/lib/types";

type TeamScoresProps = {
  scores: TeamScoresType;
  activeTeam: TeamId;
  turnEarnings: number;
  compact?: boolean;
};

function TeamCard({
  team,
  score,
  isActive,
  turnEarnings,
  compact,
}: {
  team: TeamId;
  score: number;
  isActive: boolean;
  turnEarnings: number;
  compact?: boolean;
}) {
  return (
    <motion.div
      layout
      transition={{ type: "spring", stiffness: 300, damping: 26 }}
      className={`podium-highlight relative overflow-hidden rounded-3xl border p-3 backdrop-blur-md sm:p-4 ${
        isActive
          ? "border-gold/40 bg-charcoal-light/90 ring-2 ring-gold-bright shadow-[0_0_30px_rgba(201,169,98,0.35)]"
          : "border-gold/20 bg-charcoal-light/60"
      } ${compact ? "p-2.5 sm:p-3" : ""}`}
    >
      <p className="text-xs font-bold tracking-[0.2em] text-gold/70 uppercase">
        Team {team}
      </p>
      <p
        className={`font-display font-bold tabular-nums text-gold ${
          compact ? "text-2xl sm:text-3xl" : "text-3xl sm:text-4xl"
        }`}
      >
        {score.toLocaleString()}
      </p>
      {isActive && turnEarnings > 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs font-semibold text-success"
        >
          +{turnEarnings.toLocaleString()} this turn
        </motion.p>
      )}
    </motion.div>
  );
}

export function TeamScores({
  scores,
  activeTeam,
  turnEarnings,
  compact,
}: TeamScoresProps) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-3">
      <TeamCard
        team="A"
        score={scores.A}
        isActive={activeTeam === "A"}
        turnEarnings={activeTeam === "A" ? turnEarnings : 0}
        compact={compact}
      />
      <TeamCard
        team="B"
        score={scores.B}
        isActive={activeTeam === "B"}
        turnEarnings={activeTeam === "B" ? turnEarnings : 0}
        compact={compact}
      />
    </div>
  );
}
