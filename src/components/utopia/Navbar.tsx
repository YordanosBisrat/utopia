"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Mail, Menu, Search, Send, X } from "lucide-react";
import { usePlayer } from "@/lib/store";
import { logout, useSession } from "@/lib/auth";
import { tr, type TKey } from "@/lib/i18n";
import { setLanguageName } from "@/game/bridge";
import { openSearch } from "./SearchCommand";
import { LanguageToggle } from "./LanguageToggle";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/utils";
import { Avatar } from "./Avatar";

const links: { to: string; key: TKey }[] = [
  { to: "/explore", key: "explore" },
  { to: "/journey", key: "journey" },
  { to: "/portal", key: "portal" },
  { to: "/game", key: "game" },
  { to: "/challenge", key: "challenge" },
  { to: "/minigames", key: "minigames" },
  { to: "/mezgeb", key: "mezgeb" },
];


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
              className="h-10 w-10 rounded-full transition-opacity hover:opacity-80"
            >
              <Avatar name={p.name} src={p.avatar} className="h-10 w-10 text-sm" />
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

const socials = [
  { label: "Telegram", href: "#", icon: <Send className="h-4 w-4" /> },
  {
    label: "Facebook",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2.5" y="5" width="19" height="14" rx="4" />
        <path d="M10 9.5v5l4.5-2.5z" fill="currentColor" />
      </svg>
    ),
  },
  { label: "Email", href: "mailto:hello@utopia.et", icon: <Mail className="h-4 w-4" /> },
];

const footerLinks: { to: string; label: string }[] = [
  { to: "/explore", label: "Explore" },
  { to: "/journey", label: "Journey" },
  { to: "/portal", label: "Time Portal" },
  { to: "/game", label: "Game" },
  { to: "/mezgeb", label: "መዝገብ" },
  { to: "/profile", label: "Profile" },
  { to: "/settings", label: "Settings" },
];

export function UTOPIAFooter() {
  return (
    <footer className="mt-24 px-4 pb-6">
      <div className="tibeb mx-auto mb-5 w-full max-w-6xl" />
      <div className="panel mx-auto flex max-w-6xl flex-col items-center gap-5 rounded-md bg-card px-6 py-4 shadow-xl md:flex-row md:justify-between">
        {/* brand */}
        <Link href="/" className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/logo-mark.png" alt="UTOPIA" className="h-10 w-10 rounded-lg" loading="lazy" />
          <div className="leading-tight">
            <div className="font-display text-sm font-semibold tracking-[0.25em] text-gold">UTOPIA</div>
            <div className="text-[10px] tracking-wider text-muted-foreground">you-ጦቢያ</div>
          </div>
        </Link>

        {/* links */}
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          {footerLinks.map((l) => (
            <Link key={l.to} href={l.to} className="transition-colors hover:text-gold">
              {l.label}
            </Link>
          ))}
        </nav>

        {/* socials */}
        <div className="flex items-center gap-2">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              aria-label={s.label}
              className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-gold hover:bg-gold/10 hover:text-gold"
            >
              {s.icon}
            </a>
          ))}
        </div>
      </div>
      <p className="mt-4 text-center text-xs tracking-[0.3em] text-gold/80">WHERE ETHIOPIA COMES ALIVE.</p>
    </footer>
  );
}