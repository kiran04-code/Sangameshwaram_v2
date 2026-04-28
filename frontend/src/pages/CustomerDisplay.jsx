import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { Sparkles } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;
const LOGO_URL = 'https://customer-assets.emergentagent.com/job_menu-hub-dine/artifacts/w81h57nj_image.png';

const CustomerDisplay = () => {
  const { t } = useTranslation();
  const [preparingOrders, setPreparingOrders] = useState([]);
  const [readyOrders, setReadyOrders] = useState([]);
  const [combos, setCombos] = useState([]);
  const [posters, setPosters] = useState([]);
  const [currentPoster, setCurrentPoster] = useState(0);

  useEffect(() => {
    fetchOrders();
    fetchCombos();
    fetchPosters();
    const interval = setInterval(fetchOrders, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (posters.length > 1) {
      const posterInterval = setInterval(() => {
        setCurrentPoster(prev => (prev + 1) % posters.length);
      }, 5000);
      return () => clearInterval(posterInterval);
    }
  }, [posters]);

  const fetchOrders = async () => {
    try {
      const [preparingRes, readyRes] = await Promise.all([
        axios.get(`${BACKEND_URL}/api/orders?status=preparing`),
        axios.get(`${BACKEND_URL}/api/orders?status=ready`)
      ]);
      
      setPreparingOrders(preparingRes.data);
      setReadyOrders(readyRes.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchCombos = async () => {
    try {
      const response = await axios.get(`${API}/combos`);
      setCombos(response.data);
    } catch (error) {
      console.error('Error fetching combos:', error);
    }
  };

  const fetchPosters = async () => {
    try {
      const response = await axios.get(`${API}/offer-posters?active_only=true`);
      setPosters(response.data);
    } catch (error) {
      console.error('Error fetching posters:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, #FFF5F7 0%, #FFFAF0 100%)' }}>
      {/* Decorative Corners */}
      <div className="mandala-corner top-left"></div>
      <div className="mandala-corner top-right"></div>
      <div className="mandala-corner bottom-left"></div>
      <div className="mandala-corner bottom-right"></div>

      {/* Header */}
      <header className="indian-border bg-gradient-to-r from-[#8B1538] to-[#A0153E] px-6 py-6 relative z-10">
        <div className="text-center flex items-center justify-center gap-4">
          <img src={LOGO_URL} alt="Logo" className="w-16 h-16 rounded-full object-cover border-3 border-[#FFD700] shadow-xl" />
          <div>
            <h1 className="text-5xl font-black text-[#FFD700] mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>
              The Sangameshwaram Cafe
            </h1>
            <p className="text-white text-xl" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
              {t('tagline')}
            </p>
          </div>
        </div>
      </header>

      {/* Order Status Display */}
      <div className="flex-1 grid grid-cols-2 gap-6 p-6">
        {/* Currently Preparing */}
        <div className="glass-ivory rounded-3xl p-6">
          <div className="flex items-center justify-center gap-3 mb-6 pb-4 border-b-2 border-[#FFD700]">
            <Sparkles className="text-[#FFD700]" size={32} />
            <h2 className="text-3xl font-black text-[#8B1538]" style={{ fontFamily: 'Playfair Display, serif' }}>
              {t('currently_preparing')}
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {preparingOrders.length === 0 ? (
              <div className="col-span-2 text-center py-20">
                <p className="text-gray-400 text-xl">No orders being prepared</p>
              </div>
            ) : (
              preparingOrders.map(order => (
                <div key={order.id} className="premium-card bg-yellow-50">
                  <div className="text-center">
                    <span className="text-6xl font-black text-[#FFD700] inline-block px-6 py-3 bg-white rounded-2xl shadow-lg">
                      #{order.order_number}
                    </span>
                    <p className="text-sm text-gray-600 mt-2">Preparing your order...</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Ready for Pickup */}
        <div className="glass-ivory rounded-3xl p-6">
          <div className="flex items-center justify-center gap-3 mb-6 pb-4 border-b-2 border-green-500">
            <div className="text-5xl pulse-animation">🎉</div>
            <h2 className="text-3xl font-black text-green-600" style={{ fontFamily: 'Playfair Display, serif' }}>
              {t('ready_for_pickup')}
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {readyOrders.length === 0 ? (
              <div className="col-span-2 text-center py-20">
                <p className="text-gray-400 text-xl">No orders ready</p>
              </div>
            ) : (
              readyOrders.map(order => (
                <div key={order.id} className="premium-card bg-green-50 pulse-animation">
                  <div className="text-center">
                    <span className="text-6xl font-black text-green-600 inline-block px-6 py-3 bg-white rounded-2xl shadow-lg">
                      #{order.order_number}
                    </span>
                    <p className="text-lg font-bold text-green-700 mt-2">Ready! Please collect</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Offer Posters Carousel */}
      {posters.length > 0 && (
        <div className="px-6 pb-4" data-testid="offer-poster-carousel">
          <div className="glass-ivory rounded-3xl overflow-hidden relative" style={{ height: '200px' }}>
            {posters.map((poster, idx) => (
              <div
                key={poster.id}
                className="absolute inset-0 transition-opacity duration-700"
                style={{ opacity: idx === currentPoster ? 1 : 0 }}
              >
                {poster.image_url ? (
                  <img src={poster.image_url} alt={poster.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-[#8B1538] to-[#A0153E] flex items-center justify-center">
                    <div className="text-center">
                      <h3 className="text-4xl font-black text-[#FFD700] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>{poster.title}</h3>
                      <p className="text-white text-lg">{poster.description}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2 z-10">
              {posters.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPoster(idx)}
                  className={`w-3 h-3 rounded-full transition-all ${idx === currentPoster ? 'bg-[#FFD700] scale-125' : 'bg-white/50'}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Offers Ticker */}
      <div className="ticker-wrapper">
        <div className="ticker-content">
          {combos.map((combo, idx) => (
            <span key={combo.id}>
              <span className="diya-icon">🪔</span>
              <span className="font-black text-[#FFD700]">SPECIAL OFFER:</span> {combo.name} @ ₹{combo.price} (Save ₹{combo.savings}!)
              {idx < combos.length - 1 && <span className="diya-icon">🪔</span>}
            </span>
          ))}
          <span className="diya-icon">🪔</span>
          <span className="font-black text-[#FFD700]">IPL LIVE SCREENING!</span> Watch your favorite teams while enjoying our delicious food!
          <span className="diya-icon">🪔</span>
          <span className="font-black text-[#FFD700]">FREE DELIVERY</span> on orders above ₹500!
        </div>
      </div>
    </div>
  );
};

export default CustomerDisplay;
