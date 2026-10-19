import { useEffect, useState } from 'react'
import { LifeBuoy, Phone, Mail, Save, Inbox } from 'lucide-react'
import { listComplaints, updateComplaint } from '../../lib/api.js'
import { Spinner } from '../../components/ui/Field.jsx'

const STATUSES = ['open', 'in_progress', 'resolved', 'closed']
const BADGE = { open: 'badge-amber', in_progress: 'badge-sky', resolved: 'badge-green', closed: 'badge-gray' }

export default function ComplaintsAdmin() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  async function load() { setLoading(true); setItems(await listComplaints()); setLoading(false) }
  useEffect(() => { load() }, [])

  const shown = items.filter((c) => filter === 'all' ? true : c.status === filter)

  return (
    <div>
      <h1 className="text-2xl font-extrabold">Complaints</h1>
      <p className="text-muted text-sm mt-1 mb-5">Resolve customer issues and track their responses.</p>

      <div className="flex flex-wrap gap-2 mb-5">
        {['all', ...STATUSES].map((s) => (
          <button key={s} onClick={() => setFilter(s)} className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-outline'}`}>
            {s.replace('_', ' ')}{s === 'all' ? ` (${items.length})` : ` (${items.filter((c) => c.status === s).length})`}
          </button>
        ))}
      </div>

      {loading ? <p className="text-muted">Loading…</p> : shown.length === 0 ? (
        <div className="card p-12 text-center text-muted"><Inbox size={34} className="mx-auto mb-3 text-border-strong" />No complaints here.</div>
      ) : (
        <div className="flex flex-col gap-4">
          {shown.map((c) => <ComplaintCard key={c.id} c={c} onSaved={load} />)}
        </div>
      )}
    </div>
  )
}

function ComplaintCard({ c, onSaved }) {
  const [status, setStatus] = useState(c.status)
  const [note, setNote] = useState(c.resolution_note || '')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  async function save() {
    if ((status === 'resolved' || status === 'closed') && !note.trim()) { setErr('Add a resolution note before resolving/closing.'); return }
    setErr(''); setBusy(true)
    await updateComplaint(c.id, { status, resolution_note: note })
    setBusy(false); onSaved()
  }

  return (
    <div className="card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="font-display font-bold text-green-700">{c.code}</span>
            <span className={`badge ${BADGE[c.status]}`}>{c.status.replace('_', ' ')}</span>
          </div>
          <div className="font-semibold mt-1.5">{c.subject}</div>
          <p className="text-muted text-sm mt-1">{c.description}</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted mt-2">
            <span className="flex items-center gap-1"><LifeBuoy size={12} />{c.client_name}</span>
            <span className="flex items-center gap-1"><Phone size={12} />{c.phone}</span>
            {c.email && <span className="flex items-center gap-1"><Mail size={12} />{c.email}</span>}
            <span>{new Date(c.created).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {c.client_response && (
        <div className="mt-3 rounded-xl bg-surface-2 p-3 text-sm">
          <span className="font-semibold">Client responded {c.client_satisfied ? '· 👍 Satisfied' : c.client_satisfied === false ? '· 👎 Not satisfied' : ''}:</span> {c.client_response}
        </div>
      )}

      <div className="mt-4 grid sm:grid-cols-[180px_1fr_auto] gap-3 items-end">
        <label className="block">
          <span className="label">Status</span>
          <select className="input" value={status} onChange={(e) => setStatus(e.target.value)}>
            {STATUSES.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
          </select>
        </label>
        <label className="block">
          <span className="label">Resolution note</span>
          <input className="input" value={note} onChange={(e) => setNote(e.target.value)} placeholder="What was done to fix it?" />
        </label>
        <button onClick={save} className="btn btn-primary btn-sm" disabled={busy}>{busy ? <Spinner /> : <Save size={16} />}Save</button>
      </div>
      {err && <p className="text-red-600 text-sm mt-2">{err}</p>}
    </div>
  )
}
