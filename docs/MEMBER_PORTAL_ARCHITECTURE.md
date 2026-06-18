# MEMBER PORTAL ARCHITECTURE

## La Ultima Vigilia

Version: 1.0

---

## Purpose

The member portal is the future private formation layer for El Remanente, courses, resources, and member-only content.

It should not be built as a generic dashboard. It should feel like a command center for vigilance, discipline, brotherhood, and mission.

---

## Portal Goals

1. Give members access to private resources.
2. Support community onboarding.
3. Deliver courses and track progress.
4. Reinforce the Watchman Code.
5. Connect members to weekly rhythms and challenges.
6. Support future paid memberships.

---

## User Roles

```text
visitor
subscriber
waitlist
applicant
member
course-customer
leader
admin
```

Role behavior:

- `visitor`: public site only.
- `subscriber`: email resources and subscriber-only resources.
- `waitlist`: future community interest.
- `applicant`: can complete application/onboarding steps.
- `member`: full member portal access.
- `course-customer`: access to purchased courses.
- `leader`: community moderation and group support.
- `admin`: system management.

---

## Portal Sitemap

```text
/miembros
/miembros/iniciar-sesion
/miembros/registro
/miembros/panel
/miembros/onboarding
/miembros/codigo
/miembros/disciplinas
/miembros/comunidad
/miembros/cursos
/miembros/cursos/[slug]
/miembros/cursos/[slug]/lecciones/[lessonSlug]
/miembros/recursos
/miembros/desafios
/miembros/cuenta
/miembros/admin
```

---

## Core Portal Sections

### Dashboard

Purpose:

- Give the member a clear next action.

Should show:

- Current briefing.
- Daily question.
- Active course.
- Active challenge.
- Recent resources.
- Community prompt.

Should avoid:

- Decorative metrics.
- Vanity streaks.
- Gamification that cheapens the mission.

### Onboarding

Required steps:

1. Welcome to El Remanente.
2. Mission overview.
3. Watchman Code.
4. Oath of the Remnant.
5. Community expectations.
6. Daily disciplines.
7. First assignment.

### Code and Disciplines

Should include:

- Watchman Code.
- Oath.
- Creed.
- Daily practice.
- Daily question.
- Discipline explanations.

### Courses

Should include:

- Enrolled courses.
- Progress.
- Next lesson.
- Downloads.
- Assignments.
- Completion state.

### Community

Should include:

- Discussion prompts.
- Weekly rhythm.
- Brotherhood groups.
- Challenge threads.
- Accountability check-ins.

### Resources

Resource categories:

- PDFs
- Devotionals
- Worksheets
- Briefings
- Audio
- Course materials

### Challenges

Challenge types:

- Vigilance
- Prayer
- Study
- Physical strength
- Work/building
- Self-mastery
- Brotherhood

### Account

Should support:

- Profile.
- Email.
- Password.
- Subscription status.
- Billing link if paid.
- Notification preferences.

---

## Data Model Overview

Future entities:

```text
User
Profile
Role
Subscription
Course
Enrollment
Lesson
Progress
Resource
Challenge
ChallengeParticipation
CommunityPost
Comment
Notification
```

---

## Access Control

Required access checks:

- Public pages.
- Subscriber resources.
- Member resources.
- Paid course access.
- Admin-only management.
- Leader-only moderation.

Access control should be role-based and product-based.

Example:

```text
member + active_subscription → member portal
course-customer + purchased_course → purchased course
leader → moderation tools
admin → admin tools
```

---

## Future Infrastructure Requirements

Potential stack:

- Authentication provider.
- Database.
- Email provider.
- Payment provider.
- File storage.
- Analytics.
- Error monitoring.

Recommended future tools:

- Supabase or Postgres for data.
- Stripe for payments.
- Resend, ConvertKit, MailerLite, or Beehiiv for email.
- Cloud storage for protected downloads.
- Sentry or hosting logs for monitoring.

---

## UX Requirements

The member portal must be:

- Mobile-first.
- Fast.
- Clear.
- Serious.
- Low-noise.
- Focused on next action.
- Visually consistent with dark cinematic realism.

Avoid:

- Bright app dashboards.
- Social media-style feeds as the primary experience.
- Excessive badges.
- Playful gamification.
- Corporate SaaS language.

---

## Member Portal Canon Review

Before implementation, confirm:

- The portal forms men rather than entertaining them.
- The dashboard points to duty, discipline, and next action.
- Courses are active formation, not passive consumption.
- Community reinforces brotherhood and accountability.
- Resources are organized for use, not hoarding.
- The system preserves the Christian foundation and Watchman Code.

