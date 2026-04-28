import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import axios from 'axios';
import { Clock, CheckCircle, AlertCircle, ChevronRight, Trash2, Check, X } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api/admin`;

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all'); // all, pending, processing, completed, cancelled
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  // Fetch orders from backend
  const fetchOrders = useCallback(async () => {
    try {
      const response = await axios.get(`${API}/orders`);
      console.log('📦 [FETCH ORDERS] Retrieved:', response.data.length, 'orders');
      setOrders(response.data);
    } catch (error) {
      console.error('❌ Error fetching orders:', error);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    // Refresh orders every 5 seconds
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
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
      const response = await axios.put(`${API}/orders/${selectedOrder._id}`, {
        status: 'processing',
        payment_method: paymentMethod
      });

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

  // Handle cancel order
  const handleCancelOrder = async (order) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;

    try {
      console.log('🚫 [CANCEL] Cancelling order:', order._id);
      
      const response = await axios.put(`${API}/orders/${order._id}`, {
        status: 'cancelled'
      });

      console.log('✅ [CANCEL COMPLETE] Order cancelled:', response.data);
      
      // Update local state
      setOrders(orders.map(o => o._id === order._id ? response.data : o));
      alert('Order cancelled successfully');
    } catch (error) {
      console.error('❌ Error cancelling order:', error);
      alert('Error cancelling order. Please try again.');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={20} className="text-green-600" />;
      case 'pending':
        return <Clock size={20} className="text-orange-600" />;
      case 'cancelled':
        return <AlertCircle size={20} className="text-red-600" />;
      default:
        return <Clock size={20} className="text-stone-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 border-green-200 text-green-700';
      case 'pending':
        return 'bg-orange-50 border-orange-200 text-orange-700';
      case 'cancelled':
        return 'bg-red-50 border-red-200 text-red-700';
      default:
        return 'bg-stone-50 border-stone-200 text-stone-700';
    }
  };

  return (
    <div className="min-h-screen bg-[#FCFCFC]">
      <Header showSearch={false} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-stone-900 mb-2">My Orders</h1>
          <p className="text-stone-600">Track your food orders here</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
          {['all', 'pending', 'processing', 'completed', 'cancelled'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`whitespace-nowrap px-4 py-2 rounded-full font-bold text-sm transition-all capitalize ${
                filter === status
                  ? 'bg-rose-600 text-white'
                  : 'bg-white text-stone-600 border border-stone-200 hover:border-stone-300'
              }`}
            >
              {status}
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

                    {/* Customer Info */}
                    <h3 className="font-bold text-stone-900 mb-2">
                      Order #{order._id?.slice(-6) || 'N/A'}
                    </h3>

                    <div className="bg-white/50 rounded-lg p-3 mb-3 space-y-1 text-sm">
                      <p className="text-stone-700">
                        <span className="font-semibold">👤 Name:</span> {order.customer_name || 'Guest'}
                      </p>
                      <p className="text-stone-700">
                        <span className="font-semibold">🪑 Table:</span> {order.table_number || 'N/A'}
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
                    {order.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleProceedOrder(order)}
                          className="flex items-center gap-1 px-3 py-2 bg-green-600 text-white rounded-lg font-semibold text-sm hover:bg-green-700 transition-all whitespace-nowrap"
                        >
                          <Check size={16} />
                          Proceed
                        </button>
                        <button
                          onClick={() => handleCancelOrder(order)}
                          className="flex items-center gap-1 px-3 py-2 bg-red-600 text-white rounded-lg font-semibold text-sm hover:bg-red-700 transition-all whitespace-nowrap"
                        >
                          <Trash2 size={16} />
                          Cancel
                        </button>
                      </>
                    )}
                    {order.status === 'processing' && (
                      <div className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                        Awaiting Kitchen
                      </div>
                    )}
                    {order.status === 'completed' && (
                      <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        Completed
                      </div>
                    )}
                    {order.status === 'cancelled' && (
                      <div className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                        Cancelled
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
                {filter === 'all' ? 'No orders yet.' : `No ${filter} orders.`}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-bold text-stone-900 mb-2">Select Payment Method</h2>
            <p className="text-stone-600 mb-6">
              Order for <span className="font-semibold">{selectedOrder.customer_name}</span> - Table {selectedOrder.table_number}
            </p>

            <div className="space-y-3 mb-6">
              {['cash', 'upi'].map(method => (
                <button
                  key={method}
                  onClick={() => setSelectedPayment(method)}
                  className={`w-full p-4 rounded-lg font-semibold text-lg transition-all border-2 capitalize ${
                    selectedPayment === method
                      ? 'border-green-600 bg-green-50 text-green-700'
                      : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                  }`}
                >
                  {method === 'cash' ? '💵' : '📱'} {method.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  setSelectedOrder(null);
                  setSelectedPayment(null);
                }}
                className="flex-1 px-4 py-2 bg-stone-200 text-stone-900 rounded-lg font-semibold hover:bg-stone-300 transition-all flex items-center justify-center gap-2"
              >
                <X size={18} />
                Cancel
              </button>
              <button
                onClick={() => handleConfirmPayment(selectedPayment)}
                disabled={!selectedPayment}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:bg-stone-300 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                <Check size={18} />
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
