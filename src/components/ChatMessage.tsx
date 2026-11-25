import { getCharacter } from "@/lib/content";
import type { ChoiceOption } from "@/lib/scenario/types";
import { Avatar } from "./Avatar";
import { RichText } from "./RichText";

const PLAYER_COLOR = "#334155";

interface ChatMessageProps {
  // character id or "system" for narration
  from: string;
  text: string;
}

export function ChatMessage({ from, text }: ChatMessageProps) {
  if (from === "system") {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white/70 px-4 py-3 text-sm leading-relaxed text-slate-600">
        <RichText text={text} />
      </div>
    );
  }

  const character = getCharacter(from);
  const name = character?.name ?? from;

  return (
    <div className="flex gap-3">
      <Avatar name={name} color={character?.color ?? PLAYER_COLOR} />
      <div className="min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-2">
          <span className="font-semibold text-slate-900">{name}</span>
          {character && <span className="text-xs text-slate-500">{character.role}</span>}
        </div>
        <p className="mt-0.5 leading-relaxed text-slate-800">
          <RichText text={text} />
        </p>
      </div>
    </div>
  );
}

interface PlayerMessageProps {
  playerName: string;
  option: ChoiceOption;
}

// The player's pick: either a written message or an action they take
export function PlayerMessage({ playerName, option }: PlayerMessageProps) {
  if (option.kind === "action") {
    return (
      <div className="flex items-start gap-3 rounded-xl bg-slate-800 px-4 py-3 text-sm text-slate-100">
        <span className="mt-0.5 shrink-0 rounded bg-white/15 px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide">
          Действие
        </span>
        <span className="leading-relaxed">{option.text}</span>
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      <Avatar name={playerName} color={PLAYER_COLOR} />
      <div className="min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="font-semibold text-slate-900">{playerName}</span>
          <span className="text-xs text-slate-500">ты</span>
        </div>
        <p className="mt-0.5 leading-relaxed text-slate-800">{option.text}</p>
      </div>
    </div>
  );
}
