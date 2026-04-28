#!/bin/bash

API="http://localhost:8000/api"
TOKEN="your_test_token"

echo "🧪 Testing Inventory Deduction Feature"
echo "======================================"

# Test 1: Get inventory items
echo -e "\n1️⃣ Getting inventory items..."
INVENTORY=$(curl -s -X GET "${API}/admin/inventory" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json")

echo "Inventory: $INVENTORY" | head -50

# Extract first inventory ID
INVENTORY_ID=$(echo "$INVENTORY" | grep -o '"_id":"[^"]*"' | head -1 | cut -d'"' -f4)
echo "Found inventory ID: $INVENTORY_ID"

if [ -z "$INVENTORY_ID" ]; then
  echo "❌ No inventory items found!"
  exit 1
fi

# Test 2: Deduct from inventory
echo -e "\n2️⃣ Testing inventory deduction endpoint..."
DEDUCT_RESPONSE=$(curl -s -X POST "${API}/admin/inventory/${INVENTORY_ID}/deduct-stock" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"deduct_quantity": 0.5}')

echo "Deduction Response:"
echo "$DEDUCT_RESPONSE" | jq '.' 2>/dev/null || echo "$DEDUCT_RESPONSE"

echo -e "\n✅ Test completed!"
