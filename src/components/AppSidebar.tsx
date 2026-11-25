"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SCENARIOS } from "@/lib/content";
import { useAppState } from "@/lib/store/use-app-state";
import { Avatar } from "./Avatar";

const NAV = [
  { href: "/workspace", label: "Задачи", match: ["/workspace", "/scenario"] },
  { href: "/wiki", label: "Wiki TechCore", match: ["/wiki"] },
  { href: "/report", label: "Отчёт", match: ["/report"] },
];

export function AppSidebar() {
  const state = useAppState();
  const pathname = usePathname();
  const done = SCENARIOS.filter((scenario) => state?.runs[scenario.id]?.completedAt).length;

  // the outer column paints the background for the full page height, the nav itself stays sticky
  return (
    <div className="shrink-0 bg-slate-900 md:w-64">
      <nav className="flex flex-col gap-3 border-b border-slate-800 px-4 py-3 text-slate-300 md:sticky md:top-0 md:h-screen md:gap-6 md:border-b-0 md:py-6">
        <Link href="/" className="flex items-baseline gap-2 px-2">
          <span className="text-lg font-bold tracking-tight text-white">Inside</span>
          <span className="text-xs text-slate-400">TechCore · Payments</span>
        </Link>

        <ul className="flex gap-1 overflow-x-auto md:flex-col">
          {NAV.map((item) => {
            const isActive = item.match.some((prefix) => pathname.startsWith(prefix));
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex items-center justify-between gap-3 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive ? "bg-white/10 text-white" : "hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {item.label}
                  {item.href === "/workspace" && (
                    <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs tabular-nums">
                      {done}/{SCENARIOS.length}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {state?.profile && (
          <div className="mt-auto hidden items-center gap-3 rounded-xl bg-white/5 p-3 md:flex">
            <Avatar name={state.profile.name} color="#334155" />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-white">{state.profile.name}</p>
              <p className="text-xs text-slate-400">Junior Backend Developer</p>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}
