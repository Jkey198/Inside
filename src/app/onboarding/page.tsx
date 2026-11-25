import type { Metadata } from "next";
import Link from "next/link";
import { OnboardingForm } from "@/components/OnboardingForm";

export const metadata: Metadata = {
  title: "Знакомство",
};

export default function OnboardingPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-5 py-12">
      <Link href="/" className="mb-8 text-lg font-bold tracking-tight">
        Inside
      </Link>
      <h1 className="text-2xl font-semibold tracking-tight">Добро пожаловать в TechCore</h1>
      <p className="mt-2 mb-8 leading-relaxed text-slate-600">
        Ты — новый Junior Backend Developer. Перед первым рабочим днём ответь на три вопроса: так мы
        сможем показать, что изменилось после симуляции.
      </p>
      <OnboardingForm />
      <p className="mt-6 text-center text-xs text-slate-400">
        Ответы хранятся только в твоём браузере.
      </p>
    </main>
  );
}
