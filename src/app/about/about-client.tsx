"use client"

import Link from "next/link"
import { useLang } from "@/components/lang-context"

export default function AboutClient({ data }: { data: any }) {
  const { t, lang } = useLang()

  const getField = (ru: string | null, en: string | null) => lang === 'ru' ? (ru || en || '') : (en || ru || '')

  const bio = getField(data.profile?.bioRu, data.profile?.bioEn)
  const philosophy = getField(data.profile?.philosophyRu, data.profile?.philosophyEn)
  const currentFocus = getField(data.profile?.currentFocusRu, data.profile?.currentFocusEn)
  const interests = getField(data.profile?.interestsRu, data.profile?.interestsEn)

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
                  <h3 className="font-semibold text-foreground">{lang === 'ru' ? (edu.institutionRu || edu.institutionEn) : (edu.institutionEn || edu.institutionRu)}</h3>
                  <p className="text-foreground-muted">
                    {lang === 'ru' ? (edu.degreeRu || edu.degreeEn) : (edu.degreeEn || edu.degreeRu)} 
                    {(lang === 'ru' ? (edu.fieldRu || edu.fieldEn) : (edu.fieldEn || edu.fieldRu)) && ` in ${lang === 'ru' ? (edu.fieldRu || edu.fieldEn) : (edu.fieldEn || edu.fieldRu)}`}
                  </p>
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
                    <span className="text-foreground">{lang === 'ru' ? (langItem.nameRu || langItem.nameEn) : (langItem.nameEn || langItem.nameRu)}</span>
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