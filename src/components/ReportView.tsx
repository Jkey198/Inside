"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { SCENARIOS } from "@/lib/content";
import { buildExport, downloadJson, exportFilename } from "@/lib/export";
import { buildReport, levelLabel } from "@/lib/report";
import type { SkillId } from "@/lib/scenario/types";
import { SKILLS } from "@/lib/skills";
import { getAppStore } from "@/lib/store/app-store";
import { useAppState } from "@/lib/store/use-app-state";
import { ProOffer } from "./ProOffer";
import { SkillBars } from "./SkillBars";
import { SurveyForm } from "./SurveyForm";

export function ReportView() {
  const state = useAppState();
  const router = useRouter();
  if (!state?.profile) return null;

  const store = getAppStore();
  const report = buildReport(SCENARIOS, state.runs);
  const doneCount = report.completed.length;

  const exportResults = () => {
    // track first so the exported file contains the export event too
    store.track("results_exported");
    const snapshot = store.getSnapshot();
    downloadJson(exportFilename(snapshot), buildExport(snapshot, report, SCENARIOS));
  };

  const resetForNextRespondent = () => {
    if (!window.confirm("Удалить прогресс и ответы? Перед этим стоит скачать результаты.")) return;
    store.reset();
    router.replace("/onboarding");
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8 pb-16">
      <header>
        <p className="text-sm text-slate-500">
          {state.profile.name} · Junior Backend Developer · TechCore
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
          Отчёт о готовности к работе в команде
        </h1>
        <p className="mt-2 text-slate-600">
          Пройдено задач: {doneCount} из {report.total}.
          {doneCount < report.total && (
            <>
              {" "}
              Отчёт обновляется после каждой задачи —{" "}
              <Link
                href="/workspace"
                className="text-indigo-700 underline-offset-2 hover:underline"
              >
                вернуться к задачам
              </Link>
              .
            </>
          )}
        </p>
      </header>

      {doneCount === 0 ? (
        <Card>
          <p className="text-slate-600">
            Здесь появятся твои навыки, сильные стороны и зоны роста. Пройди хотя бы одну задачу.
          </p>
        </Card>
      ) : (
        <>
          <Card>
            <div className="grid gap-6 sm:grid-cols-[auto_1fr] sm:items-center">
              <div className="text-center sm:pr-6">
                <p className="text-5xl font-bold tabular-nums text-indigo-600">
                  {report.overall ?? "—"}
                  {report.overall !== null && <span className="text-2xl">%</span>}
                </p>
                {report.overall !== null && (
                  <p className="mt-1 text-sm font-medium text-slate-600">
                    {levelLabel(report.overall)}
                  </p>
                )}
              </div>
              <div className="space-y-3">
                <SkillGroup title="Сильные стороны" skills={report.strengths} tone="good" />
                <SkillGroup title="Зоны роста" skills={report.growth} tone="growth" />
              </div>
            </div>
          </Card>

          <Card title="Навыки">
            <SkillBars items={report.skills} showDescription />
          </Card>

          {report.growth.length > 0 && (
            <Card title="Что потренировать">
              <ul className="space-y-3">
                {report.growth.map((skill) => (
                  <li key={skill} className="leading-relaxed text-slate-700">
                    <span className="font-medium text-slate-900">{SKILLS[skill].label}.</span>{" "}
                    {SKILLS[skill].advice}
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {report.riskyPicks.length > 0 && (
            <Card title="Моменты для разбора">
              <ul className="space-y-4">
                {report.riskyPicks.map(({ scenario, option }) => (
                  <li
                    key={`${scenario.id}:${option.id}`}
                    className="border-l-2 border-rose-300 pl-4"
                  >
                    <p className="text-xs text-slate-500">
                      {scenario.ticket} · {scenario.title}
                    </p>
                    <p className="mt-1 font-medium text-slate-900">«{option.text}»</p>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">{option.feedback}</p>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          <Card title="Чем закончились задачи">
            <ul className="space-y-3">
              {report.outcomes.map(({ scenario, ending }) => (
                <li key={scenario.id}>
                  <Link
                    href={`/scenario/${scenario.id}`}
                    className="font-medium text-slate-900 hover:text-indigo-700"
                  >
                    {scenario.ticket} · {scenario.title}
                  </Link>
                  <p className="text-sm leading-relaxed text-slate-600">{ending.summary}</p>
                </li>
              ))}
            </ul>
          </Card>

          <Card title="Пара вопросов о симуляторе">
            {state.survey ? (
              <p className="leading-relaxed text-slate-700">
                Спасибо за ответы! Уверенность перед первой работой: было{" "}
                <b>{state.profile.confidenceBefore}</b>, стало <b>{state.survey.confidenceAfter}</b>{" "}
                из 10.
              </p>
            ) : (
              <SurveyForm />
            )}
          </Card>

          <ProOffer isClicked={state.proClicked} />
        </>
      )}

      <section className="space-y-3 rounded-2xl border border-dashed border-slate-300 p-5 text-sm text-slate-600">
        <p>
          <b className="text-slate-800">Для тестирования с командой Inside.</b> Прогресс хранится
          только в этом браузере. Скачай результаты и отправь их нам, затем сбрось прогресс для
          следующего участника.
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={exportResults}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 font-medium text-slate-700 hover:bg-slate-50"
          >
            Скачать результаты (JSON)
          </button>
          <button
            type="button"
            onClick={resetForNextRespondent}
            className="rounded-lg px-3 py-2 font-medium text-rose-700 hover:bg-rose-50"
          >
            Сбросить прогресс
          </button>
        </div>
      </section>
    </div>
  );
}

interface CardProps {
  title?: string;
  children: ReactNode;
}

function Card({ title, children }: CardProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      {title && <h2 className="mb-4 text-lg font-semibold text-slate-900">{title}</h2>}
      {children}
    </section>
  );
}

interface SkillGroupProps {
  title: string;
  skills: readonly SkillId[];
  tone: "good" | "growth";
}

function SkillGroup({ title, skills, tone }: SkillGroupProps) {
  return (
    <div>
      <p className="mb-1.5 text-sm font-medium text-slate-500">{title}</p>
      {skills.length === 0 ? (
        <p className="text-sm text-slate-400">пока не выделяются</p>
      ) : (
        <ul className="flex flex-wrap gap-1.5">
          {skills.map((skill) => (
            <li
              key={skill}
              className={`rounded-full px-2.5 py-1 text-sm font-medium ${
                tone === "good" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
              }`}
            >
              {SKILLS[skill].label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
