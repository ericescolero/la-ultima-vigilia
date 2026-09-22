#!/usr/bin/env bash
set -euo pipefail

DB_NAME="watchman-social-db"
R2_BUCKET="watchman-social-media"

command -v node >/dev/null || { echo 'Node.js is required.' >&2; exit 1; }
command -v npm >/dev/null || { echo 'npm is required.' >&2; exit 1; }

if [ ! -d node_modules ]; then
  npm install
fi

echo 'Checking Cloudflare authentication...'
npx wrangler whoami

echo 'Creating D1 database...'
DB_OUTPUT="$(npx wrangler d1 create "$DB_NAME" 2>&1 || true)"
echo "$DB_OUTPUT"

DB_ID="$(printf '%s\n' "$DB_OUTPUT" | sed -n 's/.*database_id[[:space:]]*=[[:space:]]*"\([^"]*\)".*/\1/p' | head -n 1)"

if [ -z "$DB_ID" ]; then
  echo 'D1 may already exist. Looking it up...'
  DB_ID="$(npx wrangler d1 list --json | node -e '
    let s="";
    process.stdin.on("data",d=>s+=d);
    process.stdin.on("end",()=>{
      const xs=JSON.parse(s);
      const x=xs.find(v=>v.name==="watchman-social-db");
      if(x) process.stdout.write(x.uuid || x.id || "");
    });
  ')"
fi

if [ -z "$DB_ID" ]; then
  echo 'ERROR: Could not determine D1 database ID.' >&2
  exit 1
fi

node - "$DB_ID" <<'NODE'
const fs = require('fs');
const dbId = process.argv[2];
const path = 'wrangler.jsonc';
const text = fs.readFileSync(path, 'utf8');
if (text.includes('"d1_databases"')) {
  console.log('D1 binding already present; leaving wrangler.jsonc unchanged.');
  process.exit(0);
}
const marker = '  "r2_buckets": [';
const insert =
`  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "watchman-social-db",
      "database_id": "${dbId}",
      "migrations_dir": "migrations"
    }
  ],
`;
if (!text.includes(marker)) throw new Error('Could not locate r2_buckets marker');
fs.writeFileSync(path, text.replace(marker, insert + marker));
console.log('Added D1 binding to wrangler.jsonc');
NODE

echo 'Creating R2 bucket...'
npx wrangler r2 bucket create "$R2_BUCKET" || true

echo 'Applying D1 migrations...'
npx wrangler d1 migrations apply "$DB_NAME" --remote

echo 'Seeding starter Watchman content...'
npx wrangler d1 execute "$DB_NAME" --remote --file=./seeds/0001_watchman_seed.sql

echo 'Cloudflare resources are bootstrapped.'
