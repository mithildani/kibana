#!/usr/bin/env bash

set -euo pipefail

source "$(dirname "${0}")/config.sh"

"$(dirname "${0}")/auth.sh"

echo '--- Prepare yaml'

# TODO
export ES_IMAGE="docker.elastic.co/elasticsearch/elasticsearch:8.0.0-alpha1-amd64"

TEMPLATE=$(envsubst < "$(dirname "${0}")/init.yml")

echo "$TEMPLATE"

echo '--- Deploy yaml'
echo "$TEMPLATE" | kubectl apply -f -
