"use client";

import { useState } from "react";

export function PromptComposer({
  onSubmit,
  disabled
}: {
  onSubmit: (prompt: string) => void;
  disabled?: boolean;
}) {
  const [prompt, setPrompt] = useState("");

  function submit() {
    if (disabled) return;
    const trimmed = prompt.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setPrompt("");
  }

  return (
    <div className="rounded-2xl border border-blood-500/20 bg-ink-900/60 p-4 shadow-brutal backdrop-blur">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-zinc-200">Submit Prompt</div>
        <div className="text-[11px] text-zinc-500">
          {disabled ? "read-only (anon)" : "public by default"}
        </div>
      </div>

      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Drop your prompt. Be specific. Or get cooked."
        className={[
          "mt-3 h-32 w-full resize-none rounded-xl border border-blood-500/20 bg-black/50 px-4 py-3 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-blood-500/60",
          disabled ? "opacity-60" : ""
        ].join(" ")}
        disabled={disabled}
      />

      <div className="mt-3 flex items-center justify-between">
        <div className="text-[11px] text-zinc-500">
          {disabled
            ? "Login to submit prompts. Anonymous is read-only."
            : "Tip: add constraints + context + desired output format."}
        </div>
        <button
          onClick={submit}
          disabled={disabled}
          className={[
            "rounded-xl px-4 py-2 text-xs font-semibold shadow-brutal",
            disabled
              ? "cursor-not-allowed bg-white/10 text-zinc-400 shadow-none"
              : "bg-blood-600 text-white hover:bg-blood-500"
          ].join(" ")}
        >
          Send
        </button>
      </div>
    </div>
  );
}

