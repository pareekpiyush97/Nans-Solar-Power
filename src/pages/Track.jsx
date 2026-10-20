import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, MapPin, Zap, CheckCircle2, Circle, Clock, LifeBuoy } from 'lucide-react'
import { Field, Spinner } from '../components/ui/Field.jsx'
import { getSitesByPhone, listSitePhotos } from '../lib/api.js'
import { STAGES, stageLabel, stageIndex } from '../lib/stages.js'
import { PageHero } from './Reviews.jsx'

const TYPE = { residential: 'badge-green', commercial: 'badge-sky', industrial: 'badge-amber' }

// Public, no-login customer tracking: a client enters the mobile number they
// booked with and sees their site's live stage progress (read-only) — the same
// stages the vendor/employee team updates in the portal. Complaints live on /support.
export default function Track() {
  const [phone, setPhone] = useState('')
  const [busy, setBusy] = useState(false)
  const [results, setResults] = useState(null) // null = not searched yet, [] = none
  const [err, setErr] = useState('')

  async function submit(e) {
    e.preventDefault(); setErr('')
    if (phone.replace(/\D/g, '').length < 10) { setErr('Please enter your registered 10-digit mobile number.'); return }
    setBusy(true)
    try {
      const sites = await getSitesByPhone(phone)
      const withPhotos = await Promise.all(sites.map(async (s) => ({ site: s, photos: await listSitePhotos(s.id) })))
      setResults(withPhotos)
    } catch (e) { setErr(e?.message || 'Something went wrong.') } finally { setBusy(false) }
  }

  return (
    <>
      <PageHero eyebrow="Track Installation" title="Track your solar installation" sub="Enter your registered mobile number to see your project's live, stage-by-stage progress — no login needed." />
      <section className="section-y pt-0">
        <div className="wrap max-w-3xl">
          <form onSubmit={submit} className="card p-6">
            <Field label="Registered mobile number" required hint="The number you gave us at the time of booking.">
              <input className="input" value={phone} onChange={(e) => { setPhone(e.target.value); setErr('') }} placeholder="e.g. 98290 11111" inputMode="tel" autoComplete="off" />
            </Field>
            {err && <p className="text-red-600 text-sm mt-2">{err}</p>}
            <button className="btn btn-primary mt-4" disabled={busy}>{busy ? <Spinner /> : <Search size={18} />}Track my installation</button>
          </form>

          {results && results.length === 0 && (
            <div className="card p-7 text-center mt-5">
              <h3 className="font-display font-bold text-lg">No installation found</h3>
              <p className="text-muted mt-2">We couldn't find a project for that number. Please check the number, or raise a request and our team will help.</p>
              <div className="mt-5"><Link to="/support" className="btn btn-ghost"><LifeBuoy size={18} />Raise a complaint</Link></div>
            </div>
          )}

          {results && results.map(({ site, photos }) => <SiteProgress key={site.id} site={site} photos={photos} />)}
        </div>
      </section>
    </>
  )
}

function SiteProgress({ site, photos }) {
  const byStage = {}; photos.forEach((p) => { byStage[p.stage] = p })
  const curIdx = stageIndex(site.current_stage)
  const completed = site.status === 'completed'
  const pct = Math.round((curIdx / (STAGES.length - 1)) * 100)

  return (
    <div className="mt-6">
      <div className="card p-6">
        <div className="flex flex-wrap items-center gap-2.5">
          <h2 className="text-xl font-extrabold">{site.client_name}</h2>
          <span className={`badge ${TYPE[site.system_type] || 'badge-gray'}`}>{site.system_type}</span>
          <span className={`badge ${completed ? 'badge-green' : 'badge-sky'}`}>{completed ? 'Completed' : 'In progress'}</span>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-muted text-sm mt-2.5">
          <span className="flex items-center gap-1.5"><MapPin size={15} />{site.address}, {site.city} {site.pincode}</span>
          <span className="flex items-center gap-1.5"><Zap size={15} />{site.capacity_kw} kW · {site.system_type}</span>
        </div>
        <div className="mt-5">
          <div className="flex justify-between text-sm mb-1.5">
            <span className="font-semibold text-green-700">{completed ? 'Commissioned & handed over' : `Current: ${stageLabel(site.current_stage)}`}</span>
            <span className="text-muted">{pct}%</span>
          </div>
          <div className="h-2.5 rounded-full bg-surface-2 overflow-hidden"><div className="h-full grad-bg rounded-full transition-all" style={{ width: `${pct}%` }} /></div>
        </div>
      </div>

      <div className="card p-6 mt-5">
        <h3 className="font-display font-bold text-lg mb-4">Installation stages</h3>
        <ol className="flex flex-col gap-3">
          {STAGES.map((st, i) => {
            const ph = byStage[st.key]
            const done = i < curIdx || (i === curIdx && completed)
            const current = st.key === site.current_stage && !completed
            return (
              <li key={st.key} className={`rounded-xl border p-3.5 flex gap-3.5 ${current ? 'border-green bg-green-50/40' : 'border-border'}`}>
                <div className="shrink-0 mt-0.5">
                  {done || ph ? <CheckCircle2 size={20} className="text-green" /> : current ? <Clock size={20} className="text-sky-600" /> : <Circle size={20} className="text-border-strong" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold">{st.label}</span>
                    {done && <span className="badge badge-green">done</span>}
                    {current && !done && <span className="badge badge-sky">in progress</span>}
                  </div>
                  {ph && ph.note ? (
                    <p className="text-fg-soft text-sm mt-1">{ph.note} <span className="text-muted text-xs">· {new Date(ph.created).toLocaleDateString()}</span></p>
                  ) : <p className="text-muted text-sm mt-1">{current ? 'Work in progress.' : done ? 'Completed.' : 'Pending.'}</p>}
                </div>
              </li>
            )
          })}
        </ol>
        <div className="mt-5 rounded-xl grad-soft p-4 flex flex-wrap items-center justify-between gap-3">
          <span className="text-sm font-semibold text-fg-soft">Facing an issue with your system?</span>
          <Link to="/support" className="btn btn-ghost btn-sm"><LifeBuoy size={16} />Raise / track a complaint</Link>
        </div>
      </div>
    </div>
  )
}
