import { applyPick, replay } from "@/lib/scenario/engine";
import type { Scenario } from "@/lib/scenario/types";
import {
  createEmptyState,
  LocalStorageProgressRepository,
  STORAGE_KEY,
  type AnalyticsEvent,
  type AnalyticsEventType,
  type AppState,
  type Profile,
  type ProgressRepository,
  type ScenarioRun,
  type SurveyAnswers,
} from "@/lib/storage/progress-repository";

type Listener = () => void;

function now(): string {
  return new Date().toISOString();
}

function event(
  type: AnalyticsEventType,
  details: Omit<AnalyticsEvent, "type" | "at"> = {},
): AnalyticsEvent {
  return { type, at: now(), ...details };
}

/**
 * Single source of truth for progress, read through useSyncExternalStore.
 * Progress never lives in component state, so every page and tab sees the same picks.
 */
export class AppStore {
  private state: AppState | null = null;
  private readonly listeners = new Set<Listener>();

  constructor(private readonly repository: ProgressRepository) {}

  subscribe = (listener: Listener): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  getSnapshot = (): AppState => {
    if (!this.state) this.state = this.repository.load();
    return this.state;
  };

  reloadFromStorage(): void {
    this.state = this.repository.load();
    this.emit();
  }

  createProfile(input: Omit<Profile, "createdAt">): void {
    this.update((state) => ({
      ...state,
      profile: { ...input, createdAt: now() },
      events: [...state.events, event("onboarding_completed")],
    }));
  }

  startScenario(scenarioId: string): void {
    if (this.getSnapshot().runs[scenarioId]) return;
    this.update((state) => ({
      ...state,
      runs: { ...state.runs, [scenarioId]: { picks: [], attempt: 1, startedAt: now() } },
      events: [...state.events, event("scenario_started", { scenarioId })],
    }));
  }

  // nodeId guards against double clicks answering the next question by accident
  pick(scenario: Scenario, nodeId: string, optionId: string): void {
    const current = this.getSnapshot();
    const run: ScenarioRun = current.runs[scenario.id] ?? {
      picks: [],
      attempt: 1,
      startedAt: now(),
    };
    const { pending } = replay(scenario, run.picks);
    if (pending?.id !== nodeId) return;

    const picks = applyPick(scenario, run.picks, optionId);
    const { ending } = replay(scenario, picks);
    const events = [
      event("choice_made", { scenarioId: scenario.id, nodeId, optionId }),
      ...(ending ? [event("scenario_completed", { scenarioId: scenario.id })] : []),
    ];
    this.update((state) => ({
      ...state,
      runs: {
        ...state.runs,
        [scenario.id]: { ...run, picks, completedAt: ending ? now() : undefined },
      },
      events: [...state.events, ...events],
    }));
  }

  restartScenario(scenarioId: string): void {
    this.update((state) => {
      const previous = state.runs[scenarioId];
      return {
        ...state,
        runs: {
          ...state.runs,
          [scenarioId]: {
            picks: [],
            attempt: (previous?.attempt ?? 0) + 1,
            startedAt: now(),
          },
        },
        events: [...state.events, event("scenario_restarted", { scenarioId })],
      };
    });
  }

  submitSurvey(answers: Omit<SurveyAnswers, "submittedAt">): void {
    this.update((state) => ({
      ...state,
      survey: { ...answers, submittedAt: now() },
      events: [...state.events, event("survey_submitted")],
    }));
  }

  clickPro(): void {
    this.update((state) => ({
      ...state,
      proClicked: true,
      events: [...state.events, event("pro_clicked")],
    }));
  }

  track(type: AnalyticsEventType): void {
    this.update((state) => ({ ...state, events: [...state.events, event(type)] }));
  }

  // used between test sessions: the next respondent starts from scratch
  reset(): void {
    this.repository.clear();
    this.state = createEmptyState();
    this.repository.save(this.state);
    this.emit();
  }

  private update(recipe: (state: AppState) => AppState): void {
    this.state = recipe(this.getSnapshot());
    this.repository.save(this.state);
    this.emit();
  }

  private emit(): void {
    for (const listener of this.listeners) listener();
  }
}

let browserStore: AppStore | null = null;

export function getAppStore(): AppStore {
  if (browserStore) return browserStore;
  browserStore = new AppStore(new LocalStorageProgressRepository());
  if (typeof window !== "undefined") {
    // keep several open tabs in sync
    window.addEventListener("storage", (storageEvent) => {
      if (storageEvent.key === STORAGE_KEY || storageEvent.key === null) {
        browserStore?.reloadFromStorage();
      }
    });
  }
  return browserStore;
}
