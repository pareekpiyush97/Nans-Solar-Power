import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Building2, MapPin, ArrowRight, User, Plus, Save, X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import { listAllSites, listSitesForEmployee, getUsersMap, listEmployees, createSite } from '../../lib/api.js'
import { Field, Spinner } from '../../components/ui/Field.jsx'
import { STAGES, stageLabel, stageIndex } from '../../lib/stages.js'

const TYPE = { residential: 'badge-green', commercial: 'badge-sky', industrial: 'badge-amber' }
const BLANK = { client_name: '', client_phone: '', address: '', city: 'Bikaner', pincode: '', capacity_kw: '', system_type: 'residential', assigned_employee: '' }

export default function SitesList() {
  const { user } = useAuth()
  const isVendor = user.role === 'vendor'
  const [sites, setSites] = useState([])
  const [users, setUsers] = useState({})
  const [loading, setLoading] = useState(true)
  const [showNew, setShowNew] = useState(false)

  async function load() {
    const s = isVendor ? await listAllSites() : await listSitesForEmployee(user.id)
    const u = await getUsersMap()
    setSites(s); setUsers(u); setLoading(false)
  }
  useEffect(() => { let on = true; (async () => { await load(); if (!on) return })(); return () => { on = false } }, [user, isVendor])

  return (
    <div>
      <div className="flex items-end justify-between gap-4 mb-5">
        <div>
          <h1 className="text-2xl font-extrabold">{isVendor ? 'All sites' : 'My sites'}</h1>
          <p className="text-muted text-sm mt-1">{isVendor ? 'Every installation across your team.' : 'Installations assigned to you.'}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="badge badge-gray">{sites.length} site{sites.length !== 1 ? 's' : ''}</span>
          {isVendor && (
            <button onClick={() => setShowNew((v) => !v)} className="btn btn-primary btn-sm">
              {showNew ? <><X size={16} />Close</> : <><Plus size={16} />New site</>}
            </button>
          )}
        </div>
      </div>

      {isVendor && showNew && <NewSiteForm vendorId={user.id} onCreated={async () => { setShowNew(false); await load() }} />}

      {loading ? <p className="text-muted">Loading…</p> : sites.length === 0 ? (
        <div className="card p-10 text-center text-muted">No sites yet.{isVendor && ' Add your first with “New site”.'}</div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-5">
          {sites.map((s) => {
            const pct = Math.round((stageIndex(s.current_stage) / (STAGES.length - 1)) * 100)
            return (
              <Link key={s.id} to={`/portal/sites/${s.id}`} className="card p-5 hover:-translate-y-1 hover:shadow-md2 transition group">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-green-50 text-green-600"><Building2 size={20} /></span>
                    <div>
                      <div className="font-display font-bold">{s.client_name}</div>
                      <div className="text-muted text-xs">{s.capacity_kw} kW</div>
                    </div>
                  </div>
                  <span className={`badge ${TYPE[s.system_type] || 'badge-gray'}`}>{s.system_type}</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted text-sm mt-3"><MapPin size={14} />{s.address}, {s.city}</div>
                {isVendor && users[s.assigned_employee] && (
                  <div className="flex items-center gap-1.5 text-muted text-xs mt-1.5"><User size={13} />{users[s.assigned_employee].name}</div>
                )}
                <div className="mt-4">
                  <div className="flex justify-between text-xs mb-1.5"><span className="font-semibold text-green-700">{stageLabel(s.current_stage)}</span><span className="text-muted">{pct}%</span></div>
                  <div className="h-2 rounded-full bg-surface-2 overflow-hidden"><div className="h-full grad-bg rounded-full" style={{ width: `${pct}%` }} /></div>
                </div>
                <div className="flex items-center gap-1.5 text-green-700 font-semibold text-sm mt-4 group-hover:gap-2.5 transition-all">Open <ArrowRight size={16} /></div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

function NewSiteForm({ vendorId, onCreated }) {
  const [f, setF] = useState(BLANK)
  const [employees, setEmployees] = useState([])
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })

  useEffect(() => { listEmployees().then(setEmployees) }, [])

  async function submit(e) {
    e.preventDefault(); setErr('')
    if (!f.client_name.trim()) { setErr('Client name is required.'); return }
    setBusy(true)
    try {
      await createSite({ ...f, vendor: vendorId })
      onCreated()
    } catch (e) { setErr(e?.message || 'Could not create site.') } finally { setBusy(false) }
  }

  return (
    <form onSubmit={submit} className="card p-5 mb-5">
      <h2 className="font-display font-bold text-lg mb-3">New site</h2>
      <div className="grid sm:grid-cols-2 gap-3.5">
        <Field label="Client name" required><input className="input" value={f.client_name} onChange={set('client_name')} placeholder="e.g. Sharma ji" /></Field>
        <Field label="Mobile number" hint="Used for customer self-tracking."><input className="input" value={f.client_phone} onChange={set('client_phone')} placeholder="e.g. 98290 11111" inputMode="tel" /></Field>
        <Field label="Address"><input className="input" value={f.address} onChange={set('address')} placeholder="Plot / street" /></Field>
        <Field label="City"><input className="input" value={f.city} onChange={set('city')} /></Field>
        <Field label="Pincode"><input className="input" value={f.pincode} onChange={set('pincode')} placeholder="334001" /></Field>
        <Field label="Capacity (kW)"><input className="input" type="number" min="0" value={f.capacity_kw} onChange={set('capacity_kw')} placeholder="5" /></Field>
        <Field label="System type">
          <select className="input" value={f.system_type} onChange={set('system_type')}>
            <option value="residential">residential</option><option value="commercial">commercial</option><option value="industrial">industrial</option>
          </select>
        </Field>
        <Field label="Assign employee">
          <select className="input" value={f.assigned_employee} onChange={set('assigned_employee')}>
            <option value="">— Unassigned —</option>
            {employees.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
          </select>
        </Field>
      </div>
      {err && <p className="text-red-600 text-sm mt-3">{err}</p>}
      <div className="flex gap-2.5 mt-4">
        <button className="btn btn-primary btn-sm" disabled={busy}>{busy ? <Spinner /> : <Save size={16} />}Create site</button>
        <button type="button" className="btn btn-ghost btn-sm" onClick={onCreated}>Cancel</button>
      </div>
    </form>
  )
}
