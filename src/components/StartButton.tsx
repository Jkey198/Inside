"use client";

import Link from "next/link";
import { useAppState } from "@/lib/store/use-app-state";

interface StartButtonProps {
  className?: string;
}

// Returning users skip onboarding; on the server it renders the first-visit variant
export function StartButton({ className = "" }: StartButtonProps) {
  const state = useAppState();
  const hasProfile = Boolean(state?.profile);

  return (
    <Link
      href={hasProfile ? "/workspace" : "/onboarding"}
      className={`inline-block rounded-xl bg-indigo-600 px-5 py-3 font-medium text-white shadow-sm shadow-indigo-200 hover:bg-indigo-700 ${className}`}
    >
      {hasProfile ? "Продолжить симуляцию" : "Начать симуляцию"} →
    </Link>
  );
}
