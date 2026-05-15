"use client"

import { useLang } from "@/components/lang-context"

export default function ExperienceClient({ experiences }: { experiences: any[] }) {
  const { t } = useLang()

  return (
    <div className="min-h-screen py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight mb-4">{t("experience.title")}</h1>
        <p className="text-lg text-foreground-muted mb-12">
          {t("experience.title") === "Опыт" ? "Мой путь в product management и создании продуктов." : "My journey in product management and building products."}
        </p>

        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-px bg-border" />

          <div className="space-y-12 pl-8">
            {experiences.map((exp) => (
              <div key={exp.id} className="relative">
                <div className="absolute -left-[33px] top-2 w-3 h-3 rounded-full bg-accent border-2 border-background" />

                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <h3 className="text-lg font-semibold">{exp.role}</h3>
                    <span className="text-sm text-foreground-muted">
                      {new Date(exp.startDate).getFullYear()} - {exp.isCurrent ? t("experience.present") : exp.endDate ? new Date(exp.endDate).getFullYear() : ''}
                    </span>
                  </div>

                  <p className="text-foreground-muted font-medium">{exp.company}</p>
                  {exp.description && <p className="text-foreground-muted">{exp.description}</p>}

                  {exp.highlights.length > 0 && (
                    <ul className="list-disc list-inside space-y-1 text-sm text-foreground-muted">
                      {exp.highlights.map((highlight: string, i: number) => (
                        <li key={i}>{highlight}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}