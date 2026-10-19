import { Link } from 'react-router-dom'
import { MapPin, Phone, Clock, Facebook, Instagram, Globe } from 'lucide-react'

const LOGO = import.meta.env.BASE_URL + 'logo.png'

export default function Footer() {
  return (
    <footer className="bg-[#0C1812] text-[#B9C8C0] pt-14 md:pt-[72px]">
      <div className="wrap">
        <div className="grid gap-9 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1.2fr]">
          <div>
            <span className="inline-flex bg-white rounded-xl px-3.5 py-2.5"><img src={LOGO} alt="NAN'S SOLAR POWER" className="h-11 w-auto" /></span>
            <p className="mt-4 max-w-[34ch] text-sm text-[#9DB0A7]">Authorized dealer of genuine Adani Solar Modules. Clean Energy Today, Sustainable Tomorrow.</p>
            <div className="flex gap-2.5 mt-4">
              {[Facebook, Instagram, Globe].map((Icon, i) => (
                <a key={i} href="#" className="grid place-items-center h-10 w-10 rounded-xl bg-white/5 text-[#C9D8D0] hover:bg-green hover:text-white transition" aria-label="social"><Icon size={19} /></a>
              ))}
            </div>
          </div>
          <FooterCol title="Company" items={[['About', '/'], ['Reviews', '/reviews'], ['Client Stories', '/stories'], ['Support', '/support']]} />
          <FooterCol title="Solutions" items={[['Residential', '/'], ['Commercial', '/'], ['Industrial', '/'], ['Installation', '/']]} />
          <div>
            <h4 className="font-display text-xs tracking-[0.14em] uppercase text-[#7E938A] mb-4">Contact</h4>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li className="flex items-center gap-2.5"><MapPin size={16} className="text-green" />Bikaner, Rajasthan</li>
              <li className="flex items-center gap-2.5"><Phone size={16} className="text-green" />98752 17664</li>
              <li className="flex items-center gap-2.5"><Clock size={16} className="text-green" />Mon–Sat, 9am–7pm</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-white/10 py-5 text-center text-xs text-[#7E938A]">
          © 2026 NAN'S SOLAR POWER, Bikaner · Authorized Adani Solar Dealer · Clean Energy • Green Planet • Brighter Tomorrow
        </div>
      </div>
    </footer>
  )
}

function FooterCol({ title, items }) {
  return (
    <div>
      <h4 className="font-display text-xs tracking-[0.14em] uppercase text-[#7E938A] mb-4">{title}</h4>
      <ul className="flex flex-col gap-2.5 text-sm">
        {items.map(([label, to], i) => (
          <li key={i}><Link to={to} className="hover:text-green transition">{label}</Link></li>
        ))}
      </ul>
    </div>
  )
}
