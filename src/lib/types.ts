export type TeamId = "A" | "B";

export type WheelSegmentType = "value" | "bankrupt" | "nagin" | "freeSpin";

export type WheelSegment = {
  label: string;
  value: number;
  type: WheelSegmentType;
};

export type CelebrationType = "success" | "failure" | "winner" | null;

export type GamePhase = "playing" | "round-end";

export type TeamScores = Record<TeamId, number>;

export type Puzzle = {
  answer: string;
  display: string;
};

export type PuzzleItem = {
  category: string;
  name: string;
};
