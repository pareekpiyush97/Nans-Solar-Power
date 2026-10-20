// LocalStorage-backed demo backend. Mirrors the Pocketbase collections in SPEC.md
// so the whole app is usable without a server. Replaced by real Pocketbase when
// VITE_POCKETBASE_URL is set (see src/lib/api.js).

const LS_KEY = 'nsp_demo_v3'
const uid = (p = 'id') => p + Math.random().toString(36).slice(2, 10)
const now = () => new Date().toISOString()

function seed() {
  const vendorId = 'u_vendor', emp1 = 'u_emp1', emp2 = 'u_emp2'
  const users = [
    { id: vendorId, name: 'Nandlal (Owner)', email: 'vendor@nansolar.in', role: 'vendor', avatar: '', active: true },
    { id: emp1, name: 'Ramesh Kumar', email: 'ramesh@nansolar.in', role: 'employee', avatar: '', active: true, vendor: vendorId },
    { id: emp2, name: 'Suresh Jain', email: 'suresh@nansolar.in', role: 'employee', avatar: '', active: true, vendor: vendorId },
  ]
  const sites = [
    { id: 's_sharma', client_name: 'Sharma ji', address: 'Plot 14, Gangashahr Road', city: 'Bikaner', pincode: '334001', client_phone: '98290 11111', capacity_kw: 5, system_type: 'residential', current_stage: 'installation', status: 'active', assigned_employee: emp1, vendor: vendorId, created: '2026-09-20T09:00:00Z' },
    { id: 's_agro', client_name: 'Maru Agro Industries', address: 'F-22 RIICO Industrial Area', city: 'Bikaner', pincode: '334004', client_phone: '98290 22222', capacity_kw: 50, system_type: 'industrial', current_stage: 'structure', status: 'active', assigned_employee: emp1, vendor: vendorId, created: '2026-09-28T09:00:00Z' },
    { id: 's_shop', client_name: 'Agarwal Electronics', address: 'KEM Road, near Kothari Hospital', city: 'Bikaner', pincode: '334001', client_phone: '98290 33333', capacity_kw: 8, system_type: 'commercial', current_stage: 'handover', status: 'completed', assigned_employee: emp2, vendor: vendorId, created: '2026-08-10T09:00:00Z' },
  ]
  const site_photos = [
    { id: uid('ph'), site: 's_sharma', stage: 'survey', photo: '', address: 'Plot 14, Gangashahr Road, Bikaner', note: 'Rooftop measured, 5 kW feasible', uploaded_by: emp1, created: '2026-09-21T10:00:00Z' },
    { id: uid('ph'), site: 's_sharma', stage: 'structure', photo: '', address: 'Plot 14, Gangashahr Road, Bikaner', note: 'MS structure installed', uploaded_by: emp1, created: '2026-09-26T10:00:00Z' },
    { id: uid('ph'), site: 's_sharma', stage: 'installation', photo: '', address: 'Plot 14, Gangashahr Road, Bikaner', note: '10 × Adani 585 Wp panels mounted', uploaded_by: emp1, created: '2026-10-02T10:00:00Z' },
    { id: uid('ph'), site: 's_shop', stage: 'handover', photo: '', address: 'KEM Road, Bikaner', note: 'Net meter installed & commissioned', uploaded_by: emp2, created: '2026-08-30T10:00:00Z' },
  ]
  const reviews = [
    { id: uid('rv'), author_name: 'Rakesh Sharma', city: 'Bikaner', system_kw: '3 kW', rating: 5, text: 'Bijli ka bill ₹5,000 se bahut kam ho gaya. Adani panels lagwaaye, quality top class hai. Zero tension.', status: 'approved', created: '2026-09-01T10:00:00Z' },
    { id: uid('rv'), author_name: 'Priya Agarwal', city: 'Nokha', system_kw: '5 kW', rating: 5, text: 'Installation team was neat and professional. Genuine Adani modules and they handled the subsidy paperwork too.', status: 'approved', created: '2026-09-05T10:00:00Z' },
    { id: uid('rv'), author_name: 'Mahesh Kumar', city: 'Lunkaransar', system_kw: '8 kW', rating: 4, text: 'Great service and fair pricing for our shop. They kept us updated throughout the installation.', status: 'approved', created: '2026-09-10T10:00:00Z' },
    { id: uid('rv'), author_name: 'Dinesh Vyas', city: 'Bikaner', system_kw: '10 kW', rating: 5, text: 'Bahut accha kaam. Subsidy bhi mil gayi. Highly recommended.', status: 'pending', created: '2026-10-15T10:00:00Z' },
  ]
  const client_stories = [
    { id: uid('st'), name: 'Sharma Family', location: 'Gangashahr, Bikaner', story: 'We switched our 3BHK home to a 5 kW Adani rooftop system. Our summer bill dropped from ₹6,500 to under ₹700. The team handled everything — survey, subsidy and net metering.', photo: '', status: 'approved', created: '2026-09-15T10:00:00Z' },
    { id: uid('st'), name: 'Agarwal Electronics', location: 'KEM Road, Bikaner', story: 'An 8 kW commercial system on our shop roof now runs all our ACs and displays. Payback looks like under 4 years.', photo: '', status: 'approved', created: '2026-09-18T10:00:00Z' },
  ]
  const complaints = [
    { id: uid('cm'), code: 'NSP-8K2P', client_name: 'Ravi Soni', phone: '98290 44444', email: '', site: '', subject: 'Inverter showing error after rain', description: 'After yesterday’s rain the inverter shows a red light and the app shows 0 generation.', status: 'in_progress', resolution_note: '', client_response: '', client_satisfied: null, created: '2026-10-16T10:00:00Z' },
    { id: uid('cm'), code: 'NSP-3F7Q', client_name: 'Kavita Joshi', phone: '98290 55555', email: '', site: '', subject: 'Panel cleaning request', description: 'Dust storm left heavy dust on panels, generation dropped.', status: 'resolved', resolution_note: 'Team visited and cleaned all 10 panels; generation is back to normal.', client_response: '', client_satisfied: null, created: '2026-10-10T10:00:00Z' },
  ]
  const notifications = [
    { id: uid('nt'), recipient: vendorId, type: 'stage_completed', site: 's_sharma', message: 'Ramesh Kumar marked Panel Installation complete for Sharma ji', read: false, created: '2026-10-02T10:05:00Z' },
    { id: uid('nt'), recipient: vendorId, type: 'new_complaint', site: '', message: 'New complaint NSP-8K2P from Ravi Soni', read: false, created: '2026-10-16T10:01:00Z' },
    { id: uid('nt'), recipient: vendorId, type: 'new_review', site: '', message: 'New review from Dinesh Vyas awaiting approval', read: true, created: '2026-10-15T10:02:00Z' },
  ]
  return { users, sites, site_photos, site_updates: [], reviews, client_stories, complaints, notifications }
}

function load() {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* ignore */ }
  return seed()
}

let state = load()
function persist() {
  try { localStorage.setItem(LS_KEY, JSON.stringify(state)) } catch { /* ignore */ }
}

export function resetDemo() { state = seed(); persist(); return state }

export const demo = {
  uid,
  now,
  list(coll, predicate) {
    const arr = (state[coll] || []).slice()
    return predicate ? arr.filter(predicate) : arr
  },
  getOne(coll, id) { return (state[coll] || []).find((r) => r.id === id) || null },
  find(coll, predicate) { return (state[coll] || []).find(predicate) || null },
  create(coll, data) {
    const rec = { id: uid(coll.slice(0, 2) + '_'), created: now(), ...data }
    state[coll] = [rec, ...(state[coll] || [])]
    persist()
    return rec
  },
  update(coll, id, patch) {
    const arr = state[coll] || []
    const i = arr.findIndex((r) => r.id === id)
    if (i < 0) return null
    arr[i] = { ...arr[i], ...patch, updated: now() }
    persist()
    return arr[i]
  },
  remove(coll, id) {
    state[coll] = (state[coll] || []).filter((r) => r.id !== id)
    persist()
  },
}
