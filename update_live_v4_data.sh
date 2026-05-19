#!/bin/bash
set -e

cd ~/Desktop/ai-trading-signal-app-v4

echo "Checking V4 JSON files..."
ls -la bot_output_v4/free_market_preview.json bot_output_v4/pro_signals.json

echo ""
echo "Latest scan time:"
grep -n "last_scan" bot_output_v4/free_market_preview.json || true

echo ""
echo "Committing and pushing V4 bot output data..."
git add -f bot_output_v4/free_market_preview.json bot_output_v4/pro_signals.json

if git diff --cached --quiet; then
  echo "No JSON changes to push."
else
  git commit -m "Update live V4 bot output data"
  git push
  echo ""
  echo "Done. Wait for Vercel to redeploy, then refresh:"
  echo "https://signalforge-ai-v4.vercel.app"
fi
