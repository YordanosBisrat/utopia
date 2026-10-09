"use client";

import Link from "next/link";
import { miniGames } from "@/lib/data";
import { usePlayer } from "@/lib/store";
import { PageHeader, Sigil } from "@/components/utopia/ui";


export default function Library() {
  const p = usePlayer();
  return (
    <>
      <PageHeader eyebrow="Game library" title="MINI-GAMES" am="ትናንሽ ጨዋታዎች" sub="Quick quests. Real knowledge. Gold to earn." />
      <div className="mx-auto grid max-w-6xl gap-4 px-5 sm:grid-cols-2 lg:grid-cols-4">
        {miniGames.map((g) => (
          <Link key={g.id} href={`/minigames/${g.id}`} className="group panel corners flex flex-col items-center rounded-sm p-6 text-center transition hover:-translate-y-1 hover:panel-glow">
            <Sigil glyph={g.glyph} className="h-20 w-20 transition-transform group-hover:rotate-12" />
            <div className="mt-3 font-ethiopic text-sm text-gold-soft">{g.am}</div>
            <h3 className="font-display text-base font-bold tracking-widest text-gold">{g.title.toUpperCase()}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{g.blurb}</p>
            <div className="mt-auto pt-4 text-xs text-muted-foreground">
              {p.minigames[g.id] != null ? <span className="text-emerald-glow">Best: {p.minigames[g.id]}%</span> : `${g.time}s · +${g.xp} XP`}
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
