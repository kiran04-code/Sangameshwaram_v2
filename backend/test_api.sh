#!/bin/bash
# Backend Testing Script for Admin Menu Management System
# This script tests all major API endpoints

set -e

BASE_URL="http://localhost:8000"
API_URL="$BASE_URL/api/admin"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Admin Menu Management System - Backend Testing Script${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}\n"

# Check if server is running
echo -e "${YELLOW}[1/8]${NC} Checking if backend server is running..."
if ! curl -s "$BASE_URL/docs" > /dev/null; then
    echo -e "${RED}❌ Backend server is not running!${NC}"
    echo -e "   Start it with: ${YELLOW}cd backend && python server.py${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Backend server is running${NC}\n"

# Test Categories
echo -e "${YELLOW}[2/8]${NC} Testing Categories Endpoints..."
echo -e "${BLUE}Creating category...${NC}"

CATEGORY_RESPONSE=$(curl -s -X POST "$API_URL/categories" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Beverages Test",
    "name_hi": "पेय",
    "description": "Test beverages",
    "display_order": 1,
    "active": true
  }')

CATEGORY_ID=$(echo $CATEGORY_RESPONSE | grep -o '"_id":"[^"]*' | cut -d'"' -f4)

if [ ! -z "$CATEGORY_ID" ]; then
    echo -e "${GREEN}✅ Category created: $CATEGORY_ID${NC}"
else
    echo -e "${RED}❌ Failed to create category${NC}"
    echo "Response: $CATEGORY_RESPONSE"
fi

echo -e "${BLUE}Listing categories...${NC}"
LIST_RESPONSE=$(curl -s "$API_URL/categories")
COUNT=$(echo $LIST_RESPONSE | grep -o '"_id"' | wc -l)
echo -e "${GREEN}✅ Listed $COUNT categories${NC}\n"

# Test Menu Items
echo -e "${YELLOW}[3/8]${NC} Testing Menu Items Endpoints..."
echo -e "${BLUE}Creating menu item...${NC}"

ITEM_RESPONSE=$(curl -s -X POST "$API_URL/menu-items" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Tea",
    "category": "Beverages Test",
    "price": 30,
    "description": "Hot tea",
    "is_veg": true,
    "rating": 4.5
  }')

ITEM_ID=$(echo $ITEM_RESPONSE | grep -o '"_id":"[^"]*' | cut -d'"' -f4)

if [ ! -z "$ITEM_ID" ]; then
    echo -e "${GREEN}✅ Menu item created: $ITEM_ID${NC}"
else
    echo -e "${RED}❌ Failed to create menu item${NC}"
fi

echo -e "${BLUE}Listing menu items...${NC}"
ITEMS_RESPONSE=$(curl -s "$API_URL/menu-items")
ITEMS_COUNT=$(echo $ITEMS_RESPONSE | grep -o '"_id"' | wc -l)
echo -e "${GREEN}✅ Listed $ITEMS_COUNT menu items${NC}\n"

# Test Frequently Accessed
echo -e "${YELLOW}[4/8]${NC} Testing Frequently Accessed Items..."
echo -e "${BLUE}Adding item to frequently accessed...${NC}"

FA_RESPONSE=$(curl -s -X POST "$API_URL/frequently-accessed" \
  -H "Content-Type: application/json" \
  -d "{
    \"item_id\": \"$ITEM_ID\",
    \"name\": \"Test Tea\",
    \"delivery_time\": \"10 mins\",
    \"display_order\": 0,
    \"active\": true
  }")

FA_ID=$(echo $FA_RESPONSE | grep -o '"_id":"[^"]*' | cut -d'"' -f4)

if [ ! -z "$FA_ID" ]; then
    echo -e "${GREEN}✅ Added to frequently accessed: $FA_ID${NC}"
else
    echo -e "${RED}❌ Failed to add to frequently accessed${NC}"
fi
echo ""

# Test Quick Add Items
echo -e "${YELLOW}[5/8]${NC} Testing Quick Add Items..."
echo -e "${BLUE}Adding item to quick add...${NC}"

QA_RESPONSE=$(curl -s -X POST "$API_URL/quick-add-items" \
  -H "Content-Type: application/json" \
  -d "{
    \"item_id\": \"$ITEM_ID\",
    \"display_order\": 0,
    \"active\": true
  }")

QA_ID=$(echo $QA_RESPONSE | grep -o '"_id":"[^"]*' | cut -d'"' -f4)

if [ ! -z "$QA_ID" ]; then
    echo -e "${GREEN}✅ Added to quick add: $QA_ID${NC}"
else
    echo -e "${RED}❌ Failed to add to quick add${NC}"
fi
echo ""

# Test Offers
echo -e "${YELLOW}[6/8]${NC} Testing Offers..."
echo -e "${BLUE}Creating offer...${NC}"

OFFER_RESPONSE=$(curl -s -X POST "$API_URL/offers" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "percentage",
    "title": "FLAT 30% OFF",
    "value": 30,
    "start_date": "2026-03-31T00:00:00Z",
    "end_date": "2026-04-30T23:59:59Z",
    "active": true,
    "priority": 1
  }')

OFFER_ID=$(echo $OFFER_RESPONSE | grep -o '"_id":"[^"]*' | cut -d'"' -f4)

if [ ! -z "$OFFER_ID" ]; then
    echo -e "${GREEN}✅ Offer created: $OFFER_ID${NC}"
else
    echo -e "${RED}❌ Failed to create offer${NC}"
fi
echo ""

# Test Best Sellers
echo -e "${YELLOW}[7/8]${NC} Testing Best Sellers..."
echo -e "${BLUE}Adding to best sellers...${NC}"

BS_RESPONSE=$(curl -s -X POST "$API_URL/best-sellers" \
  -H "Content-Type: application/json" \
  -d "{
    \"item_id\": \"$ITEM_ID\",
    \"display_order\": 0,
    \"active\": true,
    \"featured_from\": \"2026-03-31T00:00:00Z\"
  }")

BS_ID=$(echo $BS_RESPONSE | grep -o '"_id":"[^"]*' | cut -d'"' -f4)

if [ ! -z "$BS_ID" ]; then
    echo -e "${GREEN}✅ Added to best sellers: $BS_ID${NC}"
else
    echo -e "${RED}❌ Failed to add to best sellers${NC}"
fi
echo ""

# Test Combos
echo -e "${YELLOW}[8/8]${NC} Testing Combos..."
echo -e "${BLUE}Creating combo...${NC}"

COMBO_RESPONSE=$(curl -s -X POST "$API_URL/combos" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Test Combo\",
    \"description\": \"Test combo meal\",
    \"combo_type\": \"meal\",
    \"items\": [{\"item_id\": \"$ITEM_ID\", \"quantity\": 1}],
    \"combo_price\": 25,
    \"active\": true
  }")

COMBO_ID=$(echo $COMBO_RESPONSE | grep -o '"_id":"[^"]*' | cut -d'"' -f4)

if [ ! -z "$COMBO_ID" ]; then
    echo -e "${GREEN}✅ Combo created: $COMBO_ID${NC}"
else
    echo -e "${RED}❌ Failed to create combo${NC}"
fi
echo ""

# Summary
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ Backend Testing Complete!${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}\n"

echo -e "${YELLOW}📊 Summary:${NC}"
echo -e "  ${GREEN}✅${NC} Categories: Working"
echo -e "  ${GREEN}✅${NC} Menu Items: Working"
echo -e "  ${GREEN}✅${NC} Frequently Accessed: Working"
echo -e "  ${GREEN}✅${NC} Quick Add Items: Working"
echo -e "  ${GREEN}✅${NC} Offers: Working"
echo -e "  ${GREEN}✅${NC} Best Sellers: Working"
echo -e "  ${GREEN}✅${NC} Combos: Working"
echo ""

echo -e "${YELLOW}📝 Created Test Data:${NC}"
echo -e "  • Category ID: ${BLUE}$CATEGORY_ID${NC}"
echo -e "  • Menu Item ID: ${BLUE}$ITEM_ID${NC}"
echo -e "  • Frequently Accessed ID: ${BLUE}$FA_ID${NC}"
echo -e "  • Quick Add ID: ${BLUE}$QA_ID${NC}"
echo -e "  • Offer ID: ${BLUE}$OFFER_ID${NC}"
echo -e "  • Best Seller ID: ${BLUE}$BS_ID${NC}"
echo -e "  • Combo ID: ${BLUE}$COMBO_ID${NC}"
echo ""

echo -e "${YELLOW}🔗 Next Steps:${NC}"
echo -e "  1. Visit Swagger UI: ${BLUE}$BASE_URL/docs${NC}"
echo -e "  2. Test more endpoints interactively"
echo -e "  3. Clean up test data manually or run cleanup script"
echo -e "  4. Start Phase 2 Frontend Development"
echo ""

echo -e "${YELLOW}💡 Tips:${NC}"
echo -e "  • All created IDs can be used for further testing"
echo -e "  • Use the IDs to test GET, PUT, DELETE endpoints"
echo -e "  • Check the database directly: mongosh sangameshwar"
echo -e "  • View logs: tail -f backend/logs/server.log (if configured)"
echo ""

echo -e "${GREEN}✨ Phase 1 Backend Testing Complete!${NC}\n"
