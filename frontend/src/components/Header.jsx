import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, Plus, Menu, X } from 'lucide-react';
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const searchContainerRef = useRef(null);
  const isHomePage = location.pathname === '/';

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

  useEffect(() => {
    const handleScroll = () => {
      if (location.pathname !== '/') {
        setIsScrolled(true);
        return;
      }

      const heroSection = document.getElementById('home');

      if (!heroSection) {
        setIsScrolled(window.scrollY > 16);
        return;
      }

      const navbarHeight = 88;
      const heroScrollThreshold = Math.max(heroSection.offsetHeight - navbarHeight, 0);
      setIsScrolled(window.scrollY >= heroScrollThreshold);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [location.pathname]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!mobileMenuOpen) {
      document.body.style.overflow = '';
      return undefined;
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [mobileMenuOpen]);

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

  const isActivePath = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  const handleNavigate = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header
        className={`z-50 border-b transition-all duration-300 ${
          isHomePage && !isScrolled
            ? 'fixed inset-x-0 top-0 border-transparent bg-transparent shadow-none'
            : 'sticky top-0'
        } ${
          isScrolled
            ? 'border-[#D6A64A]/20 bg-[#6B0F2B]/95 shadow-[0_18px_45px_rgba(37,19,22,0.22)] backdrop-blur-xl'
            : ''
        }`}
        data-testid="header"
      >
        <div className="mx-auto flex min-h-[88px] max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex shrink-0 items-center gap-3 pr-2 transition-opacity hover:opacity-95"
          >
            <img
              src={LOGO_URL}
              alt="Sangameshwar"
              className="h-14 w-auto object-contain sm:h-16 lg:h-[72px]"
            />
            <div className="hidden text-left md:block">
              <p className="text-[11px] font-bold uppercase tracking-[0.35em] text-[#F6D78B]">
                Sangameshwar
              </p>
              <p className="mt-1 text-sm font-medium text-white">
                Cafe and family dining
              </p>
            </div>
          </button>

          <nav className="hidden items-center gap-8 border-l border-r border-white/10 px-6 py-2 lg:flex">
            {navItems.map((item) => {
              const isActive = isActivePath(item.path);

              return (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => handleNavigate(item.path)}
                  className={`relative px-0 py-3 text-sm font-semibold uppercase tracking-[0.12em] transition-all ${
                    isActive
                      ? 'text-[#d6ae50]'
                      : 'text-white hover:text-white'
                  }`}
                >
                  {item.label}
                  <span
                    className={`absolute bottom-1 left-0 h-[2px] bg-[#d6ae50] transition-all duration-300 ${
                      isActive ? 'w-full' : 'w-0'
                    }`}
                  />
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => handleNavigate('/menu')}
              className="hidden min-h-[48px] border border-[#d6ae50] bg-[#d6ae50] px-6 text-sm font-bold uppercase tracking-[0.08em] text-[#40191D] transition-transform hover:-translate-y-0.5 sm:inline-flex sm:items-center sm:justify-center"
            >
              Order Now
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="inline-flex h-11 w-11 items-center justify-center border border-white/15 bg-transparent text-white transition-colors hover:bg-white/10 lg:hidden"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden" data-testid="mobile-menu">
          <button
            type="button"
            className="absolute inset-0 bg-[#19090d]/70 backdrop-blur-sm"
            aria-label="Close mobile menu overlay"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="absolute right-0 top-0 flex h-full w-full max-w-sm flex-col overflow-y-auto border-l border-[#D6A64A]/20 bg-[linear-gradient(180deg,#7E1434_0%,#561027_100%)] px-5 pb-6 pt-5 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <button
                type="button"
                onClick={() => handleNavigate('/')}
                className="flex items-center gap-3"
              >
                <img
                  src={LOGO_URL}
                  alt="Sangameshwar"
                  className="h-12 w-auto object-contain"
                />
                <div className="text-left">
                  <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#F6D78B]">
                    Sangameshwar
                  </p>
                  <p className="mt-1 text-sm text-white/78">Cafe and family dining</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex h-11 w-11 items-center justify-center border border-white/15 bg-transparent text-white"
                aria-label="Close mobile menu"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-6 border border-white/10 bg-white/5">
              {navItems.map((item) => {
                const isActive = isActivePath(item.path);

                return (
                  <button
                    key={item.path}
                    type="button"
                    onClick={() => handleNavigate(item.path)}
                    className={`flex w-full items-center justify-between border-b border-white/10 px-4 py-4 text-left transition-all last:border-b-0 ${
                      isActive
                        ? 'bg-[#d6ae50] text-[#40191D]'
                        : 'text-white hover:bg-white/10'
                    }`}
                  >
                    <span className="text-sm font-bold uppercase tracking-[0.16em]">
                      {item.label}
                    </span>
                    <span className="text-lg leading-none">{isActive ? '■' : '›'}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 border border-[#D6A64A]/18 bg-black/15 p-5 text-white/86">
              <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#F6D78B]">
                Order online
              </p>
              <p className="mt-3 text-sm leading-6">
                Open the menu and place your order quickly.
              </p>
              <button
                type="button"
                onClick={() => handleNavigate('/menu')}
                className="mt-5 inline-flex w-full items-center justify-center border border-[#d6ae50] bg-[#d6ae50] px-5 py-4 text-sm font-bold uppercase tracking-[0.12em] text-[#40191D]"
              >
                Order Now
              </button>
            </div>
          </div>
        </div>
      )}

      {showSearch && onSearchChange && (
        <div
          className="sticky top-[88px] z-40 border-b border-stone-200 bg-white px-4 py-3"
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
