"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { SocialLinksTab } from "@/components/admin/social-links-tab"
import { SkillsTab } from "@/components/admin/skills-tab"
import { ProjectsTab } from "@/components/admin/projects-tab"
import { ExperiencesTab } from "@/components/admin/experiences-tab"
import { AchievementsTab } from "@/components/admin/achievements-tab"
import { EducationTab } from "@/components/admin/education-tab"
import { LanguagesTab } from "@/components/admin/languages-tab"
import { ProfileTab } from "@/components/admin/profile-tab"
import { LanguageToggle } from "@/components/admin/language-toggle"

interface AdminData {
  profile: any
  experiences: any[]
  projects: any[]
  skills: any[]
  achievements: any[]
  socialLinks: any[]
  education: any[]
  languages: any[]
}

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [data, setData] = useState<AdminData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("profile")
const [adminLang, setAdminLang] = useState<"ru" | "en">("ru")

  const fetchData = async () => {
    try {
      const res = await fetch(`/api/admin/data?lang=${adminLang}`)
      const json = await res.json()
      setData(json)
    } catch (error) {
      console.error("Failed to fetch data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login")
    } else if (status === "authenticated") {
      fetchData()
    }
  }, [status, router])

  const fetchData = async () => {
    try {
      const res = await fetch(`/api/admin/data?lang=${adminLang}`)
      const json = await res.json()
      setData(json)
      if (json.profile) {
        setProfileForm({
          nameRu: json.profile.nameRu || '',
          nameEn: json.profile.nameEn || '',
          roleRu: json.profile.roleRu || '',
          roleEn: json.profile.roleEn || '',
          positioningStatementRu: json.profile.positioningStatementRu || '',
          positioningStatementEn: json.profile.positioningStatementEn || '',
          bioRu: json.profile.bioRu || '',
          bioEn: json.profile.bioEn || '',
          philosophyRu: json.profile.philosophyRu || '',
          philosophyEn: json.profile.philosophyEn || '',
          currentFocusRu: json.profile.currentFocusRu || '',
          currentFocusEn: json.profile.currentFocusEn || '',
          interestsRu: json.profile.interestsRu || '',
          interestsEn: json.profile.interestsEn || '',
        })
      }
    } catch (error) {
      console.error("Failed to fetch data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (status === "authenticated") {
      fetchData()
    }
  }, [adminLang])

  const handleSaveProfile = async () => {
    setSavingProfile(true)
    setProfileSaved(false)
    try {
      const res = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileForm),
      })
      if (res.ok) {
        setProfileSaved(true)
        fetchData()
      }
    } catch (error) {
      console.error('Failed to save profile:', error)
    } finally {
      setSavingProfile(false)
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-foreground-muted">Loading...</div>
      </div>
    )
  }

  const tabs = [
    { id: "profile", label: "Profile" },
    { id: "education", label: "Education" },
    { id: "languages", label: "Languages" },
    { id: "experiences", label: "Experience" },
    { id: "projects", label: "Projects" },
    { id: "skills", label: "Skills" },
    { id: "achievements", label: "Achievements" },
    { id: "social", label: "Social Links" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background-secondary">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-foreground-muted">{session?.user?.email}</span>
            <a href="/" className="text-sm text-foreground-muted hover:text-foreground">
              View Site
            </a>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          <nav className="w-48 shrink-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`block w-full text-left px-4 py-2 rounded-lg mb-1 ${
                  activeTab === tab.id
                    ? "bg-accent/10 text-accent"
                    : "text-foreground-muted hover:bg-background-secondary"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          <main className="flex-1">
            {activeTab === "profile" && data?.profile && (
              <ProfileTab 
                profile={data.profile} 
                adminLang={adminLang}
                onUpdate={fetchData} 
              />
            )}

            {activeTab === "education" && (
              <EducationTab education={data?.education || []} onUpdate={fetchData} />
            )}

            {activeTab === "languages" && (
              <LanguagesTab languages={data?.languages || []} onUpdate={fetchData} />
            )}

            {activeTab === "experiences" && (
              <ExperiencesTab experiences={data?.experiences || []} onUpdate={fetchData} />
            )}

            {activeTab === "projects" && (
              <ProjectsTab projects={data?.projects || []} onUpdate={fetchData} />
            )}

            {activeTab === "skills" && (
              <SkillsTab skills={data?.skills || []} onUpdate={fetchData} />
            )}

            {activeTab === "achievements" && (
              <AchievementsTab achievements={data?.achievements || []} onUpdate={fetchData} />
            )}

            {activeTab === "social" && (
              <SocialLinksTab 
                links={data?.socialLinks || []} 
                onUpdate={() => fetchData()} 
              />
            )}
          </main>
        </div>
      </div>
    </div>
  )
}