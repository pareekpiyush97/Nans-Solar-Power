import { useState } from 'react'
import { useNavigate, useLocation, Navigate } from 'react-router-dom'
import { ShieldCheck, Briefcase, HardHat } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { Spinner } from '../components/ui/Field.jsx'

const LOGO = import.meta.env.BASE_URL + 'logo.png'

export default function Login() {
  const { user, isLive, loginGoogle, loginDemo } = useAuth()
  const nav = useNavigate()
  const loc = useLocation()
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const dest = loc.state?.from || '/portal'

  if (user) return <Navigate to={dest} replace />

  async function google() {
    setErr(''); setBusy(true)
    try { await loginGoogle(); nav(dest, { replace: true }) }
    catch (e) { setErr(e?.message || 'Sign-in failed.') } finally { setBusy(false) }
  }
  function demo(role) { loginDemo(role); nav(dest, { replace: true }) }

  return (
    <section className="min-h-[70vh] grid place-items-center py-16">
      <div className="card p-8 w-[min(440px,92vw)] text-center">
        <img src={LOGO} alt="NAN'S SOLAR POWER" className="h-12 w-auto mx-auto" />
        <h1 className="text-2xl font-extrabold mt-5">Portal sign in</h1>
        <p className="text-muted mt-1.5 text-sm">For NAN'S SOLAR POWER employees & vendor.</p>

        <button onClick={google} disabled={busy} className="btn btn-ghost w-full mt-6 justify-center">
          {busy ? <Spinner className="border-green/40 border-t-green" /> : <GoogleMark />}Sign in with Google
        </button>
        {err && <p className="text-red-600 text-sm mt-3">{err}</p>}

        {!isLive && (
          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-xs font-semibold tracking-wide uppercase text-muted-2 mb-3">Demo mode — explore the portal</p>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => demo('vendor')} className="card p-4 hover:-translate-y-0.5 hover:shadow-md2 transition text-left">
                <ShieldCheck size={22} className="text-green" /><div className="font-display font-bold mt-2">Vendor</div><div className="text-muted text-xs">Owner / admin</div>
              </button>
              <button onClick={() => demo('employee')} className="card p-4 hover:-translate-y-0.5 hover:shadow-md2 transition text-left">
                <HardHat size={22} className="text-sky-600" /><div className="font-display font-bold mt-2">Employee</div><div className="text-muted text-xs">Field updates</div>
              </button>
            </div>
            <p className="text-muted text-xs mt-3 flex items-center justify-center gap-1.5"><Briefcase size={13} />Google sign-in activates when Pocketbase is connected.</p>
          </div>
        )}
      </div>
    </section>
  )
}

function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.6 2.4 30.1 0 24 0 14.6 0 6.4 5.4 2.5 13.3l7.9 6.1C12.3 13.2 17.6 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.1 24.6c0-1.6-.1-3.1-.4-4.6H24v9.1h12.4c-.5 2.9-2.1 5.3-4.6 6.9l7.1 5.5c4.2-3.9 6.6-9.6 6.6-16.9z" />
      <path fill="#FBBC05" d="M10.4 28.6c-.5-1.4-.8-2.9-.8-4.6s.3-3.2.8-4.6l-7.9-6.1C.9 16.5 0 20.1 0 24s.9 7.5 2.5 10.7l7.9-6.1z" />
      <path fill="#34A853" d="M24 48c6.1 0 11.3-2 15-5.5l-7.1-5.5c-2 1.3-4.6 2.1-7.9 2.1-6.4 0-11.7-3.7-13.6-9.9l-7.9 6.1C6.4 42.6 14.6 48 24 48z" />
    </svg>
  )
}
