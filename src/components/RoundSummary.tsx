"use client";

import { motion } from "framer-motion";
import type { TeamId, TeamScores } from "@/lib/types";
import { Confetti } from "./Confetti";
import { FloatingEmojis } from "./FloatingEmojis";
import { WINNER_EMOJIS } from "@/lib/constants";

type RoundSummaryProps = {
  scores: TeamScores;
  winner: TeamId | "tie";
  onPlayAgain: () => void;
};

export function RoundSummary({ scores, winner, onPlayAgain }: RoundSummaryProps) {
  const winnerLabel = winner === "tie" ? "It's a Tie!" : `Team ${winner} Wins!`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-30 flex items-center justify-center bg-black/75 p-6 backdrop-blur-md"
    >
      <Confetti />
      <FloatingEmojis emojis={WINNER_EMOJIS} count={24} variant="success" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
        className="relative w-full max-w-lg rounded-[32px] border border-gold/30 bg-[#241F1B] p-10 text-center shadow-[0_24px_80px_rgba(0,0,0,0.6)]"
      >
        <motion.p
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="mb-4 text-5xl"
        >
          {winner === "tie" ? "🤝" : "👑"}
        </motion.p>

        <h2 className="font-display text-5xl font-bold tracking-wide text-transparent bg-gradient-to-b from-[#F7E3B2] to-gold bg-clip-text sm:text-7xl">
          {winnerLabel}
        </h2>

        <p className="mt-3 text-xs font-bold tracking-[0.25em] text-gold/70 uppercase">
          Round Complete
        </p>

        <div className="mt-8 grid grid-cols-2 gap-4">
          <div className="podium-highlight rounded-2xl border border-gold/20 p-4">
            <p className="text-xs font-bold tracking-[0.2em] text-gold/70 uppercase">Team A</p>
            <motion.p
              animate={winner === "A" ? { scale: [1, 1.08, 1] } : {}}
              transition={{ duration: 1.5, repeat: winner === "A" ? Infinity : 0 }}
              className={`font-display text-3xl font-bold tabular-nums ${
                winner === "A" ? "text-gold-bright" : "text-cream"
              }`}
            >
              {scores.A.toLocaleString()}
            </motion.p>
          </div>
          <div className="podium-highlight rounded-2xl border border-gold/20 p-4">
            <p className="text-xs font-bold tracking-[0.2em] text-gold/70 uppercase">Team B</p>
            <motion.p
              animate={winner === "B" ? { scale: [1, 1.08, 1] } : {}}
              transition={{ duration: 1.5, repeat: winner === "B" ? Infinity : 0 }}
              className={`font-display text-3xl font-bold tabular-nums ${
                winner === "B" ? "text-gold-bright" : "text-cream"
              }`}
            >
              {scores.B.toLocaleString()}
            </motion.p>
          </div>
        </div>

        <button
          type="button"
          onClick={onPlayAgain}
          className="mt-8 rounded-full border border-gold/50 bg-gradient-to-b from-gold-bright to-gold px-10 py-3 text-sm font-bold tracking-[0.2em] text-charcoal uppercase transition-all hover:brightness-110"
        >
          Play Again
        </button>
      </motion.div>
    </motion.div>
  );
}
