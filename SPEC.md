# NAN'S SOLAR POWER — Website + Vendor/Employee Portal · Spec

Light-themed web app for a solar firm: a public marketing site plus a private portal
where employees log site progress and the vendor reviews/corrects it.

- **Frontend:** React (Vite) static SPA, Tailwind CSS, light theme throughout (Clean Eco SaaS tokens).
- **Backend:** Pocketbase (on a VPS) — database, Google OAuth, file storage, API rules, hooks.
- **Hosting:** GitHub Pages (frontend) + Pocketbase server (data/files). Repo stays code-only.
- **Auth:** Google Sign-In (OAuth). Client ID is public; client secret + admin keys live only on Pocketbase.

---

## 1. Roles & access

| Role | Can do |
|---|---|
| **Public visitor** | Browse site; submit a review / client story (pending approval); register a complaint; track a complaint by code. |
| **Employee** | Log in (Google). Update assigned sites: upload a **stage photo + address** (both mandatory), add notes, mark a stage complete → notifies the vendor. Sees only their assigned sites. |
| **Vendor** | Log in (Google). Full view of all sites; **correct** any employee data; approve/reject reviews & stories; resolve complaints; receive in-app notifications. |

Access is enforced by **Pocketbase API rules** (below), not just the UI.

---

## 2. Pages & screens

**Public (light theme):**
- **Home** — firm details, hero, how-it-works, benefits, stats, about, Adani product + manufacturer/safety, solutions, footer. *(already designed)*
- **Reviews** (Blog/Review) — approved customer reviews grid + "Write a review" form (→ pending).
- **Client Stories** (Feedback) — approved longer stories with photos.
- **Support** — register a complaint (form) + "Track my complaint" by code; shows status and lets the client post a response once resolved.

**Portal (after Google login, role-gated):**
- **Login** — "Sign in with Google".
- **Employee dashboard** — my assigned sites, per-site stage checklist, **stage update form** (photo + address required), activity/timeline.
- **Vendor dashboard** — all sites + filters, **notifications** (bell + unread), correct any record, **moderation queue** (reviews/stories), **complaints** board.

---

## 3. Data model (Pocketbase collections)

> Types use Pocketbase field types. `rel→X` = relation to collection X. Enums are `select`.

### users  *(auth collection, extended)*
```json
{
  "email": "string (from Google)",
  "name": "string",
  "avatar": "url (Google)",
  "role": "select: vendor | employee",
  "active": "bool (default true)",
  "vendor": "rel→users (the vendor an employee reports to, optional)",
  "phone": "string (optional)"
}
```

### sites  *(each customer installation project)*
```json
{
  "client_name": "string          // e.g. 'Sharma ji'",
  "address": "text (required)",
  "city": "string",
  "pincode": "string",
  "client_phone": "string",
  "capacity_kw": "number",
  "system_type": "select: residential | commercial | industrial",
  "current_stage": "select (see stages below)",
  "status": "select: active | on_hold | completed",
  "assigned_employee": "rel→users",
  "vendor": "rel→users"
}
```

### site_photos  *(ONE photo per stage per site — this is where auto-delete happens)*
```json
{
  "site": "rel→sites (required)",
  "stage": "select: survey | structure | panel | wiring | earthing | net_meter | commissioned (required)",
  "photo": "file (single, required)",
  "address": "text (required — address captured at upload)",
  "note": "text (optional)",
  "uploaded_by": "rel→users",
  "_unique": "UNIQUE INDEX (site, stage)"
}
```
**Auto-delete logic:** the `UNIQUE (site, stage)` index means there is at most one row per stage.
When an employee uploads a new photo for a stage that already exists, the app **updates that
row's `photo` field** — Pocketbase **deletes the old file automatically** when a file field is
replaced. Result: Structure photo stays until re-shot; uploading the **Panel** photo only replaces
the old **Panel** photo. A different stage = a new row = the timeline is preserved.

### site_updates  *(activity log + what triggers a notification; no files, kept as history)*
```json
{
  "site": "rel→sites",
  "stage": "select (same enum)",
  "action": "select: updated | completed",
  "address": "text (required)",
  "photo": "rel→site_photos",
  "note": "text",
  "employee": "rel→users"
}
```

### reviews  *(customer reviews — Blog/Review)*
```json
{
  "author_name": "string (required)",
  "city": "string",
  "system_kw": "string",
  "rating": "number 1–5 (required)",
  "text": "text (required)",
  "status": "select: pending | approved | rejected (default pending)"
}
```

### client_stories  *(Feedback — longer stories)*
```json
{
  "name": "string", "location": "string",
  "story": "text (required)",
  "photo": "file (optional)",
  "status": "select: pending | approved | rejected (default pending)"
}
```

### complaints  *(Support)*
```json
{
  "code": "string (auto, e.g. NSP-7F3K — shared with client for tracking)",
  "client_name": "string (required)", "phone": "string (required)", "email": "string",
  "site": "rel→sites (optional)",
  "subject": "string (required)", "description": "text (required)",
  "status": "select: open | in_progress | resolved | closed (default open)",
  "resolution_note": "text (vendor/employee)",
  "client_response": "text (client's reply after resolution)",
  "client_satisfied": "bool"
}
```

### notifications  *(in-app, for the vendor)*
```json
{
  "recipient": "rel→users (vendor)",
  "type": "select: stage_completed | new_complaint | new_review | new_story",
  "site": "rel→sites (optional)",
  "message": "string",
  "read": "bool (default false)"
}
```

---

## 4. Key workflows

**A. Employee logs stage progress (mandatory photo + address)**
1. Employee opens an assigned site → picks a stage → form requires **photo + address** (UI blocks submit if missing; Pocketbase also marks both `required`).
2. App **upserts** `site_photos` on `(site, stage)` → old photo for that stage auto-deleted.
3. App writes a `site_updates` log row; if `action = completed`, a Pocketbase **hook** creates a `notifications` row for the site's vendor → vendor sees the bell badge.

**B. Vendor correction** — vendor can edit any `sites` / `site_photos` / `site_updates` (API rule allows `role = vendor`). Employees can edit only their assigned sites.

**C. Reviews / stories** — public submit creates a `pending` row; public pages list **approved only**; vendor approves/rejects in the moderation queue.

**D. Complaint → resolution → client response**
1. Public submits a complaint → `open`, gets a **tracking code**.
2. Vendor/employee works it → `in_progress` → `resolved` with a `resolution_note`.
3. Client opens **Track by code**, sees the resolution, and posts a **response** (`client_response` + satisfied yes/no) → vendor can then `close`.

---

## 5. Auth & security (Pocketbase)

- **Google OAuth** enabled in Pocketbase; the frontend ships only the **public client ID**.
  The **client secret, admin password and any API keys stay on the Pocketbase server** — never in the repo.
- **API rules (sketch):**
  - `site_photos`, `site_updates`, `sites`: create/update where `@request.auth.role = "employee" && assigned_employee = @request.auth.id` **or** `@request.auth.role = "vendor"`.
  - `reviews`/`client_stories`: public `create`; public `list/view` only `status = "approved"`; update only `role = "vendor"`.
  - `complaints`: public `create`; view by `code`; update (resolution) only authenticated; `client_response` via code.
  - `notifications`: view/update only where `recipient = @request.auth.id`.
- Frontend `.env` holds **public config only** (`VITE_POCKETBASE_URL`, `VITE_GOOGLE_OAUTH_CLIENT_ID`); `.env` is git-ignored, `.env.example` is committed.

---

## 6. Tech stack

- **React 18 + Vite**, **React Router** (hash or `basename` for GitHub Pages).
- **Tailwind CSS** (design tokens from the current concept), **lucide-react** icons, **Framer Motion** for the reveals.
- **PocketBase JS SDK** for auth, data, file upload.
- **Light theme only**, mobile-first, WCAG AA.
- GitHub Pages deploy (`.nojekyll`, SPA redirect for deep links).

---

## 7. Roadmap (phased)

1. **Public site** → React + Tailwind port of the approved concept (Home) + Reviews, Stories, Support pages (read-only + submit forms). *(design-ready)*
2. **Pocketbase setup** → collections above, Google OAuth, API rules, hooks (notification + photo upsert helper).
3. **Portal auth + Employee** → Google login, role routing, assigned-sites list, stage update form (photo+address), upsert + auto-delete.
4. **Vendor** → dashboard, notifications, corrections, moderation queue, complaints board.
5. **Polish** → WhatsApp CTA finalized, empty/loading/error states, a11y pass, deploy.

---

## 8. Open questions

- Multiple vendors, or a single vendor/admin? (model supports multi via `users.vendor`.)
- Exact stage list — confirm: survey, structure, panel, wiring, earthing, net-meter, commissioned.
- Should employees also submit complaints/updates on behalf of a walk-in client?
- Any data retention need for deleted stage photos (currently: hard-deleted on replace, per your rule)?
