#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -ne 1 ]; then
  echo "Usage: bash scripts/prepare-all-references.sh <folder-containing-original-images>" >&2
  exit 1
fi

SRC_DIR="$1"

if [ ! -d "$SRC_DIR" ]; then
  echo "ERROR: Folder not found: $SRC_DIR" >&2
  exit 1
fi

prepare() {
  local output="$1"
  shift
  local found=""

  for candidate in "$@"; do
    if [ -f "$SRC_DIR/$candidate" ]; then
      found="$SRC_DIR/$candidate"
      break
    fi
  done

  if [ -z "$found" ]; then
    echo "MISSING: $output"
    return 0
  fi

  bash scripts/prepare-reference.sh "$found" "$output"
}

prepare "archetypes/the-watchman.png"   "The Watchman.png" "The Watchman1.png"

prepare "archetypes/the-exile.png"   "THE EXILE.png" "The Exile.png"

prepare "archetypes/the-fire-warrior.png"   "The Fire Warrior.png"

prepare "archetypes/the-tempted-saint.png"   "The Tempted Saint.png"

prepare "archetypes/the-conqueror.png"   "The Conquerer.png" "The Conqueror.png"

prepare "archetypes/the-builder.png"   "The Builder.png"

prepare "archetypes/the-wounded-protector.png"   "The Wounded Protector.png"

prepare "archetypes/the-mad-prophet.png"   "The Mad Prophet.png"

prepare "enemies/the-whisperer.png"   "The Whisperer.png" "The Whisperer1.png"

prepare "enemies/the-scarlet-queen.png"   "The Scarlet Queen.PNG" "The Scarlet Queen.png"

prepare "enemies/the-usurper.png"   "The Userper.PNG" "The Usurper.PNG" "The Usurper.png"

prepare "enemies/leviathan.png"   "Leviathan.PNG" "Leviathan.png"

echo
echo "Prepared available canonical references under ./references."
echo "Upload them with:"
echo "  bash scripts/upload-references.sh"
