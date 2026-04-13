#!/usr/bin/env bash
set -euo pipefail

MAX_BYTES=$((500 * 1024))
LARGE=""

while IFS= read -r file; do
  if [ -f "$file" ]; then
    size=$(wc -c < "$file")
    if [ "$size" -gt "$MAX_BYTES" ]; then
      LARGE="$LARGE\n  $file ($(( size / 1024 )) KB)"
    fi
  fi
done < <(git diff --cached --name-only)

if [ -n "$LARGE" ]; then
  printf "❌ Files exceeding 500 KB:%b\n" "$LARGE"
  exit 1
fi
