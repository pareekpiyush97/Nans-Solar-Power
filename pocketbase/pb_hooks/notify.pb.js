/// <reference path="../pb_data/types.d.ts" />
//
// Server-side notifications + light integrity for NAN'S SOLAR POWER.
// Copy this file into your Pocketbase `pb_hooks/` folder. Written for Pocketbase v0.22+.
//
// What it does:
//  1. When an employee logs a site_update with action="completed" -> notify the site's vendor.
//  2. When a new complaint is created -> notify every vendor.
//  3. When a new (pending) review or client story is created -> notify every vendor to moderate.
//
// NOTE: the per-stage "one photo, old auto-deletes" behaviour does NOT need a hook —
// it comes from the UNIQUE index on site_photos(site, stage) plus the client updating
// the existing record's file field (Pocketbase deletes a replaced file automatically).

function vendorsIds() {
  try {
    const vendors = $app.findRecordsByFilter('users', 'role = "vendor"', '', 0, 0)
    return vendors.map((v) => v.id)
  } catch (e) {
    $app.logger().error('vendorsIds failed', 'error', String(e))
    return []
  }
}

function notify(recipientId, type, siteId, message) {
  try {
    const col = $app.findCollectionByNameOrId('notifications')
    const rec = new Record(col)
    rec.set('recipient', recipientId)
    rec.set('type', type)
    rec.set('site', siteId || '')
    rec.set('message', message)
    rec.set('read', false)
    $app.save(rec)
  } catch (e) {
    $app.logger().error('notify failed', 'error', String(e))
  }
}

// 1) Stage completed -> notify the site's vendor
onRecordAfterCreateSuccess((e) => {
  const rec = e.record
  if (rec.get('action') === 'completed') {
    try {
      const site = $app.findRecordById('sites', rec.get('site'))
      let who = 'An employee'
      try { who = $app.findRecordById('users', rec.get('employee')).get('name') } catch (_) { /* ignore */ }
      notify(site.get('vendor'), 'stage_completed', site.id, `${who} marked ${rec.get('stage')} complete for ${site.get('client_name')}`)
    } catch (err) {
      $app.logger().error('stage_completed hook failed', 'error', String(err))
    }
  }
  e.next()
}, 'site_updates')

// 2) New complaint -> notify all vendors
onRecordAfterCreateSuccess((e) => {
  const rec = e.record
  vendorsIds().forEach((id) => notify(id, 'new_complaint', '', `New complaint ${rec.get('code')} from ${rec.get('client_name')}`))
  e.next()
}, 'complaints')

// 3) New pending review -> notify all vendors to moderate
onRecordAfterCreateSuccess((e) => {
  const rec = e.record
  if (rec.get('status') === 'pending') {
    vendorsIds().forEach((id) => notify(id, 'new_review', '', `New review from ${rec.get('author_name')} awaiting approval`))
  }
  e.next()
}, 'reviews')

// 4) New pending client story -> notify all vendors to moderate
onRecordAfterCreateSuccess((e) => {
  const rec = e.record
  if (rec.get('status') === 'pending') {
    vendorsIds().forEach((id) => notify(id, 'new_story', '', `New client story from ${rec.get('name')} awaiting approval`))
  }
  e.next()
}, 'client_stories')
