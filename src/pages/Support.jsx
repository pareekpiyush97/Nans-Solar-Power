import { useState } from 'react'
import { LifeBuoy, Search, Send, CheckCircle2, Copy, Check } from 'lucide-react'
import { Field, Spinner } from '../components/ui/Field.jsx'
import { createComplaint, getComplaintByCode, addComplaintResponse } from '../lib/api.js'
import { PageHero } from './Reviews.jsx'

const STATUS = {
  open: ['badge-amber', 'Open'],
  in_progress: ['badge-sky', 'In progress'],
  resolved: ['badge-green', 'Resolved'],
  closed: ['badge-gray', 'Closed'],
}

export default function Support() {
  return (
    <>
      <PageHero eyebrow="Customer Support" title="Register & track a complaint" sub="Raise an issue and we’ll fix it. Track progress anytime with your complaint code." />
      <section className="section-y pt-0">
        <div className="wrap grid lg:grid-cols-2 gap-6 items-start">
          <RegisterCard />
          <TrackCard />
        </div>
      </section>
    </>
  )
}

function RegisterCard() {
  const [f, setF] = useState({ client_name: '', phone: '', email: '', subject: '', description: '' })
  const [busy, setBusy] = useState(false)
  const [code, setCode] = useState('')
  const [err, setErr] = useState('')
  const [copied, setCopied] = useState(false)
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })

  async function submit(e) {
    e.preventDefault(); setErr(''); setBusy(true)
    try { const c = await createComplaint(f); setCode(c.code) }
    catch (e) { setErr(e?.message || 'Something went wrong.') } finally { setBusy(false) }
  }
  function copy() { navigator.clipboard?.writeText(code).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500) }).catch(() => {}) }

  if (code) return (
    <div className="card p-7 text-center">
      <CheckCircle2 size={44} className="text-green mx-auto" />
      <h3 className="font-display font-bold text-xl mt-3">Complaint registered</h3>
      <p className="text-muted mt-2">Save this code to track progress and respond once it’s resolved:</p>
      <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-green-50 text-green-700 font-display font-extrabold text-2xl px-5 py-3">
        {code}
        <button onClick={copy} className="text-green-600" aria-label="Copy code">{copied ? <Check size={20} /> : <Copy size={20} />}</button>
      </div>
      <div className="mt-6"><button className="btn btn-ghost" onClick={() => { setCode(''); setF({ client_name: '', phone: '', email: '', subject: '', description: '' }) }}>Register another</button></div>
    </div>
  )

  return (
    <form onSubmit={submit} className="card p-6">
      <h3 className="font-display font-bold text-lg flex items-center gap-2"><LifeBuoy size={20} className="text-green" />Register a complaint</h3>
      <p className="text-muted text-sm mt-1 mb-4">We’ll get on it and notify our team.</p>
      <div className="flex flex-col gap-3.5">
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Your name" required><input className="input" required value={f.client_name} onChange={set('client_name')} /></Field>
          <Field label="Phone" required><input className="input" required value={f.phone} onChange={set('phone')} placeholder="98xxx xxxxx" /></Field>
        </div>
        <Field label="Email"><input className="input" type="email" value={f.email} onChange={set('email')} placeholder="optional" /></Field>
        <Field label="Subject" required><input className="input" required value={f.subject} onChange={set('subject')} placeholder="e.g. Inverter showing error" /></Field>
        <Field label="Describe the issue" required><textarea className="input min-h-[120px]" required value={f.description} onChange={set('description')} /></Field>
        {err && <p className="text-red-600 text-sm">{err}</p>}
        <button className="btn btn-primary" disabled={busy}>{busy ? <Spinner /> : <Send size={18} />}Register complaint</button>
      </div>
    </form>
  )
}

function TrackCard() {
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [c, setC] = useState(null)
  const [searched, setSearched] = useState(false)

  async function find(e) {
    e.preventDefault(); setBusy(true); setSearched(false)
    const res = await getComplaintByCode(code)
    setC(res); setSearched(true); setBusy(false)
  }

  return (
    <div className="card p-6">
      <h3 className="font-display font-bold text-lg flex items-center gap-2"><Search size={20} className="text-green" />Track my complaint</h3>
      <p className="text-muted text-sm mt-1 mb-4">Enter the code you received (e.g. <code className="rounded bg-surface-2 px-1">NSP-8K2P</code>).</p>
      <form onSubmit={find} className="flex gap-2.5">
        <input className="input" value={code} onChange={(e) => setCode(e.target.value)} placeholder="NSP-XXXX" />
        <button className="btn btn-primary btn-sm shrink-0" disabled={busy}>{busy ? <Spinner /> : 'Track'}</button>
      </form>

      {searched && !c && <p className="text-muted text-sm mt-4">No complaint found for that code. Please check and try again.</p>}

      {c && (
        <div className="mt-5 border-t border-border pt-5">
          <div className="flex items-center justify-between gap-3">
            <div className="font-display font-bold">{c.subject}</div>
            <span className={`badge ${STATUS[c.status]?.[0] || 'badge-gray'}`}>{STATUS[c.status]?.[1] || c.status}</span>
          </div>
          <p className="text-muted text-sm mt-2">{c.description}</p>
          {c.resolution_note && (
            <div className="mt-4 rounded-xl bg-green-50 p-4">
              <div className="font-semibold text-green-700 text-sm">Resolution</div>
              <p className="text-fg-soft text-sm mt-1">{c.resolution_note}</p>
            </div>
          )}
          {(c.status === 'resolved') && <ResponseForm complaint={c} onDone={setC} />}
          {c.client_response && (
            <div className="mt-4 rounded-xl bg-surface-2 p-4">
              <div className="font-semibold text-sm">Your response {c.client_satisfied ? '· 👍 Satisfied' : c.client_satisfied === false ? '· 👎 Not satisfied' : ''}</div>
              <p className="text-fg-soft text-sm mt-1">{c.client_response}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function ResponseForm({ complaint, onDone }) {
  const [text, setText] = useState('')
  const [sat, setSat] = useState(null)
  const [busy, setBusy] = useState(false)
  if (complaint.client_response) return null

  async function submit(e) {
    e.preventDefault(); setBusy(true)
    const updated = await addComplaintResponse(complaint.id, { client_response: text, client_satisfied: sat })
    setBusy(false); onDone?.(updated)
  }
  return (
    <form onSubmit={submit} className="mt-4">
      <span className="label">Was your issue resolved?</span>
      <div className="flex gap-2.5 mb-3">
        <button type="button" onClick={() => setSat(true)} className={`btn btn-sm ${sat === true ? 'btn-primary' : 'btn-outline'}`}>👍 Yes</button>
        <button type="button" onClick={() => setSat(false)} className={`btn btn-sm ${sat === false ? 'btn-danger' : 'btn-outline'}`}>👎 Not yet</button>
      </div>
      <textarea className="input min-h-[90px]" required value={text} onChange={(e) => setText(e.target.value)} placeholder="Add your response for the team…" />
      <button className="btn btn-primary btn-sm mt-3" disabled={busy || sat === null}>{busy ? <Spinner /> : <Send size={16} />}Send response</button>
    </form>
  )
}
