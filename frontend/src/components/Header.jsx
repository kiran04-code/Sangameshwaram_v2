import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, Plus, Menu } from 'lucide-react';
import axios from 'axios';

const LOGO_URL = '/home_html/images/logo.png';
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Header = ({ showSearch = false, onSearchChange = null, onAddToCart = null }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuItems, setMenuItems] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [localSearch, setLocalSearch] = useState('');
  const searchContainerRef = useRef(null);

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Menu', path: '/menu' },
    { label: 'About Us', path: '/about' },
    { label: 'Contact Us', path: '/contact' },
    { label: 'Admin', path: '/admin/dashboard' },
  ];

  useEffect(() => {
    if (showSearch) {
      fetchMenuItems();
    }
  }, [showSearch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    if (showSuggestions) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showSuggestions]);

  const fetchMenuItems = async () => {
    try {
      const response = await axios.get(`${API}/menu`);
      setMenuItems(response.data);
    } catch (err) {
      console.error('Error fetching menu:', err);
    }
  };

  const handleSearchChange = (value) => {
    setLocalSearch(value);
    onSearchChange?.(value);

    if (value.trim() === '') {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const filtered = menuItems
      .filter((item) => item.name.toLowerCase().includes(value.toLowerCase()))
      .slice(0, 5);
    setSuggestions(filtered);
    setShowSuggestions(filtered.length > 0);
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#8B1538]" data-testid="header">
        <div className="mx-auto flex min-h-[92px] max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex shrink-0 items-center"
          >
            <img
              src={LOGO_URL}
              alt="Sangameshwar"
              className="h-14 w-auto object-contain sm:h-16 lg:h-[72px]"
            />
          </button>

          <nav className="hidden items-center gap-8 lg:flex">
            {navItems.map((item) => {
              const isActive =
                item.path === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(item.path);

              return (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => navigate(item.path)}
                  className={`relative pb-2 text-sm font-medium uppercase tracking-[0.12em] transition-colors ${
                    isActive ? 'text-[#D6A64A]' : 'text-white'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 h-[2px] w-9 -translate-x-1/2 rounded-full bg-[#D6A64A]" />
                  )}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => navigate('/menu')}
              className="hidden min-h-[48px] rounded-xl bg-[#F3C316] px-6 text-sm font-bold uppercase tracking-[0.08em] text-[#40191D] shadow-[0_18px_32px_rgba(37,19,22,0.18)] transition-transform hover:-translate-y-0.5 sm:inline-flex sm:items-center sm:justify-center"
            >
              Order Now
            </button>

            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-transparent text-white transition-colors hover:bg-white/10"
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {showSearch && onSearchChange && (
        <div
          className="sticky top-[92px] z-40 border-b border-stone-200 bg-white px-4 py-3"
          data-testid="search-bar"
          ref={searchContainerRef}
        >
          <div className="mx-auto max-w-7xl">
            <div className="relative">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Search dishes..."
                  value={localSearch}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onFocus={() => {
                    if (!localSearch.trim()) {
                      return;
                    }
                    const filtered = menuItems
                      .filter((item) => item.name.toLowerCase().includes(localSearch.toLowerCase()))
                      .slice(0, 5);
                    setSuggestions(filtered);
                    setShowSuggestions(filtered.length > 0);
                  }}
                  className="flex-1 rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm text-black placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#8B1538] sm:py-3"
                  style={{ fontFamily: 'Manrope, sans-serif' }}
                  data-testid="search-input"
                />
                <button
                  type="button"
                  onClick={() => setShowSuggestions(false)}
                  className="flex items-center gap-2 rounded-lg bg-[#8B1538] px-4 py-2.5 font-semibold text-white transition-all hover:bg-[#6B0F2C] sm:py-3"
                >
                  <Search size={18} />
                  <span className="hidden sm:inline">Search</span>
                </button>
              </div>

              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full z-50 mt-2 rounded-lg border border-stone-200 bg-white shadow-lg">
                  {suggestions.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 border-b px-4 py-3 last:border-0 hover:bg-stone-50"
                    >
                      <img
                        src={item.image_url || 'https://via.placeholder.com/40'}
                        alt={item.name}
                        className="h-10 w-10 rounded-lg object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-stone-800">{item.name}</p>
                        <p className="text-xs text-stone-500">â‚¹{item.price}</p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToCart?.(item);
                        }}
                        className="flex shrink-0 items-center gap-1 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-bold text-white transition-all hover:bg-green-700 active:scale-95"
                      >
                        <Plus size={14} />
                        Add
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
