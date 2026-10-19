import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Bell, CheckCheck, Building2, LifeBuoy, Star, FileText } from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import { listNotifications, markNotificationRead, markAllNotificationsRead } from '../../lib/api.js'

const ICON = { stage_completed: Building2, new_complaint: LifeBuoy, new_review: Star, new_story: FileText }

export default function NotificationsPage() {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  async function load() { setLoading(true); setItems(await listNotifications(user.id)); setLoading(false) }
  useEffect(() => { load() }, [user])

  async function readOne(n) { if (!n.read) { await markNotificationRead(n.id); load() } }
  async function readAll() { await markAllNotificationsRead(user.id); load() }

  const unread = items.filter((n) => !n.read).length

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-5">
        <div>
          <h1 className="text-2xl font-extrabold">Notifications</h1>
          <p className="text-muted text-sm mt-1">{unread} unread</p>
        </div>
        {unread > 0 && <button onClick={readAll} className="btn btn-ghost btn-sm"><CheckCheck size={16} />Mark all read</button>}
      </div>

      {loading ? <p className="text-muted">Loading…</p> : items.length === 0 ? (
        <div className="card p-12 text-center text-muted"><Bell size={34} className="mx-auto mb-3 text-border-strong" />No notifications yet.</div>
      ) : (
        <div className="card divide-y divide-border overflow-hidden">
          {items.map((n) => {
            const Icon = ICON[n.type] || Bell
            const inner = (
              <div className={`flex gap-3.5 p-4 ${n.read ? '' : 'bg-green-50/60'}`}>
                <span className={`grid h-10 w-10 place-items-center rounded-xl shrink-0 ${n.read ? 'bg-surface-2 text-muted' : 'bg-green-50 text-green-600'}`}><Icon size={18} /></span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-fg-soft">{n.message}</p>
                  <p className="text-xs text-muted mt-0.5">{new Date(n.created).toLocaleString()}</p>
                </div>
                {!n.read && <span className="mt-1.5 h-2 w-2 rounded-full bg-green shrink-0" />}
              </div>
            )
            return n.site
              ? <Link key={n.id} to={`/portal/sites/${n.site}`} onClick={() => readOne(n)} className="block hover:bg-surface-2/40">{inner}</Link>
              : <button key={n.id} onClick={() => readOne(n)} className="block w-full text-left hover:bg-surface-2/40">{inner}</button>
          })}
        </div>
      )}
    </div>
  )
}
