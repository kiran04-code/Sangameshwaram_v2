import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Home, Package, Plus, Minus, X, UtensilsCrossed, Zap } from 'lucide-react';
import { useCart } from '../context/CartContext';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

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

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart, cart } = useCart();
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedItems, setSelectedItems] = useState({});
  const [quickAddItems, setQuickAddItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load Quick Add items from backend
  useEffect(() => {
    const loadQuickAddItems = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:8000/api/admin/quick-add-items');
        console.log('📱 [QUICK ADD] Loaded from backend:', response.data);
        
        // Map backend items to format needed for display
        const formattedItems = response.data.map(item => ({
          id: item._id || item.id,
          _id: item._id || item.id,
          name: item.name,
          description: item.description || '',
          price: item.price,
          image_url: item.image_url,
          category: item.category,
          is_veg: item.is_veg,
        }));
        
        setQuickAddItems(formattedItems);
      } catch (error) {
        console.error('❌ [QUICK ADD] Failed to load items:', error);
        // Fallback to empty array if load fails
        setQuickAddItems([]);
      } finally {
        setLoading(false);
      }
    };

    loadQuickAddItems();
  }, []);

  const visiblePages = ['/menu', '/orders', '/cart', '/home'];
  if (!visiblePages.includes(location.pathname) && location.pathname !== '/') {
    return null;
  }

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleAddToCart = () => {
    Object.entries(selectedItems).forEach(([itemId, qty]) => {
      if (qty > 0) {
        const item = quickAddItems.find(i => i.id === itemId);
        if (item) {
          const cartItem = {
            ...item,
            id: `${item.id}-quick`,
          };
          for (let i = 0; i < qty; i++) {
            addToCart(cartItem);
          }
        }
      }
    });
    
    setShowQuickAdd(false);
    setSelectedItems({});
  };

  const updateItemQuantity = (itemId, qty) => {
    setSelectedItems(prev => ({
      ...prev,
      [itemId]: Math.max(0, qty)
    }));
  };

  const getTotalPrice = () => {
    return Object.entries(selectedItems).reduce((total, [itemId, qty]) => {
      const item = quickAddItems.find(i => i.id === itemId);
      return total + (item ? item.price * qty : 0);
    }, 0);
  };

  const getTotalItems = () => {
    return Object.values(selectedItems).reduce((sum, qty) => sum + qty, 0);
  };

  const isActive = (path) => location.pathname === path;

  const NavButton = ({ onClick, icon: Icon, label, active, badge }) => (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-1 flex-1 py-2 transition-all duration-300 relative active:scale-90 ${
        active ? 'text-[#FFD700]' : 'text-white/70 hover:text-white'
      }`}
    >
      <div className={`p-1.5 rounded-xl transition-all duration-300 ${active ? 'bg-white/10 shadow-inner' : ''}`}>
        <Icon size={22} strokeWidth={active ? 2.5 : 1.5} />
      </div>
      {badge > 0 && (
        <span className="absolute top-2 right-4 bg-[#FFD700] text-[#8B1538] text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-sm border border-[#8B1538]">
          {badge}
        </span>
      )}
      <span className={`text-[10px] font-bold uppercase tracking-wider ${active ? 'opacity-100' : 'opacity-80'}`}>
        {label}
      </span>
    </button>
  );

  return (
    <>
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-white/20">
        <div className="bg-gradient-to-b from-[#8B1538] to-[#6B0E2D] backdrop-blur-lg shadow-2xl px-2 py-3 flex items-center justify-between rounded-t-3xl">
          
          <NavButton 
            icon={Home} 
            label="Home" 
            onClick={() => navigate('/')} 
            active={isActive('/')} 
          />

          <NavButton 
            icon={UtensilsCrossed} 
            label="Menu" 
            onClick={() => navigate('/menu')} 
            active={isActive('/menu')} 
          />

          <NavButton 
            icon={Package} 
            label="Orders" 
            onClick={() => navigate('/orders')} 
            active={isActive('/orders')} 
          />

          <NavButton 
            icon={ShoppingCart} 
            label="Cart" 
            onClick={() => navigate('/cart')} 
            active={isActive('/cart')}
            badge={cartCount}
          />

          {/* Quick Add - Right Corner Action Button */}
          <button
            onClick={() => setShowQuickAdd(true)}
            className="flex flex-col items-center justify-center gap-1 flex-1 group active:scale-95 transition-transform"
          >
            <div className="w-11 h-11 bg-[#FFD700] rounded-xl flex items-center justify-center text-[#8B1538] shadow-[0_0_15px_rgba(255,215,0,0.3)] group-hover:shadow-[0_0_20px_rgba(255,215,0,0.5)] transition-all">
              <Zap size={22} fill="currentColor" strokeWidth={2} />
            </div>
            <span className="text-[10px] font-black text-[#FFD700] uppercase tracking-tighter">Quick Add</span>
          </button>
        </div>
      </div>

      {/* Modal - Modern Slide Up */}
      {showQuickAdd && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden flex items-end animate-in fade-in duration-300">
          <div className="w-full bg-white rounded-t-[2.5rem] p-6 shadow-2xl animate-in slide-in-from-bottom-full duration-500 max-h-[90vh] overflow-y-auto">
            <div className="w-12 h-1.5 bg-stone-200 rounded-full mx-auto mb-6" />
            
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-black text-stone-900 tracking-tight">Quick Add</h3>
                <p className="text-stone-500 text-sm">Select items & quantities</p>
              </div>
              <button
                onClick={() => { setShowQuickAdd(false); setSelectedItems({}); }}
                className="bg-stone-100 p-2 rounded-full text-stone-400 hover:text-stone-900 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Items List */}
            <div className="space-y-3 mb-6">
              {loading ? (
                <div className="text-center py-8 text-stone-400">
                  <p>Loading quick add items...</p>
                </div>
              ) : quickAddItems.length === 0 ? (
                <div className="text-center py-8 text-stone-400">
                  <p>No quick add items available</p>
                </div>
              ) : (
                quickAddItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 items-center bg-stone-50 p-4 rounded-2xl border-2 border-stone-200 hover:border-[#8B1538] transition-all"
                  >
                    {/* Item Image */}
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-stone-100 flex-shrink-0">
                      <img
                        src={normalizeImageUrl(item.image_url) || 'https://images.unsplash.com/photo-1555939594-58d7cb561e1f?w=200&h=200&fit=crop'}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-stone-900 text-sm">{item.name}</h4>
                      <p className="text-[10px] text-stone-500 mb-1">{item.description}</p>
                      <p className="text-[#8B1538] font-black text-sm">₹{item.price}</p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 bg-stone-100 rounded-lg p-1 flex-shrink-0">
                      <button
                        onClick={() => updateItemQuantity(item.id, (selectedItems[item.id] || 0) - 1)}
                        className="w-6 h-6 flex items-center justify-center bg-white rounded text-[#8B1538] hover:bg-red-50 transition-all"
                      >
                        <Minus size={14} strokeWidth={3} />
                      </button>
                      <span className="w-6 text-center font-black text-sm text-stone-900">
                        {selectedItems[item.id] || 0}
                      </span>
                      <button
                        onClick={() => updateItemQuantity(item.id, (selectedItems[item.id] || 0) + 1)}
                        className="w-6 h-6 flex items-center justify-center bg-white rounded text-[#8B1538] hover:bg-green-50 transition-all"
                      >
                        <Plus size={14} strokeWidth={3} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Summary Section */}
            {getTotalItems() > 0 && (
              <div className="space-y-4">
                <div className="h-px bg-stone-100 w-full" />
                
                <div className="flex items-center justify-between px-2 py-3 bg-stone-50 rounded-2xl">
                  <div>
                    <p className="text-xs text-stone-500">Total Items</p>
                    <p className="text-2xl font-black text-stone-900">{getTotalItems()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-stone-500">Total Price</p>
                    <p className="text-2xl font-black text-[#8B1538]">₹{getTotalPrice()}</p>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="w-full bg-[#8B1538] hover:bg-[#6B0E2D] text-white font-bold py-4 rounded-2xl shadow-xl shadow-[#8B1538]/20 flex items-center justify-center gap-3 transition-all active:scale-95"
                >
                  <Plus size={20} />
                  <span>Add All to Cart</span>
                </button>
              </div>
            )}

            {getTotalItems() === 0 && (
              <div className="text-center py-8">
                <p className="text-stone-400 text-sm">Select items above to add to cart</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Spacing for content */}
      <div className="lg:hidden h-28"></div>
    </>
  );
};

export default BottomNavigation;