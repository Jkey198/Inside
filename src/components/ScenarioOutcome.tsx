import Link from "next/link";
import { getWikiArticle } from "@/lib/content";
import { toPercent, type SkillTally } from "@/lib/scenario/engine";
import type { EndNode, Scenario } from "@/lib/scenario/types";
import { SkillBars } from "./SkillBars";

export interface NextStep {
  href: string;
  label: string;
}

interface ScenarioOutcomeProps {
  scenario: Scenario;
  ending: EndNode;
  tally: SkillTally;
  next: NextStep;
  onRestart: () => void;
}

export function ScenarioOutcome({
  scenario,
  ending,
  tally,
  next,
  onRestart,
}: ScenarioOutcomeProps) {
  const articles = scenario.wiki.flatMap((slug) => {
    const article = getWikiArticle(slug);
    return article ? [article] : [];
  });

  return (
    <section className="space-y-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
          Задача {scenario.ticket} завершена
        </p>
        <p className="mt-2 text-lg leading-relaxed text-slate-900">{ending.summary}</p>
      </div>

      <div>
        <h2 className="mb-3 font-semibold text-slate-900">Навыки в этой задаче</h2>
        <SkillBars
          items={scenario.skills.map((skill) => ({ skill, percent: toPercent(tally[skill]) }))}
        />
      </div>

      {articles.length > 0 && (
        <div>
          <h2 className="mb-2 font-semibold text-slate-900">Как это устроено в TechCore</h2>
          <ul className="space-y-1.5">
            {articles.map((article) => (
              <li key={article.slug}>
                <Link
                  href={`/wiki/${article.slug}`}
                  className="text-indigo-700 underline-offset-2 hover:underline"
                >
                  Wiki: {article.title}
                </Link>
                <span className="text-slate-500"> — {article.summary}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <Link
          href={next.href}
          className="rounded-xl bg-indigo-600 px-4 py-2.5 text-center font-medium text-white hover:bg-indigo-700"
        >
          {next.label} →
        </Link>
        <button
          type="button"
          onClick={onRestart}
          className="rounded-xl border border-slate-200 px-4 py-2.5 font-medium text-slate-700 hover:bg-slate-50"
        >
          Пройти заново
        </button>
      </div>
      <p className="text-sm text-slate-500">
        У задачи несколько концовок: попробуй другой путь и сравни последствия.
      </p>
    </section>
  );
}
