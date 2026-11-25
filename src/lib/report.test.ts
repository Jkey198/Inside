import { describe, expect, it } from "vitest";
import { SCENARIOS } from "./content";
import { buildReport, type RunLike } from "./report";
import { replay } from "./scenario/engine";
import type { ChoiceOption, Scenario } from "./scenario/types";

type Strategy = (options: ChoiceOption[]) => ChoiceOption;

const score = (option: ChoiceOption): number =>
  Object.values(option.effects).reduce((sum, delta) => sum + (delta ?? 0), 0);

const best: Strategy = (options) => [...options].sort((a, b) => score(b) - score(a))[0];
const worst: Strategy = (options) => [...options].sort((a, b) => score(a) - score(b))[0];

function play(scenario: Scenario, strategy: Strategy): RunLike {
  const picks: string[] = [];
  for (let { pending } = replay(scenario, picks); pending; { pending } = replay(scenario, picks)) {
    picks.push(strategy(pending.options).id);
  }
  return { picks, completedAt: "2026-11-25T12:00:00.000Z" };
}

function playAll(strategy: Strategy): Record<string, RunLike> {
  return Object.fromEntries(SCENARIOS.map((scenario) => [scenario.id, play(scenario, strategy)]));
}

describe("buildReport", () => {
  it("is empty before any scenario is completed", () => {
    const report = buildReport(SCENARIOS, {});
    expect(report.completed).toHaveLength(0);
    expect(report.overall).toBeNull();
    expect(report.strengths).toEqual([]);
  });

  it("rates the strongest playthrough highly with no risky picks", () => {
    const report = buildReport(SCENARIOS, playAll(best));
    expect(report.completed).toHaveLength(SCENARIOS.length);
    expect(report.overall).toBeGreaterThanOrEqual(85);
    expect(report.riskyPicks).toEqual([]);
    expect(report.strengths.length).toBeGreaterThan(0);
  });

  it("flags growth areas and risky picks for the weakest playthrough", () => {
    const report = buildReport(SCENARIOS, playAll(worst));
    expect(report.overall).toBeLessThan(30);
    expect(report.growth.length).toBeGreaterThan(0);
    expect(report.riskyPicks.length).toBeGreaterThan(0);
  });

  it("ignores unfinished and stale runs", () => {
    const [first, second] = SCENARIOS;
    const report = buildReport(SCENARIOS, {
      [first.id]: { picks: [] },
      [second.id]: { picks: ["removed-option"], completedAt: "2026-11-25T12:00:00.000Z" },
    });
    expect(report.completed).toHaveLength(0);
  });
});
