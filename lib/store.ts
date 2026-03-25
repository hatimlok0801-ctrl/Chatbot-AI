import type {
  PromptEntry,
  PromptVersion,
  Reaction,
  ReactionsByEntryId
} from "@/lib/types";
import { lsGet, lsSet } from "@/lib/storage";
import { generateAiResponse } from "@/lib/mockAi";

const ENTRIES_KEY = "respect.exe/entries/v1";
const reactionsKey = (username: string) => `respect.exe/reactions/${username}/v1`;

function id(prefix: string) {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

function seedIfEmpty(entries: PromptEntry[]) {
  if (entries.length) return entries;
  const now = Date.now();
  const seeded: PromptEntry[] = [
    {
      id: id("th"),
      username: "arena_admin",
      createdAt: now - 1000 * 60 * 45,
      versions: [
        {
          id: id("v"),
          createdAt: now - 1000 * 60 * 45,
          prompt: "Help me build a Next.js app.",
          ...generateAiResponse("Help me build a Next.js app.")
        }
      ],
      reactions: { lit: 4, smoke: 19 }
    },
    {
      id: id("th"),
      username: "operator_7",
      createdAt: now - 1000 * 60 * 9,
      versions: [
        {
          id: id("v"),
          createdAt: now - 1000 * 60 * 9,
          prompt:
            "Context: I'm shipping an MVP on Vercel. Stack: Next.js.\nGoal: real-time public feed of prompts + AI replies.\nConstraints: anonymous allowed; reactions are LIT/SMOKE.\nOutput: a minimal architecture diagram + folder structure.",
          ...generateAiResponse(
            "Context: I'm shipping an MVP on Vercel. Stack: Next.js.\nGoal: real-time public feed of prompts + AI replies.\nConstraints: anonymous allowed; reactions are LIT/SMOKE.\nOutput: a minimal architecture diagram + folder structure."
          )
        }
      ],
      reactions: { lit: 23, smoke: 2 }
    }
  ];
  lsSet(ENTRIES_KEY, seeded);
  return seeded;
}

export function getEntries(): PromptEntry[] {
  return seedIfEmpty(lsGet<PromptEntry[]>(ENTRIES_KEY, []));
}

export function getReactions(username: string): ReactionsByEntryId {
  return lsGet<ReactionsByEntryId>(reactionsKey(username), {});
}

export function createEntry({
  username,
  prompt,
  retryOfId
}: {
  username: string;
  prompt: string;
  retryOfId?: string;
}) {
  const entries = getEntries();
  const now = Date.now();
  if (retryOfId) {
    const idx = entries.findIndex((e) => e.id === retryOfId);
    if (idx >= 0) {
      const ai = generateAiResponse(prompt);
      const nextVersion: PromptVersion = {
        id: id("v"),
        prompt,
        response: ai.response,
        style: ai.style,
        createdAt: now
      };
      const updated = { ...entries[idx] };
      updated.versions = [...updated.versions, nextVersion];
      const next = [...entries];
      next[idx] = updated;
      lsSet(ENTRIES_KEY, next);
      return next;
    }
  }

  const ai = generateAiResponse(prompt);
  const entry: PromptEntry = {
    id: id("th"),
    username,
    createdAt: now,
    versions: [
      {
        id: id("v"),
        prompt,
        response: ai.response,
        style: ai.style,
        createdAt: now
      }
    ],
    reactions: { lit: 0, smoke: 0 }
  };
  const next = [entry, ...entries];
  lsSet(ENTRIES_KEY, next);
  return next;
}

export function setReaction({
  entryId,
  username,
  next
}: {
  entryId: string;
  username: string;
  next: Reaction;
}) {
  const entries = getEntries();
  const reactions = getReactions(username);
  const prev = reactions[entryId] ?? "none";
  if (prev === next) {
    return { nextEntries: entries, nextReactions: reactions };
  }

  const entryIdx = entries.findIndex((e) => e.id === entryId);
  if (entryIdx < 0) return { nextEntries: entries, nextReactions: reactions };

  const entry = { ...entries[entryIdx] };
  const counts = { ...entry.reactions };

  const dec = (r: Reaction) => {
    if (r === "lit") counts.lit = Math.max(0, counts.lit - 1);
    if (r === "smoke") counts.smoke = Math.max(0, counts.smoke - 1);
  };
  const inc = (r: Reaction) => {
    if (r === "lit") counts.lit += 1;
    if (r === "smoke") counts.smoke += 1;
  };

  dec(prev);
  inc(next);

  entry.reactions = counts;
  const nextEntries = [...entries];
  nextEntries[entryIdx] = entry;

  const nextReactions: ReactionsByEntryId = { ...reactions, [entryId]: next };

  lsSet(ENTRIES_KEY, nextEntries);
  lsSet(reactionsKey(username), nextReactions);

  return { nextEntries, nextReactions };
}

export function deleteEntry({
  entryId,
  username
}: {
  entryId: string;
  username: string;
}) {
  const entries = getEntries();
  const entry = entries.find((e) => e.id === entryId);
  if (!entry) return entries;
  if (entry.username !== username) return entries;
  const next = entries.filter((e) => e.id !== entryId);
  lsSet(ENTRIES_KEY, next);
  return next;
}

