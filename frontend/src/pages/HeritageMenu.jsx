import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FacebookIcon, Instagram, MessageCircle } from "lucide-react";

const HeritageMenuSection = ({ navigate }) => {
  const [activeTab, setActiveTab] = useState(0);

  const formatName = (name) => name?.replace(/_/g, ' ') || "";
const CATEGORY_IMAGE_MAP = {
  BEVERAGES: '/home_html/images/categories/BEVERAGES.jpg',
  MILKSHAKE: '/home_html/images/categories/MILKSHAKE.jpg',
  PIZZA: '/home_html/images/categories/PIZZA.jpg',
  BURGERS: '/home_html/images/categories/BURGERS.jpg',
  MOMOS: '/home_html/images/categories/MOMOS.jpg',
  SANDWICHES: '/home_html/images/categories/SANDWICHES.jpg',
  PASTA: '/home_html/images/categories/PASTA.png',
  MAGGI: '/home_html/images/categories/MAGGI.jpg',
  'INDIAN BREAKFAST': '/home_html/images/categories/INDIAN_BREAKFAST.jpg',
  'PAV BHAJI & PULAV': '/home_html/images/categories/PAV_BHAJI_PULAV.jpg',
  'INDIAN CHINESE': '/home_html/images/categories/INDIAN_CHINESE.jpg',
  'COOLERS AND FRESHNERS': '/home_html/images/categories/COOLERS_FRESHNERS.jpg',
  'SPECIAL COMBOS': '/home_html/images/categories/SPECIAL_COMBOS.jpg',
  "THALI MEAL'S": '/home_html/images/categories/THALI_MEALS.jpg',
  TOAST: '/home_html/images/categories/TOAST.jpg',
  PARATHA: '/home_html/images/categories/PARATHA.jpg',
  FRIES: '/home_html/images/categories/FRIES.jpg',
};

const MENU_CATEGORY_ORDER = [
  'BEVERAGES',
  'MILKSHAKE',
  'COOLERS AND FRESHNERS',
  'INDIAN CHINESE',
  'MAGGI',
  'PAV BHAJI & PULAV',
  'PASTA',
  'INDIAN BREAKFAST',
  "THALI MEAL'S",
  'SANDWICHES',
  'TOAST',
  'PARATHA',
  'PIZZA',
  'MOMOS',
  'BURGERS',
  'FRIES',
  'SPECIAL COMBOS',
];

const SPECIAL_DISHES = [
  {
    category: 'Desserts',
    name: 'Chocolate Truffle Slice',
    description:
      'Rich cocoa layers with a smooth finish, plated for a premium cafe dessert experience.',
    price: 149,
    image: '/home_html/images/special-dish1.png',
  },
  {
    category: 'Main Dish',
    name: 'Chef Special Sizzler',
    description:
      'Bold flavors, balanced spice, and a satisfying plated meal designed for signature dining.',
    price: 239,
    image: '/home_html/images/special-dish2.png',
  },
  {
    category: 'Desserts',
    name: 'Signature Brownie Plate',
    description:
      'A rich dessert presentation with warm cafe-style indulgence and a refined plated look.',
    price: 189,
    image: '/home_html/images/special-dish3.png',
  },
];

const FOOTER_GALLERY = [
  '/home_html/images/footer-img-1.jpg',
  '/home_html/images/footer-img-2.jpg',
];

const SOCIAL_LINKS = [
  { label: 'Instagram', href: 'https://www.instagram.com/', icon: Instagram },
  { label: 'Facebook', href: 'https://www.facebook.com/', icon: FacebookIcon },
  { label: 'WhatsApp', href: 'https://wa.me/919049041488', icon: MessageCircle },
];

const HOME_MENU_SECTIONS = [
  { name: 'BEVERAGES', imageUrl: '/home_html/images/categories/BEVERAGES.jpg', items: [{ name: 'Cold Coffee', price: 60 }, { name: 'Cold Chocolate', price: 60 }, { name: 'Cold Milk', price: 50 }, { name: 'Thick Cream Coffee', price: 70 }, { name: 'Hot Coffee', price: 40 }, { name: 'Hot Chocolate', price: 40 }] },
  { name: 'MILKSHAKE', imageUrl: '/home_html/images/categories/MILKSHAKE.jpg', items: [{ name: 'Oreo', price: 99 }, { name: 'Brownie', price: 99 }, { name: 'KitKat', price: 99 }, { name: 'Strawberry', price: 99 }, { name: 'Mango', price: 99 }, { name: 'Chocolate', price: 99 }] },
  { name: 'COOLERS AND FRESHNERS', imageUrl: '/home_html/images/categories/COOLERS_FRESHNERS.jpg', items: [{ name: 'Lemon Ice Tea', price: 50 }, { name: 'Peach Ice Tea', price: 60 }, { name: 'Virgin Mint Mojito', price: 89 }, { name: 'Green Apple Mojito', price: 89 }, { name: 'Kala Khatta Mojito', price: 89 }] },
  { name: 'INDIAN CHINESE', imageUrl: '/home_html/images/categories/INDIAN_CHINESE.jpg', items: [{ name: 'Tomato Soup', price: 80 }, { name: 'Veg Corn Soup', price: 100 }, { name: 'Veg Manchow Soup', price: 110 }, { name: 'Veg. Schezwan Soup', price: 120 }, { name: 'Veg Fried Rice', price: 100 }, { name: 'Veg Shezwan Rice', price: 110 }, { name: 'Veg Combination Rice', price: 120 }, { name: 'Veg Triple Rice', price: 170 }, { name: 'Veg Fried Noodles', price: 110 }, { name: 'Veg Shezwan Noodles', price: 120 }, { name: 'Veg Tripple Noodles', price: 190 }, { name: 'Veg. Manchurian Dry/Grevy', price: 160 }, { name: 'Paneer 65', price: 170 }, { name: 'Paneer Chilli', price: 170 }] },
  { name: 'MAGGI', imageUrl: '/home_html/images/categories/MAGGI.jpg', items: [{ name: 'Plain Maggi', price: 50 }, { name: 'Masala Maggi', price: 60 }, { name: 'Plain Cheese Maggi', price: 70 }, { name: 'Masala Cheese Maggi', price: 80 }, { name: 'Cheese Schezwan Maggi', price: 90 }] },
  { name: 'PAV BHAJI & PULAV', imageUrl: '/home_html/images/categories/PAV_BHAJI_PULAV.jpg', items: [{ name: 'Pav Bhaji', price: 110 }, { name: 'Pav Bhaji Cheese', price: 139 }, { name: 'Tava Pulav', price: 90 }, { name: 'Tava Pulav Cheese', price: 110 }, { name: 'Paneer Pulav', price: 120 }, { name: 'Paneer Cheese Pulav', price: 150 }, { name: 'Extra Pav for Pav Bhaji (Pair)', price: 20 }, { name: 'Extra Pav for Pav', price: 10 }] },
  { name: 'PASTA', imageUrl: '/home_html/images/categories/PASTA.png', items: [{ name: 'Red Sauce Pasta', price: 149 }, { name: 'White Sauce Pasta', price: 149 }, { name: 'Pink Sauce Pasta', price: 149 }] },
  { name: 'INDIAN BREAKFAST', imageUrl: '/home_html/images/categories/INDIAN_BREAKFAST.jpg', items: [{ name: 'Vada Pav', price: 25 }, { name: 'Cheese Veggies Vada Pav', price: 35 }, { name: 'Crispy Cheese Vadapav', price: 45 }, { name: 'Tarri Poha', price: 30 }, { name: 'Upma', price: 40 }, { name: 'Sabudana Khichdi', price: 60 }, { name: 'Chole Bhature', price: 110 }, { name: 'Bhel Sample', price: 80 }, { name: 'Misal Pav', price: 90 }, { name: 'Dal Rice', price: 79 }, { name: 'Dal Khichdi', price: 99 }, { name: 'Masala Tak', price: 20 }, { name: 'Paneer Bhurji', price: 120 }] },
  { name: "THALI MEAL'S", imageUrl: '/home_html/images/categories/THALI_MEALS.jpg', items: [{ name: 'Shev Bhaji Thali', price: 99 }, { name: 'Rajma Thali', price: 99 }, { name: 'Chole Thali', price: 99 }, { name: 'Masala Vanga Thali', price: 99 }, { name: 'Paneer Thali', price: 119 }, { name: 'Extra Chapati', price: 15 }, { name: 'Extra Laccha Paratha', price: 25 }] },
  { name: 'SANDWICHES', imageUrl: '/home_html/images/categories/SANDWICHES.jpg', items: [{ name: 'Veg Cheese Grilled Sandwich', price: 110 }, { name: 'Veg Cheese Club Sandwich', price: 140 }, { name: 'Chocolate Sandwich', price: 110 }, { name: 'Cream Cheese Corn Sandwich', price: 110 }, { name: 'Bombay Masala Cheese Sandwich', price: 139 }, { name: 'Veg Cheese Paneer Sandwich', price: 149 }, { name: 'Indore Special Sandwich', price: 149 }] },
  { name: 'TOAST', imageUrl: '/home_html/images/categories/TOAST.jpg', items: [{ name: 'Bread Butter', price: 40 }, { name: 'Toast Butter', price: 60 }, { name: 'Cheese Chilli Toast', price: 100 }, { name: 'Cheese Garlic Bread', price: 90 }, { name: 'Cheese Toast', price: 80 }] },
  { name: 'PARATHA', imageUrl: '/home_html/images/categories/PARATHA.jpg', items: [{ name: 'Aloo Paratha', price: 80 }, { name: 'Aloo Cheese Paratha', price: 110 }, { name: 'Paneer Paratha', price: 100 }, { name: 'Paneer Cheese Paratha', price: 139 }] },
  { name: 'PIZZA', imageUrl: '/home_html/images/categories/PIZZA.jpg', items: [{ name: 'Margarita Pizza', price: 90 }, { name: 'Onion Capsicum', price: 110 }, { name: 'Corn Cheese Pizza', price: 129 }, { name: 'Peri Peri Paneer Pizza', price: 149 }, { name: 'Veggies Pizza', price: 149 }, { name: 'Tandoor Cheese Pizza', price: 169 }, { name: 'Tandoor Paneer Pizza', price: 169 }, { name: 'Farmhouse Pizza', price: 199 }] },
  { name: 'MOMOS', imageUrl: '/home_html/images/categories/MOMOS.jpg', items: [{ name: 'Veg Steam Momos', price: 69 }, { name: 'Veg Fried Momos', price: 79 }, { name: 'Veg Crispy Momos', price: 89 }, { name: 'Corn Steam Momos', price: 79 }, { name: 'Corn Fried Momos', price: 89 }, { name: 'Corn Crispy Momos', price: 99 }, { name: 'Paneer Steam Momos', price: 99 }, { name: 'Paneer Fried Momos', price: 109 }, { name: 'Paneer Crispy Momos', price: 119 }] },
  { name: 'BURGERS', imageUrl: '/home_html/images/categories/BURGERS.jpg', items: [{ name: 'Veg Burger', price: 70 }, { name: 'Veg Cheese Burger', price: 90 }, { name: 'Veg Schezwan Burger', price: 110 }, { name: 'Veg Cheese Schezwan Burger', price: 129 }, { name: 'Veg Paneer Burger', price: 100 }, { name: 'Veg Cheese Paneer Burger', price: 130 }] },
  { name: 'FRIES', imageUrl: '/home_html/images/categories/FRIES.jpg', items: [{ name: 'Plain Fries', price: 70 }, { name: 'Peri Peri Fries', price: 90 }, { name: 'Cheesy Fries', price: 110 }, { name: 'Cheese Ball', price: 110 }] },
  { name: 'SPECIAL COMBOS', imageUrl: '/home_html/images/categories/SPECIAL_COMBOS.jpg', items: [{ name: 'Crispy Vadapav + Poha + Tak', price: 79 }, { name: 'Pav Bhaji + Pulav + Lassi', price: 149 }, { name: 'Chole Bhature + Pulav + Lassi', price: 169 }, { name: 'Burger + Fries + Cold Drink', price: 129 }, { name: 'Sandwich + Fries + Cold Coffee', price: 149 }, { name: 'Pizza + Fries + Cold Drink', price: 199 }] },
];

const HOME_MENU_SECTION_TITLES = {
  BEVERAGES: 'Beverages',
  MILKSHAKE: 'Milkshake',
  'COOLERS AND FRESHNERS': 'Coolers and Freshners',
  'INDIAN CHINESE': 'Indian Chinese',
  MAGGI: 'Maggi',
  'PAV BHAJI & PULAV': 'Pav Bhaji & Pulav',
  PASTA: 'Pasta',
  'INDIAN BREAKFAST': 'Indian Breakfast',
  "THALI MEAL'S": "Thali Meal's",
  SANDWICHES: 'Sandwiches',
  TOAST: 'Toast',
  PARATHA: 'Paratha',
  PIZZA: 'Pizza',
  MOMOS: "Momo's",
  BURGERS: 'Burgers',
  FRIES: 'Fries',
  'SPECIAL COMBOS': 'Special Combo',
};

const ORDERED_HOME_MENU_SECTIONS = MENU_CATEGORY_ORDER
  .map((name) => HOME_MENU_SECTIONS.find((section) => section.name === name))
  .filter(Boolean);
  return (
    <section className="relative px-4 py-20 md:px-8 max-w-7xl mx-auto bg-[#FFFBF2] overflow-hidden">
      
      {/* --- DECORATIVE BACKGROUND MOTIF --- */}
      <div className="absolute top-0 right-0 w-64 h-64 opacity-5 pointer-events-none">
        <svg viewBox="0 0 100 100" fill="#8B1538"><path d="M50 0 L100 50 L50 100 L0 50 Z" /></svg>
      </div>

      {/* --- HEADER --- */}
      <div className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-[#D6A64A]/30 pb-10">
        <div className="relative flex items-center gap-6">
          {/* Royal Waiter/Mascot Image with a Gold Frame effect */}
          <div className="relative">
            <div className="absolute inset-0 border-2 border-[#D6A64A] rounded-full scale-110 opacity-30" />
            <img
              src="/Gemini_Generated_Image_aibp94aibp94aibp-removebg-preview.png"
              className="h-[140px] md:h-[180px] object-contain relative z-10"
              alt="Sangameshwar"
            />
          </div>

          <div className="max-w-xl">
             <div className="flex items-center gap-2 mb-2">
                <div className="h-[1px] w-8 bg-[#D6A64A]" />
                <span className="text-[10px] font-bold tracking-[0.3em] text-[#8B1538] uppercase">The Culinary Dynasty</span>
             </div>
             <h2 className="text-3xl md:text-6xl font-bold text-[#1a1a1a] leading-tight" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Discover the <span className="italic text-[#D6A64A]">Authentic</span> <br /> 
              Taste of <span className="text-[#8B1538]">Sangameshwar</span>
            </h2>
          </div>
        </div>

        <button
          onClick={() => navigate('/menu')}
          className="group flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#8B1538] hover:text-[#D6A64A] transition-colors"
        >
          View Full Scroll
          <span className="w-12 h-[1px] bg-[#D6A64A] group-hover:w-20 transition-all duration-500" />
        </button>
      </div>

      {/* --- MAIN INTERFACE --- */}
      <div className="flex flex-col lg:flex-row gap-16 items-start">
        
        {/* LEFT SIDEBAR: Vertical Heritage Tabs */}
        <div className="w-full lg:w-80 sticky top-24 z-20">
          <div className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible gap-3 py-4 lg:py-0 no-scrollbar">
            {ORDERED_HOME_MENU_SECTIONS.map((section, index) => {
              const isActive = activeTab === index;
              return (
                <button
                  key={section.name}
                  onClick={() => setActiveTab(index)}
                  className={`relative shrink-0 text-left px-6 py-4 transition-all duration-500 border-l-2 
                    ${isActive ? 'border-[#8B1538]' : 'border-transparent hover:border-[#D6A64A]/50'}`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTabGlow"
                      className="absolute inset-0 bg-gradient-to-r from-[#8B1538]/5 to-transparent"
                    />
                  )}
                  <div className="relative z-10">
                    <p className={`text-[10px] font-bold tracking-widest uppercase mb-1 transition-colors ${isActive ? 'text-[#8B1538]' : 'text-gray-400'}`}>
                        Category {index + 1}
                    </p>
                    <span className={`text-sm lg:text-lg font-serif font-bold transition-all duration-300 ${isActive ? 'text-[#1a1a1a] translate-x-2 inline-block' : 'text-gray-500'}`}>
                        {formatName(section.name)}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT CONTENT: Heritage Item List */}
        <div className="flex-1 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              {/* Section Divider with Title */}
              <div className="flex items-center gap-6 mb-12">
                <h3 className="text-4xl font-serif font-bold text-[#1a1a1a]">
                  {formatName(ORDERED_HOME_MENU_SECTIONS[activeTab].name)}
                </h3>
                <div className="h-[1px] flex-1 bg-gradient-to-r from-[#D6A64A] to-transparent" />
                <span className="font-serif italic text-[#8B1538]">{ORDERED_HOME_MENU_SECTIONS[activeTab].items.length} Delicacies</span>
              </div>

              <div className="grid grid-cols-1 gap-14">
                {ORDERED_HOME_MENU_SECTIONS[activeTab].items.map((item) => (
                  <div key={item.name} className="group relative flex flex-col md:flex-row gap-8 pb-14 border-b border-[#D6A64A]/20 last:border-0">
                    
                    {/* Item Image: The Arched "Jharokha" look */}
                    <div className="relative h-44 w-full md:w-52 shrink-0 overflow-hidden rounded-t-full border-[4px] border-[#D6A64A]/30">
                      <img
                        src={item.image || ORDERED_HOME_MENU_SECTIONS[activeTab].imageUrl}
                        alt={item.name}
                        className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-1000"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a]/40 to-transparent" />
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
                        <span className="bg-[#8B1538] text-[#F5D38B] px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest whitespace-nowrap border border-[#D6A64A]">
                          Signature
                        </span>
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-3 mb-3">
                            <div className="h-4 w-4 border border-green-600 p-[2px]"><div className="h-full w-full bg-green-600 rounded-full" /></div>
                            <h4 className="text-2xl font-serif font-bold text-[#1a1a1a] tracking-tight">{item.name}</h4>
                          </div>
                          <p className="text-gray-600 font-serif leading-relaxed italic max-w-lg">
                            {item.description || "A masterfully crafted blend of heritage spices, simmered to perfection for a royal experience."}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-3xl font-serif font-bold text-[#8B1538]">₹{item.price}</span>
                          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">Nett Price</p>
                        </div>
                      </div>

                      <div className="mt-8 flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <span className="text-[#D6A64A] text-sm">★</span>
                                <span className="text-[12px] font-bold text-gray-700">4.9 / 5</span>
                            </div>
                            <div className="h-4 w-[1px] bg-gray-200" />
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">Traditional Slow-Cooked</p>
                        </div>

                        {/* Royal Style Button */}
                        <button className="relative px-10 py-3 bg-[#8B1538] text-[#F5D38B] text-xs font-bold rounded-sm hover:bg-[#1a1a1a] transition-all duration-500 shadow-xl border border-[#D6A64A]">
                          ADD TO MEAL
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};


export default HeritageMenuSection;