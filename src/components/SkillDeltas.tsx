import { SKILL_IDS } from "@/lib/scenario/engine";
import type { SkillEffects } from "@/lib/scenario/types";
import { formatDelta, SKILLS } from "@/lib/skills";

interface SkillDeltasProps {
  effects: SkillEffects;
}

export function SkillDeltas({ effects }: SkillDeltasProps) {
  const deltas = SKILL_IDS.flatMap((skill) => {
    const delta = effects[skill] ?? 0;
    return delta === 0 ? [] : [{ skill, delta }];
  });
  if (deltas.length === 0) return null;

  return (
    <ul className="flex flex-wrap gap-1.5">
      {deltas.map(({ skill, delta }) => (
        <li
          key={skill}
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
            delta > 0 ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
          }`}
        >
          {formatDelta(delta)} {SKILLS[skill].label}
        </li>
      ))}
    </ul>
  );
}
