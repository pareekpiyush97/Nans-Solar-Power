// Single data-access layer. Uses live Pocketbase when configured, otherwise the
// local demo backend. Every function returns a Promise so callers don't care which.
import { pb, isLive, fileUrl } from './pb.js'
import { demo } from '../data/demo.js'
import { stageLabel } from './stages.js'

const genCode = () => 'NSP-' + Math.random().toString(36).slice(2, 6).toUpperCase()
export const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(r.result)
    r.onerror = reject
    r.readAsDataURL(file)
  })

// Resolve a photo record to a usable <img src>: Pocketbase file URL when live,
// stored data-URL when running on demo data.
export function photoSrc(rec) {
  if (!rec || !rec.photo) return ''
  return isLive ? fileUrl(rec, rec.photo) : rec.photo
}

/* ----------------------------- users ----------------------------- */
export async function getUsersMap() {
  const list = isLive
    ? await pb.collection('users').getFullList({ sort: 'name' })
    : demo.list('users')
  const map = {}
  list.forEach((u) => { map[u.id] = u })
  return map
}
export async function listEmployees() {
  return isLive
    ? pb.collection('users').getFullList({ filter: 'role="employee"', sort: 'name' })
    : demo.list('users', (u) => u.role === 'employee')
}

/* ----------------------------- reviews ----------------------------- */
export async function listApprovedReviews(limit = 0) {
  if (isLive) {
    const r = await pb.collection('reviews').getFullList({ filter: 'status="approved"', sort: '-created' })
    return limit ? r.slice(0, limit) : r
  }
  const r = demo.list('reviews', (x) => x.status === 'approved').sort((a, b) => b.created.localeCompare(a.created))
  return limit ? r.slice(0, limit) : r
}
export async function listPendingReviews() {
  return isLive
    ? pb.collection('reviews').getFullList({ filter: 'status="pending"', sort: '-created' })
    : demo.list('reviews', (x) => x.status === 'pending')
}
export async function submitReview(data) {
  const payload = { ...data, rating: Number(data.rating), status: 'pending' }
  return isLive ? pb.collection('reviews').create(payload) : demo.create('reviews', payload)
}
export async function moderateReview(id, status) {
  return isLive ? pb.collection('reviews').update(id, { status }) : demo.update('reviews', id, { status })
}

/* ----------------------------- stories ----------------------------- */
export async function listApprovedStories() {
  return isLive
    ? pb.collection('client_stories').getFullList({ filter: 'status="approved"', sort: '-created' })
    : demo.list('client_stories', (x) => x.status === 'approved')
}
export async function listPendingStories() {
  return isLive
    ? pb.collection('client_stories').getFullList({ filter: 'status="pending"', sort: '-created' })
    : demo.list('client_stories', (x) => x.status === 'pending')
}
export async function submitStory(data) {
  const payload = { ...data, status: 'pending' }
  return isLive ? pb.collection('client_stories').create(payload) : demo.create('client_stories', payload)
}
export async function moderateStory(id, status) {
  return isLive ? pb.collection('client_stories').update(id, { status }) : demo.update('client_stories', id, { status })
}

/* ----------------------------- complaints ----------------------------- */
export async function createComplaint(data) {
  const code = genCode()
  const payload = { ...data, code, status: 'open', resolution_note: '', client_response: '', client_satisfied: null }
  const rec = isLive ? await pb.collection('complaints').create(payload) : demo.create('complaints', payload)
  if (!isLive) {
    const vendor = demo.find('users', (u) => u.role === 'vendor')
    if (vendor) demo.create('notifications', { recipient: vendor.id, type: 'new_complaint', site: '', message: `New complaint ${code} from ${data.client_name}`, read: false })
  }
  return rec
}
export async function getComplaintByCode(code) {
  const c = (code || '').trim().toUpperCase()
  if (!c) return null
  if (isLive) return pb.collection('complaints').getFirstListItem(`code="${c}"`).catch(() => null)
  return demo.find('complaints', (x) => x.code === c)
}
export async function addComplaintResponse(id, { client_response, client_satisfied }) {
  const patch = { client_response, client_satisfied }
  return isLive ? pb.collection('complaints').update(id, patch) : demo.update('complaints', id, patch)
}
export async function listComplaints() {
  return isLive
    ? pb.collection('complaints').getFullList({ sort: '-created' })
    : demo.list('complaints').sort((a, b) => b.created.localeCompare(a.created))
}
export async function updateComplaint(id, patch) {
  return isLive ? pb.collection('complaints').update(id, patch) : demo.update('complaints', id, patch)
}

/* ----------------------------- sites ----------------------------- */
// Public customer lookup: match a site by the registered mobile number
// (normalised to the last 10 digits so spaces / +91 don't matter).
export async function getSitesByPhone(phone) {
  const norm = (x) => (x || '').replace(/\D/g, '').slice(-10)
  const q = norm(phone)
  if (q.length < 10) return []
  const all = isLive
    ? await pb.collection('sites').getFullList({ sort: '-created' })
    : demo.list('sites').sort((a, b) => b.created.localeCompare(a.created))
  return all.filter((s) => norm(s.client_phone) === q)
}
export async function listAllSites() {
  return isLive
    ? pb.collection('sites').getFullList({ sort: '-created' })
    : demo.list('sites').sort((a, b) => b.created.localeCompare(a.created))
}
export async function listSitesForEmployee(empId) {
  if (isLive) return pb.collection('sites').getFullList({ filter: `assigned_employee="${empId}"`, sort: '-created' })
  return demo.list('sites', (s) => s.assigned_employee === empId)
}
export async function getSite(id) {
  return isLive ? pb.collection('sites').getOne(id) : demo.getOne('sites', id)
}
export async function updateSite(id, patch) {
  return isLive ? pb.collection('sites').update(id, patch) : demo.update('sites', id, patch)
}
export async function createSite(data) {
  const payload = {
    client_name: data.client_name,
    client_phone: data.client_phone || '',
    address: data.address || '',
    city: data.city || 'Bikaner',
    pincode: data.pincode || '',
    capacity_kw: Number(data.capacity_kw) || 0,
    system_type: data.system_type || 'residential',
    assigned_employee: data.assigned_employee || '',
    vendor: data.vendor || '',
    current_stage: 'survey',
    status: 'active',
  }
  return isLive ? pb.collection('sites').create(payload) : demo.create('sites', payload)
}

/* --------------------- site photos (one per stage) --------------------- */
export async function listSitePhotos(siteId) {
  if (isLive) return pb.collection('site_photos').getFullList({ filter: `site="${siteId}"`, sort: 'created' })
  return demo.list('site_photos', (p) => p.site === siteId)
}
export async function listSiteUpdates(siteId) {
  if (isLive) return pb.collection('site_updates').getFullList({ filter: `site="${siteId}"`, sort: '-created' })
  return demo.list('site_updates', (u) => u.site === siteId).sort((a, b) => b.created.localeCompare(a.created))
}

// Core workflow: upsert one photo per (site, stage). A new upload replaces the
// previous photo for that stage (Pocketbase deletes the old file automatically),
// logs an update, advances the site stage, and — on completion — notifies the vendor.
export async function updateStageProgress({ site, stage, file, address, note, employee, completed }) {
  let photoRec
  if (isLive) {
    const existing = await pb.collection('site_photos').getFirstListItem(`site="${site.id}" && stage="${stage}"`).catch(() => null)
    const fd = new FormData()
    fd.append('site', site.id)
    fd.append('stage', stage)
    fd.append('address', address)
    fd.append('note', note || '')
    fd.append('uploaded_by', employee.id)
    if (file) fd.append('photo', file)
    photoRec = existing
      ? await pb.collection('site_photos').update(existing.id, fd)
      : await pb.collection('site_photos').create(fd)
    await pb.collection('site_updates').create({
      site: site.id, stage, action: completed ? 'completed' : 'updated',
      address, note: note || '', photo: photoRec.id, employee: employee.id,
    })
    // NOTE: vendor notification is created server-side by the Pocketbase hook
    // (pocketbase/pb_hooks) on site_updates create, so we don't duplicate it here.
    await pb.collection('sites').update(site.id, {
      current_stage: stage,
      ...(completed && stage === 'handover' ? { status: 'completed' } : {}),
    })
  } else {
    const photo = file ? await fileToDataUrl(file) : ''
    const existing = demo.find('site_photos', (p) => p.site === site.id && p.stage === stage)
    if (existing) {
      photoRec = demo.update('site_photos', existing.id, { address, note: note || '', uploaded_by: employee.id, ...(photo ? { photo } : {}) })
    } else {
      photoRec = demo.create('site_photos', { site: site.id, stage, photo, address, note: note || '', uploaded_by: employee.id })
    }
    demo.create('site_updates', { site: site.id, stage, action: completed ? 'completed' : 'updated', address, note: note || '', photo: photoRec.id, employee: employee.id })
    demo.update('sites', site.id, { current_stage: stage, ...(completed && stage === 'handover' ? { status: 'completed' } : {}) })
    if (completed) {
      demo.create('notifications', {
        recipient: site.vendor, type: 'stage_completed', site: site.id,
        message: `${employee.name} marked ${stageLabel(stage)} complete for ${site.client_name}`, read: false,
      })
    }
  }
  return photoRec
}

/* ----------------------------- notifications ----------------------------- */
export async function listNotifications(userId) {
  if (isLive) return pb.collection('notifications').getFullList({ filter: `recipient="${userId}"`, sort: '-created' })
  return demo.list('notifications', (n) => n.recipient === userId).sort((a, b) => b.created.localeCompare(a.created))
}
export async function markNotificationRead(id) {
  return isLive ? pb.collection('notifications').update(id, { read: true }) : demo.update('notifications', id, { read: true })
}
export async function markAllNotificationsRead(userId) {
  const list = await listNotifications(userId)
  await Promise.all(list.filter((n) => !n.read).map((n) => markNotificationRead(n.id)))
}
