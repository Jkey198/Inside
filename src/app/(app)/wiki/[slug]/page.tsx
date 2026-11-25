import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getWikiArticle, SCENARIOS, WIKI } from "@/lib/content";

export function generateStaticParams() {
  return WIKI.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: PageProps<"/wiki/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  return { title: getWikiArticle(slug)?.title ?? "Статья не найдена" };
}

export default async function WikiArticlePage({ params }: PageProps<"/wiki/[slug]">) {
  const { slug } = await params;
  const article = getWikiArticle(slug);
  if (!article) notFound();

  const related = SCENARIOS.filter((scenario) => scenario.wiki.includes(slug));

  return (
    <article className="mx-auto max-w-2xl pb-16">
      <Link href="/wiki" className="text-sm text-slate-500 hover:text-slate-800">
        ← Wiki TechCore
      </Link>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight">{article.title}</h1>
      <p className="mt-2 leading-relaxed text-slate-600">{article.summary}</p>

      <div className="mt-8 space-y-8">
        {article.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="mb-2 text-lg font-semibold text-slate-900">{section.heading}</h2>
            <div className="space-y-3 leading-relaxed text-slate-700">
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {section.list && (
                <ul className="list-disc space-y-1.5 pl-5">
                  {section.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        ))}
      </div>

      {related.length > 0 && (
        <aside className="mt-10 rounded-xl bg-slate-100 p-4">
          <p className="mb-2 text-sm font-medium text-slate-600">Пригодится в задачах</p>
          <ul className="space-y-1">
            {related.map((scenario) => (
              <li key={scenario.id}>
                <Link
                  href={`/scenario/${scenario.id}`}
                  className="text-indigo-700 underline-offset-2 hover:underline"
                >
                  {scenario.ticket} · {scenario.title}
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      )}
    </article>
  );
}
