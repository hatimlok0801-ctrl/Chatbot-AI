"use client";

import { useMemo, useRef, useState } from "react";
import type { PromptEntry, Reaction } from "@/lib/types";
import { ReactionBar } from "@/components/reaction-bar";
import { shareNodeAsImage } from "@/lib/share";

function timeAgo(ts: number) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  return `${d}d`;
}

export function PromptEntryCard({
  entry,
  myReaction,
  onReact,
  onRetry,
  canDelete,
  onDelete,
  canRetry
}: {
  entry: PromptEntry;
  myReaction: Reaction;
  onReact: (next: Reaction) => void;
  onRetry: (prompt: string) => void;
  canDelete?: boolean;
  onDelete?: () => void;
  canRetry?: boolean;
}) {
  const cardRef = useRef<HTMLElement | null>(null);
  const [activeVersion, setActiveVersion] = useState(entry.versions.length - 1);
  const [retryDraft, setRetryDraft] = useState("");
  const [sharing, setSharing] = useState(false);
  const [shareHint, setShareHint] = useState<string | null>(null);

  const v = entry.versions[Math.min(activeVersion, entry.versions.length - 1)];
  const retryLabel = useMemo(() => {
    const n = entry.versions.length;
    return n <= 1 ? "v1" : `v${activeVersion + 1}/${n}`;
  }, [activeVersion, entry.versions.length]);

  async function share() {
    if (sharing) return;
    const node = cardRef.current;
    if (!node) return;
    try {
      setSharing(true);
      setShareHint(null);
      const res = await shareNodeAsImage({
        node,
        fileName: `respect-exe_${entry.id.slice(0, 8)}_${retryLabel}.png`
      });
      setShareHint(
        res.method === "share"
          ? "Shared."
          : res.method === "clipboard"
            ? "Copied."
            : "Downloaded."
      );
      window.setTimeout(() => setShareHint(null), 2000);
    } catch {
      setShareHint("Share failed.");
      window.setTimeout(() => setShareHint(null), 2000);
    } finally {
      setSharing(false);
    }
  }

  return (
    <article
      ref={(n) => {
        cardRef.current = n;
      }}
      className="relative rounded-2xl border border-white/10 bg-black/30 p-4 shadow-brutal"
    >
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <div className="text-sm font-semibold text-zinc-200">
              @{entry.username}
            </div>
            <div className="text-xs text-zinc-500">{timeAgo(entry.createdAt)}</div>
            <div className="rounded-full border border-blood-500/20 bg-blood-600/10 px-2 py-0.5 text-[11px] font-semibold text-blood-500">
              {retryLabel}
            </div>
          </div>
          <div className="mt-1 text-xs text-zinc-500">
            thread id: <span className="font-mono">{entry.id.slice(0, 8)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2" data-noscreenshot>
            {shareHint ? (
              <div className="hidden text-[11px] text-zinc-500 sm:block">
                {shareHint}
              </div>
            ) : null}
            <button
              onClick={share}
              disabled={sharing}
              className={[
                "rounded-lg border border-blood-500/20 bg-blood-600/10 px-2 py-1 text-[11px] font-semibold text-blood-500 hover:bg-blood-600/15",
                sharing ? "cursor-not-allowed opacity-60" : ""
              ].join(" ")}
              title="Share as image"
            >
              {sharing ? "Sharing…" : "Share"}
            </button>
          </div>
          {canDelete ? (
            <button
              onClick={onDelete}
              data-noscreenshot
              className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[11px] font-semibold text-zinc-300 hover:bg-white/10"
              title="Delete your prompt thread"
            >
              Delete
            </button>
          ) : null}
          {entry.versions.length > 1 ? (
            <div className="flex gap-1 rounded-full border border-white/10 bg-white/5 p-1">
              {entry.versions.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveVersion(idx)}
                  data-noscreenshot
                  className={[
                    "rounded-full px-2 py-1 text-[11px] font-semibold transition",
                    idx === activeVersion
                      ? "bg-blood-600 text-white"
                      : "text-zinc-300 hover:bg-white/10"
                  ].join(" ")}
                >
                  v{idx + 1}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </header>

      <div className="mt-4 grid gap-3">
        <div>
          <div className="text-xs font-semibold text-zinc-400">PROMPT</div>
          <div className="relative mt-2">
            <pre className="whitespace-pre-wrap rounded-xl border border-white/10 bg-ink-950/50 p-3 pr-20 pb-10 text-sm text-zinc-100">
              {v.prompt}
            </pre>
            <div className="pointer-events-none absolute bottom-2 right-2 select-none rounded-lg border border-white/10 bg-black/40 px-2 py-1 text-[10px] font-semibold tracking-wide text-zinc-300/90">
              RESPECT.EXE
            </div>
          </div>
        </div>

        <div>
          <div className="text-xs font-semibold text-zinc-400">AI</div>
          <div className="mt-2 rounded-xl border border-blood-500/15 bg-ink-900/40 p-3">
            <div className="text-xs text-zinc-500">{v.style.toUpperCase()}</div>
            <div className="mt-2 whitespace-pre-wrap text-sm text-zinc-100">
              {v.response}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <ReactionBar
          lit={entry.reactions.lit}
          smoke={entry.reactions.smoke}
          myReaction={myReaction}
          onReact={onReact}
        />

        {canRetry === false ? null : (
          <div className="w-full sm:w-[360px]">
            <div className="text-[11px] font-semibold text-zinc-500">RETRY</div>
            <div className="mt-2 flex gap-2">
              <input
                value={retryDraft}
                onChange={(e) => setRetryDraft(e.target.value)}
                placeholder="Rewrite. Upgrade. Don’t cope."
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-blood-500/50"
              />
              <button
                onClick={() => {
                  const trimmed = retryDraft.trim();
                  if (!trimmed) return;
                  onRetry(trimmed);
                  setRetryDraft("");
                }}
                className="shrink-0 rounded-xl bg-blood-600 px-3 py-2 text-xs font-semibold text-white shadow-brutal hover:bg-blood-500"
              >
                Retry
              </button>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

