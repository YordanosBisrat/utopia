"use client";

/* eslint-disable react/no-unescaped-entities */

import Link from "next/link";
import { useEffect, useState } from "react";
import { categories, images, episodes } from "@/lib/data";
import { ExplorerCategoryCard, Eyebrow, goldLinkClass, ghostLinkClass } from "@/components/utopia/ui";


export default function Index() {
  const [y, setY] = useState(0);
  useEffect(() => {
    const on = () => setY(window.scrollY);
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <>
      <section className="relative flex min-h-[100svh] items-end overflow-hidden">
        <img
          src={images.heroImg}
          alt="A young explorer overlooking the Ethiopian highlands and the stelae of Aksum"
          width={1920}
          height={1088}
          className="absolute inset-0 h-[115%] w-full object-cover object-[30%_center]"
          style={{ transform: `translateY(${y * 0.25}px)` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />
        <div className="relative mx-auto w-full max-w-7xl px-5 pb-20 md:pb-28">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/logo-mark.png" alt="UTOPIA you-ጦቢያ" className="mb-6 h-28 w-28 rounded-3xl animate-float md:h-36 md:w-36" />
          <h1 className="text-5xl leading-[0.95] font-black text-gold-gradient md:text-3xl lg:text-4xl">
            An Ethiopian knowledge universe
          
          </h1>
          <p className="mt-6 max-w-xl text-lg text-ivory/90">
            Explore the people, places, stories, cultures and wonders of Ethiopia through discovery, games and journeys.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/explore" className={goldLinkClass}>START EXPLORING</Link>
            <Link href="/portal" className={ghostLinkClass}>ENTER THE TIME PORTAL</Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pt-20">
        <h2 className="mt-4 text-3xl font-bold text-gold-gradient md:text-5xl">WHAT WILL YOU DISCOVER?</h2>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {categories.map((c) => (
            <ExplorerCategoryCard key={c.id} c={c} />
          ))}
        </div>
      </section>

      <section className="relative mt-24 overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 md:grid-cols-2">
          <div className="relative">
            <img src={episodes[0].image} alt="Kingdom of Aksum" loading="lazy" className="corners aspect-[4/3] w-full rounded-sm border border-gold/40 object-cover" />
            <span className="absolute -bottom-4 left-6 bg-gold px-3 py-1 font-display text-xs font-bold tracking-[0.3em] text-primary-foreground">EPISODE 01</span>
          </div>
          <div>
            <h2 className="mt-4 text-3xl font-bold text-gold-gradient md:text-4xl">STEP INTO ETHIOPIA'S PAST.</h2>
            <p className="mt-4 text-muted-foreground">
              It's 340 CE. You are a scribe's apprentice in Aksum, carrying a message through the market beneath the great stelae. Talk to the people, examine the stones, and discover what history left behind.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/game/aksum" className={goldLinkClass}>PLAY EPISODE 01</Link>
              <Link href="/game" className={ghostLinkClass}>SEE THE GAME</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-6xl px-5">
        <div className="parchment corners relative grid gap-6 rounded-sm p-8 md:grid-cols-[auto_1fr] md:p-12">
          <img src={images.guideImg} alt="Your UTOPIA guide" loading="lazy" className="h-40 w-32 rounded-sm object-cover object-top md:h-56 md:w-44" />
          <div>
            <p className="font-ethiopic text-lg">ጠይቀኝ</p>
            <h2 className="text-3xl font-bold">Ask UTOPIA</h2>
            <p className="mt-3 max-w-lg">
              Your companion on the road. Ask "Why is this important?" while you stand in Aksum, and your guide knows exactly what you mean, in English or አማርኛ.
            </p>
            <p className="mt-4 text-sm font-semibold tracking-widest">TAP THE MIC AT THE BOTTOM AND ASK ↓</p>
          </div>
        </div>
      </section>
    </>
  );
}
