"use client"

import { useLang } from "@/components/lang-context"

export default function AchievementsClient({ achievements }: { achievements: any[] }) {
  const { lang, t } = useLang()

  return (
    <div className="min-h-screen py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight mb-4">{t("achievements.title")}</h1>
        <p className="text-lg text-foreground-muted mb-12">
          {lang === 'ru' ? 'Награды, соревнования и достижения.' : 'Awards, competitions, and milestones.'}
        </p>

        <div className="space-y-6">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className="border border-border-subtle rounded-lg p-6 bg-background-secondary hover:border-border transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                <h3 className="text-lg font-semibold">
                  {lang === 'ru' ? (achievement.titleRu || achievement.titleEn) : (achievement.titleEn || achievement.titleRu)}
                </h3>
                <span className="text-sm text-foreground-muted">
                  {new Date(achievement.date).toLocaleDateString(lang === 'ru' ? 'ru-RU' : 'en-US')}
                </span>
              </div>

              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs px-2 py-1 rounded bg-accent/10 text-accent">
                  {achievement.type}
                </span>
              </div>

              {(lang === 'ru' ? (achievement.descriptionRu || achievement.descriptionEn) : (achievement.descriptionEn || achievement.descriptionRu)) && (
                <p className="text-foreground-muted">
                  {lang === 'ru' ? (achievement.descriptionRu || achievement.descriptionEn) : (achievement.descriptionEn || achievement.descriptionRu)}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}