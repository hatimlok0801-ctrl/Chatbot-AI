"use client";

import type { Reaction } from "@/lib/types";

export function ReactionBar({
  lit,
  smoke,
  myReaction,
  onReact
}: {
  lit: number;
  smoke: number;
  myReaction: Reaction;
  onReact: (next: Reaction) => void;
}) {
  const litActive = myReaction === "lit";
  const smokeActive = myReaction === "smoke";

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onReact(litActive ? "none" : "lit")}
        className={[
          "flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold transition",
          litActive
            ? "bg-blood-600 text-white shadow-brutal"
            : "border border-white/10 bg-white/5 text-zinc-200 hover:bg-white/10"
        ].join(" ")}
        aria-pressed={litActive}
      >
        <span className="inline-block h-2.5 w-2.5 rounded-full bg-blood-500" />
        LIT <span className="text-zinc-300/90">{lit}</span>
      </button>

      <button
        onClick={() => onReact(smokeActive ? "none" : "smoke")}
        className={[
          "flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold transition",
          smokeActive
            ? "bg-zinc-100 text-black"
            : "border border-white/10 bg-white/5 text-zinc-200 hover:bg-white/10"
        ].join(" ")}
        aria-pressed={smokeActive}
      >
        <span className="inline-block h-2.5 w-2.5 rounded-full bg-zinc-200" />
        SMOKE <span className="text-zinc-300/90">{smoke}</span>
      </button>

      <div className="ml-2 hidden text-[11px] text-zinc-500 sm:block">
        one user â†’ one reaction
      </div>
    </div>
  );
}

