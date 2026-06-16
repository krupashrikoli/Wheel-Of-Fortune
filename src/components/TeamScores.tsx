"use client";

import { motion } from "framer-motion";
import type { TeamId, TeamScores as TeamScoresType } from "@/lib/types";

type TeamScoresProps = {
  scores: TeamScoresType;
  activeTeam: TeamId;
  turnEarnings: number;
};

function TeamCard({
  team,
  score,
  isActive,
  turnEarnings,
}: {
  team: TeamId;
  score: number;
  isActive: boolean;
  turnEarnings: number;
}) {
  return (
    <motion.div
      layout
      animate={{
        scale: isActive ? 1.02 : 1,
        boxShadow: isActive
          ? "0 0 24px rgba(201, 169, 98, 0.2)"
          : "0 0 0 rgba(201, 169, 98, 0)",
      }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`rounded-xl border px-3 py-2 backdrop-blur-sm transition-colors ${
        isActive
          ? "border-gold/60 bg-charcoal-light/80"
          : "border-cream/10 bg-charcoal-light/40"
      }`}
    >
      <p className="text-xs font-bold tracking-[0.15em] text-cream/60 uppercase">
        Team {team}
      </p>
      <p className="font-display text-2xl font-bold text-gold sm:text-3xl">
        {score.toLocaleString()}
      </p>
      {isActive && turnEarnings > 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs font-semibold text-cream/70"
        >
          +{turnEarnings.toLocaleString()} this turn
        </motion.p>
      )}
    </motion.div>
  );
}

export function TeamScores({ scores, activeTeam, turnEarnings }: TeamScoresProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <TeamCard
        team="A"
        score={scores.A}
        isActive={activeTeam === "A"}
        turnEarnings={activeTeam === "A" ? turnEarnings : 0}
      />
      <TeamCard
        team="B"
        score={scores.B}
        isActive={activeTeam === "B"}
        turnEarnings={activeTeam === "B" ? turnEarnings : 0}
      />
    </div>
  );
}
