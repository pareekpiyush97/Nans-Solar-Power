import { Routes, Route, Navigate, Link } from 'react-router-dom'
import { useAuth } from './context/AuthContext.jsx'
import PublicLayout from './components/PublicLayout.jsx'
import PortalLayout from './components/PortalLayout.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

import Home from './pages/Home.jsx'
import Reviews from './pages/Reviews.jsx'
import Stories from './pages/Stories.jsx'
import Support from './pages/Support.jsx'
import Track from './pages/Track.jsx'
import Login from './pages/Login.jsx'

import SitesList from './pages/portal/SitesList.jsx'
import SiteDetail from './pages/portal/SiteDetail.jsx'
import VendorOverview from './pages/portal/VendorOverview.jsx'
import Moderation from './pages/portal/Moderation.jsx'
import ComplaintsAdmin from './pages/portal/ComplaintsAdmin.jsx'
import NotificationsPage from './pages/portal/NotificationsPage.jsx'

function PortalIndex() {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (!user.role) return <PendingRole />
  return <Navigate to={user.role === 'vendor' ? '/portal/overview' : '/portal/sites'} replace />
}

function PendingRole() {
  const { logout, user } = useAuth()
  return (
    <div className="card p-8 text-center max-w-md mx-auto mt-10">
      <h2 className="text-xl font-bold">Account awaiting access</h2>
      <p className="text-muted mt-2">{user?.email} is signed in but has no role yet. Ask the vendor to assign you as an employee.</p>
      <button onClick={logout} className="btn btn-ghost mt-5">Sign out</button>
    </div>
  )
}

function NotFound() {
  return (
    <div className="wrap py-24 text-center">
      <h1 className="text-5xl font-extrabold grad-text">404</h1>
      <p className="text-muted mt-3">That page doesn’t exist.</p>
      <Link to="/" className="btn btn-primary mt-6">Back home</Link>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/stories" element={<Stories />} />
        <Route path="/support" element={<Support />} />
        <Route path="/track" element={<Track />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route path="/portal" element={<ProtectedRoute><PortalLayout /></ProtectedRoute>}>
        <Route index element={<PortalIndex />} />
        <Route path="overview" element={<ProtectedRoute roles={['vendor']}><VendorOverview /></ProtectedRoute>} />
        <Route path="sites" element={<SitesList />} />
        <Route path="sites/:id" element={<SiteDetail />} />
        <Route path="moderation" element={<ProtectedRoute roles={['vendor']}><Moderation /></ProtectedRoute>} />
        <Route path="complaints" element={<ProtectedRoute roles={['vendor']}><ComplaintsAdmin /></ProtectedRoute>} />
        <Route path="notifications" element={<ProtectedRoute roles={['vendor']}><NotificationsPage /></ProtectedRoute>} />
      </Route>
    </Routes>
  )
}
