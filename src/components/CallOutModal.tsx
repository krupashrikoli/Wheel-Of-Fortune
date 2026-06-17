"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type CallOutModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (guess: string) => void;
};

function CallOutModalContent({
  onClose,
  onSubmit,
}: Omit<CallOutModalProps, "isOpen">) {
  const [guess, setGuess] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guess.trim()) return;
    onSubmit(guess);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-6"
      >
        <div
          className="w-full max-w-xl rounded-2xl border border-white/10 bg-[#1a1a2e] p-8"
          onClick={(e) => e.stopPropagation()}
        >
          <p className="text-center text-2xl font-bold text-white">Call Out Answer</p>
          <p className="mt-2 mb-8 text-center text-sm text-gray-400">
            +50,000 if correct · −50,000 if wrong
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              ref={inputRef}
              type="text"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              placeholder="Enter your answer..."
              className="w-full rounded-xl border border-white/20 bg-black/40 px-5 py-4 text-center text-xl text-white outline-none focus:border-amber-400"
            />

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-full bg-white/10 py-3 text-sm font-bold text-white uppercase"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 rounded-full bg-amber-500 py-3 text-sm font-bold text-black uppercase"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </>
  );
}

export function CallOutModal({ isOpen, onClose, onSubmit }: CallOutModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <CallOutModalContent onClose={onClose} onSubmit={onSubmit} />
      )}
    </AnimatePresence>
  );
}
