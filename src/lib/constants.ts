import type { PuzzleItem, WheelSegment } from "./types";

export const PUZZLES: readonly PuzzleItem[] = [
  { category: "Food", name: "dal chawal" },
  { category: "Colors", name: "pink" },
  { category: "Place", name: "Goa" },
  { category: "People", name: "Donald trump" },
  { category: "Alcohol", name: "buzzballs" },
  { category: "Movie", name: "sholay" },
];

export const VOWEL_COST = 200;
export const SNAKE_PENALTY = 500;
export const CALL_OUT_REWARD = 50_000;
export const CALL_OUT_PENALTY = 50_000;

export const VOWELS = new Set(["A", "E", "I", "O", "U"]);

export const WHEEL_SEGMENTS: WheelSegment[] = [
  { label: "Snake", value: 0, isBankrupt: true },
  { label: "1", value: 1, isBankrupt: false },
  { label: "1000", value: 1000, isBankrupt: false },
  { label: "5000", value: 5000, isBankrupt: false },
  { label: "10000", value: 10000, isBankrupt: false },
  { label: "15000", value: 15000, isBankrupt: false },
  { label: "Snake", value: 0, isBankrupt: true },
  { label: "20000", value: 20000, isBankrupt: false },
  { label: "35000", value: 35000, isBankrupt: false },
  { label: "50000", value: 50000, isBankrupt: false },
  { label: "75000", value: 75000, isBankrupt: false },
  { label: "100000", value: 100000, isBankrupt: false },
];

export const SUCCESS_EMOJIS = ["🎉", "🎊", "✨", "🌟", "🥳", "💫", "🎬", "🏆"];
export const FAILURE_EMOJIS = ["😢", "😞", "💔", "🎺", "😔", "📉"];
export const WINNER_EMOJIS = ["👑", "🎉", "🏆", "✨", "🌟", "🥂", "💎", "🎊"];
