"use client";

import { useCallback, useMemo, useState } from "react";
import {
  CALL_OUT_PENALTY,
  CALL_OUT_REWARD,
  PUZZLES,
  VOWEL_COST,
  VOWELS,
  WHEEL_SEGMENTS,
} from "@/lib/constants";
import { isLetterInPuzzle, isPuzzleSolved } from "@/lib/puzzle";
import { shuffleWheelSegments } from "@/lib/wheel-math";
import type {
  CelebrationType,
  GamePhase,
  PuzzleItem,
  TeamId,
  TeamScores,
  WheelSegment,
} from "@/lib/types";

function otherTeam(team: TeamId): TeamId {
  return team === "A" ? "B" : "A";
}

const PASS_TURN_DELAY = 2200;

function chancePassedMessage(team: TeamId): string {
  return `Chance passed to Team ${team}! Spin the wheel.`;
}

function createInitialScores(): TeamScores {
  return { A: 0, B: 0 };
}

export function useGameState(puzzles: readonly PuzzleItem[] = PUZZLES) {
  const puzzlesPerRound = puzzles.length;

  const [phase, setPhase] = useState<GamePhase>("playing");
  const [activeTeam, setActiveTeam] = useState<TeamId>("A");
  const [teamScores, setTeamScores] = useState<TeamScores>(createInitialScores);
  const [turnEarnings, setTurnEarnings] = useState(0);
  const [wheelValue, setWheelValue] = useState<number | null>(null);
  const [hasSpun, setHasSpun] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set());
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [message, setMessage] = useState("Spin the wheel to begin your turn.");
  const [celebration, setCelebration] = useState<CelebrationType>(null);
  const [showCallOut, setShowCallOut] = useState(false);
  const [lastSpinSegmentIndex, setLastSpinSegmentIndex] = useState<number | null>(null);
  const [wheelSegments, setWheelSegments] = useState<WheelSegment[]>(WHEEL_SEGMENTS);
  const [wheelLayoutKey, setWheelLayoutKey] = useState(0);
  const [freeSpinAfterLetter, setFreeSpinAfterLetter] = useState(false);

  const currentPuzzle = puzzles[puzzleIndex];
  const currentMovie = currentPuzzle?.name ?? "";
  const currentCategory = currentPuzzle?.category ?? "";

  const resetPuzzleState = useCallback(() => {
    setGuessedLetters(new Set());
    setTurnEarnings(0);
    setWheelValue(null);
    setHasSpun(false);
    setIsSpinning(false);
    setCelebration(null);
    setShowCallOut(false);
    setLastSpinSegmentIndex(null);
    setFreeSpinAfterLetter(false);
    setWheelSegments(shuffleWheelSegments(WHEEL_SEGMENTS));
    setWheelLayoutKey((key) => key + 1);
    setMessage("Spin the wheel to begin your turn.");
  }, []);

  const loadPuzzle = useCallback(
    (index: number, nextMessage?: string) => {
      if (index < 0 || index >= puzzlesPerRound) return;
      setPuzzleIndex(index);
      setPhase("playing");
      resetPuzzleState();
      if (nextMessage) {
        setMessage(nextMessage);
      }
    },
    [puzzlesPerRound, resetPuzzleState]
  );

  const initializeRound = useCallback(
    (resetScores = false) => {
      setPuzzleIndex(0);
      setActiveTeam("A");
      setPhase("playing");
      resetPuzzleState();
      if (resetScores) {
        setTeamScores(createInitialScores());
      }
    },
    [resetPuzzleState]
  );

  const solvedLetters = useMemo(() => {
    if (!currentMovie) return new Set<string>();
    return guessedLetters;
  }, [currentMovie, guessedLetters]);

  const passTurnToOtherTeam = useCallback(
    (outcomeMessage?: string) => {
      const nextTeam = otherTeam(activeTeam);
      setActiveTeam(nextTeam);
      setTurnEarnings(0);
      setWheelValue(null);
      setHasSpun(false);
      setFreeSpinAfterLetter(false);

      const passMessage = chancePassedMessage(nextTeam);
      if (outcomeMessage) {
        setMessage(outcomeMessage);
        setTimeout(() => setMessage(passMessage), PASS_TURN_DELAY);
      } else {
        setMessage(passMessage);
      }
    },
    [activeTeam]
  );

  const bankTurnEarnings = useCallback((team: TeamId, amount: number) => {
    if (amount <= 0) return;
    setTeamScores((scores) => ({
      ...scores,
      [team]: scores[team] + amount,
    }));
  }, []);

  const handOffToTeam = useCallback((nextTeam: TeamId) => {
    setActiveTeam(nextTeam);
    setTurnEarnings(0);
    setWheelValue(null);
    setHasSpun(false);
    setFreeSpinAfterLetter(false);
  }, []);

  const grantFreeSpinRespin = useCallback((outcomeMessage: string) => {
    setFreeSpinAfterLetter(false);
    setHasSpun(false);
    setWheelValue(null);
    setTurnEarnings(0);
    setMessage(`${outcomeMessage} Free spin — spin again!`);
  }, []);

  const advancePuzzle = useCallback(
    (handoffTeam?: TeamId) => {
      const nextIndex = puzzleIndex + 1;
      if (nextIndex >= puzzlesPerRound) {
        setPhase("round-end");
        setCelebration("winner");
        setMessage("Round complete.");
        return;
      }

      const nextMessage = handoffTeam
        ? `Chance passed to Team ${handoffTeam}! Puzzle ${nextIndex + 1} of ${puzzlesPerRound} — spin the wheel.`
        : `Puzzle ${nextIndex + 1} of ${puzzlesPerRound}. Spin the wheel.`;

      loadPuzzle(nextIndex, nextMessage);
    },
    [loadPuzzle, puzzleIndex, puzzlesPerRound]
  );

  const goToNextPuzzle = useCallback(() => {
    if (puzzleIndex < puzzlesPerRound - 1) {
      loadPuzzle(puzzleIndex + 1);
    }
  }, [loadPuzzle, puzzleIndex, puzzlesPerRound]);

  const goToPreviousPuzzle = useCallback(() => {
    if (puzzleIndex > 0) {
      loadPuzzle(puzzleIndex - 1);
    }
  }, [loadPuzzle, puzzleIndex]);

  const handleSpinComplete = useCallback(
    (segmentIndex: number) => {
      const segment = wheelSegments[segmentIndex];
      setLastSpinSegmentIndex(segmentIndex);
      setIsSpinning(false);

      if (segment.type === "bankrupt") {
        setHasSpun(true);
        setFreeSpinAfterLetter(false);
        setTeamScores((scores) => ({
          ...scores,
          [activeTeam]: 0,
        }));
        setTurnEarnings(0);
        setWheelValue(null);
        passTurnToOtherTeam(
          `Bankrupt! All points deducted from Team ${activeTeam}'s account.`
        );
        return;
      }

      if (segment.type === "nagin") {
        setHasSpun(true);
        setFreeSpinAfterLetter(false);
        setTurnEarnings(0);
        setWheelValue(null);
        passTurnToOtherTeam(`Nagin 🐍! Team ${activeTeam}'s chance is skipped.`);
        return;
      }

      if (segment.type === "freeSpin") {
        setHasSpun(true);
        setWheelValue(0);
        setTurnEarnings(0);
        setFreeSpinAfterLetter(true);
        setMessage(`Free spin! Guess a letter — then spin again.`);
        return;
      }

      setFreeSpinAfterLetter(false);
      setHasSpun(true);
      setWheelValue(segment.value);
      setMessage(`Landed on ${segment.label}. Guess a consonant or buy a vowel.`);
    },
    [activeTeam, passTurnToOtherTeam, wheelSegments]
  );

  const startSpin = useCallback(() => {
    if (isSpinning || hasSpun || phase !== "playing") return null;

    const shuffled = shuffleWheelSegments(WHEEL_SEGMENTS);
    setWheelSegments(shuffled);
    setWheelLayoutKey((key) => key + 1);
    setIsSpinning(true);
    setMessage("The wheel is turning...");

    return Math.floor(Math.random() * shuffled.length);
  }, [hasSpun, isSpinning, phase]);

  const guessConsonant = useCallback(
    (letter: string) => {
      const upper = letter.toUpperCase();
      if (
        !currentMovie ||
        !hasSpun ||
        wheelValue === null ||
        isSpinning ||
        phase !== "playing" ||
        guessedLetters.has(upper) ||
        VOWELS.has(upper)
      ) {
        return;
      }

      setGuessedLetters((prev) => new Set(prev).add(upper));

      if (isLetterInPuzzle(currentMovie, upper)) {
        const count = currentMovie
          .toUpperCase()
          .split("")
          .filter((char) => char === upper).length;
        const earned = wheelValue * count;
        const nextGuessed = new Set([...guessedLetters, upper]);
        const puzzleSolved = isPuzzleSolved(currentMovie, nextGuessed);

        bankTurnEarnings(activeTeam, earned);
        setTurnEarnings(0);

        if (puzzleSolved) {
          setCelebration("success");
          setMessage(`Puzzle solved! Team ${activeTeam} banks +${earned.toLocaleString()}!`);
          setTimeout(() => {
            setCelebration(null);
            const nextTeam = otherTeam(activeTeam);
            handOffToTeam(nextTeam);
            advancePuzzle(nextTeam);
          }, 1800);
        } else {
          if (freeSpinAfterLetter) {
            grantFreeSpinRespin(
              `${upper} appears ${count} time${count > 1 ? "s" : ""}! +${earned.toLocaleString()} (${wheelValue.toLocaleString()} × ${count}).`
            );
          } else {
            passTurnToOtherTeam(
              `${upper} appears ${count} time${count > 1 ? "s" : ""}! +${earned.toLocaleString()} (${wheelValue.toLocaleString()} × ${count}). Turn over.`
            );
          }
        }
        return;
      }

      setTurnEarnings(0);
      setCelebration("failure");
      setTimeout(() => setCelebration(null), 1800);
      if (freeSpinAfterLetter) {
        grantFreeSpinRespin(`No ${upper}.`);
      } else {
        passTurnToOtherTeam(`No ${upper}. Team ${activeTeam} loses all round points.`);
      }
    },
    [
      activeTeam,
      advancePuzzle,
      bankTurnEarnings,
      currentMovie,
      freeSpinAfterLetter,
      grantFreeSpinRespin,
      guessedLetters,
      handOffToTeam,
      hasSpun,
      isSpinning,
      passTurnToOtherTeam,
      phase,
      wheelValue,
    ]
  );

  const buyVowel = useCallback(
    (letter: string) => {
      const upper = letter.toUpperCase();
      if (
        !currentMovie ||
        !hasSpun ||
        wheelValue === null ||
        isSpinning ||
        phase !== "playing" ||
        guessedLetters.has(upper) ||
        !VOWELS.has(upper) ||
        teamScores[activeTeam] <= VOWEL_COST
      ) {
        return;
      }

      const count = currentMovie
        .toUpperCase()
        .split("")
        .filter((char) => char === upper).length;
      const isCorrect = count > 0;
      const vowelReward = isCorrect ? wheelValue * count : 0;
      const nextGuessed = new Set([...guessedLetters, upper]);
      const puzzleSolved = isCorrect && isPuzzleSolved(currentMovie, nextGuessed);

      setTeamScores((scores) => ({
        ...scores,
        [activeTeam]:
          scores[activeTeam] - VOWEL_COST + (isCorrect ? vowelReward : 0),
      }));
      setGuessedLetters((prev) => new Set(prev).add(upper));
      setTurnEarnings(0);

      if (isCorrect) {
        if (puzzleSolved) {
          setCelebration("success");
          setMessage(
            `Vowel ${upper} solves the puzzle! −${VOWEL_COST}, then +${vowelReward.toLocaleString()} (${wheelValue.toLocaleString()} × ${count}).`
          );
          setTimeout(() => {
            setCelebration(null);
            const nextTeam = otherTeam(activeTeam);
            handOffToTeam(nextTeam);
            advancePuzzle(nextTeam);
          }, 1800);
        } else {
          if (freeSpinAfterLetter) {
            grantFreeSpinRespin(
              `Vowel ${upper} found! −${VOWEL_COST}, then +${vowelReward.toLocaleString()} (${wheelValue.toLocaleString()} × ${count}).`
            );
          } else {
            passTurnToOtherTeam(
              `Vowel ${upper} found! −${VOWEL_COST}, then +${vowelReward.toLocaleString()} (${wheelValue.toLocaleString()} × ${count}). Turn over.`
            );
          }
        }
        return;
      }

      setCelebration("failure");
      setTimeout(() => setCelebration(null), 1800);
      if (freeSpinAfterLetter) {
        grantFreeSpinRespin(`No ${upper}. −${VOWEL_COST} vowel cost.`);
      } else {
        passTurnToOtherTeam(`No ${upper}. −${VOWEL_COST} vowel cost. Turn over.`);
      }
    },
    [
      activeTeam,
      advancePuzzle,
      currentMovie,
      freeSpinAfterLetter,
      grantFreeSpinRespin,
      guessedLetters,
      handOffToTeam,
      hasSpun,
      isSpinning,
      passTurnToOtherTeam,
      phase,
      teamScores,
      wheelValue,
    ]
  );

  const canBuyVowel = teamScores[activeTeam] > VOWEL_COST;

  const submitCallOut = useCallback(
    (guess: string) => {
      if (!currentMovie || phase !== "playing") return;

      const normalizedGuess = guess.trim().toUpperCase();
      const normalizedAnswer = currentMovie.trim().toUpperCase();
      setShowCallOut(false);

      if (normalizedGuess === normalizedAnswer) {
        setTeamScores((scores) => ({
          ...scores,
          [activeTeam]: scores[activeTeam] + CALL_OUT_REWARD,
        }));
        setCelebration("success");
        setMessage(`Correct call-out! Team ${activeTeam} wins +${CALL_OUT_REWARD.toLocaleString()}!`);
        setTimeout(() => {
          setCelebration(null);
          bankTurnEarnings(activeTeam, turnEarnings);
          const nextTeam = otherTeam(activeTeam);
          handOffToTeam(nextTeam);
          advancePuzzle(nextTeam);
        }, 2200);
        return;
      }

      setTeamScores((scores) => ({
        ...scores,
        [activeTeam]: scores[activeTeam] - CALL_OUT_PENALTY,
      }));
      setCelebration("failure");
      setTimeout(() => {
        setCelebration(null);
        passTurnToOtherTeam(
          `Wrong call-out. Team ${activeTeam} loses ${CALL_OUT_PENALTY.toLocaleString()}.`
        );
      }, 2200);
    },
    [
      activeTeam,
      advancePuzzle,
      bankTurnEarnings,
      currentMovie,
      handOffToTeam,
      passTurnToOtherTeam,
      phase,
      turnEarnings,
    ]
  );

  const winner: TeamId | "tie" | null = useMemo(() => {
    if (phase !== "round-end") return null;
    if (teamScores.A > teamScores.B) return "A";
    if (teamScores.B > teamScores.A) return "B";
    return "tie";
  }, [phase, teamScores]);

  return {
    phase,
    activeTeam,
    teamScores,
    turnEarnings,
    wheelValue,
    hasSpun,
    isSpinning,
    guessedLetters: solvedLetters,
    currentMovie,
    currentCategory,
    puzzleIndex,
    puzzlesPerRound,
    canGoBack: puzzleIndex > 0,
    canGoNext: puzzleIndex < puzzlesPerRound - 1,
    message,
    celebration,
    showCallOut,
    lastSpinSegmentIndex,
    wheelSegments,
    wheelLayoutKey,
    winner,
    initializeRound,
    goToNextPuzzle,
    goToPreviousPuzzle,
    startSpin,
    handleSpinComplete,
    guessConsonant,
    buyVowel,
    canBuyVowel,
    setShowCallOut,
    submitCallOut,
  };
}
