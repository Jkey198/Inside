import { describe, expect, it } from "vitest";
import { CHARACTERS, SCENARIOS, WIKI } from "@/lib/content";
import { replay } from "./engine";
import type { Scenario } from "./types";

// Enumerates every possible playthrough as a list of picks
function allPaths(scenario: Scenario): string[][] {
  const paths: string[][] = [];
  const walk = (picks: string[]): void => {
    const { pending, ending } = replay(scenario, picks);
    if (ending) {
      paths.push(picks);
      return;
    }
    for (const option of pending!.options) walk([...picks, option.id]);
  };
  walk([]);
  return paths;
}

describe("scenario content", () => {
  it("ships five scenarios with unique ids, orders and tickets", () => {
    expect(SCENARIOS).toHaveLength(5);
    for (const key of ["id", "order", "ticket"] as const) {
      const values = SCENARIOS.map((scenario) => scenario[key]);
      expect(new Set(values).size).toBe(values.length);
    }
  });

  const characterIds = new Set([...CHARACTERS.map((character) => character.id), "system"]);
  const wikiSlugs = new Set(WIKI.map((article) => article.slug));

  describe.each(SCENARIOS.map((scenario) => [scenario.id, scenario] as const))(
    "%s",
    (_, scenario) => {
      it("references only known characters and wiki articles", () => {
        for (const node of scenario.nodes) {
          if (node.type === "message") expect(characterIds).toContain(node.from);
        }
        for (const slug of scenario.wiki) expect(wikiSlugs).toContain(slug);
      });

      it("reaches an end on every path", () => {
        const paths = allPaths(scenario);
        expect(paths.length).toBeGreaterThanOrEqual(3);
        for (const picks of paths) expect(replay(scenario, picks).ending).not.toBeNull();
      });

      it("offers at least one good and one risky option at every choice", () => {
        for (const node of scenario.nodes) {
          if (node.type !== "choice") continue;
          const tones = node.options.map((option) => option.tone);
          expect(tones, node.id).toContain("good");
          expect(
            tones.some((tone) => tone !== "good"),
            node.id,
          ).toBe(true);
        }
      });

      it("trains the skills it declares", () => {
        const touched = new Set(
          scenario.nodes.flatMap((node) =>
            node.type === "choice"
              ? node.options.flatMap((option) => Object.keys(option.effects))
              : [],
          ),
        );
        for (const skill of scenario.skills) expect(touched).toContain(skill);
      });
    },
  );
});
