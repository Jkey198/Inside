"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useAppState } from "@/lib/store/use-app-state";

interface RequireProfileProps {
  children: ReactNode;
}

// The workspace only makes sense after onboarding: it needs a name and the "before" score
export function RequireProfile({ children }: RequireProfileProps) {
  const state = useAppState();
  const router = useRouter();
  const isMissing = state !== null && state.profile === null;

  useEffect(() => {
    if (isMissing) router.replace("/onboarding");
  }, [isMissing, router]);

  if (!state?.profile) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-400" aria-busy>
        Загружаем рабочее пространство…
      </div>
    );
  }
  return children;
}
