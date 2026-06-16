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
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-30 flex items-center justify-center bg-charcoal/80 p-6 backdrop-blur-md"
    >
      <Confetti />
      <FloatingEmojis emojis={WINNER_EMOJIS} count={24} />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
        className="relative w-full max-w-lg rounded-3xl border border-gold/30 bg-charcoal-light/95 p-10 text-center shadow-[0_24px_80px_rgba(0,0,0,0.5)]"
      >
        <motion.p
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="mb-2 text-4xl"
        >
          {winner === "tie" ? "🤝" : "👑"}
        </motion.p>

        <h2 className="font-display text-3xl text-cream sm:text-4xl">
          {winner === "tie" ? "It's a Tie!" : `Team ${winner} Wins!`}
        </h2>

        <p className="mt-3 text-sm tracking-wider text-cream/50 uppercase">
          Round Complete
        </p>

        <div className="mt-8 grid grid-cols-2 gap-4">
          <div className="rounded-xl border border-cream/10 p-4">
            <p className="text-xs text-cream/40 uppercase">Team A</p>
            <motion.p
              animate={winner === "A" ? { scale: [1, 1.08, 1] } : {}}
              transition={{ duration: 1.5, repeat: winner === "A" ? Infinity : 0 }}
              className={`font-display text-2xl ${winner === "A" ? "text-gold" : "text-cream"}`}
            >
              {scores.A.toLocaleString()}
            </motion.p>
          </div>
          <div className="rounded-xl border border-cream/10 p-4">
            <p className="text-xs text-cream/40 uppercase">Team B</p>
            <motion.p
              animate={winner === "B" ? { scale: [1, 1.08, 1] } : {}}
              transition={{ duration: 1.5, repeat: winner === "B" ? Infinity : 0 }}
              className={`font-display text-2xl ${winner === "B" ? "text-gold" : "text-cream"}`}
            >
              {scores.B.toLocaleString()}
            </motion.p>
          </div>
        </div>

        <button
          type="button"
          onClick={onPlayAgain}
          className="mt-8 rounded-full border border-gold/50 bg-gold/10 px-10 py-3 text-sm tracking-[0.2em] text-gold uppercase transition-all hover:bg-gold/20"
        >
          Play Again
        </button>
      </motion.div>
    </motion.div>
  );
}
