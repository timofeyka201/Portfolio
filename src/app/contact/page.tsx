import { Metadata } from "next"
import Link from "next/link"
import { prisma } from "@/lib/db"

export const metadata: Metadata = {
  title: "Contact | Timofey Morozov",
  description: "Get in touch - Telegram, Email, GitHub, LinkedIn.",
}

function TelegramIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 8-6 4 6 4V8Z"/><rect width="16" height="12" x="2" y="6" rx="2"/></svg>
}

function EmailIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
}

function GithubIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
}

function LinkedinIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
}

async function getSocialLinks() {
  return prisma.socialLink.findMany({
    where: { isVisible: true },
    orderBy: { order: 'asc' },
  })
}

export default async function ContactPage() {
  const socialLinks = await getSocialLinks()

  const icons: Record<string, React.ElementType> = {
    telegram: TelegramIcon,
    email: EmailIcon,
    github: GithubIcon,
    linkedin: LinkedinIcon,
  }

  const contactMethods = socialLinks.map(link => ({
    name: link.platform.charAt(0).toUpperCase() + link.platform.slice(1),
    description: getDescription(link.platform),
    icon: icons[link.platform] || Link,
    href: link.url,
    badge: link.platform === 'telegram' ? 'Preferred' : undefined,
  }))

  return (
    <div className="min-h-screen py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Contact</h1>
        <p className="text-lg text-foreground-muted mb-12">
          Let&apos;s connect. I&apos;m always open to discussing new projects, opportunities, or just chatting about product management and AI.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {contactMethods.map((method) => (
            <a
              key={method.name}
              href={method.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group border border-border-subtle rounded-lg p-6 bg-background-secondary hover:border-border transition-all hover:-translate-y-1"
            >
              <div className="flex items-start gap-4">
                <div className="p-2 bg-background rounded-lg group-hover:bg-accent/10 transition-colors">
                  <method.icon className="text-foreground-muted group-hover:text-accent" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold group-hover:text-accent transition-colors">
                      {method.name}
                    </h3>
                    {method.badge && (
                      <span className="text-xs px-2 py-0.5 rounded bg-accent/10 text-accent">
                        {method.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-foreground-muted mt-1">
                    {method.description}
                  </p>
                </div>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-16 p-6 bg-background-secondary border border-border-subtle rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Looking for a Product Manager?</h2>
          <p className="text-foreground-muted">
            I&apos;m currently available for full-time positions and freelance projects.
            Let&apos;s talk about how I can help bring your product vision to life.
          </p>
        </div>
      </div>
    </div>
  )
}

function getDescription(platform: string): string {
  const descriptions: Record<string, string> = {
    telegram: 'Fastest way to reach me',
    email: 'For formal inquiries',
    github: 'Check my code',
    linkedin: 'Professional network',
  }
  return descriptions[platform] || platform
}