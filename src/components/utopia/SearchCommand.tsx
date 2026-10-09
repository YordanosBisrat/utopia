"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { categories, explorations, miniGames, episodes } from "@/lib/data";

let setOpenExternal: ((v: boolean) => void) | null = null;
export const openSearch = () => setOpenExternal?.(true);

type Item = { key: string; group: string; label: string; sub?: string; am?: string; href: string; hay: string };

const PAGES: [string, string][] = [
  ["/portal", "Time Portal"],
  ["/game", "Game"],
  ["/journey", "Your Journey"],
  ["/challenge", "Today's Challenge"],
  ["/mezgeb", "መዝገብ"],
  ["/profile", "Profile"],
  ["/settings", "Settings"],
];

export function SearchCommand() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setOpenExternal = setOpen;
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) {
      const id = setTimeout(() => inputRef.current?.focus(), 30);
      return () => clearTimeout(id);
    }
  }, [open]);

  const items = useMemo<Item[]>(
    () => [
      ...explorations.map((e) => ({
        key: `e-${e.id}`, group: "Discoveries", label: e.title, am: e.amharicTitle, sub: e.category,
        href: `/explore/${e.id}`, hay: `${e.title} ${e.amharicTitle} ${e.category} ${e.tags.join(" ")}`.toLowerCase(),
      })),
      ...categories.map((c) => ({
        key: `c-${c.id}`, group: "Categories", label: c.en, am: c.am,
        href: `/explore?category=${c.id}`, hay: `category ${c.en} ${c.am}`.toLowerCase(),
      })),
      ...miniGames.map((g) => ({
        key: `g-${g.id}`, group: "Games", label: g.title, href: `/minigames/${g.id}`, hay: `game ${g.title}`.toLowerCase(),
      })),
      ...episodes.filter((e) => e.status === "available").map((e) => ({
        key: `t-${e.id}`, group: "Games", label: `Time Journey · ${e.title}`,
        href: `/game/${e.id}`, hay: `time journey game ${e.title}`.toLowerCase(),
      })),
      ...PAGES.map(([href, label]) => ({
        key: `p-${href}`, group: "Pages", label, href, hay: label.toLowerCase(),
      })),
    ],
    [],
  );

  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    return (s ? items.filter((i) => i.hay.includes(s)) : items.filter((i) => i.group === "Pages" || i.group === "Games")).slice(0, 30);
  }, [q, items]);

  if (!open) return null;

  const go = (href: string) => {
    setOpen(false);
    setQ("");
    router.push(href);
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center bg-background/80 p-4 pt-[12vh] backdrop-blur-sm"
      role="dialog"
      aria-label="Search"
      onClick={() => setOpen(false)}
    >
      <div className="panel w-full max-w-xl overflow-hidden rounded-sm bg-card" onClick={(e) => e.stopPropagation()}>
        <label className="flex items-center gap-3 border-b border-border px-4 py-3">
          <Search className="h-4 w-4 text-gold" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && results[0]) go(results[0].href);
            }}
            placeholder="Search anything about Ethiopia…"
            className="w-full bg-transparent text-base outline-none placeholder:text-muted-foreground"
          />
          <kbd className="rounded bg-muted px-1.5 text-[10px] text-muted-foreground">Esc</kbd>
        </label>
        <div className="max-h-[50vh] overflow-y-auto p-2">
          {results.length === 0 && (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">Nothing found on this path yet.</p>
          )}
          {results.map((r, i) => (
            <div key={r.key}>
              {(i === 0 || results[i - 1].group !== r.group) && (
                <div className="px-3 pt-2 pb-1 text-[10px] uppercase tracking-[0.3em] text-emerald-glow">{r.group}</div>
              )}
              <button
                onClick={() => go(r.href)}
                className="flex w-full items-center gap-3 rounded-sm px-3 py-2 text-left text-sm hover:bg-gold/10"
              >
                {r.am && <span className="font-ethiopic text-gold-soft">{r.am}</span>}
                <span>{r.label}</span>
                {r.sub && <span className="ml-auto text-xs text-muted-foreground">{r.sub}</span>}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
