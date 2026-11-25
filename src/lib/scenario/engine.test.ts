import { describe, expect, it } from "vitest";
import { applyPick, mergeTally, replay, safeReplay, toPercent } from "./engine";
import type { Scenario } from "./types";
import { validateScenario } from "./validate";

function makeScenario(overrides: Partial<Scenario> = {}): Scenario {
  return {
    id: "sample",
    order: 1,
    ticket: "TC-1",
    title: "Sample",
    briefing: "Sample scenario",
    channel: "#test",
    cjmStep: 1,
    durationMin: 1,
    skills: ["communication"],
    wiki: [],
    start: "m1",
    nodes: [
      { id: "m1", type: "message", from: "maria", text: "Hi", next: "c1" },
      {
        id: "c1",
        type: "choice",
        prompt: "Reply?",
        options: [
          {
            id: "good",
            text: "Good",
            next: "m2",
            effects: { communication: 2 },
            tone: "good",
            feedback: "ok",
          },
          {
            id: "bad",
            text: "Bad",
            next: "end-bad",
            effects: { communication: -1, teamwork: -2 },
            tone: "risky",
            feedback: "no",
          },
        ],
      },
      { id: "m2", type: "message", from: "system", text: "Later", next: "end-good" },
      { id: "end-good", type: "end", summary: "Done well" },
      { id: "end-bad", type: "end", summary: "Done badly" },
    ],
    ...overrides,
  };
}

describe("replay", () => {
  it("stops at the first unanswered choice", () => {
    const result = replay(makeScenario(), []);
    expect(result.entries.map((entry) => entry.kind)).toEqual(["message"]);
    expect(result.pending?.id).toBe("c1");
    expect(result.ending).toBeNull();
  });

  it("follows picks to the end and records the transcript", () => {
    const result = replay(makeScenario(), ["good"]);
    expect(result.entries.map((entry) => entry.kind)).toEqual([
      "message",
      "pick",
      "message",
      "end",
    ]);
    expect(result.ending?.id).toBe("end-good");
    expect(result.pending).toBeNull();
  });

  it("scores against the best and worst option of each answered choice", () => {
    const { tally } = replay(makeScenario(), ["bad"]);
    expect(tally.communication).toEqual({ earned: -1, min: -1, max: 2 });
    expect(tally.teamwork).toEqual({ earned: -2, min: -2, max: 0 });
    expect(tally.autonomy).toEqual({ earned: 0, min: 0, max: 0 });
  });

  it("throws on an unknown option and safeReplay turns it into null", () => {
    expect(() => replay(makeScenario(), ["missing"])).toThrow(/not found/);
    expect(safeReplay(makeScenario(), ["missing"])).toBeNull();
  });

  it("detects cycles instead of looping forever", () => {
    const looped = makeScenario({
      nodes: [
        { id: "m1", type: "message", from: "maria", text: "a", next: "m2" },
        { id: "m2", type: "message", from: "maria", text: "b", next: "m1" },
      ],
    });
    expect(() => replay(looped, [])).toThrow(/cycle/);
  });
});

describe("applyPick", () => {
  it("appends a valid option", () => {
    expect(applyPick(makeScenario(), [], "good")).toEqual(["good"]);
  });

  it("rejects options from another node and picks after the end", () => {
    expect(() => applyPick(makeScenario(), [], "nope")).toThrow();
    expect(() => applyPick(makeScenario(), ["good"], "good")).toThrow(/no pending choice/);
  });
});

describe("toPercent and mergeTally", () => {
  it("maps the earned score into the [min, max] range", () => {
    expect(toPercent({ earned: 2, min: -1, max: 2 })).toBe(100);
    expect(toPercent({ earned: -1, min: -1, max: 2 })).toBe(0);
    expect(toPercent({ earned: 0, min: -2, max: 2 })).toBe(50);
    expect(toPercent({ earned: 0, min: 0, max: 0 })).toBeNull();
  });

  it("sums tallies skill by skill", () => {
    const first = replay(makeScenario(), ["good"]).tally;
    const second = replay(makeScenario(), ["bad"]).tally;
    expect(mergeTally(first, second).communication).toEqual({ earned: 1, min: -2, max: 4 });
  });
});

describe("validateScenario", () => {
  it("accepts a well-formed scenario", () => {
    expect(validateScenario(makeScenario())).toEqual([]);
  });

  it("reports dangling links", () => {
    const broken = makeScenario();
    broken.nodes[0] = { id: "m1", type: "message", from: "maria", text: "Hi", next: "ghost" };
    expect(validateScenario(broken).join("\n")).toMatch(/missing "ghost"/);
  });

  it("reports unreachable nodes and cycles", () => {
    const orphan = makeScenario();
    orphan.nodes.push({ id: "lonely", type: "end", summary: "?" });
    expect(validateScenario(orphan).join("\n")).toMatch(/"lonely" is unreachable/);

    const looped = makeScenario();
    looped.nodes[2] = { id: "m2", type: "message", from: "system", text: "x", next: "c1" };
    expect(validateScenario(looped).join("\n")).toMatch(/cycle/);
  });

  it("reports bad option fields", () => {
    const raw = JSON.parse(JSON.stringify(makeScenario()));
    raw.nodes[1].options[0].tone = "great";
    raw.nodes[1].options[0].effects = { charisma: 5 };
    const errors = validateScenario(raw).join("\n");
    expect(errors).toMatch(/tone/);
    expect(errors).toMatch(/unknown skill "charisma"/);
  });
});
