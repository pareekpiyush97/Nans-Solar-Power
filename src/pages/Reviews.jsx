import { useEffect, useState } from 'react'
import { Star, Send, CheckCircle2, MessageSquareQuote } from 'lucide-react'
import Reveal from '../components/ui/Reveal.jsx'
import Stars from '../components/ui/Stars.jsx'
import { Field, Spinner } from '../components/ui/Field.jsx'
import { listApprovedReviews, submitReview } from '../lib/api.js'

export default function Reviews() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const load = () => { setLoading(true); listApprovedReviews().then((r) => { setReviews(r); setLoading(false) }) }
  useEffect(load, [])

  return (
    <>
      <PageHero eyebrow="Blog / Reviews" title="Customer reviews" sub="What real homes & businesses across Bikaner say about going solar with us." />
      <section className="section-y pt-0">
        <div className="wrap grid lg:grid-cols-[1fr_380px] gap-8 items-start">
          <div className="grid sm:grid-cols-2 gap-5">
            {loading ? <p className="text-muted">Loading…</p> : reviews.length === 0 ? (
              <p className="text-muted">No reviews yet. Be the first to share yours!</p>
            ) : reviews.map((r, i) => (
              <Reveal key={r.id} delay={(i % 4) * 0.04}>
                <div className="card p-6 h-full flex flex-col gap-3.5">
                  <Stars value={r.rating} size={18} />
                  <blockquote className="text-fg-soft leading-relaxed flex-1">“{r.text}”</blockquote>
                  <div className="flex items-center gap-3 pt-1">
                    <span className="grid h-10 w-10 place-items-center rounded-full grad-bg text-white font-display font-bold text-sm">{r.author_name.split(' ').map((x) => x[0]).slice(0, 2).join('')}</span>
                    <div><div className="font-display font-bold text-[0.95rem]">{r.author_name}</div><div className="text-muted text-[0.82rem] font-semibold">{r.city} · {r.system_kw}</div></div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <ReviewForm onDone={load} />
        </div>
      </section>
    </>
  )
}

function ReviewForm({ onDone }) {
  const [f, setF] = useState({ author_name: '', city: '', system_kw: '', rating: 5, text: '' })
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)
  const [err, setErr] = useState('')
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })

  async function submit(e) {
    e.preventDefault()
    setErr(''); setBusy(true)
    try {
      await submitReview(f)
      setDone(true); setF({ author_name: '', city: '', system_kw: '', rating: 5, text: '' }); onDone?.()
    } catch (e) { setErr(e?.message || 'Something went wrong.') } finally { setBusy(false) }
  }

  if (done) return (
    <div className="card p-7 text-center lg:sticky lg:top-24">
      <CheckCircle2 size={40} className="text-green mx-auto" />
      <h3 className="font-display font-bold text-xl mt-3">Thank you!</h3>
      <p className="text-muted mt-2 text-sm">Your review was submitted and will appear once approved by our team.</p>
      <button className="btn btn-ghost mt-5" onClick={() => setDone(false)}>Write another</button>
    </div>
  )

  return (
    <form onSubmit={submit} className="card p-6 lg:sticky lg:top-24">
      <h3 className="font-display font-bold text-lg flex items-center gap-2"><MessageSquareQuote size={20} className="text-green" />Write a review</h3>
      <p className="text-muted text-sm mt-1 mb-4">Reviews show after a quick approval.</p>
      <div className="flex flex-col gap-3.5">
        <Field label="Your name" required><input className="input" required value={f.author_name} onChange={set('author_name')} placeholder="e.g. Rakesh Sharma" /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="City"><input className="input" value={f.city} onChange={set('city')} placeholder="Bikaner" /></Field>
          <Field label="System size"><input className="input" value={f.system_kw} onChange={set('system_kw')} placeholder="5 kW" /></Field>
        </div>
        <div>
          <span className="label">Rating</span>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5].map((n) => (
              <button type="button" key={n} onClick={() => setF({ ...f, rating: n })} aria-label={`${n} stars`} className="text-star">
                <Star size={28} fill={n <= f.rating ? 'currentColor' : 'none'} className={n <= f.rating ? '' : 'text-border-strong'} />
              </button>
            ))}
          </div>
        </div>
        <Field label="Your review" required><textarea className="input min-h-[110px]" required value={f.text} onChange={set('text')} placeholder="How was your experience?" /></Field>
        {err && <p className="text-red-600 text-sm">{err}</p>}
        <button className="btn btn-primary" disabled={busy}>{busy ? <Spinner /> : <Send size={18} />}Submit review</button>
      </div>
    </form>
  )
}

export function PageHero({ eyebrow, title, sub }) {
  return (
    <section className="bg-bg-tint border-b border-border">
      <div className="wrap py-12 md:py-16 text-center flex flex-col items-center gap-3">
        <span className="eyebrow">{eyebrow}</span>
        <h1 className="text-[clamp(2rem,4vw,3rem)] font-extrabold">{title}</h1>
        {sub && <p className="text-muted text-[1.05rem] max-w-[56ch]">{sub}</p>}
      </div>
    </section>
  )
}
