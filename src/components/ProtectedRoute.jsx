import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function ProtectedRoute({ roles, children }) {
  const { user, loading } = useAuth()
  const loc = useLocation()
  if (loading) return null
  if (!user) return <Navigate to="/login" replace state={{ from: loc.pathname }} />
  if (roles && !roles.includes(user.role)) return <Navigate to="/portal" replace />
  return children
}
