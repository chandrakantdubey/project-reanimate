#!/usr/bin/env bash
# Run AFTER manually creating the empty public GitHub repository.
set -euo pipefail
cd "$(dirname "$0")/.."
TARGET='https://github.com/chandrakantdubey/project-reanimate.git'
if [[ ! -d .git ]]; then
  git init -b main
fi
if ! git rev-parse HEAD >/dev/null 2>&1; then
  git add -A
  git commit -m 'chore: bootstrap Reanimate architecture and first incident slice'
fi
if git remote get-url origin >/dev/null 2>&1; then
  ACTUAL="$(git remote get-url origin)"
  if [[ "$ACTUAL" != "$TARGET" && "$ACTUAL" != 'git@github.com:chandrakantdubey/project-reanimate.git' ]]; then
    echo "Refusing to push: origin is $ACTUAL, expected $TARGET" >&2
    exit 1
  fi
else
  git remote add origin "$TARGET"
fi
git push -u origin main
