"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { actions, usePlayer } from "@/lib/store";
import { GhostButton, GoldButton, PageHeader } from "@/components/utopia/ui";
import { cn } from "@/lib/utils";
import { AvatarEditor } from "@/components/utopia/AvatarEditor";


export default function SettingsPage() {
  const p = usePlayer();
  const [name, setName] = useState(p.name);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setName(p.name), [p.name]);
  return (
    <>
      <PageHeader eyebrow="Your camp" title="SETTINGS" am="ቅንብሮች" />
      <div className="mx-auto max-w-2xl space-y-6 px-5">
        <AvatarEditor />
        <section className="panel rounded-sm p-5">
          <label className="font-display text-sm tracking-widest text-gold">EXPLORER NAME</label>
          <div className="mt-3 flex gap-3">
            <input value={name} onChange={(e) => setName(e.target.value)} maxLength={30} className="h-11 flex-1 rounded-sm border border-input bg-background px-3 outline-none focus:border-gold" />
            <GoldButton onClick={() => { actions.setName(name.trim()); toast.success("Name saved"); }}>SAVE</GoldButton>
          </div>
        </section>
        <section className="panel rounded-sm p-5">
          <div className="font-display text-sm tracking-widest text-gold">ASK UTOPIA LANGUAGE</div>
          <div className="mt-3 flex gap-2">
            {([["en", "English"], ["am", "አማርኛ"]] as const).map(([l, label]) => (
              <button key={l} onClick={() => actions.setLanguage(l)} className={cn("rounded-sm border px-4 py-2", p.language === l ? "border-gold bg-gold/15 text-gold" : "border-border text-muted-foreground")}>
                {label}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">Afaan Oromo and Tigrinya are coming soon.</p>
        </section>
        <section className="panel rounded-sm p-5">
          <div className="font-display text-sm tracking-widest text-gold">PROGRESS</div>
          <p className="mt-2 text-sm text-muted-foreground">Your progress is saved on this device.</p>
          <GhostButton className="mt-3" onClick={() => { if (confirm("Reset all progress?")) { actions.reset(); toast("Progress reset"); } }}>
            RESET PROGRESS
          </GhostButton>
        </section>
      </div>
    </>
  );
}
