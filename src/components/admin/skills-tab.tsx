"use client"

import { useState } from "react"
import { LanguageToggle } from "./language-toggle"

interface Skill {
  id: string
  nameRu: string
  nameEn: string
  category: string
  isVisible: boolean
  order: number
}

interface SkillsTabProps {
  skills: Skill[]
  onUpdate: () => void
}

const categories = ['Product', 'AI', 'Analytics', 'Technical', 'Research', 'Tools']

export function SkillsTab({ skills, onUpdate }: SkillsTabProps) {
  const [lang, setLang] = useState<"ru" | "en">("ru")
  const [showAddForm, setShowAddForm] = useState(false)
  const [newSkillNameRu, setNewSkillNameRu] = useState('')
  const [newSkillNameEn, setNewSkillNameEn] = useState('')
  const [newSkillCategory, setNewSkillCategory] = useState('Product')
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<{ nameRu: string; nameEn: string } | null>(null)

  const handleAddSkill = async () => {
    if (!newSkillNameRu.trim() && !newSkillNameEn.trim()) return
    
    setSaving(true)
    try {
      const res = await fetch('/api/admin/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nameRu: newSkillNameRu, nameEn: newSkillNameEn, category: newSkillCategory }),
      })
      
      if (res.ok) {
        setNewSkillNameRu('')
        setNewSkillNameEn('')
        setShowAddForm(false)
        onUpdate()
      }
    } catch (error) {
      console.error('Failed to add skill:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteSkill = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/skills?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        onUpdate()
      }
    } catch (error) {
      console.error('Failed to delete skill:', error)
    }
  }

  const handleEditClick = (skill: Skill) => {
    setEditingId(skill.id)
    setEditForm({ nameRu: skill.nameRu || '', nameEn: skill.nameEn || '' })
  }

  const handleSaveEdit = async (skill: Skill) => {
    if (!editForm) return
    
    setSaving(true)
    try {
      const res = await fetch('/api/admin/skills', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify([{ id: skill.id, nameRu: editForm.nameRu, nameEn: editForm.nameEn, category: skill.category, order: skill.order, isVisible: skill.isVisible }]),
      })
      
      if (res.ok) {
        setEditingId(null)
        setEditForm(null)
        onUpdate()
      }
    } catch (error) {
      console.error('Failed to update skill:', error)
    } finally {
      setSaving(false)
    }
  }

  const skillsByCategory = categories.reduce((acc, cat) => {
    acc[cat] = skills.filter(s => s.category === cat)
    return acc
  }, {} as Record<string, Skill[]>)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Skills</h2>
        <div className="flex items-center gap-4">
          <LanguageToggle lang={lang} onChange={setLang} />
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 bg-accent text-white rounded-lg font-medium hover:bg-accent/90"
          >
            {showAddForm ? 'Cancel' : 'Add Skill'}
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="p-4 bg-background-secondary border border-border rounded-lg">
          <div className="flex gap-4">
            <input
              type="text"
              value={newSkillNameRu}
              onChange={(e) => setNewSkillNameRu(e.target.value)}
              placeholder="Skill name (RU)"
              className="flex-1 px-3 py-2 bg-background border border-border rounded-lg"
            />
            <input
              type="text"
              value={newSkillNameEn}
              onChange={(e) => setNewSkillNameEn(e.target.value)}
              placeholder="Skill name (EN)"
              className="flex-1 px-3 py-2 bg-background border border-border rounded-lg"
            />
            <select
              value={newSkillCategory}
              onChange={(e) => setNewSkillCategory(e.target.value)}
              className="px-3 py-2 bg-background border border-border rounded-lg"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <button
              onClick={handleAddSkill}
              disabled={saving}
              className="px-4 py-2 bg-accent text-white rounded-lg font-medium hover:bg-accent/90 disabled:opacity-50"
            >
              {saving ? 'Adding...' : 'Add'}
            </button>
          </div>
        </div>
      )}

      {categories.map((category) => (
        skillsByCategory[category].length > 0 && (
          <div key={category}>
            <h3 className="font-medium mb-3">{category}</h3>
            <div className="flex flex-wrap gap-2">
              {skillsByCategory[category].map((skill) => (
                <span
                  key={skill.id}
                  className="group flex items-center gap-2 px-3 py-1.5 bg-background-secondary border border-border rounded-md text-sm"
                >
                  {editingId === skill.id && editForm ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editForm.nameRu}
                        onChange={(e) => setEditForm({ ...editForm, nameRu: e.target.value })}
                        placeholder="Name (RU)"
                        className="w-24 px-2 py-1 bg-background border border-border rounded text-xs"
                      />
                      <input
                        type="text"
                        value={editForm.nameEn}
                        onChange={(e) => setEditForm({ ...editForm, nameEn: e.target.value })}
                        placeholder="Name (EN)"
                        className="w-24 px-2 py-1 bg-background border border-border rounded text-xs"
                      />
                      <button
                        onClick={() => handleSaveEdit(skill)}
                        disabled={saving}
                        className="text-accent hover:text-accent/80"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => { setEditingId(null); setEditForm(null) }}
                        className="text-foreground-muted"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      {lang === 'ru' ? (skill.nameRu || skill.nameEn) : (skill.nameEn || skill.nameRu)}
                      <button
                        onClick={() => handleEditClick(skill)}
                        className="text-foreground-muted hover:text-foreground"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteSkill(skill.id)}
                        className="text-foreground-muted hover:text-red-500"
                      >
                        ×
                      </button>
                    </>
                  )}
                </span>
              ))}
            </div>
          </div>
        )
      ))}
    </div>
  )
}