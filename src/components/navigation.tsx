"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { useState } from "react"
import { useLang } from "@/components/lang-context"

const navItems = [
  { href: "/", labelKey: "nav.home" },
  { href: "/about", labelKey: "nav.about" },
  { href: "/experience", labelKey: "nav.experience" },
  { href: "/projects", labelKey: "nav.projects" },
  { href: "/skills", labelKey: "nav.skills" },
  { href: "/achievements", labelKey: "nav.achievements" },
  { href: "/contact", labelKey: "nav.contact" },
]

function MenuIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" x2="20" y1="12" y2="12"/>
      <line x1="4" x2="20" y1="6" y2="6"/>
      <line x1="4" x2="20" y1="18" y2="18"/>
    </svg>
  )
}

function XIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" x2="6" y1="6" y2="18"/>
      <line x1="6" x2="18" y1="6" y2="18"/>
    </svg>
  )
}

export function Navigation() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const { lang, setLang, t } = useLang()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="font-semibold text-lg tracking-tight">
            TM
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm transition-colors relative py-1",
                  pathname === item.href
                    ? "text-foreground"
                    : "text-foreground-muted hover:text-foreground"
                )}
              >
                {t(item.labelKey)}
                {pathname === item.href && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-px bg-accent"
                  />
                )}
              </Link>
            ))}
            
            <button
              onClick={() => setLang(lang === "ru" ? "en" : "ru")}
              className="text-sm text-foreground-muted hover:text-foreground border border-border px-2 py-1 rounded"
            >
              {lang === "ru" ? "EN" : "RU"}
            </button>
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <XIcon /> : <MenuIcon />}
          </button>
        </div>

        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-4 border-t border-border-subtle"
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "block py-2 text-sm transition-colors",
                  pathname === item.href
                    ? "text-foreground"
                    : "text-foreground-muted"
                )}
              >
                {t(item.labelKey)}
              </Link>
            ))}
            <button
              onClick={() => setLang(lang === "ru" ? "en" : "ru")}
              className="block py-2 text-sm text-foreground-muted border border-border px-2 py-1 rounded mt-2 w-fit"
            >
              {lang === "ru" ? "English" : "Русский"}
            </button>
          </motion.div>
        )}
      </nav>
    </header>
  )
}