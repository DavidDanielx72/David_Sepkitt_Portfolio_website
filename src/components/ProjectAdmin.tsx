import { useState } from 'react'
import type { Project } from '../lib/supabase'
import { X, Save, Plus, Pencil, Trash } from './Icons'

type Props = {
  projects: Project[]
  isAdmin: boolean
  onAdd: (p: { title: string; tag: string; icon: string; stack: string[]; description: string; link: string; demo: string }) => Promise<void>
  onUpdate: (id: string, p: { title: string; tag: string; icon: string; stack: string[]; description: string; link: string; demo: string }) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

type EditState = {
  mode: 'add' | 'edit'
  id?: string
  title: string
  tag: string
  icon: string
  stack: string
  description: string
  link: string
  demo: string
}

const empty: EditState = {
  mode: 'add',
  title: '',
  tag: '',
  icon: 'sparkles',
  stack: '',
  description: '',
  link: '',
  demo: '',
}

const iconOptions = [
  { value: 'sparkles', label: 'Sparkles' },
  { value: 'globe', label: 'Globe' },
  { value: 'brain', label: 'Brain' },
  { value: 'code', label: 'Code' },
  { value: 'layers', label: 'Layers' },
  { value: 'database', label: 'Database' },
]

export default function ProjectAdmin({ projects, isAdmin, onAdd, onUpdate, onDelete }: Props) {
  const [editing, setEditing] = useState<EditState | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const startEdit = (p: Project) => {
    setEditing({
      mode: 'edit',
      id: p.id,
      title: p.title,
      tag: p.tag || '',
      icon: p.icon || 'sparkles',
      stack: (p.stack || []).join(', '),
      description: p.description,
      link: p.link,
      demo: p.demo || '',
    })
  }

  const handleSave = async () => {
    if (!editing) return
    if (!editing.title.trim() || !editing.description.trim() || !editing.link.trim()) {
      setError('Title, description, and link are required.')
      return
    }
    setSaving(true)
    setError('')
    const payload = {
      title: editing.title.trim(),
      tag: editing.tag.trim(),
      icon: editing.icon,
      stack: editing.stack.split(',').map((s) => s.trim()).filter(Boolean),
      description: editing.description.trim(),
      link: editing.link.trim(),
      demo: editing.demo.trim(),
    }
    try {
      if (editing.mode === 'add') {
        await onAdd(payload)
      } else if (editing.id) {
        await onUpdate(editing.id, payload)
      }
      setEditing(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save project.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (p: Project) => {
    if (!confirm(`Delete "${p.title}"? This cannot be undone.`)) return
    await onDelete(p.id)
  }

  if (!isAdmin) return null

  return (
    <>
      <div className="admin-bar reveal">
        <button className="btn btn-primary btn-sm" onClick={() => setEditing({ ...empty })}>
          <Plus size={15} /> Add project
        </button>
        {projects.map((p) => (
          <div key={p.id} className="admin-quick-edit">
            <span className="admin-quick-name">{p.title}</span>
            <button onClick={() => startEdit(p)} title="Edit"><Pencil size={13} /></button>
            <button onClick={() => handleDelete(p)} title="Delete"><Trash size={13} /></button>
          </div>
        ))}
      </div>

      {editing && (
        <div className="modal-overlay" onClick={() => setEditing(null)}>
          <div className="modal-card modal-card-lg" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setEditing(null)} aria-label="Close"><X size={18} /></button>
            <div className="modal-header">
              <h3>{editing.mode === 'add' ? 'Add Project' : 'Edit Project'}</h3>
              <p>Add a description and links to the GitHub and live site.</p>
            </div>
            <div className="admin-form">
              <div className="field">
                <label htmlFor="p-title">Title</label>
                <input id="p-title" type="text" value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} placeholder="Project name" />
              </div>
              <div className="form-row">
                <div className="field">
                  <label htmlFor="p-tag">Category tag</label>
                  <input id="p-tag" type="text" value={editing.tag} onChange={(e) => setEditing({ ...editing, tag: e.target.value })} placeholder="AI · Full Stack" />
                </div>
                <div className="field">
                  <label htmlFor="p-icon">Icon</label>
                  <select id="p-icon" value={editing.icon} onChange={(e) => setEditing({ ...editing, icon: e.target.value })}>
                    {iconOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
              </div>
              <div className="field">
                <label htmlFor="p-stack">Tech stack (comma-separated)</label>
                <input id="p-stack" type="text" value={editing.stack} onChange={(e) => setEditing({ ...editing, stack: e.target.value })} placeholder="React, AI, JavaScript, Supabase" />
              </div>
              <div className="field">
                <label htmlFor="p-desc">Description</label>
                <textarea id="p-desc" value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} placeholder="Describe the project..." rows={5} />
              </div>
              <div className="form-row">
                <div className="field">
                  <label htmlFor="p-link">GitHub / site link</label>
                  <input id="p-link" type="url" value={editing.link} onChange={(e) => setEditing({ ...editing, link: e.target.value })} placeholder="https://github.com/..." />
                </div>
                <div className="field">
                  <label htmlFor="p-demo">Live demo link (optional)</label>
                  <input id="p-demo" type="url" value={editing.demo} onChange={(e) => setEditing({ ...editing, demo: e.target.value })} placeholder="https://..." />
                </div>
              </div>
              {error && <div className="form-status err">{error}</div>}
              <div className="admin-form-actions">
                <button className="btn btn-ghost btn-sm" onClick={() => setEditing(null)} disabled={saving}>Cancel</button>
                <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={saving}>
                  {saving ? 'Saving…' : <><Save size={15} /> Save project</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
