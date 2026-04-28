import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import { Plus, Minus, ChevronRight, Star, Trash2, ShoppingBag, Info, Percent, MapPin, Clock } from 'lucide-react';
import { useCart } from '../context/CartContext';
import BestSellerAndPromo from '../components/BestSellerAndPromo';

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

const MenuPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoriesMap, setCategoriesMap] = useState({}); // Map category_id to category name
  const [categoryDetails, setCategoryDetails] = useState({});
  const [activeCategory, setActiveCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [vegFilter, setVegFilter] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [frequentItems, setFrequentItems] = useState([]);
  const categoryRefs = useRef({});
  const observerRef = useRef(null);
  const { addToCart, removeFromCart, getItemQuantity } = useCart();

  const fetchMenu = useCallback(async () => {
    try {
      // Fetch categories from the new API endpoint
      const categoriesResponse = await axios.get(`${API}/admin/categories`);
      const categoriesData = Array.isArray(categoriesResponse.data) ? categoriesResponse.data : [];
      
      // Create a map of category_id to category name and build sorted list
      const catMap = {};
      const catDetailsMap = {};
      const sortedCategories = categoriesData
        .filter(cat => cat.active !== false)
        .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
        .map(cat => {
          catMap[cat._id] = cat.name;
          catDetailsMap[cat.name] = cat;
          return cat.name;
        });
      
      setCategoriesMap(catMap);
      setCategoryDetails(catDetailsMap);
      
      // Fetch menu items from the new API endpoint (request up to 500 items to get all)
      const itemsResponse = await axios.get(`${API}/admin/menu-items?limit=500`);
      const itemsData = Array.isArray(itemsResponse.data) ? itemsResponse.data : [];
      
      // Filter only active items and ensure each has an 'id' field for cart operations
      const activeItems = itemsData.filter(item => item.active !== false).map(item => ({
        ...item,
        id: item._id || item.id  // Ensure 'id' exists for cart compatibility
      }));
      setMenuItems(activeItems);
      
      setCategories(sortedCategories);
      if (sortedCategories.length > 0) setActiveCategory(sortedCategories[0]);
      
      console.log('✅ Fetched categories:', sortedCategories);
      console.log('✅ Categories map:', catMap);
      console.log('✅ Fetched menu items count:', activeItems.length);
    } catch (err) { 
      console.error('❌ Error fetching menu:', err);
      setCategories([]);
      setMenuItems([]);
    }
  }, []);

  const fetchFrequentItems = useCallback(async () => {
    try {
      const response = await axios.get(`${API}/admin/frequent-items`);
      const items = response.data || [];
      // Ensure each item has an 'id' field for cart compatibility
      const itemsWithId = items.map(item => ({
        ...item,
        id: item._id || item.id
      }));
      setFrequentItems(itemsWithId);
      console.log('Loaded frequent items from backend:', itemsWithId);
    } catch (err) {
      console.error('Error fetching frequent items from backend:', err);
      try {
        const response = await axios.get(`${API}/menu`);
        const topItems = response.data.slice(0, 4).map(item => ({
          ...item,
          id: item._id || item.id
        }));
        setFrequentItems(topItems);
        console.log('Using top menu items as frequent:', topItems);
      } catch (fallbackErr) {
        console.error('Fallback error:', fallbackErr);
        setFrequentItems([]);
      }
    }
  }, []);

  const applyFilters = useCallback(async () => {
    if (isSearching) return;
    try {
      let url = `${API}/admin/menu-items${vegFilter !== 'all' ? `?is_veg=${vegFilter === 'veg'}` : ''}`;
      const res = await axios.get(url);
      let items = Array.isArray(res.data) ? res.data : [];
      if (sortBy === 'price-low') items.sort((a, b) => a.price - b.price);
      else if (sortBy === 'price-high') items.sort((a, b) => b.price - a.price);
      setMenuItems(items);
      console.log('Filtered items:', items.length);
    } catch (err) { 
      console.error('Error applying filters:', err); 
    }
  }, [isSearching, vegFilter, sortBy]);

  const locationCategory = location.state?.category;

  useEffect(() => {
    fetchMenu();
    fetchFrequentItems();
    if (locationCategory) {
      setActiveCategory(locationCategory);
      setTimeout(() => scrollToCategory(locationCategory), 500);
    }
  }, [fetchMenu, fetchFrequentItems, locationCategory]);

  const setupScrollSpy = useCallback(() => {
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) setActiveCategory(entry.target.dataset.category);
      });
    }, { rootMargin: '-20% 0px -70% 0px' });
    Object.values(categoryRefs.current).forEach(ref => ref && observerRef.current.observe(ref));
  }, []);

  useEffect(() => {
    if (menuItems.length > 0 && !isSearching) setupScrollSpy();
    return () => observerRef.current?.disconnect();
  }, [menuItems, isSearching, setupScrollSpy]);

  useEffect(() => { applyFilters(); }, [applyFilters]);

  const scrollToCategory = (cat) => {
    const el = categoryRefs.current[cat];
    if (el) {
      const offset = window.innerWidth >= 1024 ? 100 : 220;
      window.scrollTo({ top: el.offsetTop - offset, behavior: 'smooth' });
    }
  };

  const groupedItems = categories.reduce((acc, cat) => {
    // Filter items by category name (products have 'category' field as string)
    acc[cat] = menuItems.filter(i => i.category === cat);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-[#FCFCFC]">
      <Header showSearch={true} onSearchChange={(q) => {setSearchQuery(q); setIsSearching(!!q)}} onAddToCart={(item) => addToCart(item)} />

      <div className="mx-auto lg:px-8 lg:py-8">
        
        {/* PROMO SECTION */}
        <div className="mb-10 px-4 lg:px-0">
          <div className="flex overflow-x-auto gap-4 hide-scrollbar pb-2">
            {[
              { label: 'FLAT ₹125 OFF', sub: 'On orders above ₹499', icon: <Percent size={18}/> },
              { label: 'FREE DELIVERY', sub: 'On your first 3 orders', icon: <ShoppingBag size={18}/> },
              { label: 'COMBO SAVER', sub: 'Save up to 15% on combos', icon: <Star size={18}/> },
            ].map((offer, idx) => (
              <div key={idx} className="min-w-[280px] border border-stone-200 rounded-2xl p-4 flex items-center gap-4 bg-white shadow-sm">
                <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center flex-shrink-0">
                  {offer.icon}
                </div>
                <div>
                  <p className="font-bold text-stone-800 leading-none">{offer.label}</p>
                  <p className="text-xs text-stone-500 mt-1">{offer.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CATEGORIES & CAFES SECTION */}
        <div className="mb-12">
          {/* Categories Section */}
          <section className="px-4 lg:px-0 mb-10">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-bold text-stone-900">Categories</h2>
              <button className="text-rose-600 bg-rose-50 px-3 py-1 rounded-full text-xs font-bold hover:bg-rose-100 transition-all">
                See all
              </button>
            </div>
            
            <div className="flex gap-6 overflow-x-auto hide-scrollbar pb-2">
              {categories.map((catName) => {
                const catDetails = categoryDetails[catName];
                const defaultImages = {
                  'Beverages': 'https://images.unsplash.com/photo-1572490122747-3968b75cc3f0?w=200&h=200&fit=crop',
                  'Milkshake': 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=200&h=200&fit=crop',
                  'Coolers and Freshners': 'https://images.unsplash.com/photo-1589985643226-d266b77217f1?w=200&h=200&fit=crop',
                  'Indian Chinese': 'https://images.unsplash.com/photo-1585238341710-4edd9b6eaf97?w=200&h=200&fit=crop',
                  'Maggi': 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=200&h=200&fit=crop',
                  'Pav Bhaji & Pulav': 'https://images.unsplash.com/photo-1589301760014-eed562aeb93f?w=200&h=200&fit=crop',
                  'Pasta': 'https://images.unsplash.com/photo-1612874742237-6526221fcf2f?w=200&h=200&fit=crop',
                  'Indian Breakfast': 'https://images.unsplash.com/photo-1606787620517-c448c0b13699?w=200&h=200&fit=crop',
                  'Sandwiches': 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=200&h=200&fit=crop',
                  'Pizza': 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=200&h=200&fit=crop',
                  'Momos': 'https://images.unsplash.com/photo-1525521250212-55e377319766?w=200&h=200&fit=crop',
                  'Burgers': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop',
                };
                
                const imageUrl = catDetails?.image_url || defaultImages[catName] || 'https://via.placeholder.com/200';
                
                return (
                  <div key={catName} className="flex flex-col items-center gap-2 flex-shrink-0 cursor-pointer group" onClick={() => scrollToCategory(catName)}>
                    <div className="w-16 h-16 lg:w-24 lg:h-24 bg-stone-50 rounded-full overflow-hidden shadow-sm border border-stone-100 transform active:scale-90 transition-transform group-hover:scale-105">
                      <img 
                        src={normalizeImageUrl(imageUrl)} 
                        alt={catName}
                        className="w-full h-full object-cover"
                        onError={(e) => { 
                          console.error('Category image load error:', e.target.src);
                          e.target.src = defaultImages[catName] || 'https://via.placeholder.com/200';
                        }}
                        onLoad={() => console.log('Category image loaded:', normalizeImageUrl(imageUrl))}
                      />
                    </div>
                    <span className="text-xs font-bold text-stone-600 tracking-tight whitespace-nowrap lg:text-sm">{catName}</span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Top Cafes Section */}
          <section className="px-4 lg:px-0">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-stone-900 tracking-tight">Best Sellers</h2>
              <button className="text-rose-600 bg-rose-50 px-4 py-2 rounded-full text-xs font-bold hover:bg-rose-100 transition-all shadow-sm">
                View all
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pb-6">
              {frequentItems && frequentItems.length > 0 ? (
                frequentItems.slice(0, 5).map((item) => (
                  <div key={item._id} className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-stone-100/50">
                    
                    {/* Image Container */}
                    <div className="relative h-40 sm:h-44 md:h-48 lg:h-52 overflow-hidden bg-stone-100">
                      <img 
                        src={normalizeImageUrl(item.image_url) || 'https://via.placeholder.com/400x600'} 
                        alt={item.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        onError={(e) => { 
                          console.error('Frequently accessed image load error:', e.target.src);
                          e.target.src = 'https://via.placeholder.com/400x600';
                        }}
                        onLoad={() => console.log('Frequently accessed image loaded:', normalizeImageUrl(item.image_url))}
                      />
                      
                      {/* Overlay on Hover */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
                      
                      {/* Discount Badge - Top Right */}
                      {item.discount && item.discount > 0 && (
                        <div className="absolute top-2 right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-2.5 py-1 rounded-lg text-xs font-black shadow-md">
                          {Math.round(item.discount)}% OFF
                        </div>
                      )}
                      
                      {/* Time Badge - Bottom Right */}
                      {item.delivery_time && (
                        <div className="absolute bottom-2 right-2 bg-black/75 backdrop-blur-sm text-white px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                          <Clock size={11} className="flex-shrink-0" />
                          <span className="hidden sm:inline">{item.delivery_time}</span>
                        </div>
                      )}
                    </div>

                    {/* Content Section */}
                    <div className="p-3 md:p-4 flex flex-col">
                      {/* Title */}
                      <h3 className="font-bold text-stone-800 text-sm md:text-base leading-tight mb-1 line-clamp-2 group-hover:text-rose-600 transition-colors">
                        {item.name}
                      </h3>
                      
                      {/* Description */}
                      <p className="text-stone-400 text-xs md:text-xs font-medium mb-2.5 line-clamp-1">
                        {item.description || 'Delicious food item'}
                      </p>

                      {/* Rating & Price Row */}
                      <div className="flex items-center justify-between mb-3">
                        {/* Rating */}
                        {item.rating && (
                          <div className="flex items-center gap-1 bg-stone-50 px-2 py-1 rounded-md">
                            <Star size={12} className="text-orange-400" fill="currentColor" />
                            <span className="text-xs font-bold text-stone-700">{item.rating}</span>
                          </div>
                        )}
                        {!item.rating && <div />}
                        
                        {/* Price */}
                        <div className="text-sm md:text-base font-black text-stone-900">
                          ₹{Math.round(item.price)}
                        </div>
                      </div>

                      {/* Add to Cart Button */}
                      <button 
                        onClick={() => addToCart({ 
                          id: item._id || item.id,
                          _id: item._id,
                          name: item.name, 
                          price: item.price,
                          image_url: item.image_url
                        })}
                        className="w-full bg-gradient-to-r from-rose-600 to-red-600 text-white py-2.5 md:py-3 rounded-xl font-bold text-xs md:text-sm hover:shadow-lg hover:from-rose-700 hover:to-red-700 transition-all active:scale-95 duration-200"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-16 text-stone-400">
                  <ShoppingBag size={56} className="mx-auto mb-4 opacity-20" />
                  <p className="text-sm font-semibold">No best sellers available</p>
                  <p className="text-xs mt-1">Check back soon for popular items!</p>
                </div>
              )}
            </div>
          </section>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* NAVIGATION SIDEBAR */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 pt-4">
              <nav className="space-y-1 border-r border-stone-100">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => scrollToCategory(cat)}
                    className={`w-full text-left px-4 py-3 text-sm font-medium transition-all relative ${
                      activeCategory === cat 
                        ? 'text-rose-600 font-bold' 
                        : 'text-stone-500 hover:text-stone-800'
                    }`}
                  >
                    {activeCategory === cat && (
                      <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-rose-600 rounded-l-full" />
                    )}
                    {cat}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* MENU FEED */}
          <main className="flex-1">
            
            {/* MOBILE CATEGORY CHIPS */}
            <div className="lg:hidden sticky top-[110px] z-30 bg-white/80 backdrop-blur-md border-b border-stone-100 overflow-x-auto hide-scrollbar" style={{ top: '130px' }}>
              <div className="flex flex-col gap-2 px-4 py-4 w-max">
                <div className="flex gap-2">
                  {categories.slice(0, 4).map(cat => (
                    <button
                      key={cat}
                      onClick={() => scrollToCategory(cat)}
                      className={`whitespace-nowrap px-3 py-2 rounded-full text-xs font-bold transition-all shadow-sm border ${
                        activeCategory === cat ? 'bg-stone-900 text-white border-stone-900' : 'bg-white text-stone-600 border-stone-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  {categories.slice(4, 8).map(cat => (
                    <button
                      key={cat}
                      onClick={() => scrollToCategory(cat)}
                      className={`whitespace-nowrap px-3 py-2 rounded-full text-xs font-bold transition-all shadow-sm border ${
                        activeCategory === cat ? 'bg-stone-900 text-white border-stone-900' : 'bg-white text-stone-600 border-stone-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  {categories.slice(8).map(cat => (
                    <button
                      key={cat}
                      onClick={() => scrollToCategory(cat)}
                      className={`whitespace-nowrap px-3 py-2 rounded-full text-xs font-bold transition-all shadow-sm border ${
                        activeCategory === cat ? 'bg-stone-900 text-white border-stone-900' : 'bg-white text-stone-600 border-stone-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* FILTER BAR */}
            <div className="px-4 lg:px-0 mb-8 flex items-center justify-between">
              <div className="flex gap-3">
                <button 
                  onClick={() => setVegFilter(vegFilter === 'veg' ? 'all' : 'veg')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                    vegFilter === 'veg' ? 'border-green-600 text-green-700 bg-green-50' : 'border-stone-200 text-stone-600'
                  }`}
                >
                  <div className={`w-3 h-3 border ${vegFilter === 'veg' ? 'border-green-600' : 'border-stone-400'} flex items-center justify-center`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${vegFilter === 'veg' ? 'bg-green-600' : 'bg-stone-300'}`} />
                  </div>
                  Pure Veg
                </button>
              </div>
              <div className="flex items-center gap-2 text-stone-400">
                <span className="text-[10px] font-bold uppercase tracking-wider">Sort by</span>
                <select 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-xs font-bold text-stone-800 bg-transparent border-none focus:ring-0 cursor-pointer"
                >
                  <option value="popular">Relevance</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* MENU SECTIONS */}
            <div className="space-y-16 pb-20">
              {categories.map((cat, idx) => (
                <React.Fragment key={cat}>
                  <section ref={el => categoryRefs.current[cat] = el} data-category={cat} className="px-4 lg:px-0">
                    <h2 className="text-xl font-extrabold text-stone-900 mb-6 tracking-tight">{cat}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                      {groupedItems[cat]?.map(item => (
                        <MenuItem 
                          key={item.id} 
                          item={item} 
                          qty={getItemQuantity(item.id)} 
                          onAdd={() => addToCart(item)} 
                          onRemove={() => removeFromCart(item.id)} 
                        />
                      ))}
                    </div>
                  </section>
                  {/* BEST SELLER & PROMO SECTION - After Beverages */}
                  {cat === 'BEVERAGES' && (
                    <div className="px-4 lg:px-0 mb-8">
                      <BestSellerAndPromo />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </main>

          {/* DESKTOP CART SIDEBAR */}
          <CartSidebar 
            items={menuItems}
            getItemQuantity={getItemQuantity}
            addToCart={addToCart}
            removeFromCart={removeFromCart}
            navigate={navigate}
          />
        </div>
      </div>
    </div>
  );
};

const MenuItem = ({ item, qty, onAdd, onRemove }) => (
  <div className="flex flex-col md:flex-col gap-4 md:gap-0 pb-6 md:pb-0 border-b md:border-b-0 border-stone-100 last:border-0 group">
    {/* Mobile/Tablet: Horizontal Layout (Text Left, Image Right) */}
    <div className="flex gap-4 md:hidden">
      {/* Left Text Content */}
      <div className="flex-1 min-w-0">
        <div className={`w-4 h-4 border-2 ${item.is_veg ? 'border-green-600' : 'border-red-600'} flex items-center justify-center rounded-sm mb-2`}>
          <div className={`w-1.5 h-1.5 rounded-full ${item.is_veg ? 'bg-green-600' : 'bg-red-600'}`}></div>
        </div>
        <h3 className="text-base font-bold text-stone-800 group-hover:text-rose-600 transition-colors leading-tight line-clamp-2">{item.name}</h3>
        <p className="text-sm font-semibold text-stone-700 mt-1">₹{item.price}</p>
        {item.rating && (
          <div className="flex items-center gap-1 mt-2 text-orange-500">
            <Star size={12} fill="currentColor" />
            <span className="text-xs font-bold text-stone-600">{item.rating}</span>
          </div>
        )}
        <p className="text-xs text-stone-400 mt-2 leading-relaxed line-clamp-2">{item.description}</p>
      </div>

      {/* Right Image */}
      <div className="relative flex-shrink-0">
        <div className="w-24 h-24 rounded-xl overflow-hidden bg-stone-50 border border-stone-100">
          <img 
            src={normalizeImageUrl(item.image_url) || 'https://via.placeholder.com/200'} 
            alt={item.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            onError={(e) => { 
              console.error('Product image load error:', e.target.src);
              e.target.src = 'https://via.placeholder.com/200';
            }}
            onLoad={() => console.log('Product image loaded:', normalizeImageUrl(item.image_url))}
          />
        </div>
        {/* Button for Mobile */}
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-20">
          {qty === 0 ? (
            <button 
              onClick={onAdd}
              className="w-full bg-white text-green-600 border border-stone-200 py-1.5 rounded-lg font-bold text-xs uppercase hover:bg-stone-50 transition-all"
            >
              Add
            </button>
          ) : (
            <div className="w-full flex items-center justify-between bg-white text-green-600 border border-green-100 py-1.5 px-2 rounded-lg font-bold">
              <button onClick={onRemove} className="hover:text-red-500 transition-colors"><Minus size={14} strokeWidth={3}/></button>
              <span className="text-xs">{qty}</span>
              <button onClick={onAdd} className="hover:text-green-500 transition-colors"><Plus size={14} strokeWidth={3}/></button>
            </div>
          )}
        </div>
      </div>
    </div>

    {/* Desktop: Vertical Layout (Image Top, Text Below) */}
    <div className="hidden md:flex md:flex-col md:items-center">
      {/* Image */}
      <div className="w-full rounded-2xl overflow-hidden bg-stone-50 border border-stone-100 aspect-square">
        <img 
          src={normalizeImageUrl(item.image_url) || 'https://via.placeholder.com/200'} 
          alt={item.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          onError={(e) => { 
            console.error('Desktop product image load error:', e.target.src);
            e.target.src = 'https://via.placeholder.com/200';
          }}
          onLoad={() => console.log('Desktop product image loaded:', normalizeImageUrl(item.image_url))}
        />
      </div>
      
      {/* Text Content Below Image */}
      <div className="w-full mt-4 text-center">
        <div className={`w-4 h-4 border-2 ${item.is_veg ? 'border-green-600' : 'border-red-600'} flex items-center justify-center rounded-sm mb-3 mx-auto`}>
          <div className={`w-1.5 h-1.5 rounded-full ${item.is_veg ? 'bg-green-600' : 'bg-red-600'}`}></div>
        </div>
        <h3 className="text-sm font-bold text-stone-800 group-hover:text-rose-600 transition-colors leading-tight line-clamp-2">{item.name}</h3>
        <p className="text-sm font-semibold text-stone-700 mt-2">₹{item.price}</p>
        {item.rating && (
          <div className="flex items-center justify-center gap-1 mt-2 text-orange-500">
            <Star size={12} fill="currentColor" />
            <span className="text-xs font-bold text-stone-600">{item.rating}</span>
          </div>
        )}
        <p className="text-xs text-stone-400 mt-2 leading-relaxed line-clamp-1">{item.description}</p>
      </div>
      
      {/* Button for Desktop */}
      <div className="w-full mt-4">
        {qty === 0 ? (
          <button 
            onClick={onAdd}
            className="w-full bg-white text-green-600 border border-stone-200 py-2 rounded-lg font-bold text-xs uppercase hover:bg-stone-50 transition-all"
          >
            Add
          </button>
        ) : (
          <div className="w-full flex items-center justify-between bg-white text-green-600 border border-green-100 py-2 px-2 rounded-lg font-bold">
            <button onClick={onRemove} className="hover:text-red-500 transition-colors"><Minus size={14} strokeWidth={3}/></button>
            <span className="text-xs">{qty}</span>
            <button onClick={onAdd} className="hover:text-green-500 transition-colors"><Plus size={14} strokeWidth={3}/></button>
          </div>
        )}
      </div>
    </div>
  </div>
);

const CartSidebar = ({ items, getItemQuantity, addToCart, removeFromCart, navigate }) => {
  const cartItems = items.filter(i => getItemQuantity(i.id) > 0).map(i => ({ ...i, qty: getItemQuantity(i.id) }));
  const subtotal = cartItems.reduce((acc, i) => acc + (i.price * i.qty), 0);
  const total = subtotal + Math.round(subtotal * 0.05);

  if (cartItems.length === 0) return (
    <aside className="hidden lg:block w-80 flex-shrink-0 sticky top-24 h-fit">
      <div className="p-8 text-center bg-white rounded-3xl border border-stone-100">
        <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-4 text-stone-300">
          <ShoppingBag size={32} />
        </div>
        <p className="font-bold text-stone-800">Cart is Empty</p>
        <p className="text-xs text-stone-400 mt-2">Add some delicious items from the menu to get started.</p>
      </div>
    </aside>
  );

  return (
    <aside className="hidden lg:block w-80 flex-shrink-0 sticky top-24 h-fit">
      <div className="bg-white rounded-3xl border border-stone-100 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-stone-50">
          <h3 className="text-lg font-black text-stone-800">Your Cart</h3>
          <p className="text-xs text-stone-400 mt-1 font-medium">{cartItems.length} items from academy</p>
        </div>

        <div className="max-h-[40vh] overflow-y-auto p-6 space-y-6">
          {cartItems.map(item => (
            <div key={item.id} className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <p className="text-sm font-bold text-stone-800">{item.name}</p>
                <p className="text-xs text-stone-500 mt-1">₹{item.price * item.qty}</p>
              </div>
              <div className="flex items-center gap-3 bg-stone-50 rounded-lg p-1 px-2">
                <button onClick={() => removeFromCart(item.id)} className="text-stone-400 hover:text-stone-800"><Minus size={12} /></button>
                <span className="text-xs font-bold text-stone-800">{item.qty}</span>
                <button onClick={() => addToCart(item)} className="text-stone-400 hover:text-stone-800"><Plus size={12} /></button>
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 bg-stone-50/50 space-y-3">
          <div className="flex justify-between text-xs font-medium text-stone-500">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>
          <div className="flex justify-between text-xs font-medium text-stone-500">
            <span>Taxes & Charges</span>
            <Info size={12} className="inline ml-1 opacity-50"/>
            <span className="ml-auto">₹{Math.round(subtotal * 0.05)}</span>
          </div>
          <div className="pt-3 border-t border-stone-200 flex justify-between items-center">
            <span className="text-sm font-black text-stone-800 uppercase tracking-tighter">To Pay</span>
            <span className="text-lg font-black text-stone-900">₹{total}</span>
          </div>
          <button 
            onClick={() => navigate('/cart')}
            className="w-full bg-stone-900 text-white font-bold py-4 rounded-2xl mt-4 hover:bg-stone-800 transition-all shadow-lg active:scale-[0.98]"
          >
            Checkout
          </button>
        </div>
      </div>
    </aside>
  );
};

export default MenuPage;