# WEBSITE SPECIFICATION

## La Ultima Vigilia

Version: 1.0

---

## Purpose

This document defines the website requirements for the first public version of La Ultima Vigilia.

The website exists to:

1. Capture emails.
2. Deliver `La Guerra Silenciosa`.
3. Introduce `El Remanente`.
4. Present the mission.
5. Support future expansion into blog content, newsletters, books, courses, memberships, and the Watchman Universe archive.

The website must remain Spanish-first, mobile-first, mission-first, and canon-consistent.

---

## Canon Alignment

All website experiences must align with:

- Christian worldview
- Masculine development
- Spiritual vigilance
- Discipline
- Truth
- Purpose
- Brotherhood
- Resistance against Babylon

The site must not treat the Watchman Universe as fantasy entertainment. It must present the universe as symbolic storytelling used to explain real spiritual, psychological, and masculine battles.

The mission is awakening, not spectacle.

---

## Sitemap

### Version 1 Sitemap

```text
/
/la-guerra-silenciosa
/el-remanente
/mision
/blog
/blog/[slug]
/bienvenido
/descargar/la-guerra-silenciosa
/privacidad
/terminos
```

### Future Sitemap

```text
/newsletter
/archivo
/archivo/arquetipos
/archivo/arquetipos/[slug]
/archivo/fuerzas-de-corrupcion
/archivo/fuerzas-de-corrupcion/[slug]
/archivo/entornos
/archivo/entornos/[slug]
/cursos
/cursos/[slug]
/miembros
/miembros/iniciar-sesion
/miembros/panel
/miembros/cursos
/miembros/comunidad
/la-guerra-interior
/recursos
/recursos/[slug]
```

### Page Purpose

| Page | Purpose |
| --- | --- |
| `/` | Primary conversion page and mission introduction. |
| `/la-guerra-silenciosa` | Dedicated lead magnet landing page. |
| `/el-remanente` | Introduce the community and invite men toward the mission. |
| `/mision` | Explain the purpose, worldview, and call of La Ultima Vigilia. |
| `/blog` | Publish content around the ten content pillars. |
| `/blog/[slug]` | Article detail pages with email capture CTAs. |
| `/bienvenido` | Confirm email signup, deliver the PDF, and move user toward the next mission. |
| `/descargar/la-guerra-silenciosa` | Backup or confirmation download path. |
| `/privacidad` | Privacy policy. |
| `/terminos` | Terms and conditions. |

---

## User Journeys

### Journey 1: Cold Visitor to Email Subscriber

```text
Visitor lands on homepage
→ understands the problem of spiritual sleep
→ sees the offer for La Guerra Silenciosa
→ submits email
→ receives confirmation
→ gets delivery email
→ lands on /bienvenido
→ sees invitation to El Remanente
```

Success criteria:

- Visitor understands the mission within the first screen.
- Email capture is visible without confusion.
- Form submission feels serious, simple, and trustworthy.
- The next step after signup is clear.

### Journey 2: Lead Magnet Visitor

```text
Visitor lands on /la-guerra-silenciosa
→ reads the title and subtitle
→ understands the seven battles concept
→ submits email
→ receives PDF by email
→ is redirected to /bienvenido
```

Success criteria:

- The page focuses on one action: receive the PDF.
- The copy is direct and spiritually grounded.
- The form works cleanly on mobile.

### Journey 3: Community-Interested Visitor

```text
Visitor lands on /el-remanente
→ learns that El Remanente is a brotherhood of vigilance, discipline, faith, and purpose
→ understands members are participants, not passive consumers
→ joins waitlist or enters email funnel
```

Success criteria:

- El Remanente feels like formation, not casual content consumption.
- The invitation feels serious and selective without being confusing.
- The page connects community to mission and discipline.

### Journey 4: Blog Reader to Subscriber

```text
Visitor reads article
→ receives conviction, clarity, or recognition
→ sees contextual CTA
→ subscribes for La Guerra Silenciosa
→ enters nurture sequence
```

Success criteria:

- Articles carry the writing style: direct, weighty, spiritually intense, emotionally controlled.
- CTAs are present but not cheap or distracting.
- Blog supports email capture rather than becoming isolated content.

### Journey 5: Returning Subscriber to Future Product

```text
Subscriber returns from email
→ reads mission/community/product page
→ joins El Remanente waitlist
→ later considers La Guerra Interior, courses, or membership
```

Success criteria:

- Site architecture supports future product journeys.
- Subscriber journeys can be tracked by source and interest.

---

## Email Funnel Flow

### Primary Funnel

```text
Traffic source
→ Homepage or lead magnet page
→ Email form submission
→ Email validation
→ Subscriber added to email provider
→ Tags applied
→ Delivery email sent
→ Thank-you page
→ El Remanente invitation
→ Nurture sequence
```

### Required Forms

- Homepage hero form
- Lead magnet page form
- Blog article inline form
- Footer or final CTA form
- El Remanente interest form

### Required Form Fields

Version 1:

- Email address

Future:

- First name
- Language preference
- Interest area
- Community interest

### Required Form States

Every form must support:

- Empty state
- Invalid email state
- Loading state
- Success state
- Failure state
- Already subscribed state if supported by provider

### Subscriber Tags

Recommended tags:

```text
lead-magnet-la-guerra-silenciosa
source-home
source-lead-magnet-page
source-blog
source-footer
source-el-remanente
interested-el-remanente
language-spanish
```

### Email Automation Sequence

Minimum Version 1 automation:

1. **Delivery Email**
   - Sends `La Guerra Silenciosa`.
   - Confirms what the subscriber requested.

2. **Mission Email**
   - Introduces La Ultima Vigilia.
   - Frames the purpose as awakening, not entertainment.

3. **Battle Sequence**
   - Expands the seven battles from the PDF.
   - Connects each battle to vigilance, discipline, faith, and purpose.

4. **El Remanente Invitation**
   - Introduces the community.
   - Invites the subscriber to waitlist, apply, or express interest.

5. **Future Product Bridge**
   - Prepares the subscriber for `La Guerra Interior`, courses, or membership.

### PDF Delivery Rules

Preferred Version 1 delivery:

- PDF delivered by email automation.
- Thank-you page confirms delivery.
- Backup download path may exist.

Future delivery:

- Signed download links.
- Version tracking.
- Access control for paid PDFs and member-only resources.

---

## Mobile Requirements

The website must be mobile-first because many visitors will arrive from social content, email, or direct mobile browsing.

### Mobile Layout Requirements

- Primary CTA visible early.
- Email forms must be easy to complete with one hand.
- Text must be readable without zooming.
- Sections must be scannable.
- Navigation must be minimal.
- No dense desktop-first grids on small screens.
- No text overlap.
- No horizontal scrolling.
- Tap targets must be large enough for touch.

### Mobile Performance Requirements

- Optimized hero imagery.
- Responsive images.
- Lazy-loaded below-the-fold media.
- Minimal JavaScript.
- Fast form interaction.
- Avoid heavy animations.

### Mobile Visual Requirements

- Preserve cinematic atmosphere without sacrificing readability.
- Use dark backgrounds with high-contrast text.
- Keep gold accents restrained.
- Avoid cluttered overlays.
- Ensure atmospheric effects do not reduce legibility.

### Mobile Form Requirements

- Email input must use correct mobile keyboard.
- Submit button must remain readable.
- Errors must appear close to the relevant field.
- Success message must clearly confirm next step.
- Form must not reset silently after failure.

---

## Future Membership Requirements

El Remanente may become a private membership or community system. Version 1 should prepare for this without building the full system immediately.

### Future Membership Pages

```text
/miembros
/miembros/iniciar-sesion
/miembros/panel
/miembros/comunidad
/miembros/disciplinas
/miembros/recursos
/miembros/cuenta
```

### Future Membership Features

- Member authentication
- Member profile
- Community access state
- Onboarding flow
- Oath or code acknowledgment
- Weekly rhythms
- Brotherhood challenges
- Discipline tracking
- Private resources
- Member-only articles or devotionals
- Account management
- Subscription status if paid

### Future Membership Roles

Potential roles:

- Visitor
- Subscriber
- Waitlist member
- Active member
- Community leader
- Admin

### Membership Canon Requirements

Membership systems must align with `WATCHMAN_CODE.md`.

They should reinforce:

- Vigilance
- Truth above comfort
- Discipline before emotion
- Carrying responsibility
- Brotherhood
- Prayer
- Study
- Work
- Service
- Endurance

The experience should not feel like a casual social network. It should feel like a disciplined brotherhood and formation environment.

---

## Future Course Requirements

Courses should support discipleship, masculine discipline, spiritual warfare, leadership, identity, and future products such as `La Guerra Interior`.

### Future Course Pages

```text
/cursos
/cursos/[slug]
/cursos/[slug]/lecciones
/cursos/[slug]/lecciones/[lessonSlug]
/miembros/cursos
```

### Future Course Features

- Course catalog
- Course landing pages
- Lesson pages
- Video or audio lessons
- Written lesson content
- Downloadable worksheets
- Progress tracking
- Completion states
- Private course access
- Purchase or membership gating
- Email reminders
- Course-specific discussion prompts

### Future Course Data Model

Each course should support:

- Title
- Subtitle
- Description
- Audience
- Learning outcome
- Modules
- Lessons
- Resources
- Access level
- Status
- SEO metadata

### Course Canon Requirements

Courses must remain:

- Christian
- Mission-driven
- Discipline-centered
- Practical
- Spiritually grounded
- Masculine without performative dominance
- Direct without becoming careless

Courses should avoid:

- Generic self-help framing
- Trend-driven masculinity
- Soft motivational structure
- Entertainment-first teaching

---

## SEO Strategy

The SEO strategy should support Spanish-first discovery while preparing for English expansion later.

### Primary SEO Goals

- Rank for La Ultima Vigilia branded terms.
- Capture men searching for Christian discipline and spiritual warfare content.
- Build authority around masculine discipleship, purpose, vigilance, and identity.
- Turn search traffic into email subscribers.

### Core Spanish Keyword Themes

- guerra espiritual hombres cristianos
- disciplina cristiana para hombres
- proposito espiritual del hombre
- hombres cristianos y tentacion
- como vencer la tentacion cristiana
- masculinidad cristiana
- liderazgo cristiano masculino
- identidad en Cristo para hombres
- hombres de fe y disciplina
- vigilancia espiritual

### Branded Keywords

- La Ultima Vigilia
- La Guerra Silenciosa
- La Guerra Interior
- El Remanente
- The Watchman Universe

### Technical SEO Requirements

- Clean Spanish URL slugs.
- Unique title and meta description for every page.
- Open Graph metadata.
- Sitemap.
- Robots configuration.
- Canonical URLs.
- Article schema where appropriate.
- Fast mobile performance.
- Accessible heading structure.
- Descriptive image alt text.

### Content SEO Requirements

Every article should include:

- Clear search intent.
- Spanish-first title.
- Meta description.
- Category.
- Tags.
- Canon-safe imagery.
- Internal links.
- Email capture CTA.
- Related articles where useful.

### SEO Caution

SEO must not dilute the brand voice. Search optimization should never turn the writing into generic Christian self-help content.

---

## Content Strategy

The content strategy exists to awaken, confront, clarify, and call men forward.

### Content Pillars

The website must support these ten pillars:

1. Spiritual Warfare
2. Masculine Discipline
3. Purpose
4. Faith
5. Identity
6. Leadership
7. Vigilance
8. Brotherhood
9. Self-Mastery
10. Truth

### Primary Content Types

- Blog articles
- Email newsletters
- Lead magnets
- PDF guides
- Devotionals
- Community prompts
- Course lessons
- Archetype explainers
- Enemy/corruption explainers
- Short-form social content

### Blog Content Strategy

The blog should publish articles that:

- Name a real battle men face.
- Expose the spiritual or psychological root.
- Connect the issue to discipline, vigilance, faith, or purpose.
- Offer a clear next step.
- Invite the reader into the email funnel.

Recommended article formats:

- Battle diagnosis
- Archetype reflection
- Enemy/corruption warning
- Discipline teaching
- Purpose and identity article
- Brotherhood and responsibility article
- Scriptural or devotional reflection

### Newsletter Content Strategy

The newsletter should feel like:

- A battlefield briefing
- A warning
- A direct call to discipline
- A private letter to men who know they have been drifting

It should not feel like:

- A generic brand update
- A soft motivational email
- A corporate newsletter
- A casual content roundup

### Watchman Universe Content Strategy

The Watchman Universe should be introduced gradually.

Version 1 should explain:

- The universe is symbolic, not fantasy.
- Archetypes represent real masculine battles.
- Enemies represent destructive forces.
- Babylon represents distraction, comfort, corruption, and spiritual sleep.

Future content can expand:

- Archetype pages
- Forces of Corruption pages
- Environment pages
- Visual archive pages
- Lore-based essays
- Email sequences by archetype

### Lead Magnet Strategy

`La Guerra Silenciosa` is the primary entry point.

It should be promoted on:

- Homepage
- Dedicated landing page
- Blog articles
- Footer CTA
- Social content
- Newsletter signup paths

The promise must stay clear:

```text
7 batallas que estan destruyendo el proposito espiritual de los hombres.
```

### Content Voice Requirements

All content must be:

- Direct
- Masculine
- Stoic
- Serious
- Spiritually grounded
- Honest
- Confrontational when necessary
- Emotionally restrained

Avoid:

- Corporate language
- Self-help cliches
- Soft motivational language
- Excessive positivity
- Trendy internet language
- Influencer-style masculinity
- Generic inspiration

---

## Measurement Strategy

The website should measure the mission-critical funnel.

### Required Events

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

### Primary KPIs

- Homepage visitor to subscriber conversion rate.
- Lead magnet page conversion rate.
- Blog reader to subscriber conversion rate.
- PDF delivery success rate.
- Thank-you page to El Remanente click rate.
- El Remanente interest conversion rate.

---

## Version 1 Success Definition

Version 1 is successful when:

- A first-time visitor understands the mission quickly.
- Email capture works reliably.
- `La Guerra Silenciosa` is delivered.
- El Remanente is introduced clearly.
- The site feels dark, cinematic, grounded, and serious.
- The writing feels Spanish-first, direct, and spiritually weighty.
- The architecture can expand into blog, courses, membership, and Watchman Universe archive pages.
- Nothing conflicts with the canon documents.

The first version does not need to do everything.

It needs to awaken, capture, deliver, and prepare the road ahead.
