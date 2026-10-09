"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MIN_PASSWORD, register } from "@/lib/auth";
import { AuthCard, Field, FormError, submitClass } from "@/components/utopia/AuthShell";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirm) return setError("The two passwords don't match.");
    if (!agree) return setError("Please confirm the age note to continue.");
    setBusy(true);
    const r = await register(name, email, password);
    setBusy(false);
    if (r.ok) router.push("/onboarding");
    else setError(r.error);
  };

  return (
    <AuthCard
      title="Create your account"
      am="መለያ ይፍጠሩ"
      sub="Save your progress and build your own መዝገብ of discoveries."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="text-gold underline">Sign in</Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <Field id="name" label="Your name" value={name} onChange={setName} autoComplete="name" placeholder="How should we call you?" />
        <Field id="email" label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" placeholder="you@example.com" />
        <Field id="password" label="Password" type="password" value={password} onChange={setPassword} autoComplete="new-password" hint={`At least ${MIN_PASSWORD} characters.`} />
        <Field id="confirm" label="Confirm password" type="password" value={confirm} onChange={setConfirm} autoComplete="new-password" />
        <label className="flex items-start gap-3 text-sm text-muted-foreground">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="mt-1 h-4 w-4 accent-[var(--gold)]"
          />
          <span>I am 13 or older, or a parent or guardian is setting this up with me.</span>
        </label>
        <FormError message={error} />
        <button type="submit" disabled={busy} className={submitClass}>
          {busy ? "CREATING…" : "CREATE ACCOUNT"}
        </button>
      </form>
    </AuthCard>
  );
}
