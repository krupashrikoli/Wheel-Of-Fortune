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
  const long = charCount > 28;
  const tight = charCount > 12;

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative mx-auto w-fit max-w-full min-h-0 overflow-hidden rounded-lg border-2 border-white/50 bg-gradient-to-b from-[#3B9EFF] to-[#2EA8FF] px-3 py-2 shadow-[0_3px_12px_rgba(0,0,0,0.1)] sm:rounded-xl sm:px-5 sm:py-3"
      style={{ perspective: 600 }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.18),transparent_50%)]" />

      <div
        className={`relative flex flex-wrap items-center justify-center leading-none ${
          long ? "gap-x-1 gap-y-1" : tight ? "gap-x-1.5 gap-y-1.5" : "gap-x-2.5 gap-y-2"
        }`}
      >
        {display.split("").map((char, index) => {
          if (char === " ") {
            return (
              <div
                key={`space-${index}`}
                className={`shrink-0 ${
                  long ? "h-14 w-3.5" : tight ? "h-16 w-4" : "h-20 w-5"
                }`}
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
                long ? "h-14 w-[3rem]" : tight ? "h-16 w-14" : "h-20 w-[4.25rem]"
              }`}
              style={{ transformStyle: "preserve-3d" }}
            >
              <motion.div
                key={revealed ? `revealed-${char}` : "hidden"}
                initial={{ rotateX: revealed ? -90 : 0, scale: revealed ? 0.88 : 1 }}
                animate={{ rotateX: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={`flex h-full w-full items-center justify-center rounded-xl border-2 font-display font-extrabold leading-none shadow-[0_2px_0_rgba(0,0,0,0.08)] ${
                  long ? "text-4xl sm:text-5xl" : tight ? "text-5xl sm:text-6xl" : "text-6xl sm:text-7xl"
                } ${
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
