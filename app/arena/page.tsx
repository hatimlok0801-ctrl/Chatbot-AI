"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BrandMark } from "@/components/brand-mark";
import { FeedFilters } from "@/components/feed-filters";
import { PromptComposer } from "@/components/prompt-composer";
import { PromptEntryCard } from "@/components/prompt-entry-card";
import { getSession, clearSession } from "@/lib/session";
import {
  createEntry,
  deleteEntry,
  getEntries,
  getReactions,
  setReaction
} from "@/lib/store";
import type { FeedFilter, PromptEntry, Reaction } from "@/lib/types";

export default function ArenaPage() {
  const router = useRouter();
  const session = useMemo(() => getSession(), []);
  const [filter, setFilter] = useState<FeedFilter>("latest");
  const [entries, setEntries] = useState<PromptEntry[]>(() => getEntries());
  const [reactions, setReactions] = useState(() =>
    getReactions(session?.username ?? "anonymous")
  );

  useEffect(() => {
    if (!session) router.replace("/");
  }, [router, session]);

  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (!e.key) return;
      if (e.key.startsWith("respect.exe/entries")) setEntries(getEntries());
      if (e.key.startsWith("respect.exe/reactions/") && session) {
        setReactions(getReactions(session.username));
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [session]);

  useEffect(() => {
    const t = window.setInterval(() => setEntries(getEntries()), 5000);
    return () => window.clearInterval(t);
  }, []);

  const sortedEntries = useMemo(() => {
    const list = [...entries];
    const score = (entry: PromptEntry) => {
      const lit = entry.reactions.lit;
      const smoke = entry.reactions.smoke;
      const ratio = lit + smoke === 0 ? 0 : smoke / (lit + smoke);
      switch (filter) {
        case "latest":
          return entry.createdAt;
        case "lit":
          return lit;
        case "smoke":
          return smoke;
        case "brutal":
          return ratio;
        case "retried":
          return entry.versions.length;
      }
    };
    list.sort((a, b) => {
      const da = score(a);
      const db = score(b);
      if (db === da) return b.createdAt - a.createdAt;
      return db > da ? 1 : -1;
    });
    return list;
  }, [entries, filter]);

  function onSubmitPrompt(prompt: string, retryOfId?: string) {
    if (!session || session.mode === "anon") return;
    const username = session?.username ?? "anonymous";
    const next = createEntry({ username, prompt, retryOfId });
    setEntries(next);
  }

  function onReact(entryId: string, next: Reaction) {
    if (!session) return;
    const username = session.username;
    const { nextEntries, nextReactions } = setReaction({
      entryId,
      username,
      next
    });
    setEntries(nextEntries);
    setReactions(nextReactions);
  }

  function onDelete(entryId: string) {
    if (!session || session.mode !== "user") return;
    const next = deleteEntry({ entryId, username: session.username });
    setEntries(next);
  }

  function logout() {
    clearSession();
    router.push("/");
  }

  if (!session) return null;

  return (
    <div className="arena-bg min-h-screen">
      <div className="pointer-events-none fixed inset-0 scanlines opacity-35" />
      <header className="sticky top-0 z-20 border-b border-white/10 bg-ink-950/60 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-4">
          <div className="flex items-center gap-3">
            <BrandMark />
            <div>
              <div className="glitch text-sm font-semibold tracking-tight">
                RESPECT.EXE
              </div>
              <div className="text-xs text-zinc-500">
                arena feed •{" "}
                {session.mode === "anon" ? "anonymous" : session.username}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="hidden rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-zinc-200 hover:bg-white/10 sm:inline-flex"
            >
              Login
            </Link>
            <button
              onClick={logout}
              className="rounded-lg border border-blood-500/20 bg-blood-600/10 px-3 py-2 text-xs font-semibold text-blood-500 hover:bg-blood-600/15"
            >
              Exit
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-5 py-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <section className="flex flex-col gap-4">
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4 shadow-brutal">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <FeedFilters value={filter} onChange={setFilter} />
                <div className="text-xs text-zinc-500">
                  {sortedEntries.length} threads
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {sortedEntries.map((entry) => (
                <PromptEntryCard
                  key={entry.id}
                  entry={entry}
                  myReaction={reactions[entry.id] ?? "none"}
                  onReact={(next) => onReact(entry.id, next)}
                  onRetry={(prompt) => onSubmitPrompt(prompt, entry.id)}
                  canDelete={session.mode === "user" && entry.username === session.username}
                  onDelete={() => onDelete(entry.id)}
                  canRetry={session.mode === "user"}
                />
              ))}
              {sortedEntries.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-black/30 p-6 text-sm text-zinc-400">
                  No prompts yet. Start the chaos.
                </div>
              ) : null}
            </div>
          </section>

          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <PromptComposer
              onSubmit={onSubmitPrompt}
              disabled={session.mode === "anon"}
            />

            <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-4 text-xs text-zinc-500">
              <div className="font-semibold text-zinc-300">Sorting logic</div>
              <div className="mt-2 space-y-1">
                <div>
                  <span className="text-zinc-300">Most Brutal</span> = SMOKE
                  ratio
                </div>
                <div>
                  <span className="text-zinc-300">Most Retried</span> = versions
                  count
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

