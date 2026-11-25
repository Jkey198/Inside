import {
  emptyTally,
  mergeTally,
  safeReplay,
  SKILL_IDS,
  toPercent,
  type SkillScore,
} from "./scenario/engine";
import type { ChoiceOption, EndNode, Scenario, SkillId } from "./scenario/types";

const STRENGTH_MIN = 70;
const GROWTH_MAX = 55;
const MAX_RISKY_PICKS = 4;

export interface RunLike {
  picks: string[];
  completedAt?: string;
}

export interface SkillResult {
  skill: SkillId;
  percent: number | null;
  score: SkillScore;
}

export interface RiskyPick {
  scenario: Scenario;
  option: ChoiceOption;
}

export interface Outcome {
  scenario: Scenario;
  ending: EndNode;
}

export interface Report {
  total: number;
  completed: Scenario[];
  skills: SkillResult[];
  overall: number | null;
  strengths: SkillId[];
  growth: SkillId[];
  riskyPicks: RiskyPick[];
  outcomes: Outcome[];
}

export function buildReport(
  scenarios: readonly Scenario[],
  runs: Readonly<Record<string, RunLike | undefined>>,
): Report {
  let tally = emptyTally();
  const completed: Scenario[] = [];
  const riskyPicks: RiskyPick[] = [];
  const outcomes: Outcome[] = [];

  for (const scenario of scenarios) {
    const run = runs[scenario.id];
    if (!run?.completedAt) continue;
    const result = safeReplay(scenario, run.picks);
    // stale progress after a content update is skipped rather than miscounted
    if (!result?.ending) continue;

    completed.push(scenario);
    outcomes.push({ scenario, ending: result.ending });
    tally = mergeTally(tally, result.tally);
    for (const entry of result.entries) {
      if (entry.kind === "pick" && entry.option.tone === "risky") {
        riskyPicks.push({ scenario, option: entry.option });
      }
    }
  }

  const skills = SKILL_IDS.map((skill) => ({
    skill,
    percent: toPercent(tally[skill]),
    score: tally[skill],
  }));
  const measured = skills.filter(
    (result): result is SkillResult & { percent: number } => result.percent !== null,
  );
  const overall =
    measured.length > 0
      ? Math.round(measured.reduce((sum, result) => sum + result.percent, 0) / measured.length)
      : null;

  const strengths = measured
    .filter((result) => result.percent >= STRENGTH_MIN)
    .map((result) => result.skill);
  let growth = measured
    .filter((result) => result.percent < GROWTH_MAX)
    .map((result) => result.skill);
  // always point at something to improve unless the run is near-perfect
  if (growth.length === 0 && measured.length > 0) {
    const weakest = [...measured].sort((a, b) => a.percent - b.percent)[0];
    if (weakest.percent < 85) growth = [weakest.skill];
  }

  return {
    total: scenarios.length,
    completed,
    skills,
    overall,
    strengths,
    growth,
    riskyPicks: riskyPicks.slice(0, MAX_RISKY_PICKS),
    outcomes,
  };
}

export function levelLabel(percent: number): string {
  if (percent >= 75) return "Уверенно";
  if (percent >= 50) return "Хорошая база";
  return "Зона роста";
}
