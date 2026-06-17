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
      animate={{ y: [0, -2, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      className="glass-card w-full rounded-xl border border-white/80 px-2 py-1.5 sm:rounded-2xl"
    >
      <div className="flex items-center gap-2">
        <span className="text-xl leading-none sm:text-2xl">{icon}</span>
        <div className="min-w-0 leading-tight">
          <p className="truncate font-display text-sm font-bold text-primary-blue sm:text-base">
            {category}
          </p>
          <p className="text-[10px] font-bold text-[#3d5a78] sm:text-xs">
            Puzzle {puzzleIndex + 1} of {puzzlesPerRound}
          </p>
        </div>
      </div>
      <div className="mt-1 flex gap-1">
        <button
          type="button"
          onClick={onBack}
          disabled={!canGoBack}
          className="flex flex-1 items-center justify-center gap-0.5 rounded-full bg-sky-blue/25 px-2 py-0.5 text-[10px] font-bold text-[#1a4a7a] transition hover:bg-sky-blue/35 disabled:opacity-40 sm:text-xs"
        >
          <ChevronLeft className="h-3 w-3" />
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!canGoNext}
          className="flex flex-1 items-center justify-center gap-0.5 rounded-full bg-primary-blue/20 px-2 py-0.5 text-[10px] font-bold text-[#1a4a7a] transition hover:bg-primary-blue/30 disabled:opacity-40 sm:text-xs"
        >
          Next
          <ChevronRight className="h-3 w-3" />
        </button>
      </div>
    </motion.div>
  );
}
