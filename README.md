# Geometry Club

## Submit Pipeline (Supabase + Postmark)

The `/submit` page now uses a custom client form instead of Wufoo.

### 1) Configure Supabase

1. Create a Supabase project.
2. Run SQL in `supabase/submissions.sql`.
3. Confirm bucket name is `submit-photos` (or set your own and update env vars).

### 2) Configure Postmark

1. Create a Postmark Server.
2. Verify your sender domain and set `POSTMARK_FROM_EMAIL`.
3. Copy the server token into `POSTMARK_SERVER_TOKEN`.

### 3) Configure Netlify environment variables

Set all keys from `.env.example` in Netlify site settings:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SUPABASE_BUCKET`
- `SUPABASE_SERVICE_ROLE_KEY`
- `POSTMARK_SERVER_TOKEN`
- `POSTMARK_FROM_EMAIL`
- `OWNER_NOTIFICATION_EMAIL`

### 4) Submission flow

1. Browser uploads image to Supabase Storage.
2. Browser posts form data + uploaded path to `/.netlify/functions/submit-entry`.
3. Function inserts row in `public.submissions`.
4. Function sends:
   - Owner notification email.
   - User confirmation email.

### 5) Local development

1. Copy `.env.example` to `.env.local` and fill values.
2. Run `npm run dev` for Next.js UI.
3. Use Netlify CLI (`netlify dev`) when testing the function route locally.

### 6) Postmark HTML templates

Copy the files under `postmark/` into Postmark (layout + standard templates). Variable reference and optional template aliases are documented in [postmark/README.md](postmark/README.md).

### 7) Go-live verification checklist

1. Supabase: `submissions` table exists; Storage bucket id matches both `*_SUPABASE_BUCKET` env vars.
2. Netlify: production deploy has all required env vars (no typos); redeploy after changing env.
3. Postmark: sender domain verified; `POSTMARK_FROM_EMAIL` is allowed on that server.
4. Submit a **small test JPG** on `https://geometryclub.org/submit` (or your deploy preview URL).
5. Confirm: new row in `submissions`, object under `submissions/…` in the bucket, **two** emails (owner inbox + submitter address), Postmark Activity shows both as processed.
