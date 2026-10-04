"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { SceneBackdrop } from "./Atmosphere";

export function TitleScreen() {
  return (
    <div className="relative h-full w-full">
      <SceneBackdrop image="/art/title-hero.jpg" />

      <motion.div
        className="portal-glow pointer-events-none absolute left-[30%] top-[45%] h-[46vh] w-[46vh] -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
        animate={{ opacity: [0.45, 0.8, 0.45], scale: [1, 1.08, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden
      />

      <div className="relative z-10 flex h-full flex-col justify-end px-6 pb-14 sm:px-12 lg:px-20 lg:pb-20">
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="font-geez text-sm tracking-[0.4em] text-gold/80"
        >
          ኢትዮጵያ · WHERE ETHIOPIA COMES ALIVE
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 28, letterSpacing: "0.3em" }}
          animate={{ opacity: 1, y: 0, letterSpacing: "0.08em" }}
          transition={{ delay: 0.5, duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
          className="glow-text mt-3 max-w-4xl text-5xl font-semibold uppercase leading-[1.05] text-parchment sm:text-6xl lg:text-7xl"
        >
          Utopia{" "}
          <span className="font-geez text-gold normal-case">| you-ጦቢያ</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1.2 }}
          className="mt-4 max-w-xl text-base text-sand sm:text-lg"
        >
          What if there was an Ethiopian Encarta, but instead of reading it,
          you could explore it?
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="mt-9 flex flex-wrap items-center gap-5"
        >
          <Link
            href="/journey/aksum"
            className="group relative overflow-hidden border border-gold/60 bg-gold/15 px-8 py-4 text-sm font-semibold uppercase tracking-[0.3em] text-parchment transition-all duration-500 hover:bg-gold/30 hover:tracking-[0.36em]"
          >
            <span className="relative z-10">Enter Utopia</span>
            <span className="absolute inset-0 -translate-x-full bg-gold/25 transition-transform duration-700 group-hover:translate-x-0" />
          </Link>
          <p className="text-[11px] uppercase tracking-[0.35em] text-sand/60">
            Explore · Discover · Ask · Play · Unlock
          </p>
        </motion.div>
      </div>
    </div>
  );
}