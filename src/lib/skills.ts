import type { SkillId } from "./scenario/types";

export interface SkillMeta {
  id: SkillId;
  label: string;
  description: string;
  color: string;
  advice: string;
}

export const SKILLS: Record<SkillId, SkillMeta> = {
  communication: {
    id: "communication",
    label: "Коммуникация",
    description: "Понятно формулировать вопросы, статусы и несогласие",
    color: "#4f46e5",
    advice:
      "Перед отправкой сообщения проверь: понятно ли без переписки, что ты делаешь, что пошло не так и что уже пробовал.",
  },
  ownership: {
    id: "ownership",
    label: "Ответственность",
    description: "Отвечать за сроки, риски и каждую строчку своего кода — даже написанную AI",
    color: "#0891b2",
    advice:
      "Сообщай о рисках сразу, как узнал, и предлагай варианты. Плохие новости рано лучше очень плохих новостей поздно.",
  },
  autonomy: {
    id: "autonomy",
    label: "Самостоятельность",
    description: "Сначала разобраться самому, но вовремя попросить помощь",
    color: "#d97706",
    advice:
      "Правило 30 минут: сначала ищи сам (README, PR, логи), потом спрашивай — уже с конкретным вопросом.",
  },
  teamwork: {
    id: "teamwork",
    label: "Командная работа",
    description: "Работать через общие процессы и думать о тех, кто придёт после тебя",
    color: "#16a34a",
    advice:
      "Используй общие каналы вместо личек, договаривайся о приоритетах открыто и чини то, что мешает следующим новичкам.",
  },
};

export function formatDelta(delta: number): string {
  return delta > 0 ? `+${delta}` : `−${Math.abs(delta)}`;
}
