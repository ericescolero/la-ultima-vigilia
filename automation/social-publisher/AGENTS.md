# AGENTS.md — Watchman Social Publisher

Scope: `automation/social-publisher/` on the social automation branch.

This file governs work on the Cloudflare social-publishing implementation. It does not govern Watchman canon itself.

## Read first

For any task in this directory, inspect the files relevant to the request rather than assuming state from memory.

Common starting points:

- `README.md`
- `wrangler.jsonc`
- `src/index.ts`
- `src/services/cycle.ts`
- `src/services/ai.ts`
- `src/services/promptBuilder.ts`
- `src/services/image.ts`
- `src/services/publisher.ts`
- `src/config/visualProfiles.ts`
- `references/README.md`
- migrations when D1 schema/state is relevant.

## Canon dependency

This implementation consumes Watchman Universe canon; it does not define the full canon.

For character, enemy-force, theology, world, or visual-canon questions, consult the current private Watchman brain and follow its own `AGENTS.md`.

Do not "fix" a generation problem by inventing new character canon inside TypeScript.

If a runtime profile and current canon disagree, determine which is stale and update the correct source deliberately.

## System architecture

Current intended flow:

```text
Cloudflare Cron or /admin/run-now
→ select active D1 content item
→ create D1 queue row
→ generate structured Spanish post package
→ build canonical image plan
→ generate/store image in R2
→ save queue output
→ optional auto-publication
→ per-platform publication logs
```

## State model

Keep these states separate.

### Generation success

A queue item may contain generated copy/image without having been published.

### Auto-publish switch

`AUTO_PUBLISH` controls whether a successful generation cycle invokes publication automatically.

### Platform switches

Facebook, Instagram, and TikTok have independent enable flags.

### Publication result

Each enabled platform can succeed or fail independently and writes a publication log.

Never report "posted everywhere" from queue status alone.

## Runtime truth

Do not rely on README bootstrap defaults to describe current runtime.

For configuration claims, check:

1. current branch source;
2. current `wrangler.jsonc`;
3. deployed environment variables/secrets when accessible;
4. live health/queue/log/reference endpoints when accessible.

A local config file does not prove the deployed Worker matches the branch head.

## Diagnostics

Current authenticated admin routes in source include:

- `GET /health`
- `POST /admin/run-now?contentItemId=:id`
- `POST /admin/publish/:id`
- `GET /admin/queue`
- `GET /admin/references`
- `GET /admin/logs`

When diagnosing failures, use this order:

1. health;
2. trigger execution;
3. active D1 content;
4. queue creation/status;
5. structured text generation;
6. image prompt/image generation;
7. R2 object;
8. reference readiness;
9. `AUTO_PUBLISH`;
10. platform enablement;
11. required platform credentials/IDs;
12. publish logs and external API response.

## Generation rules

The current content engine expects:

- natural Spanish;
- no Spanglish;
- exact source/theme/battlefield fidelity;
- psychologically precise, spiritually intense, disciplined voice;
- no fabricated Bible quotations or verse references;
- no generic motivational drift;
- grounded modern scenes by default;
- canonical character/enemy identity locked outside freeform scene generation.

If generated copy is bad, identify whether the fault is:

- weak/stale D1 source material;
- prompt logic;
- schema/normalization;
- model behavior;
- downstream formatting.

Do not immediately widen prompts with generic inspiration language.

## Visual rules

`src/config/visualProfiles.ts` is the implementation-level visual lock for the Worker.

It currently encodes:

- dark cinematic realism;
- live-action film-frame quality;
- grounded modern mythology;
- human-scale believable materials;
- restrained emotion;
- character/enemy-specific scene constraints;
- negative rules against superhero/comic/game/fantasy drift;
- raw images without text/logo/watermark.

Canonical subject reference images live in R2 under the keys documented in `references/README.md`.

The system can fall back to locked text profiles when some references are absent. Missing a reference does not automatically mean all generation is unavailable.

## Safety and secrets

Never commit secret values.

Do not expose:

- `ADMIN_TOKEN`;
- Meta access tokens;
- TikTok access tokens;
- API credentials;
- private environment values.

`.dev.vars.example` may document names/placeholders only.

## Write / deployment boundary

Editing code does not automatically authorize deployment.

Diagnosis-only requests are read-only.

For requested fixes:

1. make the smallest source change;
2. preserve existing D1/R2/Worker bindings unless the change requires them;
3. run relevant validation/tests if available;
4. review config implications;
5. deploy only when the user requested deployment or the current incident workflow explicitly authorizes it.

Do not change production platform enablement merely to make a test pass.

## Database changes

D1 schema changes require a migration.

Do not rewrite an applied migration to change production history.

Add a new migration and preserve compatibility where practical.

## Reference changes

Do not replace a canonical R2 reference merely because a newly generated image is aesthetically stronger.

Reference replacement is a canon/visual-identity decision.

## Branch boundary

This social branch has diverged from public `main`.

Do not assume public-main changes exist here until merged/cherry-picked deliberately.

Likewise, do not merge social automation into `main` merely for convenience without reviewing the deployment/public-repo impact.
