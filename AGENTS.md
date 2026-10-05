# AGENTS.md — La Última Vigilia

Scope: this entire repository on `main`, unless a deeper `AGENTS.md` overrides it for a subdirectory or a task explicitly targets another branch/repository.

## Mission

La Última Vigilia (LUV) is a Spanish-first media, publishing, discipleship, theological-content, and symbolic-fiction ecosystem built around vigilance, spiritual awakening, disciplined Christian formation, and The Watchman Universe.

LUV contains both:

1. **real teaching / publishing / ministry-facing material**, and
2. **fictional or symbolic Watchman Universe narrative material** grounded in the project's Christian theological framework.

Do not collapse those two layers.

The Watchman Universe may dramatize real spiritual and psychological truths, but fictional story events, metaphysical devices, characters, locations, and plot mechanisms do not become doctrine merely because they appear in the fiction.

## Project architecture

LUV spans multiple authoritative homes.

### Public ecosystem / website / published content

Repository: `ericescolero/la-ultima-vigilia`  
Branch: `main`

This repository owns the public website, published Field Manuals, public content, website configuration, email/newsletter architecture, community/public ecosystem material, and public-facing assets.

### Private Watchman canon / theology / production brain

Repository: `ericescolero/watchman-universe-brain`

Canonical branch: `main`

This is the primary current source for Watchman canon, worldbuilding, character continuity, theology/eschatology governance, story development, production rules, and owner decisions. The former `phase-1-import` line has been promoted to `main`.

Read its own root `AGENTS.md` and follow its more specific routing rules when entering that repository.

Do not copy large private-brain files into this public repository merely to make them easier to find.

### Social publishing automation

Repository: `ericescolero/la-ultima-vigilia`  
Branch: `social-automation-bootstrap`  
Path: `automation/social-publisher/`

This branch owns the Cloudflare Worker/D1/R2 social publishing implementation.

For work in that path, read its branch-specific `automation/social-publisher/AGENTS.md` when present.

### Legacy material

Repository: `ericescolero/pyrokryptic_ai`  
Path: `La Ultima Vigilia/`

Treat this as historical/legacy evidence unless Eric explicitly requests migration, recovery, or comparison work.

Do not create new sources of truth there.

## Startup routing

Before acting, identify the task type.

| Task | Primary authority |
|---|---|
| Website, public pages, deployed static site | this repo `main` |
| Published Field Manual | `content/field-manuals/` on this repo `main` |
| Newsletter/email/public ecosystem | this repo `main` |
| Community/public El Remanente architecture | this repo `main` plus current private production guidance when relevant |
| Character identity / canon / archetypes / enemy forces | private Watchman brain |
| Worldbuilding / locations / story continuity | private Watchman brain |
| Theology / eschatology / prophetic chronology | private Watchman brain theology governance |
| Novel/story drafting | private Watchman brain |
| Visual canon for characters/universe | private Watchman brain |
| Social Worker / queue / cron / references / R2 / D1 / publish logs | `social-automation-bootstrap:automation/social-publisher/` |
| Existing public social asset requirements | social branch implementation + private visual canon |
| Historical source recovery | legacy repo only when explicitly needed |

See `docs/agent/SOURCE_OF_TRUTH_MAP.md` for detailed precedence.

## Authority rules

### Current owner instruction wins within scope

A clear current instruction from Eric can change the intended project direction.

Do not reinterpret an explicit owner decision merely because an older file says something else.

### Component authority stays local

Do not use a website file to override current character canon.

Do not use a fictional story file to create theology.

Do not use an old social prompt to override a newer private-brain visual decision.

Do not use legacy `pyrokryptic_ai` material to override current project governance.

### Theology constrains fiction; fiction does not create theology

For doctrinal and prophetic claims:

1. Scripture is highest authority.
2. Current explicit owner decisions govern project interpretation where Scripture permits competing readings.
3. Current eschatology governance in the private Watchman brain controls the project framework.
4. Fiction/story adaptation must remain subordinate.

If a story treatment conflicts with theology governance, fix the story interpretation rather than changing doctrine from the story.

### Published content is a historical/public record

Published Field Manuals are authored in this repo at:

`content/field-manuals/`

The private brain may contain production rules or references to those manuals, but it must not become a second independently edited copy of a published manual.

Do not silently rewrite a published manual to match a later canon change unless Eric asks for a revision.

## Public language

Public-facing LUV copy is Spanish unless Eric explicitly requests another language.

Internal agent/governance files may be English when that improves precision.

## Visual identity

For Watchman Universe visuals, consult the private brain's current `production/VISUAL_RULES.md`, relevant character/location canon, and asset registry.

For website visual implementation, also consult this repo's website/design documents.

For social automation, consult the social branch's locked visual profiles and R2 reference conventions.

General current direction:

- dark cinematic realism;
- live-action film-frame quality;
- grounded modern mythology;
- emotionally restrained subjects;
- believable materials and environments;
- no generic fantasy/comic/superhero drift;
- raw generated image normally contains no typography/logo/watermark unless the requested workflow explicitly adds them later.

See `docs/agent/VISUAL_AND_ASSET_ROUTING.md`.

## Website / production boundary

The production website deploys from this repo's `main` through Cloudflare using the repository build.

Before changing website behavior, read:

- `CLOUDFLARE_DEPLOYMENT_SETTINGS.md`
- `website/docs/DEPLOYMENT.md`
- relevant website requirement/design files.

A merge to `main` may trigger production build/deployment.

Do not make a deployment-affecting change merely to improve documentation or agent convenience if a non-production alternative exists.

See `docs/agent/WEBSITE_AND_ECOSYSTEM.md`.

## Social automation boundary

Do not assume social automation state from memory.

Inspect the active social branch and current configuration/logs.

Important distinctions:

- cron generation;
- queue creation;
- image generation;
- `AUTO_PUBLISH`;
- platform enable flags;
- successful platform publication;

are separate states.

A queue item existing does not mean it published.

An enabled platform does not mean auto-publishing is enabled.

A README safety default may be older than the active `wrangler.jsonc` or deployed environment.

See `docs/agent/SOCIAL_AUTOMATION_ROUTING.md`.

## Write boundaries

A request scoped to one component does not automatically authorize writes to all LUV components.

Cross-component reads are allowed when needed for consistency.

Cross-repository or cross-branch writes require one of:

- the user explicitly requested the multi-component change; or
- the change is necessary to complete the requested operation and does not alter unrelated authority.

When in doubt, keep the write in the component that owns the requested artifact.

Do not publish, deploy, merge, or change external platform settings merely because this file grants routing access.

## Secrets

Never commit:

- Cloudflare tokens;
- Meta access tokens;
- TikTok access tokens;
- API keys;
- passwords;
- private session credentials;
- `.dev.vars`, `.env`, or equivalent secret values.

Configuration may document secret **names**, bindings, and expected roles without values.

## Persistent learning

This is an evolving project.

When Eric gives durable feedback about LUV content, visuals, publishing, routing, automation, or project boundaries:

1. update the most specific governing file;
2. record the durable lesson in `docs/agent/AGENT_LEARNING.md`;
3. do not overwrite private-brain owner decisions from this public repo unless the task explicitly includes that change.

## Agent document map

| Need | Read |
|---|---|
| Overall component architecture | `docs/agent/PROJECT_ARCHITECTURE.md` |
| What source wins | `docs/agent/SOURCE_OF_TRUTH_MAP.md` |
| Canon / theology / fiction relationship | `docs/agent/CANON_THEOLOGY_ROUTING.md` |
| Manuals / public content | `docs/agent/PUBLISHING_AND_MANUALS.md` |
| Visuals / assets | `docs/agent/VISUAL_AND_ASSET_ROUTING.md` |
| Social Worker | `docs/agent/SOCIAL_AUTOMATION_ROUTING.md` |
| Website / Cloudflare / ecosystem | `docs/agent/WEBSITE_AND_ECOSYSTEM.md` |
| Old pyrokryptic material | `docs/agent/LEGACY_BOUNDARIES.md` |
| Durable feedback | `docs/agent/AGENT_LEARNING.md` |
