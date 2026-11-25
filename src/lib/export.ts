import type { Report } from "./report";
import { safeReplay } from "./scenario/engine";
import type { Scenario } from "./scenario/types";
import type { AppState } from "./storage/progress-repository";

export const EXPORT_FORMAT = "inside-results/v1";

/**
 * Flat, human-readable snapshot of one respondent's session.
 * scripts/aggregate-results.mjs reads a folder of these files.
 */
export function buildExport(state: AppState, report: Report, scenarios: readonly Scenario[]) {
  const runs = scenarios.map((scenario) => {
    const run = state.runs[scenario.id];
    const result = run ? safeReplay(scenario, run.picks) : null;
    return {
      scenarioId: scenario.id,
      title: scenario.title,
      attempt: run?.attempt ?? 0,
      startedAt: run?.startedAt ?? null,
      completedAt: run?.completedAt ?? null,
      picks:
        result?.entries.flatMap((entry) =>
          entry.kind === "pick"
            ? [
                {
                  nodeId: entry.choice.id,
                  optionId: entry.option.id,
                  tone: entry.option.tone,
                  text: entry.option.text,
                },
              ]
            : [],
        ) ?? [],
      ending: result?.ending?.id ?? null,
    };
  });

  return {
    format: EXPORT_FORMAT,
    exportedAt: new Date().toISOString(),
    sessionId: state.sessionId,
    profile: state.profile,
    survey: state.survey,
    proClicked: state.proClicked,
    summary: {
      completed: report.completed.length,
      total: report.total,
      overall: report.overall,
      skills: Object.fromEntries(report.skills.map((result) => [result.skill, result.percent])),
    },
    runs,
    events: state.events,
  };
}

export function downloadJson(filename: string, data: unknown): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function exportFilename(state: AppState): string {
  const name = (state.profile?.name ?? "anon")
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-|-$/g, "");
  const date = new Date().toISOString().slice(0, 10);
  return `inside-${name || "anon"}-${date}-${state.sessionId.slice(0, 6)}.json`;
}
