#!/bin/bash

API="http://localhost:8000/api"
TOKEN="test-token"

echo "🧪 Testing Full Inventory Deduction Flow"
echo "========================================"

# Test 1: Check if we have any menu items with raw_materials
echo -e "\n1️⃣ Getting menu items with raw_materials..."
MENU_ITEMS=$(curl -s -X GET "${API}/admin/menu-items?limit=100" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json")

# Find a menu item with raw_materials
ITEM_WITH_MATERIALS=$(echo "$MENU_ITEMS" | jq '.[] | select(.raw_materials != null and (.raw_materials | length) > 0) | ._id' -r | head -1)

if [ -z "$ITEM_WITH_MATERIALS" ]; then
  echo "❌ No menu items with raw_materials found!"
  echo "💡 Please add raw_materials to at least one menu item first"
  exit 1
fi

echo "✅ Found menu item with raw_materials: $ITEM_WITH_MATERIALS"

# Get the menu item details
ITEM=$(curl -s -X GET "${API}/admin/menu-items/${ITEM_WITH_MATERIALS}" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json")

ITEM_NAME=$(echo "$ITEM" | jq -r '.name')
echo "   Item Name: $ITEM_NAME"
echo "   Raw Materials:"
echo "$ITEM" | jq '.raw_materials'

# Test 2: Get current inventory levels
echo -e "\n2️⃣ Getting current inventory levels..."
INVENTORY=$(curl -s -X GET "${API}/admin/inventory" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json")

echo "Total inventory items: $(echo "$INVENTORY" | jq '.data | length')"

# Extract inventory before deduction
echo -e "\n3️⃣ Checking inventory before deduction..."
RAW_MATERIALS=$(echo "$ITEM" | jq -r '.raw_materials[0]')
INVENTORY_ID=$(echo "$RAW_MATERIALS" | jq -r '.inventory_id')
QUANTITY_PER_ITEM=$(echo "$RAW_MATERIALS" | jq -r '.quantity')

echo "   Inventory ID: $INVENTORY_ID"
echo "   Quantity per item: $QUANTITY_PER_ITEM"

# Get inventory before
INVENTORY_BEFORE=$(curl -s -X GET "${API}/admin/inventory/${INVENTORY_ID}" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json")

QUANTITY_BEFORE=$(echo "$INVENTORY_BEFORE" | jq -r '.quantity')
echo "   Quantity before: $QUANTITY_BEFORE"

# Test 3: Create a test order
echo -e "\n4️⃣ Creating a test order..."
ORDER=$(curl -s -X POST "${API}/admin/orders" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d "{
    \"customer_name\": \"Test Customer\",
    \"table_number\": \"1\",
    \"items\": [
      {
        \"id\": \"${ITEM_WITH_MATERIALS}\",
        \"name\": \"${ITEM_NAME}\",
        \"price\": 100,
        \"quantity\": 1,
        \"image_url\": \"\"
      }
    ],
    \"subtotal\": 100,
    \"total\": 100
  }")

ORDER_ID=$(echo "$ORDER" | jq -r '.order_id')
echo "✅ Order created: $ORDER_ID"

# Test 4: Mark order as ready (should trigger inventory deduction)
echo -e "\n5️⃣ Marking order as READY (should deduct inventory)..."
UPDATE=$(curl -s -X PUT "${API}/admin/orders/${ORDER_ID}" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"status": "ready"}')

echo "Update response: $(echo "$UPDATE" | jq '.' 2>/dev/null || echo "$UPDATE")"

# Test 5: Check inventory after deduction
echo -e "\n6️⃣ Checking inventory AFTER marking order as ready..."
sleep 1
INVENTORY_AFTER=$(curl -s -X GET "${API}/admin/inventory/${INVENTORY_ID}" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json")

QUANTITY_AFTER=$(echo "$INVENTORY_AFTER" | jq -r '.quantity')
EXPECTED_QUANTITY=$(echo "$QUANTITY_BEFORE - $QUANTITY_PER_ITEM" | bc)

echo "   Quantity before: $QUANTITY_BEFORE"
echo "   Quantity to deduct: $QUANTITY_PER_ITEM"
echo "   Quantity after: $QUANTITY_AFTER"
echo "   Expected: $EXPECTED_QUANTITY"

if [ "$QUANTITY_AFTER" = "$EXPECTED_QUANTITY" ]; then
  echo "✅ SUCCESS! Inventory was correctly deducted!"
else
  echo "❌ FAILED! Inventory not deducted correctly"
  echo "   Expected: $EXPECTED_QUANTITY, Got: $QUANTITY_AFTER"
fi

echo -e "\n✅ Test completed!"
