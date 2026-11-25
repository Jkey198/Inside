export type SkillId = "communication" | "ownership" | "autonomy" | "teamwork";

export type SkillEffects = Partial<Record<SkillId, number>>;

// How a choice reads in hindsight; several options may be acceptable
export type ChoiceTone = "good" | "mixed" | "risky";

export interface Character {
  id: string;
  name: string;
  role: string;
  color: string;
}

export interface MessageNode {
  id: string;
  type: "message";
  // character id; "system" renders as a narration line
  from: string;
  text: string;
  next: string;
}

export interface ChoiceOption {
  id: string;
  text: string;
  // "action" options describe what the player does instead of what they write
  kind?: "message" | "action";
  next: string;
  effects: SkillEffects;
  tone: ChoiceTone;
  feedback: string;
}

export interface ChoiceNode {
  id: string;
  type: "choice";
  prompt: string;
  options: ChoiceOption[];
}

export interface EndNode {
  id: string;
  type: "end";
  summary: string;
}

export type ScenarioNode = MessageNode | ChoiceNode | EndNode;

export interface Scenario {
  id: string;
  order: number;
  ticket: string;
  title: string;
  briefing: string;
  channel: string;
  // step of the as-is customer journey map this scenario addresses
  cjmStep: number;
  durationMin: number;
  skills: SkillId[];
  wiki: string[];
  start: string;
  nodes: ScenarioNode[];
}
