"use client"

import { useLang } from "@/components/lang-context"

export default function SkillsClient({ skills }: { skills: any[] }) {
  const { t, lang } = useLang()

  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = []
    acc[skill.category].push(skill)
    return acc
  }, {} as Record<string, typeof skills>)

  const categories = Object.keys(skillsByCategory).sort()

  return (
    <div className="min-h-screen py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight mb-4">{t("skills.title")}</h1>
        <p className="text-lg text-foreground-muted mb-12">
          {t("skills.title") === "Навыки" ? "Моя экспертиза в product, AI, аналитике и технических областях." : "My expertise across product, AI, analytics, and technical domains."}
        </p>

        <div className="space-y-10">
          {categories.map((category) => (
            <div key={category}>
              <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-border-subtle">
                {category}
              </h2>
              <div className="flex flex-wrap gap-3">
                {skillsByCategory[category].map((skill) => (
                  <span
                    key={skill.id}
                    className="px-3 py-1.5 bg-background-secondary border border-border-subtle rounded-md text-sm"
                  >
                    {lang === 'ru' ? (skill.nameRu || skill.nameEn) : (skill.nameEn || skill.nameRu)}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}