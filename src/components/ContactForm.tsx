import { useState } from 'react'
import { Send } from './Icons'

type Status = 'idle' | 'sending' | 'ok' | 'err'

export default function ContactForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatus('err')
      setError('Please fill in all fields.')
      return
    }
    setStatus('sending')
    setError('')
    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-message`
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
        }),
      })
      if (!res.ok) throw new Error(`Request failed (${res.status})`)
      const data = await res.json().catch(() => ({}))
      if (data?.ok === false) throw new Error(data?.error || 'Submission failed')
      setStatus('ok')
      setName('')
      setEmail('')
      setMessage('')
    } catch (err) {
      setStatus('err')
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    }
  }

  return (
    <form className="contact-form" onSubmit={submit}>
      <h3>Send me a message</h3>
      <p className="form-sub">I'll get back to you at the email you provide.</p>

      <div className="form-row">
        <div className="field">
          <label htmlFor="cf-name">Name</label>
          <input id="cf-name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" autoComplete="name" />
        </div>
        <div className="field">
          <label htmlFor="cf-email">Email</label>
          <input id="cf-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" autoComplete="email" />
        </div>
      </div>

      <div className="field">
        <label htmlFor="cf-message">Message</label>
        <textarea id="cf-message" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Tell me about the role, project, or opportunity…" />
      </div>

      <button type="submit" className="btn btn-primary form-submit" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending…' : <>Send message <Send size={15} /></>}
      </button>

      {status === 'ok' && (
        <div className="form-status ok">Thanks — your message has been sent. I'll be in touch soon.</div>
      )}
      {status === 'err' && (
        <div className="form-status err">{error || 'Could not send your message. Please try again.'}</div>
      )}
    </form>
  )
}
