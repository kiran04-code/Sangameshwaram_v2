#!/bin/bash

API="http://localhost:8000/api/admin"
TOKEN="test-token"

echo "📝 Creating test product with raw_materials..."

# Create a product with raw_materials
PRODUCT=$(curl -s -X POST "${API}/menu-items" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Samosa",
    "category": "Snacks",
    "price": 20,
    "description": "Test samosa with raw materials tracking",
    "is_veg": true,
    "raw_materials": [
      {
        "inventory_id": "69d56dfde52fc216f38d779a",
        "quantity": 0.2
      }
    ]
  }')

echo "Product created:"
echo "$PRODUCT" | jq '.'

PRODUCT_ID=$(echo "$PRODUCT" | jq -r '._id // empty')
echo -e "\n✅ Product ID: $PRODUCT_ID"
echo "✅ Inventory ID (Potato): 69d56dfde52fc216f38d779a"
echo "✅ Quantity per item: 0.2 kg"

