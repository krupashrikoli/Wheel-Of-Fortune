"use client";

import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";
import type { TeamId, TeamScores as TeamScoresType } from "@/lib/types";

type ScoreCardProps = {
  scores: TeamScoresType;
  activeTeam: TeamId;
  turnEarnings: number;
};

const TEAM_STYLES = {
  A: {
    accent: "from-[#2EA8FF] to-[#67D8FF]",
    ring: "ring-[#2EA8FF]",
    avatar: "🦊",
    bg: "bg-blue-50",
    label: "text-[#1a4a7a]",
  },
  B: {
    accent: "from-[#FF5CA8] to-[#FF9D2E]",
    ring: "ring-[#FF5CA8]",
    avatar: "🐶",
    bg: "bg-pink-50",
    label: "text-[#7a2a4a]",
  },
};

function AnimatedScore({ value }: { value: number }) {
  const spring = useSpring(value, { stiffness: 120, damping: 20 });
  const display = useTransform(spring, (v) => Math.round(v).toLocaleString());

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return <motion.span>{display}</motion.span>;
}

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
  const style = TEAM_STYLES[team];

  return (
    <motion.div
      layout
      animate={{ y: isActive ? -3 : 0, scale: isActive ? 1.02 : 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className={`glass-card rounded-2xl p-2 sm:rounded-[24px] sm:p-2.5 ${style.bg} ${
        isActive ? `ring-[3px] ${style.ring} shadow-[0_0_20px_rgba(46,168,255,0.3)]` : ""
      }`}
    >
      <div className="flex items-center gap-1.5">
        <span className="text-xl sm:text-2xl">{style.avatar}</span>
        <p className={`text-sm font-extrabold tracking-wider uppercase sm:text-base ${style.label}`}>
          Team {team}
        </p>
      </div>
      <p
        className={`mt-0.5 font-display text-[clamp(1.25rem,2.8vh,1.75rem)] font-bold tabular-nums bg-gradient-to-r ${style.accent} bg-clip-text text-transparent`}
      >
        <AnimatedScore value={score} />
      </p>
      {isActive && turnEarnings > 0 && (
        <p className="text-xs font-bold text-game-green sm:text-sm">+{turnEarnings.toLocaleString()} this turn</p>
      )}
    </motion.div>
  );
}

export function ScoreCard({ scores, activeTeam, turnEarnings }: ScoreCardProps) {
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
