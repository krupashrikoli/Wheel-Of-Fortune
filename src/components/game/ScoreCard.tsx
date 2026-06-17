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
    glow: "rgba(46,168,255,0.55)",
    glowSoft: "rgba(103,216,255,0.35)",
    avatar: "🦊",
    bg: "bg-blue-50",
    label: "text-[#1a4a7a]",
  },
  B: {
    accent: "from-[#FF5CA8] to-[#FF9D2E]",
    ring: "ring-[#FF5CA8]",
    glow: "rgba(255,92,168,0.55)",
    glowSoft: "rgba(255,157,46,0.35)",
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
      animate={
        isActive
          ? {
              scale: 1.04,
              boxShadow: [
                `0 0 12px ${style.glowSoft}, 0 0 24px ${style.glow}`,
                `0 0 18px ${style.glowSoft}, 0 0 32px ${style.glow}`,
                `0 0 12px ${style.glowSoft}, 0 0 24px ${style.glow}`,
              ],
            }
          : { scale: 1, boxShadow: "0 0 0px transparent" }
      }
      transition={
        isActive
          ? { scale: { type: "spring", stiffness: 300, damping: 22 }, boxShadow: { duration: 1.6, repeat: Infinity, ease: "easeInOut" } }
          : { type: "spring", stiffness: 300, damping: 22 }
      }
      className={`glass-card min-w-[9.5rem] rounded-xl px-3 py-2 sm:min-w-[11rem] sm:rounded-2xl sm:px-3.5 sm:py-2.5 ${style.bg} ${
        isActive ? `ring-[3px] ${style.ring}` : "opacity-75"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-1">
          <span className="text-2xl leading-none sm:text-3xl">{style.avatar}</span>
          <p className={`truncate text-base font-extrabold tracking-wide uppercase sm:text-lg ${style.label}`}>
            Team {team}
          </p>
        </div>
        <p
          className={`shrink-0 font-display text-2xl font-bold tabular-nums sm:text-3xl bg-gradient-to-r ${style.accent} bg-clip-text text-transparent`}
        >
          <AnimatedScore value={score} />
        </p>
      </div>
      {isActive && turnEarnings > 0 && (
        <p className="mt-0.5 text-right text-sm font-bold text-game-green sm:text-base">
          +{turnEarnings.toLocaleString()}
        </p>
      )}
    </motion.div>
  );
}

export function ScoreCard({ scores, activeTeam, turnEarnings }: ScoreCardProps) {
  return (
    <div className="grid w-fit max-w-full grid-cols-2 gap-1 self-start justify-self-end sm:gap-1.5">
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
