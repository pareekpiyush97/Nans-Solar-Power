import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Building2, CheckCircle2, ShieldCheck, LifeBuoy, Bell, ArrowRight, Star } from 'lucide-react'
import {
  listAllSites, listPendingReviews, listPendingStories, listComplaints, listNotifications,
} from '../../lib/api.js'
import { useAuth } from '../../context/AuthContext.jsx'

export default function VendorOverview() {
  const { user } = useAuth()
  const [d, setD] = useState(null)

  useEffect(() => {
    (async () => {
      const [sites, prev, pstories, complaints, notifs] = await Promise.all([
        listAllSites(), listPendingReviews(), listPendingStories(), listComplaints(), listNotifications(user.id),
      ])
      setD({ sites, prev, pstories, complaints, notifs })
    })()
  }, [user])

  if (!d) return <p className="text-muted">Loading…</p>
  const active = d.sites.filter((s) => s.status !== 'completed').length
  const done = d.sites.filter((s) => s.status === 'completed').length
  const openComplaints = d.complaints.filter((c) => c.status === 'open' || c.status === 'in_progress').length
  const pendingMod = d.prev.length + d.pstories.length
  const unread = d.notifs.filter((n) => !n.read).length

  const stats = [
    { icon: Building2, label: 'Active sites', value: active, to: '/portal/sites', c: 'text-green-600 bg-green-50' },
    { icon: CheckCircle2, label: 'Completed', value: done, to: '/portal/sites', c: 'text-sky-600 bg-sky-50' },
    { icon: ShieldCheck, label: 'To moderate', value: pendingMod, to: '/portal/moderation', c: 'text-[#C97E06] bg-amber-50' },
    { icon: LifeBuoy, label: 'Open complaints', value: openComplaints, to: '/portal/complaints', c: 'text-red-600 bg-red-50' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-extrabold">Overview</h1>
      <p className="text-muted text-sm mt-1 mb-5">Welcome back, {user.name}.</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Link key={s.label} to={s.to} className="card p-5 hover:-translate-y-1 hover:shadow-md2 transition">
            <span className={`grid h-11 w-11 place-items-center rounded-xl ${s.c}`}><s.icon size={22} /></span>
            <div className="font-display font-extrabold text-3xl mt-3 tabular-nums">{s.value}</div>
            <div className="text-muted text-sm">{s.label}</div>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-6">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-lg flex items-center gap-2"><Bell size={20} className="text-green" />Recent notifications</h2>
            <Link to="/portal/notifications" className="link text-sm">View all</Link>
          </div>
          <ul className="flex flex-col gap-2.5">
            {d.notifs.slice(0, 5).map((n) => (
              <li key={n.id} className={`flex gap-3 rounded-xl p-3 ${n.read ? 'bg-surface-2/50' : 'bg-green-50'}`}>
                <span className={`mt-1 h-2 w-2 rounded-full shrink-0 ${n.read ? 'bg-border-strong' : 'bg-green'}`} />
                <div><p className="text-sm text-fg-soft">{n.message}</p><p className="text-xs text-muted mt-0.5">{new Date(n.created).toLocaleString()}</p></div>
              </li>
            ))}
            {d.notifs.length === 0 && <li className="text-muted text-sm">No notifications.</li>}
          </ul>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-lg flex items-center gap-2"><ShieldCheck size={20} className="text-green" />Awaiting moderation</h2>
            <Link to="/portal/moderation" className="link text-sm">Moderate</Link>
          </div>
          {pendingMod === 0 ? <p className="text-muted text-sm">Nothing pending — you’re all caught up.</p> : (
            <ul className="flex flex-col gap-2.5">
              {d.prev.map((r) => (
                <li key={r.id} className="flex items-center gap-3 rounded-xl bg-surface-2/50 p-3">
                  <Star size={16} className="text-star shrink-0" />
                  <div className="min-w-0"><p className="text-sm font-semibold truncate">{r.author_name} · {r.rating}★</p><p className="text-xs text-muted truncate">{r.text}</p></div>
                </li>
              ))}
              {d.pstories.map((s) => (
                <li key={s.id} className="flex items-center gap-3 rounded-xl bg-surface-2/50 p-3">
                  <span className="badge badge-sky shrink-0">story</span>
                  <p className="text-sm truncate">{s.name} — {s.story}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
