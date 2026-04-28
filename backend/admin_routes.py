"""
Admin Menu Management Routes
Handles all admin operations for categories, menu items, offers, combos, etc.
"""

from fastapi import APIRouter, HTTPException, UploadFile, File, Query, Depends, Request, Header, Form
from fastapi.responses import JSONResponse, FileResponse
from fastapi.exceptions import RequestValidationError
from pydantic import BaseModel, Field, ValidationError, ConfigDict
from typing import List, Optional, Dict, Any
from datetime import datetime, timezone, timedelta
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
import uuid
from enum import Enum
import os
from pathlib import Path
from PIL import Image
import io
import shutil
import json

admin_router = APIRouter(prefix="/api/admin", tags=["admin"])


# Database dependency - will be injected
_db_instance = None

def set_db(db_instance):
    """Set the database instance"""
    global _db_instance
    _db_instance = db_instance

def get_db() -> AsyncIOMotorDatabase:
    """Get the database instance"""
    if _db_instance is None:
        raise RuntimeError("Database not initialized. Call set_db() first.")
    return _db_instance

def convert_doc_to_dict(doc: Dict[str, Any]) -> Dict[str, Any]:
    """Convert MongoDB document to JSON-serializable dict"""
    if doc is None:
        return None
    result = {}
    for key, value in doc.items():
        if key == "_id" and isinstance(value, ObjectId):
            result["_id"] = str(value)
        elif isinstance(value, ObjectId):
            result[key] = str(value)
        elif isinstance(value, datetime):
            result[key] = value.isoformat()
        elif key == "image_url" and isinstance(value, str):
            # Normalize image URLs to include /api prefix
            if value and not value.startswith('http') and value.startswith('/uploads'):
                result[key] = f"/api{value}" if not value.startswith('/api') else value
            else:
                result[key] = value
        elif key == "raw_materials":
            # Ensure raw_materials is always a list (never None)
            result[key] = value if value is not None else []
        else:
            result[key] = value
    return result

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


class Category(BaseModel):
    """Category model with ID"""
    id: str
    name: str
    name_hi: Optional[str] = None
    name_mr: Optional[str] = None
    image_url: Optional[str] = None
    description: Optional[str] = None
    display_order: int
    active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        json_schema_extra = {
            "example": {
                "id": "cat-123",
                "name": "Beverages",
                "image_url": "/uploads/beverages.jpg",
                "display_order": 1,
                "active": True
            }
        }


class MenuItemCreate(BaseModel):
    """Model for creating a menu item"""
    name: str
    name_hi: Optional[str] = None
    name_mr: Optional[str] = None
    category: str
    price: float
    original_price: Optional[float] = None
    description: Optional[str] = None
    description_hi: Optional[str] = None
    description_mr: Optional[str] = None
    image_url: Optional[str] = None
    is_veg: bool = True
    is_popular: bool = False
    rating: Optional[float] = 4.5
    sold_out: bool = False
    variants: Optional[List[Dict[str, Any]]] = None
    tags: Optional[List[str]] = None
    raw_materials: Optional[List[Dict[str, Any]]] = None  # ← ADD THIS for recipe cost tracking


class MenuItemUpdate(BaseModel):
    """Model for updating a menu item"""
    name: Optional[str] = None
    category: Optional[str] = None
    price: Optional[float] = None
    original_price: Optional[float] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    is_veg: Optional[bool] = None
    is_popular: Optional[bool] = None
    rating: Optional[float] = None
    sold_out: Optional[bool] = None
    raw_materials: Optional[List[Dict[str, Any]]] = None  # ← ADD THIS for recipe cost tracking
    variants: Optional[List[Dict[str, Any]]] = None
    tags: Optional[List[str]] = None


class MenuItem(BaseModel):
    """Menu item model with ID"""
    id: Optional[str] = Field(None, alias="_id")
    name: str
    category: str
    price: float
    image_url: Optional[str] = None
    is_veg: bool
    is_popular: bool
    raw_materials: Optional[List[Dict[str, Any]]] = None  # ← ADD THIS for recipe cost tracking
    created_at: datetime
    updated_at: datetime
    
    class Config:
        populate_by_name = True  # Allow both 'id' and '_id'


class OfferType(str, Enum):
    """Types of offers"""
    PERCENTAGE = "percentage"
    AMOUNT = "amount"
    FREE_DELIVERY = "free_delivery"
    COMBO = "combo"
    BANNER = "banner"


class OfferCreate(BaseModel):
    """Model for creating an offer"""
    type: OfferType
    title: str
    subtitle: Optional[str] = None
    icon: Optional[str] = None
    value: float
    min_order_value: Optional[float] = None
    max_discount: Optional[float] = None
    applicable_items: Optional[List[str]] = None  # null = all items
    applicable_categories: Optional[List[str]] = None  # null = all categories
    start_date: datetime
    end_date: datetime
    active: bool = True
    priority: int = 0


class OfferUpdate(BaseModel):
    """Model for updating an offer"""
    type: Optional[OfferType] = None
    title: Optional[str] = None
    subtitle: Optional[str] = None
    value: Optional[float] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    active: Optional[bool] = None
    priority: Optional[int] = None


class Offer(BaseModel):
    """Offer model with ID"""
    id: str
    type: OfferType
    title: str
    value: float
    start_date: datetime
    end_date: datetime
    active: bool
    created_at: datetime
    updated_at: datetime


class FrequentlyAccessedItemCreate(BaseModel):
    """Model for adding frequently accessed item"""
    item_id: str
    name: Optional[str] = None
    category: Optional[str] = None
    image_url: Optional[str] = None
    offer_label: Optional[str] = None
    location: Optional[str] = None
    delivery_time: Optional[str] = None
    display_order: int = 0
    active: bool = True


class QuickAddItemCreate(BaseModel):
    """Model for adding quick add item"""
    item_id: str
    display_order: int = 0
    active: bool = True
    featured_from: Optional[datetime] = None
    featured_until: Optional[datetime] = None


class BestSellerCreate(BaseModel):
    """Model for adding best seller"""
    item_id: str
    display_order: int = 0
    active: bool = True
    featured_from: datetime
    featured_until: Optional[datetime] = None


class PromoBannerCreate(BaseModel):
    """Model for creating promo banner"""
    title: str
    subtitle: Optional[str] = None
    offer_percentage: Optional[int] = None
    image_url: Optional[str] = None
    item_id: Optional[str] = None
    link_url: Optional[str] = None
    start_date: datetime
    end_date: datetime
    active: bool = True
    display_order: int = 0


class ComboItemCreate(BaseModel):
    """Model for combo items"""
    item_id: str
    quantity: int = 1
    optional: bool = False


class ComboCreate(BaseModel):
    """Model for creating a combo"""
    name: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    combo_type: str  # meal, bundle, value_pack
    items: List[ComboItemCreate]
    combo_price: float
    category: Optional[str] = None
    display_order: int = 0
    active: bool = True


class ReorderRequest(BaseModel):
    """Model for reordering items"""
    order: List[str]  # List of item IDs in new order


class BulkDeleteRequest(BaseModel):
    """Model for bulk delete operations"""
    ids: List[str]


# ============================================================================
# Utility Functions
# ============================================================================

def compress_image(image_data: bytes, max_size_kb: int = 100) -> bytes:
    """Compress image to specified size"""
    try:
        img = Image.open(io.BytesIO(image_data))
        
        # Convert any image mode to RGB (handles RGBA, P, L, etc.)
        if img.mode != 'RGB':
            if img.mode == 'RGBA':
                rgb_img = Image.new('RGB', img.size, (255, 255, 255))
                rgb_img.paste(img, mask=img.split()[3])
                img = rgb_img
            elif img.mode == 'P':
                # Convert palette mode to RGB
                img = img.convert('RGB')
            else:
                # Convert any other mode to RGB
                img = img.convert('RGB')
        
        # Compress with quality adjustment
        output = io.BytesIO()
        quality = 85
        while True:
            output.seek(0)
            output.truncate(0)
            img.save(output, format='JPEG', quality=quality, optimize=True)
            size_kb = len(output.getvalue()) / 1024
            
            if size_kb <= max_size_kb or quality <= 30:
                break
            quality -= 5
        
        return output.getvalue()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Image compression failed: {str(e)}")


def save_uploaded_image(upload_file: UploadFile, upload_dir: Path) -> str:
    """Save and compress uploaded image, return relative path"""
    try:
        # Read file data directly (synchronous)
        # Seek to beginning in case file pointer is not at start
        upload_file.file.seek(0)
        file_data = upload_file.file.read()
        
        if not file_data or len(file_data) == 0:
            raise ValueError("File is empty")
        
        # Compress image
        compressed_data = compress_image(file_data)
        
        # Generate unique filename
        file_ext = Path(upload_file.filename).suffix.lower()
        if file_ext not in ['.jpg', '.jpeg', '.png', '.gif', '.webp']:
            file_ext = '.jpg'
        
        filename = f"{uuid.uuid4()}{file_ext}"
        filepath = upload_dir / filename
        
        # Save compressed image
        with open(filepath, 'wb') as f:
            f.write(compressed_data)
        
        # Return full API path so it can be accessed via GET /api/uploads/{filename}
        return f"/api/uploads/{filename}"
    except Exception as e:
        print(f"Error saving image: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Image upload failed: {str(e)}")


# ============================================================================
# Pydantic Models
# ============================================================================

@admin_router.get("/categories", response_model=List[Dict])
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
    # Convert ObjectId to string for JSON serialization
    return [convert_doc_to_dict(cat) for cat in (categories or [])]


@admin_router.post("/categories", response_model=Dict)
async def create_category(category: CategoryCreate):
    """Create a new category"""
    db = get_db()
    doc = {
        "_id": str(uuid.uuid4()),
        **category.model_dump(),
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc)
    }
    
    result = await db["categories"].insert_one(doc)
    return await db["categories"].find_one({"_id": doc["_id"]})


@admin_router.get("/categories/{category_id}", response_model=Category)
async def get_category(
    category_id: str
):
    """Get category details"""
    db = get_db()
    category = await db["categories"].find_one({"_id": category_id})
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category


@admin_router.put("/categories/{category_id}", response_model=Category)
async def update_category(
    category_id: str,
    update_data: CategoryUpdate
):
    """Update category"""
    db = get_db()
    category = await db["categories"].find_one({"_id": category_id})
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    update_dict = update_data.model_dump(exclude_unset=True)
    update_dict["updated_at"] = datetime.now(timezone.utc)
    
    await db["categories"].update_one(
        {"_id": category_id},
        {"$set": update_dict}
    )
    
    return await db["categories"].find_one({"_id": category_id})


@admin_router.delete("/categories/{category_id}")
async def delete_category(
    category_id: str
):
    """Delete category and all its menu items"""
    db = get_db()
    category = await db["categories"].find_one({"_id": category_id})
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    category_name = category.get("name", "")
    print(f"🗑️ [DELETE CATEGORY] Deleting category: {category_name} (ID: {category_id})")
    
    # Delete all menu items in this category
    items_result = await db["menu_items"].delete_many({"category": category_name})
    print(f"🗑️ [DELETE CATEGORY] Deleted {items_result.deleted_count} menu items")
    
    # Delete the category
    result = await db["categories"].delete_one({"_id": category_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=500, detail="Failed to delete category")
    
    print(f"✅ [DELETE CATEGORY] Category deleted successfully with {items_result.deleted_count} items")
    return {
        "message": "Category deleted successfully",
        "id": category_id,
        "items_deleted": items_result.deleted_count
    }


@admin_router.post("/categories/upload-image")
async def upload_category_image(
    file: UploadFile = File(...),
    category_id: Optional[str] = Query(None)
):
    """Upload category image and optionally update category"""
    db = get_db()
    upload_dir = Path(__file__).parent / "uploads"
    upload_dir.mkdir(exist_ok=True)
    
    try:
        image_url = save_uploaded_image(file, upload_dir)
        
        # If category_id is provided, update the category in database
        if category_id:
            result = await db["categories"].update_one(
                {"_id": category_id},
                {
                    "$set": {
                        "image_url": image_url,
                        "updated_at": datetime.now(timezone.utc)
                    }
                }
            )
            if result.matched_count == 0:
                raise HTTPException(status_code=404, detail="Category not found")
        
        return {
            "image_url": image_url,
            "message": "Image uploaded successfully",
            "category_id": category_id
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error uploading image: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Image upload failed: {str(e)}")


# ============================================================================
# Menu Items Endpoints
# ============================================================================

@admin_router.get("/menu-items", response_model=List[Dict])
async def list_menu_items(
    category: Optional[str] = Query(None),
    is_veg: Optional[bool] = Query(None),
    search: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=1000)
):
    """List all menu items with filters"""
    db = get_db()
    query = {}
    if category:
        query["category"] = category
    if is_veg is not None:
        query["is_veg"] = is_veg
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}}
        ]
    
    items = await db["menu_items"].find(query).skip(skip).limit(limit).to_list(None)
    print(f"📖 [LIST MENU ITEMS] Query: {query}, Found: {len(items or [])}, Total in collection: {await db['menu_items'].count_documents({})}")
    # Convert ObjectId to string for JSON serialization
    return [convert_doc_to_dict(item) for item in (items or [])]


@admin_router.post("/menu-items", response_model=MenuItem)
async def create_menu_item(
    item: MenuItemCreate
):
    """Create a new menu item"""
    db = get_db()
    print(f"📝 [CREATE MENU ITEM] Received: category={item.category}, name={item.name}")
    print(f"    raw_materials: {item.raw_materials}")
    
    # Ensure raw_materials is always a list (never None)
    raw_materials_to_save = item.raw_materials if item.raw_materials is not None else []
    
    doc = {
        "_id": str(uuid.uuid4()),
        **item.model_dump(),
        "raw_materials": raw_materials_to_save,  # Explicitly set to ensure it's saved
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc)
    }
    print(f"📄 [CREATE MENU ITEM] Document to insert: raw_materials={doc.get('raw_materials')}")
    
    try:
        result = await db["menu_items"].insert_one(doc)
        print(f"✅ [CREATE MENU ITEM] Insert succeeded with _id: {result.inserted_id}")
    except Exception as e:
        print(f"❌ [CREATE MENU ITEM] Insert failed: {e}")
        raise
    
    # Verify insert by counting documents
    count = await db["menu_items"].count_documents({})
    print(f"📊 [CREATE MENU ITEM] Total documents in collection now: {count}")
    
    created_doc = await db["menu_items"].find_one({"_id": doc["_id"]})
    print(f"📖 [CREATE MENU ITEM] Find returned: {created_doc is not None}")
    if created_doc:
        print(f"📖 [CREATE MENU ITEM] Document raw_materials in DB: {created_doc.get('raw_materials')}")
        created_doc["id"] = created_doc.pop("_id", None)
        # Ensure raw_materials is always a list when returning
        if 'raw_materials' not in created_doc or created_doc['raw_materials'] is None:
            created_doc['raw_materials'] = []
    else:
        print(f"❌ [CREATE MENU ITEM] find_one returned None! Trying to find again...")
        created_doc = await db["menu_items"].find_one({"_id": doc["_id"]})
        print(f"📖 [CREATE MENU ITEM] Second find attempt: {created_doc}")
    
    print(f"✅ [CREATE MENU ITEM] Returning response with raw_materials: {created_doc.get('raw_materials')}")
    return created_doc


# Upload route MUST come before {item_id} parametrized route
@admin_router.post("/upload/menu-item-image")
async def upload_menu_item_image(
    file: UploadFile = File(...),
    item_id: Optional[str] = Query(None)
):
    """Upload menu item image and optionally update menu item"""
    db = get_db()
    upload_dir = Path(__file__).parent / "uploads"
    upload_dir.mkdir(exist_ok=True)
    
    try:
        image_url = save_uploaded_image(file, upload_dir)
        
        # If item_id is provided, update the menu item in database
        if item_id:
            result = await db["menu_items"].update_one(
                {"_id": item_id},
                {
                    "$set": {
                        "image_url": image_url,
                        "updated_at": datetime.now(timezone.utc)
                    }
                }
            )
            if result.matched_count == 0:
                # Still return success - image was uploaded successfully
                # The client can handle the missing item_id gracefully
                return {
                    "image_url": image_url,
                    "message": "Image uploaded successfully (item not found in database)",
                    "item_id": item_id,
                    "warning": "Item not found but image was saved"
                }
        
        return {
            "image_url": image_url,
            "message": "Image uploaded successfully",
            "item_id": item_id
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error uploading image: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Image upload failed: {str(e)}")


@admin_router.post("/upload/category-image")
async def upload_category_image(
    file: UploadFile = File(...),
    category_id: Optional[str] = Query(None)
):
    """Upload category image and optionally update category"""
    db = get_db()
    upload_dir = Path(__file__).parent / "uploads"
    upload_dir.mkdir(exist_ok=True)
    
    try:
        image_url = save_uploaded_image(file, upload_dir)
        
        # If category_id is provided, update the category in database
        if category_id:
            result = await db["categories"].update_one(
                {"_id": category_id},
                {
                    "$set": {
                        "image_url": image_url,
                        "updated_at": datetime.now(timezone.utc)
                    }
                }
            )
            if result.matched_count == 0:
                # Still return success - image was uploaded successfully
                # The client can handle the missing category_id gracefully
                return {
                    "image_url": image_url,
                    "message": "Image uploaded successfully (category not found in database)",
                    "category_id": category_id,
                    "warning": "Category not found but image was saved"
                }
        
        return {
            "image_url": image_url,
            "message": "Image uploaded successfully",
            "category_id": category_id
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error uploading image: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Image upload failed: {str(e)}")


# Bulk operations with specific paths
@admin_router.post("/menu-items/bulk-delete")
async def bulk_delete_items(
    request: BulkDeleteRequest
):
    """Delete multiple menu items"""
    db = get_db()
    result = await db["menu_items"].delete_many({"_id": {"$in": request.ids}})
    return {
        "message": f"Deleted {result.deleted_count} items",
        "deleted_count": result.deleted_count
    }


# Parametrized routes come AFTER specific routes
@admin_router.get("/menu-items/{item_id}", response_model=Dict)
async def get_menu_item(
    item_id: str
):
    """Get menu item details"""
    db = get_db()
    
    # Convert string item_id to ObjectId if it looks like a MongoDB ObjectId
    try:
        query_id = ObjectId(item_id) if len(item_id) == 24 else item_id
    except:
        query_id = item_id
    
    item = await db["menu_items"].find_one({"_id": query_id})
    if not item:
        raise HTTPException(status_code=404, detail="Menu item not found")
    return convert_doc_to_dict(item)


@admin_router.put("/menu-items/{item_id}", response_model=Dict)
async def update_menu_item(
    item_id: str,
    update_data: MenuItemUpdate
):
    """Update menu item"""
    db = get_db()
    
    # Convert string item_id to ObjectId if it looks like a MongoDB ObjectId
    try:
        query_id = ObjectId(item_id) if len(item_id) == 24 else item_id
    except:
        query_id = item_id
    
    item = await db["menu_items"].find_one({"_id": query_id})
    if not item:
        raise HTTPException(status_code=404, detail="Menu item not found")
    
    # Build update dict, explicitly handling raw_materials
    update_dict = {}
    fields = update_data.model_dump()
    
    for key, value in fields.items():
        # Always include raw_materials even if None/empty - convert None to []
        if key == 'raw_materials':
            update_dict['raw_materials'] = value if value is not None else []
        elif value is not None:
            update_dict[key] = value
    
    update_dict["updated_at"] = datetime.now(timezone.utc)
    
    print(f"📝 [UPDATE MENU ITEM] Updating {item_id}")
    print(f"    raw_materials in update: {update_dict.get('raw_materials', 'NOT INCLUDED')}")
    
    await db["menu_items"].update_one(
        {"_id": query_id},
        {"$set": update_dict}
    )
    
    updated_doc = await db["menu_items"].find_one({"_id": query_id})
    print(f"    raw_materials after update: {updated_doc.get('raw_materials', 'MISSING!')}")
    
    # Ensure raw_materials is returned as array not None
    if 'raw_materials' not in updated_doc or updated_doc['raw_materials'] is None:
        updated_doc['raw_materials'] = []
    
    return convert_doc_to_dict(updated_doc)


@admin_router.delete("/menu-items/{item_id}")
async def delete_menu_item(
    item_id: str
):
    """Delete menu item"""
    db = get_db()
    
    # Convert string item_id to ObjectId if it looks like a MongoDB ObjectId
    try:
        query_id = ObjectId(item_id) if len(item_id) == 24 else item_id
    except:
        query_id = item_id
    
    item = await db["menu_items"].find_one({"_id": query_id})
    if not item:
        raise HTTPException(status_code=404, detail="Menu item not found")
    
    result = await db["menu_items"].delete_one({"_id": query_id})


# ============================================================================
# Frequently Accessed Items Endpoints
# ============================================================================

@admin_router.get("/frequently-accessed")
async def list_frequently_accessed(
    active: Optional[bool] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100)
):
    """List frequently accessed items"""
    db = get_db()
    query = {}
    if active is not None:
        query["active"] = active
    
    items = await db["frequently_accessed_items"].find(query).sort("display_order", 1).skip(skip).limit(limit).to_list(None)
    return items or []


@admin_router.post("/frequently-accessed")
async def add_frequently_accessed(
    item: FrequentlyAccessedItemCreate
):
    """Add item to frequently accessed"""
    db = get_db()
    doc = {
        "_id": str(uuid.uuid4()),
        **item.model_dump(),
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc)
    }
    
    await db["frequently_accessed_items"].insert_one(doc)
    return await db["frequently_accessed_items"].find_one({"_id": doc["_id"]})


@admin_router.delete("/frequently-accessed/{item_id}")
async def remove_frequently_accessed(
    item_id: str
):
    """Remove item from frequently accessed"""
    db = get_db()
    result = await db["frequently_accessed_items"].delete_one({"_id": item_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Item not found")
    
    return {"message": "Item removed from frequently accessed"}


@admin_router.put("/frequently-accessed/reorder")
async def reorder_frequently_accessed(
    request: ReorderRequest
):
    """Reorder frequently accessed items"""
    db = get_db()
    for index, item_id in enumerate(request.order):
        await db["frequently_accessed_items"].update_one(
            {"_id": item_id},
            {"$set": {"display_order": index}}
        )
    
    return {"message": "Items reordered successfully"}


# ============================================================================
# Quick Add Items Endpoints
# ============================================================================

@admin_router.get("/quick-add-items")
async def list_quick_add_items(
    active: Optional[bool] = Query(None)
):
    """List quick add items"""
    db = get_db()
    query = {}
    if active is not None:
        query["active"] = active
    
    items = await db["quick_add_items"].find(query).sort("display_order", 1).to_list(None)
    return items or []


@admin_router.delete("/quick-add-items/{item_id}")
async def remove_quick_add_item(
    item_id: str
):
    """Remove item from quick add"""
    db = get_db()
    result = await db["quick_add_items"].delete_one({"_id": item_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Item not found")
    
    return {"message": "Item removed from quick add"}


@admin_router.put("/quick-add-items/reorder")
async def reorder_quick_add_items(
    request: ReorderRequest
):
    """Reorder quick add items"""
    db = get_db()
    for index, item_id in enumerate(request.order):
        await db["quick_add_items"].update_one(
            {"_id": item_id},
            {"$set": {"display_order": index}}
        )
    
    return {"message": "Items reordered successfully"}


# ============================================================================
# Offers Endpoints
# ============================================================================

@admin_router.get("/offers")
async def list_offers(
    offer_type: Optional[OfferType] = Query(None),
    active: Optional[bool] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100)
):
    """List all offers"""
    db = get_db()
    query = {}
    if offer_type:
        query["type"] = offer_type
    if active is not None:
        query["active"] = active
    
    offers = await db["offers"].find(query).sort("priority", -1).skip(skip).limit(limit).to_list(None)
    return offers or []


@admin_router.post("/offers")
async def create_offer(
    offer: OfferCreate
):
    """Create a new offer"""
    db = get_db()
    doc = {
        "_id": str(uuid.uuid4()),
        **offer.model_dump(),
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc)
    }
    
    await db["offers"].insert_one(doc)
    return await db["offers"].find_one({"_id": doc["_id"]})


@admin_router.get("/offers/{offer_id}")
async def get_offer(
    offer_id: str
):
    """Get offer details"""
    db = get_db()
    offer = await db["offers"].find_one({"_id": offer_id})
    if not offer:
        raise HTTPException(status_code=404, detail="Offer not found")
    return offer


@admin_router.put("/offers/{offer_id}")
async def update_offer(
    offer_id: str,
    update_data: OfferUpdate
):
    """Update offer"""
    db = get_db()
    offer = await db["offers"].find_one({"_id": offer_id})
    if not offer:
        raise HTTPException(status_code=404, detail="Offer not found")
    
    update_dict = update_data.model_dump(exclude_unset=True)
    update_dict["updated_at"] = datetime.now(timezone.utc)
    
    await db["offers"].update_one(
        {"_id": offer_id},
        {"$set": update_dict}
    )
    
    return await db["offers"].find_one({"_id": offer_id})


@admin_router.delete("/offers/{offer_id}")
async def delete_offer(
    offer_id: str
):
    """Delete offer"""
    db = get_db()
    result = await db["offers"].delete_one({"_id": offer_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Offer not found")
    
    return {"message": "Offer deleted successfully"}


# ============================================================================
# Offer Image Management Endpoints
# ============================================================================

@admin_router.post("/offers/{offer_id}/images")
async def upload_offer_image(
    offer_id: str,
    file: UploadFile = File(...)
):
    """Upload image for offer carousel"""
    db = get_db()
    
    try:
        # If offer doesn't exist and it's the demo offer, create it
        offer_exists = await db["offers"].find_one({"_id": offer_id})
        if not offer_exists:
            if offer_id == "demo-carousel-offer":
                # Create demo offer in database
                await db["offers"].insert_one({
                    "_id": offer_id,
                    "title": "Featured Campaign",
                    "type": "Discount",
                    "discount_value": 20,
                    "discount_type": "percentage",
                    "active": True,
                    "carousel_images": [],
                    "end_date": (datetime.now(timezone.utc) + timedelta(days=30)).isoformat()
                })
        
        # Create uploads directory if it doesn't exist
        upload_dir = Path("uploads")
        upload_dir.mkdir(exist_ok=True)
        
        # Generate unique filename
        file_extension = Path(file.filename).suffix
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        file_path = upload_dir / unique_filename
        
        # Save file
        contents = await file.read()
        with open(file_path, "wb") as f:
            f.write(contents)
        
        # Create image URL - using the API endpoint for serving images
        image_url = f"/api/admin/uploads/{unique_filename}"
        
        # Add image to offer's carousel_images array
        result = await db["offers"].update_one(
            {"_id": offer_id},
            {
                "$push": {
                    "carousel_images": image_url
                }
            }
        )
        
        return {
            "success": True,
            "image_url": image_url,
            "filename": unique_filename
        }
    
    except Exception as e:
        print(f"Error uploading image: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error uploading image: {str(e)}")


@admin_router.delete("/offers/{offer_id}/images")
async def delete_offer_image(
    offer_id: str,
    request: Request
):
    """Delete image from offer carousel"""
    db = get_db()
    
    try:
        # Get image URL from request body
        body = await request.json()
        image_url = body.get("image_url")
        
        if not image_url:
            raise HTTPException(status_code=400, detail="image_url required in request body")
        
        # Remove image from carousel_images array
        result = await db["offers"].update_one(
            {"_id": offer_id},
            {
                "$pull": {
                    "carousel_images": image_url
                }
            }
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Offer not found")
        
        # Try to delete file from disk if it's a server URL
        if image_url.startswith("/api/admin/uploads/"):
            filename = image_url.split("/")[-1]
            file_path = Path("uploads") / filename
            if file_path.exists():
                file_path.unlink()
        elif image_url.startswith("/uploads/"):
            # Handle old path format from earlier uploads
            filename = image_url.split("/")[-1]
            file_path = Path("uploads") / filename
            if file_path.exists():
                file_path.unlink()
        
        return {
            "success": True,
            "message": "Image deleted successfully"
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting image: {str(e)}")


# ============================================================================
# Best Sellers Endpoints
# ============================================================================

@admin_router.get("/best-sellers")
async def list_best_sellers(
    active: Optional[bool] = Query(None)
):
    """List best sellers"""
    db = get_db()
    query = {}
    if active is not None:
        query["active"] = active
    
    items = await db["best_sellers"].find(query).sort("display_order", 1).to_list(None)
    return items or []


@admin_router.post("/best-sellers")
async def add_best_seller(
    item: BestSellerCreate
):
    """Add item to best sellers"""
    db = get_db()
    doc = {
        "_id": str(uuid.uuid4()),
        **item.model_dump(),
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc)
    }
    
    await db["best_sellers"].insert_one(doc)
    return await db["best_sellers"].find_one({"_id": doc["_id"]})


@admin_router.delete("/best-sellers/{item_id}")
async def remove_best_seller(
    item_id: str
):
    """Remove item from best sellers"""
    db = get_db()
    result = await db["best_sellers"].delete_one({"_id": item_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Item not found")
    
    return {"message": "Item removed from best sellers"}


@admin_router.put("/best-sellers/reorder")
async def reorder_best_sellers(
    request: ReorderRequest
):
    """Reorder best sellers"""
    db = get_db()
    for index, item_id in enumerate(request.order):
        await db["best_sellers"].update_one(
            {"_id": item_id},
            {"$set": {"display_order": index}}
        )
    
    return {"message": "Best sellers reordered successfully"}


# ============================================================================
# Promo Banners Endpoints
# ============================================================================

@admin_router.get("/promo-banners")
async def list_promo_banners(
    active: Optional[bool] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100)
):
    """List promo banners"""
    db = get_db()
    query = {}
    if active is not None:
        query["active"] = active
    
    banners = await db["promo_banners"].find(query).sort("display_order", 1).skip(skip).limit(limit).to_list(None)
    return banners or []


@admin_router.post("/promo-banners")
async def create_promo_banner(
    banner: PromoBannerCreate
):
    """Create promo banner"""
    db = get_db()
    doc = {
        "_id": str(uuid.uuid4()),
        **banner.model_dump(),
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc)
    }
    
    await db["promo_banners"].insert_one(doc)
    return await db["promo_banners"].find_one({"_id": doc["_id"]})


@admin_router.get("/promo-banners/{banner_id}")
async def get_promo_banner(
    banner_id: str
):
    """Get promo banner details"""
    db = get_db()
    banner = await db["promo_banners"].find_one({"_id": banner_id})
    if not banner:
        raise HTTPException(status_code=404, detail="Banner not found")
    return banner


@admin_router.put("/promo-banners/{banner_id}")
async def update_promo_banner(
    banner_id: str,
    update_data: PromoBannerCreate
):
    """Update promo banner"""
    db = get_db()
    banner = await db["promo_banners"].find_one({"_id": banner_id})
    if not banner:
        raise HTTPException(status_code=404, detail="Banner not found")
    
    update_dict = update_data.model_dump(exclude_unset=True)
    update_dict["updated_at"] = datetime.now(timezone.utc)
    
    await db["promo_banners"].update_one(
        {"_id": banner_id},
        {"$set": update_dict}
    )
    
    return await db["promo_banners"].find_one({"_id": banner_id})


@admin_router.delete("/promo-banners/{banner_id}")
async def delete_promo_banner(
    banner_id: str
):
    """Delete promo banner"""
    db = get_db()
    result = await db["promo_banners"].delete_one({"_id": banner_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Banner not found")
    
    return {"message": "Banner deleted successfully"}


@admin_router.post("/promo-banners/upload-image")
async def upload_banner_image(
    file: UploadFile = File(...)
):
    """Upload promo banner image"""
    upload_dir = Path(__file__).parent / "uploads"
    upload_dir.mkdir(exist_ok=True)
    
    image_url = save_uploaded_image(file, upload_dir)
    return {"image_url": image_url, "message": "Image uploaded successfully"}


# ============================================================================
# Combos Endpoints
# ============================================================================

@admin_router.get("/combos")
async def list_combos(
    category: Optional[str] = Query(None),
    active: Optional[bool] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100)
):
    """List all combos"""
    db = get_db()
    query = {}
    if category:
        query["category"] = category
    if active is not None:
        query["active"] = active
    
    combos = await db["combos"].find(query).skip(skip).limit(limit).to_list(None)
    return combos or []


@admin_router.post("/combos")
async def create_combo(
    combo: ComboCreate
):
    """Create a new combo"""
    db = get_db()
    # Calculate total regular price
    regular_price = 0
    if combo.items:
        # Fetch all items to get their prices
        item_ids = [item.item_id for item in combo.items]
        menu_items = await db["menu_items"].find({"_id": {"$in": item_ids}}).to_list(None)
        item_map = {item["_id"]: item["price"] for item in menu_items}
        
        for combo_item in combo.items:
            if combo_item.item_id in item_map:
                regular_price += item_map[combo_item.item_id] * combo_item.quantity
    
    # Calculate savings and discount percentage
    savings = max(0, regular_price - combo.combo_price)
    discount_percentage = int((savings / regular_price * 100)) if regular_price > 0 else 0
    
    doc = {
        "_id": str(uuid.uuid4()),
        **combo.model_dump(),
        "regular_price": regular_price,
        "savings": savings,
        "discount_percentage": discount_percentage,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc)
    }
    
    await db["combos"].insert_one(doc)
    return await db["combos"].find_one({"_id": doc["_id"]})


@admin_router.get("/combos/{combo_id}")
async def get_combo(
    combo_id: str
):
    """Get combo details"""
    db = get_db()
    combo = await db["combos"].find_one({"_id": combo_id})
    if not combo:
        raise HTTPException(status_code=404, detail="Combo not found")
    return combo


@admin_router.put("/combos/{combo_id}")
async def update_combo(
    combo_id: str,
    update_data: ComboCreate
):
    """Update combo"""
    db = get_db()
    combo = await db["combos"].find_one({"_id": combo_id})
    if not combo:
        raise HTTPException(status_code=404, detail="Combo not found")
    
    # Recalculate prices
    regular_price = 0
    if update_data.items:
        item_ids = [item.item_id for item in update_data.items]
        menu_items = await db["menu_items"].find({"_id": {"$in": item_ids}}).to_list(None)
        item_map = {item["_id"]: item["price"] for item in menu_items}
        
        for combo_item in update_data.items:
            if combo_item.item_id in item_map:
                regular_price += item_map[combo_item.item_id] * combo_item.quantity
    
    savings = max(0, regular_price - update_data.combo_price)
    discount_percentage = int((savings / regular_price * 100)) if regular_price > 0 else 0
    
    update_dict = update_data.model_dump(exclude_unset=True)
    update_dict["regular_price"] = regular_price
    update_dict["savings"] = savings
    update_dict["discount_percentage"] = discount_percentage
    update_dict["updated_at"] = datetime.now(timezone.utc)
    
    await db["combos"].update_one(
        {"_id": combo_id},
        {"$set": update_dict}
    )
    
    return await db["combos"].find_one({"_id": combo_id})


@admin_router.delete("/combos/{combo_id}")
async def delete_combo(
    combo_id: str
):
    """Delete combo"""
    db = get_db()
    result = await db["combos"].delete_one({"_id": combo_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Combo not found")
    
    return {"message": "Combo deleted successfully"}


# ==================== FREQUENTLY ACCESSED ITEMS ====================

class FrequentItemUpdate(BaseModel):
    """Model for frequent item"""
    model_config = ConfigDict(populate_by_name=True)
    _id: Optional[str] = None
    name: str
    category: str
    price: float
    image_url: Optional[str] = None
    description: Optional[str] = None
    is_veg: Optional[bool] = True
    delivery_time: Optional[str] = "15 mins"
    discount: Optional[float] = 0
    rating: Optional[float] = 4.5


class QuickAddItemUpdate(BaseModel):
    """Model for quick add item"""
    id: Optional[str] = None
    _id: Optional[str] = None
    name: str
    category: str
    price: float
    image_url: Optional[str] = None
    description: Optional[str] = None
    is_veg: Optional[bool] = True


@admin_router.post("/frequent-items")
async def save_frequent_items(items: List[FrequentItemUpdate]):
    """Save frequently accessed items to database"""
    db = get_db()
    
    print(f"📋 [FREQUENT ITEMS] Received {len(items)} items")
    
    try:
        # Convert items to dict and log them
        items_dict = [item.model_dump() for item in items]
        for idx, item_data in enumerate(items_dict):
            print(f"  Item {idx}: _id={item_data.get('_id')}, name={item_data.get('name')}, category={item_data.get('category')}, price={item_data.get('price')}")
        
        # Clear existing frequent items
        await db["frequent_items"].delete_many({})
        
        # Insert new frequent items
        if items_dict:
            print(f"💾 [FREQUENT ITEMS] Inserting {len(items_dict)} items to database")
            await db["frequent_items"].insert_many(items_dict)
        
        return {
            "message": "Frequent items saved successfully",
            "count": len(items_dict)
        }
    except Exception as e:
        print(f"❌ [FREQUENT ITEMS] Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error saving frequent items: {str(e)}")


@admin_router.get("/frequent-items")
async def get_frequent_items():
    """Get frequently accessed items from database"""
    db = get_db()
    
    try:
        items = await db["frequent_items"].find().to_list(None)
        return [convert_doc_to_dict(item) for item in items]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching frequent items: {str(e)}")


@admin_router.post("/quick-add-items")
async def save_quick_add_items(request: Request):
    """Save quick add items to database"""
    db = get_db()
    
    try:
        # Manually parse request body to get raw JSON
        raw_body = await request.json()
        print(f"📋 [QUICK ADD] Raw request body: {json.dumps(raw_body, indent=2)}")
        
        # Validate it's a list
        if not isinstance(raw_body, list):
            print(f"❌ [QUICK ADD] Expected list, got {type(raw_body)}")
            raise ValueError(f"Expected list of items, got {type(raw_body).__name__}")
        
        print(f"📋 [QUICK ADD] Received {len(raw_body)} items")
        
        # Manually validate each item
        validated_items = []
        for idx, item_data in enumerate(raw_body):
            print(f"  Item {idx}: {json.dumps(item_data, indent=4)}")
            
            # Check required fields
            if not isinstance(item_data, dict):
                raise ValueError(f"Item {idx}: Expected dict, got {type(item_data).__name__}")
            
            if "name" not in item_data or not item_data["name"]:
                raise ValueError(f"Item {idx}: 'name' is required")
            if "category" not in item_data or not item_data["category"]:
                raise ValueError(f"Item {idx}: 'category' is required")
            if "price" not in item_data:
                raise ValueError(f"Item {idx}: 'price' is required")
            
            # Try to parse price as float
            try:
                price = float(item_data["price"])
            except (ValueError, TypeError):
                raise ValueError(f"Item {idx}: 'price' must be a number, got {item_data['price']}")
            
            # Create validated item
            validated_item = {
                "_id": item_data.get("_id") or item_data.get("id") or f"item-{idx}",
                "id": item_data.get("id") or item_data.get("_id") or f"item-{idx}",
                "name": str(item_data["name"]).strip(),
                "category": str(item_data["category"]).strip(),
                "price": price,
                "image_url": item_data.get("image_url"),
                "description": item_data.get("description"),
                "is_veg": bool(item_data.get("is_veg", True))
            }
            validated_items.append(validated_item)
            print(f"  ✅ Item {idx} validated: {validated_item}")
        
        print(f"💾 [QUICK ADD] All {len(validated_items)} items validated successfully")
        
        # Clear existing quick add items
        await db["quick_add_items"].delete_many({})
        
        # Insert new quick add items
        if validated_items:
            result = await db["quick_add_items"].insert_many(validated_items)
            print(f"💾 [QUICK ADD] Inserted {len(result.inserted_ids)} items to database")
        
        return {
            "message": "Quick add items saved successfully",
            "count": len(validated_items)
        }
    except Exception as e:
        error_msg = str(e)
        print(f"❌ [QUICK ADD] Error: {error_msg}")
        print(f"❌ [QUICK ADD] Error type: {type(e).__name__}")
        raise HTTPException(status_code=422, detail=f"Validation error: {error_msg}")


@admin_router.get("/quick-add-items")
async def get_quick_add_items():
    """Get quick add items from database"""
    db = get_db()
    
    try:
        items = await db["quick_add_items"].find().to_list(None)
        return [convert_doc_to_dict(item) for item in items]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching quick add items: {str(e)}")


# ============================================================================
# Orders Management
# ============================================================================

class OrderItem(BaseModel):
    """Model for order items"""
    id: str
    name: str
    price: float
    quantity: int
    image_url: Optional[str] = None

class OrderData(BaseModel):
    """Model for customer orders"""
    customer_name: str
    table_number: str
    items: List[OrderItem]
    subtotal: float
    discount: float = 0
    coupon_code: Optional[str] = None
    total: float
    order_type: str = "dine-in"
    status: str = "pending"  # Allow frontend to specify status (pending or preparing)
    payment_method: Optional[str] = None  # Track payment method (whatsapp or razorpay)

class StockDeductRequest(BaseModel):
    """Model for deducting stock from inventory"""
    deduct_quantity: float = Field(..., gt=0)

@admin_router.post("/orders")
async def create_order(order: OrderData):
    """Create and save a new order to the database"""
    db = get_db()
    
    try:
        order_doc = {
            "customer_name": order.customer_name,
            "table_number": order.table_number,
            "items": [
                {
                    "id": item.id,
                    "name": item.name,
                    "price": item.price,
                    "quantity": item.quantity,
                    "image_url": item.image_url
                }
                for item in order.items
            ],
            "subtotal": order.subtotal,
            "discount": order.discount,
            "coupon_code": order.coupon_code,
            "total": order.total,
            "order_type": order.order_type,
            "status": order.status,  # Use status from frontend (pending or preparing)
            "payment_method": order.payment_method,  # Track payment method
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc)
        }
        
        # Log the order to console
        print("\n" + "="*80)
        print("📋 [ORDER RECEIVED]")
        print("="*80)
        print(f"👤 Customer Name: {order_doc['customer_name']}")
        print(f"🪑 Table Number: {order_doc['table_number']}")
        print(f"📅 Order Time: {order_doc['created_at']}")
        print(f"\n🍽️ Items:")
        for item in order_doc['items']:
            print(f"   • {item['name']} x{item['quantity']} @ ₹{item['price']} = ₹{item['price'] * item['quantity']}")
        print(f"\n💰 Financial Summary:")
        print(f"   Subtotal: ₹{order_doc['subtotal']}")
        if order_doc['discount'] > 0:
            print(f"   Discount ({order_doc['coupon_code']}): -₹{order_doc['discount']}")
        print(f"   Total Amount: ₹{order_doc['total']}")
        print(f"\n📊 Order Type: {order_doc['order_type']}")
        print(f"✅ Status: {order_doc['status']}")
        print("="*80 + "\n")
        
        # Insert into MongoDB
        result = await db["orders"].insert_one(order_doc)
        
        return {
            "message": "Order saved successfully",
            "order_id": str(result.inserted_id),
            "customer_name": order.customer_name,
            "table_number": order.table_number,
            "total": order.total,
            "status": "pending"
        }
    except Exception as e:
        print(f"❌ [ERROR] Failed to save order: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error saving order: {str(e)}")

@admin_router.get("/orders")
async def get_orders(status: Optional[str] = Query(None)):
    """Get orders from database, optionally filtered by status"""
    db = get_db()
    
    try:
        query = {}
        if status:
            query["status"] = status
        
        orders = await db["orders"].find(query).sort("created_at", -1).to_list(None)
        return [convert_doc_to_dict(order) for order in orders]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching orders: {str(e)}")

@admin_router.get("/orders/{order_id}")
async def get_order(order_id: str):
    """Get a specific order by ID"""
    db = get_db()
    
    try:
        order = await db["orders"].find_one({"_id": ObjectId(order_id)})
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        return convert_doc_to_dict(order)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching order: {str(e)}")


class OrderUpdate(BaseModel):
    """Model for updating order status and payment method"""
    status: Optional[str] = None  # pending, processing, preparing, ready, completed, cancelled
    payment_method: Optional[str] = None  # cash, upi
    notes: Optional[str] = None


@admin_router.put("/orders/{order_id}")
async def update_order(order_id: str, update_data: OrderUpdate):
    """Update order status, payment method, and notes"""
    db = get_db()
    
    try:
        update_doc = {"updated_at": datetime.now(timezone.utc)}
        
        if update_data.status:
            update_doc["status"] = update_data.status
        if update_data.payment_method:
            update_doc["payment_method"] = update_data.payment_method
        if update_data.notes:
            update_doc["notes"] = update_data.notes
        
        result = await db["orders"].find_one_and_update(
            {"_id": ObjectId(order_id)},
            {"$set": update_doc},
            return_document=True
        )
        
        if not result:
            raise HTTPException(status_code=404, detail="Order not found")
        
        # Log the status update
        if update_data.status:
            print(f"\n✏️ [ORDER UPDATE] Order #{order_id}")
            print(f"   Status: {update_data.status}")
            if update_data.payment_method:
                print(f"   Payment: {update_data.payment_method}")
            print()
        
        return convert_doc_to_dict(result)
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ [ERROR] Failed to update order: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error updating order: {str(e)}")


# ==================== INVENTORY MANAGEMENT ====================

class InventoryItem(BaseModel):
    """Inventory item model"""
    item_name: str
    quantity: float
    unit: str  # kg, liter, pcs, box, etc.
    min_stock: float
    supplier: str = ""
    image_url: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        json_schema_extra = {
            "example": {
                "item_name": "Tomato",
                "quantity": 50,
                "unit": "kg",
                "min_stock": 20,
                "supplier": "Local Vendor",
                "image_url": "/api/uploads/inventory/tomato.jpg"
            }
        }


class InventoryUpdate(BaseModel):
    """Model for updating inventory"""
    quantity: Optional[float] = None
    min_stock: Optional[float] = None
    supplier: Optional[str] = None
    image_url: Optional[str] = None


# Helper function to convert ObjectId
def convert_inventory_doc(doc: Dict[str, Any]) -> Dict[str, Any]:
    """Convert inventory MongoDB document to JSON-serializable dict"""
    if doc is None:
        return None
    if "_id" in doc and isinstance(doc["_id"], ObjectId):
        doc["_id"] = str(doc["_id"])
    if "created_at" in doc and isinstance(doc["created_at"], datetime):
        doc["created_at"] = doc["created_at"].isoformat()
    if "updated_at" in doc and isinstance(doc["updated_at"], datetime):
        doc["updated_at"] = doc["updated_at"].isoformat()
    
    # Ensure stock_logs have all required fields
    if "stock_logs" in doc and doc["stock_logs"]:
        for i, log in enumerate(doc["stock_logs"]):
            # Convert timestamp to ISO format if it's a datetime
            if "timestamp" in log and isinstance(log["timestamp"], datetime):
                log["timestamp"] = log["timestamp"].isoformat()
            
            # If log is missing calculated fields, fill them in
            if "total_stock_value" not in log or "weighted_avg_price" not in log:
                # Recalculate total stock value from all logs up to this point
                cumulative_value = 0
                cumulative_quantity = 0
                for j in range(i + 1):
                    prev_log = doc["stock_logs"][j]
                    cumulative_value += prev_log.get("added_quantity", 0) * prev_log.get("price_per_unit", 0)
                    cumulative_quantity += prev_log.get("added_quantity", 0)
                
                if "total_stock_value" not in log:
                    log["total_stock_value"] = cumulative_value
                if "weighted_avg_price" not in log:
                    log["weighted_avg_price"] = cumulative_value / cumulative_quantity if cumulative_quantity > 0 else 0
                if "batch_value" not in log:
                    log["batch_value"] = log.get("added_quantity", 0) * log.get("price_per_unit", 0)
    
    return doc


@admin_router.post("/inventory")
async def create_inventory_item(
    item_name: str = Form(...),
    quantity: float = Form(...),
    unit: str = Form(...),
    min_stock: float = Form(...),
    supplier: str = Form(""),
    category: str = Form(""),
    price_per_unit: float = Form(0),
    image: Optional[UploadFile] = File(None),
    authorization: str = Header(...)
):
    """Create a new inventory item with optional image"""
    db = get_db()
    
    # Verify admin token
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")
    
    try:
        upload_dir = Path(__file__).parent / "uploads"
        upload_dir.mkdir(exist_ok=True)
        
        # Handle image upload
        image_url = None
        if image:
            file_ext = image.filename.split('.')[-1]
            image_filename = f"inventory_{uuid.uuid4()}.{file_ext}"
            image_path = upload_dir / image_filename
            
            # Save image
            contents = await image.read()
            with open(image_path, 'wb') as f:
                f.write(contents)
            
            image_url = f"/api/admin/uploads/{image_filename}"
        
        # Create stock log entry for initial quantity
        initial_log = {
            "added_quantity": float(quantity),
            "price_per_unit": float(price_per_unit),
            "quantity_after": float(quantity),
            "batch_value": float(quantity * price_per_unit),
            "total_stock_value": float(quantity * price_per_unit),
            "weighted_avg_price": float(price_per_unit),
            "timestamp": datetime.now(timezone.utc)
        }
        
        # Create inventory document
        inventory_doc = {
            "item_name": item_name,
            "quantity": float(quantity),
            "unit": unit,
            "min_stock": float(min_stock),
            "supplier": supplier,
            "category": category,
            "price_per_unit": float(price_per_unit),
            "image_url": image_url,
            "stock_logs": [initial_log],
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc)
        }
        
        result = await db.inventory.insert_one(inventory_doc)
        
        inventory_doc["_id"] = str(result.inserted_id)
        
        return {
            "status": "success",
            "message": "Inventory item created successfully",
            "data": convert_inventory_doc(inventory_doc)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating inventory item: {str(e)}")


@admin_router.get("/inventory")
async def get_inventory(
    authorization: str = Header(...),
    search: str = Query(None)
):
    """Get all inventory items with optional search"""
    db = get_db()
    
    # Verify admin token
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")
    
    try:
        query = {}
        if search:
            query = {"item_name": {"$regex": search, "$options": "i"}}
        
        items = await db.inventory.find(query).sort("created_at", -1).to_list(None)
        
        return {
            "status": "success",
            "data": [convert_inventory_doc(item) for item in items]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching inventory: {str(e)}")


@admin_router.get("/inventory/{item_id}")
async def get_inventory_item(
    item_id: str,
    authorization: str = Header(...)
):
    """Get a specific inventory item"""
    db = get_db()
    
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")
    
    try:
        item = await db.inventory.find_one({"_id": ObjectId(item_id)})
        if not item:
            raise HTTPException(status_code=404, detail="Inventory item not found")
        
        return {
            "status": "success",
            "data": convert_inventory_doc(item)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching inventory item: {str(e)}")


@admin_router.put("/inventory/{item_id}")
async def update_inventory_item(
    item_id: str,
    item_name: str = Form(None),
    quantity: float = Form(None),
    unit: str = Form(None),
    min_stock: float = Form(None),
    supplier: str = Form(None),
    category: str = Form(None),
    price_per_unit: float = Form(None),
    image: UploadFile = File(None),
    authorization: str = Header(...)
):
    """Update an inventory item"""
    db = get_db()
    
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")
    
    try:
        # Build update dict with only provided fields
        update_dict = {}
        if item_name is not None:
            update_dict["item_name"] = item_name
        if quantity is not None:
            update_dict["quantity"] = quantity
        if unit is not None:
            update_dict["unit"] = unit
        if min_stock is not None:
            update_dict["min_stock"] = min_stock
        if supplier is not None:
            update_dict["supplier"] = supplier
        if category is not None:
            update_dict["category"] = category
        if price_per_unit is not None:
            update_dict["price_per_unit"] = price_per_unit
        
        # Handle image upload if provided
        if image:
            # Get existing item first
            existing_item = await db.inventory.find_one({"_id": ObjectId(item_id)})
            if not existing_item:
                raise HTTPException(status_code=404, detail="Inventory item not found")
            
            # Delete old image if it exists
            if existing_item.get("image_url"):
                old_image_path = existing_item["image_url"].split("/")[-1]
                upload_dir = Path(__file__).parent / "uploads"
                old_file_path = upload_dir / old_image_path
                if old_file_path.exists():
                    old_file_path.unlink()
            
            # Save new image
            upload_dir = Path(__file__).parent / "uploads"
            upload_dir.mkdir(exist_ok=True)
            
            image_extension = Path(image.filename).suffix.lower()
            image_filename = f"inventory_{uuid.uuid4()}{image_extension}"
            image_path = upload_dir / image_filename
            
            content = await image.read()
            with open(image_path, "wb") as f:
                f.write(content)
            
            image_url = f"/api/admin/uploads/{image_filename}"
            update_dict["image_url"] = image_url
        
        update_dict["updated_at"] = datetime.now(timezone.utc)
        
        result = await db.inventory.update_one(
            {"_id": ObjectId(item_id)},
            {"$set": update_dict}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Inventory item not found")
        
        # Fetch updated item
        item = await db.inventory.find_one({"_id": ObjectId(item_id)})
        
        return {
            "status": "success",
            "message": "Inventory item updated successfully",
            "data": convert_inventory_doc(item)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating inventory item: {str(e)}")


@admin_router.delete("/inventory/{item_id}")
async def delete_inventory_item(
    item_id: str,
    authorization: str = Header(...)
):
    """Delete an inventory item"""
    db = get_db()
    
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")
    
    try:
        upload_dir = Path(__file__).parent / "uploads"
        
        # Get item to delete associated image
        item = await db.inventory.find_one({"_id": ObjectId(item_id)})
        
        if not item:
            raise HTTPException(status_code=404, detail="Inventory item not found")
        
        # Delete image file if exists
        if item.get("image_url"):
            image_path = upload_dir / item["image_url"].split("/")[-1]
            if image_path.exists():
                image_path.unlink()
        
        # Delete from database
        result = await db.inventory.delete_one({"_id": ObjectId(item_id)})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Inventory item not found")
        
        return {
            "status": "success",
            "message": "Inventory item deleted successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting inventory item: {str(e)}")


@admin_router.post("/inventory/{item_id}/add-stock")
async def add_stock_to_inventory(
    item_id: str,
    add_quantity: float = Form(...),
    new_price_per_unit: float = Form(...),
    authorization: str = Header(...)
):
    """Add stock to an inventory item with pricing history"""
    db = get_db()
    
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")
    
    try:
        # Get existing item
        existing_item = await db.inventory.find_one({"_id": ObjectId(item_id)})
        
        if not existing_item:
            raise HTTPException(status_code=404, detail="Inventory item not found")
        
        # Calculate new quantity
        new_quantity = existing_item.get("quantity", 0) + add_quantity
        
        # Get existing logs to calculate weighted average price
        existing_logs = existing_item.get("stock_logs", [])
        
        # Calculate current stock value from logs (sum of all quantity * price for each batch)
        current_total_value = 0
        for log in existing_logs:
            current_total_value += log.get("added_quantity", 0) * log.get("price_per_unit", 0)
        
        # Add new batch value
        new_batch_value = add_quantity * new_price_per_unit
        total_stock_value = current_total_value + new_batch_value
        
        # Calculate weighted average price per unit
        weighted_avg_price = total_stock_value / new_quantity if new_quantity > 0 else 0
        
        # Create stock log entry
        stock_log = {
            "added_quantity": float(add_quantity),
            "price_per_unit": float(new_price_per_unit),
            "batch_value": float(new_batch_value),
            "quantity_after": float(new_quantity),
            "total_stock_value": float(total_stock_value),
            "weighted_avg_price": float(weighted_avg_price),
            "timestamp": datetime.now(timezone.utc)
        }
        
        # Update item with new quantity and weighted average price
        result = await db.inventory.update_one(
            {"_id": ObjectId(item_id)},
            {
                "$set": {
                    "quantity": float(new_quantity),
                    "price_per_unit": float(weighted_avg_price),  # Store weighted average
                    "total_stock_value": float(total_stock_value),
                    "updated_at": datetime.now(timezone.utc)
                },
                "$push": {
                    "stock_logs": stock_log
                }
            }
        )
        
        if result.modified_count == 0:
            raise HTTPException(status_code=400, detail="Failed to add stock")
        
        # Fetch updated item
        updated_item = await db.inventory.find_one({"_id": ObjectId(item_id)})
        
        return {
            "status": "success",
            "message": "Stock added successfully",
            "data": convert_inventory_doc(updated_item)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error adding stock: {str(e)}")


@admin_router.post("/inventory/{item_id}/deduct-stock")
async def deduct_stock_from_inventory(
    item_id: str,
    request_data: StockDeductRequest,
    authorization: str = Header(...)
):
    """Deduct stock from an inventory item (used for order fulfillment)"""
    db = get_db()
    
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")
    
    try:
        deduct_quantity = request_data.deduct_quantity
        
        # Get existing item
        existing_item = await db.inventory.find_one({"_id": ObjectId(item_id)})
        
        if not existing_item:
            raise HTTPException(status_code=404, detail="Inventory item not found")
        
        current_quantity = existing_item.get("quantity", 0)
        
        # Check if enough stock available
        if current_quantity < deduct_quantity:
            raise HTTPException(
                status_code=400, 
                detail=f"Insufficient stock. Available: {current_quantity}, Requested: {deduct_quantity}"
            )
        
        # Calculate new quantity
        new_quantity = current_quantity - deduct_quantity
        
        # Create stock log entry for deduction
        stock_log = {
            "deducted_quantity": float(deduct_quantity),
            "quantity_before": float(current_quantity),
            "quantity_after": float(new_quantity),
            "reason": "order_fulfillment",
            "timestamp": datetime.now(timezone.utc)
        }
        
        # Update item with new quantity
        result = await db.inventory.update_one(
            {"_id": ObjectId(item_id)},
            {
                "$set": {
                    "quantity": float(new_quantity),
                    "updated_at": datetime.now(timezone.utc)
                },
                "$push": {
                    "stock_logs": stock_log
                }
            }
        )
        
        if result.modified_count == 0:
            raise HTTPException(status_code=400, detail="Failed to deduct stock")
        
        # Fetch updated item
        updated_item = await db.inventory.find_one({"_id": ObjectId(item_id)})
        
        print(f"✅ Deducted {deduct_quantity} from inventory {item_id}, new quantity: {new_quantity}")
        
        return {
            "status": "success",
            "message": "Stock deducted successfully",
            "data": convert_inventory_doc(updated_item)
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error deducting stock: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error deducting stock: {str(e)}")


@admin_router.get("/inventory/status/low-stock")
async def get_low_stock_items(authorization: str = Header(...)):
    """Get items with low stock"""
    db = get_db()
    
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")
    
    try:
        # Find items where quantity <= min_stock
        items = await db.inventory.find({
            "$expr": {"$lte": ["$quantity", "$min_stock"]}
        }).to_list(None)
        
        return {
            "status": "success",
            "data": [convert_inventory_doc(item) for item in items]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching low stock items: {str(e)}")


# ============================================================================
# Settings Management
# ============================================================================

class CafeSettings(BaseModel):
    """Settings for cafe configuration"""
    model_config = ConfigDict(extra="allow")
    restaurant_name: Optional[str] = None
    restaurant_name_hi: Optional[str] = None
    restaurant_name_mr: Optional[str] = None
    gst_enabled: bool = False
    gst_percentage: float = 5.0
    razorpay_auto_confirm: bool = False
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


@admin_router.get("/settings")
async def get_settings(authorization: str = Header(None)):
    """Get cafe settings"""
    db = get_db()
    
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")
    
    try:
        # Get or create settings document
        settings = await db.settings.find_one({"_id": "cafe_settings"})
        
        if not settings:
            # Create default settings if not exists
            default_settings = {
                "_id": "cafe_settings",
                "restaurant_name": "Sangameshwar Cafe",
                "restaurant_name_hi": "संगमेश्वर कैफे",
                "restaurant_name_mr": "संगमेश्वर कॅफे",
                "gst_enabled": False,
                "gst_percentage": 5.0,
                "razorpay_auto_confirm": False,
                "created_at": datetime.now(timezone.utc),
                "updated_at": datetime.now(timezone.utc)
            }
            await db.settings.insert_one(default_settings)
            settings = default_settings
        
        # Convert ObjectId to string if exists
        if "_id" in settings and isinstance(settings["_id"], ObjectId):
            settings["_id"] = str(settings["_id"])
        
        return settings
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching settings: {str(e)}")


@admin_router.put("/settings")
async def update_settings(settings_data: dict, authorization: str = Header(None)):
    """Update cafe settings"""
    db = get_db()
    
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")
    
    try:
        # Add timestamp
        settings_data["updated_at"] = datetime.now(timezone.utc)
        
        # Update settings document
        result = await db.settings.update_one(
            {"_id": "cafe_settings"},
            {"$set": settings_data},
            upsert=True
        )
        
        # Return updated settings
        updated_settings = await db.settings.find_one({"_id": "cafe_settings"})
        
        if "_id" in updated_settings and isinstance(updated_settings["_id"], ObjectId):
            updated_settings["_id"] = str(updated_settings["_id"])
        
        return {
            "status": "success",
            "message": "Settings updated successfully",
            "data": updated_settings
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating settings: {str(e)}")


# ============================================================================
# Serve Uploaded Images
# ============================================================================

@admin_router.get("/uploads/{filename}")
async def get_uploaded_image(filename: str):
    """Serve uploaded image files"""
    file_path = Path("uploads") / filename
    
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Image not found")
    
    # Determine media type based on file extension
    suffix = file_path.suffix.lower()
    media_type_map = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.webp': 'image/webp'
    }
    media_type = media_type_map.get(suffix, 'application/octet-stream')
    
    return FileResponse(
        file_path, 
        media_type=media_type,
        headers={
            "Access-Control-Allow-Origin": "*",
            "Cache-Control": "public, max-age=3600"
        }
    )
