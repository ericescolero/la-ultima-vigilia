# PROJECT DOCUMENTATION MAP

## La Ultima Vigilia

Version: 1.0

---

## Purpose

This document maps every documentation file currently present in the project.

It identifies:

- Purpose.
- Priority.
- Whether the file is authoritative.
- Whether it should be consulted for website development.
- Redundancy or consolidation recommendations.

This map should be reviewed before further implementation.

---

## Priority System

| Priority | Meaning |
| --- | --- |
| Critical | Primary source of truth. Must be read before major work. |
| High | Authoritative for a specific domain. Consult when relevant. |
| Medium | Useful planning or implementation guidance. |
| Low | Local folder note, scaffold note, or operational helper. |
| Content | Content source, not architecture or canon. |

---

## Authoritative Summary

### Primary Authoritative Canon

These files are the highest authority for canon, mission, and universe consistency:

1. `docs/PROJECT_CONTEXT.md`
2. `docs/UNIVERSE_CORE_BIBLE.md`
3. `docs/MASTER_FILES_INDEX.md`

### Domain Authoritative Canon

These files are authoritative only for their specific domain:

- Visual canon: `docs/VISUAL_REFERENCE_ARCHIVE.docx`
- Visual index: `docs/VISUAL_REFERENCE_INDEX.md`
- Writing style: `docs/QUOTE_DATABASE.md`
- Community doctrine: `docs/WATCHMAN_CODE.md`
- Prompt systems: `docs/MASTER_PROMPT_COLLECTION.md`
- Expanded lore: `docs/LORE_EXPANSION.md`

### Website and Systems Authority

These files are authoritative for planning and implementation, but must remain subordinate to canon:

- `docs/WEBSITE_SPECIFICATION.md`
- `docs/DEVELOPMENT_ROADMAP.md`
- `docs/TECHNICAL_ARCHITECTURE.md`
- `docs/CANON_GOVERNANCE.md`
- `docs/EMAIL_SEQUENCE_ARCHITECTURE.md`
- `docs/BLOG_ARCHITECTURE.md`
- `docs/COMMUNITY_ARCHITECTURE.md`
- `docs/COURSE_ARCHITECTURE.md`
- `docs/MEMBER_PORTAL_ARCHITECTURE.md`
- `newsletter-system/EMAIL_CAPTURE_SPEC.md`

---

## Documentation Inventory

| File | Purpose | Priority | Authoritative | Consult for Website Development |
| --- | --- | --- | --- | --- |
| `docs/PROJECT_CONTEXT.md` | Executive summary: mission, brand, audience, archetypes, enemies, website goals, design principles, AI rules. | Critical | Yes | Always |
| `docs/UNIVERSE_CORE_BIBLE.md` | Primary lore, archetype, enemy, environment, visual, and creative canon. | Critical | Yes | Always |
| `docs/MASTER_FILES_INDEX.md` | Defines source-of-truth hierarchy and when to consult each master file. | Critical | Yes | Always |
| `docs/VISUAL_REFERENCE_ARCHIVE.docx` | Primary visual canon for characters, enemies, environments, palettes, lighting, composition, and atmosphere. | Critical | Yes, for visuals | For design, branding, assets, imagery |
| `docs/VISUAL_REFERENCE_INDEX.md` | Index explaining the purpose and authority of the visual archive. | High | Yes, as an index | For visual work |
| `docs/QUOTE_DATABASE.md` | Writing voice, quote systems, psychological language, enemy/archetype language, and content tone. | High | Yes, for writing | For copy, blog, email, landing pages |
| `docs/WATCHMAN_CODE.md` | Philosophical doctrine of The Remnant: code, oath, disciplines, creed, manifesto. | High | Yes, for community doctrine | For El Remanente, membership, courses, emails |
| `docs/MASTER_PROMPT_COLLECTION.md` | Prompt structures, image generation foundations, negative prompts, atmosphere and character prompts. | High | Yes, for prompts | For visual asset planning |
| `docs/LORE_EXPANSION.md` | Expanded mythology, Babylon, Remnant, archetype stories, environments, and lore depth. | Medium | Yes, for expanded lore | For archive pages, long-form content, worldbuilding |
| `docs/WEBSITE_SPECIFICATION.md` | Website sitemap, user journeys, funnel flow, mobile, SEO, content, membership, and course requirements. | Critical | Yes, for website product requirements | Always |
| `docs/DEVELOPMENT_ROADMAP.md` | Development phases, missing folders, missing docs, infrastructure requirements, roadmap. | High | Yes, for execution order | For planning and phase tracking |
| `docs/TECHNICAL_ARCHITECTURE.md` | Technical direction: static-first strategy, hosting, content, email, PDF, analytics, future auth/db. | High | Yes, for technical direction | For implementation planning |
| `docs/CANON_GOVERNANCE.md` | Rules for preserving canon across website, content, visuals, community, courses, and systems. | High | Yes, for governance | Always before major changes |
| `docs/EMAIL_SEQUENCE_ARCHITECTURE.md` | Email sequence strategy, tags, subscriber journey, lead magnet sequence, segmentation, metrics. | High | Yes, for email architecture | For email capture/funnel work |
| `docs/BLOG_ARCHITECTURE.md` | Blog purpose, editorial rules, categories, article types, content model, SEO, conversion strategy. | High | Yes, for blog system | For blog/content work |
| `docs/COMMUNITY_ARCHITECTURE.md` | El Remanente structure, member journey, onboarding, weekly rhythm, rules, community tech requirements. | High | Yes, for community system | For El Remanente and membership work |
| `docs/COURSE_ARCHITECTURE.md` | Course catalog, course types, module/lesson models, future course requirements. | High | Yes, for course system | For courses and future paid products |
| `docs/MEMBER_PORTAL_ARCHITECTURE.md` | Future member portal goals, roles, sitemap, sections, access control, UX, infrastructure. | High | Yes, for member portal | For future private app work |
| `newsletter-system/EMAIL_CAPTURE_SPEC.md` | Tactical email capture fields, tags, provider requirements, flow, failure handling. | High | Yes, for email capture implementation | For form/provider integration |
| `website/docs/WEBSITE_REQUIREMENTS.md` | Condensed local website requirements: pages, forms, outcomes, quality checks. | Medium | No, subordinate to `WEBSITE_SPECIFICATION.md` | Useful quick reference |
| `website/docs/DESIGN_SYSTEM.md` | Local website design tokens and UI guidance. | Medium | No, subordinate to visual canon and website spec | For UI implementation |
| `website/docs/CONTENT_MODEL.md` | Website-local content schemas for pages, articles, lead magnets, archetypes, enemies. | Medium | No, subordinate to architecture docs and config | For content modeling |
| `website/docs/ENVIRONMENT_VARIABLES.md` | Environment variable names and future secret handling. | Medium | Yes, for env naming | For deployment/integration work |
| `website/docs/DEPLOYMENT.md` | Local preview, static hosting, production checklist. | Medium | Yes, for deployment process | For launch/deployment |
| `website/docs/QA_CHECKLIST.md` | Website QA checklist for layout, forms, SEO, accessibility, canon. | Medium | Yes, for QA process | Before release |
| `website/docs/ANALYTICS_PLAN.md` | Analytics events, KPIs, future providers. | Medium | Yes, for analytics implementation | For analytics work |
| `website/README.md` | Local website overview and run instructions. | Low | No | For local onboarding |
| `website/src/README.md` | Explains future source/application layer. | Low | No | For developer orientation |
| `website/src/app/README.md` | Notes future route/app shell purpose. | Low | No | For developer orientation |
| `website/src/components/README.md` | Lists future component responsibilities. | Low | No | For component scaffolding |
| `website/src/features/README.md` | Explains future feature module grouping. | Low | No | For developer orientation |
| `website/src/features/email-capture/README.md` | Local note for email capture feature. | Low | No | For email implementation orientation |
| `website/src/features/pdf-delivery/README.md` | Local note for PDF delivery feature. | Low | No | For PDF delivery orientation |
| `website/src/features/blog/README.md` | Local note pointing to blog architecture. | Low | No | For blog implementation orientation |
| `website/src/features/community/README.md` | Local note pointing to community architecture. | Low | No | For community implementation orientation |
| `website/src/features/courses/README.md` | Local note pointing to course architecture. | Low | No | For course implementation orientation |
| `website/src/features/member-portal/README.md` | Local note pointing to member portal architecture. | Low | No | For member portal orientation |
| `website/src/lib/README.md` | Notes future shared utility/integration folder. | Low | No | For developer orientation |
| `website/content/README.md` | Explains website content collections. | Low | No | For content organization |
| `website/content/pages/home.md` | Structured content source for homepage. | Content | No, content source only | Yes, when editing homepage content |
| `website/content/blog/la-guerra-silenciosa-hombres.md` | Structured content source for starter blog article. | Content | No, content source only | Yes, when editing that article |
| `website/content/lead-magnets/la-guerra-silenciosa.md` | Structured content source for lead magnet metadata. | Content | No, content source only | Yes, for lead magnet page/funnel |
| `website/content/community/el-remanente.md` | Structured content source for El Remanente page. | Content | No, content source only | Yes, for community page copy |
| `website/content/legal/privacidad.md` | Structured source for privacy page. | Content | No, content source only | Only for legal page edits |
| `website/content/legal/terminos.md` | Structured source for terms page. | Content | No, content source only | Only for legal page edits |
| `website/public/README.md` | Notes future public assets folder. | Low | No | Rarely |
| `website/tests/README.md` | Explains test folder categories. | Low | No | For test organization |
| `website/tests/link-checks/README.md` | Notes future link check tests. | Low | No | For test organization |
| `website/tests/form-flows/README.md` | Notes future form flow tests. | Low | No | For test organization |
| `website/tests/accessibility/README.md` | Notes future accessibility tests. | Low | No | For test organization |
| `website/tests/canon/README.md` | Notes future canon consistency tests. | Low | No | For test organization |
| `assets/README.md` | Explains shared asset library. | Low | No | For asset organization |
| `blog/README.md` | Explains top-level blog planning folders and points to blog architecture. | Low | No | For content workflow orientation |
| `community/README.md` | Explains top-level community folders and points to community architecture. | Low | No | For community workflow orientation |
| `courses/README.md` | Explains top-level course folders and points to course architecture. | Low | No | For course workflow orientation |
| `newsletter-system/README.md` | Explains newsletter folders and points to email architecture/capture spec. | Low | No | For newsletter workflow orientation |
| `operations/README.md` | Explains operations folders. | Low | No | For project management |
| `pdf-library/README.md` | Explains PDF library folders. | Low | No | For PDF/product organization |
| `watchman-universe/README.md` | Explains structured universe archive folders and points back to docs. | Low | No | For archive organization |

---

## Redundancy Review

### Keep, But Treat as Local Summaries

These files overlap with higher-level docs but are useful as local implementation summaries:

- `website/docs/WEBSITE_REQUIREMENTS.md`
- `website/docs/DESIGN_SYSTEM.md`
- `website/docs/CONTENT_MODEL.md`
- `website/docs/ANALYTICS_PLAN.md`
- `website/src/**/README.md`
- `website/tests/**/README.md`
- Top-level system `README.md` files

Recommendation:

- Keep them for developer orientation.
- Do not treat them as primary authority.
- If conflicts exist, defer to `docs/WEBSITE_SPECIFICATION.md`, `docs/TECHNICAL_ARCHITECTURE.md`, and canon docs.

### Consolidation Candidates

These could be consolidated later if documentation becomes too noisy:

| File | Consolidate Into |
| --- | --- |
| `website/docs/WEBSITE_REQUIREMENTS.md` | `docs/WEBSITE_SPECIFICATION.md` |
| `website/docs/DESIGN_SYSTEM.md` | Keep local, but cross-reference `VISUAL_REFERENCE_ARCHIVE.docx` more explicitly |
| `website/docs/CONTENT_MODEL.md` | `docs/BLOG_ARCHITECTURE.md`, `docs/WEBSITE_SPECIFICATION.md`, or `website/config/content-models.json` |
| `website/docs/ANALYTICS_PLAN.md` | `docs/WEBSITE_SPECIFICATION.md` or `website/config/analytics-events.json` |
| Multiple local README files | Parent folder README files if maintenance becomes heavy |

### Do Not Delete Yet

No documentation file should be deleted immediately.

The current docs are useful during early scaffolding. Redundancy should be reduced only after the implementation pattern stabilizes.

---

## Recommended Final Documentation Hierarchy

```text
docs/
├── 00_PROJECT_DOCUMENTATION_MAP.md
├── 01_PROJECT_CONTEXT.md
├── 02_MASTER_FILES_INDEX.md
├── 03_UNIVERSE_CORE_BIBLE.md
├── 04_CANON_GOVERNANCE.md
├── 05_WEBSITE_SPECIFICATION.md
├── 06_DEVELOPMENT_ROADMAP.md
├── 07_TECHNICAL_ARCHITECTURE.md
├── canon/
│   ├── VISUAL_REFERENCE_ARCHIVE.docx
│   ├── VISUAL_REFERENCE_INDEX.md
│   ├── QUOTE_DATABASE.md
│   ├── LORE_EXPANSION.md
│   ├── WATCHMAN_CODE.md
│   └── MASTER_PROMPT_COLLECTION.md
├── systems/
│   ├── EMAIL_SEQUENCE_ARCHITECTURE.md
│   ├── BLOG_ARCHITECTURE.md
│   ├── COMMUNITY_ARCHITECTURE.md
│   ├── COURSE_ARCHITECTURE.md
│   └── MEMBER_PORTAL_ARCHITECTURE.md
└── website/
    ├── WEBSITE_REQUIREMENTS.md
    ├── DESIGN_SYSTEM.md
    ├── CONTENT_MODEL.md
    ├── ENVIRONMENT_VARIABLES.md
    ├── DEPLOYMENT.md
    ├── QA_CHECKLIST.md
    └── ANALYTICS_PLAN.md
```

This hierarchy is a recommendation only. The current file locations can remain until the project is ready for a documentation reorganization.

---

## Recommended Read Order for Website Development

For any major website change, read:

1. `docs/PROJECT_CONTEXT.md`
2. `docs/UNIVERSE_CORE_BIBLE.md`
3. `docs/MASTER_FILES_INDEX.md`
4. `docs/WEBSITE_SPECIFICATION.md`
5. `docs/CANON_GOVERNANCE.md`
6. `docs/TECHNICAL_ARCHITECTURE.md`
7. Relevant domain architecture:
   - Email: `docs/EMAIL_SEQUENCE_ARCHITECTURE.md` and `newsletter-system/EMAIL_CAPTURE_SPEC.md`
   - Blog: `docs/BLOG_ARCHITECTURE.md`
   - Community: `docs/COMMUNITY_ARCHITECTURE.md` and `docs/WATCHMAN_CODE.md`
   - Courses: `docs/COURSE_ARCHITECTURE.md`
   - Member portal: `docs/MEMBER_PORTAL_ARCHITECTURE.md`
8. Relevant website-local docs in `website/docs/`

For visual work, also read:

1. `docs/VISUAL_REFERENCE_INDEX.md`
2. `docs/VISUAL_REFERENCE_ARCHIVE.docx`
3. `docs/MASTER_PROMPT_COLLECTION.md`

For writing/copy work, also read:

1. `docs/QUOTE_DATABASE.md`
2. `docs/WATCHMAN_CODE.md` when community, discipleship, or doctrine is involved

---

## Final Recommendation

The documentation architecture should be treated as layered:

1. Canon and mission.
2. Website/product specification.
3. Technical architecture.
4. Domain architecture.
5. Local implementation notes.
6. Content source files.

Local README files and website-local docs should help implementation, but they should never override the master canon or website specification.

