# Watchman Social Automation

Cloudflare-first automation for La Ultima Vigilia.

## Safety defaults

The project ships with all publishing disabled:

- AUTO_PUBLISH=false
- ENABLE_FACEBOOK=false
- ENABLE_INSTAGRAM=false
- ENABLE_TIKTOK=false

Deployment alone cannot publish to social accounts.

## Architecture

Cloudflare Cron
-> D1 content reservoir
-> Workers AI copy
-> Workers AI image
-> R2 media
-> D1 review queue
-> platform publishers
-> publication logs

## Schedule

Cloudflare Cron runs in UTC.

- 0 14 * * * = 08:00 Mexico City
- 0 1 * * * = 19:00 Mexico City

## Bootstrap

From this directory:

```bash
npm install
npx wrangler login
bash scripts/bootstrap-cloudflare.sh
```

Then create the admin secret:

```bash
npx wrangler secret put ADMIN_TOKEN
```

Then deploy:

```bash
npm run deploy
```

Do not enable automatic publishing until generation and each platform have been tested separately.
