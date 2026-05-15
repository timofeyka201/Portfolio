"use client"

import Link from "next/link"
import { useLang } from "@/components/lang-context"

export default function AboutClient({ data }: { data: any }) {
  const { t, lang } = useLang()

  const bio = data.profile?.bio || (lang === "ru" 
    ? "Я Product Manager с passion к созданию AI-продуктов и быстрых прототипов."
    : "I'm a Product Manager with a passion for building AI-native products and rapid prototypes.")
  
  const philosophy = data.profile?.philosophy || (lang === "ru"
    ? "Мой подход к product management основан на глубоком понимании пользователей. Я верю в методологию Jobs-to-be-Done (JTBD), data-driven решения и итеративную разработку."
    : "My approach to product management is rooted in deep user understanding. I believe in Jobs-to-be-Done (JTBD) methodology, data-driven decision making, and iterative development.")
  
  const currentFocus = data.profile?.currentFocus || (lang === "ru"
    ? "В настоящее время фокусируюсь на AI-продуктах, vibecoding прототипах и изучении того, как LLMs могут трансформировать product workflows."
    : "Currently focused on AI-powered products, vibecoding prototypes, and exploring how LLMs can transform product workflows.")
  
  const interests = data.profile?.interests || (lang === "ru"
    ? "AI/ML, startup экосистемы, product development, UX research, автоматизация и создание инструментов."
    : "AI/ML, startup ecosystems, product development, UX research, automation, and building tools that make life easier.")

  return (
    <div className="min-h-screen py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight mb-8">{t("about.title")}</h1>

        <div className="space-y-8 text-lg text-foreground-muted">
          <p>{bio}</p>

          <p>{philosophy}</p>

          <div className="border-l-2 border-accent pl-6 py-2">
            <h2 className="text-xl font-semibold text-foreground mb-4">{t("about.currentFocus")}</h2>
            <p>{currentFocus}</p>
          </div>

          {data.education?.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-4">{t("about.education")}</h2>
              {data.education.map((edu: any) => (
                <div key={edu.id} className="bg-background-secondary border border-border-subtle rounded-lg p-4 mb-3">
                  <h3 className="font-semibold text-foreground">{edu.institution}</h3>
                  <p className="text-foreground-muted">{edu.degree} {edu.field && `in ${edu.field}`}</p>
                </div>
              ))}
            </div>
          )}

          {data.languages?.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-4">{t("about.languages")}</h2>
              <ul className="space-y-2">
                {data.languages.map((langItem: any) => (
                  <li key={langItem.id} className="flex items-center gap-2">
                    <span className="text-foreground">{langItem.name}</span>
                    <span className="text-foreground-muted">- {langItem.proficiency}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4">{t("about.interests")}</h2>
            <p>{interests}</p>
          </div>
        </div>

        <div className="mt-12 flex gap-4">
          <Link href="/experience" className="text-accent hover:underline">
            {t("nav.experience")} →
          </Link>
          <Link href="/projects" className="text-accent hover:underline">
            {t("nav.projects")} →
          </Link>
        </div>
      </div>
    </div>
  )
}