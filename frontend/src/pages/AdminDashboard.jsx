import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { LogOut, Package, BarChart3, Menu, Tag, Settings, Users, TrendingUp, DollarSign, Clock, Image, X, Upload, Trash2, Grid, List, Plus, ChevronRight } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import LanguageSwitcher from '../components/LanguageSwitcher';
import AdminCategoryManager from './AdminCategoryManager';
import OffersTabComponent from '../components/admin/Offers/OffersTab';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api/admin`;
const LOGO_URL = 'https://customer-assets.emergentagent.com/job_menu-hub-dine/artifacts/w81h57nj_image.png';

const AdminDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated, token, logout } = useAdmin();
  const [activeTab, setActiveTab] = useState('orders');
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const tabsList = [
    { id: 'orders', label: t('orders'), icon: <Package size={18} /> },
    { id: 'analytics', label: t('analytics'), icon: <BarChart3 size={18} /> },
    { id: 'menu', label: 'Menu & Categories', icon: <Menu size={18} /> },
    { id: 'inventory', label: 'Inventory', icon: <Package size={18} /> },
    { id: 'staff', label: 'Staff', icon: <Users size={18} /> },
    { id: 'coupons', label: 'Coupons', icon: <Tag size={18} /> },
    { id: 'offers', label: 'Offers', icon: <Image size={18} /> },
    { id: 'settings', label: t('settings'), icon: <Settings size={18} /> },
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    setShowMobileMenu(false);
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #FFF5F7 0%, #FFFAF0 100%)' }}>
      {/* Decorative Corners */}
      <div className="mandala-corner top-left"></div>
      <div className="mandala-corner top-right"></div>

      {/* Header */}
      <header className="bg-gradient-to-r from-[#8B1538] to-[#A0153E] border-b-4 border-[#FFD700] px-3 sm:px-4 py-3 sm:py-4 relative z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <img src={LOGO_URL} alt="Logo" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-[#FFD700] flex-shrink-0" />
            <h1 className="text-sm sm:text-lg md:text-2xl font-black text-white truncate" style={{ fontFamily: 'Playfair Display, serif' }}>{t('admin_dashboard')}</h1>
          </div>
          <div className="flex gap-2 sm:gap-3 items-center flex-shrink-0">
            <LanguageSwitcher />
            <button
              onClick={handleLogout}
              className="btn-gold flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm"
              data-testid="logout-button"
            >
              <LogOut size={16} className="sm:size-18" />
              <span className="hidden sm:inline">{t('logout')}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Floating Kitchen Display Button - Mobile Only */}
      <button
        onClick={() => navigate('/kitchen')}
        className="fixed bottom-8 left-6 sm:hidden bg-[#8B1538] hover:bg-[#A0153E] text-white rounded-full p-3 shadow-lg z-20 transition-all flex items-center justify-center"
        title="Go to Kitchen Display"
      >
        <Menu size={24} />
      </button>

      {/* Kitchen Display Button - Desktop */}
      <button
        onClick={() => navigate('/kitchen')}
        className="hidden sm:block fixed bottom-8 left-6 bg-[#8B1538] hover:bg-[#A0153E] text-white rounded-lg px-4 py-2 font-semibold text-sm shadow-lg z-20 transition-all"
      >
        {t('kitchen_display')}
      </button>

      {/* Navigation Tabs - Desktop */}
      <div className="hidden sm:block border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          <div className="flex gap-2 sm:gap-6 overflow-x-auto hide-scrollbar">
            {tabsList.map(tab => (
              <TabButton 
                key={tab.id}
                icon={tab.icon} 
                label={tab.label} 
                active={activeTab === tab.id} 
                onClick={() => setActiveTab(tab.id)} 
              />
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Hamburger Menu - Mobile */}
      <div className="sm:hidden border-b border-gray-200 bg-white px-3 py-3 sticky top-[100px] z-40">
        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="flex items-center gap-2 px-3 py-2 bg-[#8B1538] text-white rounded-lg font-semibold text-sm w-full justify-center"
        >
          {showMobileMenu ? <X size={20} /> : <Menu size={20} />}
          {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
        </button>

        {showMobileMenu && (
          <div className="mt-3 space-y-2 bg-gray-50 rounded-lg p-3">
            {tabsList.map(tab => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg font-semibold text-sm transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#8B1538] text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        {activeTab === 'orders' && <OrdersTab token={token} />}
        {activeTab === 'analytics' && <AnalyticsTab token={token} />}
        {activeTab === 'menu' && <AdminCategoryManager token={token} />}
        {activeTab === 'inventory' && <InventoryTab token={token} />}
        {activeTab === 'staff' && <StaffTab token={token} />}
        {activeTab === 'coupons' && <CouponsTab token={token} />}
        {activeTab === 'offers' && <OffersTab token={token} />}
        {activeTab === 'settings' && <SettingsTab token={token} />}
      </div>
    </div>
  );
};

const TabButton = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-3 font-semibold text-xs sm:text-sm border-b-2 transition-all whitespace-nowrap ${
      active
        ? 'border-[#8B1538] text-[#8B1538]'
        : 'border-transparent text-gray-500 hover:text-gray-700'
    }`}
  >
    {icon}
    {label}
  </button>
);

const OrdersTab = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [paymentModal, setPaymentModal] = useState(null);

  const fetchOrders = useCallback(async () => {
    try {
      const url = filter === 'all' ? `${API}/orders` : `${API}/orders?status=${filter}`;
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  }, [filter, token]);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      // If marking as ready, deduct inventory based on raw_materials
      if (newStatus === 'ready') {
        console.log('📦 Marking order as ready - deducting inventory...');
        
        // Fetch the order to get order items
        const orderResponse = await axios.get(
          `${API}/orders/${orderId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const order = orderResponse.data;
        
        console.log('🛒 Order items:', order.items);
        
        // For each item in the order, deduct its raw_materials from inventory
        if (order.items && order.items.length > 0) {
          for (const orderItem of order.items) {
            console.log(`  Processing: ${orderItem.name} x${orderItem.quantity}`);
            
            // Fetch the product to get its raw_materials
            const productsResponse = await axios.get(
              `${API}/menu-items?limit=1000`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            const products = productsResponse.data;
            const product = products.find(p => p.name === orderItem.name);
            
            if (product && product.raw_materials && product.raw_materials.length > 0) {
              console.log(`    ✅ Found ${product.raw_materials.length} raw materials for ${orderItem.name}`);
              
              // For each raw material, deduct the quantity * order item quantity
              for (const material of product.raw_materials) {
                const inventoryId = material.inventory_id;
                const quantityPerItem = material.quantity;
                const totalQuantityToDeduct = quantityPerItem * orderItem.quantity;
                
                console.log(`      📉 Deducting ${totalQuantityToDeduct} from inventory ${inventoryId}`);
                
                // Call backend to deduct from inventory
                try {
                  await axios.post(
                    `${API}/inventory/${inventoryId}/deduct-stock`,
                    { deduct_quantity: totalQuantityToDeduct },
                    { headers: { Authorization: `Bearer ${token}` } }
                  );
                  console.log(`      ✅ Deducted successfully`);
                } catch (err) {
                  console.error(`      ❌ Error deducting from inventory:`, err);
                  // Continue even if one deduction fails
                }
              }
            } else {
              console.log(`    ⚠️ No raw materials found for ${orderItem.name}`);
            }
          }
        }
      }
      
      // Now update the order status
      await axios.put(
        `${API}/orders/${orderId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(`✅ Order ${orderId} status updated to: ${newStatus}`);
      fetchOrders();
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const handleConfirmPayment = async (paymentMethod) => {
    if (!paymentModal) return;
    try {
      await axios.put(
        `${API}/orders/${paymentModal.orderId}`,
        { status: 'processing', payment_method: paymentMethod },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPaymentModal(null);
      fetchOrders();
    } catch (error) {
      console.error('Error confirming payment:', error);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      new: 'bg-blue-500',
      preparing: 'bg-yellow-500',
      ready: 'bg-green-500',
      completed: 'bg-gray-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  const newOrders = orders.filter(o => o.status === 'pending');
  const processingOrders = orders.filter(o => o.status === 'processing');
  const preparingOrders = orders.filter(o => o.status === 'preparing');
  const readyOrders = orders.filter(o => o.status === 'ready');

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-6 mb-6">
        <h2 className="text-lg sm:text-2xl font-bold" style={{ color: '#8B1538' }}>Live Orders</h2>
        <div className="flex flex-wrap gap-2">
          <FilterButton label="All" active={filter === 'all'} onClick={() => setFilter('all')} />
          <FilterButton label="Pending" active={filter === 'pending'} count={newOrders.length} onClick={() => setFilter('pending')} />
          <FilterButton label="Processing" active={filter === 'processing'} count={processingOrders.length} onClick={() => setFilter('processing')} />
          <FilterButton label="Preparing" active={filter === 'preparing'} count={preparingOrders.length} onClick={() => setFilter('preparing')} />
          <FilterButton label="Ready" active={filter === 'ready'} count={readyOrders.length} onClick={() => setFilter('ready')} />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No orders found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <OrderColumn title="Pending Orders" orders={newOrders} status="pending" onUpdate={updateOrderStatus} setPaymentModal={setPaymentModal} />
          <OrderColumn title="Processing" orders={processingOrders} status="processing" onUpdate={updateOrderStatus} />
          <OrderColumn title="Preparing" orders={preparingOrders} status="preparing" onUpdate={updateOrderStatus} />
          <OrderColumn title="Ready" orders={readyOrders} status="ready" onUpdate={updateOrderStatus} />
        </div>
      )}

      {/* Payment Modal */}
      {paymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 sm:p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#8B1538]">Select Payment Method</h2>
              <button onClick={() => setPaymentModal(null)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Order Total</p>
              <p className="text-3xl font-bold text-[#8B1538]">₹{paymentModal.orderTotal}</p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => handleConfirmPayment('cash')}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition-all text-lg"
              >
                💵 Cash Payment
              </button>
              <button
                onClick={() => handleConfirmPayment('upi')}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition-all text-lg"
              >
                📱 UPI Payment
              </button>
            </div>

            <button
              onClick={() => setPaymentModal(null)}
              className="w-full mt-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 rounded-lg transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const OrderColumn = ({ title, orders, status, onUpdate, setPaymentModal }) => (
  <div>
    <h3 className="font-bold text-sm sm:text-lg mb-3 flex items-center gap-2">
      <span className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${status === 'pending' ? 'bg-blue-500' : status === 'processing' ? 'bg-purple-500' : status === 'preparing' ? 'bg-yellow-500' : 'bg-green-500'}`}></span>
      {title} ({orders.length})
    </h3>
    <div className="space-y-2 sm:space-y-3">
      {orders.map(order => (
        <div key={order._id} className="premium-card p-2 sm:p-4" data-testid={`order-card-${order.order_number}`}>
          <div className="flex justify-between items-start gap-2 mb-2 sm:mb-3">
            <div className="min-w-0">
              <span className="text-lg sm:text-2xl font-black text-[#8B1538] truncate">#{order.order_number}</span>
              <p className="text-xs text-gray-500">{new Date(order.created_at).toLocaleTimeString()}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <span className="text-base sm:text-lg font-bold text-[#8B1538] block">₹{order.total}</span>
              {order.payment_status && (
                <p className={`text-xs font-bold ${order.payment_status === 'paid' ? 'text-green-600' : 'text-orange-500'}`}>
                  {order.payment_status === 'paid' ? 'PAID' : 'UNPAID'}
                </p>
              )}
            </div>
          </div>
          
          <div className="mb-2 sm:mb-3">
            <p className="font-semibold text-xs sm:text-sm truncate">{order.customer_name}</p>
            <p className="text-xs text-gray-500 truncate">{order.customer_phone}</p>
            <p className="text-xs font-semibold mt-1 text-[#8B1538]">{order.order_type === 'delivery' ? 'Delivery' : order.order_type === 'dine_in' ? 'Dine-in' : 'Pickup'}</p>
            {order.table_number && <p className="text-xs text-gray-600">Table: {order.table_number}</p>}
          </div>
          
          {/* Items Detail */}
          <div className="text-xs sm:text-sm mb-2 sm:mb-3 bg-gray-50 rounded-lg p-1.5 sm:p-2 max-h-24 sm:max-h-32 overflow-y-auto">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between py-0.5 text-xs">
                <span className="text-gray-700 truncate">{item.name} <span className="text-[#8B1538] font-bold">x{item.quantity}</span></span>
                <span className="font-semibold flex-shrink-0 ml-1">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
          
          {/* Billing Breakdown */}
          <div className="text-xs space-y-0.5 mb-2 sm:mb-3 border-t pt-1.5 sm:pt-2 max-h-16 overflow-y-auto">
            <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>₹{order.subtotal}</span></div>
            {order.gst_amount > 0 && <div className="flex justify-between"><span className="text-gray-500">GST ({order.gst_percentage}%)</span><span>₹{order.gst_amount}</span></div>}
            {order.delivery_charge > 0 && <div className="flex justify-between"><span className="text-gray-500">Delivery</span><span>₹{order.delivery_charge}</span></div>}
            {order.discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-₹{order.discount}</span></div>}
            {order.coupon_code && <div className="flex justify-between text-blue-600"><span>Coupon</span><span>{order.coupon_code}</span></div>}
            <div className="flex justify-between font-bold text-[#8B1538] border-t pt-1"><span>Total</span><span>₹{order.total}</span></div>
          </div>
          
          <div className="flex gap-1.5 sm:gap-2">
            {status === 'pending' && (
              <>
                <button onClick={() => setPaymentModal({orderId: order._id, orderTotal: order.total})} className="flex-1 bg-blue-500 text-white font-bold py-1.5 sm:py-2 rounded-lg hover:bg-blue-600 transition-all text-xs sm:text-sm">
                  Proceed
                </button>
                <button onClick={() => onUpdate(order._id, 'cancelled')} className="flex-1 bg-red-500 text-white font-bold py-1.5 sm:py-2 rounded-lg hover:bg-red-600 transition-all text-xs sm:text-sm">
                  Cancel
                </button>
              </>
            )}
            {status === 'processing' && (
              <>
                <button onClick={() => onUpdate(order._id, 'preparing')} className="flex-1 bg-yellow-500 text-white font-bold py-1.5 sm:py-2 rounded-lg hover:bg-yellow-600 transition-all text-xs sm:text-sm">
                  Start Preparing
                </button>
                <button onClick={() => onUpdate(order._id, 'cancelled')} className="flex-1 bg-red-500 text-white font-bold py-1.5 sm:py-2 rounded-lg hover:bg-red-600 transition-all text-xs sm:text-sm">
                  Cancel
                </button>
              </>
            )}
            {status === 'preparing' && (
              <>
                <button onClick={() => onUpdate(order._id, 'ready')} className="flex-1 bg-green-500 text-white font-bold py-1.5 sm:py-2 rounded-lg hover:bg-green-600 transition-all text-xs sm:text-sm">
                  Mark Ready
                </button>
                <button onClick={() => onUpdate(order._id, 'cancelled')} className="flex-1 bg-red-500 text-white font-bold py-1.5 sm:py-2 rounded-lg hover:bg-red-600 transition-all text-xs sm:text-sm">
                  Cancel
                </button>
              </>
            )}
            {status === 'ready' && (
              <>
                <button onClick={() => onUpdate(order._id, 'completed')} className="flex-1 bg-gray-500 text-white font-bold py-1.5 sm:py-2 rounded-lg hover:bg-gray-600 transition-all text-xs sm:text-sm">
                  Complete
                </button>
                <button onClick={() => onUpdate(order._id, 'cancelled')} className="flex-1 bg-red-500 text-white font-bold py-1.5 sm:py-2 rounded-lg hover:bg-red-600 transition-all text-xs sm:text-sm">
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const FilterButton = ({ label, active, count, onClick }) => (
  <button
    onClick={onClick}
    className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg font-semibold text-xs sm:text-sm transition-all ${
      active ? 'btn-maroon' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
    }`}
  >
    {label} {count !== undefined && `(${count})`}
  </button>
);

const AnalyticsTab = ({ token }) => {
  const [analytics, setAnalytics] = useState(null);
  const [topItems, setTopItems] = useState(null);
  const [productSales, setProductSales] = useState(null);
  const [period, setPeriod] = useState('today');

  const fetchAnalytics = useCallback(async () => {
    try {
      const [analyticsRes, topItemsRes, productSalesRes] = await Promise.all([
        axios.get(`${API}/analytics/sales?period=${period}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API}/analytics/top-items`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API}/analytics/product-sales?period=${period}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      setAnalytics(analyticsRes.data);
      setTopItems(topItemsRes.data);
      setProductSales(productSalesRes.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  }, [period, token]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (!analytics) return <div>Loading analytics...</div>;

  const hourlyData = Object.entries(analytics.hourly_data).map(([hour, data]) => ({
    hour: `${hour}:00`,
    orders: data.orders,
    revenue: data.revenue
  }));

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-6 mb-6">
        <h2 className="text-lg sm:text-2xl font-bold" style={{ color: '#8B1538' }}>Sales Analytics</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setPeriod('today')}
            className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold ${period === 'today' ? 'btn-maroon' : 'bg-gray-200 text-gray-700'}`}
          >
            Today
          </button>
          <button
            onClick={() => setPeriod('week')}
            className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold ${period === 'week' ? 'btn-maroon' : 'bg-gray-200 text-gray-700'}`}
          >
            This Week
          </button>
          <button
            onClick={() => setPeriod('month')}
            className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold ${period === 'month' ? 'btn-maroon' : 'bg-gray-200 text-gray-700'}`}
          >
            This Month
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6 mb-6 sm:mb-8">
        <div className="premium-card p-3 sm:p-4">
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#8B1538] to-[#A0153E] rounded-xl flex items-center justify-center flex-shrink-0">
              <DollarSign className="text-white" size={20} />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-gray-500">Total Revenue</p>
              <p className="text-lg sm:text-2xl font-black text-[#8B1538] truncate">₹{analytics.total_revenue}</p>
            </div>
          </div>
        </div>
        
        <div className="premium-card p-3 sm:p-4">
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#F4C430] to-[#FFD700] rounded-xl flex items-center justify-center flex-shrink-0">
              <Package className="text-[#8B1538]" size={20} />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-gray-500">Total Orders</p>
              <p className="text-lg sm:text-2xl font-black text-[#8B1538] truncate">{analytics.total_orders}</p>
            </div>
          </div>
        </div>
        
        <div className="premium-card p-3 sm:p-4">
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#8B1538] to-[#A0153E] rounded-xl flex items-center justify-center flex-shrink-0">
              <TrendingUp className="text-white" size={20} />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-gray-500">Avg Order Value</p>
              <p className="text-lg sm:text-2xl font-black text-[#8B1538] truncate">₹{analytics.avg_order_value}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="premium-card p-3 sm:p-4">
          <h3 className="font-bold text-sm sm:text-lg mb-4" style={{ color: '#2D1B1E' }}>Hourly Orders</h3>
          <div className="w-full h-48 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="orders" fill="#8B1538" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="premium-card p-3 sm:p-4">
          <h3 className="font-bold text-sm sm:text-lg mb-4" style={{ color: '#2D1B1E' }}>Hourly Revenue</h3>
          <div className="w-full h-48 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#FFD700" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Items */}
      {topItems && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="premium-card p-3 sm:p-4">
            <h3 className="font-bold text-sm sm:text-lg mb-4 text-green-600">Top Selling Items</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {topItems.top_sellers.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <div className="min-w-0">
                    <span className="font-semibold text-xs sm:text-sm truncate">{idx + 1}. {item.name}</span>
                    <p className="text-xs text-gray-500">{item.quantity} sold</p>
                  </div>
                  <span className="font-bold text-[#8B1538] text-xs sm:text-sm flex-shrink-0">₹{item.revenue}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="premium-card p-3 sm:p-4">
            <h3 className="font-bold text-sm sm:text-lg mb-4 text-red-600">Underperforming Items</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {topItems.underperformers.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <div className="min-w-0">
                    <span className="font-semibold text-xs sm:text-sm truncate">{item.name}</span>
                    <p className="text-xs text-gray-500">{item.quantity} sold</p>
                  </div>
                  <span className="font-bold text-gray-500 text-xs sm:text-sm flex-shrink-0">₹{item.revenue}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Product Sales Report */}
      {productSales && productSales.products && productSales.products.length > 0 && (
        <div className="premium-card p-3 sm:p-4" data-testid="product-sales-report">
          <h3 className="font-bold text-sm sm:text-lg mb-4 text-[#8B1538]" style={{ fontFamily: 'Playfair Display, serif' }}>Product-wise Sales Report</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b-2 border-[#FFD700]">
                  <th className="pb-2 sm:pb-3 font-bold text-[#2D1B1E]">#</th>
                  <th className="pb-2 sm:pb-3 font-bold text-[#2D1B1E]">Product</th>
                  <th className="pb-2 sm:pb-3 font-bold text-[#2D1B1E] text-right">Qty</th>
                  <th className="pb-2 sm:pb-3 font-bold text-[#2D1B1E] text-right">Revenue</th>
                  <th className="pb-2 sm:pb-3 font-bold text-[#2D1B1E] text-right">%</th>
                </tr>
              </thead>
              <tbody>
                {productSales.products.map((product, idx) => {
                  const totalRev = productSales.products.reduce((sum, p) => sum + p.revenue, 0);
                  const pct = totalRev > 0 ? ((product.revenue / totalRev) * 100).toFixed(1) : 0;
                  return (
                    <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-2 sm:py-3 text-gray-500">{idx + 1}</td>
                      <td className="py-2 sm:py-3 font-semibold truncate">{product.name}</td>
                      <td className="py-2 sm:py-3 text-right font-semibold">{product.quantity_sold}</td>
                      <td className="py-2 sm:py-3 text-right font-bold text-[#8B1538]">₹{product.revenue}</td>
                      <td className="py-2 sm:py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <div className="w-8 sm:w-12 bg-gray-200 rounded-full h-1.5">
                            <div className="bg-[#8B1538] h-1.5 rounded-full" style={{ width: `${pct}%` }}></div>
                          </div>
                          <span className="text-xs text-gray-600 w-6 text-right">{pct}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-[#8B1538]">
                  <td colSpan="2" className="py-2 sm:py-3 font-black text-[#8B1538]">Total</td>
                  <td className="py-2 sm:py-3 text-right font-black text-[#8B1538]">{productSales.products.reduce((s, p) => s + p.quantity_sold, 0)}</td>
                  <td className="py-2 sm:py-3 text-right font-black text-[#8B1538]">₹{productSales.products.reduce((s, p) => s + p.revenue, 0)}</td>
                  <td className="py-2 sm:py-3 text-right font-black text-[#8B1538]">100%</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

import MenuManagement from '../components/MenuManagement';

const MenuTab = ({ token }) => {
  return <MenuManagement token={token} />;
};

const CouponsTab = ({ token }) => {
  const [coupons, setCoupons] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage',
    value: 0,
    min_order: 0,
    description: ''
  });

  const fetchCoupons = useCallback(async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/coupons?active_only=false`);
      setCoupons(response.data);
    } catch (error) {
      console.error('Error fetching coupons:', error);
    }
  }, []);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  const createCoupon = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/admin/coupons`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCoupons();
      setShowForm(false);
      setFormData({ code: '', type: 'percentage', value: 0, min_order: 0, description: '' });
    } catch (error) {
      console.error('Error creating coupon:', error);
    }
  };

  const deleteCoupon = async (couponId) => {
    try {
      await axios.delete(`${API}/admin/coupons/${couponId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCoupons();
    } catch (error) {
      console.error('Error deleting coupon:', error);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-6 mb-6">
        <h2 className="text-lg sm:text-2xl font-bold" style={{ color: '#8B1538' }}>Coupon Management</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-maroon text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2"
        >
          {showForm ? 'Cancel' : 'Create Coupon'}
        </button>
      </div>

      {showForm && (
        <div className="premium-card mb-6 p-3 sm:p-4">
          <form onSubmit={createCoupon} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block font-semibold mb-2 text-xs sm:text-sm">Coupon Code</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg text-sm"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-2 text-xs sm:text-sm">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="percentage">Percentage</option>
                  <option value="flat">Flat Discount</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold mb-2 text-xs sm:text-sm">Value</label>
                <input
                  type="number"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) })}
                  className="w-full px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg text-sm"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-2 text-xs sm:text-sm">Min Order (₹)</label>
                <input
                  type="number"
                  value={formData.min_order}
                  onChange={(e) => setFormData({ ...formData, min_order: parseFloat(e.target.value) })}
                  className="w-full px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg text-sm"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block font-semibold mb-2 text-xs sm:text-sm">Description</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg text-sm"
                required
              />
            </div>
            <button type="submit" className="btn-maroon w-full text-xs sm:text-sm py-1.5 sm:py-2">Create Coupon</button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {coupons.map(coupon => (
          <div key={coupon.id} className="premium-card p-3 sm:p-4">
            <div className="flex justify-between items-start gap-2 mb-3 sm:mb-4">
              <div className="min-w-0">
                <span className="text-lg sm:text-2xl font-black text-[#8B1538] truncate">{coupon.code}</span>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{coupon.description}</p>
              </div>
              <button
                onClick={() => deleteCoupon(coupon.id)}
                className="text-red-500 font-bold text-xs hover:text-red-700 flex-shrink-0"
              >
                Delete
              </button>
            </div>
            <div className="text-xs space-y-1">
              <p><span className="font-semibold">Type:</span> {coupon.type}</p>
              <p><span className="font-semibold">Value:</span> {coupon.type === 'percentage' ? `${coupon.value}%` : `₹${coupon.value}`}</p>
              <p><span className="font-semibold">Min Order:</span> ₹{coupon.min_order}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SettingsTab = ({ token }) => {
  const [settings, setSettings] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const fetchSettings = useCallback(async () => {
    try {
      const response = await axios.get(`${API}/settings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSettings(response.data);
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  }, [token]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const saveSettings = async () => {
    setSaving(true);
    try {
      const response = await axios.put(`${API}/settings`, settings, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Backend returns: { status: "success", message: "...", data: updated_settings }
      setSettings(response.data.data || response.data);
      setMessage('Settings saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage('Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  if (!settings) return <div>Loading settings...</div>;

  return (
    <div data-testid="settings-tab">
      <h2 className="text-2xl font-bold mb-6" style={{ color: '#8B1538' }}>Cafe Settings</h2>

      {message && (
        <div className={`mb-4 px-4 py-3 rounded-xl font-semibold ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`} data-testid="settings-message">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Restaurant Info */}
        <div className="premium-card p-3 sm:p-4">
          <h3 className="font-bold text-base sm:text-lg mb-4 text-[#2D1B1E]">Cafe Information</h3>
          <div className="space-y-3 sm:space-y-4">
            <div>
              <label className="block font-semibold mb-1 text-xs sm:text-sm">Cafe Name (English)</label>
              <input
                type="text"
                value={settings.restaurant_name || ''}
                onChange={(e) => setSettings({ ...settings, restaurant_name: e.target.value })}
                className="w-full px-2 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg text-xs sm:text-sm"
                data-testid="restaurant-name-input"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-xs sm:text-sm">Cafe Name (Hindi)</label>
              <input
                type="text"
                value={settings.restaurant_name_hi || ''}
                onChange={(e) => setSettings({ ...settings, restaurant_name_hi: e.target.value })}
                className="w-full px-2 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg text-xs sm:text-sm"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-xs sm:text-sm">Cafe Name (Marathi)</label>
              <input
                type="text"
                value={settings.restaurant_name_mr || ''}
                onChange={(e) => setSettings({ ...settings, restaurant_name_mr: e.target.value })}
                className="w-full px-2 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg text-xs sm:text-sm"
              />
            </div>
          </div>
        </div>

        {/* GST Settings */}
        <div className="premium-card p-3 sm:p-4">
          <h3 className="font-bold text-base sm:text-lg mb-4 text-[#2D1B1E]">GST Configuration</h3>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between p-2 sm:p-4 bg-gray-50 rounded-xl">
              <div>
                <p className="font-semibold text-xs sm:text-sm">GST Enabled</p>
                <p className="text-xs text-gray-500">Apply GST to all orders</p>
              </div>
              <button
                onClick={() => setSettings({ ...settings, gst_enabled: !settings.gst_enabled })}
                className={`relative w-12 sm:w-14 h-6 sm:h-7 rounded-full transition-colors flex-shrink-0 ${settings.gst_enabled ? 'bg-green-500' : 'bg-gray-300'}`}
                data-testid="gst-toggle"
              >
                <span className={`absolute top-0.5 w-5 sm:w-6 h-5 sm:h-6 bg-white rounded-full shadow transition-transform ${settings.gst_enabled ? 'translate-x-6 sm:translate-x-7' : 'translate-x-0.5'}`}></span>
              </button>
            </div>
            {settings.gst_enabled && (
              <div>
                <label className="block font-semibold mb-1 text-xs sm:text-sm">GST Percentage (%)</label>
                <input
                  type="number"
                  value={settings.gst_percentage || 5}
                  onChange={(e) => setSettings({ ...settings, gst_percentage: parseFloat(e.target.value) })}
                  className="w-full px-2 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg text-xs sm:text-sm"
                  min="0"
                  max="28"
                  data-testid="gst-percentage-input"
                />
                <p className="text-xs text-gray-400 mt-1">Common: 5% (food), 12% (packaged), 18% (beverages)</p>
              </div>
            )}
          </div>
        </div>

        {/* Payment Settings */}
        <div className="premium-card p-3 sm:p-4">
          <h3 className="font-bold text-base sm:text-lg mb-4 text-[#2D1B1E]">Payment Configuration</h3>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between p-2 sm:p-4 bg-blue-50 rounded-xl border-l-4 border-blue-500">
              <div>
                <p className="font-semibold text-xs sm:text-sm">Auto Confirm via Razorpay</p>
                <p className="text-xs text-gray-500">Automatically confirm orders after Razorpay payment</p>
              </div>
              <button
                onClick={() => setSettings({ ...settings, razorpay_auto_confirm: !settings.razorpay_auto_confirm })}
                className={`relative w-12 sm:w-14 h-6 sm:h-7 rounded-full transition-colors flex-shrink-0 ${settings.razorpay_auto_confirm ? 'bg-green-500' : 'bg-gray-300'}`}
                data-testid="razorpay-toggle"
              >
                <span className={`absolute top-0.5 w-5 sm:w-6 h-5 sm:h-6 bg-white rounded-full shadow transition-transform ${settings.razorpay_auto_confirm ? 'translate-x-6 sm:translate-x-7' : 'translate-x-0.5'}`}></span>
              </button>
            </div>
            {settings.razorpay_auto_confirm && (
              <div className="bg-green-50 p-2 sm:p-3 rounded-lg border border-green-200">
                <p className="text-xs font-semibold text-green-700 mb-2">✓ Auto Confirmation Enabled</p>
                <p className="text-xs text-green-600">
                  When enabled, orders paid via Razorpay will automatically change status to <span className="font-bold">"Preparing"</span> without manual confirmation.
                </p>
                <p className="text-xs text-green-600 mt-2">
                  💡 <span className="font-semibold">Benefit:</span> Faster order processing and improved customer experience.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 sm:mt-6">
        <button
          onClick={saveSettings}
          disabled={saving}
          className="btn-maroon w-full sm:w-auto px-6 sm:px-8 py-1.5 sm:py-2 text-xs sm:text-sm"
          data-testid="save-settings-btn"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
};

// NEW TABS

const StaffTab = ({ token }) => {
  const [staff, setStaff] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newStaff, setNewStaff] = useState({
    username: '',
    password: '',
    name: '',
    role: 'waiter'
  });

  const fetchStaff = useCallback(async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStaff(response.data);
    } catch (error) {
      console.error('Error fetching staff:', error);
    }
  }, [token]);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  const createStaff = async () => {
    try {
      await axios.post(`${BACKEND_URL}/api/users`, newStaff, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowCreateForm(false);
      setNewStaff({ username: '', password: '', name: '', role: 'waiter' });
      fetchStaff();
    } catch (error) {
      console.error('Error creating staff:', error);
      alert('Error creating staff: ' + (error.response?.data?.detail || 'Unknown error'));
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-6 mb-6">
        <h2 className="text-base sm:text-2xl font-bold text-[#8B1538]" style={{ fontFamily: 'Playfair Display, serif' }}>
          Staff Management
        </h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="btn-maroon flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm"
        >
          <Users size={16} className="sm:size-18" />
          <span className="whitespace-nowrap">Create Account</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {staff.map(member => (
          <div key={member.id} className="premium-card p-3 sm:p-4">
            <div className="flex items-start justify-between gap-2 mb-3 sm:mb-4">
              <div className="min-w-0">
                <h3 className="font-bold text-xs sm:text-lg text-[#2D1B1E] truncate">{member.name}</h3>
                <p className="text-xs text-gray-500 truncate">@{member.username}</p>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold flex-shrink-0 whitespace-nowrap ${
                member.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                member.role === 'waiter' ? 'bg-blue-100 text-blue-700' :
                'bg-green-100 text-green-700'
              }`}>
                {member.role}
              </span>
            </div>
            <div className="text-xs space-y-1">
              <p><span className="font-semibold">Status:</span> <span className="text-green-600">Active</span></p>
              <p className="text-xs text-gray-400">Created: {new Date(member.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>

      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-3 sm:p-4" onClick={() => setShowCreateForm(false)}>
          <div className="glass-ivory rounded-3xl p-4 sm:p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg sm:text-2xl font-bold mb-4 text-[#8B1538]" style={{ fontFamily: 'Playfair Display, serif' }}>
              Create Staff Account
            </h3>
            
            <div className="space-y-3 mb-4">
              <div>
                <label className="block font-semibold mb-2">Full Name</label>
                <input
                  type="text"
                  value={newStaff.name}
                  onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="e.g., Rajesh Kumar"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Username</label>
                <input
                  type="text"
                  value={newStaff.username}
                  onChange={(e) => setNewStaff({ ...newStaff, username: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="e.g., rajesh123"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Password</label>
                <input
                  type="password"
                  value={newStaff.password}
                  onChange={(e) => setNewStaff({ ...newStaff, password: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Minimum 6 characters"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Role</label>
                <select
                  value={newStaff.role}
                  onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="waiter">Waiter (Table Management)</option>
                  <option value="stock_manager">Stock Manager (Inventory Only)</option>
                  <option value="display">Display Only (Kitchen Screen)</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowCreateForm(false)}
                className="flex-1 bg-gray-300 text-gray-700 font-bold py-2 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={createStaff}
                className="flex-1 btn-maroon"
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const OffersTab = ({ token }) => {
  return <OffersTabComponent token={token} />;
};

const InventoryTab = ({ token }) => {
  const [inventory, setInventory] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [viewMode, setViewMode] = useState('cards');
  const [editingId, setEditingId] = useState(null);
  const [showStockLogs, setShowStockLogs] = useState(false);
  const [selectedItemForLogs, setSelectedItemForLogs] = useState(null);
  const [showAddStockForm, setShowAddStockForm] = useState(false);
  const [addStockData, setAddStockData] = useState({
    quantity: 0,
    price_per_unit: 0
  });
  const [formData, setFormData] = useState({
    item_name: '',
    quantity: 0,
    unit: 'kg',
    min_stock: 0,
    supplier: '',
    category: '',
    price_per_unit: 0,
    image: null
  });

  const fetchInventory = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/inventory`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInventory(response.data.data || response.data || []);
      
      // Extract unique categories from inventory items
      const uniqueCategories = [...new Set(
        (response.data.data || response.data || [])
          .map(item => item.category)
          .filter(Boolean)
      )];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      setInventory([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      setUploading(true);
      const formDataToSend = new FormData();
      formDataToSend.append('item_name', formData.item_name);
      formDataToSend.append('quantity', formData.quantity);
      formDataToSend.append('unit', formData.unit);
      formDataToSend.append('min_stock', formData.min_stock);
      formDataToSend.append('supplier', formData.supplier);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('price_per_unit', formData.price_per_unit);
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      if (editingId) {
        // Update existing item
        await axios.put(`${API}/inventory/${editingId}`, formDataToSend, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        // Create new item
        await axios.post(`${API}/inventory`, formDataToSend, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      }
      
      setFormData({ item_name: '', quantity: 0, unit: 'kg', min_stock: 0, supplier: '', category: '', price_per_unit: 0, image: null });
      setImagePreview(null);
      setShowForm(false);
      setEditingId(null);
      fetchInventory();
    } catch (error) {
      console.error('Error saving inventory item:', error);
      alert('Failed to save inventory item: ' + error.response?.data?.detail || error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleEditItem = (item) => {
    setEditingId(item._id);
    setFormData({
      item_name: item.item_name,
      quantity: item.quantity,
      unit: item.unit,
      min_stock: item.min_stock,
      supplier: item.supplier || '',
      category: item.category || '',
      price_per_unit: item.price_per_unit || 0,
      image: null
    });
    if (item.image_url) {
      setImagePreview(`${BACKEND_URL}/api/admin/uploads/${item.image_url.split('/').pop()}`);
    }
    setShowForm(true);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ item_name: '', quantity: 0, unit: 'kg', min_stock: 0, supplier: '', category: '', price_per_unit: 0, image: null });
    setImagePreview(null);
    setShowForm(false);
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await axios.delete(`${API}/inventory/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchInventory();
    } catch (error) {
      console.error('Error deleting inventory item:', error);
      alert('Failed to delete inventory item');
    }
  };

  const handleAddStock = async (item) => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('add_quantity', addStockData.quantity);
      formDataToSend.append('new_price_per_unit', addStockData.price_per_unit);
      
      await axios.post(`${API}/inventory/${item._id}/add-stock`, formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setAddStockData({ quantity: 0, price_per_unit: 0 });
      setShowAddStockForm(false);
      setSelectedItemForLogs(null);
      fetchInventory();
      alert('Stock added successfully!');
    } catch (error) {
      console.error('Error adding stock:', error);
      alert('Failed to add stock: ' + error.response?.data?.detail || error.message);
    }
  };

  const getStockStatus = (quantity, minStock) => {
    if (quantity <= minStock) {
      return { label: 'Low Stock', color: 'bg-red-100 text-red-800', badgeColor: 'bg-red-500' };
    } else if (quantity <= minStock * 1.5) {
      return { label: 'Medium', color: 'bg-yellow-100 text-yellow-800', badgeColor: 'bg-yellow-500' };
    } else {
      return { label: 'Good', color: 'bg-green-100 text-green-800', badgeColor: 'bg-green-500' };
    }
  };

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.item_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Calculate summary statistics
  const totalInventoryValue = inventory.reduce((sum, item) => sum + ((item.quantity || 0) * (item.price_per_unit || 0)), 0);
  const lowStockItems = inventory.filter(item => item.quantity <= item.min_stock);
  const allStockLogs = inventory
    .flatMap(item => 
      (item.stock_logs || []).map(log => ({
        ...log,
        itemName: item.item_name,
        unit: item.unit,
        itemId: item._id
      }))
    )
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 5); // Last 5 updates

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-6 mb-6">
        <h2 className="text-lg sm:text-2xl font-bold" style={{ color: '#8B1538' }}>Inventory Management</h2>
        {!showForm && (
          <button
            onClick={() => {
              setShowForm(true);
              setEditingId(null);
              setFormData({ item_name: '', quantity: 0, unit: 'kg', min_stock: 0, supplier: '', category: '', price_per_unit: 0, image: null });
              setImagePreview(null);
            }}
            className="px-4 py-2 bg-[#8B1538] text-white rounded-lg hover:bg-[#A0153E] transition-all text-sm font-semibold"
          >
            + Add Item
          </button>
        )}
      </div>

      {/* Summary Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
        {/* Total Inventory Value Card */}
        <div className="premium-card p-4 sm:p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 font-semibold">Total Inventory Value</p>
              <h3 className="text-2xl sm:text-3xl font-bold text-green-700 mt-2">₹ {totalInventoryValue.toFixed(2)}</h3>
            </div>
            <div className="text-3xl sm:text-4xl text-green-300">📦</div>
          </div>
          <p className="text-xs text-green-600 mt-3">
            <span className="font-semibold">{inventory.length}</span> items in stock
          </p>
        </div>

        {/* Low Stock Alert Card */}
        <div className="premium-card p-4 sm:p-6 bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-200">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 font-semibold">Low Stock Items</p>
              <h3 className="text-2xl sm:text-3xl font-bold text-red-700 mt-2">{lowStockItems.length}</h3>
            </div>
            <div className="text-3xl sm:text-4xl">⚠️</div>
          </div>
          {lowStockItems.length > 0 ? (
            <div className="mt-3 space-y-1 max-h-20 overflow-y-auto">
              {lowStockItems.map(item => (
                <p key={item._id} className="text-xs text-red-700 font-semibold truncate">
                  • {item.item_name} ({item.quantity}/{item.min_stock} {item.unit})
                </p>
              ))}
            </div>
          ) : (
            <p className="text-xs text-green-600 mt-3 font-semibold">✓ All items at safe levels</p>
          )}
        </div>

        {/* Recent Updates Card */}
        <div className="premium-card p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 font-semibold">Recent Stock Updates</p>
              <h3 className="text-2xl sm:text-3xl font-bold text-blue-700 mt-2">{allStockLogs.length}</h3>
            </div>
            <div className="text-3xl sm:text-4xl">📊</div>
          </div>
          {allStockLogs.length > 0 ? (
            <div className="mt-3 space-y-1 max-h-20 overflow-y-auto">
              {allStockLogs.map((log, idx) => (
                <p key={idx} className="text-xs text-blue-700 font-semibold truncate">
                  • {log.itemName}: +{log.added_quantity} @ ₹{log.price_per_unit?.toFixed(2) || 'N/A'}
                </p>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-500 mt-3 font-semibold">No updates yet</p>
          )}
        </div>
      </div>

      {showForm && (
        <div className="premium-card p-4 sm:p-6 mb-6">
          <h3 className="text-lg font-bold mb-4" style={{ color: '#8B1538' }}>
            {editingId ? 'Edit Inventory Item' : 'Add Inventory Item'}
          </h3>
          <form onSubmit={handleAddItem} className="space-y-4">
            {/* Image Upload Section */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#8B1538] transition-colors">
              {imagePreview ? (
                <div className="space-y-2">
                  <img src={imagePreview} alt="Preview" className="w-24 h-24 mx-auto object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      setFormData({ ...formData, image: null });
                    }}
                    className="text-sm text-red-500 hover:text-red-700 font-semibold"
                  >
                    Remove Image
                  </button>
                </div>
              ) : (
                <div>
                  <Upload size={32} className="mx-auto text-gray-400 mb-2" />
                  <label className="cursor-pointer">
                    <span className="text-sm font-semibold text-[#8B1538]">Click to upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                </div>
              )}
            </div>

            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Item Name"
                value={formData.item_name}
                onChange={(e) => setFormData({ ...formData, item_name: e.target.value })}
                required
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8B1538]"
              />
              <div className="flex gap-2">
                <select
                  value={formData.category}
                  onChange={(e) => {
                    if (e.target.value === '__new__') {
                      setShowNewCategory(true);
                    } else {
                      setFormData({ ...formData, category: e.target.value });
                    }
                  }}
                  required
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8B1538]"
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                  <option value="__new__">+ Create New Category</option>
                </select>
                {showNewCategory && (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Category name"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8B1538]"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newCategoryName.trim()) {
                          setFormData({ ...formData, category: newCategoryName });
                          setCategories([...categories, newCategoryName]);
                          setNewCategoryName('');
                          setShowNewCategory(false);
                        }
                      }}
                      className="px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-semibold"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowNewCategory(false);
                        setNewCategoryName('');
                      }}
                      className="px-3 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg text-sm font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
              <input
                type="number"
                placeholder="Quantity"
                step="0.01"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) || 0 })}
                required
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8B1538]"
              />
              <select
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8B1538]"
              >
                <option value="kg">KG</option>
                <option value="liter">Liter</option>
                <option value="pcs">Pcs</option>
                <option value="box">Box</option>
              </select>
              <input
                type="number"
                placeholder="Min Stock Level"
                step="0.01"
                value={formData.min_stock}
                onChange={(e) => setFormData({ ...formData, min_stock: parseFloat(e.target.value) || 0 })}
                required
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8B1538]"
              />
              <input
                type="text"
                placeholder="Supplier"
                value={formData.supplier}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8B1538]"
              />
              <input
                type="number"
                placeholder="Price per Unit (₹)"
                step="0.01"
                value={formData.price_per_unit}
                onChange={(e) => setFormData({ ...formData, price_per_unit: parseFloat(e.target.value) || 0 })}
                required
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8B1538]"
              />
            </div>

            <button
              type="submit"
              disabled={uploading}
              className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-bold py-2 rounded-lg transition-all"
            >
              {uploading ? 'Saving Item...' : (editingId ? 'Update Item' : 'Add Item')}
            </button>
            <button
              type="button"
              onClick={handleCancelEdit}
              className="w-full bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 rounded-lg transition-all mt-2"
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-6 space-y-3">
        <input
          type="text"
          placeholder="Search inventory..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8B1538]"
        />
        
        {/* Category Filter */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-3 py-2 rounded-lg font-semibold text-sm transition-all ${
              filterCategory === 'all'
                ? 'bg-[#8B1538] text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All Categories
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-2 rounded-lg font-semibold text-sm transition-all whitespace-nowrap ${
                filterCategory === cat
                  ? 'bg-[#8B1538] text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* View Toggle Buttons */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setViewMode('cards')}
          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 ${
            viewMode === 'cards'
              ? 'bg-[#8B1538] text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <Grid size={18} />
          Cards
        </button>
        <button
          onClick={() => setViewMode('list')}
          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 ${
            viewMode === 'list'
              ? 'bg-[#8B1538] text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <List size={18} />
          List
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading inventory...</div>
      ) : filteredInventory.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No inventory items found</div>
      ) : viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
          {filteredInventory.map((item) => {
            const status = getStockStatus(item.quantity, item.min_stock);
            return (
              <div key={item._id} className="premium-card overflow-hidden hover:shadow-lg transition-shadow">
                {/* Image Section */}
                <div className="relative h-24 sm:h-28 bg-gray-100 overflow-hidden group">
                  {item.image_url ? (
                    <img
                      src={`${BACKEND_URL}/api/admin/uploads/${item.image_url.split('/').pop()}`}
                      alt={item.item_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                      <Package size={32} className="text-gray-400" />
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <div className={`absolute top-1.5 right-1.5 px-2 py-0.5 rounded-full text-xs font-bold text-white ${status.badgeColor}`}>
                    {status.label}
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeleteItem(item._id)}
                    className="absolute top-1.5 left-1.5 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    title="Delete item"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                {/* Content Section */}
                <div className="p-2 sm:p-3">
                  <h3 className="text-xs sm:text-sm font-bold text-[#8B1538] mb-1 truncate">{item.item_name}</h3>
                  
                  <div className="space-y-0.5 text-xs mb-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Qty:</span>
                      <span className="font-semibold text-[#8B1538]">{item.quantity} {item.unit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Min:</span>
                      <span className="font-semibold text-gray-700">{item.min_stock}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price:</span>
                      <span className="font-semibold text-[#FFD700]">₹ {(item.price_per_unit || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Value:</span>
                      <span className="font-bold text-green-600">₹ {((item.quantity || 0) * (item.price_per_unit || 0)).toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Status Bar */}
                  <div className="mb-2">
                    <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full ${status.badgeColor}`}
                        style={{ width: `${Math.min((item.quantity / item.min_stock) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <p className={`text-xs font-semibold mt-0.5 ${status.color} px-1.5 py-0.5 rounded`}>
                      {status.label}
                    </p>
                  </div>

                  {/* Update Button */}
                  <div className="flex gap-1.5">
                    <button
                      className="flex-1 bg-[#8B1538] hover:bg-[#A0153E] text-white font-semibold py-1 rounded text-xs transition-all"
                      onClick={() => handleEditItem(item)}
                    >
                      Edit
                    </button>
                    <button
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-1 rounded text-xs transition-all flex items-center justify-center gap-1"
                      onClick={() => {
                        setSelectedItemForLogs(item);
                        setShowStockLogs(true);
                      }}
                      title="Add stock"
                    >
                      <Plus size={14} />
                      Stock
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredInventory.map((item) => {
            const status = getStockStatus(item.quantity, item.min_stock);
            return (
              <div key={item._id} className="premium-card overflow-hidden hover:shadow-lg transition-shadow">
                {/* Horizontal Layout - Image Left, Info Right */}
                <div className="flex flex-col sm:flex-row">
                  {/* Image Section - Left */}
                  <div className="relative w-full sm:w-32 h-28 sm:h-auto bg-gray-100 overflow-hidden group flex-shrink-0">
                    {item.image_url ? (
                      <img
                        src={`${BACKEND_URL}/api/admin/uploads/${item.image_url.split('/').pop()}`}
                        alt={item.item_name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                        <Package size={32} className="text-gray-400" />
                      </div>
                    )}
                    
                    {/* Delete Button */}
                    <button
                      onClick={() => handleDeleteItem(item._id)}
                      className="absolute top-2 left-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                      title="Delete item"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  {/* Content Section - Right */}
                  <div className="flex-1 p-2 sm:p-3 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2 mb-1.5">
                        <div className="min-w-0">
                          <h3 className="text-xs sm:text-sm font-bold text-[#8B1538] truncate">{item.item_name}</h3>
                          <p className="text-xs text-gray-500 truncate">{item.supplier || 'No supplier'}</p>
                        </div>
                        <div className={`px-2 py-0.5 rounded-full text-xs font-bold text-white flex-shrink-0 whitespace-nowrap ${status.badgeColor}`}>
                          {status.label}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-1.5 mb-2 text-xs">
                        <div className="bg-gray-50 p-1.5 rounded">
                          <p className="text-xs text-gray-600">Qty</p>
                          <p className="font-bold text-[#8B1538] truncate">{item.quantity} {item.unit}</p>
                        </div>
                        <div className="bg-gray-50 p-1.5 rounded">
                          <p className="text-xs text-gray-600">Min</p>
                          <p className="font-bold text-gray-700">{item.min_stock}</p>
                        </div>
                        <div className="bg-gray-50 p-1.5 rounded">
                          <p className="text-xs text-gray-600">%</p>
                          <p className="font-bold text-[#8B1538]">{item.min_stock > 0 ? ((item.quantity / item.min_stock) * 100).toFixed(0) : 0}%</p>
                        </div>
                      </div>

                      {/* Stock Value Section */}
                      <div className="grid grid-cols-2 gap-1.5 mb-2 text-xs">
                        <div className="bg-blue-50 p-1.5 rounded border border-blue-200">
                          <p className="text-xs text-gray-600">Price/Unit</p>
                          <p className="font-bold text-blue-600">₹ {(item.price_per_unit || 0).toFixed(2)}</p>
                        </div>
                        <div className="bg-green-50 p-1.5 rounded border border-green-200">
                          <p className="text-xs text-gray-600">Stock Value</p>
                          <p className="font-bold text-green-600">₹ {((item.quantity || 0) * (item.price_per_unit || 0)).toFixed(2)}</p>
                        </div>
                      </div>

                      {/* Status Bar Below */}
                      <div className="mb-1.5">
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full transition-all ${status.badgeColor}`}
                            style={{ width: `${Math.min((item.quantity / item.min_stock) * 100, 100)}%` }}
                          ></div>
                        </div>
                        <p className={`text-xs font-semibold mt-0.5 ${status.color} px-2 py-0.5 rounded inline-block`}>
                          {status.label}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-1.5 pt-1.5 border-t">
                      <button
                        className="flex-1 bg-[#8B1538] hover:bg-[#A0153E] text-white font-semibold py-1 rounded text-xs transition-all"
                        onClick={() => handleEditItem(item)}
                      >
                        Edit
                      </button>
                      <button
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-1 rounded text-xs transition-all flex items-center justify-center gap-1"
                        onClick={() => {
                          setSelectedItemForLogs(item);
                          setShowStockLogs(true);
                        }}
                        title="Add stock"
                      >
                        <Plus size={14} />
                        Stock
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item._id)}
                        className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white font-semibold rounded text-xs transition-all"
                      >
                        Del
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Stock Logs Sidebar */}
      {showStockLogs && selectedItemForLogs && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex">
          {/* Overlay */}
          <div className="flex-1" onClick={() => {
            setShowStockLogs(false);
            setSelectedItemForLogs(null);
            setShowAddStockForm(false);
            setAddStockData({ quantity: 0, price_per_unit: 0 });
          }}></div>

          {/* Right Sidebar */}
          <div className="w-96 bg-white shadow-2xl overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-[#8B1538] to-[#A0153E] text-white p-4 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg">{selectedItemForLogs.item_name}</h3>
                <p className="text-xs text-gray-200">Stock & Pricing History</p>
              </div>
              <button
                onClick={() => {
                  setShowStockLogs(false);
                  setSelectedItemForLogs(null);
                  setShowAddStockForm(false);
                  setAddStockData({ quantity: 0, price_per_unit: 0 });
                }}
                className="hover:bg-white hover:bg-opacity-20 p-2 rounded transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Current Stock Info */}
            <div className="p-4 bg-gradient-to-b from-blue-50 to-green-50 border-b-2 border-gray-200">
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="bg-white p-3 rounded-lg border-2 border-blue-200">
                  <p className="text-xs text-gray-600">Current Qty</p>
                  <p className="font-bold text-lg text-blue-600">{selectedItemForLogs.quantity} {selectedItemForLogs.unit}</p>
                </div>
                <div className="bg-white p-3 rounded-lg border-2 border-green-200">
                  <p className="text-xs text-gray-600">Current Value</p>
                  <p className="font-bold text-lg text-green-600">₹ {((selectedItemForLogs.quantity || 0) * (selectedItemForLogs.price_per_unit || 0)).toFixed(2)}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white p-3 rounded-lg">
                  <p className="text-xs text-gray-600">Price/Unit</p>
                  <p className="font-bold text-[#FFD700]">₹ {(selectedItemForLogs.price_per_unit || 0).toFixed(2)}</p>
                </div>
                <div className="bg-white p-3 rounded-lg">
                  <p className="text-xs text-gray-600">Status</p>
                  <p className={`font-bold text-sm ${
                    selectedItemForLogs.quantity <= selectedItemForLogs.min_stock ? 'text-red-600' :
                    selectedItemForLogs.quantity <= selectedItemForLogs.min_stock * 1.5 ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {selectedItemForLogs.quantity <= selectedItemForLogs.min_stock ? 'Low' :
                     selectedItemForLogs.quantity <= selectedItemForLogs.min_stock * 1.5 ? 'Medium' : 'Good'}
                  </p>
                </div>
              </div>
            </div>

            {/* Add Stock Form */}
            {!showAddStockForm ? (
              <div className="p-4">
                <button
                  onClick={() => setShowAddStockForm(true)}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all"
                >
                  <Plus size={20} />
                  Add Stock
                </button>
              </div>
            ) : (
              <div className="p-4 bg-green-50 border-b-2 border-green-200">
                <h4 className="font-bold text-sm mb-3 text-green-700">Add New Stock</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-600 font-semibold">Quantity to Add</label>
                    <input
                      type="number"
                      step="0.01"
                      value={addStockData.quantity}
                      onChange={(e) => setAddStockData({ ...addStockData, quantity: parseFloat(e.target.value) || 0 })}
                      placeholder="e.g. 5"
                      className="w-full px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:border-green-600 mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 font-semibold">New Price per Unit (₹)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={addStockData.price_per_unit}
                      onChange={(e) => setAddStockData({ ...addStockData, price_per_unit: parseFloat(e.target.value) || 0 })}
                      placeholder="e.g. 15.50"
                      className="w-full px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:border-green-600 mt-1"
                    />
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-green-200">
                    <p className="text-xs text-gray-600 mb-2">💰 Value Breakdown</p>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Current Stock ({selectedItemForLogs.quantity} {selectedItemForLogs.unit}):</span>
                        <span className="font-bold text-blue-600">₹ {(selectedItemForLogs.quantity * selectedItemForLogs.price_per_unit).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">New Stock ({addStockData.quantity} {selectedItemForLogs.unit}):</span>
                        <span className="font-bold text-green-600">₹ {(addStockData.quantity * addStockData.price_per_unit).toFixed(2)}</span>
                      </div>
                      <div className="border-t border-gray-200 pt-1 mt-1 flex justify-between">
                        <span className="text-gray-800 font-semibold">Total Stock Value:</span>
                        <span className="font-bold text-lg text-green-600">₹ {((selectedItemForLogs.quantity * selectedItemForLogs.price_per_unit) + (addStockData.quantity * addStockData.price_per_unit)).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAddStock(selectedItemForLogs)}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-lg transition-all"
                    >
                      Save Stock
                    </button>
                    <button
                      onClick={() => {
                        setShowAddStockForm(false);
                        setAddStockData({ quantity: 0, price_per_unit: 0 });
                      }}
                      className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 rounded-lg transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Stock Logs History */}
            <div className="p-4">
              <h4 className="font-bold text-sm mb-3 text-gray-700 flex items-center gap-2">
                <Clock size={16} />
                Stock Update History
              </h4>
              {selectedItemForLogs.stock_logs && selectedItemForLogs.stock_logs.length > 0 ? (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {selectedItemForLogs.stock_logs.map((log, idx) => (
                    <div key={idx} className="bg-gradient-to-r from-gray-50 to-gray-100 p-3 rounded-lg border-l-4 border-[#8B1538]">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-bold text-sm text-[#8B1538]">+{log.added_quantity} {selectedItemForLogs.unit}</p>
                          <p className="text-xs text-gray-600">@ ₹ {log.price_per_unit.toFixed(2)}/unit</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">₹ {(log.added_quantity * log.price_per_unit).toFixed(2)}</p>
                        </div>
                      </div>
                      <div className="bg-blue-50 p-2 rounded mb-2 border border-blue-200">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-600">Stock after:</span>
                          <span className="font-bold text-[#8B1538]">{log.quantity_after} {selectedItemForLogs.unit}</span>
                        </div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-600">Total Stock Value:</span>
                          <span className="font-bold text-green-600">₹ {log.total_stock_value?.toFixed(2) || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">Avg Price/Unit:</span>
                          <span className="font-bold text-blue-600">₹ {log.weighted_avg_price?.toFixed(2) || 'N/A'}</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock size={12} />
                        {new Date(log.timestamp).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Package size={32} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No stock updates yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Universal Stock Logs - All Updates */}
      <div className="mt-12 mb-8">
        <div className="premium-card p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-bold mb-4 text-[#8B1538] flex items-center gap-2">
            <Clock size={24} />
            Universal Stock Update Logs
          </h3>
          
          {/* All Logs Combined */}
          {inventory && inventory.length > 0 ? (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {
                // Flatten all stock logs from all items with item reference
                inventory
                  .flatMap(item => 
                    (item.stock_logs || []).map(log => ({
                      ...log,
                      itemName: item.item_name,
                      unit: item.unit,
                      itemId: item._id
                    }))
                  )
                  // Sort by timestamp descending (newest first)
                  .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                  .map((log, idx) => (
                    <div key={`${log.itemId}-${idx}`} className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 sm:p-4 rounded-lg border-l-4 border-[#8B1538] hover:shadow-md transition-all">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                        <div>
                          <p className="font-bold text-sm sm:text-base text-[#8B1538]">{log.itemName}</p>
                          <p className="text-xs text-gray-600">+{log.added_quantity} {log.unit} @ ₹ {log.price_per_unit?.toFixed(2) || 'N/A'}/unit</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">₹ {(log.batch_value || log.added_quantity * log.price_per_unit)?.toFixed(2) || 'N/A'}</p>
                          <p className="text-xs text-gray-500">{new Date(log.timestamp).toLocaleString()}</p>
                        </div>
                      </div>
                      
                      {/* Detailed Breakdown */}
                      <div className="bg-white p-2 sm:p-3 rounded border border-gray-200 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                        <div>
                          <p className="text-gray-600 font-semibold">Qty Added</p>
                          <p className="font-bold text-[#8B1538]">{log.added_quantity} {log.unit}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 font-semibold">Stock After</p>
                          <p className="font-bold text-blue-600">{log.quantity_after} {log.unit}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 font-semibold">Total Value</p>
                          <p className="font-bold text-green-600">₹ {log.total_stock_value?.toFixed(2) || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 font-semibold">Avg Price/Unit</p>
                          <p className="font-bold text-purple-600">₹ {log.weighted_avg_price?.toFixed(2) || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  ))
              }
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Clock size={40} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm font-semibold">No stock updates recorded yet</p>
              <p className="text-xs text-gray-400 mt-1">All inventory stock updates will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
