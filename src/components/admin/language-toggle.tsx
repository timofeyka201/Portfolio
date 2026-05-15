"use client"

import { useState } from "react"

type AdminLang = "ru" | "en"

interface LanguageToggleProps {
  lang: AdminLang
  onChange: (lang: AdminLang) => void
}

export function LanguageToggle({ lang, onChange }: LanguageToggleProps) {
  return (
    <div className="flex items-center gap-2 bg-background-secondary border border-border rounded-lg p-1">
      <button
        type="button"
        onClick={() => onChange("ru")}
        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
          lang === "ru"
            ? "bg-accent text-white"
            : "text-foreground-muted hover:text-foreground"
        }`}
      >
        RU
      </button>
      <button
        type="button"
        onClick={() => onChange("en")}
        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
          lang === "en"
            ? "bg-accent text-white"
            : "text-foreground-muted hover:text-foreground"
        }`}
      >
        EN
      </button>
    </div>
  )
}

export function useAdminLang() {
  const [lang, setLang] = useState<AdminLang>("ru")
  return { lang, setLang }
}