"use client";

import { motion } from "framer-motion";
import { VOWELS } from "@/lib/constants";

const CONSONANTS = "BCDFGHJKLMNPQRSTVWXYZ".split("");
const VOWEL_LIST = Array.from(VOWELS);

type LetterGridProps = {
  guessedLetters: Set<string>;
  hasSpun: boolean;
  canBuyVowel: boolean;
  onGuessConsonant: (letter: string) => void;
  onBuyVowel: (letter: string) => void;
  disabled?: boolean;
  failurePulse?: boolean;
  className?: string;
};

export function LetterGrid({
  guessedLetters,
  hasSpun,
  canBuyVowel,
  onGuessConsonant,
  onBuyVowel,
  disabled,
  failurePulse,
  className = "",
}: LetterGridProps) {
  const isDisabled = disabled || !hasSpun;

  return (
    <motion.div
      animate={failurePulse ? { x: [-5, 5, -5, 5, 0] } : { x: 0 }}
      transition={{ duration: 0.35 }}
      className={`glass-card flex shrink-0 flex-col justify-center gap-2.5 rounded-2xl p-2.5 sm:rounded-[24px] sm:p-4 ${className}`}
    >
      <div>
        <p className="mb-2 text-center text-xl font-extrabold tracking-wide text-[#1a2b4a] uppercase sm:text-2xl">
          Consonants
        </p>
        <div className="grid grid-cols-7 gap-1.5 sm:grid-cols-11 sm:gap-2">
          {CONSONANTS.map((letter) => {
            const used = guessedLetters.has(letter);
            return (
              <motion.button
                key={letter}
                type="button"
                disabled={isDisabled || used}
                whileHover={!used && !isDisabled ? { scale: 1.08, y: -2 } : {}}
                whileTap={!used && !isDisabled ? { scale: 0.92 } : {}}
                onClick={() => onGuessConsonant(letter)}
                className={`flex aspect-square w-full items-center justify-center rounded-lg text-xl font-black shadow-[0_3px_0_rgba(0,0,0,0.12)] sm:rounded-xl sm:text-2xl ${
                  used
                    ? "cursor-not-allowed bg-gray-100 text-gray-400 opacity-50"
                    : "bg-gradient-to-b from-[#B8E8FF] to-[#7ECFFF] text-black hover:shadow-[0_0_12px_rgba(46,168,255,0.45)] disabled:opacity-40"
                }`}
              >
                {letter}
              </motion.button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="mb-2 text-center text-xl font-extrabold tracking-wide text-[#1a2b4a] sm:text-2xl">
          Buy a Vowel — 200 Points
          {!canBuyVowel && (
            <span className="ml-1 text-base font-semibold text-[#6b7f96] normal-case sm:text-lg">
              (need &gt;200)
            </span>
          )}
        </p>
        <div className="flex justify-center gap-2">
          {VOWEL_LIST.map((letter) => {
            const used = guessedLetters.has(letter);
            return (
              <motion.button
                key={letter}
                type="button"
                disabled={isDisabled || used || !canBuyVowel}
                whileHover={!used && !isDisabled && canBuyVowel ? { scale: 1.1, y: -3 } : {}}
                whileTap={!used && !isDisabled && canBuyVowel ? { scale: 0.92 } : {}}
                onClick={() => onBuyVowel(letter)}
                className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl font-black shadow-[0_3px_0_rgba(0,0,0,0.12)] sm:h-16 sm:w-16 sm:text-3xl ${
                  used
                    ? "cursor-not-allowed bg-purple-100 text-gray-400 opacity-50"
                    : "bg-gradient-to-b from-[#DCC8FF] to-[#C4A8FF] text-black hover:shadow-[0_0_12px_rgba(139,92,255,0.45)] disabled:opacity-40"
                }`}
              >
                {letter}
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
