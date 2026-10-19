import { useEffect, useState } from 'react'
import { Send, CheckCircle2, Quote } from 'lucide-react'
import Reveal from '../components/ui/Reveal.jsx'
import { Field, Spinner } from '../components/ui/Field.jsx'
import { listApprovedStories, submitStory, photoSrc } from '../lib/api.js'
import { PageHero } from './Reviews.jsx'

export default function Stories() {
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)
  const load = () => { setLoading(true); listApprovedStories().then((s) => { setStories(s); setLoading(false) }) }
  useEffect(load, [])

  return (
    <>
      <PageHero eyebrow="Feedback" title="Client stories" sub="Longer stories from families and businesses who made the switch to solar." />
      <section className="section-y pt-0">
        <div className="wrap grid lg:grid-cols-[1fr_380px] gap-8 items-start">
          <div className="flex flex-col gap-5">
            {loading ? <p className="text-muted">Loading…</p> : stories.length === 0 ? (
              <p className="text-muted">No stories yet.</p>
            ) : stories.map((s, i) => (
              <Reveal key={s.id} delay={(i % 3) * 0.04}>
                <article className="card p-7">
                  <Quote size={26} className="text-green-600" />
                  <p className="text-fg-soft text-[1.05rem] leading-relaxed mt-3">{s.story}</p>
                  {photoSrc(s) && <img src={photoSrc(s)} alt="" className="rounded-xl mt-4 max-h-64 object-cover w-full" />}
                  <div className="mt-4 font-display font-bold">{s.name}<span className="text-muted font-semibold font-body"> · {s.location}</span></div>
                </article>
              </Reveal>
            ))}
          </div>
          <StoryForm onDone={load} />
        </div>
      </section>
    </>
  )
}

function StoryForm({ onDone }) {
  const [f, setF] = useState({ name: '', location: '', story: '' })
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)
  const [err, setErr] = useState('')
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })

  async function submit(e) {
    e.preventDefault(); setErr(''); setBusy(true)
    try { await submitStory(f); setDone(true); setF({ name: '', location: '', story: '' }); onDone?.() }
    catch (e) { setErr(e?.message || 'Something went wrong.') } finally { setBusy(false) }
  }

  if (done) return (
    <div className="card p-7 text-center lg:sticky lg:top-24">
      <CheckCircle2 size={40} className="text-green mx-auto" />
      <h3 className="font-display font-bold text-xl mt-3">Thank you!</h3>
      <p className="text-muted mt-2 text-sm">Your story was submitted and will appear once approved.</p>
      <button className="btn btn-ghost mt-5" onClick={() => setDone(false)}>Share another</button>
    </div>
  )

  return (
    <form onSubmit={submit} className="card p-6 lg:sticky lg:top-24">
      <h3 className="font-display font-bold text-lg">Share your story</h3>
      <p className="text-muted text-sm mt-1 mb-4">Tell others about your switch to solar.</p>
      <div className="flex flex-col gap-3.5">
        <Field label="Name" required><input className="input" required value={f.name} onChange={set('name')} placeholder="Your name / business" /></Field>
        <Field label="Location"><input className="input" value={f.location} onChange={set('location')} placeholder="Area, Bikaner" /></Field>
        <Field label="Your story" required><textarea className="input min-h-[140px]" required value={f.story} onChange={set('story')} placeholder="What changed after going solar?" /></Field>
        {err && <p className="text-red-600 text-sm">{err}</p>}
        <button className="btn btn-primary" disabled={busy}>{busy ? <Spinner /> : <Send size={18} />}Submit story</button>
      </div>
    </form>
  )
}
