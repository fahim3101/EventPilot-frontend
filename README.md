# EventPilot AI — Frontend

Next.js 14 + TypeScript + Tailwind app for [EventPilot AI](https://event-pilot-frontend.vercel.app).

[![Next.js](https://img.shields.io/badge/Next.js-14.2-000?logo=nextdotjs)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-5-FF4154?logo=reactquery&logoColor=white)](https://tanstack.com/query)
[![Deployed on Vercel](https://img.shields.io/badge/deploy-Vercel-000?logo=vercel)](https://vercel.com)

**Live:** [event-pilot-frontend.vercel.app](https://event-pilot-frontend.vercel.app)

---

## ✨ What's inside

A polished, production-ready event marketplace with two AI features baked in:

- **Landing page** — auto-rotating hero slider, 7 marketing sections, live "Events by Category" Recharts bar chart
- **Event discovery** (`/events`) — search, filter by category & max price, sort, paginate
- **Event detail** (`/events/[id]`) — multi-image gallery, reviews, related events, AI description if author used the generator
- **Auth** (`/login`, `/register`) — email/password, one-click **Demo Login**, Google Sign-In
- **Add event** (`/events/add`) — form with **AI Description Generator** powered by Groq
- **Manage events** (`/events/manage`) — edit/delete your own events
- **AI chat assistant** — floating widget, site-wide, multi-turn, context-aware
- **Static pages** — `/about`, `/contact`

---

## 🧱 Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5.6 |
| Styling | Tailwind CSS 3.4 (custom `primary` / `secondary` palette, `rounded-card` / `rounded-xl` design tokens) |
| Server state | TanStack Query v5 |
| HTTP | Axios (with `withCredentials` for cookie auth) |
| Charts | Recharts 2 |
| Icons | lucide-react |
| Toasts | react-hot-toast |
| Fonts | `next/font/google` (Inter + Noto Sans Bengali, self-hosted, no FOUT) |

---

## 📁 Project layout

```
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx           # root layout, font + providers
│   │   ├── page.tsx             # landing
│   │   ├── globals.css          # Tailwind + design tokens
│   │   ├── about/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── events/
│   │       ├── page.tsx             # /events (list, search, filter)
│   │       ├── add/page.tsx         # /events/add (AI generator)
│   │       ├── manage/page.tsx      # /events/manage
│   │       └── [id]/page.tsx        # event detail
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── EventCard.tsx
│   │   ├── EventCardSkeleton.tsx
│   │   ├── ChatWidget.tsx        # floating AI assistant
│   │   ├── HeroSlider.tsx
│   │   ├── CategoryChart.tsx     # Recharts bar chart
│   │   ├── ProtectedRoute.tsx
│   │   └── GoogleSignInButton.tsx
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   └── QueryProvider.tsx
│   ├── lib/
│   │   └── api.ts                # axios instance (withCredentials)
│   └── types/
│       └── index.ts
├── public/
├── tailwind.config.ts
├── next.config.js
├── tsconfig.json
├── .env.local.example
└── package.json
```

---

## 🚀 Local development

### 1. Install
```bash
cd frontend
npm install
```

### 2. Configure environment
```bash
cp .env.local.example .env.local
```

`.env.local`:
```ini
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_GOOGLE_CLIENT_ID=xxxxxxxxxxxx.apps.googleusercontent.com   # optional
```

### 3. Run
```bash
npm run dev          # http://localhost:3000
```

For a production build:
```bash
npm run build
npm start
```

---

## 🎨 Design system

- **Colors**: defined as Tailwind theme extensions in `tailwind.config.ts` — `primary` (brand), `primary-600`, `secondary`, `secondary-600`, neutral `slate-*` scale
- **Reusable classes** in `globals.css`:
  - `.card` — consistent card surface (border, shadow, hover lift)
  - `.btn-primary`, `.btn-secondary`, `.btn-outline`
  - `.input` — focus-ring on `primary`
  - `.skeleton` — animated placeholder
- **Fonts**: Inter (Latin) + Noto Sans Bengali (Bengali), self-hosted via `next/font/google` — no external CDN dependency, no FOUC, no privacy concerns

---

## 🔌 Talking to the backend

All requests go through a single Axios instance in `src/lib/api.ts`:

```ts
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});
```

`withCredentials: true` is **required** for the JWT httpOnly cookie to be sent on cross-origin requests to the backend.

### Production safety net

If `NEXT_PUBLIC_API_URL` is missing in a production build, `api.ts` logs a loud console error and falls back to `localhost:5000` so the bug is impossible to miss. Always set this in Vercel **and** trigger a clean redeploy (no build cache) when changing it.

---

## ☁️ Deployment (Vercel)

1. Import this repo into Vercel
2. **Root Directory**: `frontend`
3. Framework preset: **Next.js** (auto-detected)
4. Add environment variables in **Settings → Environment Variables**:
   - `NEXT_PUBLIC_API_URL` → `https://<your-backend>.onrender.com/api`
   - `NEXT_PUBLIC_GOOGLE_CLIENT_ID` → (your client ID, if using Google login)
5. Deploy

> ⚠️ **Critical:** After adding or changing env vars, redeploy with **"Use existing Build Cache" UNCHECKED** — otherwise the new `NEXT_PUBLIC_*` values won't be baked into the client bundle, and the old URL will keep being used.

### Google OAuth setup (for the "Sign in with Google" button)
1. Create an OAuth Client ID at https://console.cloud.google.com/apis/credentials
2. Under **Authorized JavaScript origins**, add BOTH:
   - `http://localhost:3000`
   - `https://event-pilot-frontend.vercel.app`
3. Save and wait ~5 minutes for Google to propagate

---

## 🧠 Architectural decisions

- **App Router everywhere** for streaming + better SEO; only client components are explicitly opted-in with `"use client"`
- **Server state** lives in TanStack Query, not Redux — the app has no global UI state worth a heavier library
- **`useSearchParams` is wrapped in `<Suspense>`** on the `/events` page so the build can statically prerender the route (Next.js 14 throws otherwise)
- **Auth flow**: a top-level `AuthProvider` calls `/api/auth/me` on mount; on `401` it sets `user = null`. Login + logout simply refetch that key.
- **AI chat** streams from `/api/ai/chat` (no SSE — just JSON for now). Conversation history is kept client-side in `ChatWidget.tsx`.

---

## 🧪 Smoke-test checklist

After pulling the latest changes:

- [ ] `/` — hero slider auto-rotates, bar chart renders, footer links work
- [ ] `/events` — search "hackathon" filters the list; sort by price works; pagination respects the page
- [ ] `/login` → "Try Demo Login" — instant access
- [ ] `/events/add` — enter a title, click "Generate Description", wait ~2s, see the AI blurb
- [ ] `/events/manage` — see your newly created event; delete it
- [ ] Open the chat widget (bottom-right) — ask "Suggest workshops this week"
- [ ] `/events/[id]` — image gallery arrows work; leave a review (when logged in)

---

## 📜 License

MIT — see [LICENSE](../LICENSE) in the repo root.
