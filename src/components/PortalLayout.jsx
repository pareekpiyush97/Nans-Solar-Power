import { useEffect, useState } from 'react'
import { Outlet, NavLink, Link } from 'react-router-dom'
import { LayoutDashboard, Building2, ShieldCheck, LifeBuoy, Bell, LogOut, ExternalLink } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { listNotifications } from '../lib/api.js'

const LOGO = import.meta.env.BASE_URL + 'logo.png'

export default function PortalLayout() {
  const { user, logout } = useAuth()
  const [unread, setUnread] = useState(0)
  const isVendor = user?.role === 'vendor'

  useEffect(() => {
    let on = true
    if (isVendor && user) listNotifications(user.id).then((ns) => on && setUnread(ns.filter((n) => !n.read).length))
    return () => { on = false }
  }, [isVendor, user])

  const items = isVendor
    ? [
        { to: '/portal/overview', label: 'Overview', icon: LayoutDashboard },
        { to: '/portal/sites', label: 'Sites', icon: Building2 },
        { to: '/portal/moderation', label: 'Moderation', icon: ShieldCheck },
        { to: '/portal/complaints', label: 'Complaints', icon: LifeBuoy },
        { to: '/portal/notifications', label: 'Notifications', icon: Bell, badge: unread },
      ]
    : [{ to: '/portal/sites', label: 'My Sites', icon: Building2 }]

  const itemClass = ({ isActive }) =>
    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-sm transition whitespace-nowrap ${
      isActive ? 'bg-green-50 text-green-700' : 'text-fg-soft hover:bg-surface-2'
    }`

  return (
    <div className="min-h-screen bg-bg">
      <header className="sticky top-0 z-40 border-b border-border bg-white/90 backdrop-blur-md">
        <div className="wrap flex items-center gap-4 h-16">
          <Link to="/" className="shrink-0"><img src={LOGO} alt="NAN'S SOLAR POWER" className="h-9 w-auto" /></Link>
          <span className="badge badge-green">{isVendor ? 'Vendor' : 'Employee'} portal</span>
          <div className="ml-auto flex items-center gap-3">
            <Link to="/" className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-green-700"><ExternalLink size={15} />View site</Link>
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-full grad-bg text-white font-display font-bold text-sm">{(user?.name || '?').slice(0, 1)}</span>
              <div className="hidden sm:block leading-tight">
                <div className="font-semibold text-sm">{user?.name}</div>
                <div className="text-xs text-muted">{user?.email}</div>
              </div>
            </div>
            <button onClick={logout} className="grid h-9 w-9 place-items-center rounded-xl border border-border text-muted hover:text-red-600 hover:border-red-300" aria-label="Log out"><LogOut size={17} /></button>
          </div>
        </div>
      </header>

      <div className="wrap grid md:grid-cols-[232px_1fr] gap-6 py-6">
        <aside>
          <nav className="flex md:flex-col gap-1.5 overflow-x-auto md:sticky md:top-20">
            {items.map((it) => (
              <NavLink key={it.to} to={it.to} className={itemClass}>
                <it.icon size={18} />
                <span>{it.label}</span>
                {it.badge > 0 && <span className="ml-auto badge badge-red">{it.badge}</span>}
              </NavLink>
            ))}
          </nav>
        </aside>
        <main className="min-w-0"><Outlet /></main>
      </div>
    </div>
  )
}
