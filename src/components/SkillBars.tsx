import { levelLabel } from "@/lib/report";
import type { SkillId } from "@/lib/scenario/types";
import { SKILLS } from "@/lib/skills";

export interface SkillBarItem {
  skill: SkillId;
  percent: number | null;
}

interface SkillBarsProps {
  items: readonly SkillBarItem[];
  showDescription?: boolean;
}

export function SkillBars({ items, showDescription = false }: SkillBarsProps) {
  return (
    <ul className="space-y-4">
      {items.map(({ skill, percent }) => {
        const meta = SKILLS[skill];
        return (
          <li key={skill}>
            <div className="mb-1.5 flex items-baseline justify-between gap-3">
              <span className="font-medium text-slate-800">{meta.label}</span>
              <span className="text-sm tabular-nums text-slate-600">
                {percent === null ? "нет данных" : `${percent}% · ${levelLabel(percent)}`}
              </span>
            </div>
            <div
              role="meter"
              aria-label={meta.label}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={percent ?? 0}
              className="h-2.5 overflow-hidden rounded-full bg-slate-100"
            >
              <div
                className="h-full rounded-full transition-[width] duration-700"
                style={{ width: `${percent ?? 0}%`, backgroundColor: meta.color }}
              />
            </div>
            {showDescription && <p className="mt-1.5 text-sm text-slate-500">{meta.description}</p>}
          </li>
        );
      })}
    </ul>
  );
}
