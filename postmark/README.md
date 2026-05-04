# Postmark templates (Geometry Club)

These files are meant to be copied into **Postmark** as **Layout** and **Standard** templates, then optionally wired to production via env vars on Netlify.

## Files

| File | Use in Postmark |
|------|-----------------|
| `layout.html` | **Layout** template (type: Layout). Body uses `{{{ @content }}}`. |
| `layout.txt` | Plain-text layout wrapper (if you send text parts). |
| `submission-notification.html` | **Owner** notification — new submission (Standard template). **Alias:** `submission-notification` |
| `submission-notification.txt` | Text body for owner template. |
| `submission-user-confirmation.html` | **Submitter** confirmation (Standard template). **Alias:** `submission-confirmation` |
| `submission-user-confirmation.txt` | Text body for user template. |

In Postmark, set each **Standard** template’s **Layout template** to your Geometry Club layout. When you create the templates, set the **alias** field exactly to `submission-notification` and `submission-confirmation` so they match Netlify env (see `.env.example`).

## Template model (variables)

Use the same keys in the Postmark **Template test** panel and in `TemplateModel` if you use aliases from Netlify.

| Variable | Description |
|----------|-------------|
| `submission_id` | UUID from `submissions` table |
| `name` | Submitter display name |
| `email` | Submitter email |
| `instagram_username` | Instagram handle |
| `location` | Location string |
| `notes` | Optional notes (empty section shows “None” where applicable) |
| `image_filename` | Original file name |
| `image_size_mb` | Size in MB (string, e.g. `2.35`) |
| `image_url` | Signed Supabase Storage URL (use `{{{image_url}}}` in HTML for `href`) |
| `submitted_at` | ISO timestamp string |

## Netlify env (template sends)

If both are set (recommended: `submission-notification` and `submission-confirmation`), `netlify/functions/submit-entry.ts` sends with `sendEmailWithTemplate` instead of inline HTML:

- `POSTMARK_OWNER_TEMPLATE_ALIAS` — default / expected: `submission-notification` (subject set in Postmark).
- `POSTMARK_USER_TEMPLATE_ALIAS` — default / expected: `submission-confirmation`.

If either is unset or blank, the function falls back to built-in HTML bodies for that message (no Postmark template required).

## Quick verification checklist

1. **Supabase**: Table `submissions` exists; Storage bucket name matches `NEXT_PUBLIC_SUPABASE_BUCKET` and `SUPABASE_BUCKET`.
2. **RLS**: Anonymous can upload to `submissions/…` prefix; service role can insert rows and sign URLs.
3. **Netlify**: All env vars from repo `.env.example` are set on the site (including optional template aliases).
4. **Postmark**: Sender signature/domain verified; `POSTMARK_FROM_EMAIL` is an allowed sender.
5. **Live test**: Submit from production `/submit` with a small JPG → row in Supabase, file in bucket, **two** emails received (owner + your test address).
6. **Postmark activity**: Server → Activity shows `Processed` / no bounces for both messages.

## Manual API smoke test (optional)

With a real JWT-style session you can POST JSON to the function URL after a storage upload; easiest path is still the live form once deployed.
