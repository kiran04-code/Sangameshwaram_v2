import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { LogOut, Plus, Check, DollarSign, Users, Clock, AlertCircle, CheckCircle, Trash2, X } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import LanguageSwitcher from '../components/LanguageSwitcher';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api/admin`;
const LOGO_URL = 'https://customer-assets.emergentagent.com/job_menu-hub-dine/artifacts/w81h57nj_image.png';

const WaiterDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated, token, logout } = useAdmin();
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all'); // all, ready, completed
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Fetch orders from backend
  const fetchOrders = useCallback(async () => {
    try {
      const response = await axios.get(`${API}/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('📦 [FETCH ORDERS] Retrieved:', response.data.length, 'orders');
      setOrders(response.data);
    } catch (error) {
      console.error('❌ Error fetching orders:', error);
    }
  }, [token]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      fetchOrders();
      // Refresh orders every 5 seconds
      const interval = setInterval(fetchOrders, 5000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, navigate, fetchOrders]);

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return order.status === 'ready';
    return order.status === filter;
  });

  // Handle order confirmation (proceed)
  const handleProceedOrder = (order) => {
    setSelectedOrder(order);
    setShowPaymentModal(true);
  };

  // Handle payment selection and status update
  const handleConfirmPayment = async (paymentMethod) => {
    if (!selectedOrder) return;

    try {
      console.log('💳 [PAYMENT] Confirming payment method:', paymentMethod);
      
      // Update order status to "processing" with payment method
      const response = await axios.put(`${API}/orders/${selectedOrder._id}`, 
        {
          status: 'processing',
          payment_method: paymentMethod
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log('✅ [ORDER UPDATE] Status changed to processing:', response.data);
      
      // Update local state
      setOrders(orders.map(o => o._id === selectedOrder._id ? response.data : o));
      
      // Reset modals
      setShowPaymentModal(false);
      setSelectedOrder(null);
      setSelectedPayment(null);
      
      alert(`Order confirmed! Payment method: ${paymentMethod.toUpperCase()}`);
    } catch (error) {
      console.error('❌ Error updating order:', error);
      alert('Error confirming order. Please try again.');
    }
  };

  // Mark order as ready/delivered
  const handleUpdateOrderStatus = async (order, newStatus) => {
    try {
      console.log('📋 [UPDATE STATUS] Order:', order._id, 'New status:', newStatus);
      
      const response = await axios.put(`${API}/orders/${order._id}`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log('✅ [STATUS UPDATE] Complete:', response.data);
      
      // Update local state
      setOrders(orders.map(o => o._id === order._id ? response.data : o));
    } catch (error) {
      console.error('❌ Error updating order status:', error);
      alert('Error updating order. Please try again.');
    }
  };

  // Handle add items to order
  const handleAddItemsToOrder = async () => {
    if (selectedItems.length === 0 || !selectedOrder) return;

    try {
      console.log('➕ [ADD ITEMS] Adding', selectedItems.length, 'items to order', selectedOrder._id);
      
      const response = await axios.put(`${API}/orders/${selectedOrder._id}`,
        { items: selectedItems },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log('✅ [ITEMS ADDED] Complete:', response.data);
      
      // Update local state
      setOrders(orders.map(o => o._id === selectedOrder._id ? response.data : o));
      setShowAddItems(false);
      setSelectedItems([]);
      setSelectedOrder(null);
    } catch (error) {
      console.error('❌ Error adding items:', error);
      alert('Error adding items. Please try again.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ready':
        return <CheckCircle size={20} className="text-green-600" />;
      case 'new':
        return <Clock size={20} className="text-orange-600" />;
      case 'preparing':
        return <Clock size={20} className="text-yellow-600" />;
      case 'delivered':
        return <CheckCircle size={20} className="text-purple-600" />;
      default:
        return <Clock size={20} className="text-stone-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'new':
        return 'bg-blue-50 border-blue-200 text-blue-700';
      case 'preparing':
        return 'bg-yellow-50 border-yellow-200 text-yellow-700';
      case 'ready':
        return 'bg-green-50 border-green-200 text-green-700';
      case 'delivered':
        return 'bg-purple-50 border-purple-200 text-purple-700';
      default:
        return 'bg-stone-50 border-stone-200 text-stone-700';
    }
  };

  return (
    <div className="min-h-screen">
      {/* Decorative Corners */}
      <div className="mandala-corner top-left"></div>
      <div className="mandala-corner top-right"></div>

      {/* Header */}
      <header className="bg-gradient-to-r from-[#8B1538] to-[#A0153E] border-b-4 border-[#FFD700] px-4 py-4 relative z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src={LOGO_URL} alt="Logo" className="w-10 h-10 rounded-full object-cover border-2 border-[#FFD700]" />
            <div>
              <h1 className="text-2xl font-black text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
                {t('waiter_dashboard')}
              </h1>
              <p className="text-white/80 text-sm">{t('tagline')}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <button
              onClick={handleLogout}
              className="btn-gold flex items-center gap-2"
            >
              <LogOut size={18} />
              {t('logout')}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="premium-card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#8B1538] to-[#A0153E] rounded-xl flex items-center justify-center">
                <Clock className="text-white" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">{t('ready')}</p>
                <p className="text-2xl font-black text-[#8B1538]">{orders.filter(o => o.status === 'ready').length}</p>
              </div>
            </div>
          </div>
          
          <div className="premium-card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#F4C430] to-[#FFD700] rounded-xl flex items-center justify-center">
                <Check className="text-[#8B1538]" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Completed</p>
                <p className="text-2xl font-black text-[#8B1538]">{orders.filter(o => o.status === 'completed').length}</p>
              </div>
            </div>
          </div>
          
          <div className="premium-card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#8B1538] to-[#A0153E] rounded-xl flex items-center justify-center">
                <CheckCircle className="text-white" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Today</p>
                <p className="text-2xl font-black text-[#8B1538]">{orders.length}</p>
              </div>
            </div>
          </div>
          
          <div className="premium-card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#F4C430] to-[#FFD700] rounded-xl flex items-center justify-center">
                <DollarSign className="text-[#8B1538]" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-2xl font-black text-[#8B1538]">{orders.filter(o => o.status !== 'completed').length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
          {['all', 'ready', 'completed'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`whitespace-nowrap px-4 py-2 rounded-full font-bold text-sm transition-all capitalize ${
                filter === status
                  ? 'bg-[#8B1538] text-white'
                  : 'bg-white text-stone-600 border border-stone-200 hover:border-stone-300'
              }`}
            >
              {status === 'completed' ? 'Completed' : status}
            </button>
          ))}
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <div
                key={order._id}
                className={`border rounded-2xl p-6 transition-all hover:shadow-md ${getStatusColor(
                  order.status
                )}`}
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      {getStatusIcon(order.status)}
                      <span className="font-bold capitalize">{order.status}</span>
                    </div>

                    {/* Order Info */}
                    <h3 className="font-bold text-stone-900 mb-2">
                      Order #{order.order_number || order._id?.slice(-6) || 'N/A'}
                    </h3>

                    <div className="bg-white/50 rounded-lg p-3 mb-3 space-y-1 text-sm">
                      <p className="text-stone-700">
                        <span className="font-semibold">👤 Name:</span> {order.customer_name || 'Guest'}
                      </p>
                      {order.table_number && (
                        <p className="text-stone-700">
                          <span className="font-semibold">🪑 Table:</span> {order.table_number}
                        </p>
                      )}
                      <p className="text-stone-700">
                        <span className="font-semibold">📞 Phone:</span> {order.customer_phone || 'N/A'}
                      </p>
                      {order.payment_method && (
                        <p className="text-stone-700">
                          <span className="font-semibold">💳 Payment:</span> {order.payment_method.toUpperCase()}
                        </p>
                      )}
                    </div>

                    {/* Items List */}
                    <div className="mb-3">
                      <p className="text-xs font-semibold text-stone-600 mb-2">Items:</p>
                      <div className="space-y-1">
                        {order.items?.slice(0, 3).map((item, idx) => (
                          <p key={idx} className="text-sm text-stone-700">
                            • {item.quantity}x {item.name} @ ₹{item.price}
                          </p>
                        ))}
                        {order.items?.length > 3 && (
                          <p className="text-xs text-stone-600">
                            +{order.items.length - 3} more items
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Bill Summary */}
                    <div className="bg-stone-100 rounded-lg p-2 mb-3 text-sm space-y-0.5">
                      <div className="flex justify-between">
                        <span className="text-stone-600">Subtotal:</span>
                        <span className="font-semibold">₹{order.subtotal || 0}</span>
                      </div>
                      {order.gst_amount > 0 && (
                        <div className="flex justify-between">
                          <span className="text-stone-600">GST ({order.gst_percentage}%):</span>
                          <span className="font-semibold">₹{order.gst_amount}</span>
                        </div>
                      )}
                      {order.delivery_charge > 0 && (
                        <div className="flex justify-between">
                          <span className="text-stone-600">Delivery:</span>
                          <span className="font-semibold">₹{order.delivery_charge}</span>
                        </div>
                      )}
                      {order.discount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Discount:</span>
                          <span>-₹{order.discount}</span>
                        </div>
                      )}
                      <div className="flex justify-between border-t border-stone-300 pt-1 font-bold">
                        <span>Total:</span>
                        <span className="text-lg">₹{order.total || 0}</span>
                      </div>
                    </div>

                    {/* Timestamp */}
                    <div className="text-xs text-stone-500">
                      {new Date(order.created_at).toLocaleDateString()} {new Date(order.created_at).toLocaleTimeString()}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-shrink-0 gap-2 flex-col">
                    {order.status === 'ready' && (
                      <button
                        onClick={() => handleUpdateOrderStatus(order, 'completed')}
                        className="flex items-center gap-1 px-3 py-2 bg-green-600 text-white rounded-lg font-semibold text-sm hover:bg-green-700 transition-all whitespace-nowrap"
                      >
                        <Check size={16} />
                        Complete
                      </button>
                    )}
                    {order.status === 'completed' && (
                      <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded text-center font-semibold">
                        ✓ Completed
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4 text-stone-400">
                <Clock size={32} />
              </div>
              <h3 className="font-bold text-stone-800 mb-2">No Orders</h3>
              <p className="text-stone-600 text-sm">
                {filter === 'all' || filter === 'ready' ? 'No orders ready to deliver yet.' : 'No completed orders.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add Items Modal - Removed for waiter dashboard - only shows ready orders for completion */}

      {/* Payment Modal - Removed for waiter dashboard - only shows ready orders for completion */}
    </div>
  );
};

export default WaiterDashboard;
