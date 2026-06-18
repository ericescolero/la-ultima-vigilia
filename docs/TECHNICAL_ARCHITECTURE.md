# TECHNICAL ARCHITECTURE

## La Ultima Vigilia Website

Version: 1.0

---

## Purpose

This document defines the technical direction for the La Ultima Vigilia website foundation.

The first version remains static-first for speed, clarity, and low operational risk. The architecture prepares for future migration into a component framework, private member portal, courses, payments, and database-backed systems.

---

## Current Implementation Strategy

Version 1 uses:

- Static HTML pages.
- Shared CSS design system.
- Shared JavaScript for email capture behavior.
- Static assets.
- Structured content and config folders for future migration.

This keeps the first public site fast while avoiding premature membership, course, payment, or database complexity.

---

## Future Framework Path

Recommended future framework options:

- Astro for content-heavy static pages.
- Next.js for app-heavy membership, courses, and portals.
- Vite plus React for a lightweight component app.

Recommended migration path:

```text
Static V1
→ Content collections
→ Componentized pages
→ Email provider integration
→ Database for members/courses
→ Auth and payments
```

---

## Hosting

Recommended hosts:

- Cloudflare Pages
- Netlify
- Vercel

Hosting requirements:

- Static file serving.
- Redirect support.
- Custom domain for `laultimavigilia.com`.
- SSL.
- Preview deployments.
- Environment variables.

---

## Content Strategy

Content should be stored in `website/content/` before being rendered into pages.

Collections:

- `pages`
- `blog`
- `lead-magnets`
- `archetypes`
- `enemies`
- `community`
- `legal`

---

## Email Strategy

Version 1 form behavior is isolated in `website/assets/js/email-capture.js`.

Future provider integration should preserve:

- Server-side validation.
- Subscriber source tags.
- Lead magnet tags.
- PDF delivery automation.
- Failure states.
- Anti-spam controls.

Recommended providers:

- ConvertKit
- MailerLite
- Beehiiv
- Resend plus database

---

## PDF Delivery Strategy

Version 1 supports a backup static download path.

Future delivery should support:

- Provider-triggered delivery email.
- Versioned PDF files.
- Optional signed URLs.
- Protected paid resources.

---

## Analytics Strategy

The analytics layer should be event-based and provider-agnostic.

Primary events:

- `page_view`
- `lead_form_view`
- `lead_form_submit`
- `lead_form_success`
- `lead_form_error`
- `pdf_download_click`
- `el_remanente_cta_click`
- `blog_article_view`
- `newsletter_signup_source`

---

## Future Database Path

Add a database only when needed for:

- Member accounts.
- Course progress.
- Community access.
- Paid resource ownership.
- Applications or waitlists.

Recommended future database:

- Supabase/Postgres.

---

## Future Auth Path

Authentication is not part of Version 1.

Future auth should support:

- Email/password or magic links.
- Role-based access.
- Member status.
- Course access.
- Admin access.

---

## Non-Negotiable Technical Principles

- Fast loading.
- Mobile-first.
- Accessible forms.
- Canon-safe visual system.
- No unnecessary dependencies.
- Clear future migration path.
- No secrets committed.

