#!/bin/bash
set -e

cd ~/Desktop/ai-trading-signal-app-v4

set -a
source .env.local
set +a

node scripts/upload_v4_json_to_supabase.mjs

echo ""
echo "Done. Refresh:"
echo "https://signalforge-ai-v4.vercel.app"
