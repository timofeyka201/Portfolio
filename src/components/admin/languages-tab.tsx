"use client"

import { useState } from "react"
import { LanguageToggle } from "./language-toggle"

interface Language {
  id: string
  nameRu: string
  nameEn: string
  proficiency: string
  order: number
  isVisible: boolean
}

interface LanguagesTabProps {
  languages: Language[]
  onUpdate: () => void
}

export function LanguagesTab({ languages, onUpdate }: LanguagesTabProps) {
  const [lang, setLang] = useState<"ru" | "en">("ru")
  const [showAddForm, setShowAddForm] = useState(false)
  const [newLanguage, setNewLanguage] = useState({
    nameRu: '',
    nameEn: '',
    proficiency: '',
  })
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Language | null>(null)

  const handleAddLanguage = async () => {
    if (!newLanguage.nameRu && !newLanguage.nameEn) return
    
    setSaving(true)
    try {
      const res = await fetch('/api/admin/languages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLanguage),
      })
      
      if (res.ok) {
        setNewLanguage({ nameRu: '', nameEn: '', proficiency: '' })
        setShowAddForm(false)
        onUpdate()
      }
    } catch (error) {
      console.error('Failed to add language:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteLanguage = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/languages?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        onUpdate()
      }
    } catch (error) {
      console.error('Failed to delete language:', error)
    }
  }

  const handleEditClick = (langItem: Language) => {
    setEditingId(langItem.id)
    setEditForm({ ...langItem })
  }

  const handleSaveEdit = async () => {
    if (!editForm) return
    
    setSaving(true)
    try {
      const res = await fetch('/api/admin/languages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify([editForm]),
      })
      
      if (res.ok) {
        setEditingId(null)
        setEditForm(null)
        onUpdate()
      }
    } catch (error) {
      console.error('Failed to update language:', error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Languages</h2>
        <div className="flex items-center gap-4">
          <LanguageToggle lang={lang} onChange={setLang} />
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 bg-accent text-white rounded-lg font-medium hover:bg-accent/90"
          >
            {showAddForm ? 'Cancel' : 'Add Language'}
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="p-4 bg-background-secondary border border-border rounded-lg space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-foreground-muted mb-1">Name (RU)</label>
              <input
                type="text"
                value={newLanguage.nameRu}
                onChange={(e) => setNewLanguage({ ...newLanguage, nameRu: e.target.value })}
                placeholder="Название языка"
                className="w-full px-3 py-2 bg-background border border-border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm text-foreground-muted mb-1">Name (EN)</label>
              <input
                type="text"
                value={newLanguage.nameEn}
                onChange={(e) => setNewLanguage({ ...newLanguage, nameEn: e.target.value })}
                placeholder="Language name"
                className="w-full px-3 py-2 bg-background border border-border rounded-lg"
              />
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <label className="block text-sm text-foreground-muted mb-1">Proficiency</label>
              <input
                type="text"
                value={newLanguage.proficiency}
                onChange={(e) => setNewLanguage({ ...newLanguage, proficiency: e.target.value })}
                placeholder="Native, B2, C1, etc."
                className="w-full px-3 py-2 bg-background border border-border rounded-lg"
              />
            </div>
            <button
              onClick={handleAddLanguage}
              disabled={saving}
              className="px-4 py-2 bg-accent text-white rounded-lg font-medium hover:bg-accent/90 disabled:opacity-50 mt-5"
            >
              {saving ? 'Adding...' : 'Add'}
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {languages.map((langItem) => (
          <div key={langItem.id} className="p-4 bg-background-secondary border border-border rounded-lg">
            {editingId === langItem.id && editForm ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={editForm.nameRu || ''}
                    onChange={(e) => setEditForm({ ...editForm, nameRu: e.target.value })}
                    placeholder="Name (RU)"
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg"
                  />
                  <input
                    type="text"
                    value={editForm.nameEn || ''}
                    onChange={(e) => setEditForm({ ...editForm, nameEn: e.target.value })}
                    placeholder="Name (EN)"
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg"
                  />
                </div>
                <input
                  type="text"
                  value={editForm.proficiency || ''}
                  onChange={(e) => setEditForm({ ...editForm, proficiency: e.target.value })}
                  placeholder="Proficiency"
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveEdit}
                    disabled={saving}
                    className="px-3 py-1 bg-accent text-white rounded-lg text-sm"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => { setEditingId(null); setEditForm(null) }}
                    className="px-3 py-1 border border-border rounded-lg text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{lang === 'ru' ? (langItem.nameRu || langItem.nameEn) : (langItem.nameEn || langItem.nameRu)}</h3>
                  <p className="text-sm text-foreground-muted">{langItem.proficiency}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditClick(langItem)}
                    className="text-xs px-2 py-1 border border-border rounded hover:bg-background"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteLanguage(langItem.id)}
                    className="text-xs px-2 py-1 border border-border rounded hover:bg-background text-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}