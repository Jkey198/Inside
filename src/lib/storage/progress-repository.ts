export const STORAGE_KEY = "inside:v1";

export type Experience = "none" | "internship" | "job";

export interface Profile {
  name: string;
  experience: Experience;
  // self-assessed readiness for a first job, 1..10
  confidenceBefore: number;
  createdAt: string;
}

export interface ScenarioRun {
  picks: string[];
  attempt: number;
  startedAt: string;
  completedAt?: string;
}

export interface SurveyAnswers {
  confidenceAfter: number;
  realism: number;
  nps: number;
  comment: string;
  submittedAt: string;
}

export type AnalyticsEventType =
  | "onboarding_completed"
  | "scenario_started"
  | "choice_made"
  | "scenario_completed"
  | "scenario_restarted"
  | "survey_submitted"
  | "pro_clicked"
  | "results_exported";

export interface AnalyticsEvent {
  type: AnalyticsEventType;
  at: string;
  scenarioId?: string;
  nodeId?: string;
  optionId?: string;
}

export interface AppState {
  version: 1;
  sessionId: string;
  profile: Profile | null;
  runs: Record<string, ScenarioRun>;
  survey: SurveyAnswers | null;
  proClicked: boolean;
  events: AnalyticsEvent[];
}

/**
 * Persistence boundary. MVP keeps progress in the browser;
 * the backend sprint adds an API-based implementation of the same interface.
 */
export interface ProgressRepository {
  load(): AppState;
  save(state: AppState): void;
  clear(): void;
}

function createSessionId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  // fallback for insecure contexts (e.g. file://) where randomUUID is unavailable
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function createEmptyState(): AppState {
  return {
    version: 1,
    sessionId: createSessionId(),
    profile: null,
    runs: {},
    survey: null,
    proClicked: false,
    events: [],
  };
}

function isAppState(value: unknown): value is AppState {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Partial<AppState>;
  return (
    candidate.version === 1 &&
    typeof candidate.sessionId === "string" &&
    typeof candidate.runs === "object" &&
    candidate.runs !== null &&
    Array.isArray(candidate.events)
  );
}

export class LocalStorageProgressRepository implements ProgressRepository {
  constructor(private readonly key: string = STORAGE_KEY) {}

  load(): AppState {
    const raw = window.localStorage.getItem(this.key);
    if (!raw) return createEmptyState();
    try {
      const parsed: unknown = JSON.parse(raw);
      if (isAppState(parsed)) return parsed;
      console.warn("Inside: stored progress has an unknown format, starting fresh");
    } catch (err) {
      console.warn("Inside: stored progress is corrupted, starting fresh", err);
    }
    return createEmptyState();
  }

  save(state: AppState): void {
    try {
      window.localStorage.setItem(this.key, JSON.stringify(state));
    } catch (err) {
      // private mode or quota: the session still works, it just won't survive a reload
      console.warn("Inside: failed to persist progress", err);
    }
  }

  clear(): void {
    window.localStorage.removeItem(this.key);
  }
}
