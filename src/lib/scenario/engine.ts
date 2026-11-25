import type {
  ChoiceNode,
  ChoiceOption,
  EndNode,
  MessageNode,
  Scenario,
  ScenarioNode,
  SkillId,
} from "./types";

export const SKILL_IDS: readonly SkillId[] = ["communication", "ownership", "autonomy", "teamwork"];

export type TranscriptEntry =
  | { kind: "message"; node: MessageNode }
  | { kind: "pick"; choice: ChoiceNode; option: ChoiceOption }
  | { kind: "end"; node: EndNode };

export interface SkillScore {
  earned: number;
  min: number;
  max: number;
}

export type SkillTally = Record<SkillId, SkillScore>;

export interface ReplayResult {
  entries: TranscriptEntry[];
  pending: ChoiceNode | null;
  ending: EndNode | null;
  tally: SkillTally;
}

export function emptyTally(): SkillTally {
  return {
    communication: { earned: 0, min: 0, max: 0 },
    ownership: { earned: 0, min: 0, max: 0 },
    autonomy: { earned: 0, min: 0, max: 0 },
    teamwork: { earned: 0, min: 0, max: 0 },
  };
}

export function mergeTally(target: SkillTally, source: SkillTally): SkillTally {
  const merged = emptyTally();
  for (const skill of SKILL_IDS) {
    merged[skill] = {
      earned: target[skill].earned + source[skill].earned,
      min: target[skill].min + source[skill].min,
      max: target[skill].max + source[skill].max,
    };
  }
  return merged;
}

export function indexNodes(scenario: Scenario): Map<string, ScenarioNode> {
  return new Map(scenario.nodes.map((node) => [node.id, node]));
}

// Bounds are taken per answered choice, so the score reflects the path actually played
function addPick(tally: SkillTally, choice: ChoiceNode, option: ChoiceOption): void {
  for (const skill of SKILL_IDS) {
    const values = choice.options.map((candidate) => candidate.effects[skill] ?? 0);
    tally[skill].earned += option.effects[skill] ?? 0;
    tally[skill].max += Math.max(0, ...values);
    tally[skill].min += Math.min(0, ...values);
  }
}

/**
 * Rebuilds the conversation from the list of picked option ids.
 * Progress is stored as picks only, so the transcript is always derived from content.
 */
export function replay(scenario: Scenario, picks: readonly string[]): ReplayResult {
  const nodes = indexNodes(scenario);
  const entries: TranscriptEntry[] = [];
  const tally = emptyTally();
  let nodeId = scenario.start;
  let pickIndex = 0;

  // a valid graph visits each node at most once, so this bound catches cycles
  for (let steps = 0; steps <= scenario.nodes.length; ++steps) {
    const node = nodes.get(nodeId);
    if (!node) {
      throw new Error(`Scenario "${scenario.id}": unknown node "${nodeId}"`);
    }

    if (node.type === "message") {
      entries.push({ kind: "message", node });
      nodeId = node.next;
      continue;
    }

    if (node.type === "end") {
      entries.push({ kind: "end", node });
      return { entries, pending: null, ending: node, tally };
    }

    if (pickIndex >= picks.length) {
      return { entries, pending: node, ending: null, tally };
    }

    const option = node.options.find((candidate) => candidate.id === picks[pickIndex]);
    if (!option) {
      throw new Error(
        `Scenario "${scenario.id}": option "${picks[pickIndex]}" not found in "${node.id}"`,
      );
    }
    ++pickIndex;
    addPick(tally, node, option);
    entries.push({ kind: "pick", choice: node, option });
    nodeId = option.next;
  }

  throw new Error(`Scenario "${scenario.id}": cycle detected near "${nodeId}"`);
}

// Same as replay, but returns null when stored picks no longer match the content
export function safeReplay(scenario: Scenario, picks: readonly string[]): ReplayResult | null {
  try {
    return replay(scenario, picks);
  } catch {
    return null;
  }
}

export function applyPick(
  scenario: Scenario,
  picks: readonly string[],
  optionId: string,
): string[] {
  const { pending } = replay(scenario, picks);
  if (!pending) {
    throw new Error(`Scenario "${scenario.id}" has no pending choice`);
  }
  if (!pending.options.some((option) => option.id === optionId)) {
    throw new Error(`Option "${optionId}" does not belong to "${pending.id}"`);
  }
  return [...picks, optionId];
}

export function toPercent(score: SkillScore): number | null {
  if (score.max === score.min) return null;
  return Math.round(((score.earned - score.min) / (score.max - score.min)) * 100);
}
