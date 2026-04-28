import React, { useState, useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

const reviews = [
  {
    id: 1,
    name: "Arjun Malhotra",
    role: "Business Traveler",
    quote: "The Sangameshwar thali isn't just a meal; it's a deep dive into authentic heritage.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80"
  },
  {
    id: 2,
    name: "Priya Sharma",
    role: "Food Critic",
    quote: "A premium, modern atmosphere that maintains traditional roots. Truly a hidden gem.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80"
  },
  {
    id: 3,
    name: "Vikram Sait",
    role: "Luxury Blogger",
    quote: "From the moment you walk in, the hospitality is warm and the flavors are incredibly bold.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80"
  },
  {
    id: 4,
    name: "Ananya Iyer",
    role: "Local Guide",
    quote: "Best breakfast in the city. The service makes you feel like royalty every single time.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80"
  }
];

const Testimonials = () => {
  const scrollRef = useRef(null);
  
  // Progress bar logic
  const { scrollXProgress } = useScroll({ container: scrollRef });
  const scaleX = useSpring(scrollXProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <section className="py-24 bg-[#FAFAFA] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter">
              GUEST <span className="text-[#A11A43] italic font-serif font-light">Timeline</span>
            </h2>
            <p className="text-gray-500 mt-4 font-medium text-lg">
              Swipe through the experiences of our most distinguished guests.
            </p>
          </div>
          
          <div className="hidden md:flex gap-4 text-[#A11A43] font-bold text-xs tracking-widest uppercase">
            <span>Scroll to explore</span>
            <span className="animate-bounce">→</span>
          </div>
        </div>

        {/* The Horizontal Scroll Container */}
        <div 
          ref={scrollRef}
          className="flex gap-8 overflow-x-auto pb-12 no-scrollbar snap-x snap-mandatory touch-pan-x"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {reviews.map((item) => (
            <motion.div
              key={item.id}
              className="min-w-[320px] md:min-w-[450px] snap-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="bg-white p-8 md:p-10 rounded-[32px] border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)] h-full flex flex-col">
                
                {/* Image and Rating */}
                <div className="flex justify-between items-start mb-8">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden ring-4 ring-[#A11A43]/5">
                      <img src={item.image} className="w-full h-full object-cover" alt="" />
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-[#FBBF24] text-white p-1.5 rounded-lg shadow-lg">
                      <svg width="12" height="12" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                    </div>
                  </div>
                  <span className="text-gray-200 font-serif text-6xl leading-none">“</span>
                </div>

                <p className="text-xl md:text-2xl text-gray-700 font-medium leading-relaxed italic flex-1 mb-8">
                  {item.quote}
                </p>

                <div className="pt-6 border-t border-gray-50 flex items-center gap-4">
                  <div>
                    <h4 className="font-black text-gray-900 uppercase tracking-tight">{item.name}</h4>
                    <p className="text-[#A11A43] font-bold text-[10px] uppercase tracking-widest">{item.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* THE TIMELINE BAR */}
        <div className="mt-12 relative">
          {/* Background Track */}
          <div className="h-[2px] w-full bg-gray-200 rounded-full absolute top-1/2 -translate-y-1/2" />
          
          {/* Active Progress (Maroon) */}
          <motion.div 
            className="h-[4px] bg-[#A11A43] rounded-full absolute top-1/2 -translate-y-1/2 z-10 origin-left"
            style={{ scaleX, width: '100%' }}
          />

          {/* Timeline Nodes */}
          <div className="relative flex justify-between px-2">
            {reviews.map((_, i) => (
              <div 
                key={i} 
                className="w-3 h-3 rounded-full bg-white border-2 border-gray-300 z-20 transition-colors duration-500"
                style={{ backgroundColor: i === 0 ? '#A11A43' : 'white' }} 
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default Testimonials;