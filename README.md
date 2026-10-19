# NAN'S SOLAR POWER — Website + Vendor/Employee Portal

A light-themed **React (Vite) + Tailwind** web app for a solar firm (Authorized Adani Solar Dealer · Bikaner):
a public marketing site **plus** a private portal where employees log site progress and the vendor reviews it.
Backend is **Pocketbase** (Google OAuth, file storage, API rules). **Runs on demo data out of the box** — no
server needed to explore it.

> Design direction: **Clean Eco SaaS**. The original static design concept is preserved in `design-concept/`.

---

## ✨ Features

**Public site**
- **Home** — firm details, hero, how-it-works, benefits, stats, Adani product + manufacturer/safety, FAQ.
- **Reviews** — approved customer reviews + "Write a review" (goes to moderation).
- **Client Stories** — approved stories + submission form.
- **Support** — register a complaint (get a tracking code) + **track by code** and respond once resolved.
- Floating WhatsApp button, mobile-first, WCAG-minded.

**Portal (Google sign-in, role-gated)**
- **Employee** — assigned sites, **stage update form with mandatory photo + address**, one photo **per stage**
  (a new upload replaces that stage's old photo), timeline, and a vendor notification on completion.
- **Vendor** — all sites + corrections, **in-app notifications**, **moderation queue** (reviews/stories),
  **complaints board** (resolve → client responds by code).

---

## 🧱 Tech stack

React 18 · Vite 5 · React Router (HashRouter) · Tailwind CSS 3 · lucide-react · framer-motion · PocketBase JS SDK.

---

## 🚀 Quick start

```bash
npm install
npm run dev        # http://localhost:5173  (demo mode)
```

No `.env` needed to try it — the app seeds sample data in your browser. On the **Login** page, use the
**demo Vendor / Employee** buttons to explore the portal.

---

## 🔌 Demo mode vs live (Pocketbase)

The app is **live** as soon as `VITE_POCKETBASE_URL` is set; otherwise it uses the local demo backend.

```bash
cp .env.example .env
# edit .env:
#   VITE_POCKETBASE_URL=https://your-pocketbase-host
#   VITE_GOOGLE_OAUTH_CLIENT_ID=xxxx.apps.googleusercontent.com   (public client ID only)
npm run dev
```

Backend setup — collections, the **UNIQUE (site, stage)** index that powers photo auto-delete, API rules,
Google OAuth and notification hooks — is in **[`pocketbase/SETUP.md`](pocketbase/SETUP.md)**
(with `pocketbase/pb_schema.json` and `pocketbase/pb_hooks/notify.pb.js`).

---

## 📦 Build & deploy (GitHub Pages)

```bash
npm run build      # outputs dist/
```

- `vite.config.js` uses `base: './'` + HashRouter, so it works on a project subpath with no SPA-fallback config.
- Deploy `dist/` to GitHub Pages — e.g. push it to a `gh-pages` branch, or use a GitHub Action
  (`actions/deploy-pages`). `.nojekyll` is included.
- Add your site origin to Pocketbase CORS when you go live.

---

## 📁 Structure

```
src/
  lib/        pb.js (client + live/demo switch), api.js (data layer), stages.js
  data/       demo.js (seed + localStorage demo backend)
  context/    AuthContext.jsx (Google OAuth / demo login)
  components/  layout + ui primitives
  pages/       Home, Reviews, Stories, Support, Login
  pages/portal/ SitesList, SiteDetail, VendorOverview, Moderation, ComplaintsAdmin, NotificationsPage
pocketbase/   SETUP.md, pb_schema.json, pb_hooks/notify.pb.js
design-concept/ original static HTML concept (reference)
SPEC.md       full product spec & data model
```

---

## 🔒 Security

- Only **public** values ship to the browser: `VITE_POCKETBASE_URL` and the Google OAuth **client ID**.
- **Secrets stay on Pocketbase** — OAuth client *secret*, admin password, admin keys. Never commit them.
- `.env` is git-ignored; `.env.example` holds public config only.
- Uploaded site photos live on Pocketbase/VPS, not in Git.
