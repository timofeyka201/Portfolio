"use client"

import { useState } from "react"
import { LanguageToggle } from "./language-toggle"

interface Experience {
  id: string
  companyRu: string
  companyEn: string
  roleRu: string
  roleEn: string
  locationRu: string
  locationEn: string
  descriptionRu: string
  descriptionEn: string
  startDate: string
  endDate: string | null
  isCurrent: boolean
  highlightsRu: string[]
  highlightsEn: string[]
  isVisible: boolean
  order: number
}

interface ExperiencesTabProps {
  experiences: Experience[]
  onUpdate: () => void
}

export function ExperiencesTab({ experiences, onUpdate }: ExperiencesTabProps) {
  const [lang, setLang] = useState<"ru" | "en">("ru")
  const [showAddForm, setShowAddForm] = useState(false)
  const [newExperience, setNewExperience] = useState({
    companyRu: '',
    companyEn: '',
    roleRu: '',
    roleEn: '',
    descriptionRu: '',
    descriptionEn: '',
    startDate: '',
    isCurrent: false,
  })
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Experience | null>(null)

  const handleAddExperience = async () => {
    if (!newExperience.companyRu && !newExperience.companyEn) return
    
    setSaving(true)
    try {
      const res = await fetch('/api/admin/experiences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newExperience),
      })
      
      if (res.ok) {
        setNewExperience({ companyRu: '', companyEn: '', roleRu: '', roleEn: '', descriptionRu: '', descriptionEn: '', startDate: '', isCurrent: false })
        setShowAddForm(false)
        onUpdate()
      }
    } catch (error) {
      console.error('Failed to add experience:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteExperience = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/experiences?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        onUpdate()
      }
    } catch (error) {
      console.error('Failed to delete experience:', error)
    }
  }

  const handleEditClick = (exp: Experience) => {
    setEditingId(exp.id)
    setEditForm({ ...exp, startDate: exp.startDate.split('T')[0] })
  }

  const handleSaveEdit = async () => {
    if (!editForm) return
    
    setSaving(true)
    try {
      const res = await fetch('/api/admin/experiences', {
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
      console.error('Failed to update experience:', error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Experiences</h2>
        <div className="flex items-center gap-4">
          <LanguageToggle lang={lang} onChange={setLang} />
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 bg-accent text-white rounded-lg font-medium hover:bg-accent/90"
          >
            {showAddForm ? 'Cancel' : 'Add Experience'}
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="p-4 bg-background-secondary border border-border rounded-lg space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-foreground-muted mb-1">Company (RU)</label>
              <input
                type="text"
                value={newExperience.companyRu}
                onChange={(e) => setNewExperience({ ...newExperience, companyRu: e.target.value })}
                placeholder="Название компании"
                className="w-full px-3 py-2 bg-background border border-border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm text-foreground-muted mb-1">Company (EN)</label>
              <input
                type="text"
                value={newExperience.companyEn}
                onChange={(e) => setNewExperience({ ...newExperience, companyEn: e.target.value })}
                placeholder="Company name"
                className="w-full px-3 py-2 bg-background border border-border rounded-lg"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-foreground-muted mb-1">Role (RU)</label>
              <input
                type="text"
                value={newExperience.roleRu}
                onChange={(e) => setNewExperience({ ...newExperience, roleRu: e.target.value })}
                placeholder="Должность"
                className="w-full px-3 py-2 bg-background border border-border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm text-foreground-muted mb-1">Role (EN)</label>
              <input
                type="text"
                value={newExperience.roleEn}
                onChange={(e) => setNewExperience({ ...newExperience, roleEn: e.target.value })}
                placeholder="Role"
                className="w-full px-3 py-2 bg-background border border-border rounded-lg"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-foreground-muted mb-1">Description (RU)</label>
              <textarea
                value={newExperience.descriptionRu}
                onChange={(e) => setNewExperience({ ...newExperience, descriptionRu: e.target.value })}
                placeholder="Описание"
                rows={3}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm text-foreground-muted mb-1">Description (EN)</label>
              <textarea
                value={newExperience.descriptionEn}
                onChange={(e) => setNewExperience({ ...newExperience, descriptionEn: e.target.value })}
                placeholder="Description"
                rows={3}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg"
              />
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <input
              type="date"
              value={newExperience.startDate}
              onChange={(e) => setNewExperience({ ...newExperience, startDate: e.target.value })}
              className="px-3 py-2 bg-background border border-border rounded-lg"
            />
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={newExperience.isCurrent}
                onChange={(e) => setNewExperience({ ...newExperience, isCurrent: e.target.checked })}
                className="rounded border-border"
              />
              Current
            </label>
            <button
              onClick={handleAddExperience}
              disabled={saving}
              className="px-4 py-2 bg-accent text-white rounded-lg font-medium hover:bg-accent/90 disabled:opacity-50"
            >
              {saving ? 'Adding...' : 'Add'}
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {experiences.map((exp) => (
          <div key={exp.id} className="p-4 bg-background-secondary border border-border rounded-lg">
            {editingId === exp.id && editForm ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={editForm.companyRu || ''}
                    onChange={(e) => setEditForm({ ...editForm, companyRu: e.target.value })}
                    placeholder="Company (RU)"
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg"
                  />
                  <input
                    type="text"
                    value={editForm.companyEn || ''}
                    onChange={(e) => setEditForm({ ...editForm, companyEn: e.target.value })}
                    placeholder="Company (EN)"
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={editForm.roleRu || ''}
                    onChange={(e) => setEditForm({ ...editForm, roleRu: e.target.value })}
                    placeholder="Role (RU)"
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg"
                  />
                  <input
                    type="text"
                    value={editForm.roleEn || ''}
                    onChange={(e) => setEditForm({ ...editForm, roleEn: e.target.value })}
                    placeholder="Role (EN)"
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <textarea
                    value={editForm.descriptionRu || ''}
                    onChange={(e) => setEditForm({ ...editForm, descriptionRu: e.target.value })}
                    rows={2}
                    placeholder="Description (RU)"
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm"
                  />
                  <textarea
                    value={editForm.descriptionEn || ''}
                    onChange={(e) => setEditForm({ ...editForm, descriptionEn: e.target.value })}
                    rows={2}
                    placeholder="Description (EN)"
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm"
                  />
                </div>
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
                  <h3 className="font-medium">{lang === 'ru' ? (exp.roleRu || exp.roleEn) : (exp.roleEn || exp.roleRu)}</h3>
                  <p className="text-sm text-foreground-muted">{lang === 'ru' ? (exp.companyRu || exp.companyEn) : (exp.companyEn || exp.companyRu)}</p>
                  <p className="text-xs text-foreground-muted mt-1">
                    {new Date(exp.startDate).getFullYear()} - {exp.isCurrent ? 'Present' : exp.endDate ? new Date(exp.endDate).getFullYear() : ''}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditClick(exp)}
                    className="text-xs px-2 py-1 border border-border rounded hover:bg-background"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteExperience(exp.id)}
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