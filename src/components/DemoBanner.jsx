import { useState } from 'react'
import { Info, X } from 'lucide-react'
import { isLive } from '../lib/pb.js'

export default function DemoBanner() {
  const [open, setOpen] = useState(true)
  if (isLive || !open) return null
  return (
    <div className="bg-amber-50 text-[#8a5a04] text-sm">
      <div className="wrap flex items-center gap-3 py-2">
        <Info size={16} className="shrink-0" />
        <p className="flex-1">
          <b>Demo mode.</b> Running on sample data in your browser — submissions and logins are local only.
          Set <code className="rounded bg-white/60 px-1">VITE_POCKETBASE_URL</code> to connect your Pocketbase server.
        </p>
        <button onClick={() => setOpen(false)} aria-label="Dismiss" className="shrink-0 opacity-70 hover:opacity-100"><X size={16} /></button>
      </div>
    </div>
  )
}
