"""
Menu Management Routes (Categories and Menu Items)
Handles all CRUD operations for categories and menu items
"""

from fastapi import APIRouter, HTTPException, Query, Depends
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict, Any
from datetime import datetime, timezone
import uuid

menu_router = APIRouter(prefix="/api/admin", tags=["admin-menu"])

# Database dependency - will be injected
_db_instance = None

def set_db(db_instance):
    """Set the database instance"""
    global _db_instance
    _db_instance = db_instance

def get_db():
    """Get the database instance"""
    if _db_instance is None:
        raise RuntimeError("Database not initialized. Call set_db() first.")
    return _db_instance

# ============================================================================
# Pydantic Models
# ============================================================================

class CategoryCreate(BaseModel):
    """Model for creating a category"""
    name: str
    name_hi: Optional[str] = None
    name_mr: Optional[str] = None
    image_url: Optional[str] = None
    description: Optional[str] = None
    display_order: int = 0
    active: bool = True

class CategoryUpdate(BaseModel):
    """Model for updating a category"""
    name: Optional[str] = None
    name_hi: Optional[str] = None
    name_mr: Optional[str] = None
    image_url: Optional[str] = None
    description: Optional[str] = None
    display_order: Optional[int] = None
    active: Optional[bool] = None

class MenuItemCreate(BaseModel):
    """Model for creating a menu item"""
    model_config = ConfigDict(extra='allow')  # Allow extra fields
    
    name: str
    name_hi: Optional[str] = None
    name_mr: Optional[str] = None
    category_id: Optional[str] = None  # Made optional to handle frontend sending 'category'
    category: Optional[str] = None  # Frontend sends 'category' field
    price: float
    description: Optional[str] = None
    image_url: Optional[str] = None
    is_veg: bool = True
    active: bool = True
    raw_materials: Optional[List[Dict[str, Any]]] = None  # For recipe cost tracking

class MenuItemUpdate(BaseModel):
    """Model for updating a menu item"""
    model_config = ConfigDict(extra='allow')  # Allow extra fields
    
    name: Optional[str] = None
    name_hi: Optional[str] = None
    name_mr: Optional[str] = None
    category_id: Optional[str] = None  # Made optional to handle frontend sending 'category'
    category: Optional[str] = None  # Frontend sends 'category' field
    price: Optional[float] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    is_veg: Optional[bool] = None
    active: Optional[bool] = None
    raw_materials: Optional[List[Dict[str, Any]]] = None  # For recipe cost tracking

# ============================================================================
# Category Routes
# ============================================================================

@menu_router.get("/categories", response_model=List[Dict])
async def list_categories(
    active: Optional[bool] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100)
):
    """List all categories with optional filtering"""
    db = get_db()
    query = {}
    if active is not None:
        query["active"] = active
    
    categories = await db["categories"].find(query).sort("display_order", 1).skip(skip).limit(limit).to_list(None)
    return categories or []

@menu_router.post("/categories", response_model=Dict)
async def create_category(category: CategoryCreate):
    """Create a new category"""
    db = get_db()
    doc = {
        "_id": str(uuid.uuid4()),
        **category.model_dump(),
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc)
    }
    
    await db["categories"].insert_one(doc)
    return await db["categories"].find_one({"_id": doc["_id"]})

@menu_router.get("/categories/{category_id}", response_model=Dict)
async def get_category(category_id: str):
    """Get category details"""
    db = get_db()
    category = await db["categories"].find_one({"_id": category_id})
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category

@menu_router.put("/categories/{category_id}", response_model=Dict)
async def update_category(category_id: str, category: CategoryUpdate):
    """Update a category"""
    db = get_db()
    update_data = category.model_dump(exclude_unset=True)
    update_data["updated_at"] = datetime.now(timezone.utc)
    
    result = await db["categories"].update_one(
        {"_id": category_id},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Category not found")
    
    return await db["categories"].find_one({"_id": category_id})

@menu_router.delete("/categories/{category_id}")
async def delete_category(category_id: str):
    """Delete a category"""
    db = get_db()
    
    # Check if category has items
    items_count = await db["menu_items"].count_documents({"category_id": category_id})
    if items_count > 0:
        raise HTTPException(
            status_code=400,
            detail=f"Cannot delete category with {items_count} items. Move or delete items first."
        )
    
    result = await db["categories"].delete_one({"_id": category_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Category not found")
    
    return {"success": True, "message": "Category deleted"}

# ============================================================================
# Menu Item Routes
# ============================================================================

@menu_router.get("/menu-items", response_model=List[Dict])
async def list_menu_items(
    category_id: Optional[str] = Query(None),
    active: Optional[bool] = Query(None),
    is_veg: Optional[bool] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500)
):
    """List all menu items with optional filtering"""
    db = get_db()
    query = {}
    
    if category_id:
        query["category_id"] = category_id
    if active is not None:
        query["active"] = active
    if is_veg is not None:
        query["is_veg"] = is_veg
    
    items = await db["menu_items"].find(query).sort("_id", 1).skip(skip).limit(limit).to_list(None)
    
    # Ensure raw_materials is always an array (never None)
    items_with_materials = []
    for item in items:
        if 'raw_materials' not in item or item['raw_materials'] is None:
            item['raw_materials'] = []
        items_with_materials.append(item)
    
    # Log to verify raw_materials is being returned
    if items_with_materials:
        print(f"📋 Returning {len(items_with_materials)} items from database")
        
        # Count items with raw_materials
        items_with_data = [item for item in items_with_materials if item.get('raw_materials') and len(item.get('raw_materials', [])) > 0]
        print(f"   Items WITH raw_materials data: {len(items_with_data)}")
        
        if items_with_data:
            for item in items_with_data[:3]:
                print(f"   - {item.get('name')}: raw_materials = {item.get('raw_materials')}")
    
    return items_with_materials or []

@menu_router.post("/menu-items", response_model=Dict)
async def create_menu_item(item: MenuItemCreate):
    """Create a new menu item"""
    db = get_db()
    
    print(f"\n{'='*60}")
    print(f"📝 CREATE MENU ITEM REQUEST RECEIVED")
    print(f"{'='*60}")
    print(f"Item object: {item}")
    print(f"Item dict: {item.model_dump()}")
    
    # Convert model to dict, explicitly handling raw_materials
    item_dict = item.model_dump()
    
    print(f"\nField analysis:")
    print(f"  'raw_materials' in item_dict: {'raw_materials' in item_dict}")
    print(f"  item_dict['raw_materials']: {item_dict.get('raw_materials')}")
    print(f"  type: {type(item_dict.get('raw_materials'))}")
    
    # Handle category vs category_id mismatch
    # If frontend sent 'category' instead of 'category_id', use it as a string
    # Otherwise verify category_id exists
    if item_dict.get('category_id'):
        category = await db["categories"].find_one({"_id": item_dict['category_id']})
        if not category:
            raise HTTPException(status_code=404, detail="Category not found")
    # If category was sent as string, keep it (for backward compatibility)
    
    # Ensure raw_materials is always a list (even if None was sent)
    if 'raw_materials' not in item_dict or item_dict['raw_materials'] is None:
        item_dict['raw_materials'] = []
    
    # Remove None values for cleaner document, but keep empty arrays
    item_dict = {k: v for k, v in item_dict.items() if v is not None or isinstance(v, list)}
    
    print(f"\nAfter processing:")
    print(f"  'raw_materials' in item_dict: {'raw_materials' in item_dict}")
    print(f"  item_dict['raw_materials']: {item_dict.get('raw_materials')}")
    
    doc = {
        "_id": str(uuid.uuid4()),
        **item_dict,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
        "rating": 0.0,
        "review_count": 0,
        "order_count": 0
    }
    
    print(f"\nFinal document to save:")
    print(f"  'raw_materials' in doc: {'raw_materials' in doc}")
    print(f"  doc['raw_materials']: {doc.get('raw_materials')}")
    print(f"{'='*60}\n")
    
    await db["menu_items"].insert_one(doc)
    saved_doc = await db["menu_items"].find_one({"_id": doc["_id"]})
    
    # Ensure raw_materials is returned as array not None
    if 'raw_materials' not in saved_doc or saved_doc['raw_materials'] is None:
        saved_doc['raw_materials'] = []
    
    return saved_doc

@menu_router.get("/menu-items/{item_id}", response_model=Dict)
async def get_menu_item(item_id: str):
    """Get menu item details"""
    db = get_db()
    item = await db["menu_items"].find_one({"_id": item_id})
    if not item:
        raise HTTPException(status_code=404, detail="Menu item not found")
    
    # Ensure raw_materials is always an array (never None)
    if 'raw_materials' not in item or item['raw_materials'] is None:
        item['raw_materials'] = []
    
    return item

@menu_router.put("/menu-items/{item_id}", response_model=Dict)
async def update_menu_item(item_id: str, item: MenuItemUpdate):
    """Update a menu item"""
    db = get_db()
    
    # If category_id is being changed, verify new category exists
    if item.category_id:
        category = await db["categories"].find_one({"_id": item.category_id})
        if not category:
            raise HTTPException(status_code=404, detail="Category not found")
    
    # Get all data as dict
    update_dict = item.model_dump()
    
    # Remove None values EXCEPT for raw_materials - we want to preserve it
    update_data = {}
    for key, value in update_dict.items():
        if key == 'raw_materials':
            # Always include raw_materials even if it's empty/None - convert None to []
            update_data['raw_materials'] = value if value is not None else []
        elif value is not None:
            update_data[key] = value
    
    update_data["updated_at"] = datetime.now(timezone.utc)
    
    print(f"✅ Updating menu item {item_id}")
    print(f"   Fields being updated: {update_data.keys()}")
    print(f"   raw_materials in update: {update_data.get('raw_materials', 'NOT INCLUDED')}")
    
    result = await db["menu_items"].update_one(
        {"_id": item_id},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Menu item not found")
    
    saved_doc = await db["menu_items"].find_one({"_id": item_id})
    print(f"   After update - raw_materials in DB: {saved_doc.get('raw_materials', 'MISSING!')}")
    
    return saved_doc

@menu_router.delete("/menu-items/{item_id}")
async def delete_menu_item(item_id: str):
    """Delete a menu item"""
    db = get_db()
    
    result = await db["menu_items"].delete_one({"_id": item_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Menu item not found")
    
    return {"success": True, "message": "Menu item deleted"}

# ============================================================================
# Bulk Operations
# ============================================================================

@menu_router.post("/menu-items/bulk/activate")
async def bulk_activate_items(item_ids: List[str]):
    """Activate multiple menu items"""
    db = get_db()
    
    result = await db["menu_items"].update_many(
        {"_id": {"$in": item_ids}},
        {
            "$set": {
                "active": True,
                "updated_at": datetime.now(timezone.utc)
            }
        }
    )
    
    return {
        "success": True,
        "modified_count": result.modified_count,
        "message": f"{result.modified_count} items activated"
    }

@menu_router.post("/menu-items/bulk/deactivate")
async def bulk_deactivate_items(item_ids: List[str]):
    """Deactivate multiple menu items"""
    db = get_db()
    
    result = await db["menu_items"].update_many(
        {"_id": {"$in": item_ids}},
        {
            "$set": {
                "active": False,
                "updated_at": datetime.now(timezone.utc)
            }
        }
    )
    
    return {
        "success": True,
        "modified_count": result.modified_count,
        "message": f"{result.modified_count} items deactivated"
    }

@menu_router.post("/menu-items/bulk/delete")
async def bulk_delete_items(item_ids: List[str]):
    """Delete multiple menu items"""
    db = get_db()
    
    result = await db["menu_items"].delete_many({"_id": {"$in": item_ids}})
    
    return {
        "success": True,
        "deleted_count": result.deleted_count,
        "message": f"{result.deleted_count} items deleted"
    }

# ============================================================================
# Search and Statistics
# ============================================================================

@menu_router.get("/menu-items/search")
async def search_menu_items(
    query: str = Query(..., min_length=1),
    category_id: Optional[str] = Query(None),
    limit: int = Query(20, ge=1, le=100)
):
    """Search menu items by name"""
    db = get_db()
    
    filter_query = {
        "$or": [
            {"name": {"$regex": query, "$options": "i"}},
            {"name_hi": {"$regex": query, "$options": "i"}},
            {"name_mr": {"$regex": query, "$options": "i"}},
            {"description": {"$regex": query, "$options": "i"}}
        ],
        "active": True
    }
    
    if category_id:
        filter_query["category_id"] = category_id
    
    items = await db["menu_items"].find(filter_query).limit(limit).to_list(None)
    return items or []

@menu_router.get("/categories/stats")
async def get_category_stats():
    """Get statistics for all categories"""
    db = get_db()
    
    categories = await db["categories"].find({"active": True}).to_list(None)
    stats = []
    
    for category in categories:
        item_count = await db["menu_items"].count_documents(
            {"category_id": category["_id"], "active": True}
        )
        stats.append({
            "category_id": category["_id"],
            "name": category["name"],
            "item_count": item_count
        })
    
    return stats

# ==================== FREQUENTLY ACCESSED ITEMS ====================

@menu_router.get("/frequent-items")
async def get_frequent_items():
    """Get frequently accessed items (for menu page)"""
    db = get_db()
    
    try:
        items = await db["frequent_items"].find().to_list(None)
        
        # Convert ObjectId to string
        result = []
        for item in items:
            item_dict = dict(item)
            if "_id" in item_dict:
                item_dict["_id"] = str(item_dict["_id"])
            result.append(item_dict)
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching frequent items: {str(e)}")
