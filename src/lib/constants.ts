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
export const CALL_OUT_REWARD = 50_000;
export const CALL_OUT_PENALTY = 50_000;

export const VOWELS = new Set(["A", "E", "I", "O", "U"]);

export const WHEEL_SEGMENTS: WheelSegment[] = [
  { label: "1,00,000", value: 100_000, type: "value" },
  { label: "75,000", value: 75_000, type: "value" },
  { label: "50,000", value: 50_000, type: "value" },
  { label: "25,000", value: 25_000, type: "value" },
  { label: "20,000", value: 20_000, type: "value" },
  { label: "10,000", value: 10_000, type: "value" },
  { label: "6767", value: 6767, type: "value" },
  { label: "1", value: 1, type: "value" },
  { label: "Naagin 🐍", value: 0, type: "nagin" },
  { label: "Bankrupt", value: 0, type: "bankrupt" },
  { label: "Free spin", value: 0, type: "freeSpin" },
];

export const SUCCESS_EMOJIS = ["✨", "🎉", "🏆", "⭐", "🎊", "💫"];
export const FAILURE_EMOJIS = ["💨", "😵", "🫠", "😬", "📉"];
export const WINNER_EMOJIS = ["👑", "🎉", "🏆", "✨", "🌟", "🥂", "💎", "🎊"];
