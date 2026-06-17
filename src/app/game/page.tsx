"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useGameState } from "@/hooks/useGameState";
import { FAILURE_EMOJIS, PUZZLES, SUCCESS_EMOJIS } from "@/lib/constants";
import type { PuzzleItem } from "@/lib/types";
import { playHappyChime, playRoundWin, playWrongHorn, stopRoundWin } from "@/lib/audio";
import { FloatingEmojis } from "@/components/FloatingEmojis";
import { GameBackground } from "@/components/game/GameBackground";
import { Header } from "@/components/game/Header";
import { CategoryCard } from "@/components/game/CategoryCard";
import { ScoreCard } from "@/components/game/ScoreCard";
import { StatusBanner } from "@/components/game/StatusBanner";
import { PuzzleBoard } from "@/components/game/PuzzleBoard";
import { Wheel } from "@/components/game/Wheel";
import { LetterGrid } from "@/components/game/LetterGrid";
import { WheelValueCard } from "@/components/game/WheelValueCard";
import { CallOutButton } from "@/components/game/CallOutButton";
import { CallOutModal } from "@/components/game/CallOutModal";
import { RoundSummary } from "@/components/game/RoundSummary";
import { Mascot } from "@/components/game/Mascot";

type GamePageProps = {
  puzzles?: readonly PuzzleItem[];
};

function getTurnAction(
  hasSpun: boolean,
  isSpinning: boolean,
  wheelValue: number | null
): string {
  if (isSpinning) return "The wheel is turning…";
  if (!hasSpun) return "Spin the Wheel!";
  if (wheelValue !== null) return "Guess a letter or buy a vowel";
  return "Spin the Wheel!";
}

export default function GamePage({ puzzles = PUZZLES }: GamePageProps) {
  const game = useGameState(puzzles);
  const [spinTarget, setSpinTarget] = useState<number | null>(null);

  const isTurnPass = game.message.startsWith("Chance passed");
  const turnAction = useMemo(() => {
    if (isTurnPass) {
      return game.message.replace(/^Chance passed to Team [AB]! /, "");
    }
    if (game.message.startsWith("Landed on")) {
      const landed = game.message.match(/^Landed on ([^.]+)\./)?.[1];
      if (landed) return `Landed on ${landed} — guess a letter`;
    }
    return getTurnAction(game.hasSpun, game.isSpinning, game.wheelValue);
  }, [game.hasSpun, game.isSpinning, game.message, game.wheelValue, isTurnPass]);

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

  if (!game.currentMovie) {
    return (
      <div className="game-sky-bg relative flex h-screen items-center justify-center overflow-hidden">
        <GameBackground />
        <motion.p
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="relative font-display text-xl font-bold text-white"
        >
          Preparing the stage...
        </motion.p>
      </div>
    );
  }

  const showStatusMessage =
    !isTurnPass &&
    game.message !== turnAction &&
    !game.message.startsWith("The wheel is turning") &&
    !game.message.startsWith("Landed on");

  return (
    <div className="game-shell relative h-screen overflow-hidden">
      <GameBackground />
      <Mascot />

      <AnimatePresence>
        {game.celebration === "success" && (
          <FloatingEmojis emojis={SUCCESS_EMOJIS} variant="success" />
        )}
        {game.celebration === "failure" && (
          <FloatingEmojis emojis={FAILURE_EMOJIS} count={10} variant="failure" />
        )}
      </AnimatePresence>

      <div className="game-layout relative mx-auto h-full w-full max-w-[1600px]">
        <Header />

        <div className="game-top-bar">
          <div className="game-left-stack">
            <CategoryCard
              category={game.currentCategory}
              puzzleIndex={game.puzzleIndex}
              puzzlesPerRound={game.puzzlesPerRound}
              canGoBack={game.canGoBack}
              canGoNext={game.canGoNext}
              onBack={game.goToPreviousPuzzle}
              onNext={game.goToNextPuzzle}
            />
            <StatusBanner
              activeTeam={game.activeTeam}
              action={turnAction}
              isTurnPass={isTurnPass}
            />
          </div>
          <ScoreCard
            scores={game.teamScores}
            activeTeam={game.activeTeam}
            turnEarnings={game.turnEarnings}
          />
        </div>

        <div className="game-puzzle-section">
          {showStatusMessage && (
            <motion.p
              key={game.message}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="game-status-msg font-display shrink-0 px-2 text-center font-extrabold text-white drop-shadow-sm"
            >
              {game.message}
            </motion.p>
          )}
          <PuzzleBoard title={game.currentMovie} guessedLetters={game.guessedLetters} />
        </div>

        <div className="game-main">
          <div className="game-wheel-col">
            <div className="game-wheel-value-slot">
              {game.wheelValue !== null && !game.isSpinning && (
                <WheelValueCard value={game.wheelValue} />
              )}
            </div>
            <div className="game-wheel-wrap">
              <Wheel
                segments={game.wheelSegments}
                isSpinning={game.isSpinning}
                targetSegmentIndex={spinTarget}
                onSpinStart={handleSpinStart}
                onSpinComplete={handleSpinComplete}
                disabled={game.hasSpun || game.phase !== "playing"}
              />
            </div>
          </div>

          <div className="game-controls-col">
            <LetterGrid
              className="game-letter-panel"
              guessedLetters={game.guessedLetters}
              hasSpun={game.hasSpun}
              canBuyVowel={game.canBuyVowel}
              onGuessConsonant={game.guessConsonant}
              onBuyVowel={game.buyVowel}
              disabled={game.isSpinning || game.phase !== "playing"}
              failurePulse={game.celebration === "failure"}
            />
            <CallOutButton
              onClick={() => game.setShowCallOut(true)}
              disabled={game.phase !== "playing"}
            />
          </div>
        </div>
      </div>

      <CallOutModal
        isOpen={game.showCallOut}
        onClose={() => game.setShowCallOut(false)}
        onSubmit={game.submitCallOut}
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
