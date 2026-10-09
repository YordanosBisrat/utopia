"use client";

import Link from "next/link";
import { useState } from "react";
import { categories, explorations, inCategory } from "@/lib/data";
import { usePlayer } from "@/lib/store";
import { DiscoveryCard, PageHeader } from "@/components/utopia/ui";
import { cn } from "@/lib/utils";


export default function Mezgeb() {
  const p = usePlayer();
  const [cat, setCat] = useState<string | null>(null);
  const list = explorations.filter((e) => !cat || inCategory(e, cat));
  const pct = Math.round((p.discoveries.length / explorations.length) * 100);
  return (
    <>
      <PageHeader eyebrow="Your archive" title="መዝገብ" sub="Everything you've discovered." />
      <div className="mx-auto max-w-6xl px-5">
        <div className="panel mb-6 flex items-center gap-4 rounded-sm p-4">
          <span className="font-display text-3xl font-bold text-gold">{p.discoveries.length}</span>
          <span className="text-sm text-muted-foreground">of {explorations.length} entries discovered</span>
          <div className="ml-auto h-2 w-40 overflow-hidden rounded-full bg-muted">
            <div className="h-full bg-gold" style={{ width: `${pct}%` }} />
          </div>
        </div>
        <div className="mb-6 flex flex-wrap gap-2">
          <button onClick={() => setCat(null)} className={cn("rounded-sm border px-3 py-1 text-sm", !cat ? "border-gold text-gold" : "border-border text-muted-foreground")}>All</button>
          {categories.map((c) => (
            <button key={c.id} onClick={() => setCat(c.id)} className={cn("rounded-sm border px-3 py-1 text-sm", cat === c.id ? "border-gold text-gold" : "border-border text-muted-foreground")}>
              {c.en}
            </button>
          ))}
        </div>
        {p.discoveries.length === 0 && (
          <div className="parchment mb-6 rounded-sm p-5">
            Your መዝገብ is waiting. Open any discovery and tap <strong>Add to መዝገብ</strong> — <Link href="/explore/aksum" className="underline">start with Aksum</Link>.
          </div>
        )}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {list.map((e) => {
            const d = p.discoveries.includes(e.id);
            return <DiscoveryCard key={e.id} e={e} discovered={d} locked={!d} />;
          })}
        </div>
      </div>
    </>
  );
}
