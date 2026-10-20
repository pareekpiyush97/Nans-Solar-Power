import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { Menu, X, LogIn, LayoutDashboard, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'

const LOGO = import.meta.env.BASE_URL + 'logo.png'
const WA = 'https://wa.me/919875217664?text=Hi%20NAN%27S%20SOLAR%20POWER%2C%20I%20want%20a%20free%20solar%20quote'

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/reviews', label: 'Reviews' },
  { to: '/stories', label: 'Client Stories' },
  { to: '/track', label: 'Track Installation' },
  { to: '/support', label: 'Support' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { user } = useAuth()

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-lg font-semibold text-[0.92rem] transition ${
      isActive ? 'text-green-700 bg-green-50' : 'text-fg-soft hover:bg-surface-2 hover:text-green-700'
    }`

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white/85 backdrop-blur-md">
      <div className="topbar grad-bg text-white text-[0.85rem] font-semibold">
        <div className="wrap py-2 text-center">Go Solar • Save Money • Save Environment — Clean Energy Today, Sustainable Tomorrow</div>
      </div>
      <div className="wrap flex items-center gap-4 min-h-[72px] py-2.5">
        <Link to="/" className="shrink-0" aria-label="NAN'S SOLAR POWER home">
          <img src={LOGO} alt="NAN'S SOLAR POWER — Power Your Life with the Sun" className="h-11 w-auto" width="620" height="201" />
        </Link>

        <nav className="hidden lg:flex items-center gap-1 mx-auto" aria-label="Primary">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={linkClass}>{l.label}</NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2.5 shrink-0">
          {user ? (
            <Link to="/portal" className="btn btn-ghost btn-sm hidden sm:inline-flex"><LayoutDashboard size={17} />Portal</Link>
          ) : (
            <Link to="/login" className="btn btn-ghost btn-sm hidden sm:inline-flex"><LogIn size={17} />Login</Link>
          )}
          <a href={WA} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm hidden min-[560px]:inline-flex">Free Quote<ArrowRight size={17} /></a>
          <button className="lg:hidden grid place-items-center h-11 w-11 rounded-xl border border-border-strong bg-surface" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(true)}>
            <Menu size={22} />
          </button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-[60] lg:hidden" onClick={(e) => { if (e.target === e.currentTarget) setOpen(false) }}>
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute top-0 right-0 h-full w-[min(320px,86vw)] bg-surface shadow-lg2 p-5 flex flex-col gap-1.5">
            <div className="flex items-center justify-between mb-2">
              <img src={LOGO} alt="" className="h-8 w-auto" />
              <button className="grid place-items-center h-11 w-11 rounded-xl border border-border" aria-label="Close" onClick={() => setOpen(false)}><X size={20} /></button>
            </div>
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end} onClick={() => setOpen(false)}
                className="px-3.5 py-3.5 rounded-xl font-semibold text-fg-soft hover:bg-surface-2">{l.label}</NavLink>
            ))}
            <div className="mt-auto flex flex-col gap-2.5">
              <Link to={user ? '/portal' : '/login'} onClick={() => setOpen(false)} className="btn btn-ghost">
                {user ? <><LayoutDashboard size={18} />Portal</> : <><LogIn size={18} />Login</>}
              </Link>
              <a href={WA} target="_blank" rel="noopener noreferrer" className="btn btn-primary">Get a Free Quote</a>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
