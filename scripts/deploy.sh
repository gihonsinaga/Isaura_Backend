#!/usr/bin/env bash
set -Eeuo pipefail

PROJECT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
LOCK_FILE="${XDG_CACHE_HOME:-$HOME/.cache}/isaura-backend-deploy.lock"

mkdir -p "$(dirname "$LOCK_FILE")"
exec 9>"$LOCK_FILE"
flock -n 9 || { echo "Another backend deployment is running" >&2; exit 1; }

cd "$PROJECT_DIR"
git fetch --prune origin main
git merge-base --is-ancestor HEAD origin/main || { echo "Local branch diverged from origin/main" >&2; exit 1; }
git merge --ff-only origin/main

docker network inspect isaura-network >/dev/null 2>&1 || docker network create isaura-network
docker compose up -d --build

for _ in {1..40}; do
  if [ "$(docker inspect -f '{{.State.Health.Status}}' isaura-backend 2>/dev/null || true)" = "healthy" ]; then
    echo "Isaura backend deployment successful"
    exit 0
  fi
  sleep 3
done

docker compose logs --tail=100 backend >&2 || true
echo "Backend did not become healthy" >&2
exit 1
