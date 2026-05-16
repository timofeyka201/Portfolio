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
  const [savingProfile, setSavingProfile] = useState(false)
  const [profileSaved, setProfileSaved] = useState(false)
  const [profileForm, setProfileForm] = useState({
    nameRu: '',
    nameEn: '',
    roleRu: '',
    roleEn: '',
    positioningStatementRu: '',
    positioningStatementEn: '',
    bioRu: '',
    bioEn: '',
    philosophyRu: '',
    philosophyEn: '',
    currentFocusRu: '',
    currentFocusEn: '',
    interestsRu: '',
    interestsEn: '',
  })

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
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Profile Settings</h2>
                  <LanguageToggle lang={adminLang} onChange={setAdminLang} />
                </div>
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-foreground-muted mb-1">Name (RU)</label>
                      <input
                        type="text"
                        value={profileForm.nameRu}
                        onChange={(e) => { setProfileForm({ ...profileForm, nameRu: e.target.value }); setProfileSaved(false) }}
                        className="w-full px-4 py-2 bg-background-secondary border border-border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-foreground-muted mb-1">Name (EN)</label>
                      <input
                        type="text"
                        value={profileForm.nameEn}
                        onChange={(e) => { setProfileForm({ ...profileForm, nameEn: e.target.value }); setProfileSaved(false) }}
                        className="w-full px-4 py-2 bg-background-secondary border border-border rounded-lg"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-foreground-muted mb-1">Role (RU)</label>
                      <input
                        type="text"
                        value={profileForm.roleRu}
                        onChange={(e) => { setProfileForm({ ...profileForm, roleRu: e.target.value }); setProfileSaved(false) }}
                        className="w-full px-4 py-2 bg-background-secondary border border-border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-foreground-muted mb-1">Role (EN)</label>
                      <input
                        type="text"
                        value={profileForm.roleEn}
                        onChange={(e) => { setProfileForm({ ...profileForm, roleEn: e.target.value }); setProfileSaved(false) }}
                        className="w-full px-4 py-2 bg-background-secondary border border-border rounded-lg"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-foreground-muted mb-1">Positioning Statement (RU)</label>
                      <textarea
                        value={profileForm.positioningStatementRu}
                        onChange={(e) => { setProfileForm({ ...profileForm, positioningStatementRu: e.target.value }); setProfileSaved(false) }}
                        rows={3}
                        className="w-full px-4 py-2 bg-background-secondary border border-border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-foreground-muted mb-1">Positioning Statement (EN)</label>
                      <textarea
                        value={profileForm.positioningStatementEn}
                        onChange={(e) => { setProfileForm({ ...profileForm, positioningStatementEn: e.target.value }); setProfileSaved(false) }}
                        rows={3}
                        className="w-full px-4 py-2 bg-background-secondary border border-border rounded-lg"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-foreground-muted mb-1">Bio (RU)</label>
                      <textarea
                        value={profileForm.bioRu}
                        onChange={(e) => { setProfileForm({ ...profileForm, bioRu: e.target.value }); setProfileSaved(false) }}
                        rows={5}
                        className="w-full px-4 py-2 bg-background-secondary border border-border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-foreground-muted mb-1">Bio (EN)</label>
                      <textarea
                        value={profileForm.bioEn}
                        onChange={(e) => { setProfileForm({ ...profileForm, bioEn: e.target.value }); setProfileSaved(false) }}
                        rows={5}
                        className="w-full px-4 py-2 bg-background-secondary border border-border rounded-lg"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-foreground-muted mb-1">Current Focus (RU)</label>
                      <textarea
                        value={profileForm.currentFocusRu}
                        onChange={(e) => { setProfileForm({ ...profileForm, currentFocusRu: e.target.value }); setProfileSaved(false) }}
                        rows={3}
                        className="w-full px-4 py-2 bg-background-secondary border border-border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-foreground-muted mb-1">Current Focus (EN)</label>
                      <textarea
                        value={profileForm.currentFocusEn}
                        onChange={(e) => { setProfileForm({ ...profileForm, currentFocusEn: e.target.value }); setProfileSaved(false) }}
                        rows={3}
                        className="w-full px-4 py-2 bg-background-secondary border border-border rounded-lg"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-foreground-muted mb-1">Philosophy (RU)</label>
                      <textarea
                        value={profileForm.philosophyRu}
                        onChange={(e) => { setProfileForm({ ...profileForm, philosophyRu: e.target.value }); setProfileSaved(false) }}
                        rows={3}
                        className="w-full px-4 py-2 bg-background-secondary border border-border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-foreground-muted mb-1">Philosophy (EN)</label>
                      <textarea
                        value={profileForm.philosophyEn}
                        onChange={(e) => { setProfileForm({ ...profileForm, philosophyEn: e.target.value }); setProfileSaved(false) }}
                        rows={3}
                        className="w-full px-4 py-2 bg-background-secondary border border-border rounded-lg"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-foreground-muted mb-1">Interests (RU)</label>
                      <textarea
                        value={profileForm.interestsRu}
                        onChange={(e) => { setProfileForm({ ...profileForm, interestsRu: e.target.value }); setProfileSaved(false) }}
                        rows={3}
                        className="w-full px-4 py-2 bg-background-secondary border border-border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-foreground-muted mb-1">Interests (EN)</label>
                      <textarea
                        value={profileForm.interestsEn}
                        onChange={(e) => { setProfileForm({ ...profileForm, interestsEn: e.target.value }); setProfileSaved(false) }}
                        rows={3}
                        className="w-full px-4 py-2 bg-background-secondary border border-border rounded-lg"
                      />
                    </div>
                  </div>
                </div>
                <button 
                  onClick={handleSaveProfile}
                  disabled={savingProfile}
                  className="px-4 py-2 bg-accent text-white rounded-lg font-medium hover:bg-accent/90 disabled:opacity-50"
                >
                  {savingProfile ? 'Saving...' : profileSaved ? 'Saved!' : 'Save Changes'}
                </button>
              </div>
            )}

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