"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { Lock } from "lucide-react";
import { episodes } from "@/lib/data";
import { GhostButton, GoldButton, PageHeader } from "@/components/utopia/ui";

// Episodes other than Aksum are not playable yet.
export default function EpisodePage() {
  const { episode } = useParams<{ episode: string }>();
  const ep = episodes.find((e) => e.id === episode) ?? notFound();

  return (
    <>
      <PageHeader eyebrow={`Episode ${ep.num} · ${ep.era}`} title={ep.title.toUpperCase()} sub={`You will play as: ${ep.role}`} />
      <div className="mx-auto max-w-6xl px-5">
        <div className="corners relative aspect-[16/8] overflow-hidden rounded-sm border border-border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={ep.image} alt={ep.title} className="h-full w-full object-cover blur-[2px] grayscale" />
          <div className="absolute inset-0 grid place-items-center bg-background/60">
            <div className="text-center">
              <Lock className="mx-auto h-8 w-8 text-gold" />
              <p className="mt-3 font-display tracking-[0.3em] text-gold">COMING SOON</p>
              <p className="mt-1 text-sm text-muted-foreground">This journey is still being built.</p>
            </div>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/game"><GoldButton>BACK TO THE GAME</GoldButton></Link>
          <Link href="/portal"><GhostButton>OPEN THE TIME PORTAL</GhostButton></Link>
        </div>
      </div>
    </>
  );
}
