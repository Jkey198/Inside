import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ScenarioPlayer } from "@/components/ScenarioPlayer";
import { getScenario, SCENARIOS } from "@/lib/content";

// Static export prerenders one page per scenario
export function generateStaticParams() {
  return SCENARIOS.map((scenario) => ({ id: scenario.id }));
}

export async function generateMetadata({ params }: PageProps<"/scenario/[id]">): Promise<Metadata> {
  const { id } = await params;
  const scenario = getScenario(id);
  return { title: scenario ? `${scenario.ticket} · ${scenario.title}` : "Задача не найдена" };
}

export default async function ScenarioPage({ params }: PageProps<"/scenario/[id]">) {
  const { id } = await params;
  if (!getScenario(id)) notFound();
  return <ScenarioPlayer scenarioId={id} />;
}
