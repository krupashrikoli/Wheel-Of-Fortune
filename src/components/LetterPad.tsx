"use client";

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
};

export function LetterPad({
  guessedLetters,
  hasSpun,
  canBuyVowel,
  onGuessConsonant,
  onBuyVowel,
  disabled,
}: LetterPadProps) {
  const isDisabled = disabled || !hasSpun;

  return (
    <div className="space-y-2">
      <div>
        <p className="mb-1.5 text-center text-sm font-bold tracking-[0.1em] text-cream/50 uppercase">
          Consonants
        </p>
        <div className="flex flex-wrap justify-center gap-1.5">
          {CONSONANTS.map((letter) => {
            const used = guessedLetters.has(letter);
            return (
              <button
                key={letter}
                type="button"
                disabled={isDisabled || used}
                onClick={() => onGuessConsonant(letter)}
                className="flex h-9 w-9 items-center justify-center rounded-md border border-cream/10 bg-charcoal-light/60 text-base font-bold text-cream transition-all hover:border-gold/40 hover:text-gold disabled:cursor-not-allowed disabled:opacity-30 sm:h-10 sm:w-10 sm:text-lg"
              >
                {letter}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="mb-1.5 text-center text-sm font-bold tracking-[0.1em] text-cream/50 uppercase">
          Buy Vowel — 200 pts
          {!canBuyVowel && (
            <span className="ml-1 text-xs font-semibold text-cream/40 normal-case tracking-normal">
              (need &gt;200)
            </span>
          )}
        </p>
        <div className="flex flex-wrap justify-center gap-1.5">
          {VOWEL_LIST.map((letter) => {
            const used = guessedLetters.has(letter);
            return (
              <button
                key={letter}
                type="button"
                disabled={isDisabled || used || !canBuyVowel}
                onClick={() => onBuyVowel(letter)}
                className="flex h-9 w-9 items-center justify-center rounded-md border border-gold/30 bg-gold/10 text-base font-bold text-gold transition-all hover:border-gold/50 hover:bg-gold/20 disabled:cursor-not-allowed disabled:opacity-30 sm:h-10 sm:w-10 sm:text-lg"
              >
                {letter}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
