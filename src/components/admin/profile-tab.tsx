"use client"

import { useState } from "react"
import { LanguageToggle } from "./language-toggle"

interface ProfileTabProps {
  profile: any
  adminLang: "ru" | "en"
  onUpdate: () => void
}

export function ProfileTab({ profile, adminLang, onUpdate }: ProfileTabProps) {
  const [lang, setLang] = useState<"ru" | "en">(adminLang)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    nameRu: profile?.nameRu || '',
    nameEn: profile?.nameEn || '',
    roleRu: profile?.roleRu || '',
    roleEn: profile?.roleEn || '',
    positioningStatementRu: profile?.positioningStatementRu || '',
    positioningStatementEn: profile?.positioningStatementEn || '',
    bioRu: profile?.bioRu || '',
    bioEn: profile?.bioEn || '',
    philosophyRu: profile?.philosophyRu || '',
    philosophyEn: profile?.philosophyEn || '',
    currentFocusRu: profile?.currentFocusRu || '',
    currentFocusEn: profile?.currentFocusEn || '',
    interestsRu: profile?.interestsRu || '',
    interestsEn: profile?.interestsEn || '',
  })

  const handleSave = async () => {
    setSaving(true)
    setSaved(false)
    try {
      const res = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setSaved(true)
        onUpdate()
      }
    } catch (error) {
      console.error('Failed to save profile:', error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Profile Settings</h2>
        <LanguageToggle lang={lang} onChange={setLang} />
      </div>
      
      <div className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-foreground-muted mb-1">Name (RU)</label>
            <input
              type="text"
              value={form.nameRu}
              onChange={(e) => { setForm({ ...form, nameRu: e.target.value }); setSaved(false) }}
              className="w-full px-4 py-2 bg-background-secondary border border-border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm text-foreground-muted mb-1">Name (EN)</label>
            <input
              type="text"
              value={form.nameEn}
              onChange={(e) => { setForm({ ...form, nameEn: e.target.value }); setSaved(false) }}
              className="w-full px-4 py-2 bg-background-secondary border border-border rounded-lg"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-foreground-muted mb-1">Role (RU)</label>
            <input
              type="text"
              value={form.roleRu}
              onChange={(e) => { setForm({ ...form, roleRu: e.target.value }); setSaved(false) }}
              className="w-full px-4 py-2 bg-background-secondary border border-border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm text-foreground-muted mb-1">Role (EN)</label>
            <input
              type="text"
              value={form.roleEn}
              onChange={(e) => { setForm({ ...form, roleEn: e.target.value }); setSaved(false) }}
              className="w-full px-4 py-2 bg-background-secondary border border-border rounded-lg"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-foreground-muted mb-1">Positioning Statement (RU)</label>
            <textarea
              value={form.positioningStatementRu}
              onChange={(e) => { setForm({ ...form, positioningStatementRu: e.target.value }); setSaved(false) }}
              rows={3}
              className="w-full px-4 py-2 bg-background-secondary border border-border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm text-foreground-muted mb-1">Positioning Statement (EN)</label>
            <textarea
              value={form.positioningStatementEn}
              onChange={(e) => { setForm({ ...form, positioningStatementEn: e.target.value }); setSaved(false) }}
              rows={3}
              className="w-full px-4 py-2 bg-background-secondary border border-border rounded-lg"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-foreground-muted mb-1">Bio (RU)</label>
            <textarea
              value={form.bioRu}
              onChange={(e) => { setForm({ ...form, bioRu: e.target.value }); setSaved(false) }}
              rows={5}
              className="w-full px-4 py-2 bg-background-secondary border border-border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm text-foreground-muted mb-1">Bio (EN)</label>
            <textarea
              value={form.bioEn}
              onChange={(e) => { setForm({ ...form, bioEn: e.target.value }); setSaved(false) }}
              rows={5}
              className="w-full px-4 py-2 bg-background-secondary border border-border rounded-lg"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-foreground-muted mb-1">Philosophy (RU)</label>
            <textarea
              value={form.philosophyRu}
              onChange={(e) => { setForm({ ...form, philosophyRu: e.target.value }); setSaved(false) }}
              rows={3}
              className="w-full px-4 py-2 bg-background-secondary border border-border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm text-foreground-muted mb-1">Philosophy (EN)</label>
            <textarea
              value={form.philosophyEn}
              onChange={(e) => { setForm({ ...form, philosophyEn: e.target.value }); setSaved(false) }}
              rows={3}
              className="w-full px-4 py-2 bg-background-secondary border border-border rounded-lg"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-foreground-muted mb-1">Current Focus (RU)</label>
            <textarea
              value={form.currentFocusRu}
              onChange={(e) => { setForm({ ...form, currentFocusRu: e.target.value }); setSaved(false) }}
              rows={3}
              className="w-full px-4 py-2 bg-background-secondary border border-border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm text-foreground-muted mb-1">Current Focus (EN)</label>
            <textarea
              value={form.currentFocusEn}
              onChange={(e) => { setForm({ ...form, currentFocusEn: e.target.value }); setSaved(false) }}
              rows={3}
              className="w-full px-4 py-2 bg-background-secondary border border-border rounded-lg"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-foreground-muted mb-1">Interests (RU)</label>
            <textarea
              value={form.interestsRu}
              onChange={(e) => { setForm({ ...form, interestsRu: e.target.value }); setSaved(false) }}
              rows={3}
              className="w-full px-4 py-2 bg-background-secondary border border-border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm text-foreground-muted mb-1">Interests (EN)</label>
            <textarea
              value={form.interestsEn}
              onChange={(e) => { setForm({ ...form, interestsEn: e.target.value }); setSaved(false) }}
              rows={3}
              className="w-full px-4 py-2 bg-background-secondary border border-border rounded-lg"
            />
          </div>
        </div>
      </div>
      
      <button 
        onClick={handleSave}
        disabled={saving}
        className="px-4 py-2 bg-accent text-white rounded-lg font-medium hover:bg-accent/90 disabled:opacity-50"
      >
        {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
      </button>
    </div>
  )
}