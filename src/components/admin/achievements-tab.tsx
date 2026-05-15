"use client"

import { useState } from "react"
import { LanguageToggle } from "./language-toggle"

interface Achievement {
  id: string
  titleRu: string
  titleEn: string
  descriptionRu: string
  descriptionEn: string
  date: string
  type: string
  url: string | null
  isVisible: boolean
  order: number
}

interface AchievementsTabProps {
  achievements: Achievement[]
  onUpdate: () => void
}

const achievementTypes = ['Competition', 'Accelerator', 'Hackathon', 'Certification', 'Education']

export function AchievementsTab({ achievements, onUpdate }: AchievementsTabProps) {
  const [lang, setLang] = useState<"ru" | "en">("ru")
  const [showAddForm, setShowAddForm] = useState(false)
  const [newAchievement, setNewAchievement] = useState({
    titleRu: '',
    titleEn: '',
    descriptionRu: '',
    descriptionEn: '',
    date: '',
    type: 'Achievement',
  })
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Achievement | null>(null)

  const handleAddAchievement = async () => {
    if (!newAchievement.titleRu && !newAchievement.titleEn) return
    
    setSaving(true)
    try {
      const res = await fetch('/api/admin/achievements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAchievement),
      })
      
      if (res.ok) {
        setNewAchievement({ titleRu: '', titleEn: '', descriptionRu: '', descriptionEn: '', date: '', type: 'Achievement' })
        setShowAddForm(false)
        onUpdate()
      }
    } catch (error) {
      console.error('Failed to add achievement:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteAchievement = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/achievements?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        onUpdate()
      }
    } catch (error) {
      console.error('Failed to delete achievement:', error)
    }
  }

  const handleEditClick = (ach: Achievement) => {
    setEditingId(ach.id)
    setEditForm({ ...ach, date: ach.date.split('T')[0] })
  }

  const handleSaveEdit = async () => {
    if (!editForm) return
    
    setSaving(true)
    try {
      const res = await fetch('/api/admin/achievements', {
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
      console.error('Failed to update achievement:', error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Achievements</h2>
        <div className="flex items-center gap-4">
          <LanguageToggle lang={lang} onChange={setLang} />
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 bg-accent text-white rounded-lg font-medium hover:bg-accent/90"
          >
            {showAddForm ? 'Cancel' : 'Add Achievement'}
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="p-4 bg-background-secondary border border-border rounded-lg space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-foreground-muted mb-1">Title (RU)</label>
              <input
                type="text"
                value={newAchievement.titleRu}
                onChange={(e) => setNewAchievement({ ...newAchievement, titleRu: e.target.value })}
                placeholder="Название"
                className="w-full px-3 py-2 bg-background border border-border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm text-foreground-muted mb-1">Title (EN)</label>
              <input
                type="text"
                value={newAchievement.titleEn}
                onChange={(e) => setNewAchievement({ ...newAchievement, titleEn: e.target.value })}
                placeholder="Title"
                className="w-full px-3 py-2 bg-background border border-border rounded-lg"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-foreground-muted mb-1">Description (RU)</label>
              <textarea
                value={newAchievement.descriptionRu}
                onChange={(e) => setNewAchievement({ ...newAchievement, descriptionRu: e.target.value })}
                placeholder="Описание"
                rows={2}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm text-foreground-muted mb-1">Description (EN)</label>
              <textarea
                value={newAchievement.descriptionEn}
                onChange={(e) => setNewAchievement({ ...newAchievement, descriptionEn: e.target.value })}
                placeholder="Description"
                rows={2}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg"
              />
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <input
              type="date"
              value={newAchievement.date}
              onChange={(e) => setNewAchievement({ ...newAchievement, date: e.target.value })}
              className="px-3 py-2 bg-background border border-border rounded-lg"
            />
            <select
              value={newAchievement.type}
              onChange={(e) => setNewAchievement({ ...newAchievement, type: e.target.value })}
              className="px-3 py-2 bg-background border border-border rounded-lg"
            >
              {achievementTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <button
              onClick={handleAddAchievement}
              disabled={saving}
              className="px-4 py-2 bg-accent text-white rounded-lg font-medium hover:bg-accent/90 disabled:opacity-50"
            >
              {saving ? 'Adding...' : 'Add'}
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {achievements.map((achievement) => (
          <div key={achievement.id} className="p-4 bg-background-secondary border border-border rounded-lg">
            {editingId === achievement.id && editForm ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={editForm.titleRu || ''}
                    onChange={(e) => setEditForm({ ...editForm, titleRu: e.target.value })}
                    placeholder="Title (RU)"
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg"
                  />
                  <input
                    type="text"
                    value={editForm.titleEn || ''}
                    onChange={(e) => setEditForm({ ...editForm, titleEn: e.target.value })}
                    placeholder="Title (EN)"
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
                  <select
                    value={editForm.type}
                    onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                    className="px-2 py-1 bg-background border border-border rounded-lg text-sm"
                  >
                    {achievementTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
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
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{lang === 'ru' ? (achievement.titleRu || achievement.titleEn) : (achievement.titleEn || achievement.titleRu)}</h3>
                  <span className="text-xs px-2 py-1 bg-accent/10 text-accent rounded">{achievement.type}</span>
                </div>
                <p className="text-sm text-foreground-muted mt-1">{lang === 'ru' ? (achievement.descriptionRu || achievement.descriptionEn) : (achievement.descriptionEn || achievement.descriptionRu)}</p>
                <p className="text-xs text-foreground-muted mt-2">{new Date(achievement.date).toLocaleDateString()}</p>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleEditClick(achievement)}
                    className="text-xs px-2 py-1 border border-border rounded hover:bg-background"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteAchievement(achievement.id)}
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