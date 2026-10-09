"use client";

// DEMO accounts. Everything is stored in THIS browser only (localStorage).
// Passwords are never saved in plain text (salted PBKDF2), but this is NOT real security:
// swap these functions for calls to the backend when it exists.
import { useMemo, useSyncExternalStore } from "react";
import { actions } from "./store";

type Account = { email: string; name: string; salt: string; hash: string };
type Reset = { email: string; code: string; expires: number };
export type Result = { ok: true } | { ok: false; error: string };

const ACCOUNTS = "utopia.accounts.v1";
const SESSION = "utopia.session.v1";
const RESET = "utopia.reset.v1";
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

const enc = new TextEncoder();
const toHex = (buf: ArrayBuffer | Uint8Array) =>
  Array.from(buf instanceof Uint8Array ? buf : new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
const randomHex = (n: number) => toHex(crypto.getRandomValues(new Uint8Array(n)));

async function derive(password: string, salt: string): Promise<string> {
  const key = await crypto.subtle.importKey("raw", enc.encode(password) as BufferSource, "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt: enc.encode(salt) as BufferSource, iterations: 120_000 },
    key,
    256,
  );
  return toHex(bits);
}

const normEmail = (e: string) => e.trim().toLowerCase();
export const validEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e.trim());
export const MIN_PASSWORD = 8;

export async function register(name: string, email: string, password: string): Promise<Result> {
  const n = name.trim();
  if (n.length < 2 || n.length > 40) return { ok: false, error: "Please enter a name between 2 and 40 characters." };
  if (!validEmail(email)) return { ok: false, error: "Please enter a valid email address." };
  if (password.length < MIN_PASSWORD) return { ok: false, error: `Use at least ${MIN_PASSWORD} characters for your password.` };
  const accounts = read<Account[]>(ACCOUNTS, []);
  const e = normEmail(email);
  if (accounts.some((a) => a.email === e)) return { ok: false, error: "An account with this email already exists. Try signing in." };
  const salt = randomHex(16);
  const hash = await derive(password, salt);
  write(ACCOUNTS, [...accounts, { email: e, name: n, salt, hash }]);
  write(SESSION, { email: e });
  actions.setName(n);
  notify();
  return { ok: true };
}

export async function login(email: string, password: string): Promise<Result> {
  const e = normEmail(email);
  const acc = read<Account[]>(ACCOUNTS, []).find((a) => a.email === e);
  const bad: Result = { ok: false, error: "That email and password don't match an account in this browser." };
  if (!acc) return bad;
  if ((await derive(password, acc.salt)) !== acc.hash) return bad;
  write(SESSION, { email: e });
  actions.setName(acc.name);
  notify();
  return { ok: true };
}

export function logout() {
  try {
    localStorage.removeItem(SESSION);
  } catch {
    /* ignore */
  }
  notify();
}

/** Demo only: there is no email service, so the code is returned to be shown on screen. */
export function requestReset(email: string): { ok: true; code: string } | { ok: false; error: string } {
  if (!validEmail(email)) return { ok: false, error: "Please enter a valid email address." };
  const e = normEmail(email);
  if (!read<Account[]>(ACCOUNTS, []).some((a) => a.email === e))
    return { ok: false, error: "No demo account with this email exists in this browser." };
  const code = String(100000 + (crypto.getRandomValues(new Uint32Array(1))[0] % 900000));
  write(RESET, { email: e, code, expires: Date.now() + 10 * 60 * 1000 } satisfies Reset);
  return { ok: true, code };
}

export async function resetPassword(email: string, code: string, password: string): Promise<Result> {
  if (password.length < MIN_PASSWORD) return { ok: false, error: `Use at least ${MIN_PASSWORD} characters for your new password.` };
  const e = normEmail(email);
  const r = read<Reset | null>(RESET, null);
  if (!r || r.email !== e || r.code !== code.trim() || r.expires < Date.now())
    return { ok: false, error: "That code is wrong or has expired. Request a new one." };
  const accounts = read<Account[]>(ACCOUNTS, []);
  const i = accounts.findIndex((a) => a.email === e);
  if (i < 0) return { ok: false, error: "Account not found." };
  const salt = randomHex(16);
  accounts[i] = { ...accounts[i], salt, hash: await derive(password, salt) };
  write(ACCOUNTS, accounts);
  try {
    localStorage.removeItem(RESET);
  } catch {
    /* ignore */
  }
  return { ok: true };
}

function sessionRaw(): string {
  try {
    return localStorage.getItem(SESSION) ?? "";
  } catch {
    return "";
  }
}

/** The signed-in demo account, or null. */
export function useSession(): { email: string; name: string } | null {
  const raw = useSyncExternalStore(
    (l) => {
      listeners.add(l);
      window.addEventListener("storage", l);
      return () => {
        listeners.delete(l);
        window.removeEventListener("storage", l);
      };
    },
    sessionRaw,
    () => "",
  );
  return useMemo(() => {
    if (!raw) return null;
    try {
      const { email } = JSON.parse(raw) as { email: string };
      const acc = read<Account[]>(ACCOUNTS, []).find((a) => a.email === email);
      return acc ? { email: acc.email, name: acc.name } : null;
    } catch {
      return null;
    }
  }, [raw]);
}
