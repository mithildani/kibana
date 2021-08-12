#!/usr/bin/env bash

set -euo pipefail

source "$(dirname "${0}")/config.sh"

"$(dirname "${0}")/auth.sh"

echo '--- Prepare yaml'

# TODO
export KIBANA_IMAGE="gcr.io/elastic-kibana-184716/brianseeders/kibana-examples:8.0.0"

TEMPLATE=$(envsubst < "$(dirname "${0}")/kibana.yml")

echo "$TEMPLATE"

echo '--- Deploy yaml'
echo "$TEMPLATE" | kubectl apply -f -
