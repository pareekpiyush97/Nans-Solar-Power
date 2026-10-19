import { createContext, useContext, useEffect, useState } from 'react'
import { pb, isLive } from '../lib/pb.js'
import { demo } from '../data/demo.js'

const AuthCtx = createContext(null)
const DEMO_KEY = 'nsp_demo_user'

function normalizePB(rec) {
  if (!rec) return null
  return {
    id: rec.id,
    name: rec.name || rec.email,
    email: rec.email,
    role: rec.role || '',
    avatar: rec.avatar ? pb.files.getUrl(rec, rec.avatar) : '',
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isLive) {
      if (pb.authStore.isValid) setUser(normalizePB(pb.authStore.record))
      const unsub = pb.authStore.onChange(() => {
        setUser(pb.authStore.isValid ? normalizePB(pb.authStore.record) : null)
      })
      setLoading(false)
      return () => unsub()
    }
    try {
      const id = localStorage.getItem(DEMO_KEY)
      if (id) { const u = demo.getOne('users', id); if (u) setUser(u) }
    } catch { /* ignore */ }
    setLoading(false)
  }, [])

  async function loginGoogle() {
    if (!isLive) throw new Error('Google sign-in needs a configured Pocketbase server (demo mode is active).')
    const res = await pb.collection('users').authWithOAuth2({ provider: 'google' })
    setUser(normalizePB(pb.authStore.record))
    return res
  }

  function loginDemo(role) {
    const u = demo.find('users', (x) => x.role === role)
    if (u) { setUser(u); try { localStorage.setItem(DEMO_KEY, u.id) } catch { /* ignore */ } }
    return u
  }

  function logout() {
    if (isLive) pb.authStore.clear()
    setUser(null)
    try { localStorage.removeItem(DEMO_KEY) } catch { /* ignore */ }
  }

  return (
    <AuthCtx.Provider value={{ user, loading, isLive, loginGoogle, loginDemo, logout }}>
      {children}
    </AuthCtx.Provider>
  )
}

export const useAuth = () => useContext(AuthCtx)
