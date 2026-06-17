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
      className="rounded-[32px] border border-gold/25 bg-[#211E1A] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.4)] sm:p-8"
      style={{ perspective: 800 }}
    >
      <div className="flex flex-wrap items-center justify-center gap-x-1.5 gap-y-2 sm:gap-x-2 sm:gap-y-3">
        {display.split("").map((char, index) => {
          if (char === " ") {
            return (
              <div
                key={`space-${index}`}
                className="h-14 w-4 shrink-0 sm:h-16 sm:w-6"
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
              className="flex h-14 w-12 shrink-0 items-center justify-center sm:h-16 sm:w-14"
              style={{ transformStyle: "preserve-3d" }}
            >
              <motion.div
                key={revealed ? `revealed-${char}` : "hidden"}
                initial={{ rotateX: revealed ? -90 : 0, opacity: revealed ? 0 : 1 }}
                animate={{ rotateX: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 220, damping: 18 }}
                className={`flex h-full w-full items-center justify-center rounded-xl border font-display text-2xl font-bold sm:text-3xl ${
                  revealed
                    ? "border-gold-bright/50 bg-gradient-to-b from-gold-bright to-gold text-charcoal shadow-[0_4px_12px_rgba(201,169,98,0.3)]"
                    : "border-gold/15 bg-[#2F2B27] text-transparent"
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
