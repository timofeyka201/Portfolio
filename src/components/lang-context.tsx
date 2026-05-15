"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

type Lang = "ru" | "en"

interface Translations {
  [key: string]: string
}

const translations: Record<Lang, Translations> = {
  ru: {
    "nav.home": "Главная",
    "nav.about": "Обо мне",
    "nav.experience": "Опыт",
    "nav.projects": "Проекты",
    "nav.skills": "Навыки",
    "nav.achievements": "Достижения",
    "nav.contact": "Контакты",
    "home.available": "Доступен для работы",
    "home.viewProjects": "Смотреть проекты",
    "home.contactMe": "Связаться",
    "home.years": "Лет опыта",
    "home.projects": "Проектов",
    "home.technologies": "Технологий",
    "about.title": "Обо мне",
    "about.currentFocus": "Текущий фокус",
    "about.education": "Образование",
    "about.languages": "Языки",
    "about.interests": "Интересы",
    "experience.title": "Опыт",
    "experience.present": "По настоящее время",
    "projects.title": "Проекты",
    "projects.collaborate": "Хочешь сотрудничать? Давай обсудим →",
    "skills.title": "Навыки",
    "achievements.title": "Достижения",
    "contact.title": "Контакты",
    "contact.description": "Давай познакомимся. Всегда открыт для обсуждения новых проектов или просто поболтать о Product Management и AI.",
    "contact.looking": "Ищешь Product Manager?",
    "contact.available": "Я доступен для full-time позиций и фриланс-проектов.",
    "contact.telegram": "Самый быстрый способ связаться",
    "contact.email": "Для официальных запросов",
    "contact.github": "Мой код",
    "contact.linkedin": "Профессиональная сеть",
  },
  en: {
    "nav.home": "Home",
    "nav.about": "About",
    "nav.experience": "Experience",
    "nav.projects": "Projects",
    "nav.skills": "Skills",
    "nav.achievements": "Achievements",
    "nav.contact": "Contact",
    "home.available": "Available for work",
    "home.viewProjects": "View Projects",
    "home.contactMe": "Contact Me",
    "home.years": "Years Experience",
    "home.projects": "Projects Built",
    "home.technologies": "Technologies",
    "about.title": "About",
    "about.currentFocus": "Current Focus",
    "about.education": "Education",
    "about.languages": "Languages",
    "about.interests": "Interests",
    "experience.title": "Experience",
    "experience.present": "Present",
    "projects.title": "Projects",
    "projects.collaborate": "Want to collaborate? Let's talk →",
    "skills.title": "Skills",
    "achievements.title": "Achievements",
    "contact.title": "Contact",
    "contact.description": "Let's connect. I'm always open to discussing new projects or just chatting about product management and AI.",
    "contact.looking": "Looking for a Product Manager?",
    "contact.available": "I'm currently available for full-time positions and freelance projects.",
    "contact.telegram": "Fastest way to reach me",
    "contact.email": "For formal inquiries",
    "contact.github": "Check my code",
    "contact.linkedin": "Professional network",
  },
}

interface LangContextType {
  lang: Lang
  setLang: (lang: Lang) => void
  t: (key: string) => string
}

const LangContext = createContext<LangContextType | undefined>(undefined)

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ru")

  useEffect(() => {
    const saved = localStorage.getItem("portfolio-lang") as Lang
    if (saved && (saved === "ru" || saved === "en")) {
      setLangState(saved)
    }
  }, [])

  const setLang = (newLang: Lang) => {
    setLangState(newLang)
    localStorage.setItem("portfolio-lang", newLang)
  }

  const t = (key: string): string => {
    return translations[lang][key] || key
  }

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  const context = useContext(LangContext)
  if (!context) {
    throw new Error("useLang must be used within LangProvider")
  }
  return context
}