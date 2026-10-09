"use client";

import Link from "next/link";
import { Lock } from "lucide-react";
import { achievements, explorationById, journeyPath } from "@/lib/data";
import { usePlayer, levelOf } from "@/lib/store";
import { AchievementBadge, LevelBadge, PageHeader, XPBar } from "@/components/utopia/ui";
import { cn } from "@/lib/utils";


// Simplified Ethiopia silhouette in a 100x100 box.
const SHAPE = "M40,4 L58,3 L66,8 L72,16 L80,20 L84,30 L90,38 L98,44 L92,52 L84,58 L76,66 L66,78 L58,86 L48,92 L38,88 L28,82 L18,74 L10,64 L6,54 L10,44 L16,36 L20,26 L28,16 Z";

export default function Journey() {
  const p = usePlayer();
  // Node unlocked if first, or previous one discovered
  const nodes = journeyPath.map((n, i) => {
    const discovered = p.discoveries.includes(n.id);
    const unlocked = i === 0 || p.discoveries.includes(journeyPath[i - 1].id) || discovered;
    return { ...n, discovered, unlocked, e: explorationById(n.id)! };
  });
  const done = nodes.filter((n) => n.discovered).length;

  return (
    <>
      <PageHeader eyebrow="Roots & routes" title="YOUR JOURNEY" am="ጉዞዎ" sub="Discover a place to light the golden path to the next one." />
      <div className="mx-auto grid max-w-6xl gap-8 px-5 lg:grid-cols-[1fr_300px]">
        <div className="panel corners relative aspect-square overflow-hidden rounded-sm md:aspect-[4/3]">
          <div className="pattern-geez absolute inset-0 opacity-50" />
          <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" className="absolute inset-0 h-full w-full">
            <path d={SHAPE} className="fill-emerald/20 stroke-gold" strokeWidth="0.5" />
            {nodes.slice(1).map((n, i) => {
              const a = nodes[i];
              const lit = a.discovered;
              return (
                <line key={n.id} x1={a.x} y1={a.y} x2={n.x} y2={n.y} strokeWidth={lit ? 0.8 : 0.4} strokeDasharray={lit ? "0" : "1.2 1.2"} className={lit ? "stroke-gold" : "stroke-muted-foreground/50"} />
              );
            })}
          </svg>
          {nodes.map((n) => {
            const body = (
              <>
                <span className={cn("grid h-9 w-9 place-items-center rounded-full border-2 transition-transform group-hover:scale-110", n.discovered ? "border-gold bg-gold text-primary-foreground [box-shadow:var(--shadow-gold)]" : n.unlocked ? "animate-pulse-ring border-gold bg-background text-gold" : "border-muted-foreground/50 bg-background text-muted-foreground")}>
                  {n.unlocked ? <span className="font-ethiopic text-sm">{n.e.amharicTitle.charAt(0)}</span> : <Lock className="h-3.5 w-3.5" />}
                </span>
                <span className={cn("mt-1 rounded-sm bg-background/80 px-1.5 text-[10px] font-semibold tracking-wider whitespace-nowrap", n.unlocked ? "text-gold" : "text-muted-foreground")}>{n.e.title}</span>
              </>
            );
            const style = { left: `${n.x}%`, top: `${n.y}%` };
            return n.unlocked ? (
              <Link key={n.id} href={`/explore/${n.id}`} className="group absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center" style={style}>
                {body}
              </Link>
            ) : (
              <div key={n.id} className="absolute flex -translate-x-1/2 -translate-y-1/2 cursor-not-allowed flex-col items-center" style={style} title="Discover the previous place to unlock">
                {body}
              </div>
            );
          })}
        </div>

        <aside className="space-y-4">
          <div className="panel flex items-center gap-4 rounded-sm p-5">
            <LevelBadge xp={p.xp} />
            <div className="flex-1">
              <div className="font-display text-sm tracking-widest text-gold">LEVEL {levelOf(p.xp).level}</div>
              <XPBar xp={p.xp} className="mt-2" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Stat label="Discoveries" value={p.discoveries.length} />
            <Stat label="XP" value={p.xp} />
            <Stat label="Journey" value={`${Math.round((done / nodes.length) * 100)}%`} />
            <Stat label="Achievements" value={`${p.achievements.length}/${achievements.length}`} />
          </div>
          <div className="space-y-2">
            {achievements.slice(0, 4).map((a) => (
              <AchievementBadge key={a.id} {...a} unlocked={p.achievements.includes(a.id)} />
            ))}
          </div>
        </aside>
      </div>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="panel rounded-sm p-4 text-center">
      <div className="font-display text-2xl font-bold text-gold">{value}</div>
      <div className="text-xs tracking-widest text-muted-foreground uppercase">{label}</div>
    </div>
  );
}
