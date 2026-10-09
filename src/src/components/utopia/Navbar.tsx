"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, Search, X } from "lucide-react";
import { usePlayer, levelOf } from "@/lib/store";
import { openSearch } from "./SearchCommand";
import { cn } from "@/lib/utils";

const links = [
  { to: "/explore", label: "Explore" },
  { to: "/journey", label: "Journey" },
  { to: "/portal", label: "Time Portal" },
  { to: "/game", label: "Game" },
  { to: "/challenge", label: "Challenge" },
  { to: "/minigames", label: "Mini-Games" },
  { to: "/mezgeb", label: "መዝገብ" },
] as const;

export function UTOPIANavbar() {
  const p = usePlayer();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const active = (to: string) => pathname === to || pathname.startsWith(`${to}/`);

  return (
    <nav className="fixed inset-x-0 top-0 z-40 border-b border-border/60 bg-background/75 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4">
        <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/logo-mark.png" alt="UTOPIA" className="h-10 w-10 rounded-lg" />
          <span className="hidden font-display text-lg font-bold tracking-[0.2em] text-gold-gradient sm:block">UTOPIA</span>
        </Link>
        <div className="ml-2 hidden items-center gap-0.5 lg:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              href={l.to}
              className={cn(
                "rounded-sm px-2.5 py-2 text-sm transition-colors hover:text-gold",
                active(l.to) ? "text-gold" : "text-muted-foreground",
              )}
            >
              {l.label}
            </Link>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={openSearch}
            className="flex items-center gap-2 rounded-sm border border-border px-3 py-1.5 text-sm text-muted-foreground hover:border-gold/60 hover:text-gold"
          >
            <Search className="h-4 w-4" />
            <span className="hidden md:inline">Search</span>
            <kbd className="hidden rounded bg-muted px-1.5 text-[10px] md:inline">Ctrl K</kbd>
          </button>
          <Link href="/profile" className="flex items-center gap-2 rounded-sm border border-gold/40 px-2 py-1 hover:bg-gold/10">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-gold/20 font-display text-xs font-bold text-gold">
              {levelOf(p.xp).level}
            </span>
            <span className="hidden text-xs text-gold sm:inline">{p.xp} XP</span>
          </Link>
          <button className="text-gold lg:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-border bg-background/95 px-4 py-3 lg:hidden">
          {[...links, { to: "/profile", label: "Profile" } as const, { to: "/settings", label: "Settings" } as const].map((l) => (
            <Link
              key={l.to}
              href={l.to}
              onClick={() => setOpen(false)}
              className={cn("block py-2 font-display tracking-widest", active(l.to) ? "text-gold" : "text-gold-soft")}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}

export function UTOPIAFooter() {
  return (
    <footer className="mt-24 border-t border-border/60">
      <div className="tibeb w-full" />
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-5 py-10 text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/logo-mark.png" alt="UTOPIA" className="h-16 w-16 rounded-xl" loading="lazy" />
        <p className="font-display tracking-[0.3em] text-gold">WHERE ETHIOPIA COMES ALIVE.</p>
        <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
          <Link href="/explore" className="hover:text-gold">Explore</Link>
          <Link href="/journey" className="hover:text-gold">Journey</Link>
          <Link href="/portal" className="hover:text-gold">Time Portal</Link>
          <Link href="/game" className="hover:text-gold">Game</Link>
          <Link href="/mezgeb" className="hover:text-gold">መዝገብ</Link>
          <Link href="/profile" className="hover:text-gold">Profile</Link>
          <Link href="/settings" className="hover:text-gold">Settings</Link>
        </div>
        <p className="text-xs text-muted-foreground">UTOPIA | you-ጦቢያ</p>
        <p className="max-w-md text-[11px] text-muted-foreground/70">
          Scene art is AI-generated concept art. Encyclopedia entries are being checked against
          sources. See the credits in the project docs.
        </p>
      </div>
    </footer>
  );
}
