#!/bin/bash
set -e

cd ~/Desktop/ai-trading-signal-app-v4

while true; do
  echo ""
  echo "Uploading latest V4 JSON to Supabase..."
  ./upload_live_v4_supabase.sh || echo "Upload failed. Will retry."
  echo "Waiting 60 seconds..."
  sleep 60
done
