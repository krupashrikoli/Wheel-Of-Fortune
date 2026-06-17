"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CATEGORY_ICONS: Record<string, string> = {
  Food: "🍕",
  Colors: "🎨",
  Place: "🌍",
  People: "👤",
  Alcohol: "🍹",
  Movie: "🎬",
};

type CategoryCardProps = {
  category: string;
  puzzleIndex: number;
  puzzlesPerRound: number;
  canGoBack: boolean;
  canGoNext: boolean;
  onBack: () => void;
  onNext: () => void;
};

export function CategoryCard({
  category,
  puzzleIndex,
  puzzlesPerRound,
  canGoBack,
  canGoNext,
  onBack,
  onNext,
}: CategoryCardProps) {
  const icon = CATEGORY_ICONS[category] ?? "🎯";

  return (
    <motion.div
      animate={{ y: [0, -3, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      className="glass-card flex items-center gap-3 rounded-2xl border border-white/80 p-2.5 sm:rounded-[24px] sm:p-3"
    >
      <span className="text-3xl sm:text-4xl">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="truncate font-display text-lg font-bold text-primary-blue sm:text-xl">
          {category}
        </p>
        <p className="text-sm font-bold text-[#3d5a78] sm:text-base">
          Puzzle {puzzleIndex + 1} of {puzzlesPerRound}
        </p>
        <div className="mt-1.5 flex gap-1.5">
          <button
            type="button"
            onClick={onBack}
            disabled={!canGoBack}
            className="flex flex-1 items-center justify-center gap-0.5 rounded-full bg-sky-blue/25 py-1 text-sm font-bold text-[#1a4a7a] transition hover:bg-sky-blue/35 disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={!canGoNext}
            className="flex flex-1 items-center justify-center gap-0.5 rounded-full bg-primary-blue/20 py-1 text-sm font-bold text-[#1a4a7a] transition hover:bg-primary-blue/30 disabled:opacity-40"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
