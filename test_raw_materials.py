#!/usr/bin/env python3
"""
Test script to verify raw_materials persistence
"""
import requests
import json

BASE_URL = "http://localhost:8000/api/admin"

# Test data
test_product = {
    "name": "Test Samosa",
    "category_id": "test-cat-1",  # We'll use a dummy ID
    "category": "Tea",  # Frontend sends this
    "price": 25.00,
    "description": "Test samosa with raw materials",
    "is_veg": True,
    "active": True,
    "raw_materials": [
        {
            "inventory_id": "69d56dfde52fc216f38d779a",
            "quantity": 0.2
        }
    ]
}

print("=" * 60)
print("🧪 Testing Raw Materials Persistence")
print("=" * 60)

# Step 1: Create product with raw_materials
print("\n1️⃣  Creating product with raw_materials...")
print(f"   Data: {json.dumps(test_product, indent=2)}")

try:
    response = requests.post(f"{BASE_URL}/menu-items", json=test_product)
    print(f"   Status: {response.status_code}")
    
    if response.status_code == 200 or response.status_code == 201:
        created = response.json()
        product_id = created.get('_id')
        print(f"   ✅ Created product ID: {product_id}")
        print(f"   Response raw_materials: {created.get('raw_materials')}")
        
        # Step 2: Fetch all products
        print("\n2️⃣  Fetching all products...")
        fetch_response = requests.get(f"{BASE_URL}/menu-items?limit=1000")
        print(f"   Status: {fetch_response.status_code}")
        
        if fetch_response.status_code == 200:
            products = fetch_response.json()
            print(f"   Total products: {len(products)}")
            
            # Find our test product
            test_prod = next((p for p in products if p.get('name') == 'Test Samosa'), None)
            if test_prod:
                print(f"   ✅ Found test product!")
                print(f"   raw_materials in response: {test_prod.get('raw_materials')}")
                if test_prod.get('raw_materials'):
                    print(f"   ✅ raw_materials is NOT empty!")
                else:
                    print(f"   ❌ raw_materials is EMPTY!")
            else:
                print(f"   ❌ Test product not found in response")
        else:
            print(f"   ❌ Failed to fetch: {fetch_response.text}")
    else:
        print(f"   ❌ Failed to create: {response.text}")
        
except Exception as e:
    print(f"   ❌ Error: {e}")

print("\n" + "=" * 60)
