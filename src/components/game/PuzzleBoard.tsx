"use client";

import { motion } from "framer-motion";
import { normalizeMovieTitle } from "@/lib/puzzle";

type PuzzleBoardProps = {
  title: string;
  guessedLetters: Set<string>;
};

export function PuzzleBoard({ title, guessedLetters }: PuzzleBoardProps) {
  const display = normalizeMovieTitle(title);
  const charCount = display.length;
  const tight = charCount > 10;

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative mx-auto w-fit max-w-full min-h-0 overflow-hidden rounded-lg border border-white/50 bg-gradient-to-b from-[#3B9EFF] to-[#2EA8FF] px-1.5 py-0.5 shadow-[0_3px_12px_rgba(0,0,0,0.1)] sm:px-2 sm:py-1"
      style={{ perspective: 600 }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.18),transparent_50%)]" />

      <div
        className={`relative flex flex-wrap items-center justify-center leading-none ${
          tight ? "gap-x-0.5 gap-y-0.5" : "gap-x-1 gap-y-0.5"
        }`}
      >
        {display.split("").map((char, index) => {
          if (char === " ") {
            return (
              <div
                key={`space-${index}`}
                className={`shrink-0 ${tight ? "h-6 w-1.5" : "h-7 w-2"}`}
                aria-hidden
              />
            );
          }

          const isLetter = /[A-Z]/.test(char);
          const revealed = isLetter ? guessedLetters.has(char) : true;

          return (
            <motion.div
              key={`${index}-${char}`}
              className={`flex shrink-0 items-center justify-center ${
                tight ? "h-6 w-5" : "h-7 w-6"
              }`}
              style={{ transformStyle: "preserve-3d" }}
            >
              <motion.div
                key={revealed ? `revealed-${char}` : "hidden"}
                initial={{ rotateX: revealed ? -90 : 0, scale: revealed ? 0.88 : 1 }}
                animate={{ rotateX: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={`flex h-full w-full items-center justify-center rounded-md border font-display text-sm font-extrabold leading-none shadow-[0_1px_0_rgba(0,0,0,0.08)] sm:text-base ${
                  revealed
                    ? "border-game-green/40 bg-gradient-to-b from-white to-green-50 text-game-green"
                    : "border-white/70 bg-white text-transparent"
                }`}
              >
                {revealed ? char : ""}
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
