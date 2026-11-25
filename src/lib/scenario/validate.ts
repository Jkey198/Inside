import type { ChoiceTone, Scenario, ScenarioNode, SkillId } from "./types";

const NODE_TYPES = new Set(["message", "choice", "end"]);
const TONES = new Set<ChoiceTone>(["good", "mixed", "risky"]);
const SKILLS = new Set<SkillId>(["communication", "ownership", "autonomy", "teamwork"]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isText(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function outgoing(node: ScenarioNode): string[] {
  if (node.type === "message") return [node.next];
  if (node.type === "choice") return node.options.map((option) => option.next);
  return [];
}

function checkShape(raw: unknown, errors: string[]): void {
  if (!isRecord(raw)) {
    errors.push("scenario must be an object");
    return;
  }
  for (const key of ["id", "ticket", "title", "briefing", "channel", "start"]) {
    if (!isText(raw[key])) errors.push(`"${key}" must be a non-empty string`);
  }
  for (const key of ["order", "cjmStep", "durationMin"]) {
    if (typeof raw[key] !== "number") errors.push(`"${key}" must be a number`);
  }
  if (!Array.isArray(raw.skills) || raw.skills.some((skill) => !SKILLS.has(skill))) {
    errors.push(`"skills" must list known skills: ${[...SKILLS].join(", ")}`);
  }
  if (!Array.isArray(raw.wiki)) errors.push(`"wiki" must be an array of slugs`);
  if (!Array.isArray(raw.nodes) || raw.nodes.length === 0) {
    errors.push(`"nodes" must be a non-empty array`);
    return;
  }

  raw.nodes.forEach((node: unknown, index: number) => {
    const where = isRecord(node) && isText(node.id) ? `node "${node.id}"` : `nodes[${index}]`;
    if (!isRecord(node) || !isText(node.id) || !NODE_TYPES.has(node.type as string)) {
      errors.push(`${where}: needs "id" and "type" (message | choice | end)`);
      return;
    }
    if (node.type === "message") {
      if (!isText(node.from) || !isText(node.text) || !isText(node.next)) {
        errors.push(`${where}: message needs "from", "text" and "next"`);
      }
    } else if (node.type === "end") {
      if (!isText(node.summary)) errors.push(`${where}: end needs "summary"`);
    } else {
      if (!isText(node.prompt)) errors.push(`${where}: choice needs "prompt"`);
      if (!Array.isArray(node.options) || node.options.length < 2) {
        errors.push(`${where}: choice needs at least 2 options`);
        return;
      }
      node.options.forEach((option: unknown, optionIndex: number) => {
        const label = `${where} option ${optionIndex + 1}`;
        if (!isRecord(option)) {
          errors.push(`${label}: must be an object`);
          return;
        }
        for (const key of ["id", "text", "next", "feedback"]) {
          if (!isText(option[key])) errors.push(`${label}: "${key}" must be a non-empty string`);
        }
        if (!TONES.has(option.tone as ChoiceTone)) {
          errors.push(`${label}: "tone" must be good | mixed | risky`);
        }
        if (!isRecord(option.effects)) {
          errors.push(`${label}: "effects" must be an object`);
          return;
        }
        for (const [skill, delta] of Object.entries(option.effects)) {
          if (!SKILLS.has(skill as SkillId)) errors.push(`${label}: unknown skill "${skill}"`);
          if (typeof delta !== "number" || Math.abs(delta) > 3) {
            errors.push(`${label}: effect "${skill}" must be a number in [-3, 3]`);
          }
        }
      });
    }
  });
}

// Graph checks: dangling links, unreachable nodes, cycles, dead ends
function checkGraph(scenario: Scenario, errors: string[]): void {
  const nodes = new Map<string, ScenarioNode>();
  for (const node of scenario.nodes) {
    if (nodes.has(node.id)) errors.push(`duplicate node id "${node.id}"`);
    nodes.set(node.id, node);
  }
  if (!nodes.has(scenario.start)) {
    errors.push(`start node "${scenario.start}" does not exist`);
    return;
  }
  for (const node of scenario.nodes) {
    for (const target of outgoing(node)) {
      if (!nodes.has(target)) errors.push(`node "${node.id}" points to missing "${target}"`);
    }
    if (node.type === "choice") {
      const ids = node.options.map((option) => option.id);
      if (new Set(ids).size !== ids.length)
        errors.push(`node "${node.id}" has duplicate option ids`);
    }
  }
  if (errors.length > 0) return;

  // DFS with colors: gray = on stack, black = finished
  const color = new Map<string, "gray" | "black">();
  const visit = (id: string, path: string[]): void => {
    const state = color.get(id);
    if (state === "black") return;
    if (state === "gray") {
      errors.push(`cycle: ${[...path, id].join(" -> ")}`);
      return;
    }
    color.set(id, "gray");
    const node = nodes.get(id)!;
    for (const target of outgoing(node)) visit(target, [...path, id]);
    color.set(id, "black");
  };
  visit(scenario.start, []);

  for (const node of scenario.nodes) {
    if (!color.has(node.id)) errors.push(`node "${node.id}" is unreachable from start`);
  }
  if (!scenario.nodes.some((node) => node.type === "end")) errors.push("scenario has no end node");
}

export function validateScenario(raw: unknown): string[] {
  const errors: string[] = [];
  checkShape(raw, errors);
  if (errors.length === 0) checkGraph(raw as Scenario, errors);
  return errors;
}

export function assertScenario(raw: unknown, source: string): Scenario {
  const errors = validateScenario(raw);
  if (errors.length > 0) {
    throw new Error(`Invalid scenario in ${source}:\n- ${errors.join("\n- ")}`);
  }
  return raw as Scenario;
}
