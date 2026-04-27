# VoteSmart AI — Run Locally

AI-powered web assistant explaining elections (India, US, UK) with chat, learn flow, timeline, quizzes, and elections/parties/candidates dashboards.

## 1. Prerequisites
- Node.js 18+ (or Bun 1.0+)
- npm or bun
- A Supabase project (free tier works)
- (Optional) Supabase CLI for migrations & edge functions

## 2. Install
```bash
npm install
# or: bun install
```

## 3. Environment variables
Create `.env` in the project root:
```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_ANON_KEY
VITE_SUPABASE_PROJECT_ID=YOUR_PROJECT_REF
```
Get values from Supabase Dashboard → Project Settings → API.

## 4. Database setup
Run all SQL files in `supabase/migrations/` in chronological order.

**Option A — Supabase CLI:**
```bash
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

**Option B — Manual:** Supabase Dashboard → SQL Editor → paste & run each migration file in order.

This creates: `profiles`, `quiz_attempts`, `user_roles`, `elections`, `parties`, `candidates` + RLS policies + seed data.

## 5. Deploy the AI chat edge function
```bash
supabase functions deploy chat --no-verify-jwt
supabase secrets set LOVABLE_API_KEY=your_lovable_ai_gateway_key
```
(If not using Lovable AI Gateway, edit `supabase/functions/chat/index.ts` to call your provider and set its key instead.)

## 6. Start dev server
```bash
npm run dev
# or: bun run dev
```
Open the URL Vite prints (usually http://localhost:8080).

## 7. Make yourself admin (optional)
1. Sign up at `/auth` in the app.
2. In Supabase SQL Editor:
   ```sql
   insert into public.user_roles (user_id, role)
   values ('YOUR_AUTH_USER_UUID', 'admin');
   ```

## Scripts
| Command | Purpose |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Preview production build |
| `npm run lint` | ESLint |
| `npm run test` | Vitest |

## Folder structure
```
src/
  components/votesmart/   # Navbar, Footer, RegionPicker, VerificationBadge, RegionContext
  components/ui/          # shadcn/ui primitives
  data/regions.ts         # Region-specific flow/timeline/quiz data
  pages/                  # Index, Chat, Learn, Timeline, Quiz, Elections, Parties, Candidates, Auth
  integrations/supabase/  # Auto-generated client & types — do not edit
supabase/
  functions/chat/         # Streaming AI chat edge function
  migrations/             # SQL schema + seed data
```

## Troubleshooting
- **Blank page / 401s** — check `.env` and that migrations ran.
- **Chat empty** — confirm the `chat` function is deployed and the AI key secret is set.
- **No admin access** — add a row in `user_roles` with `role = 'admin'`.
- **Port in use** — edit `vite.config.ts` `server.port`.

---
Stack: React + Vite + Tailwind + shadcn/ui + Supabase + Lovable AI.
