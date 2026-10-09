"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export function AuthCard({
  title,
  am,
  sub,
  children,
  footer,
}: {
  title: string;
  am?: string;
  sub?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="panel corners rounded-sm bg-card/80 p-6 sm:p-8">
      <Link href="/" className="mb-5 flex items-center gap-3" aria-label="UTOPIA home">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/logo-mark.png" alt="" className="h-11 w-11 rounded-lg" />
        <span className="font-display text-sm tracking-[0.25em] text-gold-gradient">UTOPIA | you-ጦቢያ</span>
      </Link>
      <title>{`${title} | UTOPIA`}</title>
      <h1 className="text-2xl font-bold text-gold sm:text-3xl">{title}</h1>
      {am && <div className="font-ethiopic text-gold-soft">{am}</div>}
      {sub && <p className="mt-2 text-sm text-muted-foreground">{sub}</p>}
      <div className="mt-6">{children}</div>
      {footer && <div className="mt-6 border-t border-border pt-4 text-center text-sm text-muted-foreground">{footer}</div>}
      <p className="mt-4 text-center text-[11px] text-muted-foreground/70">
        Demo mode: accounts are saved only in this browser.
      </p>
    </div>
  );
}

export function Field({
  label,
  id,
  type = "text",
  value,
  onChange,
  autoComplete,
  hint,
  placeholder,
}: {
  label: string;
  id: string;
  type?: "text" | "email" | "password";
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
  hint?: string;
  placeholder?: string;
}) {
  const [show, setShow] = useState(false);
  const isPw = type === "password";
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={id}
          type={isPw && show ? "text" : type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          placeholder={placeholder}
          required
          className="w-full rounded-sm border border-border bg-background/60 px-4 py-3 text-base outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-gold"
        />
        {isPw && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? "Hide password" : "Show password"}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-gold"
          >
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function FormError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p role="alert" className="rounded-sm border border-destructive/60 bg-destructive/10 px-3 py-2 text-sm text-destructive-foreground">
      {message}
    </p>
  );
}

export const submitClass =
  "w-full rounded-sm bg-gold px-6 py-3 font-display text-sm font-bold tracking-[0.25em] text-primary-foreground transition hover:brightness-110 disabled:opacity-60";
