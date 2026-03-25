"use client";

import type { FeedFilter } from "@/lib/types";

const options: { value: FeedFilter; label: string }[] = [
  { value: "latest", label: "Latest" },
  { value: "lit", label: "Most LIT" },
  { value: "smoke", label: "Most SMOKE" },
  { value: "brutal", label: "Most Brutal" },
  { value: "retried", label: "Most Retried" }
];

export function FeedFilters({
  value,
  onChange
}: {
  value: FeedFilter;
  onChange: (v: FeedFilter) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={[
            "rounded-full px-3 py-1.5 text-xs font-semibold transition",
            value === o.value
              ? "bg-blood-600 text-white shadow-brutal"
              : "border border-white/10 bg-white/5 text-zinc-200 hover:bg-white/10"
          ].join(" ")}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}


