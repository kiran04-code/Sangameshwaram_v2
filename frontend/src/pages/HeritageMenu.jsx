import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Clean geometric icon for veg status
const VegIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="0.5" y="0.5" width="13" height="13" stroke="#166534" />
    <circle cx="7" cy="7" r="4" fill="#166534" />
  </svg>
);

// Formatter to remove underscores and capitalize names neatly
const formatName = (name) => {
  if (!name) return "";
  return name
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
    .replace(/_/g, ' ');
};

const MENU_DATA = [
  { name: 'BEVERAGES', imageUrl: '/home_html/images/categories/BEVERAGES.jpg', items: [{ name: 'Cold Coffee', price: 60 }, { name: 'Cold Chocolate', price: 60 }, { name: 'Cold Milk', price: 50 }, { name: 'Thick Cream Coffee', price: 70 }, { name: 'Hot Coffee', price: 40 }, { name: 'Hot Chocolate', price: 40 }] },
  { name: 'MILKSHAKE', imageUrl: '/home_html/images/categories/MILKSHAKE.jpg', items: [{ name: 'Oreo', price: 99 }, { name: 'Brownie', price: 99 }, { name: 'KitKat', price: 99 }, { name: 'Strawberry', price: 99 }, { name: 'Mango', price: 99 }, { name: 'Chocolate', price: 99 }] },
  { name: 'COOLERS AND FRESHNERS', imageUrl: '/home_html/images/categories/COOLERS_FRESHNERS.jpg', items: [{ name: 'Lemon Ice Tea', price: 50 }, { name: 'Peach Ice Tea', price: 60 }, { name: 'Virgin Mint Mojito', price: 89 }, { name: 'Green Apple Mojito', price: 89 }, { name: 'Kala Khatta Mojito', price: 89 }] },
  { name: 'INDIAN CHINESE', imageUrl: '/home_html/images/categories/INDIAN_CHINESE.jpg', items: [{ name: 'Tomato Soup', price: 80 }, { name: 'Veg Corn Soup', price: 100 }, { name: 'Veg Manchow Soup', price: 110 }, { name: 'Veg Fried Rice', price: 100 }, { name: 'Paneer Chilli', price: 170 }] },
  { name: 'MAGGI', imageUrl: '/home_html/images/categories/MAGGI.jpg', items: [{ name: 'Plain Maggi', price: 50 }, { name: 'Masala Maggi', price: 60 }, { name: 'Cheese Schezwan Maggi', price: 90 }] },
  { name: 'PAV BHAJI & PULAV', imageUrl: '/home_html/images/categories/PAV_BHAJI_PULAV.jpg', items: [{ name: 'Pav Bhaji', price: 110 }, { name: 'Pav Bhaji Cheese', price: 139 }, { name: 'Paneer Pulav', price: 120 }] },
  { name: 'PASTA', imageUrl: '/home_html/images/categories/PASTA.png', items: [{ name: 'Red Sauce Pasta', price: 149 }, { name: 'White Sauce Pasta', price: 149 }, { name: 'Pink Sauce Pasta', price: 149 }] },
  { name: 'INDIAN BREAKFAST', imageUrl: '/home_html/images/categories/INDIAN_BREAKFAST.jpg', items: [{ name: 'Vada Pav', price: 25 }, { name: 'Chole Bhature', price: 110 }, { name: 'Misal Pav', price: 90 }] },
  { name: "THALI MEAL'S", imageUrl: '/home_html/images/categories/THALI_MEALS.jpg', items: [{ name: 'Shev Bhaji Thali', price: 99 }, { name: 'Paneer Thali', price: 119 }] },
  { name: 'SANDWICHES', imageUrl: '/home_html/images/categories/SANDWICHES.jpg', items: [{ name: 'Veg Cheese Grilled Sandwich', price: 110 }, { name: 'Bombay Masala Cheese Sandwich', price: 139 }] },
  { name: 'TOAST', imageUrl: '/home_html/images/categories/TOAST.jpg', items: [{ name: 'Bread Butter', price: 40 }, { name: 'Cheese Chilli Toast', price: 100 }] },
  { name: 'PARATHA', imageUrl: '/home_html/images/categories/PARATHA.jpg', items: [{ name: 'Aloo Paratha', price: 80 }, { name: 'Paneer Cheese Paratha', price: 139 }] },
  { name: 'PIZZA', imageUrl: '/home_html/images/categories/PIZZA.jpg', items: [{ name: 'Margarita Pizza', price: 90 }, { name: 'Corn Cheese Pizza', price: 129 }, { name: 'Farmhouse Pizza', price: 199 }] },
  { name: 'MOMOS', imageUrl: '/home_html/images/categories/MOMOS.jpg', items: [{ name: 'Veg Steam Momos', price: 69 }, { name: 'Paneer Fried Momos', price: 109 }] },
  { name: 'BURGERS', imageUrl: '/home_html/images/categories/BURGERS.jpg', items: [{ name: 'Veg Burger', price: 70 }, { name: 'Veg Cheese Schezwan Burger', price: 129 }] },
  { name: 'FRIES', imageUrl: '/home_html/images/categories/FRIES.jpg', items: [{ name: 'Plain Fries', price: 70 }, { name: 'Peri Peri Fries', price: 90 }, { name: 'Cheesy Fries', price: 110 }] },
  { name: 'SPECIAL COMBOS', imageUrl: '/home_html/images/categories/SPECIAL_COMBOS.jpg', items: [{ name: 'Burger + Fries + Cold Drink', price: 129 }, { name: 'Pizza + Fries + Cold Drink', price: 199 }] },
];

const HeritageMenuSection = ({ navigate }) => {
  const [activeTab, setActiveTab] = useState(0);
  const currentCategory = MENU_DATA[activeTab];

  return (
    <section className="relative bg-[#FAF7F2] py-24 lg:py-32 overflow-hidden font-sans">
      
      {/* Background Graphic - Minimalist */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/paper-fibers.png")` }} />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        
        {/* --- SHARP & CLEAN HEADER --- */}
        <header className="mb-20 pb-12 border-b border-black/5 flex flex-col md:flex-row md:items-end md:justify-between gap-10">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-5">
              <span className="h-px w-8 bg-[#8B1538]" />
              <span
                style={{ fontFamily: "Cormorant Garamond, serif" }}
                className="text-[28px] italic leading-none text-[#5f6476] md:text-[34px]"
              >
                Culinary Heritage
              </span>
            </div>
            <h2 className="font-serif text-5xl lg:text-7xl leading-[1.1] text-[#1A1516]">
              Discover the <span className="italic font-light text-[#D6A64A]">Authentic</span>
              <span className="block mt-2">Taste of <span className="text-[#8B1538]">Sangameshwar</span></span>
            </h2>
          </div>

          <button
            onClick={() => navigate('/menu')}
            className="group flex items-center gap-4 text-[11px] font-bold uppercase tracking-[0.3em] text-[#1A1516] self-start md:self-end"
          >
            <span className="relative">
              Explore Full Scroll
              <span className="absolute -bottom-2 left-0 h-px w-full bg-[#D6A64A] origin-right scale-x-0 transition-transform duration-500 group-hover:origin-left group-hover:scale-x-100" />
            </span>
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-2 text-[#D6A64A]" />
          </button>
        </header>

        {/* --- MAIN INTERFACE: SIDEBAR & GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-16 items-start">
          
          {/* LEFT: Symmetrical Sharp Tabs */}
          <nav className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible no-scrollbar pb-4 lg:pb-0 sticky top-28 z-20">
            {MENU_DATA.map((section, index) => {
              const isActive = activeTab === index;
              return (
                <button
                  key={section.name}
                  onClick={() => setActiveTab(index)}
                  className={`group relative text-left p-6 transition-all duration-500 border-l-[3px] shrink-0 lg:shrink 1
                    ${isActive ? 'border-[#8B1538] bg-white shadow-lg' : 'border-black/5 hover:border-[#D6A64A]/60'}`}
                >
                  <p className={`text-[9px] font-bold tracking-widest uppercase mb-1 transition-colors ${isActive ? 'text-[#8B1538]' : 'text-gray-400'}`}>
                    Category {String(index + 1).padStart(2, '0')}
                  </p>
                  <span className={`text-base font-serif font-medium transition-colors ${isActive ? 'text-[#1A1516]' : 'text-[#5C5452]'}`}>
                    {formatName(section.name)}
                  </span>
                  {!isActive && (
                    <div className="absolute bottom-0 left-0 h-0 w-full bg-[#D6A64A]/5 transition-all group-hover:h-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* RIGHT: Geometric 2-Column Masonry Grid */}
          <main className="w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
              >
                {currentCategory.items.map((item) => (
                  <article key={item.name} className="relative group bg-white p-8 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col gap-6 border border-black/5">
                    
                    {/* Item Image: Sharp, Square aspect */}
                    <div className="relative aspect-square overflow-hidden bg-gray-50 border border-black/5 shrink-0">
                      <img
                        src={currentCategory.imageUrl}
                        alt={item.name}
                        className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between gap-4 items-start mb-4 pb-4 border-b border-black/5">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <VegIcon />
                              <h4 className="font-serif text-2xl text-[#1A1516] leading-tight">{item.name}</h4>
                            </div>
                            <p className="text-xs text-[#8B1538] font-bold uppercase tracking-widest">{formatName(currentCategory.name)}</p>
                          </div>
                          <span className="font-serif text-3xl font-medium text-[#1A1516]">₹{item.price}</span>
                        </div>
                        
                        <p className="text-sm leading-relaxed text-[#5C5452] font-light italic mb-8">
                          {item.description || "A masterfully crafted blend of heritage spices, simmered to perfection for a genuine taste."}
                        </p>
                      </div>

                      {/* Sharp, minimalist button */}
                      <button className="w-full flex items-center justify-center gap-3 bg-[#1A1516] group-hover:bg-[#8B1538] py-4 text-[11px] font-bold uppercase tracking-[0.3em] text-white transition-colors duration-500">
                        Add to Meal
                        <span className="w-6 h-px bg-[#D6A64A] transition-all group-hover:w-10" />
                      </button>
                    </div>
                  </article>
                ))}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </section>
  );
};

// Simplified ArrowRight Icon for the header
const ArrowRight = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="arcs" className={className}>
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);

export default HeritageMenuSection;
