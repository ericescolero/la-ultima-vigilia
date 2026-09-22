#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -ne 2 ]; then
  echo "Usage: bash scripts/prepare-reference.sh <source-image> <relative-reference-path>" >&2
  echo "Example:" >&2
  echo "  bash scripts/prepare-reference.sh '/path/The Fire Warrior.png' archetypes/the-fire-warrior.png" >&2
  exit 1
fi

SRC="$1"
REL="$2"
DEST="references/$REL"

if [ ! -f "$SRC" ]; then
  echo "ERROR: Source image not found: $SRC" >&2
  exit 1
fi

mkdir -p "$(dirname "$DEST")"

TMP="${DEST}.tmp.png"

# Cloudflare FLUX.2 reference images must be smaller than 512x512.
# macOS sips preserves aspect ratio when using -Z.
sips -s format png "$SRC" --out "$TMP" >/dev/null
sips -Z 511 "$TMP" --out "$DEST" >/dev/null
rm -f "$TMP"

echo "Prepared: $DEST"
sips -g pixelWidth -g pixelHeight "$DEST"
