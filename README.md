# NAN'S SOLAR POWER — Website Redesign

A **"Clean Eco SaaS"** redesign of the NAN'S SOLAR POWER site (Authorized Adani Solar Dealer · Bikaner, Rajasthan).
Light, airy layout with a fresh green + sky palette, real vector icons, and tasteful motion.

This repo is the **design concept** — a self-contained static site (zero build, GitHub Pages–ready) that
doubles as the visual spec for the production React build.

---

## 🚀 Preview

- **Locally:** open `index.html` in any browser, or run a quick server:
  ```bash
  python3 -m http.server 8080
  # then open http://localhost:8080
  ```
- **Online:** deploy to GitHub Pages (see below).

---

## 🧱 Tech

- **Now (this repo):** semantic **HTML5 + modern CSS3 + vanilla JS** in a single `index.html`.
  No build step, no dependencies to install, serves as-is on GitHub Pages.
- **Planned production:** **React (Vite) static SPA** → **Tailwind CSS** + **lucide-react** (icons)
  + **Framer Motion** (animation), with **@headlessui/react** / **shadcn/ui** for menu, accordion & dialog.
  Data (feedback, products, enquiries, auth) comes from **Pocketbase** over its REST API.

The CSS design tokens in `index.html` (`:root`) map 1:1 onto a `tailwind.config` theme, so the port is clean.

---

## 🎨 Design system

- **Palette:** base `#F3F8F4` · surfaces `#FFFFFF` · **primary green `#15A24A`** · **secondary sky `#0EA5E9`**
  (green→sky gradient on key accents) · **amber `#F59E0B`** used sparingly as solar warmth.
- **Type:** **Sora** (display) + **Figtree** (body) via Google Fonts, with system fallbacks.
- **Icons:** inline SVG sprite, Lucide-style (no emojis).
- **Motion:** on-scroll reveal + stat count-up — both degrade gracefully (full content with no JS,
  and respects `prefers-reduced-motion`).
- **Responsive:** mobile-first; verified no horizontal scroll at 390px and 1280px.
- **Accessibility:** semantic landmarks, visible focus states, keyboard-friendly nav & accordion.

---

## 📁 Structure

```
nans-solar-power/
├── index.html      # the complete redesigned site
├── README.md
├── .gitignore
└── .nojekyll       # serve files as-is on GitHub Pages
```

---

## 🌐 Deploy to GitHub Pages

1. Push this repo to GitHub (see "Push to a new repo" below).
2. Repo **Settings → Pages**.
3. **Source:** Deploy from a branch → **Branch: `main`** → **Folder: `/ (root)`** → **Save**.
4. Your site goes live at `https://<your-username>.github.io/<repo-name>/`.

> Free-tier GitHub Pages publishes from **public** repos. Private-repo Pages needs a paid plan.

---

## 📦 Push to a new repo

```bash
# inside this folder (history already committed)
git remote add origin https://github.com/<your-username>/<repo-name>.git
git branch -M main
git push -u origin main
```

Or, if you have the GitHub CLI signed in locally:

```bash
gh repo create <repo-name> --public --source=. --remote=origin --push
```

---

## 🔒 Security notes (for the production build)

- **Only public values ship to the frontend:** the **Pocketbase URL** and the **Google OAuth _client ID_**.
  These are safe to be public (browser JS is visible to everyone anyway).
- **Never commit secrets** — the Pocketbase **admin key**, Google OAuth **client _secret_**, and any
  **admin password** live only on the Pocketbase server / VPS, never in this repo (public *or* private).
- **Uploads** (site photos, documents) are stored on **Pocketbase / VPS**, not in Git — the repo stays code-only and light.
- `.env` and `.env.*` are git-ignored; commit a non-secret `.env.example` for public config only.

---

## 📝 Status

Design concept — **Clean Eco SaaS** direction. Pending approval before the React + Vite + Pocketbase build.
