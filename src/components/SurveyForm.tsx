"use client";

import { useState, type FormEvent } from "react";
import { getAppStore } from "@/lib/store/app-store";
import { ScaleInput } from "./ScaleInput";

// Feeds the MVP metrics: confidence delta, perceived realism and NPS
export function SurveyForm() {
  const [confidenceAfter, setConfidenceAfter] = useState<number | null>(null);
  const [realism, setRealism] = useState<number | null>(null);
  const [nps, setNps] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const isReady = confidenceAfter !== null && realism !== null && nps !== null;

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (confidenceAfter === null || realism === null || nps === null) return;
    getAppStore().submitSurvey({ confidenceAfter, realism, nps, comment: comment.trim() });
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      <ScaleInput
        label="Насколько ты теперь уверен(а), что справишься с первой работой в IT-команде?"
        min={1}
        max={10}
        value={confidenceAfter}
        onChange={setConfidenceAfter}
        minHint="совсем не уверен(а)"
        maxHint="полностью уверен(а)"
      />
      <ScaleInput
        label="Насколько ситуации похожи на реальную работу?"
        min={1}
        max={5}
        value={realism}
        onChange={setRealism}
        minHint="совсем не похожи"
        maxHint="как в жизни"
      />
      <ScaleInput
        label="Насколько вероятно, что ты порекомендуешь Inside другу?"
        min={0}
        max={10}
        value={nps}
        onChange={setNps}
        minHint="точно нет"
        maxHint="обязательно"
      />
      <label className="block">
        <span className="mb-2 block font-medium text-slate-800">
          Что было полезно, а чего не хватило? (необязательно)
        </span>
        <textarea
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          rows={3}
          maxLength={1000}
          className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
        />
      </label>
      <button
        type="submit"
        disabled={!isReady}
        className="rounded-xl bg-indigo-600 px-4 py-2.5 font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        Отправить ответы
      </button>
    </form>
  );
}
