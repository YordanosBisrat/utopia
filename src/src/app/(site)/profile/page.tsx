"use client";

import Link from "next/link";
import { achievements, episodes, explorations, journeyPath, miniGames } from "@/lib/data";
import { usePlayer, levelOf } from "@/lib/store";
import { AchievementBadge, LevelBadge, PageHeader, XPBar } from "@/components/utopia/ui";
import { images } from "@/lib/data";


export default function Profile() {
  const p = usePlayer();
  const placesDone = journeyPath.filter((n) => p.discoveries.includes(n.id)).length;
  const stats = [
    ["Level", levelOf(p.xp).level],
    ["XP", p.xp],
    ["Discoveries", `${p.discoveries.length}/${explorations.length}`],
    ["Challenges", p.completedChallenges.length],
    ["Streak", p.streak],
    ["Mini-games", `${Object.keys(p.minigames).length}/${miniGames.length}`],
    ["Time Journeys", `${p.episodes.length}/${episodes.filter((e) => e.status === "available").length}`],
    ["Journey", `${Math.round((placesDone / journeyPath.length) * 100)}%`],
  ] as const;
  return (
    <>
      <PageHeader eyebrow="Explorer" title={p.name.toUpperCase()} am="አሳሽ" />
      <div className="mx-auto max-w-6xl px-5">
        <div className="panel corners flex flex-col items-center gap-6 rounded-sm p-6 sm:flex-row">
          <img src={images.guideImg} alt="" className="h-24 w-24 rounded-full border-2 border-gold object-cover object-top" />
          <LevelBadge xp={p.xp} />
          <XPBar xp={p.xp} className="flex-1" />
          <Link href="/settings" className="text-sm text-gold underline">Edit name</Link>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {stats.map(([l, v]) => (
            <div key={l} className="panel rounded-sm p-4 text-center">
              <div className="font-display text-2xl font-bold text-gold">{v}</div>
              <div className="text-xs tracking-widest text-muted-foreground uppercase">{l}</div>
            </div>
          ))}
        </div>
        <h2 className="mt-12 text-2xl font-bold text-gold">ACHIEVEMENTS</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {achievements.map((a) => (
            <AchievementBadge key={a.id} {...a} unlocked={p.achievements.includes(a.id)} />
          ))}
        </div>
      </div>
    </>
  );
}
