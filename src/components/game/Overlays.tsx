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
      className="absolute inset-0 z-40 flex items-center justify-center bg-ink/80 p-3 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-label="መዝገብ knowledge archive"
    >
      <motion.div
        initial={{ opacity: 0, y: 40, rotateX: 8 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        exit={{ opacity: 0, y: 24 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="parchment-surface relative aspect-square w-[min(94vw,88vh,46rem)]"
        style={{
          backgroundImage: "url(/art/mezgeb.jpg)",
          backgroundSize: "100% 100%",
        }}
      >
        {/* Content stays inside the decorative border */}
        <div className="absolute inset-[12%] flex flex-col">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-geez text-4xl leading-none text-ink">መዝገብ</h2>
              <p className="mt-2 text-[10px] uppercase tracking-[0.3em] text-clay">
                Knowledge Archive · {entries.length} / {ENTRIES.length} discovered
              </p>
            </div>
            <button
              onClick={onClose}
              className="h-8 w-8 shrink-0 border border-ink/25 text-ink/70 transition-colors hover:bg-ink/10"
              aria-label="Close መዝገብ"
            >
              ✕
            </button>
          </div>

          <div className="mt-5 flex-1 overflow-y-auto pr-2">
            {entries.length === 0 ? (
              <p className="text-sm text-ink/70">
                Nothing discovered yet. Explore Aksum to unlock your first entry.
              </p>
            ) : (
              <div className="space-y-6">
                {entries.map((e, i) => (
                  <motion.article
                    key={e.id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + i * 0.08 }}
                    className="border-l-2 border-clay/50 pl-4"
                  >
                    <p className="text-[10px] uppercase tracking-[0.3em] text-clay">
                      <span className="font-geez normal-case">{e.category.am}</span> ·{" "}
                      {e.category.en}
                    </p>
                    <h3 className="mt-1 text-xl uppercase text-ink">{e.title.en}</h3>
                    <p className="font-geez text-base text-clay">{e.title.am}</p>
                    <p className="mt-2 text-sm leading-relaxed text-ink/80">
                      {e.summary}
                    </p>
                    <p className="mt-3 text-[10px] uppercase tracking-[0.25em] text-ink/50">
                      Sources
                    </p>
                    <ul className="mt-1 text-xs text-ink/70">
                      {e.sources.map((s) => (
                        <li key={s.name}>
                          {s.url ? (
                            <a
                              href={s.url}
                              target="_blank"
                              rel="noreferrer"
                              className="underline decoration-clay/50 hover:text-clay"
                            >
                              {s.name}
                            </a>
                          ) : (
                            s.name
                          )}
                        </li>
                      ))}
                    </ul>
                  </motion.article>
                ))}
              </div>
            )}

            <button
              onClick={onReset}
              className="mt-8 text-[10px] uppercase tracking-[0.25em] text-ink/35 hover:text-ink/70"
            >
              Reset demo progress
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}