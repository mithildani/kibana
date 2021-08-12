#!/usr/bin/env bash

set -euo pipefail

echo '--- Auth and set up kubectl'

if [[ ! "$(command -v kubectl)" ]]; then
  gcloud components install kubectl
fi

gcloud container clusters get-credentials public-kibana --region us-central1 --project elastic-kibana-184716
kubectl config use-context gke_elastic-kibana-184716_us-central1_public-kibana
