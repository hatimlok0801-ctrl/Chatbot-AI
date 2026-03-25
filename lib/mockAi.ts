import type { PromptStyle } from "@/lib/types";

type EvalResult = { style: PromptStyle; response: string };

function scorePrompt(prompt: string) {
  const len = prompt.trim().length;
  const hasContext = /(context|background|i have|i'm|we are|my goal)/i.test(prompt);
  const hasConstraints = /(must|should|constraints|do not|don't|only|exactly|format)/i.test(
    prompt
  );
  const hasStructure = /(\n- |\n\d+\. |\bsteps\b|\boutput\b|\bsections\b)/i.test(prompt);
  const entitlement = /(asap|urgent|now|quickly|do it for me|just give me)/i.test(prompt);
  const vague = /^(help|hi|hello|what is|tell me about)\b/i.test(prompt.trim());

  let score = 0;
  score += Math.min(40, Math.floor(len / 8));
  score += hasContext ? 15 : 0;
  score += hasConstraints ? 15 : 0;
  score += hasStructure ? 15 : 0;
  score -= entitlement ? 10 : 0;
  score -= vague ? 10 : 0;
  return Math.max(0, Math.min(100, score));
}

export function generateAiResponse(prompt: string): EvalResult {
  const s = scorePrompt(prompt);
  if (s < 35) {
    return {
      style: "roast",
      response:
        "You didnâ€™t submit a prompt. You submitted a vibe.\n\nGive me:\n- what you want\n- constraints (stack, budget, time)\n- context\n- desired output format\n\nThen try again. Right now this is input-shaped noise."
    };
  }
  if (s < 65) {
    return {
      style: "partial",
      response:
        "Decent effort. Still missing key constraints.\n\nHereâ€™s a partial answer:\n1) Clarify the goal in one sentence.\n2) Add context (current state, target state).\n3) Specify output format (bullets, code, table).\n\nIf you paste a tightened version, Iâ€™ll go precise."
    };
  }
  return {
    style: "precise",
    response:
      "Clear prompt detected.\n\nAnswer (structured):\n- Assumptions: based on your context and constraints.\n- Plan: step-by-step approach.\n- Output: the exact deliverable requested.\n\nIf you want a stronger result, add examples and edge cases."
  };
}


