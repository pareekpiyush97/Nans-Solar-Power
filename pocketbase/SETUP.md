# Pocketbase setup — NAN'S SOLAR POWER

The frontend runs on **demo data** until you point it at a Pocketbase server. This guide sets up
that server: collections, API rules, Google OAuth, notification hooks, and the per-stage photo rule.

> Create the collections from the **field tables below** (reliable across Pocketbase versions).
> `pb_schema.json` in this folder is the same schema in JSON form, for reference and scripting.
> Whichever way you create them, apply the **API rules** and **indexes** in sections 4 and 3.

---

## 1. Run Pocketbase

```bash
# download the binary for your OS from https://pocketbase.io/docs
./pocketbase serve            # http://127.0.0.1:8090  (admin UI at /_/)
```

Open `http://127.0.0.1:8090/_/` and create your **admin** account (this password is NOT the vendor login
and never goes in the repo). For production, run it behind HTTPS on your VPS (systemd + a reverse proxy,
or `./pocketbase serve --https=yourdomain`).

---

## 2. `users` collection (auth) — add fields

Pocketbase ships a default **users** auth collection. Add these fields to it:

| Field    | Type                      | Notes                                  |
|----------|---------------------------|----------------------------------------|
| `name`   | text                      | already present                        |
| `role`   | select (single)           | values: `vendor`, `employee`           |
| `active` | bool                      | default true                           |
| `vendor` | relation → users (single) | optional: which vendor an employee reports to |
| `phone`  | text                      | optional                               |

New Google sign-ins arrive with **no role** (the app shows an "awaiting access" screen). Assign `role`
in the Admin UI, or make yourself `vendor` first and manage employees from there.

---

## 3. Collections

### `sites` (base)
| Field | Type | Required |
|---|---|---|
| client_name | text | ✓ |
| address | text | ✓ |
| city | text | |
| pincode | text | |
| client_phone | text | |
| capacity_kw | number | |
| system_type | select: residential, commercial, industrial | ✓ |
| current_stage | select: survey, structure, panel, wiring, earthing, net_meter, commissioned | |
| status | select: active, on_hold, completed | |
| assigned_employee | relation → users (single) | |
| vendor | relation → users (single) | |

### `site_photos` (base) — one photo per stage per site
| Field | Type | Required |
|---|---|---|
| site | relation → sites (single) | ✓ |
| stage | select: survey, structure, panel, wiring, earthing, net_meter, commissioned | ✓ |
| photo | file (single, images) | ✓ |
| address | text | ✓ |
| note | text | |
| uploaded_by | relation → users (single) | |

**Add a UNIQUE index** (Admin UI → collection → Indexes, or SQL):
```sql
CREATE UNIQUE INDEX idx_site_photos_site_stage ON site_photos (site, stage);
```
This is what enforces "one photo per stage". The app updates the existing record's `photo` field on a
re-upload, and Pocketbase **deletes the replaced file automatically** → old stage photo is removed.

### `site_updates` (base) — activity log (triggers notifications)
| Field | Type | Required |
|---|---|---|
| site | relation → sites | ✓ |
| stage | select (same 7 values) | ✓ |
| action | select: updated, completed | ✓ |
| address | text | ✓ |
| note | text | |
| photo | relation → site_photos | |
| employee | relation → users | |

### `reviews` (base)
`author_name` text ✓ · `city` text · `system_kw` text · `rating` number ✓ · `text` text ✓ · `status` select: pending, approved, rejected (default pending)

### `client_stories` (base)
`name` text ✓ · `location` text · `story` text ✓ · `photo` file (optional) · `status` select: pending, approved, rejected (default pending)

### `complaints` (base)
`code` text ✓ (unique) · `client_name` text ✓ · `phone` text ✓ · `email` text · `site` relation → sites · `subject` text ✓ · `description` text ✓ · `status` select: open, in_progress, resolved, closed (default open) · `resolution_note` text · `client_response` text · `client_satisfied` bool

Add a unique index on `code`:
```sql
CREATE UNIQUE INDEX idx_complaints_code ON complaints (code);
```

### `notifications` (base)
`recipient` relation → users ✓ · `type` select: stage_completed, new_complaint, new_review, new_story · `site` relation → sites · `message` text ✓ · `read` bool (default false)

---

## 4. API rules (set on each collection → API Rules)

> `@request.auth.id != ""` means "any signed-in user". Adjust to taste.

**sites / site_photos / site_updates** — employees edit their own, vendors edit all:
- **List/View:** `@request.auth.id != ""`
- **Create/Update:** `@request.auth.role = "vendor" || @request.auth.id = assigned_employee` *(for `site_photos`/`site_updates`, use `@request.auth.role = "vendor" || @request.auth.id = @request.data.uploaded_by` on create, and gate by the site's employee on update)*
- **Delete:** `@request.auth.role = "vendor"`

**reviews / client_stories** — public submit, public read of approved only, vendor moderates:
- **List/View:** `status = "approved" || @request.auth.role = "vendor"`
- **Create:** `@request.data.status = "pending"`  *(anyone can submit, only as pending)*
- **Update/Delete:** `@request.auth.role = "vendor"`

**complaints** — public create + lookup by code, staff update:
- **List/View:** `@request.auth.id != "" || @request.query.code != ""` *(or keep View open and look up by code in the app)*
- **Create:** `""` *(public — leave the rule empty/true)*
- **Update:** `@request.auth.id != "" || (@request.data.client_response != "" && @request.data.resolution_note:isset = false)` *(staff resolve; client adds a response via code)*
- **Delete:** `@request.auth.role = "vendor"`

**notifications** — only the recipient:
- **List/View/Update:** `recipient = @request.auth.id`
- **Create/Delete:** leave empty (created by the hook / admin only)

---

## 5. Google OAuth

1. Google Cloud Console → **APIs & Services → Credentials → Create OAuth client ID → Web application**.
2. **Authorized redirect URI:** `https://YOUR-POCKETBASE-HOST/api/oauth2-redirect`.
3. Copy the **Client ID** and **Client secret**.
4. Pocketbase Admin → **Settings → Auth providers → Google** → paste both → Save.
   - The **client secret stays here on the server.** Only the **client ID** goes in the frontend `.env`.
5. Frontend `.env` (copy from `.env.example`):
   ```
   VITE_POCKETBASE_URL=https://YOUR-POCKETBASE-HOST
   VITE_GOOGLE_OAUTH_CLIENT_ID=xxxx.apps.googleusercontent.com
   ```

---

## 6. Hooks (vendor notifications)

Copy `pb_hooks/notify.pb.js` (in this folder) into your Pocketbase `pb_hooks/` directory and restart.
It creates vendor notifications on stage-completion, new complaints, and new pending reviews/stories.

---

## 7. CORS / going live

- Add your site origin (e.g. `https://USERNAME.github.io`) to Pocketbase if you restrict CORS.
- Deploy the frontend: `npm run build` → push `dist/` (see root `README.md`), or serve it anywhere static.
- Flip the app from demo to live simply by setting `VITE_POCKETBASE_URL` and rebuilding.
