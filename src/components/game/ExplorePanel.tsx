"use client";

import Link from "next/link";
import { motion } from "motion/react";

const CATEGORIES = [
  { am: "ታሪኮች", en: "History & Stories", playable: true },
  { am: "ቅርሶች", en: "Heritage", playable: false },
  { am: "ቦታዎች", en: "Places", playable: false },
  { am: "ሰዎች", en: "People", playable: false },
  { am: "እንስሳት", en: "Animals", playable: false },
  { am: "ቋንቋዎች", en: "Languages", playable: false },
  { am: "ባህል", en: "Culture", playable: false },
  { am: "ክስተቶች", en: "Events", playable: false },
];

export function ExplorePanel({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      className="absolute inset-0 z-40 flex items-center justify-center bg-ink/85 p-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-label="Explore Ethiopia"
    >
      <div className="relic-frame max-h-[85vh] w-full max-w-3xl overflow-y-auto p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl uppercase text-parchment">Explore Ethiopia</h2>
            <p className="text-[11px] uppercase tracking-[0.35em] text-gold">
              One living world · many ways in
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[10px] uppercase tracking-[0.3em] text-sand/60 hover:text-gold"
          >
            Esc · Close
          </button>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {CATEGORIES.map((c) => (
            <div
              key={c.en}
              className={`hud-panel p-4 text-center ${c.playable ? "" : "opacity-60"}`}
            >
              <p className="font-geez text-xl text-gold">{c.am}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.2em] text-parchment">
                {c.en}
              </p>
              <p className="mt-2 text-[9px] uppercase tracking-[0.3em] text-sand/60">
                {c.playable ? "Playable now" : "Coming soon"}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-7 flex justify-end">
          <Link
            href="/portal"
            className="border border-gold/60 bg-gold/20 px-6 py-3 text-xs uppercase tracking-[0.3em] text-parchment transition-colors hover:bg-gold/35"
          >
            Enter Time Journeys
          </Link>
        </div>
      </div>
    </motion.div>
  );
}