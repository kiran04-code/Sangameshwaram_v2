import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AnimatePresence } from 'framer-motion';
import Header from '../components/Header';
import {
  ChevronRight,
  ArrowRight,
  Award,
  CalendarDays,
  ChefHat,
  ChevronDown,
  ChevronLeft,
  Clock,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Search,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { useCart } from '../context/CartContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;
import { motion } from 'framer-motion';
import HotelGallery from './HotelGallery';
import Testimonials from './Testimonials';
import HotelAboutSection from './HotelAboutSection';
import HeroSection from './Herosection';
import HeritageAbout from './HotelAboutSection';
import HeritageCategories from './HeritageCategories';
import HeritageMenuSection from './HeritageMenu';
import HeritageReservation from './HeritageReservation';
import HeritageChefSection from './HeritageChefSection';
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
  { label: 'Facebook', href: 'https://www.facebook.com/', icon: Facebook },
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

const normalizeImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  if (url.startsWith('/home_html/')) return url;
  if (url.startsWith('/api/uploads')) return `${BACKEND_URL}${url}`;
  if (url.startsWith('/uploads')) return `${BACKEND_URL}/api${url}`;
  if (!url.includes('/')) return `${BACKEND_URL}/api/uploads/${url}`;
  return `${BACKEND_URL}/api${url}`;
};

const formatCategoryName = (name = '') =>
  name
    .toLowerCase()
    .split(' ')
    .map((word) => (word ? word[0].toUpperCase() + word.slice(1) : word))
    .join(' ');

const getCategoryImage = (categoryName) => {
  const key = (categoryName || '').toUpperCase();
  return CATEGORY_IMAGE_MAP[key] || '/home_html/images/categories/BEVERAGES.jpg';
};

const formatPrice = (price) => {
  const numericPrice = Number(price || 0);
  return `Rs. ${Number.isInteger(numericPrice) ? numericPrice : numericPrice.toFixed(2)}`;
};

const SpecialDishCard = ({ item }) => (
  <article className="group mx-auto flex h-full min-h-[560px] w-full max-w-[330px] flex-col overflow-hidden rounded-[190px_190px_0_0] border border-[#D8B146] bg-[#F7F5F2] px-7 pb-10 pt-12 shadow-[0_22px_60px_rgba(72,28,37,0.05)] transition-transform duration-300 hover:-translate-y-1">
    <div className="text-center">
      <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#D2A400]">
        {item.category ? formatCategoryName(item.category) : 'Chef Pick'}
      </p>
      <div className="mx-auto mt-10 flex h-[250px] w-[250px] items-center justify-center overflow-hidden rounded-full bg-white shadow-[0_20px_45px_rgba(72,28,37,0.1)]">
        <img
          src={item.image || normalizeImageUrl(item.image_url)}
          alt={item.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
    </div>

    <div className="flex flex-1 flex-col pt-10 text-center">
      <h3
        className="text-[30px] font-bold uppercase leading-none text-[#CFC3C4]"
        style={{ fontFamily: 'Cormorant Garamond, serif' }}
      >
        {item.name}
      </h3>
      <p className="mt-4 flex-1 text-sm leading-7 text-[#8E7C7E]">
        {item.description || 'A signature cafe favorite crafted for balanced flavor, premium presentation, and memorable comfort.'}
      </p>
      <p className="mt-5 text-sm font-semibold uppercase tracking-[0.18em] text-[#D2A400]">
        {formatPrice(item.price)}
      </p>
    </div>
  </article>
);


const LegacyCompleteMenuSection = ({ navigate }) => {
  return (
    <section
      className="relative px-4 py-24 bg-[#FCFBFA] overflow-hidden" // Soft premium white
      data-testid="complete-menu-section"
    >
      {/* Very subtle brand glow in the background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_#A11A4308_0%,_transparent_70%)]" />

      <div className="relative mx-auto max-w-7xl">

        {/* Section Header */}
        <div className="mb-20 flex flex-col items-center">
          <div className="w-12 h-1 bg-[#A11A43] mb-6 rounded-full" />
          <h2 className="text-5xl font-light tracking-tighter text-gray-900 sm:text-7xl lg:text-8xl" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            The <span className="italic text-[#A11A43]">Menu</span>
          </h2>
          <p className="mt-4 text-[10px] uppercase tracking-[0.5em] text-gray-400 font-bold">Curated Culinary Excellence</p>
        </div>

        {/* Main Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

          {/* Left Column: Mini-Cards */}
          <div className="lg:col-span-3 space-y-10 order-2 lg:order-1">
            {HOME_MENU_SECTIONS.slice(0, 2).map((section) => (
              <div key={section.name}>
                <h3 className="text-gray-900 text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#A11A43]" />
                  {section.name}
                </h3>
                <div className="space-y-3">
                  {section.items.slice(0, 3).map((item) => (
                    <div
                      key={item.name}
                      className="group flex items-center justify-between p-4 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-[#A11A43]/20 transition-all cursor-pointer"
                    >
                      <div className="flex flex-col">
                        <span className="text-[12px] font-bold text-gray-800 group-hover:text-[#A11A43] transition-colors uppercase">{item.name}</span>
                        <span className="text-[11px] font-medium text-gray-400 mt-0.5">₹{item.price}</span>
                      </div>
                      <button className="h-7 w-7 rounded-lg border border-gray-200 flex items-center justify-center text-[#A11A43] group-hover:bg-[#A11A43] group-hover:text-white group-hover:border-[#A11A43] transition-all text-sm font-bold">
                        +
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Center Column: Professional Hero Image */}
          <div className="lg:col-span-6 order-1 lg:order-2">
            <div className="relative p-2">
              {/* Image Frame with soft shadow instead of dark glow */}
              <div className="relative aspect-[4/5] overflow-hidden rounded-t-full border-[8px] border-white shadow-[0_20px_50px_rgba(0,0,0,0.08)] bg-white">
                <img
                  src={HOME_MENU_SECTIONS[0]?.imageUrl || "/placeholder.jpg"}
                  alt="Signature Dish"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-transparent to-transparent" />

                {/* Floating Clean Badge */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[85%] bg-white/90 backdrop-blur-md border border-white p-5 rounded-2xl shadow-xl text-center">
                  <span className="text-[#A11A43] text-[9px] font-black uppercase tracking-[0.3em]">Signature Dish</span>
                  <h4 className="text-gray-900 text-lg font-serif italic mt-1">Our Chef's Special Selection</h4>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Mini-Cards */}
          <div className="lg:col-span-3 space-y-10 order-3">
            {HOME_MENU_SECTIONS.slice(2, 4).map((section) => (
              <div key={section.name}>
                <h3 className="text-gray-900 text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#A11A43]" />
                  {section.name}
                </h3>
                <div className="space-y-3">
                  {section.items.slice(0, 3).map((item) => (
                    <div
                      key={item.name}
                      className="group flex items-center justify-between p-4 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-[#A11A43]/20 transition-all cursor-pointer"
                    >
                      <div className="flex flex-col">
                        <span className="text-[12px] font-bold text-gray-800 group-hover:text-[#A11A43] transition-colors uppercase">{item.name}</span>
                        <span className="text-[11px] font-medium text-gray-400 mt-0.5">₹{item.price}</span>
                      </div>
                      <button className="h-7 w-7 rounded-lg border border-gray-200 flex items-center justify-center text-[#A11A43] group-hover:bg-[#A11A43] group-hover:text-white group-hover:border-[#A11A43] transition-all text-sm font-bold">
                        +
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Action Button: High contrast white on Brand Color */}
        <div className="mt-20 flex justify-center">
          <button
            onClick={() => navigate('/menu')}
            className="group relative px-10 py-4 bg-[#A11A43] rounded-full shadow-[0_10px_30px_rgba(161,26,67,0.3)] hover:shadow-[0_15px_40px_rgba(161,26,67,0.4)] transition-all duration-300"
          >
            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-white">
              View Full Menu
            </span>
          </button>
        </div>

      </div>
    </section>
  );
};

const CompleteMenuSection = ({ navigate }) => {
  const [activeTab, setActiveTab] = useState(0);

  const formatName = (name) => name?.replace(/_/g, ' ') || "";

  return (
    <section className="px-4 md:px-8 max-w-7xl mx-auto font-sans">
      {/* --- HEADER --- */}
      <div className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-2xl">
          <div className="relative pb-10">
            {/* Waiter Image Container - ensures left alignment */}
            <div className="relative flex flex-col items-start">
              
              {/* Image */}
              <img
                src="/Gemini_Generated_Image_aibp94aibp94aibp-removebg-preview.png"
                className="h-[160px] md:h-[230px] object-contain"
                alt="Sangameshwar"
              />

              {/* Text - md:absolute keeps your overlay, while removal of fixed width makes it "straight" */}
              <div className="
                mt-4                 /* mobile: below image */
                md:absolute          /* desktop: overlay */
                md:top-[125px] 
                md:left-[205px] 
                z-[900]
                w-full md:w-auto    /* full width on mobile, auto on desktop */
              ">
                <h2 className="text-3xl md:text-5xl font-black text-gray-900 leading-[1.1] tracking-tight text-left md:whitespace-nowrap">
                  Discover the <span className="text-gray-400">Authentic</span> <br /> Taste of <span className="text-[#A11A43]">Sangameshwar</span>
                </h2>
              </div>

            </div>
          </div>
        </div>

        <button
          onClick={() => navigate('/menu')}
          className="group flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-[#A11A43] transition-colors"
        >
          View Full Menu
          <span className="w-8 h-[1px] bg-gray-200 group-hover:w-12 group-hover:bg-[#A11A43] transition-all" />
        </button>
      </div>

      {/* --- MAIN INTERFACE --- */}
      <div className="flex flex-col lg:flex-row gap-12 items-start">
        {/* LEFT SIDEBAR: Premium Glass Navigation */}
        <div className="w-full lg:w-72 sticky top-[72px] lg:top-24 z-20 bg-white/80 backdrop-blur-md lg:bg-transparent -mx-4 px-4 lg:mx-0 lg:px-0">
          <div className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible gap-2 py-3 lg:py-0 scrollbar-hide snap-x snap-mandatory">
            {ORDERED_HOME_MENU_SECTIONS.map((section, index) => {
              const isActive = activeTab === index;
              return (
                <button
                  key={section.name}
                  id={`tab-${index}`}
                  onClick={() => {
                    setActiveTab(index);
                    document.getElementById(`tab-${index}`)?.scrollIntoView({
                      behavior: 'smooth',
                      block: 'nearest',
                      inline: 'center'
                    });
                  }}
                  className={`relative shrink-0 snap-center text-left px-5 py-3 lg:px-6 lg:py-4 rounded-xl lg:rounded-2xl text-[10px] lg:text-[11px] font-black uppercase tracking-wider transition-all duration-300
                    ${isActive
                      ? 'text-white shadow-md shadow-[#A11A43]/20'
                      : 'text-gray-500 bg-gray-50 lg:bg-transparent hover:text-gray-900'
                    }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-[#A11A43] rounded-xl lg:rounded-2xl"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10 whitespace-nowrap">
                    {formatName(section.name)}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="h-px w-full bg-gray-100 lg:hidden" />
        </div>

        {/* RIGHT CONTENT: Interactive Item List */}
        <div className="flex-1 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div className="flex items-baseline gap-4 mb-10">
                <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">
                  {formatName(ORDERED_HOME_MENU_SECTIONS[activeTab].name)}
                </h3>
                <div className="h-px flex-1 bg-gray-100" />
                <span className="text-[10px] font-bold text-gray-300 uppercase">
                  {ORDERED_HOME_MENU_SECTIONS[activeTab].items.length} Options
                </span>
              </div>

              <div className="grid grid-cols-1 gap-10">
                {ORDERED_HOME_MENU_SECTIONS[activeTab].items.map((item) => (
                  <div key={item.name} className="group flex flex-col sm:flex-row items-start sm:items-center gap-6 pb-10 border-b border-gray-50 last:border-0">
                    <div className="relative h-32 w-full sm:w-40 shrink-0 overflow-hidden rounded-[24px] bg-gray-50 shadow-inner">
                      <img
                        src={item.image || ORDERED_HOME_MENU_SECTIONS[activeTab].imageUrl}
                        alt={item.name}
                        className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute top-2 left-2">
                        <span className="bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg text-[9px] font-black text-[#A11A43] shadow-sm uppercase tracking-tighter">
                          Must Try
                        </span>
                      </div>
                    </div>

                    <div className="flex-1 w-full">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="w-3 h-3 border-2 border-green-600 flex items-center justify-center rounded-[2px]">
                              <span className="w-1.5 h-1.5 bg-green-600 rounded-full" />
                            </span>
                            <h4 className="text-lg font-black text-gray-900 uppercase leading-none">{item.name}</h4>
                          </div>
                          <p className="text-sm text-gray-400 font-medium leading-relaxed max-w-md line-clamp-2 italic">
                            {item.description || "A delicate balance of spices and fresh ingredients, prepared daily by our head chef."}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-xl font-black text-gray-900 tracking-tighter">₹{item.price}</span>
                          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">Plus Taxes</p>
                        </div>
                      </div>

                      <div className="mt-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1.5">
                            <span className="text-orange-400 text-xs font-bold">★</span>
                            <span className="text-[11px] font-bold text-gray-700">4.3</span>
                          </div>
                          <span className="h-4 w-px bg-gray-100" />
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">25-30 MINS</span>
                        </div>
                        <button className="relative overflow-hidden px-8 py-2.5 bg-white border-2 border-gray-100 text-[#A11A43] text-xs font-black rounded-xl hover:border-[#A11A43] hover:bg-[#A11A43] hover:text-white transition-all duration-300 shadow-sm active:scale-95 group/btn">
                          <span className="relative z-10">ADD TO CART</span>
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

const HomePage = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [featuredItems, setFeaturedItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [combos, setCombos] = useState([]);
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 59 });

  useEffect(() => {
    fetchData();

    const timer = setInterval(() => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const diff = midnight - now;

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const fetchData = async () => {
    try {
      const [featuredRes, categoriesRes, combosRes] = await Promise.allSettled([
        axios.get(`${API}/featured`),
        axios.get(`${API}/categories`),
        axios.get(`${API}/combos`),
      ]);

      if (featuredRes.status === 'fulfilled') {
        setFeaturedItems(Array.isArray(featuredRes.value.data) ? featuredRes.value.data : []);
      }

      if (categoriesRes.status === 'fulfilled') {
        setCategories(Array.isArray(categoriesRes.value.data.categories) ? categoriesRes.value.data.categories : []);
      }

      if (combosRes.status === 'fulfilled') {
        setCombos(Array.isArray(combosRes.value.data) ? combosRes.value.data : []);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#FFF8F5_0%,#FFF0E6_100%)]">
      <Header />

     <HeroSection/>
<HeritageAbout/>
     <HeritageCategories categories={categories} />
      <HeritageMenuSection/>



      {SPECIAL_DISHES.length > 0 && (
  <section className="bg-[#FFFBF2] px-4 py-20 sm:px-6 lg:px-8 relative overflow-hidden">
    {/* Background Watermark Motif */}
    <div className="absolute top-10 left-0 w-64 h-64 opacity-[0.03] pointer-events-none">
      <svg viewBox="0 0 100 100" fill="#8B1538"><path d="M50 0 L100 50 L50 100 L0 50 Z" /></svg>
    </div>

    <div className="mx-auto max-w-7xl relative z-10">

      {/* --- SECTION 1: ROYAL CATEGORIES --- */}
      <div className="mb-14 text-center">
        <div className="flex items-center justify-center gap-4 mb-3">
          <div className="h-[1px] w-10 bg-[#D6A64A]" />
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#8B1538]">The Imperial Selection</span>
          <div className="h-[1px] w-10 bg-[#D6A64A]" />
        </div>
        <h2 className="text-4xl font-bold text-[#1a1a1a] md:text-5xl font-serif">
          What Shall We <span className="italic text-[#8B1538]">Prepare</span> For You?
        </h2>
      </div>

      <div className="mb-20 overflow-x-auto pb-8 no-scrollbar">
        <div className="flex min-w-max justify-center gap-x-12 px-4">
          {SPECIAL_DISHES.map((item) => (
            <button
              key={item.name}
              type="button"
              className="group flex flex-col items-center text-center"
            >
              <div className="relative">
                {/* Rotating Border Effect */}
                <div className="absolute inset-[-6px] border border-dashed border-[#D6A64A]/40 rounded-full transition-transform duration-1000 group-hover:rotate-180" />
                
                <div className="h-28 w-28 md:h-32 md:w-32 overflow-hidden rounded-full border-4 border-[#D6A64A] bg-white shadow-xl transition-all duration-500 group-hover:scale-105">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
              </div>

              <h3 className="mt-6 text-sm font-bold uppercase tracking-widest text-[#2A2022] group-hover:text-[#8B1538] transition-colors">
                {item.name}
              </h3>
              <div className="mt-2 h-[1px] w-4 bg-[#D6A64A] group-hover:w-10 transition-all" />
            </button>
          ))}
        </div>
      </div>

      {/* --- SECTION 2: RECOMMENDED CARDS --- */}
      <div className="mb-12 flex items-end justify-between border-b border-[#D6A64A]/20 pb-8">
        <div>
          <h3 className="text-3xl font-bold text-[#1a1a1a] font-serif">
            Chef's <span className="italic text-[#D6A64A]">Masterpieces</span>
          </h3>
          <p className="mt-2 text-sm text-gray-500 font-serif italic">
            Handpicked signature delicacies from the house of Sangameshwar
          </p>
        </div>

        <button
          onClick={() => navigate("/menu")}
          className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#8B1538] hover:text-[#D6A64A] transition-colors"
        >
          View Full Scroll
          <div className="h-[1px] w-8 bg-[#8B1538] group-hover:w-12 transition-all" />
        </button>
      </div>

      <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
        {SPECIAL_DISHES.map((item) => (
          <div
            key={item.name}
            className="group flex flex-col bg-transparent"
          >
            {/* Jharokha Style Image Container */}
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-t-full border-[6px] border-[#D6A64A]/20 bg-white transition-all duration-500 group-hover:border-[#D6A64A]/50">
              <img
                src={item.image}
                alt={item.name}
                className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a]/60 via-transparent to-transparent opacity-80" />

              {/* Royal Badge */}
              <div className="absolute left-1/2 -translate-x-1/2 top-6">
                <span className="rounded-full bg-[#8B1538] border border-[#D6A64A] px-4 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-[#F5D38B] shadow-2xl">
                  House Special
                </span>
              </div>

              {/* Bottom Info Overlay */}
              <div className="absolute bottom-6 left-0 right-0 px-6 flex items-center justify-between text-white">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#24963F] border border-white/20">
                    <span className="text-[10px] font-bold">4.3</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-tighter opacity-80">Rating</span>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest py-1 px-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                    25 MINS
                </span>
              </div>
            </div>

            {/* Content Section */}
            <div className="mt-8 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <h3 className="text-2xl font-serif font-bold text-[#1a1a1a] tracking-tight group-hover:text-[#8B1538] transition-colors">
                  {item.name}
                </h3>
                <p className="text-2xl font-serif font-bold text-[#8B1538]">
                  ₹{item.price}
                </p>
              </div>

              <p className="line-clamp-2 font-serif text-[15px] leading-relaxed text-gray-600 italic">
                {item.description || "Experience the authentic rich flavors of Sangameshwar, prepared using traditional royal recipes."}
              </p>

              {/* Heritage Style Action Button */}
              <div className="mt-8 pt-6 border-t border-[#D6A64A]/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border border-green-600 p-[2px] flex items-center justify-center">
                    <div className="h-full w-full bg-green-600 rounded-full" />
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pure Traditional</span>
                </div>

                <button className="relative px-8 py-3 bg-[#8B1538] text-[#F5D38B] text-[11px] font-bold rounded-sm border border-[#D6A64A] transition-all duration-300 hover:bg-[#1a1a1a] shadow-xl transform active:scale-95">
                  ADD TO FEAST
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  </section>
)}

      <HeritageReservation/>

      <HeritageChefSection/>
      <HotelGallery/>
      <Testimonials/>
      <footer className="relative overflow-hidden bg-[#9F1A42] px-4 pt-20 pb-10 text-white" data-testid="footer">
        {/* Subtle Brand Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[1px] w-full max-w-4xl bg-gradient-to-r from-transparent via-[#8B1538] to-transparent opacity-50" />

        <div className="relative mx-auto max-w-7xl">
          <div className="flex flex-col items-center">
            {/* Brand Logo & Description */}
            <div className="mb-12 text-center">
              <img
                src="/home_html/images/logo.png"
                alt="Sangameshwar Cafe"
                className="mx-auto h-40 w-auto brightness-0 invert"
              />
              {/* Increased contrast from white/60 to white/90 */}
              <p className="mx-auto mt-6 max-w-lg text-sm leading-8 text-white/90 font-medium">
                Crafting premium cafe experiences in the heart of Pune. Join us for a blend of tradition, flavor, and community.
              </p>
            </div>

            {/* Main Info Grid */}
            <div className="grid w-full gap-12 border-y border-white/10 py-16 md:grid-cols-3">
              {/* Contact Info */}
              <div className="text-center md:text-left">
                <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#ffffff]">Contact Us</h4>
                <div className="mt-6 space-y-4 text-sm font-bold text-white">
                  <a href="tel:+919049041488" className="flex items-center justify-center gap-3 hover:text-[#a19296] md:justify-start transition-colors">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-[#ffffff]"><Phone size={16} /></span>
                    +91 90490 41488
                  </a>
                  <a href="mailto:booking@gmail.com" className="flex items-center justify-center gap-3 hover:text-[#997a83] md:justify-start transition-colors">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-[#ffffff]"><Mail size={16} /></span>
                    booking@gmail.com
                  </a>
                </div>
              </div>

              {/* Location & Hours */}
              <div className="text-center">
                <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#ffffff]">Location & Hours</h4>
                {/* Switched to pure white for key information */}
                <p className="mt-6 text-sm font-bold leading-relaxed text-white">
                  Magic Business Hub, near VIIT College,<br /> Kondhwa Budruk, Pune 411048
                </p>
                {/* Highlighted hours with Brand Color for visibility */}
                <p className="mt-4 text-[13px] font-bold text-[#fffefe]">Daily: 8:00 AM — 10:00 PM</p>
              </div>

              {/* Newsletter */}
              <div className="text-center md:text-right">
                <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#ffffff]">Newsletter</h4>
                <p className="mt-6 text-sm font-bold text-white/90">Get updates on seasonal specials.</p>
                <form className="mt-4 flex flex-col gap-2 sm:flex-row md:justify-end" onSubmit={(e) => e.preventDefault()}>
                  <input
                    type="email"
                    placeholder="Email address"
                    className="h-11 rounded-full bg-white/10 border border-white/20 px-5 text-xs text-white placeholder:text-white/50 focus:border-[#8B1538] outline-none transition-all"
                  />
                  <button className="h-11 rounded-full bg-[#fafafa] px-6 text-[11px] font-bold uppercase tracking-widest text-[#8B1538] transition-all hover:bg-[#fcfcfc] hover:shadow-[0_0_20px_rgba(139,21,56,0.4)] active:scale-95">
                    Join
                  </button>
                </form>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="mt-12 flex w-full flex-col items-center justify-between gap-8 md:flex-row">
              {/* Copyright - Increased visibility from white/30 to white/60 */}
              <p className="order-2 text-[11px] font-bold tracking-widest text-white/60 md:order-1 uppercase">
                © 2026 SANGAMESHWAR CAFE. BUILT FOR EXCELLENCE.
              </p>

              {/* Premium Social Icons */}
              <div className="order-1 flex items-center gap-4 md:order-2">
                {SOCIAL_LINKS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      className="group flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/5 transition-all hover:border-[#701818] hover:bg-[#ffffff]"
                      aria-label={item.label}
                    >
                      <Icon size={18} className="text-white  transition-transform" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
