"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import type { Choice } from "@/game/aksum";

function Body({
  line,
  choices,
  onChoose,
}: {
  line: string;
  choices: Choice[];
  onChoose: (c: Choice) => void;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setCount((c) => Math.min(c + 2, line.length)), 18);
    return () => clearInterval(id);
  }, [line]);

  const done = count >= line.length;

  return (
    <div onClick={() => setCount(line.length)}>
      <span className="sr-only">{line}</span>
      <p
        aria-hidden
        className="min-h-[3.5rem] text-base leading-relaxed text-parchment sm:text-lg"
      >
        {line.slice(0, count)}
      </p>
      {done && (
        <div className="mt-4 flex flex-col gap-2">
          {choices.map((c) => (
            <button
              key={c.label}
              onClick={(e) => {
                e.stopPropagation();
                onChoose(c);
              }}
              className="border border-gold/40 bg-gold/10 px-4 py-2 text-left text-sm text-parchment transition-colors hover:bg-gold/25"
            >
              {c.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function DialogueBox({
  speaker,
  title,
  nodeId,
  line,
  choices,
  onChoose,
  onClose,
}: {
  speaker: string;
  title: string;
  nodeId: string;
  line: string;
  choices: Choice[];
  onChoose: (c: Choice) => void;
  onClose: () => void;
}) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-24 flex justify-center px-4">
      <motion.div
        role="dialog"
        aria-label={`Dialogue with ${speaker}`}
        className="hud-panel relic-frame pointer-events-auto w-full max-w-3xl p-5 sm:p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.35 }}
      >
        <div className="mb-3 flex items-baseline justify-between gap-4">
          <p className="font-display text-sm uppercase tracking-[0.25em] text-gold">
            {speaker} <span className="text-sand/70">· {title}</span>
          </p>
          <button
            onClick={onClose}
            className="text-[10px] uppercase tracking-[0.3em] text-sand/60 hover:text-gold"
          >
            Esc · Close
          </button>
        </div>

        <Body key={nodeId} line={line} choices={choices} onChoose={onChoose} />

        <p className="mt-4 text-[10px] uppercase tracking-[0.25em] text-sand/40">
          Fictional character · dramatized dialogue
        </p>
      </motion.div>
    </div>
  );
}