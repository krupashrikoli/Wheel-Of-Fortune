"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useGameState } from "@/hooks/useGameState";
import { FAILURE_EMOJIS, PUZZLES, SUCCESS_EMOJIS } from "@/lib/constants";
import type { PuzzleItem } from "@/lib/types";
import { playHappyChime, playRoundWin, playWrongHorn, stopRoundWin } from "@/lib/audio";
import { Wheel } from "./Wheel";
import { PuzzleBoard } from "./PuzzleBoard";
import { TeamScores } from "./TeamScores";
import { LetterPad } from "./LetterPad";
import { CallOutModal } from "./CallOutModal";
import { RoundSummary } from "./RoundSummary";
import { FloatingEmojis } from "./FloatingEmojis";

type GameProps = {
  puzzles?: readonly PuzzleItem[];
};

export function Game({ puzzles = PUZZLES }: GameProps) {
  const game = useGameState(puzzles);
  const [spinTarget, setSpinTarget] = useState<number | null>(null);

  useEffect(() => {
    game.initializeRound(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (game.celebration === "success") playHappyChime();
    if (game.celebration === "failure") playWrongHorn();
    if (game.celebration === "winner") playRoundWin();
  }, [game.celebration]);

  const handleSpinStart = (): number | null => {
    const index = game.startSpin();
    if (index !== null) setSpinTarget(index);
    return index;
  };

  const handleSpinComplete = (index: number) => {
    game.handleSpinComplete(index);
    setSpinTarget(null);
  };

  const handleCallOutSubmit = (guess: string) => {
    game.submitCallOut(guess);
  };

  if (!game.currentMovie) {
    return (
      <div className="flex h-screen items-center justify-center">
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-sm tracking-[0.3em] text-cream/40 uppercase"
        >
          Preparing the stage...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative flex h-screen flex-col overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(201,169,98,0.08)_0%,_transparent_60%)]" />

      <AnimatePresence>
        {game.celebration === "success" && (
          <FloatingEmojis emojis={SUCCESS_EMOJIS} />
        )}
        {game.celebration === "failure" && (
          <FloatingEmojis emojis={FAILURE_EMOJIS} count={12} />
        )}
      </AnimatePresence>

      <div className="relative mx-auto flex h-full w-full max-w-7xl flex-col px-3 py-3 sm:px-5 sm:py-4">
        <header className="mb-2 flex shrink-0 items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold tracking-[0.25em] text-gold/70 uppercase">
              Category: {game.currentCategory}
            </p>
            <h1 className="font-display text-3xl font-bold text-cream sm:text-4xl">
              Wheel of Fortune
            </h1>
            <p className="text-sm font-semibold text-cream/50">
              Puzzle {game.puzzleIndex + 1} of {game.puzzlesPerRound}
            </p>
          </div>
          <div className="w-full max-w-md">
            <TeamScores
              scores={game.teamScores}
              activeTeam={game.activeTeam}
              turnEarnings={game.turnEarnings}
            />
          </div>
        </header>

        <div className="mb-2 flex shrink-0 items-center justify-center gap-3">
          <button
            type="button"
            onClick={game.goToPreviousPuzzle}
            disabled={!game.canGoBack}
            className="rounded-xl border border-cream/10 px-5 py-2 text-sm font-bold tracking-[0.1em] text-cream/80 uppercase transition-all hover:border-gold/40 hover:text-gold disabled:cursor-not-allowed disabled:opacity-40"
          >
            Back
          </button>
          <button
            type="button"
            onClick={game.goToNextPuzzle}
            disabled={!game.canGoNext}
            className="rounded-xl border border-gold/30 bg-gold/10 px-5 py-2 text-sm font-bold tracking-[0.1em] text-gold uppercase transition-all hover:bg-gold/20 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>

        <motion.p
          key={game.message}
          initial={{ opacity: 0, y: game.message.startsWith("Chance passed") ? 8 : 0 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-2 shrink-0 text-center font-semibold sm:text-base ${
            game.message.startsWith("Chance passed")
              ? "rounded-xl border border-gold/30 bg-gold/10 px-4 py-2 text-base font-bold tracking-wide text-gold sm:text-lg"
              : "text-sm text-cream/70"
          }`}
        >
          {game.message}
        </motion.p>

        <div className="mb-2 shrink-0 rounded-2xl border border-cream/5 bg-charcoal-light/30 px-2 py-3 sm:px-4">
          <PuzzleBoard
            title={game.currentMovie}
            guessedLetters={game.guessedLetters}
          />
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-1 items-center gap-3 md:grid-cols-2 md:gap-6">
          <Wheel
            segments={game.wheelSegments}
            layoutKey={game.wheelLayoutKey}
            isSpinning={game.isSpinning}
            targetSegmentIndex={spinTarget}
            onSpinStart={handleSpinStart}
            onSpinComplete={handleSpinComplete}
            disabled={game.hasSpun || game.phase !== "playing"}
          />

          <div className="flex min-h-0 flex-col justify-center gap-2 overflow-hidden">
            {game.wheelValue !== null && !game.isSpinning && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-xl border border-gold/20 bg-gold/5 py-2 text-center"
              >
                <p className="text-xs font-bold tracking-[0.15em] text-cream/50 uppercase">
                  Wheel Value
                </p>
                <p className="font-display text-3xl font-bold text-gold sm:text-4xl">
                  {game.wheelValue.toLocaleString()}
                </p>
              </motion.div>
            )}

            <LetterPad
              guessedLetters={game.guessedLetters}
              hasSpun={game.hasSpun}
              canBuyVowel={game.canBuyVowel}
              onGuessConsonant={game.guessConsonant}
              onBuyVowel={game.buyVowel}
              disabled={game.isSpinning || game.phase !== "playing"}
            />

            <button
              type="button"
              onClick={() => game.setShowCallOut(true)}
              disabled={game.phase !== "playing"}
              className="shrink-0 rounded-xl border border-cream/10 py-3 text-sm font-bold tracking-[0.1em] text-cream/80 uppercase transition-all hover:border-gold/40 hover:text-gold disabled:opacity-40"
            >
              Call Out Answer
            </button>
          </div>
        </div>
      </div>

      <CallOutModal
        isOpen={game.showCallOut}
        onClose={() => game.setShowCallOut(false)}
        onSubmit={handleCallOutSubmit}
      />

      {game.phase === "round-end" && game.winner && (
        <RoundSummary
          scores={game.teamScores}
          winner={game.winner}
          onPlayAgain={() => {
            stopRoundWin();
            game.initializeRound(true);
          }}
        />
      )}
    </div>
  );
}
