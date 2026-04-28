#!/usr/bin/env python3
"""Check raw_materials in MongoDB using pymongo"""

from pymongo import MongoClient
import json

client = MongoClient("mongodb://localhost:27017")
db = client.sangameshwar_db

# Find the Samosa product
samosa = db["menu_items"].find_one({"name": "Samosa"})

if samosa:
    print("\n✅ Found Samosa product")
    print(f"   ID: {samosa.get('_id')}")
    print(f"   raw_materials: {samosa.get('raw_materials')}")
    if samosa.get('raw_materials'):
        print(f"   Type: {type(samosa.get('raw_materials'))}")
        print(f"   Content: {json.dumps(samosa.get('raw_materials'), indent=4)}")
else:
    print("❌ Samosa not found")

# Count total products
total = db["menu_items"].count_documents({})
with_materials = db["menu_items"].count_documents({"raw_materials": {"$exists": True, "$ne": None}})
print(f"\n📊 Total products: {total}")
print(f"📋 Products with raw_materials: {with_materials}")

client.close()
