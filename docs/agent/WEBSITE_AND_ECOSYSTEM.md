# Website and Public Ecosystem

## Production source

Repository: `ericescolero/la-ultima-vigilia`  
Production branch: `main`

The documented Cloudflare production build uses:

- root directory: repository root;
- build command: `npm run build`;
- build output: `website`.

A merge to `main` may therefore trigger production build/deployment.

## Website source areas

Use:

- `website/` for static implementation;
- `website/content/` for structured website content where documented;
- `content/field-manuals/` for authored Field Manuals;
- `docs/` for product/design requirements;
- `newsletter-system/` for email architecture;
- `community/` / relevant docs for public community systems;
- `operations/` for operational planning.

## Generated content rule

The Field Manual build updates generated public outputs.

Do not manually bypass the generator when the source model already owns the output.

## Deployment-sensitive changes

Before changing:

- build command;
- output directory;
- redirects;
- functions;
- CMS;
- generated content pipeline;
- domain/deployment settings;

read:

- `CLOUDFLARE_DEPLOYMENT_SETTINGS.md`;
- `website/docs/DEPLOYMENT.md`;
- related requirements/docs.

## Static-first principle

The current site is intentionally static-first and mission-first.

Do not introduce a heavy framework, runtime dependency, membership backend, or app architecture simply because future expansion is possible.

Use current requirements.

## Email / lead magnet

The current public site includes email capture and lead-magnet delivery architecture.

Never commit provider API keys.

If a future backend is introduced, keep credentials server-side.

## Canon on the website

Public website pages should remain canon-consistent.

However, website copy is not the editing home for private story canon.

If the website needs updated canon:

1. confirm the private current source;
2. prepare an approved public derivative;
3. update the website/public content;
4. preserve privacy/publication boundaries.
