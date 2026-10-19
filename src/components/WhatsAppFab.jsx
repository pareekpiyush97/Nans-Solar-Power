import { MessageCircle } from 'lucide-react'

const WA = 'https://wa.me/919875217664?text=Hi%20NAN%27S%20SOLAR%20POWER%2C%20I%20want%20a%20free%20solar%20quote'

export default function WhatsAppFab() {
  return (
    <a href={WA} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp"
      className="fixed right-5 bottom-5 z-40 inline-flex items-center gap-2.5 rounded-full bg-[#1FAF54] text-white pl-3.5 pr-4 py-3 font-display font-bold text-sm shadow-[0_12px_26px_-8px_rgba(16,120,50,.55)] hover:-translate-y-0.5 transition">
      <MessageCircle size={22} />
      <span className="leading-tight hidden min-[420px]:block">WhatsApp<small className="block font-semibold text-[0.68rem] opacity-90">98752 17664</small></span>
    </a>
  )
}
