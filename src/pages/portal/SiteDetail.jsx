import { useEffect, useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  ArrowLeft, MapPin, Phone, Zap, User, Camera, CheckCircle2, Circle, Clock,
  Save, Pencil, Plus, ImageOff,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import { Field, Spinner } from '../../components/ui/Field.jsx'
import {
  getSite, listSitePhotos, getUsersMap, listEmployees,
  updateStageProgress, updateSite, photoSrc,
} from '../../lib/api.js'
import { STAGES, stageLabel, stageIndex } from '../../lib/stages.js'

const TYPE = { residential: 'badge-green', commercial: 'badge-sky', industrial: 'badge-amber' }

export default function SiteDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const isVendor = user.role === 'vendor'
  const [site, setSite] = useState(null)
  const [photos, setPhotos] = useState([])
  const [users, setUsers] = useState({})
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null) // stage key currently being edited

  async function reload() {
    const [s, p, um] = await Promise.all([getSite(id), listSitePhotos(id), getUsersMap()])
    setSite(s); setPhotos(p); setUsers(um); setLoading(false)
  }
  useEffect(() => { reload() }, [id])

  const photoByStage = useMemo(() => {
    const m = {}; photos.forEach((p) => { m[p.stage] = p }); return m
  }, [photos])

  if (loading) return <p className="text-muted">Loading…</p>
  if (!site) return <div className="card p-8 text-center">Site not found. <Link to="/portal/sites" className="link">Back to sites</Link></div>
  if (!isVendor && site.assigned_employee !== user.id)
    return <div className="card p-8 text-center">This site isn’t assigned to you. <Link to="/portal/sites" className="link">Back to my sites</Link></div>

  const canEdit = isVendor || site.assigned_employee === user.id
  const curIdx = stageIndex(site.current_stage)
  const pct = Math.round((curIdx / (STAGES.length - 1)) * 100)

  return (
    <div>
      <Link to="/portal/sites" className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-green-700 mb-4"><ArrowLeft size={16} />Back to sites</Link>

      {/* header */}
      <div className="card p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl font-extrabold">{site.client_name}</h1>
              <span className={`badge ${TYPE[site.system_type]}`}>{site.system_type}</span>
              <span className={`badge ${site.status === 'completed' ? 'badge-green' : 'badge-sky'}`}>{site.status}</span>
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-muted text-sm mt-2.5">
              <span className="flex items-center gap-1.5"><MapPin size={15} />{site.address}, {site.city} {site.pincode}</span>
              <span className="flex items-center gap-1.5"><Phone size={15} />{site.client_phone}</span>
              <span className="flex items-center gap-1.5"><Zap size={15} />{site.capacity_kw} kW</span>
              {users[site.assigned_employee] && <span className="flex items-center gap-1.5"><User size={15} />{users[site.assigned_employee].name}</span>}
            </div>
          </div>
          {isVendor && <VendorEdit site={site} onSaved={reload} />}
        </div>
        <div className="mt-5">
          <div className="flex justify-between text-sm mb-1.5"><span className="font-semibold text-green-700">Current: {stageLabel(site.current_stage)}</span><span className="text-muted">{pct}%</span></div>
          <div className="h-2.5 rounded-full bg-surface-2 overflow-hidden"><div className="h-full grad-bg rounded-full transition-all" style={{ width: `${pct}%` }} /></div>
        </div>
      </div>

      {/* stage timeline with inline proof + edit */}
      <div className="card p-6 mt-6">
        <div className="flex items-center justify-between gap-3 mb-4">
          <h2 className="font-display font-bold text-lg">Stage timeline</h2>
          {canEdit && <span className="text-xs text-muted">Tap <span className="font-semibold text-green-700">Add proof / Edit</span> on any stage</span>}
        </div>
        <ol className="flex flex-col gap-3">
          {STAGES.map((st, i) => {
            const ph = photoByStage[st.key]
            const done = i < curIdx || (i === curIdx && site.status === 'completed')
            const current = st.key === site.current_stage && !done
            const isEditing = editing === st.key
            return (
              <li key={st.key} className={`rounded-xl border p-3.5 ${current ? 'border-green bg-green-50/40' : 'border-border'}`}>
                <div className="flex gap-3.5">
                  <div className="shrink-0 mt-0.5">
                    {ph ? <CheckCircle2 size={20} className="text-green" /> : current ? <Clock size={20} className="text-sky-600" /> : <Circle size={20} className="text-border-strong" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold">{st.label} <span className="font-normal text-muted text-xs">· {st.owner}</span></span>
                      <div className="flex items-center gap-2 shrink-0">
                        {done && <span className="badge badge-green">done</span>}
                        {current && !done && <span className="badge badge-sky">current</span>}
                        {canEdit && (
                          <button type="button" onClick={() => setEditing(isEditing ? null : st.key)} className="text-xs font-semibold text-green-700 inline-flex items-center gap-1 hover:underline">
                            {ph ? <><Pencil size={13} />Edit</> : <><Plus size={13} />Add proof</>}
                          </button>
                        )}
                      </div>
                    </div>
                    {ph ? (
                      <div className="mt-2 flex gap-3">
                        <StageThumb rec={ph} />
                        <div className="text-sm min-w-0">
                          {ph.note && <p className="text-fg-soft">{ph.note}</p>}
                          <p className="text-muted text-xs mt-1 flex items-center gap-1"><MapPin size={12} />{ph.address}</p>
                          <p className="text-muted text-xs">{new Date(ph.created).toLocaleDateString()} · {users[ph.uploaded_by]?.name || 'team'}</p>
                        </div>
                      </div>
                    ) : <p className="text-muted text-sm mt-1">Not updated yet.</p>}
                  </div>
                </div>
                {canEdit && isEditing && (
                  <StageEditor site={site} stage={st.key} existing={ph} employee={user}
                    onSaved={async () => { setEditing(null); await reload() }} onCancel={() => setEditing(null)} />
                )}
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}

function StageThumb({ rec }) {
  const src = photoSrc(rec)
  if (!src) return <span className="shrink-0 grid place-items-center h-16 w-16 rounded-lg bg-surface-2 text-muted-2"><ImageOff size={18} /></span>
  return <img src={src} alt="" className="shrink-0 h-16 w-16 rounded-lg object-cover border border-border" />
}

// Inline per-stage editor: add/replace the proof photo, edit the note & address,
// and optionally mark the stage complete. Mirrors updateStageProgress().
function StageEditor({ site, stage, existing, employee, onSaved, onCancel }) {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState('')
  const [address, setAddress] = useState(existing?.address || `${site.address}, ${site.city}`)
  const [note, setNote] = useState(existing?.note || '')
  const [completed, setCompleted] = useState(false)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  function pickFile(e) {
    const f = e.target.files?.[0]
    setFile(f || null)
    setPreview(f ? URL.createObjectURL(f) : '')
  }

  async function submit(e) {
    e.preventDefault(); setErr('')
    if (!address.trim()) { setErr('Address is required.'); return }
    if (!file && !existing) { setErr('A proof photo is required for this stage.'); return }
    setBusy(true)
    try {
      await updateStageProgress({ site, stage, file, address: address.trim(), note, employee, completed })
      await onSaved()
    } catch (e) { setErr(e?.message || 'Could not save.') } finally { setBusy(false) }
  }

  return (
    <form onSubmit={submit} className="mt-3 rounded-xl bg-surface-2 p-3.5 flex flex-col gap-3">
      <div>
        <span className="label text-xs">Proof photo{!existing && <span className="text-green"> *</span>}</span>
        <label className="flex flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-border-strong bg-surface px-4 py-5 cursor-pointer hover:border-green transition text-center">
          {preview ? <img src={preview} alt="preview" className="h-24 rounded-lg object-cover" />
            : existing && !file ? <span className="text-xs text-muted">Current photo kept — tap to replace</span>
            : <><Camera size={20} className="text-muted-2" /><span className="text-xs font-semibold text-fg-soft">Tap to add proof photo</span><span className="text-[11px] text-muted">JPG/PNG from site</span></>}
          <input type="file" accept="image/*" capture="environment" className="hidden" onChange={pickFile} />
        </label>
      </div>
      <Field label="Address" required><input className="input" value={address} onChange={(e) => setAddress(e.target.value)} /></Field>
      <Field label="Note"><textarea className="input min-h-[64px]" value={note} onChange={(e) => setNote(e.target.value)} placeholder="What was done at this stage?" /></Field>
      <label className="flex items-center gap-2 text-sm font-semibold text-fg-soft cursor-pointer">
        <input type="checkbox" checked={completed} onChange={(e) => setCompleted(e.target.checked)} className="h-4 w-4 accent-green" />
        Mark this stage complete{completed && ' (notifies vendor)'}
      </label>
      {err && <p className="text-red-600 text-sm">{err}</p>}
      <div className="flex gap-2">
        <button className="btn btn-primary btn-sm" disabled={busy}>{busy ? <Spinner /> : <Save size={15} />}Save proof</button>
        <button type="button" className="btn btn-ghost btn-sm" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  )
}

function VendorEdit({ site, onSaved }) {
  const [open, setOpen] = useState(false)
  const [employees, setEmployees] = useState([])
  const [f, setF] = useState(site)
  const [busy, setBusy] = useState(false)
  useEffect(() => { if (open) listEmployees().then(setEmployees) }, [open])
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })

  async function save(e) {
    e.preventDefault(); setBusy(true)
    await updateSite(site.id, {
      client_name: f.client_name, address: f.address, city: f.city, pincode: f.pincode,
      client_phone: f.client_phone, capacity_kw: Number(f.capacity_kw),
      system_type: f.system_type, status: f.status, assigned_employee: f.assigned_employee,
    })
    setBusy(false); setOpen(false); onSaved()
  }

  if (!open) return <button onClick={() => setOpen(true)} className="btn btn-ghost btn-sm"><Pencil size={16} />Correct details</button>

  return (
    <form onSubmit={save} className="w-full mt-2 rounded-xl bg-surface-2 p-4 grid sm:grid-cols-2 gap-3">
      <Field label="Client name"><input className="input" value={f.client_name} onChange={set('client_name')} /></Field>
      <Field label="Phone"><input className="input" value={f.client_phone} onChange={set('client_phone')} /></Field>
      <Field label="Address"><input className="input" value={f.address} onChange={set('address')} /></Field>
      <Field label="City"><input className="input" value={f.city} onChange={set('city')} /></Field>
      <Field label="Capacity (kW)"><input className="input" type="number" value={f.capacity_kw} onChange={set('capacity_kw')} /></Field>
      <Field label="Type">
        <select className="input" value={f.system_type} onChange={set('system_type')}>
          <option value="residential">residential</option><option value="commercial">commercial</option><option value="industrial">industrial</option>
        </select>
      </Field>
      <Field label="Assigned employee">
        <select className="input" value={f.assigned_employee} onChange={set('assigned_employee')}>
          {employees.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
        </select>
      </Field>
      <Field label="Status">
        <select className="input" value={f.status} onChange={set('status')}>
          <option value="active">active</option><option value="on_hold">on_hold</option><option value="completed">completed</option>
        </select>
      </Field>
      <div className="sm:col-span-2 flex gap-2.5">
        <button className="btn btn-primary btn-sm" disabled={busy}>{busy ? <Spinner /> : <Save size={16} />}Save corrections</button>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => setOpen(false)}>Cancel</button>
      </div>
    </form>
  )
}
