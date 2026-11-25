"use client";

import Link from "next/link";
import { CHARACTERS, SCENARIOS } from "@/lib/content";
import { useAppState } from "@/lib/store/use-app-state";
import { Avatar } from "./Avatar";
import { TaskBoard } from "./TaskBoard";

export function Workspace() {
  const state = useAppState();
  if (!state?.profile) return null;

  const done = SCENARIOS.filter((scenario) => state.runs[scenario.id]?.completedAt).length;
  const isFresh = Object.keys(state.runs).length === 0;
  const isFinished = done === SCENARIOS.length;

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-slate-500">Junior Backend Developer · команда Payments</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">
            Привет, {state.profile.name}!
          </h1>
        </div>
        <div className="w-full max-w-xs">
          <div className="mb-1 flex justify-between text-sm text-slate-600">
            <span>Прогресс</span>
            <span className="tabular-nums">
              {done} из {SCENARIOS.length}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-indigo-600 transition-[width] duration-500"
              style={{ width: `${(done / SCENARIOS.length) * 100}%` }}
            />
          </div>
        </div>
      </header>

      {isFresh && (
        <section className="rounded-2xl border border-indigo-100 bg-white p-5 shadow-sm">
          <div className="flex gap-3">
            <Avatar name={CHARACTERS[0].name} color={CHARACTERS[0].color} />
            <div className="space-y-2 leading-relaxed text-slate-700">
              <p>
                <span className="font-semibold text-slate-900">{CHARACTERS[0].name}:</span> Добро
                пожаловать в TechCore! Впереди пять рабочих ситуаций твоего первого месяца.
              </p>
              <p>
                Единственно верных ответов почти нет: решения ведут к разным последствиям. После
                каждого решения будет разбор, а в конце — отчёт о твоих сильных сторонах и зонах
                роста. Начни с TC-101.
              </p>
            </div>
          </div>
        </section>
      )}

      {isFinished && (
        <section className="flex flex-col gap-3 rounded-2xl bg-indigo-600 p-5 text-white sm:flex-row sm:items-center sm:justify-between">
          <p className="font-medium">Все задачи закрыты. Итоговый отчёт готов.</p>
          <Link
            href="/report"
            className="rounded-xl bg-white px-4 py-2 text-center font-medium text-indigo-700 hover:bg-indigo-50"
          >
            Смотреть отчёт →
          </Link>
        </section>
      )}

      <TaskBoard scenarios={SCENARIOS} runs={state.runs} />

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Твоя команда
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {CHARACTERS.map((character) => (
            <li
              key={character.id}
              className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3"
            >
              <Avatar name={character.name} color={character.color} />
              <div className="min-w-0">
                <p className="truncate font-medium text-slate-900">{character.name}</p>
                <p className="text-xs leading-snug text-slate-500">{character.role}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
