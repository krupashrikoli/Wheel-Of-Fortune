"use client";

import { motion } from "framer-motion";
import { normalizeMovieTitle } from "@/lib/puzzle";

type PuzzleBoardProps = {
  title: string;
  guessedLetters: Set<string>;
};

export function PuzzleBoard({ title, guessedLetters }: PuzzleBoardProps) {
  const display = normalizeMovieTitle(title);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-wrap items-end justify-center gap-x-1.5 gap-y-2"
    >
      {display.split("").map((char, index) => {
        if (char === " ") {
          return (
            <div
              key={`space-${index}`}
              className="h-10 w-5 shrink-0 sm:h-12 sm:w-6"
              aria-hidden
            />
          );
        }

        const isLetter = /[A-Z]/.test(char);
        const revealed = isLetter ? guessedLetters.has(char) : true;

        return (
          <motion.div
            key={`${index}-${char}`}
            layout
            className="flex h-10 w-9 shrink-0 items-center justify-center border-b-[3px] border-gold/40 sm:h-12 sm:w-10"
          >
            <motion.span
              key={revealed ? char : "hidden"}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="font-display text-2xl font-bold tracking-wide text-cream sm:text-3xl"
            >
              {revealed ? char : ""}
            </motion.span>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
