"use client"

import { useState } from "react"
import { LanguageToggle } from "./language-toggle"

interface Education {
  id: string
  institutionRu: string
  institutionEn: string
  degreeRu: string
  degreeEn: string
  fieldRu: string
  fieldEn: string
  startDate: string
  endDate: string | null
  isCurrent: boolean
  order: number
  isVisible: boolean
}

interface EducationTabProps {
  education: Education[]
  onUpdate: () => void
}

export function EducationTab({ education, onUpdate }: EducationTabProps) {
  const [lang, setLang] = useState<"ru" | "en">("ru")
  const [showAddForm, setShowAddForm] = useState(false)
  const [newEducation, setNewEducation] = useState({
    institutionRu: '',
    institutionEn: '',
    degreeRu: '',
    degreeEn: '',
    fieldRu: '',
    fieldEn: '',
    startDate: '',
    isCurrent: false,
  })
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Education | null>(null)

  const handleAddEducation = async () => {
    if (!newEducation.institutionRu && !newEducation.institutionEn) return
    
    setSaving(true)
    try {
      const res = await fetch('/api/admin/education', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEducation),
      })
      
      if (res.ok) {
        setNewEducation({ institutionRu: '', institutionEn: '', degreeRu: '', degreeEn: '', fieldRu: '', fieldEn: '', startDate: '', isCurrent: false })
        setShowAddForm(false)
        onUpdate()
      }
    } catch (error) {
      console.error('Failed to add education:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteEducation = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/education?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        onUpdate()
      }
    } catch (error) {
      console.error('Failed to delete education:', error)
    }
  }

  const handleEditClick = (edu: Education) => {
    setEditingId(edu.id)
    setEditForm({ ...edu, startDate: edu.startDate.split('T')[0] })
  }

  const handleSaveEdit = async () => {
    if (!editForm) return
    
    setSaving(true)
    try {
      const res = await fetch('/api/admin/education', {
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
      console.error('Failed to update education:', error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Education</h2>
        <div className="flex items-center gap-4">
          <LanguageToggle lang={lang} onChange={setLang} />
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 bg-accent text-white rounded-lg font-medium hover:bg-accent/90"
          >
            {showAddForm ? 'Cancel' : 'Add Education'}
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="p-4 bg-background-secondary border border-border rounded-lg space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-foreground-muted mb-1">Institution (RU)</label>
              <input
                type="text"
                value={newEducation.institutionRu}
                onChange={(e) => setNewEducation({ ...newEducation, institutionRu: e.target.value })}
                placeholder="Название вуза"
                className="w-full px-3 py-2 bg-background border border-border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm text-foreground-muted mb-1">Institution (EN)</label>
              <input
                type="text"
                value={newEducation.institutionEn}
                onChange={(e) => setNewEducation({ ...newEducation, institutionEn: e.target.value })}
                placeholder="Institution name"
                className="w-full px-3 py-2 bg-background border border-border rounded-lg"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-foreground-muted mb-1">Degree (RU)</label>
              <input
                type="text"
                value={newEducation.degreeRu}
                onChange={(e) => setNewEducation({ ...newEducation, degreeRu: e.target.value })}
                placeholder="Степень"
                className="w-full px-3 py-2 bg-background border border-border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm text-foreground-muted mb-1">Degree (EN)</label>
              <input
                type="text"
                value={newEducation.degreeEn}
                onChange={(e) => setNewEducation({ ...newEducation, degreeEn: e.target.value })}
                placeholder="Degree"
                className="w-full px-3 py-2 bg-background border border-border rounded-lg"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-foreground-muted mb-1">Field (RU)</label>
              <input
                type="text"
                value={newEducation.fieldRu}
                onChange={(e) => setNewEducation({ ...newEducation, fieldRu: e.target.value })}
                placeholder="Специальность"
                className="w-full px-3 py-2 bg-background border border-border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm text-foreground-muted mb-1">Field (EN)</label>
              <input
                type="text"
                value={newEducation.fieldEn}
                onChange={(e) => setNewEducation({ ...newEducation, fieldEn: e.target.value })}
                placeholder="Field"
                className="w-full px-3 py-2 bg-background border border-border rounded-lg"
              />
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <input
              type="date"
              value={newEducation.startDate}
              onChange={(e) => setNewEducation({ ...newEducation, startDate: e.target.value })}
              className="px-3 py-2 bg-background border border-border rounded-lg"
            />
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={newEducation.isCurrent}
                onChange={(e) => setNewEducation({ ...newEducation, isCurrent: e.target.checked })}
                className="rounded border-border"
              />
              Current
            </label>
            <button
              onClick={handleAddEducation}
              disabled={saving}
              className="px-4 py-2 bg-accent text-white rounded-lg font-medium hover:bg-accent/90 disabled:opacity-50"
            >
              {saving ? 'Adding...' : 'Add'}
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {education.map((edu) => (
          <div key={edu.id} className="p-4 bg-background-secondary border border-border rounded-lg">
            {editingId === edu.id && editForm ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={editForm.institutionRu || ''}
                    onChange={(e) => setEditForm({ ...editForm, institutionRu: e.target.value })}
                    placeholder="Institution (RU)"
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg"
                  />
                  <input
                    type="text"
                    value={editForm.institutionEn || ''}
                    onChange={(e) => setEditForm({ ...editForm, institutionEn: e.target.value })}
                    placeholder="Institution (EN)"
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={editForm.degreeRu || ''}
                    onChange={(e) => setEditForm({ ...editForm, degreeRu: e.target.value })}
                    placeholder="Degree (RU)"
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg"
                  />
                  <input
                    type="text"
                    value={editForm.degreeEn || ''}
                    onChange={(e) => setEditForm({ ...editForm, degreeEn: e.target.value })}
                    placeholder="Degree (EN)"
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg"
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
                  <h3 className="font-medium">{lang === 'ru' ? (edu.institutionRu || edu.institutionEn) : (edu.institutionEn || edu.institutionRu)}</h3>
                  <p className="text-sm text-foreground-muted">
                    {lang === 'ru' ? (edu.degreeRu || edu.degreeEn) : (edu.degreeEn || edu.degreeRu)} 
                    {' in '}
                    {lang === 'ru' ? (edu.fieldRu || edu.fieldEn) : (edu.fieldEn || edu.fieldRu)}
                  </p>
                  <p className="text-xs text-foreground-muted mt-1">
                    {new Date(edu.startDate).getFullYear()} - {edu.isCurrent ? 'Present' : edu.endDate ? new Date(edu.endDate).getFullYear() : ''}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditClick(edu)}
                    className="text-xs px-2 py-1 border border-border rounded hover:bg-background"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteEducation(edu.id)}
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