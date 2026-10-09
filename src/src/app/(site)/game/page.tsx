"use client";

import Link from "next/link";
import { Lock } from "lucide-react";
import { EPISODE_CARDS, MAIN_GAME_CARD, MINIGAMES_CARD, type GameCard } from "@/game/cards";
import { usePlayer } from "@/lib/store";
import { PageHeader } from "@/components/utopia/ui";
import { cn } from "@/lib/utils";

function StatusPill({ card, done }: { card: GameCard; done: boolean }) {
  if (card.status === "playable")
    return (
      <span className="inline-block bg-gold px-3 py-1 font-display text-xs font-bold tracking-[0.3em] text-primary-foreground">
        {done ? "COMPLETED ✓ · REPLAY" : "AVAILABLE · PLAY"}
      </span>
    );
  if (card.status === "in-development")
    return (
      <span className="inline-block border border-emerald-glow/70 px-3 py-1 font-display text-xs tracking-[0.3em] text-emerald-glow">
        IN DEVELOPMENT
      </span>
    );
  return (
    <span className="inline-flex items-center gap-2 border border-muted-foreground/50 px-3 py-1 font-display text-xs tracking-[0.3em] text-muted-foreground">
      <Lock className="h-3 w-3" /> COMING SOON
    </span>
  );
}

function Card({ card, done = false, wide = false }: { card: GameCard; done?: boolean; wide?: boolean }) {
  const locked = card.status === "coming-soon";
  return (
    <Link
      href={card.href}
      className={cn(
        "group corners relative overflow-hidden rounded-sm border",
        wide ? "aspect-[16/8] md:col-span-2" : "aspect-[16/10]",
        locked ? "border-border opacity-80" : "border-gold/50 hover:panel-glow",
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={card.image}
        alt={card.title}
        loading="lazy"
        className={cn(
          "absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105",
          locked && "blur-[2px] grayscale",
        )}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
      <div className="relative flex h-full flex-col justify-end p-6">
        <div className="font-display text-xs font-bold tracking-[0.4em] text-emerald-glow">
          {card.tag} · {card.blurb}
        </div>
        <h2 className="mt-1 text-2xl font-black text-gold-gradient md:text-3xl">{card.title.toUpperCase()}</h2>
        {card.am && <div className="font-ethiopic text-sm text-gold-soft">{card.am}</div>}
        {card.role && (
          <div className="mt-2 text-sm text-muted-foreground">
            Role: <span className="text-gold-soft">{card.role}</span>
          </div>
        )}
        <div className="mt-4">
          <StatusPill card={card} done={done} />
        </div>
      </div>
    </Link>
  );
}

export default function GamePage() {
  const p = usePlayer();
  return (
    <>
      <PageHeader
        eyebrow="Play"
        title="THE GAME"
        am="ጨዋታ"
        sub="Step into Ethiopia's past, or play quick knowledge games. Choose a card."
      />
      <div className="mx-auto grid max-w-6xl gap-6 px-5 md:grid-cols-2">
        <Card card={MAIN_GAME_CARD} wide />

        <Link
          href="/portal"
          className="panel corners group flex items-center gap-5 rounded-sm p-6 transition hover:-translate-y-1 hover:panel-glow md:col-span-2"
        >
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full border-2 border-gold font-ethiopic text-2xl text-gold">አ</span>
          <div className="flex-1">
            <div className="font-display text-xs tracking-[0.4em] text-emerald-glow">TIME PORTAL</div>
            <h2 className="text-xl font-bold text-gold md:text-2xl">ENTER THE TIME PORTAL</h2>
            <p className="text-sm text-muted-foreground">
              A map of journeys through Ethiopian history. Step through a portal into Aksum.
            </p>
          </div>
          <span className="font-display text-sm tracking-widest text-gold">OPEN →</span>
        </Link>

        {EPISODE_CARDS.map((c) => (
          <Card key={c.id} card={c} done={p.episodes.includes(c.id)} />
        ))}
        <Card card={MINIGAMES_CARD} />
      </div>
    </>
  );
}
