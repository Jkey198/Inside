import { ChatMessage } from "@/components/ChatMessage";
import { StartButton } from "@/components/StartButton";
import { SCENARIOS } from "@/lib/content";
import type { MessageNode } from "@/lib/scenario/types";

const FEATURES = [
  {
    title: "Рабочие ситуации",
    text: "Первый дейли, горящий дедлайн, 12 замечаний на ревью, код от нейросети. Единственно верного ответа нет — как и в жизни.",
  },
  {
    title: "Последствия и разбор",
    text: "Коллеги реагируют на твои решения, а после каждого хода — разбор: почему в реальной команде это работает именно так.",
  },
  {
    title: "Отчёт о навыках",
    text: "Коммуникация, ответственность, самостоятельность и командная работа. Сильные стороны, зоны роста и что потренировать.",
  },
];

// A real excerpt from the first scenario, so the preview never drifts from the content
const preview = SCENARIOS[0].nodes
  .filter((node): node is MessageNode => node.type === "message")
  .slice(0, 3);

const totalMinutes = SCENARIOS.reduce((sum, scenario) => sum + scenario.durationMin, 0);

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-slate-50 to-slate-50">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <span className="text-xl font-bold tracking-tight">Inside</span>
        <span className="text-sm text-slate-500">MVP v0</span>
      </header>

      <main className="mx-auto max-w-6xl px-5">
        <section className="grid items-center gap-10 py-10 lg:grid-cols-2 lg:py-16">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-indigo-600">
              Симулятор первой работы в IT
            </p>
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl">
              Проживи первый месяц в IT-команде до того, как он начнётся
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-slate-600">
              Виртуальная компания TechCore: задачи в трекере, сообщения от коллег, дейли и
              код-ревью. Ты принимаешь решения и сразу видишь, к чему они приводят.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <StartButton />
              <span className="text-sm text-slate-500">
                {SCENARIOS.length} задач · ~{totalMinutes} минут · без регистрации
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white shadow-xl shadow-indigo-100">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3 text-sm">
              <span className="font-semibold text-slate-800">{SCENARIOS[0].channel}</span>
              <span className="font-mono text-slate-400">{SCENARIOS[0].ticket}</span>
            </div>
            <div className="space-y-4 p-5">
              {preview.map((node) => (
                <ChatMessage key={node.id} from={node.from} text={node.text} />
              ))}
              <p className="rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm font-medium text-indigo-900">
                Что делаешь? Выбери один из трёх вариантов…
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl bg-slate-900 px-6 py-10 text-slate-200 sm:px-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-300">
            Что мы услышали на интервью
          </p>
          <blockquote className="mt-4 max-w-3xl text-xl leading-relaxed text-white sm:text-2xl">
            С кодом и документацией стажёр разобрался за несколько дней. Сложнее оказалось другое:
            командные дедлайны, ежедневное общение и негласные правила — например, что за код от
            нейросети отвечаешь ты.
          </blockquote>
          <p className="mt-4 max-w-3xl leading-relaxed text-slate-400">
            Университет и курсы готовят к технической части. Inside — к социальной и
            организационной: без риска испортить отношения с настоящей командой.
          </p>
        </section>

        <section className="grid gap-4 py-14 md:grid-cols-3">
          {FEATURES.map((feature, index) => (
            <div key={feature.title} className="rounded-2xl border border-slate-200 bg-white p-6">
              <span className="text-sm font-semibold text-indigo-600">0{index + 1}</span>
              <h2 className="mt-2 text-lg font-semibold text-slate-900">{feature.title}</h2>
              <p className="mt-2 leading-relaxed text-slate-600">{feature.text}</p>
            </div>
          ))}
        </section>
      </main>

      <footer className="border-t border-slate-200 py-6 text-center text-sm text-slate-500">
        Inside · MVP v0 · прогресс хранится только в твоём браузере
      </footer>
    </div>
  );
}
