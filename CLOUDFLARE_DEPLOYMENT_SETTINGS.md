# Cloudflare Deployment Settings

This repository is designed to deploy from Cloudflare Pages with the repository root as the project root.

## Required Production Settings

- Production branch: `main`
- Root directory: leave blank / repository root
- Build command: `npm run build`
- Build output directory: `website`

## Why These Settings Matter

Field Manuals are authored through Decap CMS and stored in:

`content/field-manuals/`

During the build, `npm run build` runs the Field Manual generator. That generator updates:

- `website/manuales/index.html`
- `website/manuales/{slug}/index.html`
- `website/sitemap.xml`
- `website/rss.xml`

If Cloudflare skips the build step, newly published CMS manuals may be committed to `main` but not appear publicly because the static output files were not regenerated.

## Backup Regeneration Workflow

The repository includes a GitHub Actions workflow:

`.github/workflows/build-generated-site.yml`

On CMS-related pushes to `main`, the workflow runs:

- `npm ci`
- `npm run build`
- `npm run check`

If generated static files changed, the workflow commits them back to `main` with:

`Regenerate static site after CMS publish`

This is a safety net. Cloudflare should still be configured to run `npm run build`, but the generated site files will also be committed automatically if Cloudflare skips the build step.

## Expected Build Diagnostics

Successful builds should include output similar to:

```text
Field Manual build report:
  GENERATED: example-manual.md
    - /manuales/example-manual/
Field Manual summary: 4 generated, 0 skipped, 0 errors.
```

If a manual is skipped, the generator reports why, such as:

- `missing title`
- `missing slug`
- `invalid slug`
- `draft=true`
- `published=false`
- `status is "draft"`
- `missing body content`

The build fails on duplicate published slugs.
