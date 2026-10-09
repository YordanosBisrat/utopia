"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { categories, categoryById, inCategory, searchExplorations } from "@/lib/data";
import { usePlayer } from "@/lib/store";
import { DiscoveryCard, PageHeader } from "@/components/utopia/ui";
import { cn } from "@/lib/utils";


const exploreHref = (category?: string, q?: string) => {
  const sp = new URLSearchParams();
  if (category) sp.set("category", category);
  if (q) sp.set("q", q);
  const s = sp.toString();
  return `/explore${s ? `?${s}` : ""}`;
};

export default function Explore() {
  return (
    <Suspense fallback={null}>
      <ExploreInner />
    </Suspense>
  );
}

function ExploreInner() {
  const sp = useSearchParams();
  const router = useRouter();
  const category = sp.get("category") ?? undefined;
  const q = sp.get("q") ?? "";
  const setQuery = (value: string | undefined, replace = false) => {
    const url = exploreHref(category, value);
    if (replace) router.replace(url);
    else router.push(url);
  };
  const p = usePlayer();
  const cat = category ? categoryById(category) : undefined;
  const results = searchExplorations(q).filter((e) => !category || inCategory(e, category));

  return (
    <>
      <PageHeader eyebrow="The encyclopedia" title="EXPLORE ETHIOPIA" am="ኢትዮጵያን ያስሱ" />
      <div className="mx-auto max-w-6xl px-5">
        <label className="panel flex items-center gap-3 rounded-sm px-4 py-3 focus-within:panel-glow">
          <Search className="h-5 w-5 text-gold" />
          <input
            value={q}
            onChange={(e) => setQuery(e.target.value || undefined, true)}
            placeholder="Search anything about Ethiopia..."
            className="w-full bg-transparent text-lg outline-none placeholder:text-muted-foreground"
          />
        </label>
        <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
          Try:
          {["Aksum", "Lalibela", "Coffee", "Ge'ez", "wolf", "Harar", "Adwa", "Lucy"].map((t) => (
            <button key={t} onClick={() => setQuery(t)} className="text-gold hover:underline">
              {t}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[220px_1fr]">
          <aside className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible">
            <Link href={exploreHref(undefined, q)} className={cn("shrink-0 rounded-sm border px-3 py-2 text-sm", !category ? "border-gold bg-gold/10 text-gold" : "border-border text-muted-foreground hover:text-gold")}>
              All discoveries
            </Link>
            {categories.map((c) => (
              <Link
                key={c.id}
                href={exploreHref(c.id, q)}
                className={cn("flex shrink-0 items-center gap-2 rounded-sm border px-3 py-2 text-sm", category === c.id ? "border-gold bg-gold/10 text-gold" : "border-border text-muted-foreground hover:text-gold")}
              >
                <span className="font-ethiopic text-gold-soft">{c.glyph}</span> {c.en}
              </Link>
            ))}
          </aside>

          <section>
            <div className="mb-4 flex items-baseline justify-between">
              <h2 className="text-xl font-bold text-gold">
                {cat ? (
                  <>
                    <span className="font-ethiopic">{cat.am}</span> · {cat.en}
                  </>
                ) : (
                  "All discoveries"
                )}
              </h2>
              <span className="text-sm text-muted-foreground">{results.length} found</span>
            </div>
            {results.length === 0 ? (
              <div className="panel rounded-sm p-10 text-center text-muted-foreground">No discoveries match yet. Try another word, or ask UTOPIA.</div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {results.map((e) => (
                  <DiscoveryCard key={e.id} e={e} discovered={p.discoveries.includes(e.id)} />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
