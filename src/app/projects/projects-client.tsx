"use client"

import Link from "next/link"
import { useLang } from "@/components/lang-context"

export default function ProjectsClient({ projects }: { projects: any[] }) {
  const { t, lang } = useLang()

  return (
    <div className="min-h-screen py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight mb-4">{t("projects.title")}</h1>
        <p className="text-lg text-foreground-muted mb-12">
          {t("projects.title") === "Проекты" ? "Продукты, которые я создал - от AI-инструментов до Telegram ботов." : "Products I've built, from AI-powered tools to Telegram bots."}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group border border-border-subtle rounded-lg p-6 bg-background-secondary hover:border-border transition-all hover:-translate-y-1"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold group-hover:text-accent transition-colors">
                  {lang === 'ru' ? (project.titleRu || project.titleEn) : (project.titleEn || project.titleRu)}
                </h3>
                <span className={`text-xs px-2 py-1 rounded ${
                  project.status === 'LIVE' 
                    ? 'bg-green-500/10 text-green-500' 
                    : 'bg-yellow-500/10 text-yellow-500'
                }`}>
                  {project.status}
                </span>
              </div>

              <p className="text-sm text-foreground-muted mb-4">
                {lang === 'ru' ? (project.descriptionRu || project.descriptionEn) : (project.descriptionEn || project.descriptionRu)}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {(lang === 'ru' ? (project.tagsRu || []) : (project.tagsEn || [])).map((tag: string) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-1 rounded bg-background text-foreground-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex gap-4">
                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-foreground-muted hover:text-foreground"
                  >
                    🔗 Demo
                  </a>
                )}
                {project.repoUrl && (
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-foreground-muted hover:text-foreground"
                  >
                    💻 Code
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <Link href="/contact" className="text-accent hover:underline">
            {t("projects.collaborate")}
          </Link>
        </div>
      </div>
    </div>
  )
}