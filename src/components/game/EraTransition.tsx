"use client";

import { motion } from "motion/react";
import type { EraInfo } from "@/game/eras";

const GLYPHS = ["ሀ", "ለ", "ሐ", "መ", "ሠ", "ረ", "ሰ", "ቀ", "በ", "ተ"];

export function EraTransition({ era }: { era: EraInfo }) {
  return (
    <motion.div
      className="absolute inset-0 z-50 flex items-center justify-center bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="portal-glow absolute h-[60vh] w-[60vh] rounded-full blur-2xl"
        initial={{ scale: 0.2, opacity: 0 }}
        animate={{ scale: [0.2, 1.1, 3.4], opacity: [0, 0.95, 0] }}
        transition={{ duration: 2.4, times: [0, 0.45, 1], ease: "easeInOut" }}
        aria-hidden
      />

      {[0, 1, 2].map((r) => (
        <motion.span
          key={r}
          className="absolute rounded-full border border-gold/50"
          style={{ height: `${30 + r * 14}vh`, width: `${30 + r * 14}vh` }}
          initial={{ scale: 0.6, opacity: 0, rotate: 0 }}
          animate={{ scale: [0.6, 1, 2.6], opacity: [0, 0.7, 0], rotate: 120 }}
          transition={{ duration: 2.4, delay: r * 0.12, ease: "easeInOut" }}
          aria-hidden
        />
      ))}

      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        {GLYPHS.map((g, i) => (
          <motion.span
            key={g}
            className="font-geez absolute text-2xl text-gold/60"
            style={{ left: `${8 + i * 9}%`, top: `${20 + ((i * 37) % 60)}%` }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: [0, 0.9, 0], y: -60 }}
            transition={{ duration: 2, delay: 0.2 + i * 0.08 }}
          >
            {g}
          </motion.span>
        ))}
      </div>

      <motion.div
        className="relative z-10 text-center"
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: [0, 1, 1, 0], scale: 1 }}
        transition={{ duration: 2.4, times: [0, 0.35, 0.75, 1] }}
      >
        <p className="text-[10px] uppercase tracking-[0.5em] text-gold">{era.period}</p>
        <h2 className="glow-text mt-3 text-4xl uppercase text-parchment sm:text-6xl">
          {era.name}
        </h2>
        <p className="font-geez mt-2 text-xl text-gold/80">{era.nameAm}</p>
        <p className="mt-3 text-sm uppercase tracking-[0.3em] text-sand/80">{era.role}</p>
      </motion.div>
    </motion.div>
  );
}