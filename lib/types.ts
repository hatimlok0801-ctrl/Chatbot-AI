export type Reaction = "none" | "lit" | "smoke";

export type FeedFilter = "latest" | "lit" | "smoke" | "brutal" | "retried";

export type PromptStyle = "roast" | "partial" | "precise";

export type Session = {
  username: string;
  mode: "user" | "anon";
};

export type PromptVersion = {
  id: string;
  prompt: string;
  response: string;
  style: PromptStyle;
  createdAt: number;
};

export type PromptEntry = {
  id: string;
  username: string;
  createdAt: number;
  versions: PromptVersion[];
  reactions: { lit: number; smoke: number };
};

export type ReactionsByEntryId = Record<string, Reaction>;


