import Link from "next/link";
import type { Scenario } from "@/lib/scenario/types";
import type { ScenarioRun } from "@/lib/storage/progress-repository";
import { SKILLS } from "@/lib/skills";

type TaskStatus = "todo" | "doing" | "done";

const COLUMNS: { status: TaskStatus; title: string }[] = [
  { status: "todo", title: "К выполнению" },
  { status: "doing", title: "В работе" },
  { status: "done", title: "Готово" },
];

function statusOf(run: ScenarioRun | undefined): TaskStatus {
  if (run?.completedAt) return "done";
  return run ? "doing" : "todo";
}

interface TaskBoardProps {
  scenarios: readonly Scenario[];
  runs: Readonly<Record<string, ScenarioRun>>;
}

export function TaskBoard({ scenarios, runs }: TaskBoardProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {COLUMNS.map((column) => {
        const tasks = scenarios.filter((scenario) => statusOf(runs[scenario.id]) === column.status);
        return (
          <section key={column.status} className="rounded-2xl bg-slate-100/80 p-3">
            <h2 className="mb-3 flex items-center justify-between px-1 text-sm font-semibold text-slate-600">
              {column.title}
              <span className="tabular-nums text-slate-400">{tasks.length}</span>
            </h2>
            <ul className="space-y-3">
              {tasks.map((scenario) => (
                <li key={scenario.id}>
                  <TaskCard scenario={scenario} status={column.status} />
                </li>
              ))}
              {tasks.length === 0 && (
                <li className="rounded-xl border border-dashed border-slate-300 px-3 py-6 text-center text-sm text-slate-400">
                  Пусто
                </li>
              )}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

interface TaskCardProps {
  scenario: Scenario;
  status: TaskStatus;
}

const ACTIONS: Record<TaskStatus, string> = {
  todo: "Взять в работу",
  doing: "Продолжить",
  done: "Открыть",
};

function TaskCard({ scenario, status }: TaskCardProps) {
  return (
    <Link
      href={`/scenario/${scenario.id}`}
      className="group block rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:border-indigo-300 hover:shadow-md"
    >
      <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
        <span className="font-mono">{scenario.ticket}</span>
        <span>~{scenario.durationMin} мин</span>
      </div>
      <h3 className="font-semibold leading-snug text-slate-900">{scenario.title}</h3>
      <p className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-slate-600">
        {scenario.briefing}
      </p>
      <ul className="mt-3 flex flex-wrap gap-1">
        {scenario.skills.map((skill) => (
          <li
            key={skill}
            className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[11px] text-slate-600"
          >
            {SKILLS[skill].label}
          </li>
        ))}
      </ul>
      <p
        className={`mt-3 text-sm font-medium ${
          status === "done" ? "text-emerald-700" : "text-indigo-700 group-hover:underline"
        }`}
      >
        {status === "done" ? "✓ Готово" : `${ACTIONS[status]} →`}
      </p>
    </Link>
  );
}
