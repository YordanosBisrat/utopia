"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, Search, X } from "lucide-react";
import { usePlayer } from "@/lib/store";
import { logout, useSession } from "@/lib/auth";
import { tr, type TKey } from "@/lib/i18n";
import { setLanguageName } from "@/game/bridge";
import { openSearch } from "./SearchCommand";
import { LanguageToggle } from "./LanguageToggle";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/utils";

const links: { to: string; key: TKey }[] = [
  { to: "/explore", key: "explore" },
  { to: "/journey", key: "journey" },
  { to: "/portal", key: "portal" },
  { to: "/game", key: "game" },
  { to: "/challenge", key: "challenge" },
  { to: "/minigames", key: "minigames" },
  { to: "/mezgeb", key: "mezgeb" },
];

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "EX";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export function UTOPIANavbar() {
  const p = usePlayer();
  const session = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const lang = p.language;
  const active = (to: string) => pathname === to || pathname.startsWith(`${to}/`);

  // Keep the voice guide's language in step with the saved choice.
  useEffect(() => {
    setLanguageName(lang === "am" ? "Amharic" : "English");
  }, [lang]);

  // Close the profile menu when clicking elsewhere.
  useEffect(() => {
    if (!menu) return;
    const onDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenu(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [menu]);

  const signOut = () => {
    logout();
    setMenu(false);
    setOpen(false);
    router.push("/");
  };

  return (
    <nav className="fixed inset-x-0 top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4">
        <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/logo-mark.png" alt="UTOPIA" className="h-10 w-10 rounded-lg" />
          <span className="hidden font-display text-lg font-bold tracking-[0.2em] text-gold-gradient sm:block">UTOPIA</span>
        </Link>

        <div className="ml-2 hidden items-center gap-0.5 xl:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              href={l.to}
              className={cn(
                "rounded-sm px-2.5 py-2 text-sm transition-colors hover:text-gold",
                active(l.to) ? "text-gold" : "text-muted-foreground",
              )}
            >
              {tr(l.key, lang)}
            </Link>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-1">
          <button
            onClick={openSearch}
            aria-label={tr("search", lang)}
            title={`${tr("search", lang)} (Ctrl K)`}
            className="grid h-9 w-9 place-items-center rounded-sm text-muted-foreground transition-colors hover:bg-gold/10 hover:text-gold"
          >
            <Search className="h-5 w-5" />
          </button>
          <LanguageToggle />
          <ThemeToggle />

          {!session && (
            <Link
              href="/login"
              className="ml-1 hidden rounded-sm border border-gold/50 px-3 py-1.5 text-sm text-gold transition-colors hover:bg-gold/10 sm:block"
            >
              {tr("signin", lang)}
            </Link>
          )}

          <div className="relative ml-1" ref={menuRef}>
            <button
              onClick={() => setMenu((m) => !m)}
              aria-label="Account menu"
              aria-expanded={menu}
              className="grid h-10 w-10 place-items-center rounded-full border border-gold/60 font-display text-sm font-semibold text-gold transition-colors hover:bg-gold/10"
            >
              {initials(p.name)}
            </button>
            {menu && (
              <div className="panel absolute right-0 top-12 w-56 rounded-sm bg-card p-1 text-sm shadow-xl">
                <div className="border-b border-border px-3 py-2">
                  <div className="truncate font-semibold">{p.name}</div>
                  <div className="truncate text-xs text-muted-foreground">{session ? session.email : "Guest · not signed in"}</div>
                </div>
                <Link href="/profile" onClick={() => setMenu(false)} className="block rounded-sm px-3 py-2 hover:bg-gold/10">{tr("profile", lang)}</Link>
                <Link href="/settings" onClick={() => setMenu(false)} className="block rounded-sm px-3 py-2 hover:bg-gold/10">{tr("settings", lang)}</Link>
                {session ? (
                  <button onClick={signOut} className="block w-full rounded-sm px-3 py-2 text-left hover:bg-gold/10">{tr("signout", lang)}</button>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setMenu(false)} className="block rounded-sm px-3 py-2 hover:bg-gold/10">{tr("signin", lang)}</Link>
                    <Link href="/register" onClick={() => setMenu(false)} className="block rounded-sm px-3 py-2 hover:bg-gold/10">{tr("register", lang)}</Link>
                  </>
                )}
              </div>
            )}
          </div>

          <button className="ml-1 text-gold xl:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-background/95 px-4 py-3 xl:hidden">
          {links.map((l) => (
            <Link
              key={l.to}
              href={l.to}
              onClick={() => setOpen(false)}
              className={cn("block py-2 font-display tracking-widest", active(l.to) ? "text-gold" : "text-gold-soft")}
            >
              {tr(l.key, lang)}
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
      </div>
    </footer>
  );
}
