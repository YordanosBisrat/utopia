"use client";

import Link from "next/link";
import { useEffect, lazy, Suspense } from "react";
import { notFound, useParams } from "next/navigation";
import { toast } from "sonner";
import { Heart } from "lucide-react";
import { categoryById, explorationById } from "@/lib/data";
import { actions, setExplorationContext, usePlayer } from "@/lib/store";
import { setGameSnapshot } from "@/game/bridge";
import { DiscoveryCard, Eyebrow, GhostButton, GoldButton, Sigil } from "@/components/utopia/ui";

const GoogleMapExplorer = lazy(() => import("@/components/utopia/GoogleMapExplorer").then((m) => ({ default: m.GoogleMapExplorer })));


export default function Detail() {
  const { id } = useParams<{ id: string }>();
  const e = explorationById(id) ?? notFound();
  const p = usePlayer();
  const discovered = p.discoveries.includes(e.id);
  const fav = p.favorites.includes(e.id);
  const cats = [e.category, ...e.tags].map((c) => categoryById(c)!).filter(Boolean);

  useEffect(() => {
    setExplorationContext(e.id);
    // The voice guide always knows which discovery you are reading
    setGameSnapshot({
      screen: "reading a discovery",
      discovery: e.title,
      region: e.region ?? "Ethiopia",
    });
    return () => {
      setExplorationContext(null);
      setGameSnapshot({});
    };
  }, [e.id, e.title, e.region]);

  return (
    <article>
      <section className="relative flex min-h-[70vh] items-end overflow-hidden">
        {e.image ? (
          <img src={e.image} alt={e.title} className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div className="pattern-geez absolute inset-0 grid place-items-center bg-emerald-deep">
            <Sigil glyph={e.amharicTitle.charAt(0)} className="h-56 w-56 opacity-60" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="relative mx-auto w-full max-w-6xl px-5 pb-12">
          <div className="flex flex-wrap gap-2">
            {cats.map((c) => (
              <Link key={c.id} href={`/explore?category=${c.id}`} className="rounded-sm border border-gold/60 bg-background/60 px-2 py-0.5 text-[11px] font-semibold tracking-[0.2em] text-gold">
                {c.en.toUpperCase()}
              </Link>
            ))}
          </div>
          <p className="mt-4 font-ethiopic text-2xl text-gold-soft">{e.amharicTitle}</p>
          <h1 className="text-5xl font-black text-gold-gradient md:text-7xl">{e.title.toUpperCase()}</h1>
          <p className="mt-3 max-w-2xl text-lg text-ivory/90">{e.description}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <GoldButton onClick={() => actions.discover(e.id)} disabled={discovered}>
              {discovered ? "IN YOUR መዝገብ ✓" : "ADD TO መዝገብ"}
            </GoldButton>
            <GhostButton onClick={() => toast("Tap the mic at the bottom of the screen and ask. UTOPIA knows which page you are on.")}>ASK UTOPIA</GhostButton>
            <GhostButton onClick={() => actions.toggleFavorite(e.id)} aria-label="Favorite">
              <Heart className={fav ? "h-4 w-4 fill-current" : "h-4 w-4"} />
            </GhostButton>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-10 px-5 pt-12 lg:grid-cols-[1fr_320px]">
        <div className="space-y-12">
          <section>
            <Eyebrow>Story</Eyebrow>
            <div className="mt-4 space-y-4 text-lg leading-relaxed text-foreground/90">
              {e.story.map((s, i) => (
                <p key={i} className={i === 0 ? "first-letter:float-left first-letter:mr-2 first-letter:font-display first-letter:text-6xl first-letter:text-gold" : ""}>
                  {s}
                </p>
              ))}
            </div>
          </section>

          {e.timeline && (
            <section>
              <Eyebrow>History · Timeline</Eyebrow>
              <ol className="relative mt-6 border-l-2 border-gold/50 pl-6">
                {e.timeline.map((t) => (
                  <li key={t.year} className="relative mb-6">
                    <span className="absolute top-1.5 -left-[33px] h-4 w-4 rotate-45 border-2 border-gold bg-background" />
                    <div className="font-display text-sm font-bold tracking-widest text-gold">{t.year}</div>
                    <div className="text-foreground/90">{t.event}</div>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {e.latitude != null && e.longitude != null && (
            <section>
              <Eyebrow>Discover {e.title}</Eyebrow>
              <div className="mt-4">
                <Suspense fallback={<div className="panel h-96 animate-pulse rounded-sm" />}>
                  <GoogleMapExplorer latitude={e.latitude} longitude={e.longitude} name={`${e.title}, ${e.region ?? "Ethiopia"}`} currentId={e.id} zoom={e.category === "nature" ? 9 : 13} />
                </Suspense>
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <GhostButton onClick={() => actions.discover(e.id)} disabled={discovered}>{discovered ? "IN መዝገብ ✓" : "ADD TO መዝገብ"}</GhostButton>
                <Link href="/journey" className="inline-flex items-center rounded-sm border border-gold/60 px-5 py-3 font-display text-sm font-bold tracking-[0.2em] text-gold hover:bg-gold/10">START JOURNEY</Link>
                <GhostButton onClick={() => toast("Tap the mic at the bottom of the screen and ask. UTOPIA knows which page you are on.")}>ASK UTOPIA</GhostButton>
              </div>
            </section>
          )}
        </div>

        <aside className="space-y-6">
          <div className="panel corners rounded-sm p-5">
            <div className="font-display text-sm font-bold tracking-[0.25em] text-gold">QUICK FACTS</div>
            <dl className="mt-4 space-y-3">
              {e.facts.map((f) => (
                <div key={f.label} className="flex justify-between gap-4 border-b border-border/50 pb-2 text-sm">
                  <dt className="text-muted-foreground">{f.label}</dt>
                  <dd className="text-right font-semibold text-foreground">{f.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="parchment corners rounded-sm p-5">
            <div className="font-display text-sm font-bold tracking-[0.25em]">DID YOU KNOW?</div>
            <p className="mt-2">{e.didYouKnow}</p>
          </div>
        </aside>
      </div>

      <section className="mx-auto mt-16 max-w-6xl px-5">
        <Eyebrow>Related discoveries</Eyebrow>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {e.relatedItems.map((r) => explorationById(r)).filter((x): x is NonNullable<typeof x> => !!x).map((r) => (
            <DiscoveryCard key={r.id} e={r} discovered={p.discoveries.includes(r.id)} />
          ))}
        </div>
      </section>
    </article>
  );
}
