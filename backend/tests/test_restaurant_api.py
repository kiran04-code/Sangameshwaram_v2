"""
Restaurant Management API Tests
Tests for: Login, Menu, Orders, Analytics, Coupons, Combos, Staff, Ingredients, Vendors
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Test credentials
ADMIN_CREDS = {"username": "admin", "password": "admin123"}
WAITER_CREDS = {"username": "waiter1", "password": "waiter123"}
STOCK_CREDS = {"username": "stock1", "password": "stock123"}


class TestHealthAndBasicEndpoints:
    """Basic health and connectivity tests"""
    
    def test_menu_endpoint_accessible(self):
        """Test that menu endpoint is accessible without auth"""
        response = requests.get(f"{BASE_URL}/api/menu")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Menu endpoint accessible - {len(data)} items found")
    
    def test_orders_endpoint_accessible(self):
        """Test that orders endpoint is accessible"""
        response = requests.get(f"{BASE_URL}/api/orders")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Orders endpoint accessible - {len(data)} orders found")


class TestAuthentication:
    """Authentication flow tests"""
    
    def test_admin_login_success(self):
        """Test admin login with correct credentials"""
        response = requests.post(f"{BASE_URL}/api/login", json=ADMIN_CREDS)
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True
        assert data.get("role") == "admin"
        assert data.get("token") == "admin123"
        print(f"✓ Admin login successful - role: {data.get('role')}")
    
    def test_waiter_login_success(self):
        """Test waiter login - may fail if user not seeded"""
        response = requests.post(f"{BASE_URL}/api/login", json=WAITER_CREDS)
        # Waiter may not exist in DB yet
        if response.status_code == 200:
            data = response.json()
            assert data.get("success") == True
            assert data.get("role") == "waiter"
            print(f"✓ Waiter login successful - role: {data.get('role')}")
        else:
            print(f"⚠ Waiter user not found (needs to be created via admin)")
            pytest.skip("Waiter user not seeded")
    
    def test_stock_manager_login_success(self):
        """Test stock manager login - may fail if user not seeded"""
        response = requests.post(f"{BASE_URL}/api/login", json=STOCK_CREDS)
        if response.status_code == 200:
            data = response.json()
            assert data.get("success") == True
            assert data.get("role") == "stock_manager"
            print(f"✓ Stock manager login successful - role: {data.get('role')}")
        else:
            print(f"⚠ Stock manager user not found (needs to be created via admin)")
            pytest.skip("Stock manager user not seeded")
    
    def test_login_invalid_credentials(self):
        """Test login with invalid credentials"""
        response = requests.post(f"{BASE_URL}/api/login", json={
            "username": "invalid",
            "password": "wrongpass"
        })
        assert response.status_code == 401
        print("✓ Invalid credentials correctly rejected")


class TestAnalyticsEndpoints:
    """Analytics API tests"""
    
    def test_analytics_sales(self):
        """Test sales analytics endpoint"""
        response = requests.get(f"{BASE_URL}/api/analytics/sales?period=today")
        assert response.status_code == 200
        data = response.json()
        assert "total_revenue" in data
        assert "total_orders" in data
        assert "avg_order_value" in data
        assert "hourly_data" in data
        print(f"✓ Sales analytics - Revenue: ₹{data['total_revenue']}, Orders: {data['total_orders']}")
    
    def test_analytics_top_items(self):
        """Test top items analytics endpoint"""
        response = requests.get(f"{BASE_URL}/api/analytics/top-items")
        assert response.status_code == 200
        data = response.json()
        assert "top_sellers" in data
        assert "underperformers" in data
        assert isinstance(data["top_sellers"], list)
        assert isinstance(data["underperformers"], list)
        print(f"✓ Top items analytics - {len(data['top_sellers'])} top sellers, {len(data['underperformers'])} underperformers")
    
    def test_analytics_margins(self):
        """Test margin analytics endpoint"""
        response = requests.get(f"{BASE_URL}/api/analytics/margins")
        assert response.status_code == 200
        data = response.json()
        assert "high_margin_items" in data
        assert "low_margin_items" in data
        print(f"✓ Margin analytics - {len(data['high_margin_items'])} high margin items")
    
    def test_analytics_product_sales(self):
        """Test product sales analytics endpoint"""
        response = requests.get(f"{BASE_URL}/api/analytics/product-sales?period=month")
        assert response.status_code == 200
        data = response.json()
        assert "products" in data
        assert "period" in data
        print(f"✓ Product sales analytics - {len(data['products'])} products tracked")


class TestCouponsEndpoints:
    """Coupon management tests"""
    
    def test_get_coupons(self):
        """Test getting coupons list"""
        response = requests.get(f"{BASE_URL}/api/coupons")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Coupons endpoint - {len(data)} coupons found")
    
    def test_create_coupon_with_auth(self):
        """Test creating a coupon with admin auth"""
        coupon_data = {
            "code": "TEST_COUPON_123",
            "type": "percentage",
            "value": 15,
            "min_order": 200,
            "description": "Test coupon for automated testing"
        }
        response = requests.post(
            f"{BASE_URL}/api/admin/coupons",
            json=coupon_data,
            headers={"Authorization": "Bearer admin123"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True
        assert "id" in data
        print(f"✓ Coupon created successfully - ID: {data['id']}")
        
        # Cleanup - delete the test coupon
        delete_response = requests.delete(
            f"{BASE_URL}/api/admin/coupons/{data['id']}",
            headers={"Authorization": "Bearer admin123"}
        )
        assert delete_response.status_code == 200
        print("✓ Test coupon cleaned up")
    
    def test_create_coupon_without_auth(self):
        """Test that creating coupon without auth fails"""
        coupon_data = {
            "code": "UNAUTHORIZED",
            "type": "flat",
            "value": 50,
            "min_order": 100,
            "description": "Should fail"
        }
        response = requests.post(f"{BASE_URL}/api/admin/coupons", json=coupon_data)
        assert response.status_code == 401
        print("✓ Unauthorized coupon creation correctly rejected")


class TestCombosEndpoint:
    """Combos/Offers endpoint tests"""
    
    def test_get_combos(self):
        """Test getting combos list"""
        response = requests.get(f"{BASE_URL}/api/combos")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Combos endpoint - {len(data)} combos found")


class TestMenuEndpoints:
    """Menu management tests"""
    
    def test_get_menu_all(self):
        """Test getting all menu items"""
        response = requests.get(f"{BASE_URL}/api/menu")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Menu items - {len(data)} items found")
    
    def test_get_menu_with_category_filter(self):
        """Test menu filtering by category"""
        # First get all items to find a category
        all_items = requests.get(f"{BASE_URL}/api/menu").json()
        if len(all_items) > 0:
            category = all_items[0].get("category")
            response = requests.get(f"{BASE_URL}/api/menu?category={category}")
            assert response.status_code == 200
            data = response.json()
            for item in data:
                assert item.get("category") == category
            print(f"✓ Category filter working - {len(data)} items in '{category}'")
        else:
            pytest.skip("No menu items to test category filter")
    
    def test_get_menu_veg_filter(self):
        """Test menu filtering by veg/non-veg"""
        response = requests.get(f"{BASE_URL}/api/menu?is_veg=true")
        assert response.status_code == 200
        data = response.json()
        for item in data:
            assert item.get("is_veg") == True
        print(f"✓ Veg filter working - {len(data)} veg items")


class TestOrdersEndpoints:
    """Order management tests"""
    
    def test_get_orders(self):
        """Test getting orders list"""
        response = requests.get(f"{BASE_URL}/api/orders")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Orders endpoint - {len(data)} orders found")
    
    def test_get_orders_by_status(self):
        """Test filtering orders by status"""
        for status in ["new", "preparing", "ready"]:
            response = requests.get(f"{BASE_URL}/api/orders?status={status}")
            assert response.status_code == 200
            data = response.json()
            for order in data:
                assert order.get("status") == status
            print(f"✓ Orders filter by status '{status}' - {len(data)} orders")
    
    def test_create_order(self):
        """Test creating a new order"""
        order_data = {
            "items": [
                {"id": "test-item-1", "name": "Test Item", "price": 100, "quantity": 2}
            ],
            "subtotal": 200,
            "total": 200,
            "customer_name": "TEST_Customer",
            "customer_phone": "9999999999",
            "order_type": "pickup"
        }
        response = requests.post(f"{BASE_URL}/api/orders", json=order_data)
        assert response.status_code == 201
        data = response.json()
        assert "id" in data
        assert "order_number" in data
        assert data.get("customer_name") == "TEST_Customer"
        print(f"✓ Order created - Order #{data['order_number']}, ID: {data['id']}")
        return data["id"]


class TestIngredientsEndpoints:
    """Ingredients/Stock management tests"""
    
    def test_get_ingredients(self):
        """Test getting ingredients list"""
        response = requests.get(f"{BASE_URL}/api/ingredients")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Ingredients endpoint - {len(data)} ingredients found")
    
    def test_get_stock_alerts(self):
        """Test getting stock alerts"""
        response = requests.get(f"{BASE_URL}/api/stock-alerts")
        assert response.status_code == 200
        data = response.json()
        assert "alerts" in data
        assert "count" in data
        print(f"✓ Stock alerts - {data['count']} low stock alerts")


class TestVendorsEndpoints:
    """Vendor management tests"""
    
    def test_get_vendors(self):
        """Test getting vendors list"""
        response = requests.get(f"{BASE_URL}/api/vendors")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Vendors endpoint - {len(data)} vendors found")


class TestOfferPostersEndpoints:
    """Offer posters management tests"""
    
    def test_get_offer_posters(self):
        """Test getting offer posters"""
        response = requests.get(f"{BASE_URL}/api/offer-posters")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Offer posters endpoint - {len(data)} posters found")


class TestSettingsEndpoints:
    """Settings management tests"""
    
    def test_get_settings(self):
        """Test getting restaurant settings"""
        response = requests.get(f"{BASE_URL}/api/settings")
        assert response.status_code == 200
        data = response.json()
        assert "restaurant_name" in data
        assert "gst_enabled" in data
        print(f"✓ Settings endpoint - Restaurant: {data.get('restaurant_name')}")


class TestUsersEndpoints:
    """User/Staff management tests"""
    
    def test_get_users_with_auth(self):
        """Test getting users list with admin auth"""
        response = requests.get(
            f"{BASE_URL}/api/users",
            headers={"Authorization": "Bearer admin123"}
        )
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Users endpoint - {len(data)} staff members found")
    
    def test_get_users_without_auth(self):
        """Test that getting users without auth fails"""
        response = requests.get(f"{BASE_URL}/api/users")
        assert response.status_code == 401
        print("✓ Unauthorized users access correctly rejected")
    
    def test_create_user_with_auth(self):
        """Test creating a new staff user"""
        user_data = {
            "username": "test_waiter_auto",
            "password": "testpass123",
            "name": "TEST Auto Waiter",
            "role": "waiter"
        }
        response = requests.post(
            f"{BASE_URL}/api/users",
            json=user_data,
            headers={"Authorization": "Bearer admin123"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True
        assert "id" in data
        print(f"✓ User created - ID: {data['id']}")


class TestTablesEndpoints:
    """Table management tests"""
    
    def test_get_tables(self):
        """Test getting tables list"""
        response = requests.get(f"{BASE_URL}/api/tables")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Tables endpoint - {len(data)} tables found")


class TestAuditLogsEndpoints:
    """Audit logs tests"""
    
    def test_get_audit_logs_with_auth(self):
        """Test getting audit logs with admin auth"""
        response = requests.get(
            f"{BASE_URL}/api/audit-logs",
            headers={"Authorization": "Bearer admin123"}
        )
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Audit logs endpoint - {len(data)} logs found")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
