#!/usr/bin/env python3
"""Quick script to check if raw_materials are stored in MongoDB"""

import asyncio
from motor.motor_asyncio import AsyncClient
import json

async def check():
    client = AsyncClient("mongodb://localhost:27017")
    db = client.sangameshwar_db
    
    # Find products with raw_materials
    products_with_materials = await db["menu_items"].find({"raw_materials": {"$exists": True, "$ne": None}}).to_list(100)
    
    print(f"\n📊 Products WITH raw_materials field: {len(products_with_materials)}")
    
    if products_with_materials:
        print("\n📋 First 5 products with raw_materials:")
        for product in products_with_materials[:5]:
            print(f"\n  Product: {product.get('name')}")
            print(f"  raw_materials: {json.dumps(product.get('raw_materials', []), indent=4)}")
    
    # Find products without raw_materials (or null)
    products_without_materials = await db["menu_items"].find({"raw_materials": {"$exists": False}}).to_list(5)
    print(f"\n❌ Products WITHOUT raw_materials field: {len(products_without_materials)}")
    if products_without_materials:
        print(f"  Example: {products_without_materials[0].get('name')}")
    
    client.close()

asyncio.run(check())
