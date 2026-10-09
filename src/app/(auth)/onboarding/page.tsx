"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { categories } from "@/lib/data";
import { actions, usePlayer, type Lang } from "@/lib/store";
import { useSession } from "@/lib/auth";
import { setLanguageName } from "@/game/bridge";
import { AuthCard, Field, FormError, submitClass } from "@/components/utopia/AuthShell";
import { cn } from "@/lib/utils";

type Level = "new" | "some" | "expert";

const LEVELS: { id: Level; title: string; sub: string }[] = [
  { id: "new", title: "I'm new here", sub: "Start with the basics and gentle hints." },
  { id: "some", title: "I know a little", sub: "A balanced mix of questions." },
  { id: "expert", title: "I know a lot", sub: "Give me the harder questions." },
];

const STEPS = ["Name", "Language", "Interests", "Level"] as const;

export default function OnboardingPage() {
  const router = useRouter();
  const session = useSession();
  const player = usePlayer();
  const [step, setStep] = useState(0);
  const [nameInput, setNameInput] = useState<string | null>(null);
  const [language, setLanguage] = useState<Lang>(player.language);
  const [interests, setInterests] = useState<string[]>([]);
  const [level, setLevel] = useState<Level | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Prefill with the account or player name until the user types something.
  const name = nameInput ?? session?.name ?? (player.name === "Explorer" ? "" : player.name);

  const toggle = (id: string) =>
    setInterests((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));

  const next = () => {
    setError(null);
    if (step === 0 && name.trim().length < 2) return setError("Please enter a name with at least 2 characters.");
    if (step === 2 && interests.length === 0) return setError("Pick at least one topic you'd like to explore.");
    if (step === 3 && !level) return setError("Choose the option that fits you best.");
    if (step < STEPS.length - 1) return setStep(step + 1);
    actions.completeOnboarding({ name, language, interests, level: level as Level });
    setLanguageName(language === "am" ? "Amharic" : "English");
    router.push("/portal");
  };

  return (
    <AuthCard
      title="Welcome to UTOPIA"
      am="እንኳን ወደ ዩቶፒያ በደህና መጡ"
      sub={`Step ${step + 1} of ${STEPS.length}: ${STEPS[step]}`}
      footer={
        <Link href="/" className="hover:text-gold" onClick={() => actions.completeOnboarding({ name: name || "Explorer", language, interests, level: level ?? "new" })}>
          Skip for now
        </Link>
      }
    >
      <div className="mb-5 flex gap-1.5" aria-hidden>
        {STEPS.map((s, i) => (
          <span key={s} className={cn("h-1 flex-1 rounded-full", i <= step ? "bg-gold" : "bg-border")} />
        ))}
      </div>

      <div className="space-y-4">
        {step === 0 && (
          <Field id="name" label="What should we call you?" value={name} onChange={setNameInput} autoComplete="given-name" placeholder="Your name" />
        )}

        {step === 1 && (
          <div className="grid grid-cols-2 gap-3">
            {([["en", "English", "English"], ["am", "አማርኛ", "Amharic"]] as const).map(([id, label, sub]) => (
              <button
                key={id}
                type="button"
                onClick={() => setLanguage(id)}
                className={cn(
                  "rounded-sm border px-4 py-5 text-center transition-colors",
                  language === id ? "border-gold bg-gold/15 text-gold" : "border-border hover:border-gold/60",
                )}
              >
                <div className="font-ethiopic text-xl">{label}</div>
                <div className="text-xs text-muted-foreground">{sub}</div>
              </button>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="flex max-h-72 flex-wrap gap-2 overflow-y-auto pr-1">
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => toggle(c.id)}
                aria-pressed={interests.includes(c.id)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-sm transition-colors",
                  interests.includes(c.id) ? "border-gold bg-gold/15 text-gold" : "border-border text-muted-foreground hover:border-gold/60",
                )}
              >
                {c.en}
              </button>
            ))}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-2">
            {LEVELS.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => setLevel(l.id)}
                className={cn(
                  "w-full rounded-sm border px-4 py-3 text-left transition-colors",
                  level === l.id ? "border-gold bg-gold/15" : "border-border hover:border-gold/60",
                )}
              >
                <div className={cn("font-semibold", level === l.id && "text-gold")}>{l.title}</div>
                <div className="text-xs text-muted-foreground">{l.sub}</div>
              </button>
            ))}
          </div>
        )}

        <FormError message={error} />

        <div className="flex gap-3">
          {step > 0 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="rounded-sm border border-border px-5 py-3 text-sm text-muted-foreground hover:border-gold/60 hover:text-gold"
            >
              BACK
            </button>
          )}
          <button type="button" onClick={next} className={submitClass}>
            {step === STEPS.length - 1 ? "ENTER UTOPIA" : "CONTINUE"}
          </button>
        </div>
      </div>
    </AuthCard>
  );
}
