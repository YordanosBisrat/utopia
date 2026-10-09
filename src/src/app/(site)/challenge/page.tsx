"use client";

/* eslint-disable react/no-unescaped-entities */

import Link from "next/link";
import { useState } from "react";
import { challenges, todaysChallengeIndex } from "@/lib/data";
import { actions, today, usePlayer } from "@/lib/store";
import { GhostButton, GoldButton, PageHeader } from "@/components/utopia/ui";
import { cn } from "@/lib/utils";


export default function ChallengePage() {
  const p = usePlayer();
  const c = challenges[todaysChallengeIndex()];
  const doneToday = p.completedChallenges.some((x) => x.startsWith(today()));
  const [picked, setPicked] = useState<number | null>(null);
  const [hints, setHints] = useState(0);
  const answered = picked !== null;
  const correct = picked === c.answer;

  return (
    <>
      <PageHeader eyebrow="Daily" title="TODAY'S CHALLENGE" am="የዛሬው ፈተና" />
      <div className="mx-auto max-w-3xl px-5">
        <div className="mb-4 flex gap-3 text-sm">
          <span className="panel rounded-sm px-3 py-1 text-gold">🔥 Streak {p.streak}</span>
          <span className="panel rounded-sm px-3 py-1 text-gold">+{c.xp} XP</span>
        </div>
        <div className="parchment corners rounded-sm p-6 md:p-10">
          <h2 className="text-2xl font-bold md:text-3xl">{c.question}</h2>
          {doneToday && !answered ? (
            <div className="mt-6">
              <p>You've already conquered today's challenge. Come back tomorrow to keep your streak!</p>
              <Link href={`/explore/${c.explorationId}`} className="mt-4 inline-block font-semibold underline">Read the story behind it →</Link>
            </div>
          ) : (
            <>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {c.options.map((o, i) => (
                  <button
                    key={o}
                    disabled={answered}
                    onClick={() => {
                      setPicked(i);
                      actions.answerChallenge(c.id, i === c.answer, c.xp);
                    }}
                    className={cn(
                      "rounded-sm border-2 px-4 py-3 text-left font-semibold transition",
                      !answered && "border-parchment-foreground/30 hover:border-gold-deep",
                      answered && i === c.answer && "border-success bg-success/20",
                      answered && i === picked && i !== c.answer && "border-destructive bg-destructive/15",
                      answered && i !== c.answer && i !== picked && "opacity-50",
                    )}
                  >
                    {String.fromCharCode(65 + i)}. {o}
                  </button>
                ))}
              </div>
              {hints > 0 && (
                <ul className="mt-4 list-disc pl-5 text-sm">
                  {c.hints.slice(0, hints).map((h) => <li key={h}>{h}</li>)}
                </ul>
              )}
              {answered && (
                <div className="mt-6">
                  <p className="text-xl font-bold">{correct ? `Correct! +${c.xp} XP` : "Not quite — but you learned something. +5 XP"}</p>
                  <Link href={`/explore/${c.explorationId}`} className="mt-2 inline-block font-semibold underline">Discover the full story →</Link>
                </div>
              )}
            </>
          )}
        </div>
        {!answered && !doneToday && (
          <div className="mt-4 flex gap-3">
            <GhostButton onClick={() => setHints((h) => Math.min(h + 1, c.hints.length))} disabled={hints >= c.hints.length}>
              HINT ({c.hints.length - hints})
            </GhostButton>
          </div>
        )}
        {answered && (
          <div className="mt-4 flex gap-3">
            <Link href="/minigames"><GoldButton>PLAY A MINI-GAME</GoldButton></Link>
          </div>
        )}
      </div>
    </>
  );
}
