"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import type { Experience } from "@/lib/storage/progress-repository";
import { getAppStore } from "@/lib/store/app-store";
import { useAppState } from "@/lib/store/use-app-state";
import { ScaleInput } from "./ScaleInput";

const EXPERIENCE: { value: Experience; label: string }[] = [
  { value: "none", label: "Ещё не работал(а) в IT" },
  { value: "internship", label: "Была стажировка или летняя школа" },
  { value: "job", label: "Работаю или работал(а) в IT" },
];

export function OnboardingForm() {
  const state = useAppState();
  const router = useRouter();
  const [name, setName] = useState("");
  const [experience, setExperience] = useState<Experience | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  const isReady = name.trim().length > 0 && experience !== null && confidence !== null;

  if (state?.profile) {
    return (
      <div className="space-y-4">
        <p className="text-slate-700">
          Ты уже в команде, <b>{state.profile.name}</b>. Задачи ждут.
        </p>
        <Link
          href="/workspace"
          className="inline-block rounded-xl bg-indigo-600 px-4 py-2.5 font-medium text-white hover:bg-indigo-700"
        >
          К задачам →
        </Link>
      </div>
    );
  }

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isReady || experience === null || confidence === null) return;
    getAppStore().createProfile({ name: name.trim(), experience, confidenceBefore: confidence });
    router.push("/workspace");
  };

  return (
    <form onSubmit={submit} className="space-y-7">
      <label className="block">
        <span className="mb-2 block font-medium text-slate-800">Как тебя зовут?</span>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          maxLength={40}
          autoComplete="given-name"
          placeholder="Имя"
          className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
        />
      </label>

      <fieldset>
        <legend className="mb-2 font-medium text-slate-800">Опыт работы в IT</legend>
        <div className="grid gap-2">
          {EXPERIENCE.map((option) => (
            <label
              key={option.value}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 transition-colors ${
                experience === option.value
                  ? "border-indigo-500 bg-indigo-50"
                  : "border-slate-200 hover:border-indigo-300"
              }`}
            >
              <input
                type="radio"
                name="experience"
                value={option.value}
                checked={experience === option.value}
                onChange={() => setExperience(option.value)}
                className="accent-indigo-600"
              />
              {option.label}
            </label>
          ))}
        </div>
      </fieldset>

      <ScaleInput
        label="Насколько ты уверен(а), что справишься с первой работой в IT-команде?"
        min={1}
        max={10}
        value={confidence}
        onChange={setConfidence}
        minHint="совсем не уверен(а)"
        maxHint="полностью уверен(а)"
      />

      <div className="rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-600">
        Трек: <b className="text-slate-800">Junior Backend Developer</b> в команде Payments компании
        TechCore. Другие треки появятся позже.
      </div>

      <button
        type="submit"
        disabled={!isReady}
        className="w-full rounded-xl bg-indigo-600 px-4 py-3 font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        Начать первый рабочий день →
      </button>
    </form>
  );
}
