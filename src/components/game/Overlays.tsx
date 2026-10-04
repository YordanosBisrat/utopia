"use client";

import { motion } from "motion/react";
import { EXAMINE_TEXT } from "@/game/aksum";
import { ENTRIES } from "@/game/mezgeb";

export function ExaminePanel({ onDone }: { onDone: () => void }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-24 flex justify-center px-4">
      <motion.div
        role="dialog"
        aria-label="Scribe's notes"
        className="hud-panel relic-frame pointer-events-auto w-full max-w-2xl p-5 sm:p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.35 }}
      >
        <p className="font-display text-sm uppercase tracking-[0.25em] text-gold">
          Scribe&apos;s Notes · The Tallest Stele
        </p>
        <p className="mt-3 text-base leading-relaxed text-parchment sm:text-lg">
          {EXAMINE_TEXT}
        </p>
        <button
          onClick={onDone}
          className="mt-4 border border-gold/40 bg-gold/10 px-4 py-2 text-sm text-parchment transition-colors hover:bg-gold/25"
        >
          Add to my notes
        </button>
      </motion.div>
    </div>
  );
}

export function DiscoveryOverlay({
  entryId,
  onOpen,
  onContinue,
}: {
  entryId: string;
  onOpen: () => void;
  onContinue: () => void;
}) {
  const entry = ENTRIES.find((e) => e.id === entryId);
  if (!entry) return null;

  return (
    <motion.div
      className="absolute inset-0 z-40 flex items-center justify-center bg-ink/80 p-6 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-label="Discovery unlocked"
    >
      <motion.div
        className="relic-frame max-w-lg px-8 py-10 text-center"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.6 }}
      >
        <motion.div
          className="text-4xl text-gold"
          animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2.4, repeat: Infinity }}
        >
          ◈
        </motion.div>
        <p className="mt-4 text-[11px] uppercase tracking-[0.5em] text-gold">
          Discovery Unlocked
        </p>
        <h2 className="glow-text mt-3 text-3xl uppercase text-parchment">
          {entry.title.en}
        </h2>
        <p className="font-geez mt-1 text-lg text-gold/80">{entry.title.am}</p>
        <p className="mt-5 text-sm text-sand">New መዝገብ entry added to your archive.</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <button
            onClick={onOpen}
            className="border border-gold/60 bg-gold/20 px-5 py-2 text-xs uppercase tracking-[0.3em] text-parchment transition-colors hover:bg-gold/35"
          >
            Open መዝገብ
          </button>
          <button
            onClick={onContinue}
            className="border border-border px-5 py-2 text-xs uppercase tracking-[0.3em] text-sand transition-colors hover:border-gold/60 hover:text-parchment"
          >
            Continue
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function MezgebPanel({
  unlocked,
  onClose,
  onReset,
}: {
  unlocked: string[];
  onClose: () => void;
  onReset: () => void;
}) {
  const entries = ENTRIES.filter((e) => unlocked.includes(e.id));

  return (
    <motion.div
      className="absolute inset-0 z-40 flex items-center justify-center bg-ink/85 p-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-label="መዝገብ knowledge archive"
    >
      <div className="relic-frame max-h-[80vh] w-full max-w-2xl overflow-y-auto p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-geez text-3xl text-gold">መዝገብ</h2>
            <p className="text-[11px] uppercase tracking-[0.35em] text-sand/70">
              Knowledge Archive · {entries.length} / {ENTRIES.length} discovered
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[10px] uppercase tracking-[0.3em] text-sand/60 hover:text-gold"
          >
            Esc · Close
          </button>
        </div>

        {entries.length === 0 ? (
          <p className="mt-8 text-sm text-sand">
            Nothing discovered yet. Explore Aksum to unlock your first entry.
          </p>
        ) : (
          <div className="mt-6 space-y-5">
            {entries.map((e) => (
              <article key={e.id} className="hud-panel p-5">
                <p className="text-[10px] uppercase tracking-[0.3em] text-gold">
                  <span className="font-geez normal-case">{e.category.am}</span> ·{" "}
                  {e.category.en}
                </p>
                <h3 className="mt-2 text-xl uppercase text-parchment">{e.title.en}</h3>
                <p className="font-geez text-base text-gold/80">{e.title.am}</p>
                <p className="mt-3 text-sm leading-relaxed text-sand">{e.summary}</p>
                <p className="mt-4 text-[10px] uppercase tracking-[0.25em] text-sand/50">
                  Sources
                </p>
                <ul className="mt-1 text-xs text-sand">
                  {e.sources.map((s) => (
                    <li key={s.name}>
                      {s.url ? (
                        <a
                          href={s.url}
                          target="_blank"
                          rel="noreferrer"
                          className="underline decoration-gold/40 hover:text-gold"
                        >
                          {s.name}
                        </a>
                      ) : (
                        s.name
                      )}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        )}

        <button
          onClick={onReset}
          className="mt-8 text-[10px] uppercase tracking-[0.25em] text-sand/40 hover:text-sand"
        >
          Reset demo progress
        </button>
      </div>
    </motion.div>
  );
}