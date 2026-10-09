"use client";

import Link from "next/link";
import { useState } from "react";
import { requestReset, resetPassword } from "@/lib/auth";
import { AuthCard, Field, FormError, submitClass } from "@/components/utopia/AuthShell";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<"email" | "code" | "done">("email");
  const [email, setEmail] = useState("");
  const [demoCode, setDemoCode] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const sendCode = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const r = requestReset(email);
    if (r.ok) {
      setDemoCode(r.code);
      setStep("code");
    } else setError(r.error);
  };

  const setNew = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const r = await resetPassword(email, code, password);
    setBusy(false);
    if (r.ok) setStep("done");
    else setError(r.error);
  };

  const back = (
    <Link href="/login" className="text-gold underline">Back to sign in</Link>
  );

  return (
    <AuthCard
      title="Reset your password"
      am="የይለፍ ቃል ዳግም ማስጀመር"
      sub={
        step === "email"
          ? "Enter your email and we will give you a reset code."
          : step === "code"
            ? "Enter the code and choose a new password."
            : undefined
      }
      footer={back}
    >
      {step === "email" && (
        <form onSubmit={sendCode} className="space-y-4">
          <Field id="email" label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" placeholder="you@example.com" />
          <FormError message={error} />
          <button type="submit" className={submitClass}>SEND RESET CODE</button>
        </form>
      )}

      {step === "code" && (
        <form onSubmit={setNew} className="space-y-4">
          <div className="rounded-sm border border-gold/50 bg-gold/10 p-3 text-sm">
            <p className="text-muted-foreground">
              Demo mode: no email is sent, so your code is shown here. A real version would email it.
            </p>
            <p className="mt-2 text-center font-display text-2xl tracking-[0.4em] text-gold">{demoCode}</p>
          </div>
          <Field id="code" label="Reset code" value={code} onChange={setCode} autoComplete="one-time-code" placeholder="6 digits" />
          <Field id="password" label="New password" type="password" value={password} onChange={setPassword} autoComplete="new-password" hint="At least 8 characters." />
          <FormError message={error} />
          <button type="submit" disabled={busy} className={submitClass}>
            {busy ? "SAVING…" : "SET NEW PASSWORD"}
          </button>
        </form>
      )}

      {step === "done" && (
        <div className="space-y-4 text-center">
          <p className="text-lg text-gold">Your password has been updated.</p>
          <Link href="/login" className={`${submitClass} block`}>SIGN IN</Link>
        </div>
      )}
    </AuthCard>
  );
}
