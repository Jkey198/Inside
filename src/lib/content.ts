import charactersData from "@/content/characters.json";
import aiCode from "@/content/scenarios/ai-code.json";
import codeReview from "@/content/scenarios/code-review.json";
import dayOneSetup from "@/content/scenarios/day-one-setup.json";
import deadline from "@/content/scenarios/deadline.json";
import firstDaily from "@/content/scenarios/first-daily.json";
import wikiData from "@/content/wiki.json";
import { assertScenario } from "./scenario/validate";
import type { Character, Scenario } from "./scenario/types";

export interface WikiSection {
  heading: string;
  paragraphs: string[];
  list?: string[];
}

export interface WikiArticle {
  slug: string;
  title: string;
  summary: string;
  sections: WikiSection[];
}

// New scenario: add the JSON file to src/content/scenarios and register it here
const RAW_SCENARIOS: Record<string, unknown> = {
  "day-one-setup.json": dayOneSetup,
  "first-daily.json": firstDaily,
  "ai-code.json": aiCode,
  "deadline.json": deadline,
  "code-review.json": codeReview,
};

// Validation runs at import time, so broken content fails the build instead of the user
export const SCENARIOS: readonly Scenario[] = Object.entries(RAW_SCENARIOS)
  .map(([file, raw]) => assertScenario(raw, file))
  .sort((a, b) => a.order - b.order);

export const CHARACTERS: readonly Character[] = charactersData;

export const WIKI: readonly WikiArticle[] = wikiData;

export function getScenario(id: string): Scenario | undefined {
  return SCENARIOS.find((scenario) => scenario.id === id);
}

export function getCharacter(id: string): Character | undefined {
  return CHARACTERS.find((character) => character.id === id);
}

export function getWikiArticle(slug: string): WikiArticle | undefined {
  return WIKI.find((article) => article.slug === slug);
}

export function getNextScenario(id: string): Scenario | undefined {
  const index = SCENARIOS.findIndex((scenario) => scenario.id === id);
  return index >= 0 ? SCENARIOS[index + 1] : undefined;
}
