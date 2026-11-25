"use client";

import { useSyncExternalStore } from "react";
import type { AppState } from "@/lib/storage/progress-repository";
import { getAppStore } from "./app-store";

function getServerSnapshot(): null {
  return null;
}

// null while prerendering and hydrating: localStorage is only available in the browser
export function useAppState(): AppState | null {
  const store = getAppStore();
  return useSyncExternalStore(store.subscribe, store.getSnapshot, getServerSnapshot);
}
