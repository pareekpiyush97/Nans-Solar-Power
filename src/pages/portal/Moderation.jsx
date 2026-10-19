import { useEffect, useState } from 'react'
import { Check, X, Star, Inbox } from 'lucide-react'
import { listPendingReviews, listPendingStories, moderateReview, moderateStory } from '../../lib/api.js'
import Stars from '../../components/ui/Stars.jsx'

export default function Moderation() {
  const [reviews, setReviews] = useState([])
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    const [r, s] = await Promise.all([listPendingReviews(), listPendingStories()])
    setReviews(r); setStories(s); setLoading(false)
  }
  useEffect(() => { load() }, [])

  async function actReview(id, status) { await moderateReview(id, status); load() }
  async function actStory(id, status) { await moderateStory(id, status); load() }

  const empty = !loading && reviews.length === 0 && stories.length === 0

  return (
    <div>
      <h1 className="text-2xl font-extrabold">Moderation</h1>
      <p className="text-muted text-sm mt-1 mb-5">Approve customer reviews and client stories before they go live.</p>

      {loading ? <p className="text-muted">Loading…</p> : empty ? (
        <div className="card p-12 text-center text-muted"><Inbox size={34} className="mx-auto mb-3 text-border-strong" />Nothing to moderate right now.</div>
      ) : (
        <div className="flex flex-col gap-6">
          {reviews.length > 0 && (
            <section>
              <h2 className="font-display font-bold mb-3">Pending reviews <span className="badge badge-amber ml-1">{reviews.length}</span></h2>
              <div className="grid md:grid-cols-2 gap-4">
                {reviews.map((r) => (
                  <div key={r.id} className="card p-5">
                    <div className="flex items-center justify-between"><Stars value={r.rating} size={16} /><span className="text-xs text-muted">{new Date(r.created).toLocaleDateString()}</span></div>
                    <blockquote className="text-fg-soft mt-2.5">“{r.text}”</blockquote>
                    <div className="text-sm font-semibold mt-2">{r.author_name} <span className="text-muted font-normal">· {r.city} · {r.system_kw}</span></div>
                    <div className="flex gap-2.5 mt-4">
                      <button onClick={() => actReview(r.id, 'approved')} className="btn btn-primary btn-sm"><Check size={16} />Approve</button>
                      <button onClick={() => actReview(r.id, 'rejected')} className="btn btn-outline btn-sm"><X size={16} />Reject</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
          {stories.length > 0 && (
            <section>
              <h2 className="font-display font-bold mb-3">Pending stories <span className="badge badge-amber ml-1">{stories.length}</span></h2>
              <div className="grid md:grid-cols-2 gap-4">
                {stories.map((s) => (
                  <div key={s.id} className="card p-5">
                    <p className="text-fg-soft">{s.story}</p>
                    <div className="text-sm font-semibold mt-2">{s.name} <span className="text-muted font-normal">· {s.location}</span></div>
                    <div className="flex gap-2.5 mt-4">
                      <button onClick={() => actStory(s.id, 'approved')} className="btn btn-primary btn-sm"><Check size={16} />Approve</button>
                      <button onClick={() => actStory(s.id, 'rejected')} className="btn btn-outline btn-sm"><X size={16} />Reject</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  )
}
