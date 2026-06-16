"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type CallOutModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (guess: string) => void;
};

export function CallOutModal({ isOpen, onClose, onSubmit }: CallOutModalProps) {
  const [guess, setGuess] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setGuess("");
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guess.trim()) return;
    onSubmit(guess);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-40 bg-charcoal/60 backdrop-blur-xl"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
          >
            <div
              className="w-full max-w-md rounded-3xl border border-gold/30 bg-charcoal-light/95 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.5)] backdrop-blur-md"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="mb-2 text-center font-display text-2xl text-cream">
                Call Out Answer
              </p>
              <p className="mb-8 text-center text-sm text-cream/50">
                Correct: +50,000 &nbsp;·&nbsp; Wrong: −50,000
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <input
                  ref={inputRef}
                  type="text"
                  value={guess}
                  onChange={(e) => setGuess(e.target.value)}
                  placeholder="Enter your answer..."
                  className="w-full rounded-xl border border-cream/10 bg-charcoal/80 px-5 py-4 text-center text-lg text-cream placeholder:text-cream/30 outline-none transition-colors focus:border-gold/50"
                />

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 rounded-xl border border-cream/10 py-3 text-sm tracking-wider text-cream/60 uppercase transition-colors hover:border-cream/30 hover:text-cream"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-xl border border-gold/50 bg-gold/10 py-3 text-sm tracking-wider text-gold uppercase transition-all hover:bg-gold/20"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
