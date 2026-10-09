"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { categoryById, challenges, explorationById, todaysChallengeIndex } from "@/lib/data";
import { actions, levelOf, today, usePlayer } from "@/lib/store";
import { GhostButton, GoldButton, PageHeader } from "@/components/utopia/ui";
import { cn } from "@/lib/utils";

const RANKS = ["Explorer", "Wayfinder", "Scribe", "Chronicler", "Keeper"];
const noop = () => () => {};

export default function ChallengePage() {
  const p = usePlayer();
  // Date-based values are read on the client only, so the server and browser HTML always match.
  const baseIndex = useSyncExternalStore(noop, () => todaysChallengeIndex(), () => 0);
  const todayKey = useSyncExternalStore(noop, () => today(), () => "");

  const [offset, setOffset] = useState(0); // 0 = today's challenge, anything else = practice
  const [picked, setPicked] = useState<number | null>(null);
  const [hints, setHints] = useState(0);

  const count = challenges.length;
  const c = challenges[(baseIndex + offset) % count];
  const practice = offset % count !== 0;
  const ex = explorationById(c.explorationId);
  const cat = ex ? categoryById(ex.category) : undefined;
  const rank = RANKS[Math.min(levelOf(p.xp).level - 1, RANKS.length - 1)];
  const doneToday = !practice && !!todayKey && p.completedChallenges.some((x) => x.startsWith(todayKey));
  const answered = picked !== null;
  const correct = picked === c.answer;

  const nextQuestion = () => {
    setOffset((o) => o + 1);
    setPicked(null);
    setHints(0);
  };

  const choose = (i: number) => {
    setPicked(i);
    if (!practice) actions.answerChallenge(c.id, i === c.answer, c.xp);
  };

  return (
    <>
      <PageHeader eyebrow={practice ? "Practice" : "Daily"} title="TODAY'S CHALLENGE" am="የዛሬው ፈተና" />
      <div className="mx-auto max-w-6xl px-5">
        <div className="mb-6 flex flex-wrap gap-3 text-sm">
          <span className="panel rounded-sm px-3 py-1 text-gold">🔥 Streak {p.streak}</span>
          <span className="panel rounded-sm px-3 py-1 text-gold">{practice ? "Practice: no XP" : `+${c.xp} XP`}</span>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[1.05fr_1fr] lg:gap-12">
          {/* Picture */}
          <div className="corners relative aspect-[4/3] overflow-hidden rounded-md border border-border bg-card">
            {ex ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={ex.image} alt={answered ? ex.title : "A clue picture for today's question"} className="h-full w-full object-cover" />
            ) : (
              <div className="pattern-geez h-full w-full" />
            )}
            {answered && ex && (
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/90 to-transparent p-4">
                <div className="font-display text-sm tracking-[0.3em] text-gold">{ex.title.toUpperCase()}</div>
              </div>
            )}
          </div>

          {/* Question */}
          <div>
            <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-gold">
              {cat ? cat.en : "Ethiopia"} · {rank}
            </div>

            <h2 className="mt-4 font-sans text-3xl font-bold leading-tight tracking-normal md:text-4xl">{c.question}</h2>
            {c.prompt && <p className="mt-4 text-muted-foreground">{c.prompt}</p>}

            {doneToday && !answered ? (
              <div className="mt-8 rounded-md border border-border bg-card/60 p-5">
                <p>You&apos;ve already conquered today&apos;s challenge. Come back tomorrow to keep your streak!</p>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <GoldButton onClick={nextQuestion}>PRACTICE ANOTHER QUESTION</GoldButton>
                  <Link href={`/explore/${c.explorationId}`} className="font-semibold text-gold underline">
                    Read the story behind it →
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  {c.options.map((o, i) => (
                    <button
                      key={o}
                      disabled={answered}
                      onClick={() => choose(i)}
                      className={cn(
                        "rounded-md border bg-card/60 px-5 py-4 text-left text-lg transition",
                        !answered && "border-border hover:border-gold hover:bg-gold/10",
                        answered && i === c.answer && "border-success bg-success/20",
                        answered && i === picked && i !== c.answer && "border-destructive bg-destructive/15",
                        answered && i !== c.answer && i !== picked && "border-border opacity-50",
                      )}
                    >
                      {o}
                    </button>
                  ))}
                </div>

                {hints > 0 && (
                  <ul className="mt-5 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                    {c.hints.slice(0, hints).map((h) => (
                      <li key={h}>{h}</li>
                    ))}
                  </ul>
                )}

                {!answered && (
                  <div className="mt-5">
                    <GhostButton onClick={() => setHints((h) => Math.min(h + 1, c.hints.length))} disabled={hints >= c.hints.length}>
                      HINT ({c.hints.length - hints})
                    </GhostButton>
                  </div>
                )}

                {answered && (
                  <div className="mt-6" role="status">
                    <p className="text-xl font-bold">
                      {correct
                        ? practice ? "Correct!" : `Correct! +${c.xp} XP`
                        : practice ? "Not quite, but you learned something." : "Not quite, but you learned something. +5 XP"}
                    </p>
                    <Link href={`/explore/${c.explorationId}`} className="mt-2 inline-block font-semibold text-gold underline">
                      Discover the full story →
                    </Link>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <GoldButton onClick={nextQuestion}>NEXT QUESTION</GoldButton>
                      <Link href="/minigames"><GhostButton>PLAY A MINI-GAME</GhostButton></Link>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
