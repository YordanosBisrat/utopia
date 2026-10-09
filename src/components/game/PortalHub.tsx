"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ERAS, type EraInfo } from "@/game/eras";
import { resetUnlocked } from "@/game/mezgeb";
import { useUnlocked } from "@/game/useUnlocked";
import { Embers } from "./Atmosphere";
import { EraTransition } from "./EraTransition";
import { MezgebPanel } from "./Overlays";
import { Logo } from "@/components/Logo";

export function PortalHub() {
  const router = useRouter();
  const unlocked = useUnlocked();
  const [hovered, setHovered] = useState<EraInfo>(ERAS[0]);
  const [entering, setEntering] = useState<EraInfo | null>(null);
  const [mezgebOpen, setMezgebOpen] = useState(false);

  // After the transition plays, move into the journey
  useEffect(() => {
    if (!entering) return;
    const id = setTimeout(() => router.push(`/game/${entering.id}`), 2400);
    return () => clearTimeout(id);
  }, [entering, router]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Escape") setMezgebOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const select = (era: EraInfo) => {
    setHovered(era);
    if (era.playable && !entering) setEntering(era);
  };

  return (
    <div className="relative h-full w-full bg-background">
      <AnimatePresence mode="wait">
        <motion.div
          key={hovered.id}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 0.45, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: "easeOut" }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${hovered.image})` }}
          aria-hidden
        />
      </AnimatePresence>
      <div className="vignette absolute inset-0" aria-hidden />
      <Embers count={20} />

      <div className="relative z-10 flex h-full flex-col p-5 sm:p-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Logo size={36} />
            <Link
              href="/"
              className="mt-4 block text-[11px] uppercase tracking-[0.3em] text-sand/70 transition-colors hover:text-gold"
            >
              ← Return
            </Link>
            <h2 className="glow-text mt-3 text-2xl uppercase text-parchment sm:text-4xl">
              The Time Portal
            </h2>
            <p className="mt-2 max-w-sm text-sm text-sand">
              Journeys through Ethiopian history. Step through one.
            </p>
          </div>
          <button
            onClick={() => setMezgebOpen(true)}
            className="hud-panel px-4 py-3 text-right transition-colors hover:text-gold"
          >
            <span className="block text-[10px] uppercase tracking-[0.3em] text-sand/70">
              <span className="font-geez normal-case">መዝገብ</span> · Discoveries
            </span>
            <span className="font-display text-2xl text-gold">{unlocked.length}</span>
          </button>
        </div>

        {/* Constellation map */}
        <div className="relative mt-6 flex-1">
          <svg className="absolute inset-0 h-full w-full" aria-hidden>
            <defs>
              <linearGradient id="thread" x1="0" x2="1">
                <stop offset="0%" stopColor="var(--gold)" stopOpacity="0.05" />
                <stop offset="50%" stopColor="var(--gold)" stopOpacity="0.45" />
                <stop offset="100%" stopColor="var(--gold)" stopOpacity="0.05" />
              </linearGradient>
            </defs>
            {ERAS.slice(0, -1).map((era, i) => {
              const next = ERAS[i + 1];
              return (
                <motion.line
                  key={era.id}
                  x1={`${era.mapX}%`}
                  y1={`${era.mapY}%`}
                  x2={`${next.mapX}%`}
                  y2={`${next.mapY}%`}
                  stroke="url(#thread)"
                  strokeWidth={1.5}
                  strokeDasharray="6 8"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.3 + i * 0.25, duration: 1.2 }}
                />
              );
            })}
          </svg>

          {ERAS.map((era, i) => {
            const active = hovered.id === era.id;
            return (
              <motion.button
                key={era.id}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: era.playable ? 1 : 0.7, scale: 1 }}
                transition={{ delay: 0.25 + i * 0.15, duration: 0.7 }}
                onMouseEnter={() => setHovered(era)}
                onFocus={() => setHovered(era)}
                onClick={() => select(era)}
                style={{ left: `${era.mapX}%`, top: `${era.mapY}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 text-center outline-none"
              >
                <span className="relative flex h-16 w-16 items-center justify-center sm:h-20 sm:w-20">
                  <span
                    className={`animate-pulse-ring absolute inset-0 rounded-full border ${
                      active ? "border-gold/70" : "border-gold/25"
                    }`}
                  />
                  <span
                    className={`relative flex h-full w-full items-center justify-center rounded-full border transition-all duration-500 ${
                      active
                        ? "scale-110 border-gold bg-gold/25 shadow-[var(--shadow-relic)]"
                        : "border-gold/40 bg-ink/70"
                    }`}
                  >
                    <span className="font-geez text-2xl text-gold sm:text-3xl">
                      {era.glyph}
                    </span>
                  </span>
                </span>
                <span
                  className={`mt-2 block font-display text-[11px] uppercase tracking-[0.25em] transition-colors sm:text-xs ${
                    active ? "text-parchment" : "text-sand/70"
                  }`}
                >
                  {era.name}
                </span>
                {!era.playable && (
                  <span className="block text-[9px] uppercase tracking-[0.3em] text-sand/50">
                    Coming soon
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Reveal card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={hovered.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.5 }}
            className="hud-panel relic-frame mt-4 flex flex-col gap-4 p-5 sm:flex-row sm:items-end sm:justify-between sm:p-6"
          >
            <div className="max-w-2xl">
              <p className="text-[10px] uppercase tracking-[0.4em] text-gold">
                {hovered.period}
              </p>
              <h3 className="mt-2 text-xl uppercase text-parchment sm:text-2xl">
                {hovered.name} <span className="font-geez normal-case text-gold/80">· {hovered.nameAm}</span>
              </h3>
              <p className="text-sm uppercase tracking-[0.2em] text-sand/80">
                {hovered.tagline}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-sand">{hovered.blurb}</p>
              {hovered.playable && (
                <p className="mt-3 text-xs uppercase tracking-[0.2em] text-sand/70">
                  You will play as: <span className="text-gold">{hovered.role}</span>
                </p>
              )}
            </div>
            <button
              disabled={!hovered.playable}
              onClick={() => select(hovered)}
              className="shrink-0 border border-gold/60 bg-gold/15 px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.3em] text-parchment transition-all duration-500 hover:bg-gold/30 hover:tracking-[0.36em] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-gold/15 disabled:hover:tracking-[0.3em]"
            >
              {hovered.playable ? "Enter Journey" : "Coming soon"}
            </button>
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {mezgebOpen && (
          <MezgebPanel
            key="mezgeb"
            unlocked={unlocked}
            onClose={() => setMezgebOpen(false)}
            onReset={resetUnlocked}
          />
        )}
        {entering && <EraTransition key="transition" era={entering} />}
      </AnimatePresence>
    </div>
  );
}