#!/usr/bin/env bash
set -euo pipefail

BUCKET="watchman-social-media"
ROOT="references"

upload_dir() {
  local dir="$1"
  [ -d "$dir" ] || return 0

  find "$dir" -type f \( -iname '*.png' -o -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.webp' \) -print0 |
  while IFS= read -r -d '' file; do
    key="${file#${ROOT}/}"
    echo "Uploading $file -> references/$key"
    npx wrangler r2 object put "${BUCKET}/references/${key}" --file="${file}"
  done
}

upload_dir "${ROOT}/archetypes"
upload_dir "${ROOT}/enemies"
upload_dir "${ROOT}/style"

echo "Reference upload complete."
