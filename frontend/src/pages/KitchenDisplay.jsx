import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Clock, ShieldCheck, Zap, User, Armchair } from 'lucide-react';
import { PremiumAdPanel } from '../components/AdPanels';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api/admin`;
const LOGO_URL = 'https://customer-assets.emergentagent.com/job_menu-hub-dine/artifacts/w81h57nj_image.png';

const KitchenDisplay = () => {
  const [preparingOrders, setPreparingOrders] = useState([]);
  const [readyOrders, setReadyOrders] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [carouselImages, setCarouselImages] = useState([]);

  const fetchOrders = useCallback(async () => {
    try {
      const [preparingRes, readyRes] = await Promise.all([
        axios.get(`${API}/orders?status=preparing`),
        axios.get(`${API}/orders?status=ready`)
      ]);
      setPreparingOrders(preparingRes.data);
      setReadyOrders(readyRes.data);
    } catch (error) {
      console.error('Fetch Error:', error);
    }
  }, []);

  const fetchCarouselImages = useCallback(async () => {
    try {
      const response = await axios.get(`${API}/offers`);
      const offersData = response.data.data || response.data;
      if (offersData && offersData.length > 0) {
        const firstOffer = offersData[0];
        let existingImages = Array.isArray(firstOffer.carousel_images) ? firstOffer.carousel_images : [];
        existingImages = existingImages.map(url => 
          url.startsWith('http') || url.startsWith('blob:') ? url : `${BACKEND_URL}${url}`
        );
        setCarouselImages(existingImages);
      }
    } catch (error) {
      console.error('Error fetching carousel images:', error);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    fetchCarouselImages();
    const interval = setInterval(fetchOrders, 5000);
    const carouselInterval = setInterval(fetchCarouselImages, 10000);
    const timeInterval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => {
      clearInterval(interval);
      clearInterval(carouselInterval);
      clearInterval(timeInterval);
    };
  }, [fetchOrders, fetchCarouselImages]);

  // Premium Tile Component
  const OrderTile = ({ order, isReady }) => (
    <div className={`
      relative w-full mb-3 p-4 flex items-center gap-4
      bg-white border-l-[4px] ${isReady ? 'border-[#C5A059] shadow-[0_4px_12px_rgba(139,21,56,0.2)]' : 'border-[#8B1538] shadow-[0_4px_12px_rgba(139,21,56,0.15)]'}
      transition-all duration-300 rounded-r-md animate-slide-in hover:shadow-[0_6px_16px_rgba(139,21,56,0.25)]
    `}>
      <div className="flex items-center gap-3 flex-1">
        <div className="p-2 bg-[#8B1538]/10 rounded-full flex-shrink-0 animate-pulse-slow">
          <User size={18} className="text-[#8B1538]" />
        </div>
        <div className="min-w-0">
          <p className="text-base font-bold text-[#8B1538] truncate">
            {order.customer_name || 'Guest'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-shrink-0 animate-bounce-subtle">
        <div className="p-2 bg-[#8B1538]/10 rounded-full">
          <Armchair size={18} className="text-[#8B1538]" />
        </div>
        <div>
          <p className="text-base font-bold text-[#8B1538]">
            T{order.table_number || 'NA'}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen w-screen flex flex-col bg-white text-[#1A1A1A] overflow-hidden select-none">
      
      {/* HEADER */}
      <header className="h-24 bg-[#8B1538] flex items-center justify-between px-12 border-b-[6px] border-[#C5A059] shadow-2xl relative z-20">
        <div className="flex items-center gap-8">
          <img src={LOGO_URL} alt="Logo" className="h-16 w-16 grayscale-0 border border-white/10" />
          <div className="h-12 w-[1px] bg-white/20"></div>
          <div>
            <h1 className="text-white text-4xl font-serif tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              The Sangameshwaram
            </h1>
            <p className="text-[#C5A059] text-[10px] uppercase tracking-[0.4em] font-bold mt-1">Live Order Intelligence</p>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <div className="flex items-center gap-3 text-white">
            <Clock size={20} className="text-[#C5A059]" />
            <span className="text-3xl font-light tracking-tighter tabular-nums">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
            </span>
          </div>
          <span className="text-white/40 text-[9px] uppercase tracking-widest mt-1">System Synchronized</span>
        </div>
      </header>

      {/* THREE-PANEL GRID */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* PREPARING */}
        <div className="w-[28%] bg-[#F5F5F5] border-r border-[#8B1538]/20 flex flex-col">
          <div className="h-16 bg-[#8B1538] flex items-center justify-between px-8 border-b-2 border-[#C5A059]">
            <h2 className="text-white text-sm font-black uppercase tracking-[0.3em]">Preparing</h2>
            <span className="bg-white text-[#8B1538] px-3 py-0.5 text-xs font-bold rounded">{preparingOrders.length}</span>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-3">
            {preparingOrders.map(order => (
              <OrderTile key={order._id} order={order} isReady={false} />
            ))}
          </div>
        </div>

        {/* READY */}
        <div className="w-[28%] bg-[#F5F5F5] border-r border-[#8B1538]/20 flex flex-col">
          <div className="h-16 bg-[#C5A059] flex items-center justify-between px-8 border-b-2 border-[#8B1538]">
            <h2 className="text-[#8B1538] text-sm font-black uppercase tracking-[0.3em]">Ready</h2>
            <span className="bg-[#8B1538] text-white px-3 py-0.5 text-xs font-bold rounded">{readyOrders.length}</span>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-3 bg-[#F5F5F5]">
            {readyOrders.map(order => (
              <OrderTile key={order._id} order={order} isReady={true} />
            ))}
          </div>
        </div>

        {/* AD PANEL */}
        <PremiumAdPanel carouselImages={carouselImages} />
      </div>

      {/* FOOTER */}
      <footer className="h-10 bg-[#8B1538] border-t-2 border-[#C5A059] flex items-center justify-between px-12">
        <div className="flex gap-8">
          <div className="flex items-center gap-2">
            <ShieldCheck size={12} className="text-[#C5A059]" />
            <span className="text-[9px] font-bold uppercase text-white tracking-widest">Secured Node</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap size={12} className="text-[#C5A059]" />
            <span className="text-[9px] font-bold uppercase text-white tracking-widest">Real-time Stream: Active</span>
          </div>
        </div>
        <div className="text-[9px] font-bold text-white/70 uppercase tracking-[0.2em]">
          The Sangameshwaram &copy; 2026 
        </div>
      </footer>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #8B1538; border-radius: 2px; }
        
        @keyframes ready-glow {
          0%, 100% { box-shadow: 0 0 5px rgba(139, 21, 56, 0.3); opacity: 1; }
          50% { box-shadow: 0 0 15px rgba(139, 21, 56, 0.6); opacity: 0.95; }
        }

        .ready-badge-glow {
          animation: ready-glow 2s ease-in-out infinite;
          border: 1px solid rgba(139,21,56,0.3);
        }

        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-slide-in {
          animation: slide-in 0.4s ease-out;
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }

        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }

        .animate-bounce-subtle {
          animation: bounce-subtle 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default KitchenDisplay;