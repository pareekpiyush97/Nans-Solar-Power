import PocketBase from 'pocketbase'

// Public config only. VITE_POCKETBASE_URL decides live vs demo mode.
export const PB_URL = (import.meta.env.VITE_POCKETBASE_URL || '').trim()
export const GOOGLE_CLIENT_ID = (import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID || '').trim()

// When no Pocketbase URL is set, the whole app runs on local demo data so it is
// fully browsable without a backend. Point VITE_POCKETBASE_URL at your server to go live.
export const isLive = Boolean(PB_URL)

export const pb = isLive ? new PocketBase(PB_URL) : null

export function fileUrl(record, filename, thumb) {
  if (!pb || !record || !filename) return ''
  try {
    return pb.files.getUrl(record, filename, thumb ? { thumb } : undefined)
  } catch {
    return ''
  }
}
