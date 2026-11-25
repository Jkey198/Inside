"use client";

import Link from "next/link";
import { useEffect, useRef, type CSSProperties } from "react";
import { getScenario, SCENARIOS } from "@/lib/content";
import { safeReplay, type TranscriptEntry } from "@/lib/scenario/engine";
import type { Scenario } from "@/lib/scenario/types";
import type { AppState } from "@/lib/storage/progress-repository";
import { getAppStore } from "@/lib/store/app-store";
import { useAppState } from "@/lib/store/use-app-state";
import { ChatMessage, PlayerMessage } from "./ChatMessage";
import { ChoicePanel } from "./ChoicePanel";
import { FeedbackCard } from "./FeedbackCard";
import { ScenarioOutcome, type NextStep } from "./ScenarioOutcome";

const REVEAL_STEP_MS = 900;

function entryKey(entry: TranscriptEntry): string {
  return entry.kind === "pick" ? `pick:${entry.choice.id}` : entry.node.id;
}

/**
 * Entries after the latest pick appear one by one, older ones render instantly.
 * CSS delays need no timers or state: already mounted entries never replay.
 */
function revealDelay(index: number, lastPick: number): number | null {
  if (index < lastPick) return null;
  const offset = lastPick >= 0 ? index - lastPick : index;
  return offset * REVEAL_STEP_MS;
}

function revealProps(delay: number | null): { className: string; style?: CSSProperties } {
  if (delay === null) return { className: "" };
  return { className: "reveal", style: { "--reveal-delay": `${delay}ms` } as CSSProperties };
}

function nextStep(state: AppState, current: Scenario): NextStep {
  const open = SCENARIOS.filter((scenario) => !state.runs[scenario.id]?.completedAt);
  const next = open.find((scenario) => scenario.order > current.order) ?? open[0];
  if (!next) return { href: "/report", label: "Смотреть итоговый отчёт" };
  return { href: `/scenario/${next.id}`, label: `Дальше: ${next.title}` };
}

interface ScenarioPlayerProps {
  scenarioId: string;
}

export function ScenarioPlayer({ scenarioId }: ScenarioPlayerProps) {
  const state = useAppState();
  const store = getAppStore();
  const scenario = getScenario(scenarioId);
  const listRef = useRef<HTMLOListElement>(null);

  const run = state?.runs[scenarioId];
  const pickCount = run?.picks.length ?? 0;

  useEffect(() => {
    if (scenario) store.startScenario(scenario.id);
  }, [store, scenario]);

  // keep the latest decision and its feedback in view
  useEffect(() => {
    if (pickCount === 0) return;
    const picks = listRef.current?.querySelectorAll("[data-pick]");
    picks?.[picks.length - 1]?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [pickCount]);

  if (!scenario) return null;
  if (!state) return <PlayerSkeleton />;

  const restart = () => {
    store.restartScenario(scenario.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const result = safeReplay(scenario, run?.picks ?? []);
  if (!result) {
    // stored picks no longer match the content, e.g. after a scenario update
    return (
      <div className="mx-auto max-w-2xl space-y-4 rounded-2xl border border-amber-200 bg-amber-50 p-6">
        <p className="font-medium">
          Сценарий обновился, и сохранённый прогресс к нему не подходит.
        </p>
        <button
          type="button"
          onClick={restart}
          className="rounded-xl bg-indigo-600 px-4 py-2.5 font-medium text-white hover:bg-indigo-700"
        >
          Начать заново
        </button>
      </div>
    );
  }

  const { entries, pending, ending, tally } = result;
  const lastPick = entries.findLastIndex((entry) => entry.kind === "pick");
  const shownCount = ending ? entries.length - 1 : entries.length;
  const tail = revealProps(revealDelay(shownCount, lastPick));
  const playerName = state.profile?.name ?? "Ты";

  return (
    <article className="mx-auto max-w-2xl space-y-6 pb-16">
      <header className="space-y-3 border-b border-slate-200 pb-5">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-500">
          <Link href="/workspace" className="hover:text-slate-800">
            ← Задачи
          </Link>
          <span aria-hidden>·</span>
          <span className="font-mono">{scenario.ticket}</span>
          <span aria-hidden>·</span>
          <span>{scenario.channel}</span>
          {run && run.attempt > 1 && (
            <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs">
              попытка {run.attempt}
            </span>
          )}
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{scenario.title}</h1>
        <p className="leading-relaxed text-slate-600">{scenario.briefing}</p>
      </header>

      <ol ref={listRef} className="space-y-5">
        {entries.map((entry, index) => {
          if (entry.kind === "end") return null;
          const reveal = revealProps(revealDelay(index, lastPick));
          return (
            <li
              key={entryKey(entry)}
              data-pick={entry.kind === "pick" ? "" : undefined}
              className={`scroll-mt-6 ${reveal.className}`}
              style={reveal.style}
            >
              {entry.kind === "message" ? (
                <ChatMessage from={entry.node.from} text={entry.node.text} />
              ) : (
                <div className="space-y-3">
                  <PlayerMessage playerName={playerName} option={entry.option} />
                  <FeedbackCard option={entry.option} />
                </div>
              )}
            </li>
          );
        })}
      </ol>

      {pending && (
        <div key={pending.id} className={tail.className} style={tail.style}>
          <ChoicePanel
            choice={pending}
            onPick={(optionId) => store.pick(scenario, pending.id, optionId)}
          />
        </div>
      )}

      {ending && (
        <div key={ending.id} className={tail.className} style={tail.style}>
          <ScenarioOutcome
            scenario={scenario}
            ending={ending}
            tally={tally}
            next={nextStep(state, scenario)}
            onRestart={restart}
          />
        </div>
      )}
    </article>
  );
}

function PlayerSkeleton() {
  return (
    <div className="mx-auto max-w-2xl animate-pulse space-y-4" aria-busy>
      <div className="h-8 w-2/3 rounded-lg bg-slate-200" />
      <div className="h-4 w-full rounded bg-slate-200" />
      <div className="h-24 rounded-xl bg-slate-200" />
      <div className="h-24 rounded-xl bg-slate-200" />
    </div>
  );
}
