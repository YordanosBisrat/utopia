"use client";

import Link from "next/link";
import { GhostButton, GoldButton, PageHeader } from "@/components/utopia/ui";

// TEAMMATE: this is the slot for the main game.
//  Option A: set NEXT_PUBLIC_MAIN_GAME_URL (for example a separately hosted build)
//            and the Launch button below appears automatically.
//  Option B: replace this page with the game itself (keep the file path).
const MAIN_GAME_URL = process.env.NEXT_PUBLIC_MAIN_GAME_URL;

export default function MainGamePage() {
  return (
    <>
      <PageHeader
        eyebrow="Featured"
        title="THE MAIN GAME"
        am="ዋናው ጨዋታ"
        sub="The full UTOPIA adventure is being designed by the team."
      />
      <div className="mx-auto max-w-3xl px-5">
        <div className="panel corners rounded-sm p-8 text-center">
          <p className="font-display text-xs tracking-[0.4em] text-emerald-glow">IN DEVELOPMENT</p>
          <p className="mt-3 text-muted-foreground">
            While it is being built, you can play Episode 01 in the Time Portal or try a mini-game.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {MAIN_GAME_URL && (
              <a href={MAIN_GAME_URL} target="_blank" rel="noreferrer">
                <GoldButton>LAUNCH THE MAIN GAME</GoldButton>
              </a>
            )}
            <Link href="/game/aksum"><GoldButton>PLAY EPISODE 01</GoldButton></Link>
            <Link href="/game"><GhostButton>BACK TO THE CARDS</GhostButton></Link>
          </div>
        </div>
      </div>
    </>
  );
}
