#!/bin/bash

# EasyPanel Auto-Deploy Script
WEBHOOK_URL="http://72.60.222.185:3000/api/deploy/7ea64ad8f3090bc9120d6b0fad679241c2821489cf14363f"

echo "🚀 Triggering EasyPanel deployment..."
curl -X POST "$WEBHOOK_URL"
echo ""
echo "✅ Deployment triggered! Check your EasyPanel dashboard for status."
