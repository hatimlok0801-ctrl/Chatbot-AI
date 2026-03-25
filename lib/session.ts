import type { Session } from "@/lib/types";
import { lsGet, lsSet } from "@/lib/storage";

const KEY = "respect.exe/session";

export function getSession(): Session | null {
  return lsGet<Session | null>(KEY, null);
}

export function setSession(session: Session) {
  lsSet(KEY, session);
}

export function clearSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
}


