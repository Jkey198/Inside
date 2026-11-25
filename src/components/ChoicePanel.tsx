import type { ChoiceNode } from "@/lib/scenario/types";

const LETTERS = ["A", "B", "C", "D", "E"];

interface ChoicePanelProps {
  choice: ChoiceNode;
  onPick: (optionId: string) => void;
}

export function ChoicePanel({ choice, onPick }: ChoicePanelProps) {
  return (
    <section
      aria-label="Твой ход"
      className="rounded-2xl border border-indigo-200 bg-white p-4 shadow-sm shadow-indigo-100 sm:p-5"
    >
      <p className="mb-3 font-semibold text-slate-900">{choice.prompt}</p>
      <ul className="space-y-2">
        {choice.options.map((option, index) => (
          <li key={option.id}>
            <button
              type="button"
              onClick={() => onPick(option.id)}
              className="group flex w-full items-start gap-3 rounded-xl border border-slate-200 px-3 py-3 text-left transition-colors hover:border-indigo-400 hover:bg-indigo-50 focus-visible:outline-2 focus-visible:outline-indigo-500"
            >
              <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm font-semibold text-slate-600 group-hover:bg-indigo-600 group-hover:text-white">
                {LETTERS[index] ?? index + 1}
              </span>
              <span className="pt-0.5 leading-relaxed text-slate-800">
                {option.kind === "action" && (
                  <span className="mr-1.5 rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Действие
                  </span>
                )}
                {option.text}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
