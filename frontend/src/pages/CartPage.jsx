import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Plus, Minus, Trash2, Tag, MessageCircle, Home, ChevronDown, CreditCard } from 'lucide-react';
import { useCart } from '../context/CartContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Helper function to normalize image URLs
const normalizeImageUrl = (url) => {
  if (!url) return null;
  
  // If URL already has http, return as is
  if (url.startsWith('http')) return url;
  
  // If URL already starts with /api/uploads, prepend backend URL
  if (url.startsWith('/api/uploads')) return `${BACKEND_URL}${url}`;
  
  // If URL starts with /uploads (old format), prepend /api and backend URL
  if (url.startsWith('/uploads')) return `${BACKEND_URL}/api${url}`;
  
  // If URL is just a filename (no path), add full path with backend URL
  if (!url.includes('/')) return `${BACKEND_URL}/api/uploads/${url}`;
  
  // Otherwise prepend /api and backend URL
  return `${BACKEND_URL}/api${url}`;
};

const CartPage = () => {
  const navigate = useNavigate();
  const { cart, addToCart, removeFromCart, clearCart, getTotalPrice, getTotalItems } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [razorpayEnabled, setRazorpayEnabled] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);

  const subtotal = getTotalPrice();
  const total = subtotal - couponDiscount;

  // Fetch Razorpay settings on component mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // Fetch from public endpoint (no auth required)
        const response = await axios.get(`${API}/settings`);
        setRazorpayEnabled(response.data.razorpay_auto_confirm || false);
      } catch (error) {
        console.log('Settings not available, Razorpay disabled');
        setRazorpayEnabled(false);
      }
    };
    fetchSettings();
  }, []);

  const applyCoupon = async () => {
    setCouponError('');
    setCouponDiscount(0);
    setCouponApplied(false);
    
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }

    try {
      const response = await axios.post(`${API}/validate-coupon`, {
        code: couponCode,
        subtotal: subtotal
      });
      
      setCouponDiscount(response.data.discount);
      setCouponApplied(true);
    } catch (error) {
      setCouponError(error.response?.data?.detail || 'Invalid coupon code');
    }
  };

  const removeCoupon = () => {
    setCouponCode('');
    setCouponDiscount(0);
    setCouponApplied(false);
    setCouponError('');
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    setShowCheckout(true);
  };

  const submitOrder = async () => {
    if (!customerName.trim() || !tableNumber.trim()) {
      alert('Please enter your name and table number');
      return;
    }

    try {
      // Prepare order data to send to backend
      const orderData = {
        customer_name: customerName,
        table_number: tableNumber,
        items: cart.map(item => ({
          id: item.id || item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image_url: item.image_url
        })),
        subtotal: subtotal,
        discount: couponDiscount,
        coupon_code: couponDiscount > 0 ? couponCode : null,
        total: total,
        order_type: 'dine-in',
        status: 'pending', // WhatsApp orders need manual confirmation
        payment_method: 'whatsapp'
      };

      console.log('📝 [ORDER] Sending WhatsApp order to backend:', orderData);

      // Save order to backend
      const response = await axios.post(`${API}/admin/orders`, orderData);
      console.log('✅ [ORDER] Successfully saved to database:', response.data);

      // Clear cart and close checkout
      clearCart();
      setShowCheckout(false);
      setProcessingPayment(false);
      alert('Order placed! Please check your WhatsApp for confirmation.');
      
      // Redirect to home after short delay
      setTimeout(() => navigate('/'), 1500);
    } catch (error) {
      console.error('❌ [ORDER] Error saving order:', error);
      alert('Error placing order. Please try again.');
      setProcessingPayment(false);
    }
  };

  const handleRazorpayPayment = async () => {
    if (!customerName.trim() || !tableNumber.trim()) {
      alert('Please enter your name and table number');
      return;
    }

    setProcessingPayment(true);

    try {
      // Load Razorpay script
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      
      script.onload = () => {
        // Create order on backend first
        const orderData = {
          amount: Math.round(total * 100), // Amount in paise
          customer_name: customerName,
          table_number: tableNumber,
          items: cart.map(item => ({
            id: item.id || item._id,
            name: item.name,
            price: item.price,
            quantity: item.quantity
          })),
          subtotal: subtotal,
          discount: couponDiscount,
          coupon_code: couponDiscount > 0 ? couponCode : null,
          total: total,
          order_type: 'dine-in'
        };

        // Razorpay options
        const options = {
          key: process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_test_key', // Use your Razorpay Key ID
          amount: Math.round(total * 100),
          currency: 'INR',
          name: 'Sangameshwar Cafe',
          description: `Order for ${customerName}`,
          image: 'https://customer-assets.emergentagent.com/job_menu-hub-dine/artifacts/w81h57nj_image.png',
          handler: async (response) => {
            console.log('✅ Payment successful:', response);
            console.log('📝 Payment data keys:', Object.keys(response));
            
            try {
              // Verify payment on backend
              const verificationPayload = {
                razorpay_order_id: response.razorpay_order_id || null,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature || null
              };
              
              console.log('📤 Sending to verification endpoint:', verificationPayload);
              
              const verifyResponse = await axios.post(`${API}/verify-razorpay-payment`, verificationPayload);

              console.log('✅ Verification response:', verifyResponse.data);
              
              if (verifyResponse.data.success) {
                // Payment verified, now create the order with status 'preparing'
                const finalOrderData = {
                  ...orderData,
                  status: 'preparing', // Razorpay payments auto-confirm to preparing
                  payment_method: 'razorpay',
                  razorpay_payment_id: response.razorpay_payment_id
                };

                await axios.post(`${API}/admin/orders`, finalOrderData);
                console.log('✅ Order created with Razorpay payment');

                clearCart();
                setShowCheckout(false);
                setProcessingPayment(false);
                alert('✅ Payment successful! Your order is being prepared.');
                
                setTimeout(() => navigate('/'), 2000);
              } else {
                alert('Payment verification failed. Please try again.');
                setProcessingPayment(false);
              }
            } catch (error) {
              console.error('Error verifying payment:', error);
              console.error('Error response:', error.response?.data);
              alert('Error processing payment. Please contact support.');
              setProcessingPayment(false);
            }
          },
          prefill: {
            name: customerName,
            contact: '9000000000'
          },
          theme: {
            color: '#8B1538'
          }
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      };

      script.onerror = () => {
        alert('Failed to load payment gateway. Please try again.');
        setProcessingPayment(false);
      };

      document.body.appendChild(script);
    } catch (error) {
      console.error('Error initializing Razorpay:', error);
      alert('Error initializing payment. Please try again.');
      setProcessingPayment(false);
    }
  };

  if (cart.length === 0 && !showCheckout) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col" data-testid="empty-cart">
        <header className="bg-white border-b border-stone-200 px-4 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/')} className="text-stone-600" data-testid="back-button">
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-xl font-bold" style={{ fontFamily: 'Outfit, sans-serif' }}>Your Cart</h1>
          </div>
        </header>
        
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-stone-800 mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>Your cart is empty</h2>
          <p className="text-stone-500 mb-6" style={{ fontFamily: 'Manrope, sans-serif' }}>Add some delicious items to get started!</p>
          <button
            onClick={() => navigate('/menu')}
            className="bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 px-6 rounded-xl transition-all active:scale-95"
            data-testid="browse-menu-button"
          >
            Browse Menu
          </button>
        </div>
      </div>
    );
  }

  if (showCheckout) {
    return (
      <div className="min-h-screen bg-stone-50" data-testid="checkout-form">
        <header className="bg-white border-b border-stone-200 px-4 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setShowCheckout(false)} className="text-stone-600">
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-xl font-bold" style={{ fontFamily: 'Outfit, sans-serif' }}>Checkout</h1>
          </div>
        </header>

        <div className="p-4 max-w-md mx-auto">
          <div className="bg-white rounded-xl p-6 shadow-sm mb-4">
            <h3 className="font-bold text-lg mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>Order Details</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2">Table Number *</label>
                <input
                  type="text"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  placeholder="Enter table number"
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
                  data-testid="table-number-input"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2">Name *</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
                  data-testid="customer-name-input"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm mb-4">
            <h3 className="font-bold text-lg mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-stone-600">Subtotal ({getTotalItems()} items)</span>
                <span className="font-semibold">₹{subtotal}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount ({couponCode})</span>
                  <span className="font-semibold">-₹{couponDiscount}</span>
                </div>
              )}
              <div className="border-t border-stone-200 pt-2 mt-2 flex justify-between text-lg">
                <span className="font-bold">Total</span>
                <span className="font-black text-rose-600">₹{total}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {!razorpayEnabled && (
              <button
                onClick={submitOrder}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95"
                data-testid="submit-order-button"
              >
                <MessageCircle size={20} />
                Place Order via WhatsApp
              </button>
            )}

            {razorpayEnabled && (
              <button
                onClick={handleRazorpayPayment}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                disabled={processingPayment}
              >
                {processingPayment ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <CreditCard size={20} />
                    Pay Now with Razorpay
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Razorpay Payment Modal - REMOVED, using button handler instead */}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 pb-32" data-testid="cart-page">
      <header className="bg-white border-b border-stone-200 px-4 py-4 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-stone-600" data-testid="back-button">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold" style={{ fontFamily: 'Outfit, sans-serif' }}>Your Cart ({getTotalItems()} items)</h1>
        </div>
      </header>

      <div className="p-4 max-w-2xl mx-auto">
        {/* Cart Items */}
        <div className="bg-white rounded-xl shadow-sm mb-4" data-testid="cart-items">
          {cart.map((item, index) => (
            <div
              key={item.id}
              className={`flex gap-4 p-4 ${index !== cart.length - 1 ? 'border-b border-stone-100' : ''}`}
              data-testid={`cart-item-${item.id}`}
            >
              <div className="w-20 h-20 rounded-lg overflow-hidden bg-stone-100 flex-shrink-0">
                {item.image_url ? (
                  <img src={normalizeImageUrl(item.image_url)} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-stone-200"></div>
                )}
              </div>
              
              <div className="flex-1">
                <h3 className="font-semibold text-base text-stone-800 mb-1">{item.name}</h3>
                <p className="text-sm text-stone-500 mb-2">₹{item.price} each</p>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-stone-100 rounded-lg px-2 py-1">
                    <button onClick={() => removeFromCart(item.id)} className="text-rose-600" data-testid={`cart-decrease-${item.id}`}>
                      <Minus size={16} />
                    </button>
                    <span className="font-bold text-stone-800 min-w-[20px] text-center" data-testid={`cart-quantity-${item.id}`}>{item.quantity}</span>
                    <button onClick={() => addToCart(item)} className="text-rose-600" data-testid={`cart-increase-${item.id}`}>
                      <Plus size={16} />
                    </button>
                  </div>
                  <span className="font-bold text-stone-800">₹{item.price * item.quantity}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Table Number and Name */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4" data-testid="customer-details-section">
          <h3 className="font-bold text-base mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>Order Details</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-2">Table Number *</label>
              <input
                type="text"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                placeholder="Enter table number"
                className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                data-testid="table-number-input"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-2">Name *</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                data-testid="customer-name-input"
              />
            </div>
          </div>
        </div>

        {/* Coupon */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4" data-testid="coupon-section">
          <h3 className="font-bold text-base mb-3 flex items-center gap-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
            <Tag size={18} className="text-purple-600" />
            Apply Coupon
          </h3>
          
          {!couponApplied ? (
            <>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Enter coupon code"
                  className="flex-1 px-4 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  data-testid="coupon-input"
                />
                <button
                  onClick={applyCoupon}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-6 py-2 rounded-lg transition-all active:scale-95"
                  data-testid="apply-coupon-button"
                >
                  Apply
                </button>
              </div>
              {couponError && (
                <p className="text-sm text-red-600" data-testid="coupon-error">{couponError}</p>
              )}
              <div className="mt-3 text-xs text-stone-500 space-y-1">
                <p>• FIRST50 - 10% off on orders above ₹200</p>
                <p>• SAVE100 - ₹100 off on orders above ₹500</p>
                <p>• COMBO20 - 20% off on combo meals above ₹300</p>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
              <div>
                <p className="font-bold text-green-700">{couponCode} Applied!</p>
                <p className="text-sm text-green-600">You saved ₹{couponDiscount}</p>
              </div>
              <button onClick={removeCoupon} className="text-red-600">
                <Trash2 size={18} />
              </button>
            </div>
          )}
        </div>

        {/* Bill Details */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4" data-testid="bill-details">
          <h3 className="font-bold text-base mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>Bill Details</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-stone-600">Item Total</span>
              <span className="font-semibold">₹{subtotal}</span>
            </div>
            {couponDiscount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Coupon Discount</span>
                <span className="font-semibold">-₹{couponDiscount}</span>
              </div>
            )}
            <div className="border-t border-stone-200 pt-2 mt-2 flex justify-between text-lg">
              <span className="font-bold">To Pay</span>
              <span className="font-black text-rose-600" data-testid="total-amount">₹{total}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Checkout Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 p-4 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]" data-testid="bottom-checkout-bar">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs text-stone-500">Total Amount</p>
              <p className="text-xl font-black text-rose-600">₹{total}</p>
            </div>
            <button
              onClick={handleCheckout}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-xl transition-all active:scale-95 flex items-center gap-2"
              data-testid="proceed-checkout-button"
            >
              Proceed to Checkout
              <ChevronDown className="rotate-[-90deg]" size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
