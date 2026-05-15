"use client"

import { useState } from "react"
import { LanguageToggle } from "./language-toggle"

interface SocialLink {
  id: string
  platform: string
  url: string
  labelRu: string
  labelEn: string
  isVisible: boolean
  order: number
}

interface SocialLinksTabProps {
  links: SocialLink[]
  onUpdate: () => void
}

export function SocialLinksTab({ links, onUpdate }: SocialLinksTabProps) {
  const [lang, setLang] = useState<"ru" | "en">("ru")
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(links)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleChange = (id: string, field: string, value: string | boolean) => {
    setSocialLinks(socialLinks.map(link => 
      link.id === id ? { ...link, [field]: value } : link
    ))
    setSaved(false)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/social', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(socialLinks),
      })
      if (res.ok) {
        setSaved(true)
        onUpdate()
      }
    } catch (error) {
      console.error('Failed to save:', error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Social Links</h2>
        <div className="flex items-center gap-4">
          <LanguageToggle lang={lang} onChange={setLang} />
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-accent text-white rounded-lg font-medium hover:bg-accent/90 disabled:opacity-50"
          >
            {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {socialLinks.map((link) => (
          <div key={link.id} className="p-4 bg-background-secondary border border-border rounded-lg">
            <div className="flex items-center gap-4 mb-3">
              <span className="font-medium capitalize w-24">{link.platform}</span>
              <div className="flex-1 grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={link.labelRu || ''}
                  onChange={(e) => handleChange(link.id, 'labelRu', e.target.value)}
                  className="px-3 py-2 bg-background border border-border rounded-lg text-sm"
                  placeholder="Label (RU)"
                />
                <input
                  type="text"
                  value={link.labelEn || ''}
                  onChange={(e) => handleChange(link.id, 'labelEn', e.target.value)}
                  className="px-3 py-2 bg-background border border-border rounded-lg text-sm"
                  placeholder="Label (EN)"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-foreground-muted w-24">URL</span>
              <input
                type="text"
                value={link.url}
                onChange={(e) => handleChange(link.id, 'url', e.target.value)}
                className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-sm"
                placeholder="https://..."
              />
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={link.isVisible}
                  onChange={(e) => handleChange(link.id, 'isVisible', e.target.checked)}
                  className="rounded border-border"
                />
                Show
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}