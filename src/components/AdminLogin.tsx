import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { X, Lock, Mail, User } from './Icons'

type Props = {
  onClose: () => void
  onSuccess: () => void
}

export default function AdminLogin({ onClose, onSuccess }: Props) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setInfo('')

    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { data: { full_name: name.trim() } },
        })
        if (error) throw error
        if (data.session) {
          onSuccess()
        } else {
          setInfo('Account created. Contact the site owner to enable admin access, then sign in.')
          setMode('signin')
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
        if (error) throw error
        onSuccess()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close"><X size={18} /></button>
        <div className="modal-header">
          <div className="modal-icon"><Lock size={20} /></div>
          <h3>{mode === 'signin' ? 'Admin Sign In' : 'Create Admin Account'}</h3>
          <p>{mode === 'signin' ? 'Sign in to edit projects and certificates.' : 'Create an account to manage your portfolio.'}</p>
        </div>
        <form onSubmit={submit} className="admin-login-form">
          {mode === 'signup' && (
            <div className="field">
              <label htmlFor="admin-name">Name</label>
              <div className="input-wrap">
                <User size={16} />
                <input id="admin-name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" autoComplete="name" required />
              </div>
            </div>
          )}
          <div className="field">
            <label htmlFor="admin-email">Email</label>
            <div className="input-wrap">
              <Mail size={16} />
              <input id="admin-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" autoComplete="email" required />
            </div>
          </div>
          <div className="field">
            <label htmlFor="admin-pw">Password</label>
            <div className="input-wrap">
              <Lock size={16} />
              <input id="admin-pw" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} required minLength={6} />
            </div>
          </div>
          {error && <div className="form-status err">{error}</div>}
          {info && <div className="form-status ok">{info}</div>}
          <button type="submit" className="btn btn-primary form-submit" disabled={loading}>
            {loading ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Create account'}
          </button>
          <p className="auth-switch">
            {mode === 'signin' ? (
              <>Don't have an account? <button type="button" onClick={() => { setMode('signup'); setError('') }}>Create one</button></>
            ) : (
              <>Already have an account? <button type="button" onClick={() => { setMode('signin'); setError('') }}>Sign in</button></>
            )}
          </p>
        </form>
      </div>
    </div>
  )
}
