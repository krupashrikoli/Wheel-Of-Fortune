"use client";

import { motion } from "framer-motion";
import { VOWELS } from "@/lib/constants";

const CONSONANTS = "BCDFGHJKLMNPQRSTVWXYZ".split("");
const VOWEL_LIST = Array.from(VOWELS);

type LetterPadProps = {
  guessedLetters: Set<string>;
  hasSpun: boolean;
  canBuyVowel: boolean;
  onGuessConsonant: (letter: string) => void;
  onBuyVowel: (letter: string) => void;
  disabled?: boolean;
  failurePulse?: boolean;
};

export function LetterPad({
  guessedLetters,
  hasSpun,
  canBuyVowel,
  onGuessConsonant,
  onBuyVowel,
  disabled,
  failurePulse,
}: LetterPadProps) {
  const isDisabled = disabled || !hasSpun;

  return (
    <motion.div
      animate={failurePulse ? { x: [-4, 4, -4, 4, 0] } : { x: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-3 rounded-2xl border border-gold/15 bg-black/20 p-3 sm:p-4"
    >
      <div>
        <p className="mb-2 text-center text-xs font-bold tracking-[0.25em] text-gold/70 uppercase">
          Consonants
        </p>
        <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
          {CONSONANTS.map((letter) => {
            const used = guessedLetters.has(letter);
            return (
              <button
                key={letter}
                type="button"
                disabled={isDisabled || used}
                onClick={() => onGuessConsonant(letter)}
                className={`flex min-h-10 min-w-10 items-center justify-center rounded-lg border text-base font-bold transition-all sm:min-h-12 sm:min-w-12 sm:text-lg ${
                  used
                    ? "cursor-not-allowed border-cream/5 bg-charcoal-light/30 text-cream/30 grayscale opacity-30"
                    : "border-gold/20 bg-[#312B24] text-cream hover:-translate-y-1 hover:border-gold/40 hover:bg-[#3B342C] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-40"
                }`}
              >
                {letter}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="mb-2 text-center text-xs font-bold tracking-[0.25em] text-gold/70 uppercase">
          Buy Vowel — 200 pts
          {!canBuyVowel && (
            <span className="ml-1 text-[10px] font-semibold text-cream/40 normal-case tracking-normal">
              (need &gt;200)
            </span>
          )}
        </p>
        <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
          {VOWEL_LIST.map((letter) => {
            const used = guessedLetters.has(letter);
            return (
              <button
                key={letter}
                type="button"
                disabled={isDisabled || used || !canBuyVowel}
                onClick={() => onBuyVowel(letter)}
                className={`flex min-h-10 min-w-10 items-center justify-center rounded-lg border text-base font-bold transition-all sm:min-h-12 sm:min-w-12 sm:text-lg ${
                  used
                    ? "cursor-not-allowed border-gold/10 bg-gold/5 text-gold/30 grayscale opacity-30"
                    : "border-gold/30 bg-gold/15 text-gold-bright hover:-translate-y-1 hover:border-gold/50 hover:bg-gold/25 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-40"
                }`}
              >
                {letter}
              </button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
