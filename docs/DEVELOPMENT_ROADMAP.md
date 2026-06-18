# DEVELOPMENT ROADMAP

## La Ultima Vigilia Website Ecosystem

Version: 1.0

---

## Purpose

This roadmap audits the current project structure and defines the development path for Version 1 of the La Ultima Vigilia website ecosystem.

The roadmap is based on the current project documentation:

- `docs/PROJECT_CONTEXT.md`
- `docs/UNIVERSE_CORE_BIBLE.md`
- `docs/MASTER_FILES_INDEX.md`
- `docs/VISUAL_REFERENCE_INDEX.md`
- `docs/VISUAL_REFERENCE_ARCHIVE.docx`
- `docs/MASTER_PROMPT_COLLECTION.md`
- `docs/QUOTE_DATABASE.md`
- `docs/LORE_EXPANSION.md`
- `docs/WATCHMAN_CODE.md`

The website must serve the mission before the aesthetic.

Primary goals:

1. Capture emails.
2. Deliver `La Guerra Silenciosa`.
3. Introduce `El Remanente`.
4. Present the mission clearly.
5. Support future expansion into content, courses, membership, community, books, and the Watchman Universe archive.

---

## Canon Summary for Development

La Ultima Vigilia exists to awaken Christian men from spiritual sleep.

The project combines:

- Christian discipleship
- Masculine development
- Spiritual warfare
- Discipline
- Storytelling
- Visual mythology
- Modern media

The Watchman Universe is not fantasy entertainment. It is a symbolic framework for real spiritual, psychological, and masculine battles.

Every future system must preserve:

- Christian worldview
- Masculine reconstruction
- Spiritual vigilance
- Discipline
- Purpose
- Truth
- Resistance against Babylon
- Dark cinematic realism
- Emotional restraint
- Canon consistency

The mission is always more important than spectacle.

---

## Current Project Structure Audit

Current observed structure:

```text
la-ultima-vigilia/
├── assets/
├── docs/
├── email-campaigns/
├── pdfs/
├── social-content/
├── watchman-universe/
└── website/
```

Current file state:

- `docs/` contains the primary canon and creative documentation.
- `website/` exists but has no application scaffold.
- `assets/` exists but has no organized asset taxonomy.
- `email-campaigns/` exists but has no automation, templates, tags, or provider notes.
- `pdfs/` exists but has no structured product library or delivery plan.
- `social-content/` exists but has no content calendar, platform strategy, or reusable formats.
- `watchman-universe/` exists but has no structured archive for archetypes, enemies, environments, prompts, or canon review.

The project has strong creative canon, but it is missing the technical and operational documentation required to build and maintain the website safely.

---

## Missing Folders

The following folders should be added before or during Version 1 development.

### Website Application

```text
website/
├── src/
├── public/
├── content/
├── config/
├── tests/
└── docs/
```

Purpose:

- Hold the actual website app.
- Separate source code, static assets, content, configuration, tests, and website-specific documentation.

### Website Source Structure

```text
website/src/
├── app/
├── components/
├── data/
├── features/
├── lib/
├── styles/
└── types/
```

Purpose:

- Keep the site component-based and future-ready.
- Support future routing for blog, courses, community, and product pages.

### Website Content Collections

```text
website/content/
├── pages/
├── blog/
├── lead-magnets/
├── archetypes/
├── enemies/
├── community/
└── legal/
```

Purpose:

- Store Spanish-first content in a structured way.
- Prepare for future editorial workflow.
- Keep copy changes separate from code changes.

### Blog System

```text
blog/
├── drafts/
├── published/
├── categories/
├── editorial-calendar/
└── style-guides/
```

Purpose:

- Support the ten content pillars.
- Prepare for SEO and newsletter repurposing.

Recommended categories:

- Spiritual Warfare
- Masculine Discipline
- Purpose
- Faith
- Identity
- Leadership
- Vigilance
- Brotherhood
- Self-Mastery
- Truth

### Newsletter System

```text
newsletter-system/
├── provider-notes/
├── tags-and-segments/
├── forms/
├── sequences/
├── broadcasts/
├── templates/
├── automations/
└── compliance/
```

Purpose:

- Define how email capture, tagging, PDF delivery, nurture sequences, and future launches work.

### PDF Library

```text
pdf-library/
├── free-lead-magnets/
├── paid-books/
├── devotionals/
├── worksheets/
├── source-files/
├── exports/
└── delivery/
```

Purpose:

- Separate source files from exported PDFs.
- Support both free and paid products.
- Prepare secure delivery paths.

### El Remanente Community

```text
community/
├── el-remanente/
├── onboarding/
├── oath-and-code/
├── disciplines/
├── weekly-rhythms/
├── discussion-prompts/
├── brotherhood-challenges/
├── moderation/
└── member-journeys/
```

Purpose:

- Treat El Remanente as a formation system, not just a signup page.
- Align future community systems with `WATCHMAN_CODE.md`.

### Courses

```text
courses/
├── catalog/
├── la-guerra-interior/
├── future-courses/
├── lessons/
├── worksheets/
├── scripts/
└── assets/
```

Purpose:

- Prepare for future paid courses and member learning paths.

### Canon Archive

```text
watchman-universe/
├── archetypes/
├── forces-of-corruption/
├── environments/
├── visual-canon/
├── writing-canon/
├── prompt-archive/
├── lore-notes/
└── canon-review/
```

Purpose:

- Preserve canon consistency across future products.
- Keep archetypes, enemies, environments, prompts, and visual references organized.

### Shared Assets

```text
assets/
├── brand/
├── images/
├── video/
├── audio/
├── icons/
├── fonts/
├── source/
└── exports/
```

Purpose:

- Prevent visual assets from becoming scattered across website, PDFs, email, and social content.

### Operations

```text
operations/
├── roadmap/
├── launch-checklists/
├── content-calendar/
├── analytics-reports/
├── decisions/
└── maintenance/
```

Purpose:

- Track launch decisions, future improvements, and operating rhythms.

---

## Missing Technical Documentation

The project needs the following technical documentation before or during Version 1 development.

### Architecture Decision Record

Recommended file:

```text
docs/TECHNICAL_ARCHITECTURE.md
```

Should define:

- Framework choice
- Hosting target
- Rendering strategy
- Content strategy
- Email provider approach
- PDF delivery approach
- Analytics approach
- Future database path
- Future membership/auth path

### Website Requirements

Recommended file:

```text
website/docs/WEBSITE_REQUIREMENTS.md
```

Should define:

- Required pages
- Required sections
- Required forms
- Required states
- Required CTAs
- SEO requirements
- Accessibility requirements
- Mobile requirements
- Performance targets

### Design System Specification

Recommended file:

```text
website/docs/DESIGN_SYSTEM.md
```

Should define:

- Color tokens
- Typography
- Spacing
- Layout rules
- Button styles
- Form styles
- Image treatment
- Motion rules
- Visual restrictions from canon

### Content Model

Recommended file:

```text
website/docs/CONTENT_MODEL.md
```

Should define:

- Page schema
- Article schema
- Lead magnet schema
- Archetype schema
- Enemy schema
- Community content schema
- SEO metadata schema

### Email Capture and Delivery Specification

Recommended file:

```text
newsletter-system/EMAIL_CAPTURE_SPEC.md
```

Should define:

- Email provider
- Form fields
- Validation rules
- Subscriber tags
- Segments
- Automation triggers
- PDF delivery logic
- Failure handling
- Unsubscribe and compliance requirements

### Environment Variables Documentation

Recommended file:

```text
website/docs/ENVIRONMENT_VARIABLES.md
```

Should define:

- Public site URL
- Email provider keys
- Analytics keys
- PDF storage configuration
- Spam protection keys
- Future database URLs
- Future Stripe keys

No secret values should be committed.

### Deployment Runbook

Recommended file:

```text
website/docs/DEPLOYMENT.md
```

Should define:

- Local development steps
- Build command
- Preview command
- Hosting provider setup
- Production deployment steps
- Rollback process
- Domain setup
- SSL verification

### QA Checklist

Recommended file:

```text
website/docs/QA_CHECKLIST.md
```

Should define checks for:

- Mobile layout
- Desktop layout
- Email capture
- PDF delivery
- Form errors
- Thank-you page
- SEO metadata
- Open Graph previews
- Accessibility
- Performance
- Broken links
- Canon consistency

### Analytics Plan

Recommended file:

```text
website/docs/ANALYTICS_PLAN.md
```

Should define:

- Events
- Naming conventions
- Conversion goals
- Funnel steps
- UTM handling
- Reporting cadence

### Canon Governance

Recommended file:

```text
docs/CANON_GOVERNANCE.md
```

Should define:

- Source-of-truth hierarchy
- Review process for new archetypes, enemies, and environments
- Visual approval process
- Writing approval process
- Rules for resolving documentation conflicts

---

## Missing Website Requirements

Version 1 has a clear mission, but the repository is missing a formal website requirements document.

The following requirements should be captured before implementation begins.

### Required Pages for Version 1

```text
/
/la-guerra-silenciosa
/el-remanente
/mision
/blog
/blog/[slug]
/gracias
/descargar/la-guerra-silenciosa
/privacidad
/terminos
```

### Required Homepage Sections

1. Hero with mission and email capture.
2. Problem section naming spiritual sleep, distraction, temptation, comfort, and lost purpose.
3. Lead magnet section for `La Guerra Silenciosa`.
4. Mission section.
5. Watchman Universe introduction.
6. El Remanente introduction.
7. Content pillars.
8. Final email capture CTA.

### Required Lead Magnet Flow

```text
Visitor submits email
→ email is validated
→ subscriber is added to provider
→ source tag is applied
→ lead magnet tag is applied
→ delivery automation starts
→ user lands on thank-you page
→ user is invited toward El Remanente
```

### Required Form States

Every email form must include:

- Empty state
- Invalid email state
- Loading state
- Success state
- Provider/API failure state
- Already subscribed state if supported by provider

### Required Subscriber Tags

Recommended tags:

```text
lead-magnet-la-guerra-silenciosa
source-home
source-lead-magnet-page
source-blog
source-footer
interested-el-remanente
language-spanish
```

### Required Content Pillars

The blog and newsletter system should support:

- Spiritual Warfare
- Masculine Discipline
- Purpose
- Faith
- Identity
- Leadership
- Vigilance
- Brotherhood
- Self-Mastery
- Truth

### Required Visual Rules

The website must preserve:

- Dark cinematic realism
- Grounded environments
- Photographic realism
- Hooded Watchman as primary visual anchor
- Dark neutrals
- Weathered metals
- Gold accents
- Deep shadows
- Storm lighting
- Atmospheric fog, rain, ash, smoke, moonlight, or fire glow where useful

The website must avoid:

- Generic AI aesthetics
- Cartoon aesthetics
- Superhero aesthetics
- Cyberpunk aesthetics
- Neon-heavy palettes
- Floating magical effects
- Occult or satanic symbols
- Cluttered visual noise
- Corporate SaaS polish
- Motivational-poster aesthetics

### Required Writing Rules

The website copy must be:

- Spanish-first
- Direct
- Masculine
- Stoic
- Serious
- Honest
- Spiritually grounded
- Confrontational when necessary
- Emotionally controlled

The copy must avoid:

- Corporate language
- Self-help cliches
- Soft motivational language
- Excessive positivity
- Generic inspiration
- Internet trend language
- Influencer-style masculinity

### Required Accessibility and UX

Version 1 must include:

- Mobile-first layout
- Keyboard-accessible forms and links
- High-contrast text
- Clear focus states
- Responsive typography
- Proper heading order
- Descriptive button labels
- Accessible form errors
- Reduced-motion support where motion exists

### Required SEO

Version 1 must include:

- Spanish metadata
- Page titles
- Meta descriptions
- Open Graph metadata
- Sitemap
- Robots configuration
- Canonical URLs
- Article metadata for blog posts
- Clean URL structure

### Required Legal Pages

Version 1 must include:

- Privacy policy
- Terms page
- Cookie notice if analytics or tracking cookies are used
- Email unsubscribe handled through provider

---

## Missing Infrastructure Requirements

The repository currently does not define the infrastructure required to launch, secure, measure, or maintain the site.

### Hosting

Missing decisions:

- Hosting provider
- Build system
- Preview deployments
- Production deployment process
- Rollback process
- Domain connection for `laultimavigilia.com`
- SSL verification

Recommended options:

- Vercel
- Netlify
- Cloudflare Pages

### Email Provider

Missing decisions:

- Email platform
- API integration method
- Subscriber tagging model
- PDF delivery automation
- Broadcast workflow
- Nurture sequence workflow
- Compliance process

Recommended options:

- ConvertKit
- MailerLite
- Beehiiv
- Resend plus custom database

### PDF Delivery

Missing decisions:

- Where exported PDFs live
- Whether delivery links are public, protected, or signed
- Whether thank-you pages include backup downloads
- How failed delivery is handled
- How PDF versions are tracked

Recommended Version 1 approach:

- Email delivery through provider automation.
- Thank-you page confirms delivery.
- Optional backup download page.
- Later upgrade to signed URLs if needed.

### Spam Protection

Missing decisions:

- Honeypot field
- Rate limiting
- CAPTCHA or Turnstile
- Provider-side duplicate handling
- Abuse logging

Recommended Version 1 approach:

- Honeypot and server-side validation.
- Add Turnstile if spam becomes a problem.

### Analytics

Missing decisions:

- Analytics provider
- Event taxonomy
- Funnel tracking
- UTM handling
- Reporting cadence

Recommended events:

```text
page_view
lead_form_view
lead_form_submit
lead_form_success
lead_form_error
pdf_download_click
el_remanente_cta_click
blog_article_view
newsletter_signup_source
```

Recommended tools:

- Plausible
- Umami
- Google Analytics 4

### Error Monitoring

Missing decisions:

- Client-side error tracking
- Form submission failure tracking
- Email provider failure visibility
- Deployment failure notifications

Recommended tools:

- Sentry
- Logtail
- Hosting provider logs

### Future Database

Missing decisions:

- Whether Version 1 stores leads locally or relies entirely on provider.
- Future member profile model.
- Future course progress model.
- Future community access model.

Recommended future path:

- Supabase or Postgres when membership, courses, or gated content begin.
- Do not add database complexity before the first conversion site is live.

### Future Payments

Missing decisions:

- Payment provider
- Product catalog
- Tax handling
- Refund policy
- Webhook processing
- Paid PDF/course delivery

Recommended future path:

- Stripe for `La Guerra Interior`, courses, and memberships.

### CI and Quality Gates

Missing decisions:

- Linting
- Type checks
- Unit tests
- End-to-end tests
- Accessibility checks
- Performance budget

Recommended gates:

- Type check
- Lint
- Build
- Basic form tests
- Link checks
- Lighthouse checks before launch

### Backups and Versioning

Missing decisions:

- PDF versioning
- Content backups
- Email sequence backups
- Asset source backups
- Canon change history

Recommended approach:

- Store source documents in version control when appropriate.
- Keep exported media organized by version.
- Track canon changes through `docs/CANON_GOVERNANCE.md`.

---

## Recommended Version 1 Technical Stack

Recommended stack:

- Framework: Next.js, Astro, or Vite plus React
- Language: TypeScript
- Styling: CSS modules, Tailwind CSS, or token-based global CSS
- Content: Markdown or MDX
- Hosting: Vercel, Netlify, or Cloudflare Pages
- Email: ConvertKit, MailerLite, Beehiiv, or Resend
- Analytics: Plausible, Umami, or GA4
- Future database: Supabase/Postgres
- Future payments: Stripe

Version 1 should remain static-first where possible.

Do not build:

- Full authentication
- Member dashboard
- Course engine
- Payment system
- Complex CMS

Prepare for those systems through clean structure and documentation.

---

## Recommended Version 1 Build Scope

Build now:

- Homepage
- Lead magnet page
- Mission page
- El Remanente page
- Blog index
- Article template
- Thank-you page
- Download confirmation page
- Privacy page
- Terms page
- Email capture form
- PDF delivery integration
- Analytics events

Prepare for later:

- Membership
- Courses
- Payments
- Watchman Universe archive pages
- Personalized email journeys
- Community onboarding portal
- Paid product library

---

## Development Phases

### Phase 0: Documentation and Decisions

Status: Required before build.

Deliverables:

- `docs/TECHNICAL_ARCHITECTURE.md`
- `docs/CANON_GOVERNANCE.md`
- `website/docs/WEBSITE_REQUIREMENTS.md`
- `website/docs/DESIGN_SYSTEM.md`
- `website/docs/CONTENT_MODEL.md`
- `website/docs/ENVIRONMENT_VARIABLES.md`
- `website/docs/DEPLOYMENT.md`
- `website/docs/QA_CHECKLIST.md`
- `website/docs/ANALYTICS_PLAN.md`
- `newsletter-system/EMAIL_CAPTURE_SPEC.md`

Key decisions:

- Framework
- Hosting provider
- Email provider
- PDF delivery method
- Analytics provider
- Initial SEO structure

Exit criteria:

- The build has a clear technical direction.
- The first version has a locked scope.
- Canon rules are translated into website rules.

### Phase 1: Project Scaffold

Status: Not started.

Deliverables:

- Website app scaffold.
- TypeScript configured.
- Styling system configured.
- Base routing configured.
- Content structure created.
- Shared component structure created.
- Local development scripts documented.

Exit criteria:

- The website runs locally.
- The project can build successfully.
- The architecture supports future pages.

### Phase 2: Design System

Status: Not started.

Deliverables:

- Color tokens.
- Typography rules.
- Layout constraints.
- Button styles.
- Form styles.
- Card/panel styles where appropriate.
- Image and atmosphere rules.
- Responsive breakpoints.
- Accessibility baseline.

Exit criteria:

- The interface feels dark, cinematic, grounded, and serious.
- Visual language matches the canon.
- Mobile layout is the default design path.

### Phase 3: Core Pages

Status: Not started.

Deliverables:

- `/`
- `/la-guerra-silenciosa`
- `/el-remanente`
- `/mision`
- `/blog`
- `/blog/[slug]`
- `/gracias`
- `/descargar/la-guerra-silenciosa`
- `/privacidad`
- `/terminos`

Exit criteria:

- All pages render.
- All pages have Spanish-first copy.
- All CTAs point to the lead magnet or El Remanente path.

### Phase 4: Email Capture and PDF Delivery

Status: Not started.

Deliverables:

- Email capture form.
- Server-side validation.
- Provider integration.
- Subscriber tagging.
- Lead magnet automation trigger.
- Thank-you redirect.
- Failure states.
- Test submissions.

Exit criteria:

- A visitor can submit an email.
- The subscriber is tagged correctly.
- `La Guerra Silenciosa` is delivered.
- Errors are visible and recoverable.

### Phase 5: Blog and Content Engine

Status: Not started.

Deliverables:

- Content collections.
- Blog category model.
- Article template.
- SEO fields.
- Featured image handling.
- Inline lead magnet CTA.
- Final lead magnet CTA.

Exit criteria:

- Articles can be published without changing application code.
- Blog content supports the ten content pillars.
- Blog readers are directed into the email funnel.

### Phase 6: Analytics and Launch Instrumentation

Status: Not started.

Deliverables:

- Analytics provider configured.
- Conversion events.
- UTM capture.
- Basic reporting view.
- Form success/error tracking.
- PDF click tracking.
- El Remanente CTA tracking.

Exit criteria:

- The conversion funnel can be measured.
- Lead source attribution is available.
- Launch performance can be evaluated.

### Phase 7: QA and Canon Review

Status: Not started.

Deliverables:

- Mobile QA.
- Desktop QA.
- Browser QA.
- Accessibility QA.
- Performance QA.
- SEO QA.
- Email capture QA.
- PDF delivery QA.
- Canon consistency review.

Exit criteria:

- No broken core user flow.
- No major mobile layout issues.
- No canon conflicts.
- No visual drift into fantasy, superhero, cyberpunk, or generic AI aesthetics.

### Phase 8: Launch

Status: Not started.

Deliverables:

- Production deployment.
- Domain connection.
- SSL verification.
- Analytics verification.
- Email automation verification.
- PDF delivery verification.
- Launch checklist completed.

Exit criteria:

- The public site is live.
- Email capture works in production.
- PDF delivery works in production.
- Analytics confirms conversion events.

### Phase 9: Post-Launch Expansion

Status: Future.

First expansion:

- More blog articles.
- Newsletter archive.
- El Remanente waitlist improvements.
- Additional lead magnets.
- `La Guerra Interior` prelaunch page.

Second expansion:

- Course landing pages.
- Paid book sales page.
- Stripe integration.
- Member login.
- Community onboarding.

Third expansion:

- Watchman Universe archive pages.
- Archetype-specific content journeys.
- Personalized email paths.
- Member dashboard.
- Course progress tracking.
- Community challenges.

---

## Immediate Next Actions

1. Choose the website framework and hosting target.
2. Choose the email provider.
3. Decide whether PDF delivery is provider-hosted, site-hosted, or storage-hosted.
4. Create the missing technical documentation listed in Phase 0.
5. Scaffold the website only after Phase 0 decisions are complete.
6. Build the email capture and PDF delivery flow before expanding blog or visual archive pages.

---

## Non-Negotiable Build Principles

Every future implementation must answer yes to these questions:

- Does this serve awakening rather than entertainment?
- Does this help capture emails, deliver the PDF, grow El Remanente, or support future formation?
- Does this preserve Christian worldview and masculine reconstruction?
- Does this maintain dark cinematic realism?
- Does this avoid generic AI, superhero, cartoon, cyberpunk, and neon-heavy aesthetics?
- Does this treat archetypes as symbolic reflections of real battles rather than fantasy characters?
- Does this treat the Forces of Corruption as personified destructive influences rather than shallow villains?
- Does this choose truth over trends?

If the answer is no, the feature should be revised or removed.

