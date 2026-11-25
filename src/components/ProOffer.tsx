"use client";

import { getAppStore } from "@/lib/store/app-store";

const FEATURES = [
  "30+ рабочих ситуаций: инцидент в проде, 1:1 с менеджером, конфликт приоритетов",
  "Треки Frontend, QA и Data Analyst",
  "Свободные ответы коллегам с AI-разбором формулировок",
  "Сертификат с результатами для резюме",
];

interface ProOfferProps {
  isClicked: boolean;
}

/**
 * Fake door: measures willingness to pay before Pro exists.
 * After the click we say so honestly instead of pretending to sell.
 */
export function ProOffer({ isClicked }: ProOfferProps) {
  return (
    <section className="rounded-2xl bg-slate-900 p-6 text-slate-200">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-lg font-semibold text-white">Inside Pro</h2>
        <span className="text-sm text-slate-400">399 ₽ / месяц</span>
      </div>
      <ul className="mt-3 space-y-1.5 text-sm">
        {FEATURES.map((feature) => (
          <li key={feature} className="flex gap-2">
            <span aria-hidden className="text-indigo-400">
              ✦
            </span>
            {feature}
          </li>
        ))}
      </ul>
      {isClicked ? (
        <p className="mt-5 rounded-xl bg-white/10 p-4 text-sm leading-relaxed">
          Спасибо за интерес! Pro пока в разработке: этой кнопкой мы проверяем, нужен ли он. Твой
          клик уже помог нам решить, что делать дальше.
        </p>
      ) : (
        <button
          type="button"
          onClick={() => getAppStore().clickPro()}
          className="mt-5 rounded-xl bg-indigo-500 px-4 py-2.5 font-medium text-white hover:bg-indigo-400"
        >
          Хочу Inside Pro
        </button>
      )}
    </section>
  );
}
