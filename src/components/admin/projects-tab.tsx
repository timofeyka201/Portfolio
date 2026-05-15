"use client"

import { useState } from "react"
import { LanguageToggle } from "./language-toggle"

interface Project {
  id: string
  titleRu: string
  titleEn: string
  slug: string
  descriptionRu: string
  descriptionEn: string
  stack: string[]
  tagsRu: string[]
  tagsEn: string[]
  status: string
  featured: boolean
  isVisible: boolean
  order: number
}

interface ProjectsTabProps {
  projects: Project[]
  onUpdate: () => void
}

const statuses = ['DRAFT', 'LIVE', 'ARCHIVED']

export function ProjectsTab({ projects, onUpdate }: ProjectsTabProps) {
  const [lang, setLang] = useState<"ru" | "en">("ru")
  const [showAddForm, setShowAddForm] = useState(false)
  const [newProject, setNewProject] = useState({
    titleRu: '',
    titleEn: '',
    descriptionRu: '',
    descriptionEn: '',
    tagsRu: '',
    tagsEn: '',
    status: 'DRAFT',
  })
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Project | null>(null)

  const handleAddProject = async () => {
    if (!newProject.titleRu.trim() && !newProject.titleEn.trim()) return
    
    setSaving(true)
    try {
      const res = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titleRu: newProject.titleRu,
          titleEn: newProject.titleEn,
          descriptionRu: newProject.descriptionRu,
          descriptionEn: newProject.descriptionEn,
          tagsRu: newProject.tagsRu.split(',').map(t => t.trim()).filter(Boolean),
          tagsEn: newProject.tagsEn.split(',').map(t => t.trim()).filter(Boolean),
          status: newProject.status,
        }),
      })
      
      if (res.ok) {
        setNewProject({ titleRu: '', titleEn: '', descriptionRu: '', descriptionEn: '', tagsRu: '', tagsEn: '', status: 'DRAFT' })
        setShowAddForm(false)
        onUpdate()
      }
    } catch (error) {
      console.error('Failed to add project:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteProject = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/projects?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        onUpdate()
      }
    } catch (error) {
      console.error('Failed to delete project:', error)
    }
  }

  const handleEditClick = (project: Project) => {
    setEditingId(project.id)
    setEditForm({ ...project })
  }

  const handleSaveEdit = async () => {
    if (!editForm) return
    
    setSaving(true)
    try {
      const res = await fetch('/api/admin/projects', {
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
      console.error('Failed to update project:', error)
    } finally {
      setSaving(false)
    }
  }

  const fieldTitle = lang === 'ru' ? 'titleRu' : 'titleEn'
  const fieldDesc = lang === 'ru' ? 'descriptionRu' : 'descriptionEn'
  const fieldTags = lang === 'ru' ? 'tagsRu' : 'tagsEn'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Projects</h2>
        <div className="flex items-center gap-4">
          <LanguageToggle lang={lang} onChange={setLang} />
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 bg-accent text-white rounded-lg font-medium hover:bg-accent/90"
          >
            {showAddForm ? 'Cancel' : 'Add Project'}
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
                value={newProject.titleRu}
                onChange={(e) => setNewProject({ ...newProject, titleRu: e.target.value })}
                placeholder="Название проекта"
                className="w-full px-3 py-2 bg-background border border-border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm text-foreground-muted mb-1">Title (EN)</label>
              <input
                type="text"
                value={newProject.titleEn}
                onChange={(e) => setNewProject({ ...newProject, titleEn: e.target.value })}
                placeholder="Project name"
                className="w-full px-3 py-2 bg-background border border-border rounded-lg"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-foreground-muted mb-1">Description (RU)</label>
              <textarea
                value={newProject.descriptionRu}
                onChange={(e) => setNewProject({ ...newProject, descriptionRu: e.target.value })}
                placeholder="Описание"
                rows={3}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm text-foreground-muted mb-1">Description (EN)</label>
              <textarea
                value={newProject.descriptionEn}
                onChange={(e) => setNewProject({ ...newProject, descriptionEn: e.target.value })}
                placeholder="Description"
                rows={3}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-foreground-muted mb-1">Tags (RU)</label>
              <input
                type="text"
                value={newProject.tagsRu}
                onChange={(e) => setNewProject({ ...newProject, tagsRu: e.target.value })}
                placeholder="Теги (через запятую)"
                className="w-full px-3 py-2 bg-background border border-border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm text-foreground-muted mb-1">Tags (EN)</label>
              <input
                type="text"
                value={newProject.tagsEn}
                onChange={(e) => setNewProject({ ...newProject, tagsEn: e.target.value })}
                placeholder="Tags (comma separated)"
                className="w-full px-3 py-2 bg-background border border-border rounded-lg"
              />
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <select
              value={newProject.status}
              onChange={(e) => setNewProject({ ...newProject, status: e.target.value })}
              className="px-3 py-2 bg-background border border-border rounded-lg"
            >
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            <button
              onClick={handleAddProject}
              disabled={saving}
              className="px-4 py-2 bg-accent text-white rounded-lg font-medium hover:bg-accent/90 disabled:opacity-50"
            >
              {saving ? 'Adding...' : 'Add'}
            </button>
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {projects.map((project) => (
          <div key={project.id} className="p-4 bg-background-secondary border border-border rounded-lg">
            {editingId === project.id && editForm ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={editForm.titleRu || ''}
                    onChange={(e) => setEditForm({ ...editForm, titleRu: e.target.value })}
                    placeholder="Title (RU)"
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm"
                  />
                  <input
                    type="text"
                    value={editForm.titleEn || ''}
                    onChange={(e) => setEditForm({ ...editForm, titleEn: e.target.value })}
                    placeholder="Title (EN)"
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm"
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
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={(editForm.tagsRu || []).join(', ')}
                    onChange={(e) => setEditForm({ ...editForm, tagsRu: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
                    placeholder="Tags (RU)"
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm"
                  />
                  <input
                    type="text"
                    value={(editForm.tagsEn || []).join(', ')}
                    onChange={(e) => setEditForm({ ...editForm, tagsEn: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
                    placeholder="Tags (EN)"
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm"
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                    className="px-2 py-1 bg-background border border-border rounded-lg text-sm"
                  >
                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
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
              <>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{lang === 'ru' ? (project.titleRu || project.titleEn) : (project.titleEn || project.titleRu)}</h3>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded ${
                      project.status === 'LIVE' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-foreground-muted mb-3">{lang === 'ru' ? (project.descriptionRu || project.descriptionEn) : (project.descriptionEn || project.descriptionRu)}</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {(lang === 'ru' ? (project.tagsRu || []) : (project.tagsEn || [])).map((tag) => (
                    <span key={tag} className="text-xs px-2 py-1 bg-background rounded">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditClick(project)}
                    className="text-xs px-2 py-1 border border-border rounded hover:bg-background"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProject(project.id)}
                    className="text-xs px-2 py-1 border border-border rounded hover:bg-background text-red-500"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}