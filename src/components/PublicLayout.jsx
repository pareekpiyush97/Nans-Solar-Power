import { Outlet } from 'react-router-dom'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'
import WhatsAppFab from './WhatsAppFab.jsx'
import DemoBanner from './DemoBanner.jsx'

export default function PublicLayout() {
  return (
    <>
      <DemoBanner />
      <Navbar />
      <main><Outlet /></main>
      <Footer />
      <WhatsAppFab />
    </>
  )
}
