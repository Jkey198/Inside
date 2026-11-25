import type { ChoiceOption, ChoiceTone } from "@/lib/scenario/types";
import { SkillDeltas } from "./SkillDeltas";

// Several options can be fine, so the labels describe consequences rather than right/wrong
const TONES: Record<ChoiceTone, { label: string; card: string; badge: string }> = {
  good: {
    label: "Сильный ход",
    card: "border-emerald-200 bg-emerald-50/70",
    badge: "bg-emerald-600 text-white",
  },
  mixed: {
    label: "Есть нюансы",
    card: "border-amber-200 bg-amber-50/70",
    badge: "bg-amber-500 text-white",
  },
  risky: {
    label: "Рискованно",
    card: "border-rose-200 bg-rose-50/70",
    badge: "bg-rose-600 text-white",
  },
};

interface FeedbackCardProps {
  option: ChoiceOption;
}

export function FeedbackCard({ option }: FeedbackCardProps) {
  const tone = TONES[option.tone];

  return (
    <aside className={`space-y-2.5 rounded-xl border p-4 ${tone.card}`}>
      <div className="flex items-center gap-2">
        <span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${tone.badge}`}>
          {tone.label}
        </span>
        <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Разбор решения
        </span>
      </div>
      <p className="text-sm leading-relaxed text-slate-800">{option.feedback}</p>
      <SkillDeltas effects={option.effects} />
    </aside>
  );
}
