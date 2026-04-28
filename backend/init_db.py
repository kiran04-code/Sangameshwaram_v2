#!/usr/bin/env python
"""
MongoDB Collection Initialization Script
Creates all necessary collections and indexes for the Admin Menu Management System
"""

import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

async def initialize_collections():
    """Create MongoDB collections and indexes"""
    
    mongo_url = os.environ['MONGO_URL']
    db_name = os.environ['DB_NAME']
    
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    
    print("🔧 Initializing MongoDB Collections...")
    print(f"📚 Database: {db_name}")
    
    try:
        # 1. Categories Collection
        print("\n1️⃣  Creating 'categories' collection...")
        if "categories" not in await db.list_collection_names():
            await db.create_collection("categories")
            print("   ✅ Collection created")
        
        await db["categories"].create_index("name")
        await db["categories"].create_index("display_order")
        await db["categories"].create_index("active")
        print("   ✅ Indexes created: name, display_order, active")
        
        # 2. Menu Items Collection
        print("\n2️⃣  Creating 'menu_items' collection...")
        if "menu_items" not in await db.list_collection_names():
            await db.create_collection("menu_items")
            print("   ✅ Collection created")
        
        await db["menu_items"].create_index("category")
        await db["menu_items"].create_index("is_veg")
        await db["menu_items"].create_index("is_popular")
        await db["menu_items"].create_index("name")
        print("   ✅ Indexes created: category, is_veg, is_popular, name")
        
        # 3. Frequently Accessed Items Collection
        print("\n3️⃣  Creating 'frequently_accessed_items' collection...")
        if "frequently_accessed_items" not in await db.list_collection_names():
            await db.create_collection("frequently_accessed_items")
            print("   ✅ Collection created")
        
        await db["frequently_accessed_items"].create_index("display_order")
        await db["frequently_accessed_items"].create_index("active")
        print("   ✅ Indexes created: display_order, active")
        
        # 4. Quick Add Items Collection
        print("\n4️⃣  Creating 'quick_add_items' collection...")
        if "quick_add_items" not in await db.list_collection_names():
            await db.create_collection("quick_add_items")
            print("   ✅ Collection created")
        
        await db["quick_add_items"].create_index("display_order")
        await db["quick_add_items"].create_index("active")
        print("   ✅ Indexes created: display_order, active")
        
        # 5. Offers Collection
        print("\n5️⃣  Creating 'offers' collection...")
        if "offers" not in await db.list_collection_names():
            await db.create_collection("offers")
            print("   ✅ Collection created")
        
        await db["offers"].create_index("type")
        await db["offers"].create_index("active")
        await db["offers"].create_index("start_date")
        await db["offers"].create_index("end_date")
        await db["offers"].create_index("priority")
        print("   ✅ Indexes created: type, active, start_date, end_date, priority")
        
        # 6. Best Sellers Collection
        print("\n6️⃣  Creating 'best_sellers' collection...")
        if "best_sellers" not in await db.list_collection_names():
            await db.create_collection("best_sellers")
            print("   ✅ Collection created")
        
        await db["best_sellers"].create_index("display_order")
        await db["best_sellers"].create_index("active")
        print("   ✅ Indexes created: display_order, active")
        
        # 7. Promo Banners Collection
        print("\n7️⃣  Creating 'promo_banners' collection...")
        if "promo_banners" not in await db.list_collection_names():
            await db.create_collection("promo_banners")
            print("   ✅ Collection created")
        
        await db["promo_banners"].create_index("display_order")
        await db["promo_banners"].create_index("active")
        await db["promo_banners"].create_index("start_date")
        print("   ✅ Indexes created: display_order, active, start_date")
        
        # 8. Combos Collection
        print("\n8️⃣  Creating 'combos' collection...")
        if "combos" not in await db.list_collection_names():
            await db.create_collection("combos")
            print("   ✅ Collection created")
        
        await db["combos"].create_index("category")
        await db["combos"].create_index("active")
        print("   ✅ Indexes created: category, active")
        
        print("\n" + "="*60)
        print("✅ All collections and indexes created successfully!")
        print("="*60)
        
        # Print collection info
        print("\n📊 Collections Summary:")
        collections = await db.list_collection_names()
        for col in sorted(collections):
            count = await db[col].count_documents({})
            print(f"   • {col}: {count} documents")
        
    except Exception as e:
        print(f"❌ Error during initialization: {e}")
        raise
    finally:
        client.close()


if __name__ == "__main__":
    print("\n" + "="*60)
    print("🚀 MongoDB Collection Initialization")
    print("="*60)
    asyncio.run(initialize_collections())
    print("\n✨ Done!")
