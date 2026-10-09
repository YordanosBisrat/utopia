"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, Lock } from "lucide-react";
import { categoryById, type Category, type Exploration } from "@/lib/data";
import { levelOf } from "@/lib/store";
import { cn } from "@/lib/utils";

export function Sigil({ glyph, className }: { glyph: string; className?: string }) {
  return (
    <div className={cn("relative grid place-items-center", className)}>
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full text-gold" aria-hidden>
        <polygon points="50,3 61,20 80,12 78,33 97,40 84,55 95,72 74,74 70,95 50,84 30,95 26,74 5,72 16,55 3,40 22,33 20,12 39,20" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />
        <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.45" />
      </svg>
      <span className="relative font-ethiopic text-3xl text-gold-gradient">{glyph}</span>
    </div>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-glow">
      {children}
    </div>
  );
}

export function PageHeader({ eyebrow, title, am, sub }: { eyebrow: string; title: string; am?: string; sub?: string }) {
  return (
    <header className="mx-auto max-w-6xl px-5 pt-28 pb-8 md:pt-32">
      <title>{`${title} | UTOPIA`}</title>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1 className="mt-4 text-4xl font-bold text-gold-gradient md:text-6xl">{title}</h1>
      {am && <p className="mt-2 font-ethiopic text-xl text-gold-soft">{am}</p>}
      {sub && <p className="mt-3 max-w-2xl text-muted-foreground">{sub}</p>}
      <div className="tibeb mt-6 w-40" />
    </header>
  );
}

export function ExplorerCategoryCard({ c }: { c: Category }) {
  return (
    <Link
      href={`/explore?category=${c.id}`}
      className="group panel corners relative flex items-center gap-5 overflow-hidden rounded-sm p-5 transition-all duration-300 hover:-translate-y-1 hover:panel-glow md:p-6"
    >
      <div className="pattern-geez absolute inset-0 opacity-40 transition-transform duration-700 group-hover:scale-110" />
      <Sigil glyph={c.glyph} className="h-16 w-16 shrink-0 transition-transform duration-500 group-hover:rotate-12 md:h-20 md:w-20" />
      <div className="relative min-w-0 flex-1">
        <div className="text-xs tracking-[0.25em] text-emerald-glow">{c.num}</div>
        <div className="font-ethiopic text-xl text-gold-soft md:text-2xl">{c.am}</div>
        <div className="font-display text-sm font-semibold tracking-[0.2em] text-gold">{c.en.toUpperCase()}</div>
        <p className="mt-1 hidden text-sm text-muted-foreground sm:block">{c.blurb}</p>
        <span className="mt-2 block h-px origin-left scale-x-0 bg-gold transition-transform duration-500 group-hover:scale-x-100" />
      </div>
      <ArrowRight className="relative h-5 w-5 -translate-x-2 text-gold opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
    </Link>
  );
}

export function DiscoveryCard({ e, discovered, locked }: { e: Exploration; discovered?: boolean; locked?: boolean }) {
  const cat = categoryById(e.category)!;
  return (
    <Link
      href={`/explore/${e.id}`}
      className="group panel relative flex flex-col overflow-hidden rounded-sm transition-all duration-300 hover:-translate-y-1 hover:panel-glow"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-emerald-deep">
        {e.image ? (
          <img src={e.image} alt={e.title} loading="lazy" className={cn("h-full w-full object-cover transition-transform duration-700 group-hover:scale-105", locked && "blur-sm grayscale")} />
        ) : (
          <div className="pattern-geez grid h-full w-full place-items-center">
            <Sigil glyph={e.amharicTitle.charAt(0)} className="h-24 w-24" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        <span className="absolute top-3 left-3 rounded-sm border border-gold/50 bg-background/70 px-2 py-0.5 text-[10px] font-semibold tracking-[0.2em] text-gold">
          {cat.en.toUpperCase()}
        </span>
        {discovered && (
          <span className="absolute top-3 right-3 rounded-sm bg-gold px-2 py-0.5 text-[10px] font-bold tracking-widest text-primary-foreground">መዝገብ ✓</span>
        )}
        {locked && <Lock className="absolute top-3 right-3 h-4 w-4 text-gold" />}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="font-ethiopic text-sm text-gold-soft">{e.amharicTitle}</div>
        <h3 className="text-lg font-bold text-foreground">{e.title}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{e.description}</p>
        <div className="mt-auto flex items-center justify-between pt-3 text-xs">
          <span className="text-muted-foreground">{e.region ?? "Ethiopia"}</span>
          <span className="font-semibold tracking-widest text-gold">DISCOVER →</span>
        </div>
      </div>
    </Link>
  );
}

export function XPBar({ xp, className }: { xp: number; className?: string }) {
  const { level, into, per } = levelOf(xp);
  return (
    <div className={cn("w-full", className)}>
      <div className="mb-1 flex justify-between text-xs text-muted-foreground">
        <span>Level {level}</span>
        <span>{into} / {per} XP</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-gradient-to-r from-emerald-glow to-gold transition-all duration-700" style={{ width: `${(into / per) * 100}%` }} />
      </div>
    </div>
  );
}

export function LevelBadge({ xp, size = "md" }: { xp: number; size?: "sm" | "md" }) {
  const { level } = levelOf(xp);
  return (
    <div className={cn("relative grid place-items-center", size === "sm" ? "h-9 w-9" : "h-16 w-16")}>
      <svg viewBox="0 0 100 100" className="absolute inset-0 text-gold" aria-hidden>
        <polygon points="50,4 90,27 90,73 50,96 10,73 10,27" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="4" />
      </svg>
      <span className={cn("relative font-display font-bold text-gold", size === "sm" ? "text-sm" : "text-2xl")}>{level}</span>
    </div>
  );
}

export function AchievementBadge({ title, am, desc, unlocked }: { title: string; am: string; desc: string; unlocked: boolean }) {
  return (
    <div className={cn("panel flex items-center gap-4 rounded-sm p-4", unlocked ? "panel-glow" : "opacity-50")}>
      <div className={cn("grid h-12 w-12 shrink-0 place-items-center rounded-full border-2", unlocked ? "border-gold bg-gold/15" : "border-muted-foreground/40")}>
        {unlocked ? <span className="text-xl text-gold">✦</span> : <Lock className="h-4 w-4 text-muted-foreground" />}
      </div>
      <div>
        <div className="font-display text-sm font-bold tracking-wider text-gold">{title.toUpperCase()}</div>
        <div className="font-ethiopic text-xs text-gold-soft">{am}</div>
        <div className="text-xs text-muted-foreground">{desc}</div>
      </div>
    </div>
  );
}

export function GoldButton({ children, className, ...p }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...p}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-sm px-5 py-3 font-display text-sm font-bold tracking-[0.2em] text-primary-foreground transition-all hover:brightness-110 disabled:opacity-40 [background:var(--gradient-gold)] [box-shadow:var(--shadow-gold)]",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function GhostButton({ children, className, ...p }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...p}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-sm border border-gold/60 bg-background/40 px-5 py-3 font-display text-sm font-bold tracking-[0.2em] text-gold transition-all hover:bg-gold/10 disabled:opacity-40",
        className,
      )}
    >
      {children}
    </button>
  );
}

export const goldLinkClass =
  "inline-flex items-center justify-center gap-2 rounded-sm px-6 py-3 font-display text-sm font-bold tracking-[0.2em] text-primary-foreground transition-all hover:brightness-110 [background:var(--gradient-gold)] [box-shadow:var(--shadow-gold)]";
export const ghostLinkClass =
  "inline-flex items-center justify-center gap-2 rounded-sm border border-gold/60 bg-background/40 px-6 py-3 font-display text-sm font-bold tracking-[0.2em] text-gold backdrop-blur transition-all hover:bg-gold/10";
