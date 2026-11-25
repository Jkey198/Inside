import type { Metadata } from "next";
import Link from "next/link";
import { WIKI } from "@/lib/content";

export const metadata: Metadata = {
  title: "Wiki TechCore",
};

export default function WikiPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Wiki TechCore</h1>
        <p className="mt-2 leading-relaxed text-slate-600">
          Внутренние правила команды. В реальной компании о многом из этого не пишут, а узнают после
          первой ошибки.
        </p>
      </header>
      <ul className="grid gap-3 sm:grid-cols-2">
        {WIKI.map((article) => (
          <li key={article.slug}>
            <Link
              href={`/wiki/${article.slug}`}
              className="block h-full rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:border-indigo-300 hover:shadow-md"
            >
              <h2 className="font-semibold text-slate-900">{article.title}</h2>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">{article.summary}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
