# Social Automation Routing

## Location

Repository: `ericescolero/la-ultima-vigilia`  
Branch: `social-automation-bootstrap`  
Path: `automation/social-publisher/`

This is an implementation branch and has diverged from public `main`.

Do not assume files added to `main` automatically exist on this branch.

## Current architecture

```text
Cloudflare Cron
→ D1 content selection / queue
→ Workers AI copy
→ canonical image plan
→ Workers AI image
→ R2 media
→ D1 queue state
→ optional platform publishing
→ publication logs
```

## Important state distinctions

### Generation

A scheduled/manual cycle can:

- select content;
- create queue row;
- generate text;
- generate/store image;
- mark content used.

This does not prove publication.

### AUTO_PUBLISH

The Worker checks `AUTO_PUBLISH` separately.

When false, successful generation can stop at the queue.

### Platform enablement

Facebook, Instagram, and TikTok each have separate enable flags.

An enabled platform only matters if publication is actually invoked.

### Platform success

Use publish logs/external IDs/errors to determine success.

Do not equate `published` intent with successful API response without checking logs.

## Current admin diagnostics in source

The Worker exposes authenticated diagnostics/actions including:

- `/health`
- `/admin/run-now`
- `/admin/publish/:id`
- `/admin/queue`
- `/admin/references`
- `/admin/logs`

The exact deployed routes may differ if the deployed code is older/newer. Confirm runtime when troubleshooting.

## Troubleshooting order

For "social automation is broken":

1. health;
2. cron/manual trigger reachability;
3. D1 active content availability;
4. queue row/status;
5. text generation error;
6. image generation/R2;
7. reference readiness;
8. `AUTO_PUBLISH`;
9. platform enable flag;
10. platform secrets/IDs;
11. publish log;
12. external API response.

Do not jump directly to Meta/TikTok when generation itself failed.

## Source fidelity

The generation prompt currently requires Spanish public copy and source/theme/battlefield fidelity.

If output drifts, inspect:

- source reservoir item;
- prompt logic;
- normalization;
- visual profile;
- reference image.

Do not "fix" drift by changing canon unless the canon is actually wrong.

## Runtime configuration rule

README examples may describe bootstrap defaults.

`wrangler.jsonc`, deployed environment variables/secrets, Worker version, and live logs determine actual current operation.

Never expose secret values in issue reports, commits, or agent notes.

## Deployment boundary

Do not deploy the Worker merely because code was edited.

Deployment is a separate operational action.

If the user asks only for diagnosis, remain read-only.

If the user asks for a fix, prefer a branch/PR/test workflow before deployment unless an existing incident procedure explicitly says otherwise.
