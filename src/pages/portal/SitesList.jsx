import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Building2, MapPin, ArrowRight, User } from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import { listAllSites, listSitesForEmployee, getUsersMap } from '../../lib/api.js'
import { STAGES, stageLabel, stageIndex } from '../../lib/stages.js'

const TYPE = { residential: 'badge-green', commercial: 'badge-sky', industrial: 'badge-amber' }

export default function SitesList() {
  const { user } = useAuth()
  const isVendor = user.role === 'vendor'
  const [sites, setSites] = useState([])
  const [users, setUsers] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let on = true
    ;(async () => {
      const s = isVendor ? await listAllSites() : await listSitesForEmployee(user.id)
      const u = await getUsersMap()
      if (on) { setSites(s); setUsers(u); setLoading(false) }
    })()
    return () => { on = false }
  }, [user, isVendor])

  return (
    <div>
      <div className="flex items-end justify-between gap-4 mb-5">
        <div>
          <h1 className="text-2xl font-extrabold">{isVendor ? 'All sites' : 'My sites'}</h1>
          <p className="text-muted text-sm mt-1">{isVendor ? 'Every installation across your team.' : 'Installations assigned to you.'}</p>
        </div>
        <span className="badge badge-gray">{sites.length} site{sites.length !== 1 ? 's' : ''}</span>
      </div>

      {loading ? <p className="text-muted">Loading…</p> : sites.length === 0 ? (
        <div className="card p-10 text-center text-muted">No sites yet.</div>
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
