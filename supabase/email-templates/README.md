# Email templates

Branded HTML templates for Supabase Auth emails. Versioned here for traceability — Supabase doesn't sync them automatically.

## Files

| File | Supabase template name | Subject suggestion |
|---|---|---|
| `confirm-signup.html` | Confirm signup | `Bienvenue chez Dripper — confirme ton adresse` |
| `reset-password.html` | Reset password | `Réinitialiser ton mot de passe Dripper` |
| `magic-link.html` | Magic link | `Ton lien de connexion Dripper` |
| `change-email.html` | Change email address | `Confirmer ta nouvelle adresse Dripper` |

## How to install

1. Go to https://supabase.com/dashboard/project/_/auth/templates
2. Pick a template (Confirm signup, Reset password, Magic Link, Change email).
3. Replace **Subject** with the suggested one.
4. Replace **Message body** by copy-pasting the matching HTML file's content.
5. Click **Save**.
6. Send a test email from the dashboard to verify rendering.

## Variables used

- `{{ .ConfirmationURL }}` — the action link (confirm, reset, magic link, etc.)

Other variables Supabase exposes (`{{ .Token }}`, `{{ .Email }}`, `{{ .SiteURL }}`) are not used here, but can be added if needed.

## Design notes

- Palette: `#F5F1EB` background, `#0A0A0A` text, `#6B6B6B` muted, `#EAE5DB` divider — matches the app's light mode.
- Typography: serif (Georgia fallback) for the title and wordmark, sans-serif for body.
- Layout: single-column 520px max-width, table-based for Outlook/Gmail compatibility.
- No external CSS, no web fonts, no images — survives every mail client.
