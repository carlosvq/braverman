# Nature Assessment (Braverman)

Invite-only Personality Type Assessment for PARC. Coaches sign in with email + password, invite participants with a 6-digit code (shared manually), and review results in a dashboard.

## Stack

- Next.js 16 (App Router) + TypeScript
- Supabase Auth (email + password / invite codes) + Postgres + RLS
- shadcn/ui + Tailwind CSS
- pnpm

## Setup

### 1. Install

```bash
pnpm install
cp .env.example .env.local
```

### 2. Supabase project

This app is wired to the **Braverman** Supabase project (`sgplmfqyjbydjczkcmxb`). Schema migrations under [`supabase/migrations/`](supabase/migrations/) are already applied there.

Copy keys into `.env.local` from [Project Settings → API Keys](https://supabase.com/dashboard/project/sgplmfqyjbydjczkcmxb/settings/api-keys):

- `NEXT_PUBLIC_SUPABASE_URL` — `https://sgplmfqyjbydjczkcmxb.supabase.co`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` — publishable key
- `SUPABASE_SECRET_KEY` — **secret** key (required for coach invites; server-only)

Auth does **not** send emails. No custom SMTP is required for login or invites.

### 3. Auth settings

1. **Authentication → Providers → Email**: enable Email. Password sign-in must be on.
2. **Password requirements**: minimum length **6** (invite codes are 6 digits). Avoid requiring letters/symbols if you want numeric invite codes to work.
3. Disable public signups if available (invite-only).

### 4. Create the first coach

1. **Authentication → Users → Add user**
2. Enter coach email + a strong password; confirm the email.
3. Edit the user → **App Metadata**:

```json
{ "role": "coach" }
```

4. Ensure the profile row is coach:

```sql
update public.profiles
set role = 'coach'
where email = 'coach@example.com';
```

If no profile exists yet:

```sql
insert into public.profiles (id, email, full_name, role)
select id, email, coalesce(raw_user_meta_data->>'full_name', ''), 'coach'
from auth.users
where email = 'coach@example.com'
on conflict (id) do update set role = 'coach';
```

Sign in at `/coach/login` with that email and password → `/dashboard`.

## How auth works

| Role | Sign-in page | Credentials |
|------|--------------|-------------|
| Coach | `/coach/login` | Email + password |
| Participant | `/new` | Email + 6-digit invite code (from coach) |

When a coach invites someone, the app creates their Auth user with the 6-digit code as the password and shows the code **once** in the dashboard. The coach shares it out-of-band (WhatsApp, SMS, in person) along with `/new`.

## Develop

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). Unauthenticated visitors are redirected to `/new` (or `/coach/login` if they were heading to `/dashboard`).

## Roles

| Role | Access |
|------|--------|
| `participant` | Assessment at `/`; own results only |
| `coach` | `/dashboard` (invite + view all results); can also take the assessment |

Roles live in `auth.users.raw_app_meta_data.role` (JWT `app_metadata`) and are mirrored on `public.profiles.role`. Never authorize from `user_metadata`.

## Scoring

- **Part 1 (1A–4A):** TRUE counts → dominant nature (highest score)
- **Part 2 (1B–4B):** TRUE counts → deficiency severity: Minor (0–5), Moderate (6–15), Major (15+)

Not a medical diagnosis.
