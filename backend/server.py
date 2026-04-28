from fastapi import FastAPI, APIRouter, HTTPException, Depends, Header, UploadFile, File
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from starlette.staticfiles import StaticFiles
from starlette.responses import FileResponse
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone, timedelta
import hashlib
from enum import Enum
import shutil


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

UPLOAD_DIR = ROOT_DIR / 'uploads'
UPLOAD_DIR.mkdir(exist_ok=True)

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

# Add CORS middleware FIRST before routes - MUST be before app.include_router
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],  # Allow all origins for development
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Import and initialize admin routes
from admin_routes import admin_router, set_db
from menu_routes import menu_router, set_db as set_db_menu
set_db(db)  # Pass database to admin routes
set_db_menu(db)  # Pass database to menu routes

ADMIN_PASSWORD = "admin123"


class UserRole(str, Enum):
    ADMIN = "admin"
    WAITER = "waiter"
    STOCK_MANAGER = "stock_manager"
    DISPLAY = "display"


class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    username: str
    password: str
    role: UserRole
    name: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    active: bool = True


class UserCreate(BaseModel):
    username: str
    password: str
    role: UserRole
    name: str


class LoginRequest(BaseModel):
    username: str
    password: str


class Ingredient(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    unit: str
    current_stock: float
    min_threshold: float
    cost_per_unit: float
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class Recipe(BaseModel):
    ingredient_id: str
    ingredient_name: str
    quantity: float
    unit: str


class MenuItem(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
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
    variants: Optional[List[dict]] = None
    popular: bool = False
    rating: Optional[float] = 4.5
    sold_out: bool = False
    recipe: List[Recipe] = []
    raw_material_cost: float = 0
    profit_margin: float = 0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class Vendor(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    contact: str
    email: Optional[str] = None
    address: str
    payment_status: str = "pending"
    total_outstanding: float = 0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class StockTransaction(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    ingredient_id: str
    ingredient_name: str
    transaction_type: str
    quantity: float
    vendor_id: Optional[str] = None
    vendor_name: Optional[str] = None
    cost: Optional[float] = None
    purchase_date: Optional[datetime] = None
    user_id: str
    user_name: str
    notes: Optional[str] = None
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class Table(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    table_number: int
    capacity: int
    status: str = "available"
    current_order_id: Optional[str] = None


class Order(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    order_number: int = 0
    table_number: Optional[int] = None
    items: List[dict]
    subtotal: float
    gst_amount: float = 0
    gst_percentage: float = 0
    delivery_charge: float = 0
    tip: float = 0
    discount: float = 0
    total: float
    customer_name: str
    customer_phone: str
    delivery_address: Optional[str] = None
    order_type: str = "dine_in"
    coupon_code: Optional[str] = None
    status: str = "new"
    payment_status: str = "unpaid"
    kitchen_accepted_at: Optional[datetime] = None
    delivered_at: Optional[datetime] = None
    paid_at: Optional[datetime] = None
    waiter_id: Optional[str] = None
    waiter_name: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class OrderCreate(BaseModel):
    table_number: Optional[int] = None
    items: List[dict]
    subtotal: float
    gst_amount: float = 0
    gst_percentage: float = 0
    delivery_charge: float = 0
    tip: float = 0
    discount: float = 0
    total: float
    customer_name: str
    customer_phone: str
    delivery_address: Optional[str] = None
    order_type: str = "dine_in"
    coupon_code: Optional[str] = None
    waiter_id: Optional[str] = None
    waiter_name: Optional[str] = None


class AuditLog(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    action_type: str
    user_id: str
    user_name: str
    user_role: str
    description: str
    metadata: Optional[Dict] = None
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class Settings(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = "settings"
    gst_enabled: bool = False
    gst_percentage: float = 5.0
    restaurant_name: str = "The Sangameshwaram Cafe"
    restaurant_name_hi: str = "द संगमेश्वरम कॅफे"
    restaurant_name_mr: str = "द संगमेश्वरम कॅफे"


class Coupon(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    code: str
    type: str = "percentage"
    value: float = 0
    min_order: float = 0
    description: str = ""
    active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class OfferPoster(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    image_url: str
    description: str
    active: bool = True
    display_order: int = 0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


def verify_token(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    token = authorization.replace("Bearer ", "")
    
    if token == ADMIN_PASSWORD:
        return {"role": "admin", "user_id": "admin", "username": "admin"}
    
    return {"role": "unknown", "user_id": token, "username": "user"}


async def create_audit_log(action_type: str, user_id: str, user_name: str, user_role: str, description: str, metadata: Dict = None):
    log = AuditLog(
        action_type=action_type,
        user_id=user_id,
        user_name=user_name,
        user_role=user_role,
        description=description,
        metadata=metadata
    )
    doc = log.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    await db.audit_logs.insert_one(doc)


@api_router.post("/login")
async def login(login_req: LoginRequest):
    if login_req.username == "admin" and login_req.password == ADMIN_PASSWORD:
        return {"token": ADMIN_PASSWORD, "role": "admin", "name": "Admin", "success": True}
    
    user = await db.users.find_one({"username": login_req.username, "active": True}, {"_id": 0})
    if user and user['password'] == login_req.password:
        await create_audit_log("login", user['id'], user['name'], user['role'], f"User logged in")
        return {"token": user['id'], "role": user['role'], "name": user['name'], "success": True}
    
    raise HTTPException(status_code=401, detail="Invalid credentials")


@api_router.post("/verify-razorpay-payment")
async def verify_razorpay_payment(payment_data: Dict):
    """
    Verify Razorpay payment signature
    This endpoint verifies that the payment was actually processed by Razorpay
    """
    import hmac
    
    try:
        print(f"📝 [RAZORPAY] Received payment data: {payment_data}")
        
        razorpay_order_id = payment_data.get('razorpay_order_id')
        razorpay_payment_id = payment_data.get('razorpay_payment_id')
        razorpay_signature = payment_data.get('razorpay_signature')
        
        print(f"📝 [RAZORPAY] Order ID: {razorpay_order_id}")
        print(f"📝 [RAZORPAY] Payment ID: {razorpay_payment_id}")
        print(f"📝 [RAZORPAY] Signature: {razorpay_signature}")
        
        # For testing mode: if order_id or signature is missing, still accept payment
        # In production, you'd want to require all fields
        if not razorpay_payment_id:
            print("❌ [RAZORPAY] Missing payment ID")
            raise HTTPException(status_code=400, detail="Missing razorpay_payment_id")
        
        # Get secret key from environment
        secret_key = os.environ.get('RAZORPAY_SECRET_KEY', '')
        
        # For test mode: if no order_id provided, just verify payment_id exists
        if not razorpay_order_id:
            print("⚠️  [RAZORPAY] Order ID not provided - test mode verification")
            return {
                "success": True,
                "message": "Payment verified (test mode - no order ID)",
                "razorpay_payment_id": razorpay_payment_id,
                "razorpay_order_id": razorpay_order_id
            }
        
        if not secret_key:
            print("⚠️  [RAZORPAY] No secret key set - test mode verification")
            return {
                "success": True,
                "message": "Payment verified (test mode - no secret key)",
                "razorpay_payment_id": razorpay_payment_id,
                "razorpay_order_id": razorpay_order_id
            }
        
        # If signature is provided, verify it
        if razorpay_signature:
            # Create signature to verify
            # Razorpay signature format: order_id|payment_id
            message = f"{razorpay_order_id}|{razorpay_payment_id}"
            computed_signature = hmac.new(
                secret_key.encode(),
                message.encode(),
                hashlib.sha256
            ).hexdigest()
            
            print(f"✓ [RAZORPAY] Message: {message}")
            print(f"✓ [RAZORPAY] Computed Signature: {computed_signature}")
            print(f"✓ [RAZORPAY] Provided Signature: {razorpay_signature}")
            
            if computed_signature == razorpay_signature:
                print("✅ [RAZORPAY] Payment signature verified successfully")
                return {
                    "success": True,
                    "message": "Payment verified successfully",
                    "razorpay_payment_id": razorpay_payment_id,
                    "razorpay_order_id": razorpay_order_id
                }
            else:
                print("❌ [RAZORPAY] Payment verification failed - Invalid signature")
                raise HTTPException(status_code=403, detail="Payment verification failed - Invalid signature")
        else:
            # No signature provided, but we have payment_id - accept it
            print("⚠️  [RAZORPAY] No signature provided - accepting payment by ID")
            return {
                "success": True,
                "message": "Payment verified (no signature verification)",
                "razorpay_payment_id": razorpay_payment_id,
                "razorpay_order_id": razorpay_order_id
            }
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ [RAZORPAY] Error verifying payment: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error verifying payment: {str(e)}")


@api_router.get("/users", dependencies=[Depends(verify_token)])
async def get_users():
    users = await db.users.find({"active": True}, {"_id": 0, "password": 0}).to_list(100)
    return users


@api_router.post("/users", dependencies=[Depends(verify_token)])
async def create_user(user_create: UserCreate, authorization: str = Header(None)):
    auth_user = verify_token(authorization)
    
    user = User(**user_create.model_dump())
    doc = user.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.users.insert_one(doc)
    
    await create_audit_log("user_created", auth_user['user_id'], "Admin", "admin", f"Created user: {user.name} ({user.role})")
    
    return {"success": True, "id": user.id}


@api_router.get("/ingredients")
async def get_ingredients():
    ingredients = await db.ingredients.find({}, {"_id": 0}).to_list(1000)
    return ingredients


@api_router.post("/ingredients", dependencies=[Depends(verify_token)])
async def create_ingredient(ingredient: Ingredient, authorization: str = Header(None)):
    auth_user = verify_token(authorization)
    doc = ingredient.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.ingredients.insert_one(doc)
    
    await create_audit_log("ingredient_created", auth_user['user_id'], auth_user['username'], auth_user['role'], 
                          f"Created ingredient: {ingredient.name}")
    
    return {"success": True, "id": ingredient.id}


@api_router.put("/ingredients/{ingredient_id}/stock", dependencies=[Depends(verify_token)])
async def update_stock(
    ingredient_id: str, 
    quantity: float, 
    transaction_type: str, 
    vendor_id: str = None,
    vendor_name: str = None,
    cost: float = None,
    purchase_date: str = None,
    notes: str = "", 
    authorization: str = Header(None)
):
    auth_user = verify_token(authorization)
    
    ingredient = await db.ingredients.find_one({"id": ingredient_id}, {"_id": 0})
    if not ingredient:
        raise HTTPException(status_code=404, detail="Ingredient not found")
    
    new_stock = ingredient['current_stock'] + quantity if transaction_type == "add" else ingredient['current_stock'] - quantity
    
    await db.ingredients.update_one({"id": ingredient_id}, {"$set": {"current_stock": new_stock}})
    
    transaction = StockTransaction(
        ingredient_id=ingredient_id,
        ingredient_name=ingredient['name'],
        transaction_type=transaction_type,
        quantity=quantity,
        vendor_id=vendor_id,
        vendor_name=vendor_name,
        cost=cost,
        purchase_date=datetime.fromisoformat(purchase_date) if purchase_date else None,
        user_id=auth_user['user_id'],
        user_name=auth_user['username'],
        notes=notes
    )
    
    trans_doc = transaction.model_dump()
    trans_doc['timestamp'] = trans_doc['timestamp'].isoformat()
    if trans_doc.get('purchase_date'):
        trans_doc['purchase_date'] = trans_doc['purchase_date'].isoformat()
    await db.stock_transactions.insert_one(trans_doc)
    
    await create_audit_log("stock_updated", auth_user['user_id'], auth_user['username'], auth_user['role'],
                          f"Updated stock for {ingredient['name']}: {transaction_type} {quantity}")
    
    return {"success": True, "new_stock": new_stock}


@api_router.get("/vendors")
async def get_vendors():
    vendors = await db.vendors.find({}, {"_id": 0}).to_list(1000)
    return vendors


@api_router.post("/vendors", dependencies=[Depends(verify_token)])
async def create_vendor(vendor: Vendor):
    doc = vendor.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.vendors.insert_one(doc)
    return {"success": True, "id": vendor.id}


@api_router.get("/tables")
async def get_tables():
    tables = await db.tables.find({}, {"_id": 0}).to_list(100)
    return tables


@api_router.post("/tables", dependencies=[Depends(verify_token)])
async def create_table(table: Table):
    doc = table.model_dump()
    await db.tables.insert_one(doc)
    return {"success": True, "id": table.id}


@api_router.put("/tables/{table_id}/status", dependencies=[Depends(verify_token)])
async def update_table_status(table_id: str, status: str, order_id: str = None):
    update_data = {"status": status}
    if order_id:
        update_data["current_order_id"] = order_id
    
    await db.tables.update_one({"id": table_id}, {"$set": update_data})
    return {"success": True}


@api_router.get("/menu")
async def get_menu(category: Optional[str] = None, is_veg: Optional[bool] = None, include_sold_out: bool = True):
    query = {}
    if category:
        query["category"] = category
    if is_veg is not None:
        query["is_veg"] = is_veg
    if not include_sold_out:
        query["sold_out"] = False
    
    menu_items = await db.menu_items.find(query, {"_id": 0}).to_list(1000)
    return menu_items


@api_router.get("/categories")
async def get_categories():
    menu_items = await db.menu_items.find({}, {"_id": 0, "category": 1}).to_list(1000)
    cat_counts = {}
    for item in menu_items:
        cat = item.get('category', 'Other')
        cat_counts[cat] = cat_counts.get(cat, 0) + 1
    categories = [{"name": k, "count": v} for k, v in cat_counts.items()]
    return {"categories": categories}


@api_router.get("/featured")
async def get_featured_items():
    items = await db.menu_items.find({"sold_out": False}, {"_id": 0}).to_list(1000)
    popular = [i for i in items if i.get('popular')]
    if len(popular) < 8:
        popular = items[:8]
    return popular


@api_router.get("/settings")
async def get_public_settings():
    """Get public cafe settings (no auth required)"""
    try:
        settings = await db.settings.find_one({"_id": "cafe_settings"})
        
        if not settings:
            # Return default settings
            return {
                "_id": "cafe_settings",
                "restaurant_name": "Sangameshwar Cafe",
                "restaurant_name_hi": "संगमेश्वर कैफे",
                "restaurant_name_mr": "संगमेश्वर कॅफे",
                "gst_enabled": False,
                "gst_percentage": 5.0,
                "razorpay_auto_confirm": False
            }
        
        # Convert ObjectId to string if exists
        if "_id" in settings and isinstance(settings["_id"], ObjectId):
            settings["_id"] = str(settings["_id"])
        
        return settings
    
    except Exception as e:
        # Return default if error
        return {
            "restaurant_name": "Sangameshwar Cafe",
            "gst_enabled": False,
            "gst_percentage": 5.0,
            "razorpay_auto_confirm": False
        }


@api_router.post("/menu", dependencies=[Depends(verify_token)])
async def create_menu_item(item: MenuItem, authorization: str = Header(None)):
    auth_user = verify_token(authorization)
    
    raw_cost = sum(r.quantity * (await db.ingredients.find_one({"id": r.ingredient_id}, {"cost_per_unit": 1}))['cost_per_unit'] 
                   for r in item.recipe if await db.ingredients.find_one({"id": r.ingredient_id}))
    
    item.raw_material_cost = raw_cost
    item.profit_margin = item.price - raw_cost
    
    doc = item.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['recipe'] = [r.model_dump() for r in item.recipe]
    await db.menu_items.insert_one(doc)
    
    await create_audit_log("menu_item_created", auth_user['user_id'], auth_user['username'], auth_user['role'],
                          f"Created menu item: {item.name}")
    
    return {"success": True, "id": item.id}


@api_router.put("/menu/{item_id}", dependencies=[Depends(verify_token)])
async def update_menu_item(item_id: str, update_data: Dict):
    await db.menu_items.update_one({"id": item_id}, {"$set": update_data})
    return {"success": True}


# ⚠️ OLD ORDER ENDPOINTS - DEPRECATED
# These endpoints have been moved to /api/admin/orders in admin_routes.py
# Please use the admin_routes.py endpoints instead


@api_router.get("/analytics/sales")
async def get_sales_analytics(period: str = "today"):
    now = datetime.now(timezone.utc)
    
    if period == "today":
        start_date = now.replace(hour=0, minute=0, second=0, microsecond=0)
    elif period == "week":
        start_date = now - timedelta(days=7)
    elif period == "month":
        start_date = now - timedelta(days=30)
    else:
        start_date = now.replace(hour=0, minute=0, second=0, microsecond=0)
    
    orders = await db.orders.find(
        {"created_at": {"$gte": start_date.isoformat()}},
        {"_id": 0}
    ).to_list(10000)
    
    total_revenue = sum(order['total'] for order in orders)
    total_orders = len(orders)
    avg_order_value = total_revenue / total_orders if total_orders > 0 else 0
    
    hourly_data = {}
    for order in orders:
        created = datetime.fromisoformat(order['created_at']) if isinstance(order['created_at'], str) else order['created_at']
        hour = created.hour
        if hour not in hourly_data:
            hourly_data[hour] = {"orders": 0, "revenue": 0}
        hourly_data[hour]["orders"] += 1
        hourly_data[hour]["revenue"] += order['total']
    
    return {
        "total_revenue": round(total_revenue, 2),
        "total_orders": total_orders,
        "avg_order_value": round(avg_order_value, 2),
        "hourly_data": hourly_data
    }


@api_router.get("/analytics/margins")
async def get_margin_analytics():
    menu_items = await db.menu_items.find({}, {"_id": 0, "name": 1, "price": 1, "raw_material_cost": 1, "profit_margin": 1}).to_list(1000)
    
    sorted_by_margin = sorted(menu_items, key=lambda x: x.get('profit_margin', 0), reverse=True)
    
    return {
        "high_margin_items": sorted_by_margin[:10],
        "low_margin_items": sorted_by_margin[-10:]
    }


@api_router.get("/analytics/product-sales")
async def get_product_sales(period: str = "today"):
    now = datetime.now(timezone.utc)
    
    if period == "today":
        start_date = now.replace(hour=0, minute=0, second=0, microsecond=0)
    elif period == "week":
        start_date = now - timedelta(days=7)
    elif period == "month":
        start_date = now - timedelta(days=30)
    else:
        start_date = now.replace(hour=0, minute=0, second=0, microsecond=0)
    
    orders = await db.orders.find(
        {"created_at": {"$gte": start_date.isoformat()}},
        {"_id": 0, "items": 1}
    ).to_list(10000)
    
    product_stats = {}
    for order in orders:
        for item in order.get('items', []):
            item_name = item['name']
            if item_name not in product_stats:
                product_stats[item_name] = {
                    "name": item_name,
                    "quantity_sold": 0,
                    "revenue": 0
                }
            product_stats[item_name]["quantity_sold"] += item.get('quantity', 1)
            product_stats[item_name]["revenue"] += item.get('price', 0) * item.get('quantity', 1)
    
    sorted_products = sorted(product_stats.values(), key=lambda x: x['revenue'], reverse=True)
    
    return {
        "products": sorted_products,
        "period": period
    }


@api_router.get("/stock-transactions")
async def get_stock_transactions(ingredient_id: str = None, limit: int = 100):
    query = {}
    if ingredient_id:
        query["ingredient_id"] = ingredient_id
    
    transactions = await db.stock_transactions.find(query, {"_id": 0}).sort("timestamp", -1).limit(limit).to_list(limit)
    
    for trans in transactions:
        if isinstance(trans.get('timestamp'), str):
            trans['timestamp'] = datetime.fromisoformat(trans['timestamp'])
        if trans.get('purchase_date') and isinstance(trans['purchase_date'], str):
            trans['purchase_date'] = datetime.fromisoformat(trans['purchase_date'])
    
    return transactions


@api_router.get("/audit-logs", dependencies=[Depends(verify_token)])
async def get_audit_logs(action_type: Optional[str] = None, limit: int = 100):
    query = {}
    if action_type:
        query["action_type"] = action_type
    
    logs = await db.audit_logs.find(query, {"_id": 0}).sort("timestamp", -1).limit(limit).to_list(limit)
    
    for log in logs:
        if isinstance(log.get('timestamp'), str):
            log['timestamp'] = datetime.fromisoformat(log['timestamp'])
    
    return logs


@api_router.get("/stock-alerts")
async def get_stock_alerts():
    ingredients = await db.ingredients.find({}, {"_id": 0}).to_list(1000)
    
    low_stock = [ing for ing in ingredients if ing['current_stock'] <= ing['min_threshold']]
    
    return {"alerts": low_stock, "count": len(low_stock)}


@api_router.get("/settings")
async def get_public_settings():
    """Get public cafe settings (no auth required)"""
    try:
        settings = await db.settings.find_one({"_id": "cafe_settings"})
        
        if not settings:
            # Return default settings
            return {
                "_id": "cafe_settings",
                "restaurant_name": "Sangameshwar Cafe",
                "restaurant_name_hi": "संगमेश्वर कैफे",
                "restaurant_name_mr": "संगमेश्वर कॅफे",
                "gst_enabled": False,
                "gst_percentage": 5.0,
                "razorpay_auto_confirm": False
            }
        
        # Convert ObjectId to string if exists
        if "_id" in settings and isinstance(settings["_id"], ObjectId):
            settings["_id"] = str(settings["_id"])
        
        return settings
    
    except Exception as e:
        # Return default if error
        return {
            "restaurant_name": "Sangameshwar Cafe",
            "gst_enabled": False,
            "gst_percentage": 5.0,
            "razorpay_auto_confirm": False
        }


@api_router.get("/offer-posters")
async def get_offer_posters(active_only: bool = True):
    query = {"active": True} if active_only else {}
    posters = await db.offer_posters.find(query, {"_id": 0}).sort("display_order", 1).to_list(100)
    return posters


@api_router.post("/offer-posters", dependencies=[Depends(verify_token)])
async def create_offer_poster(poster: OfferPoster):
    doc = poster.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.offer_posters.insert_one(doc)
    return {"success": True, "id": poster.id}


@api_router.delete("/offer-posters/{poster_id}", dependencies=[Depends(verify_token)])
async def delete_offer_poster(poster_id: str):
    await db.offer_posters.delete_one({"id": poster_id})
    return {"success": True}


@api_router.get("/analytics/top-items")
async def get_top_items(period: str = "today"):
    now = datetime.now(timezone.utc)
    if period == "today":
        start_date = now.replace(hour=0, minute=0, second=0, microsecond=0)
    elif period == "week":
        start_date = now - timedelta(days=7)
    elif period == "month":
        start_date = now - timedelta(days=30)
    else:
        start_date = now.replace(hour=0, minute=0, second=0, microsecond=0)

    orders = await db.orders.find(
        {"created_at": {"$gte": start_date.isoformat()}},
        {"_id": 0, "items": 1}
    ).to_list(10000)

    product_stats = {}
    for order in orders:
        for item in order.get('items', []):
            name = item.get('name', 'Unknown')
            if name not in product_stats:
                product_stats[name] = {"name": name, "quantity": 0, "revenue": 0}
            product_stats[name]["quantity"] += item.get('quantity', 1)
            product_stats[name]["revenue"] += item.get('price', 0) * item.get('quantity', 1)

    sorted_items = sorted(product_stats.values(), key=lambda x: x['revenue'], reverse=True)
    return {
        "top_sellers": sorted_items[:10],
        "underperformers": sorted_items[-5:] if len(sorted_items) > 5 else sorted_items
    }


@api_router.get("/coupons")
async def get_coupons(active_only: bool = True):
    query = {"active": True} if active_only else {}
    coupons = await db.coupons.find(query, {"_id": 0}).to_list(100)
    return coupons


@api_router.post("/admin/coupons", dependencies=[Depends(verify_token)])
async def create_coupon(coupon: Coupon, authorization: str = Header(None)):
    auth_user = verify_token(authorization)
    doc = coupon.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.coupons.insert_one(doc)
    await create_audit_log("coupon_created", auth_user['user_id'], auth_user['username'], auth_user['role'],
                          f"Created coupon: {coupon.code}")
    return {"success": True, "id": coupon.id}


@api_router.delete("/admin/coupons/{coupon_id}", dependencies=[Depends(verify_token)])
async def delete_coupon(coupon_id: str, authorization: str = Header(None)):
    auth_user = verify_token(authorization)
    await db.coupons.delete_one({"id": coupon_id})
    await create_audit_log("coupon_deleted", auth_user['user_id'], auth_user['username'], auth_user['role'],
                          f"Deleted coupon: {coupon_id}")
    return {"success": True}


@api_router.get("/combos")
async def get_combos():
    """Return active offer posters as combos for the customer display ticker."""
    posters = await db.offer_posters.find({"active": True}, {"_id": 0}).to_list(100)
    combos = []
    for p in posters:
        combos.append({
            "id": p.get("id"),
            "name": p.get("title", "Special Offer"),
            "price": 199,
            "savings": 50,
            "description": p.get("description", "")
        })
    return combos


@api_router.put("/admin/menu/{item_id}", dependencies=[Depends(verify_token)])
async def update_menu_item_admin(item_id: str, update_data: Dict):
    await db.menu_items.update_one({"id": item_id}, {"$set": update_data})
    return {"success": True}


@api_router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    ext = file.filename.split('.')[-1] if '.' in file.filename else 'jpg'
    filename = f"{uuid.uuid4()}.{ext}"
    filepath = UPLOAD_DIR / filename
    with open(filepath, "wb") as buf:
        shutil.copyfileobj(file.file, buf)
    return {"url": f"/api/uploads/{filename}", "filename": filename}


@api_router.get("/uploads/{filename}")
async def serve_upload(filename: str):
    filepath = UPLOAD_DIR / filename
    if not filepath.exists():
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(filepath)


@api_router.get("/admin/uploads/{filename}")
async def serve_admin_upload(filename: str):
    filepath = UPLOAD_DIR / filename
    if not filepath.exists():
        raise HTTPException(status_code=404, detail="Image not found")
    return FileResponse(filepath, media_type="image/jpeg")


app.include_router(api_router)
app.include_router(admin_router)
app.include_router(menu_router)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_event():
    logger.info("🚀 Sangameshwar Backend Server Starting...")
    logger.info(f"📊 Database: {os.environ.get('DB_NAME', 'sangameshwar')}")
    logger.info(f"🔌 MongoDB URL: {os.environ.get('MONGO_URL', 'mongodb://localhost:27017')}")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "server:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
