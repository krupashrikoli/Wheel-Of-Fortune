"use client";

import { motion } from "framer-motion";
import type { TeamId, TeamScores } from "@/lib/types";
import { Confetti } from "@/components/Confetti";
import { FloatingEmojis } from "@/components/FloatingEmojis";
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
      className="fixed inset-0 z-30 flex items-center justify-center bg-primary-blue/50 p-6 backdrop-blur-md"
    >
      <Confetti />
      <FloatingEmojis emojis={WINNER_EMOJIS} count={24} variant="success" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="glass-card relative w-full max-w-lg rounded-[32px] border-4 border-white p-10 text-center"
      >
        <motion.p
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mb-4 text-6xl"
        >
          {winner === "tie" ? "🤝" : "🏆"}
        </motion.p>

        <h2 className="font-display text-5xl font-bold text-primary-blue sm:text-6xl">
          {winnerLabel}
        </h2>
        <p className="mt-2 text-base font-extrabold tracking-wider text-game-purple uppercase">
          Round Complete
        </p>

        <div className="mt-8 grid grid-cols-2 gap-4">
          {(["A", "B"] as const).map((team) => (
            <div
              key={team}
              className={`rounded-2xl border-2 p-4 ${
                winner === team ? "border-game-yellow bg-yellow-50" : "border-gray-100 bg-white"
              }`}
            >
              <p className="text-sm font-bold text-[#5a7a9a] uppercase">Team {team}</p>
              <p className="font-display text-3xl font-bold text-primary-blue">
                {scores[team].toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={onPlayAgain}
          className="mt-8 rounded-full bg-gradient-to-r from-game-green to-[#4CBF38] px-10 py-3 text-base font-extrabold tracking-wider text-white uppercase shadow-lg"
        >
          Play Again
        </button>
      </motion.div>
    </motion.div>
  );
}
