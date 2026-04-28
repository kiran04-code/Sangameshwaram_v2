import React from 'react';
import { ChevronRight } from 'lucide-react';

const BestSellerAndPromo = () => {
  const bestSellers = [
    { id: 1, name: 'Sushi Roll', price: '103.0', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=600&fit=crop' },
    { id: 2, name: 'Butter Chicken', price: '50.0', image: 'https://images.unsplash.com/photo-1603894584202-933259a4a701?w=400&h=600&fit=crop' },
    { id: 3, name: 'Veg Lasagna', price: '12.99', image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&h=600&fit=crop' },
    { id: 4, name: 'Berry Cupcake', price: '8.20', image: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=400&h=600&fit=crop' },
    { id: 5, name: 'Margherita Pizza', price: '15.99', image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=600&fit=crop' },
    { id: 6, name: 'Grilled Salmon', price: '22.50', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=600&fit=crop' },
  ];

  return (
    <div className="w-full bg-[#FCFCFC] font-sans">
      
      {/* Best Seller Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-black text-stone-800 tracking-tight">Best Seller</h2>
        <button className="flex items-center gap-1 text-orange-500 font-bold text-sm hover:gap-2 transition-all">
          View All <ChevronRight size={16} strokeWidth={3} />
        </button>
      </div>

      {/* Vertical Best Seller Cards */}
      <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-10">
        {bestSellers.slice(0, 4).map((item) => (
          <div key={item.id} className="relative flex-shrink-0 group">
            {/* Image Container with high border-radius */}
            <div className="w-28 h-40 md:w-32 md:h-44 lg:w-36 lg:h-48 rounded-[2.5rem] overflow-hidden shadow-lg border border-stone-100">
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              {/* Dark Gradient overlay at bottom for price visibility */}
              <div className="absolute inset-0 from-black/40 via-transparent to-transparent opacity-60"></div>
            </div>
            
            {/* Price Badge - Floating at Bottom Right */}
            <div className="absolute bottom-3 right-1 bg-orange-500/90 backdrop-blur-md text-white text-[10px] font-black px-3 py-1.5 rounded-l-full shadow-lg border border-white/20">
              ₹{item.price}
            </div>
          </div>
        ))}
      </div>

      {/* Promotion Banner Card */}
      <div className="relative w-full rounded-[2.5rem] overflow-hidden bg-orange-600 shadow-2xl group cursor-pointer">
        <div className="flex h-48 md:h-56 lg:h-64">
          {/* Left Side: Text Content */}
          <div className="w-[55%] p-4 md:p-6 lg:p-8 flex flex-col justify-center relative z-10">
            <p className="text-white/80 text-xs font-bold uppercase tracking-widest mb-1 md:mb-2">Limited Offer</p>
            <h3 className="text-white text-base md:text-lg lg:text-xl font-bold leading-tight mb-2 md:mb-3">
              Experience our delicious new dish
            </h3>
            <div className="text-white">
               <span className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tighter">30% OFF</span>
            </div>
            
            {/* Decorative circles to match image */}
            <div className="absolute -top-6 -left-6 w-16 h-16 rounded-full border-4 border-yellow-400 opacity-40"></div>
            <div className="absolute -bottom-6 -left-2 w-12 h-12 rounded-full border-4 border-yellow-400 opacity-40"></div>
          </div>

          {/* Right Side: Image with Angled Cut */}
          <div className="w-[45%] relative overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&h=500&fit=crop" 
              alt="Promo Pizza" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 skew-x-[-12deg] -ml-6 bg-orange-600 z-0 origin-bottom opacity-0"></div>
          </div>
        </div>

        {/* Carousel Dots Indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
          <div className="w-6 h-1.5 bg-white rounded-full"></div>
          <div className="w-1.5 h-1.5 bg-white/40 rounded-full"></div>
          <div className="w-1.5 h-1.5 bg-white/40 rounded-full"></div>
          <div className="w-1.5 h-1.5 bg-white/40 rounded-full"></div>
        </div>
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default BestSellerAndPromo;
