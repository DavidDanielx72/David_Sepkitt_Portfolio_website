import { useState, useEffect, useCallback } from 'react'
import { supabase, type Certificate } from '../lib/supabase'
import { Plus, Pencil, Trash, X, FileText, Award, Upload, Eye } from './Icons'

type Props = {
  isAdmin: boolean
}

type EditState = {
  mode: 'add' | 'edit'
  id?: string
  title: string
  issuer: string
  file: File | null
  existingPath: string | null
}

const emptyEdit: EditState = {
  mode: 'add',
  title: '',
  issuer: '',
  file: null,
  existingPath: null,
}

function isPdfPath(path: string): boolean {
  return path.toLowerCase().endsWith('.pdf')
}

export default function Certificates({ isAdmin }: Props) {
  const [certs, setCerts] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<EditState | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [viewing, setViewing] = useState<Certificate | null>(null)
  const [viewUrl, setViewUrl] = useState<string | null>(null)
  const [viewLoading, setViewLoading] = useState(false)
  const load = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .order('sort_order', { ascending: true })
    if (error) {
      setError('Could not load certificates.')
    } else {
      setCerts(data || [])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const getSignedUrl = async (path: string): Promise<string | null> => {
    const { data, error } = await supabase.storage.from('certificates').createSignedUrl(path, 3600)
    if (error || !data?.signedUrl) return null
    return data.signedUrl
  }

  const [thumbUrls, setThumbUrls] = useState<Record<string, string>>({})

  useEffect(() => {
    let cancelled = false
    certs.forEach(async (cert) => {
      if (!cert.file_path) return
      if (thumbUrls[cert.id]) return
      const url = await getSignedUrl(cert.file_path)
      if (!cancelled && url) {
        setThumbUrls((prev) => ({ ...prev, [cert.id]: url }))
      }
    })
    return () => { cancelled = true }
  }, [certs, thumbUrls])

  const handleView = async (cert: Certificate) => {
    if (!cert.file_path) return
    setViewing(cert)
    setViewUrl(null)
    setViewLoading(true)
    const url = await getSignedUrl(cert.file_path)
    setViewUrl(url)
    setViewLoading(false)
  }

  const closeViewer = () => {
    setViewing(null)
    setViewUrl(null)
    setViewLoading(false)
  }

  const handleSave = async () => {
    if (!editing) return
    if (!editing.title.trim()) {
      setError('Title is required.')
      return
    }
    setSaving(true)
    setError('')

    try {
      let filePath = editing.existingPath
      let fileUrl: string | null = null

      if (editing.file) {
        const ext = editing.file.name.split('.').pop()?.toLowerCase() || 'pdf'
        const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
        const path = `certs/${safeName}`

        const { error: upErr } = await supabase.storage
          .from('certificates')
          .upload(path, editing.file, { contentType: editing.file.type, upsert: false })

        if (upErr) throw new Error('Upload failed. Please try again.')
        filePath = path

        if (editing.existingPath && editing.existingPath !== path) {
          await supabase.storage.from('certificates').remove([editing.existingPath])
        }
      }

      if (filePath) {
        const { data } = await supabase.storage.from('certificates').createSignedUrl(filePath, 3600)
        fileUrl = data?.signedUrl || null
      }

      if (editing.mode === 'add') {
        const { error: insErr } = await supabase.from('certificates').insert({
          title: editing.title.trim(),
          issuer: editing.issuer.trim() || null,
          file_path: filePath,
          file_url: fileUrl,
          sort_order: certs.length,
        })
        if (insErr) throw new Error('Could not save certificate.')
      } else if (editing.id) {
        const { error: updErr } = await supabase.from('certificates').update({
          title: editing.title.trim(),
          issuer: editing.issuer.trim() || null,
          file_path: filePath,
          file_url: fileUrl,
        }).eq('id', editing.id)
        if (updErr) throw new Error('Could not update certificate.')
      }

      setEditing(null)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (cert: Certificate) => {
    if (!confirm(`Delete "${cert.title}"? This cannot be undone.`)) return
    if (cert.file_path) {
      await supabase.storage.from('certificates').remove([cert.file_path])
    }
    await supabase.from('certificates').delete().eq('id', cert.id)
    await load()
  }

  const startEdit = (cert: Certificate) => {
    setEditing({
      mode: 'edit',
      id: cert.id,
      title: cert.title,
      issuer: cert.issuer || '',
      file: null,
      existingPath: cert.file_path,
    })
  }

  return (
    <section id="certificates">
      <div className="container">
        <div className="reveal">
          <span className="section-tag">Credentials</span>
          <h2 className="section-title">Certificates</h2>
          <p className="section-sub">Continuous learning across AI, data science, and cloud platforms.</p>
        </div>

        {isAdmin && (
          <div className="admin-bar reveal">
            <button className="btn btn-primary btn-sm" onClick={() => setEditing({ ...emptyEdit })}>
              <Plus size={15} /> Add certificate
            </button>
          </div>
        )}

        {loading ? (
          <div className="cert-grid reveal">
            {[1, 2, 3].map((i) => <div key={i} className="cert-card cert-skeleton" />)}
          </div>
        ) : certs.length === 0 ? (
          <p className="empty-state reveal">No certificates yet.</p>
        ) : (
          <div className="cert-grid reveal">
            {certs.map((cert, i) => (
              <div
                key={cert.id}
                className="cert-card reveal"
                style={{ '--i': i } as React.CSSProperties}
              >
                <div className="cert-thumb" onClick={() => cert.file_path && handleView(cert)}>
                  {cert.file_path ? (
                    thumbUrls[cert.id] ? (
                      isPdfPath(cert.file_path) ? (
                        <div className="cert-thumb-pdf"><FileText size={32} /><span>PDF</span></div>
                      ) : (
                        <img src={thumbUrls[cert.id]} alt={cert.title} className="cert-thumb-img" />
                      )
                    ) : (
                      <div className="cert-thumb-loading" />
                    )
                  ) : (
                    <div className="cert-thumb-empty"><Award size={28} /></div>
                  )}
                </div>
                <div className="cert-body">
                  <h4>{cert.title}</h4>
                  {cert.issuer && <span className="cert-issuer">{cert.issuer}</span>}
                </div>
                <div className="cert-actions">
                  {cert.file_path && (
                    <button className="cert-view" onClick={() => handleView(cert)} title="View certificate">
                      <Eye size={16} /> View
                    </button>
                  )}
                  {isAdmin && (
                    <>
                      <button className="cert-edit" onClick={() => startEdit(cert)} title="Edit"><Pencil size={14} /></button>
                      <button className="cert-del" onClick={() => handleDelete(cert)} title="Delete"><Trash size={14} /></button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {editing && (
          <div className="modal-overlay" onClick={() => setEditing(null)}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setEditing(null)} aria-label="Close"><X size={18} /></button>
              <div className="modal-header">
                <div className="modal-icon"><FileText size={20} /></div>
                <h3>{editing.mode === 'add' ? 'Add Certificate' : 'Edit Certificate'}</h3>
                <p>Upload a PNG or PDF and add a title.</p>
              </div>
              <div className="admin-form">
                <div className="field">
                  <label htmlFor="cert-title">Certificate title</label>
                  <input id="cert-title" type="text" value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} placeholder="e.g. Generative AI: Prompt Engineering Basics" />
                </div>
                <div className="field">
                  <label htmlFor="cert-issuer">Issuer (optional)</label>
                  <input id="cert-issuer" type="text" value={editing.issuer} onChange={(e) => setEditing({ ...editing, issuer: e.target.value })} placeholder="e.g. IBM (Coursera)" />
                </div>
                <div className="field">
                  <label>Certificate file (PNG or PDF)</label>
                  <div className="upload-zone">
                    <input
                      type="file"
                      accept=".png,.pdf,.jpg,.jpeg,image/png,application/pdf"
                      id="cert-file"
                      onChange={(e) => setEditing({ ...editing, file: e.target.files?.[0] || null })}
                    />
                    <label htmlFor="cert-file" className="upload-label">
                      <Upload size={18} />
                      <span>{editing.file ? editing.file.name : editing.existingPath ? 'Replace existing file' : 'Choose file to upload'}</span>
                    </label>
                  </div>
                  {editing.existingPath && !editing.file && (
                    <p className="field-hint">A file is already uploaded. Select a new one only if you want to replace it.</p>
                  )}
                </div>
                {error && <div className="form-status err">{error}</div>}
                <div className="admin-form-actions">
                  <button className="btn btn-ghost btn-sm" onClick={() => setEditing(null)} disabled={saving}>Cancel</button>
                  <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={saving}>
                    {saving ? 'Saving…' : 'Save certificate'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {viewing && (
          <div className="modal-overlay cert-viewer-overlay" onClick={closeViewer}>
            <div className="cert-viewer-modal" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={closeViewer} aria-label="Close"><X size={18} /></button>
              <div className="cert-viewer-header">
                <div className="cert-viewer-icon"><Award size={20} /></div>
                <div>
                  <h3>{viewing.title}</h3>
                  {viewing.issuer && <span className="cert-issuer">{viewing.issuer}</span>}
                </div>
              </div>
              <div className="cert-viewer-body">
                {viewLoading ? (
                  <div className="cert-viewer-loading">Loading certificate…</div>
                ) : viewUrl ? (
                  isPdfPath(viewing.file_path || '') ? (
                    <iframe src={viewUrl} title={viewing.title} className="cert-viewer-frame" />
                  ) : (
                    <img src={viewUrl} alt={viewing.title} className="cert-viewer-img" />
                  )
                ) : (
                  <div className="cert-viewer-loading">Could not load certificate file.</div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
