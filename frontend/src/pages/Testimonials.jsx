import React, { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';

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
  
  const { scrollXProgress } = useScroll({ 
    container: scrollRef,
    offset: ["start start", "end end"]
  });

  const scaleX = useSpring(scrollXProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Moves the gold diamond along the track
  const diamondPosition = useTransform(scrollXProgress, [0, 1], ["0%", "100%"]);

  return (
    <section className="py-24 bg-[#FFFBF2] overflow-hidden relative">
      {/* Background Decorative Motif */}
      <div className="absolute top-0 right-0 w-64 h-64 opacity-5 pointer-events-none">
        <svg viewBox="0 0 100 100" fill="#8B1538"><path d="M50 0 L100 50 L50 100 L0 50 Z" /></svg>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-[1px] w-12 bg-[#D6A64A]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-[#8B1538]">Testimonials</span>
            </div>
            <h2 className="text-4xl md:text-7xl font-bold text-[#1A1516] tracking-tight font-serif">
              Voices of the <span className="text-[#8B1538] italic font-light">Patrons</span>
            </h2>
          </div>
          
          <div className="hidden md:flex flex-col items-end gap-2 text-[#D6A64A]">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Navigate the Scroll</span>
            <div className="flex gap-2">
               <span className="animate-pulse">←</span>
               <div className="h-[1px] w-12 bg-[#D6A64A] self-center" />
               <span className="animate-pulse">→</span>
            </div>
          </div>
        </div>

        {/* The Horizontal Scroll Container */}
        <div 
          ref={scrollRef}
          className="flex gap-10 overflow-x-auto pb-16 no-scrollbar snap-x snap-mandatory touch-pan-x"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {reviews.map((item) => (
            <motion.div
              key={item.id}
              className="min-w-[320px] md:min-w-[500px] snap-center"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="bg-white p-10 md:p-14 border border-[#D6A64A]/20 shadow-[20px_20px_60px_rgba(139,21,56,0.05)] relative flex flex-col h-full group">
                
                {/* Decorative Corner Filigree */}
                <div className="absolute top-4 left-4 w-8 h-8 border-t border-l border-[#D6A64A]/40" />
                <div className="absolute bottom-4 right-4 w-8 h-8 border-b border-r border-[#D6A64A]/40" />

                {/* Profile Medallion */}
                <div className="flex justify-between items-start mb-10">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#FFFBF2] ring-2 ring-[#D6A64A] shadow-xl">
                      <img src={item.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" />
                    </div>
                    {/* Royal Badge Overlay */}
                    <div className="absolute -bottom-1 -right-1 bg-[#8B1538] border border-[#D6A64A] text-[#F5D38B] p-1.5 rounded-full shadow-lg">
                      <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                    </div>
                  </div>
                  <span className="text-[#D6A64A]/20 font-serif text-8xl leading-none italic">“</span>
                </div>

                <blockquote className="text-xl md:text-2xl text-[#2D1B1E] font-serif italic leading-relaxed flex-1 mb-10">
                  {item.quote}
                </blockquote>

                <div className="pt-8 border-t border-[#D6A64A]/10 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-[#1A1516] uppercase tracking-[0.2em] text-sm">{item.name}</h4>
                    <p className="text-[#8B1538] font-bold text-[9px] uppercase tracking-[0.3em] mt-1">{item.role}</p>
                  </div>
                  <div className="h-8 w-8 opacity-10">
                    <svg viewBox="0 0 24 24" fill="#8B1538"><path d="M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8L12 2Z"/></svg>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* THE ROYAL TIMELINE TRACK */}
        <div className="mt-8 px-10 relative">
          {/* Background Rail */}
          <div className="h-[1px] w-full bg-[#D6A64A]/30 absolute top-1/2 -translate-y-1/2 left-0" />
          
          {/* Active Progress Line */}
          <motion.div 
            className="h-[1px] bg-[#8B1538] absolute top-1/2 -translate-y-1/2 left-0 z-10 origin-left"
            style={{ scaleX, width: '100%' }}
          />

          {/* The Traveling Diamond */}
          <motion.div 
            className="absolute top-1/2 -translate-y-1/2 z-30 flex items-center justify-center"
            style={{ left: diamondPosition }}
          >
            <div className="w-4 h-4 bg-[#8B1538] border-2 border-[#D6A64A] rotate-45 shadow-lg" />
          </motion.div>

          {/* Fixed Nodes */}
          <div className="relative flex justify-between">
            {reviews.map((_, i) => (
              <div 
                key={i} 
                className="w-2 h-2 rounded-full bg-[#FFFBF2] border border-[#D6A64A] z-20"
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default Testimonials;