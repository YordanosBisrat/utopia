"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { notFound, useParams, useRouter } from "next/navigation";
import { miniGameById, miniGames, type MiniGame } from "@/lib/data";
import { actions } from "@/lib/store";
import { GhostButton, GoldButton, Sigil } from "@/components/utopia/ui";
import { cn } from "@/lib/utils";


export default function Play() {
  const { id } = useParams<{ id: string }>();
  const g = miniGameById(id) ?? notFound();
  const [run, setRun] = useState(0);
  return <Engine key={`${id}-${run}`} g={g} onAgain={() => setRun((r) => r + 1)} />;
}

function shuffle<T>(a: T[]) {
  return [...a].sort(() => Math.random() - 0.5);
}

function Engine({ g, onAgain }: { g: MiniGame; onAgain: () => void }) {
  const router = useRouter();
  const [time, setTime] = useState(g.time);
  const [result, setResult] = useState<null | { score: number; xp: number }>(null);
  const total = g.kind === "choice" ? g.rounds!.length : g.orderItems!.length;

  useEffect(() => {
    if (result) return;
    if (time <= 0) return;
    const t = setTimeout(() => setTime((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [time, result]);

  const finish = (correct: number) => {
    const score = Math.round((correct / total) * 100);
    const xp = Math.round((g.xp * correct) / total);
    actions.finishMiniGame(g.id, score, xp);
    setResult({ score, xp });
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (time === 0 && !result) finish(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time]);

  const next = miniGames[(miniGames.findIndex((m) => m.id === g.id) + 1) % miniGames.length];

  return (
    <div className="mx-auto max-w-3xl px-5 pt-28">
      <div className="flex items-center gap-4">
        <Sigil glyph={g.glyph} className="h-14 w-14" />
        <div>
          <div className="font-ethiopic text-sm text-gold-soft">{g.am}</div>
          <h1 className="text-2xl font-bold text-gold-gradient md:text-3xl">{g.title.toUpperCase()}</h1>
        </div>
        <div className={cn("ml-auto rounded-sm border px-3 py-1 font-display text-lg", time <= 10 ? "border-destructive text-destructive" : "border-gold/50 text-gold")}>{time}s</div>
      </div>

      <div className="mt-8">
        {result ? (
          <div className="parchment corners rounded-sm p-8 text-center">
            <div className="font-display text-xs tracking-[0.4em]">{result.score >= 50 ? "WELL PLAYED" : "KEEP EXPLORING"}</div>
            <h2 className="mt-2 text-4xl font-black">DISCOVERY COMPLETE</h2>
            <p className="mt-3 text-lg">Score {result.score}% · +{result.xp} XP</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <GoldButton onClick={onAgain}>PLAY AGAIN</GoldButton>
              <GhostButton onClick={() => router.push(`/minigames/${next.id}`)}>NEXT GAME</GhostButton>
              <Link href="/minigames" className="inline-flex items-center rounded-sm border border-parchment-foreground/40 px-5 py-3 font-display text-sm font-bold tracking-[0.2em]">RETURN</Link>
            </div>
          </div>
        ) : g.kind === "choice" ? (
          <ChoiceGame g={g} onDone={finish} />
        ) : (
          <OrderGame g={g} onDone={finish} />
        )}
      </div>
    </div>
  );
}

function ChoiceGame({ g, onDone }: { g: MiniGame; onDone: (c: number) => void }) {
  const rounds = g.rounds!;
  const [i, setI] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const r = rounds[i];
  const pick = (k: number) => {
    if (picked !== null) return;
    setPicked(k);
    const ok = k === r.answer;
    const c = correct + (ok ? 1 : 0);
    setCorrect(c);
    setTimeout(() => {
      if (i + 1 >= rounds.length) onDone(c);
      else {
        setI(i + 1);
        setPicked(null);
      }
    }, 900);
  };
  return (
    <div>
      <div className="mb-3 flex justify-between text-sm text-muted-foreground">
        <span>Round {i + 1} / {rounds.length}</span>
        <span className="text-gold">Score {correct}</span>
      </div>
      <div className="mb-4 h-1.5 rounded-full bg-muted">
        <div className="h-full rounded-full bg-gold transition-all" style={{ width: `${(i / rounds.length) * 100}%` }} />
      </div>
      <div className="panel corners overflow-hidden rounded-sm">
        {r.image && <img src={r.image} alt="Artifact" className="aspect-[16/9] w-full object-cover" />}
        {r.glyph && <div className="pattern-geez grid h-48 place-items-center font-ethiopic text-8xl text-gold-gradient">{r.glyph}</div>}
        <div className="p-5">
          <h2 className="text-xl font-bold text-foreground">{r.prompt}</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {r.options.map((o, k) => (
              <button
                key={o}
                onClick={() => pick(k)}
                className={cn(
                  "rounded-sm border-2 px-4 py-3 text-left font-semibold transition",
                  picked === null && "border-border hover:border-gold",
                  picked !== null && k === r.answer && "border-success bg-success/20",
                  picked === k && k !== r.answer && "border-destructive bg-destructive/15",
                )}
              >
                {o}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function OrderGame({ g, onDone }: { g: MiniGame; onDone: (c: number) => void }) {
  const items = g.orderItems!;
  const shuffled = useMemo(() => shuffle(items.map((_, i) => i)), [items]);
  const [chosen, setChosen] = useState<number[]>([]);
  const [wrong, setWrong] = useState<number | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const tap = (idx: number) => {
    if (chosen.includes(idx)) return;
    if (idx === chosen.length) {
      const c = [...chosen, idx];
      setChosen(c);
      if (c.length === items.length) setTimeout(() => onDone(Math.max(0, items.length - mistakes)), 500);
    } else {
      setWrong(idx);
      setMistakes((m) => m + 1);
      setTimeout(() => setWrong(null), 500);
    }
  };
  return (
    <div>
      <p className="mb-4 text-muted-foreground">{g.orderPrompt} <span className="text-gold">Mistakes: {mistakes}</span></p>
      <ol className="relative mb-6 space-y-2 border-l-2 border-gold/50 pl-5">
        {items.map((it, k) => (
          <li key={k} className={cn("text-sm", k < chosen.length ? "text-gold" : "text-muted-foreground/40")}>
            {k < chosen.length ? <><strong>{it.label}</strong> — {it.sub}</> : `Step ${k + 1}`}
          </li>
        ))}
      </ol>
      <div className="grid gap-3 sm:grid-cols-2">
        {shuffled.map((idx) => (
          <button
            key={idx}
            onClick={() => tap(idx)}
            disabled={chosen.includes(idx)}
            className={cn("panel rounded-sm p-4 text-left transition", chosen.includes(idx) ? "opacity-30" : "hover:panel-glow", wrong === idx && "border-destructive")}
          >
            <div className="font-semibold text-foreground">{items[idx].label}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
