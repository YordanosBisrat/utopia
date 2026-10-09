"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { login } from "@/lib/auth";
import { AuthCard, Field, FormError, submitClass } from "@/components/utopia/AuthShell";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const r = await login(email, password);
    setBusy(false);
    if (r.ok) router.push("/");
    else setError(r.error);
  };

  return (
    <AuthCard
      title="Welcome back"
      am="እንኳን ደህና መጡ"
      sub="Sign in to keep your discoveries, streak and መዝገብ."
      footer={
        <>
          New to UTOPIA?{" "}
          <Link href="/register" className="text-gold underline">Create an account</Link>
          <br />
          <Link href="/" className="mt-2 inline-block hover:text-gold">Continue as a guest</Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <Field id="email" label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" placeholder="you@example.com" />
        <Field id="password" label="Password" type="password" value={password} onChange={setPassword} autoComplete="current-password" />
        <div className="text-right text-sm">
          <Link href="/forgot-password" className="text-muted-foreground hover:text-gold">Forgot password?</Link>
        </div>
        <FormError message={error} />
        <button type="submit" disabled={busy} className={submitClass}>
          {busy ? "SIGNING IN…" : "SIGN IN"}
        </button>
      </form>
    </AuthCard>
  );
}
