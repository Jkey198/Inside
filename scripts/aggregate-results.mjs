#!/usr/bin/env node
// Aggregates exported Inside sessions into the metrics we report on.
// Usage: npm run results -- <folder-with-json-exports>

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const FORMAT = "inside-results/v1";

function average(values) {
  if (values.length === 0) return null;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function percent(part, whole) {
  return whole === 0 ? "—" : `${Math.round((part / whole) * 100)}%`;
}

function fixed(value) {
  return value === null ? "—" : value.toFixed(1);
}

function loadSessions(folder) {
  const sessions = [];
  for (const file of readdirSync(folder)) {
    if (!file.endsWith(".json")) continue;
    try {
      const data = JSON.parse(readFileSync(join(folder, file), "utf8"));
      if (data.format === FORMAT) {
        sessions.push(data);
      } else {
        console.warn(`skip ${file}: not an Inside export`);
      }
    } catch (err) {
      console.warn(`skip ${file}: ${err.message}`);
    }
  }
  // the same person may export twice; keep the latest export per session
  const latest = new Map();
  for (const session of sessions) {
    const previous = latest.get(session.sessionId);
    if (!previous || previous.exportedAt < session.exportedAt)
      latest.set(session.sessionId, session);
  }
  return [...latest.values()];
}

function main() {
  const folder = process.argv[2];
  if (!folder) {
    console.error("Usage: npm run results -- <folder-with-json-exports>");
    process.exit(1);
  }

  const sessions = loadSessions(folder);
  const total = sessions.length;
  const runs = sessions.flatMap((session) => session.runs);
  const started = runs.filter((run) => run.startedAt);
  const completed = runs.filter((run) => run.completedAt);
  const surveyed = sessions.filter((session) => session.survey && session.profile);

  const deltas = surveyed.map(
    (session) => session.survey.confidenceAfter - session.profile.confidenceBefore,
  );
  const npsScores = surveyed.map((session) => session.survey.nps);
  const promoters = npsScores.filter((score) => score >= 9).length;
  const detractors = npsScores.filter((score) => score <= 6).length;
  const nps =
    npsScores.length > 0 ? Math.round(((promoters - detractors) / npsScores.length) * 100) : null;

  const rows = [
    ["Респондентов", String(total)],
    [
      "Доходимость сценариев (завершено / начато)",
      `${completed.length} / ${started.length} = ${percent(completed.length, started.length)}`,
    ],
    [
      "Прошли все сценарии",
      percent(sessions.filter((s) => s.summary.completed === s.summary.total).length, total),
    ],
    ["Заполнили анкету", `${surveyed.length} из ${total}`],
    [
      "Уверенность до (среднее, 1–10)",
      fixed(average(surveyed.map((s) => s.profile.confidenceBefore))),
    ],
    [
      "Уверенность после (среднее, 1–10)",
      fixed(average(surveyed.map((s) => s.survey.confidenceAfter))),
    ],
    ["Δ уверенности (цель ≥ +2)", fixed(average(deltas))],
    [
      "Реалистичность (среднее, цель ≥ 4 из 5)",
      fixed(average(surveyed.map((s) => s.survey.realism))),
    ],
    ["NPS", nps === null ? "—" : String(nps)],
    [
      "Клик по Inside Pro (цель ≥ 10%)",
      percent(sessions.filter((s) => s.proClicked).length, total),
    ],
  ];

  const width = Math.max(...rows.map(([label]) => label.length));
  console.log(`\nInside — сводка по ${total} сессиям из ${folder}\n`);
  for (const [label, value] of rows) console.log(`${label.padEnd(width)}  ${value}`);

  const comments = surveyed.map((s) => s.survey.comment).filter((comment) => comment.trim());
  if (comments.length > 0) {
    console.log("\nКомментарии:");
    for (const comment of comments) console.log(`- ${comment.trim()}`);
  }
}

main();
