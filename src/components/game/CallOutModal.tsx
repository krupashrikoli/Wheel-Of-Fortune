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
        className="fixed inset-0 z-40 bg-primary-blue/40 backdrop-blur-md"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-6"
      >
        <div
          className="glass-card w-full max-w-xl rounded-[32px] border-4 border-white p-8 sm:p-10"
          onClick={(e) => e.stopPropagation()}
        >
          <p className="text-center font-display text-3xl font-bold text-primary-blue">
            Call Out Answer
          </p>
          <p className="mt-2 mb-8 text-center text-sm font-bold text-[#5a7a9a]">
            +50,000 if correct · −50,000 if wrong
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              ref={inputRef}
              type="text"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              placeholder="Enter your answer..."
              className="w-full rounded-2xl border-2 border-sky-blue/40 bg-white px-5 py-5 text-center text-2xl font-bold tracking-wide text-primary-blue outline-none focus:border-primary-blue"
            />

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-full bg-gray-100 py-3 text-sm font-bold text-[#5a7a9a] uppercase"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 rounded-full bg-gradient-to-r from-primary-blue to-sky-blue py-3 text-sm font-bold text-white uppercase shadow-md"
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
