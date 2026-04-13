#!/usr/bin/env bash
set -euo pipefail

CONFLICTS=""
while IFS= read -r file; do
  if [ -f "$file" ] && grep -qE "^(<{7}|={7}|>{7})" "$file" 2>/dev/null; then
    CONFLICTS="$CONFLICTS\n  $file"
  fi
done < <(git diff --cached --name-only)

if [ -n "$CONFLICTS" ]; then
  printf "❌ Merge conflict markers found in:%b\n" "$CONFLICTS"
  exit 1
fi
