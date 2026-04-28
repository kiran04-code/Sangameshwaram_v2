import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path
import uuid
from datetime import datetime, timezone, timedelta

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

COMBOS = [
    {
        "id": str(uuid.uuid4()),
        "name": "Burger + Fries + Cold Drink",
        "items": ["Veg Cheese Burger", "Peri Peri Fries", "Cold Drink"],
        "price": 129,
        "original_price": 180,
        "savings": 51,
        "description": "Perfect combo for a quick meal",
        "active": True,
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Pizza + Fries + Cold Drink",
        "items": ["Corn Cheese Pizza", "Peri Peri Fries", "Cold Drink"],
        "price": 199,
        "original_price": 259,
        "savings": 60,
        "description": "Delicious pizza combo with extra savings",
        "active": True,
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Chole Bhature + Pulav + Lassi",
        "items": ["Chole Bhature", "Tava Pulav", "Lassi"],
        "price": 169,
        "original_price": 220,
        "savings": 51,
        "description": "Traditional Indian combo meal",
        "active": True,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
]

async def seed_combos():
    print("Seeding combos...")
    await db.combos.delete_many({})
    await db.combos.insert_many(COMBOS)
    print(f"✅ Seeded {len(COMBOS)} combos!")

if __name__ == "__main__":
    asyncio.run(seed_combos())
    client.close()
