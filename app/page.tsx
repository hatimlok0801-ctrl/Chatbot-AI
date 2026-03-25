"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession, setSession } from "@/lib/session";
import { BrandMark } from "@/components/brand-mark";

export default function LoginPage() {
  const router = useRouter();
  const existing = useMemo(() => getSession(), []);
  const [username, setUsername] = useState(existing?.mode === "user" ? existing.username : "");
  const [error, setError] = useState<string | null>(null);

  function continueAsUser(nextUsername: string) {
    const trimmed = nextUsername.trim();
    if (!trimmed) {
      setError("Username required (or continue anonymous).");
      return;
    }
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(trimmed)) {
      setError("Use 3–20 chars: letters, numbers, underscore.");
      return;
    }
    setSession({ username: trimmed, mode: "user" });
    router.push("/arena");
  }

  function continueAnon() {
    setSession({ username: "anonymous", mode: "anon" });
    router.push("/arena");
  }

  return (
    <div className="arena-bg min-h-screen">
      <div className="pointer-events-none fixed inset-0 scanlines opacity-40" />
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-5 py-14">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <BrandMark />
              <div>
                <div className="glitch text-2xl font-semibold tracking-tight">
                  RESPECT.EXE
                </div>
                <div className="text-sm text-zinc-400">
                  Public prompt arena • discipline by entertainment
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-blood-500/20 bg-ink-900/60 p-5 shadow-brutal backdrop-blur">
              <div className="text-lg font-semibold">Login</div>
              <div className="mt-1 text-sm text-zinc-400">
                Pick a permanent handle. No email. No mercy.
              </div>

              <label className="mt-5 block text-sm text-zinc-300">
                Username
              </label>
              <input
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError(null);
                }}
                placeholder="e.g. ruthless_operator"
                className="mt-2 w-full rounded-xl border border-blood-500/25 bg-black/50 px-4 py-3 text-zinc-100 outline-none ring-0 placeholder:text-zinc-600 focus:border-blood-500/60"
                autoComplete="username"
              />

              {error ? (
                <div className="mt-3 text-sm text-blood-500">{error}</div>
              ) : (
                <div className="mt-3 text-xs text-zinc-500">
                  Allowed: letters, numbers, underscore. 3–20 chars.
                </div>
              )}

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => continueAsUser(username)}
                  className="rounded-xl bg-blood-600 px-4 py-3 text-sm font-semibold text-white shadow-brutal transition hover:bg-blood-500"
                >
                  Enter Arena
                </button>
                <button
                  onClick={continueAnon}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-zinc-200 transition hover:bg-white/10"
                >
                  Continue Anonymous
                </button>
              </div>
            </div>

            <div className="text-xs text-zinc-500">
              MVP frontend only. Reactions are stored locally on this device.
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="relative h-full overflow-hidden rounded-2xl border border-white/10 bg-black/40 p-6 shadow-brutal">
              <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[radial-gradient(closest-side,rgba(255,21,56,0.28),rgba(255,21,56,0.0))] blur-2xl" />
              <div className="relative">
                <div className="text-sm font-semibold text-zinc-300">
                  What happens here:
                </div>
                <ul className="mt-4 space-y-3 text-sm text-zinc-400">
                  <li>Submit a prompt AI judges communication quality.</li>
                  <li>Bad prompts get roasted (publicly).</li>
                  <li>Good prompts get precise answers.</li>
                  <li>Retry stack stays visible: v1 v2 v3.</li>
                  <li>LIT/SMOKE reactions shape the feed.</li>
                </ul>
                <div className="mt-6 rounded-xl border border-blood-500/20 bg-ink-950/50 p-4">
                  <div className="text-xs text-zinc-500">House rule</div>
                  <div className="mt-1 text-sm text-zinc-200">
                    Effort is respected. Entitlement is punished.
                  </div>
                </div>
                <div className="mt-6 text-xs text-zinc-500">
                  “Intelligent brutality” is a vibe. You still need moderation
                  rules server-side.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

