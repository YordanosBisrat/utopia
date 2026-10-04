"use client";

import { useState } from "react";
import { motion } from "motion/react";

type SpotId = "door" | "windows" | "shape";

const SPOTS: { id: SpotId; n: number; cx: number; cy: number }[] = [
  { id: "shape", n: 1, cx: 120, cy: 56 },
  { id: "windows", n: 2, cx: 120, cy: 205, },
  { id: "door", n: 3, cx: 120, cy: 362 },
];

const LABELS: { id: SpotId | "none"; text: string }[] = [
  { id: "door", text: "A false door: carved, it does not open" },
  { id: "windows", text: "False windows: carved into the stone" },
  { id: "shape", text: "Shaped like a tall building" },
  { id: "none", text: "A working gate for the city" },
];

export function ScribeRecord({
  onComplete,
  onClose,
}: {
  onComplete: () => void;
  onClose: () => void;
}) {
  const [selected, setSelected] = useState<SpotId | null>(null);
  const [solved, setSolved] = useState<SpotId[]>([]);
  const [note, setNote] = useState(
    "Tap a numbered mark on the stele, then choose the label that fits.",
  );
  const complete = solved.length === SPOTS.length;

  const pick = (id: SpotId | "none") => {
    if (!selected) {
      setNote("First tap a numbered mark on the stele.");
      return;
    }
    if (id === selected) {
      setSolved((s) => [...s, selected]);
      setSelected(null);
      setNote("Recorded.");
    } else {
      setNote(
        "Not quite. Think about what you saw: can that part really be used, or is it carved in stone?",
      );
    }
  };

  return (
    <motion.div
      className="absolute inset-0 z-40 flex items-center justify-center bg-ink/85 p-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-label="The Scribe's Record"
    >
      <div className="relic-frame w-full max-w-3xl p-5 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl uppercase text-parchment">The Scribe&apos;s Record</h2>
            <p className="text-[11px] uppercase tracking-[0.35em] text-gold">
              Label what you observed · {solved.length} / {SPOTS.length}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[10px] uppercase tracking-[0.3em] text-sand/60 hover:text-gold"
          >
            Esc · Close
          </button>
        </div>

        <div className="mt-5 grid gap-6 sm:grid-cols-[220px_1fr]">
          {/* The stele drawing */}
          <svg
            viewBox="0 0 240 420"
            className="mx-auto h-72 w-auto sm:h-96"
            role="img"
            aria-label="Drawing of a tall carved stele with numbered marks"
          >
            <path
              d="M 82 400 L 158 400 L 148 50 Q 120 32 92 50 Z"
              fill="#8c7a62"
              stroke="#d9c9a3"
              strokeWidth="1.5"
            />
            {[100, 142, 184, 226, 268].map((y) => (
              <g key={y} fill="#2a2118">
                <rect x="102" y={y} width="14" height="26" />
                <rect x="124" y={y} width="14" height="26" />
              </g>
            ))}
            <rect x="106" y="336" width="28" height="64" fill="#2a2118" />

            {SPOTS.map((s) => {
              const done = solved.includes(s.id);
              const active = selected === s.id;
              return (
                <g
                  key={s.id}
                  role="button"
                  tabIndex={0}
                  aria-label={`Mark ${s.n}${done ? " (recorded)" : ""}`}
                  className="cursor-pointer"
                  onClick={() => !done && setSelected(s.id)}
                  onKeyDown={(e) => {
                    if ((e.key === "Enter" || e.key === " ") && !done) setSelected(s.id);
                  }}
                >
                  <circle
                    cx={s.cx}
                    cy={s.cy}
                    r={active ? 17 : 14}
                    fill={done ? "#4a7c59" : active ? "#f2c94c" : "#1a1410"}
                    stroke="#f2c94c"
                    strokeWidth="2"
                  />
                  <text
                    x={s.cx}
                    y={s.cy + 5}
                    textAnchor="middle"
                    fontSize="14"
                    fontWeight="700"
                    fill={active ? "#1a1410" : "#f5efe0"}
                  >
                    {done ? "✓" : s.n}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Labels */}
          <div className="flex flex-col">
            <p className="text-sm text-sand" aria-live="polite">
              {complete ? "Your record is complete." : note}
            </p>

            <div className="mt-4 flex flex-col gap-2">
              {LABELS.map((l) => {
                const used = l.id !== "none" && solved.includes(l.id);
                return (
                  <button
                    key={l.id}
                    disabled={used || complete}
                    onClick={() => pick(l.id)}
                    className="border border-gold/40 bg-gold/10 px-4 py-2 text-left text-sm text-parchment transition-colors hover:bg-gold/25 disabled:opacity-40 disabled:hover:bg-gold/10"
                  >
                    {l.text}
                  </button>
                );
              })}
            </div>

            {complete && (
              <button
                onClick={onComplete}
                className="mt-5 border border-gold/60 bg-gold/20 px-5 py-2 text-xs uppercase tracking-[0.3em] text-parchment transition-colors hover:bg-gold/35"
              >
                Take the record to Zeway
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}