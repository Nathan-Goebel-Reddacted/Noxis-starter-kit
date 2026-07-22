#!/usr/bin/env bash
set -euo pipefail

if ! command -v gitleaks >/dev/null 2>&1; then
  printf "⚠️  gitleaks is not installed — secret scanning skipped.\n"
  printf "   Install it to enable this check: https://github.com/gitleaks/gitleaks\n"
  exit 0
fi

gitleaks protect --staged --redact -q
