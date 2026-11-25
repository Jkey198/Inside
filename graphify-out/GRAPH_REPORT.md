# Graph Report - inside  (2026-11-25)

## Corpus Check
- 61 files · ~22,912 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 2, .ico 1, .css 1)

## Summary
- 365 nodes · 771 edges · 14 communities (13 shown, 1 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 10 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- ScenarioPlayer.tsx
- package.json
- next
- ReportView.tsx
- engine.ts
- Inside — исследование
- app-store.ts
- compilerOptions
- validate.ts
- Inside — план до финала
- Scenario
- aggregate-results.mjs
- app/layout.tsx
- AGENTS.md

## God Nodes (most connected - your core abstractions)
1. `next` - 20 edges
2. `Scenario` - 20 edges
3. `ScenarioPlayer()` - 17 edges
4. `AppStore` - 17 edges
5. `useAppState()` - 17 edges
6. `compilerOptions` - 16 edges
7. `ReportView()` - 15 edges
8. `getAppStore()` - 15 edges
9. `replay()` - 13 edges
10. `SkillId` - 12 edges

## Surprising Connections (you probably didn't know these)
- `Спринт 0 · 25–28.11 · MVP v0 ✅` --references--> `ProgressRepository`  [INFERRED]
  docs/roadmap.md → src/lib/storage/progress-repository.ts
- `Спринт 2 · 07–13.12 · v1: бэкенд и масштаб контента` --references--> `LocalStorageProgressRepository`  [INFERRED]
  docs/roadmap.md → src/lib/storage/progress-repository.ts
- `allPaths()` --calls--> `replay()`  [EXTRACTED]
  src/lib/scenario/scenarios.test.ts → src/lib/scenario/engine.ts
- `ReportPage()` --calls--> `ReportView()`  [EXTRACTED]
  src/app/(app)/report/page.tsx → src/components/ReportView.tsx
- `generateMetadata()` --calls--> `getScenario()`  [EXTRACTED]
  src/app/(app)/scenario/[id]/page.tsx → src/lib/content.ts

## Import Cycles
- None detected.

## Communities (14 total, 1 thin omitted)

### Community 0 - "ScenarioPlayer.tsx"
Cohesion: 0.06
Nodes (36): generateMetadata(), ScenarioPage(), metadata, generateMetadata(), WikiArticlePage(), FEATURES, Home(), preview (+28 more)

### Community 1 - "package.json"
Cohesion: 0.06
Nodes (39): eslintConfig, dependencies, next@16.4.6, react@19.3.0, react-dom@19.3.0, devDependencies, eslint@^9, eslint-config-next@16.4.6 (+31 more)

### Community 2 - "next"
Cohesion: 0.10
Nodes (28): nextConfig, next, react, AppLayout(), AppLayoutProps, metadata, WorkspacePage(), metadata (+20 more)

### Community 3 - "ReportView.tsx"
Cohesion: 0.11
Nodes (30): metadata, ReportPage(), FeedbackCard(), TONES, FEATURES, ProOffer(), ProOfferProps, Card() (+22 more)

### Community 4 - "engine.ts"
Cohesion: 0.11
Nodes (32): PlayerMessageProps, ChoicePanelProps, LETTERS, FeedbackCardProps, NextStep, ScenarioOutcomeProps, buildReport(), Outcome (+24 more)

### Community 5 - "Inside — исследование"
Cohesion: 0.06
Nodes (33): ① Персона, ② Фокус внимания, ③–⑦ Шаги, стадии, описание, визуализация, эмоции, ⑦ Кривая эмоций (для переноса на график), Где поможет Inside (заготовка to-be карты), Главный вывод (для устного отчёта), Карта клиентского пути (CJM) — Inside, Что проверить на следующих интервью (+25 more)

### Community 6 - "app-store.ts"
Cohesion: 0.13
Nodes (15): AnalyticsEvent, AnalyticsEventType, AppState, createEmptyState(), createSessionId(), isAppState(), LocalStorageProgressRepository, Profile (+7 more)

### Community 7 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 8 - "validate.ts"
Cohesion: 0.26
Nodes (11): ScenarioNode, assertScenario(), checkGraph(), checkShape(), isRecord(), isText(), NODE_TYPES, outgoing() (+3 more)

### Community 9 - "Inside — план до финала"
Cohesion: 0.18
Nodes (11): Inside — план до финала, Команда, Метрики и пороги, Не делаем до финала, Риски, Спринт 0 · 25–28.11 · MVP v0 ✅, Спринт 1 · 30.11–06.12 · Проверяем проблему и v0, Спринт 2 · 07–13.12 · v1: бэкенд и масштаб контента (+3 more)

### Community 10 - "Scenario"
Cohesion: 0.27
Nodes (10): ACTIONS, COLUMNS, statusOf(), TaskBoard(), TaskBoardProps, TaskCard(), TaskCardProps, TaskStatus (+2 more)

### Community 11 - "aggregate-results.mjs"
Cohesion: 0.39
Nodes (5): average(), fixed(), loadSessions(), main(), percent()

### Community 12 - "app/layout.tsx"
Cohesion: 0.33
Nodes (3): geistMono, geistSans, metadata

## Knowledge Gaps
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Inside — план до финала` connect `Inside — план до финала` to `Inside — исследование`?**
  _High betweenness centrality (0.193) - this node is a cross-community bridge._
- **Should `ScenarioPlayer.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06233766233766234 - nodes in this community are weakly interconnected._
- **Why does `next` connect `next` to `ScenarioPlayer.tsx`, `package.json`, `ReportView.tsx`, `engine.ts`, `Scenario`, `app/layout.tsx`?**
  _High betweenness centrality (0.167) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.059800664451827246 - nodes in this community are weakly interconnected._
- **Should `next` be split into smaller, more focused modules?**
  _Cohesion score 0.09523809523809523 - nodes in this community are weakly interconnected._
- **Should `ReportView.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Should `engine.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10796221322537113 - nodes in this community are weakly interconnected._