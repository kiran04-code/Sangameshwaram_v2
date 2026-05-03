import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Clean & Refined Bento Grid Data
 * Spans are optimized for a 4-column desktop layout
 */
const albumItems = [
  { 
    id: 1, 
    category: "Suites", 
    title: "Royal Heritage Suite", 
    span: "md:col-span-2 md:row-span-2", 
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80",
    arch: "rounded-0" 
  },
  { 
    id: 2, 
    category: "Dining", 
    title: "The Imperial Kitchen", 
    span: "md:col-span-2 md:row-span-1", 
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80",
    arch: "rounded-0"
  },
  { 
    id: 3, 
    category: "Ambiance", 
    title: "Evening Courtyard", 
    span: "md:col-span-1 md:row-span-1", 
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80",
    arch: "rounded-0"
  },
  { 
    id: 4, 
    category: "Events", 
    title: "Grand Ballroom", 
    span: "md:col-span-1 md:row-span-1", 
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80",
    arch: "rounded-0"
  },
];

const categories = ["All", "Suites", "Dining", "Ambiance", "Events"];

const HotelGallery = () => {
  const [filter, setFilter] = useState("All");

  const filteredItems = filter === "All" 
    ? albumItems 
    : albumItems.filter((item) => item.category === filter);

  return (
    <section className="relative py-24 bg-[#FCF9F2] overflow-hidden min-h-screen font-sans">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
           style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/paper-fibers.png")` }} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* --- HEADER SECTION --- */}
        <header className="mb-16">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8">
            <div className="w-full md:w-auto text-left">
              <div className="flex items-center gap-3 mb-3">
                <span className="h-[1px] w-8 bg-[#8B1538]" />
                <span
                  style={{ fontFamily: "Cormorant Garamond, serif" }}
                  className="text-[28px] italic leading-none text-[#5f6476] md:text-[34px]"
                >
                  Curated Collection
                </span>
              </div>
              <h3 className="text-5xl md:text-6xl  text-[#1A1516] font-serif">
                Moments of <span className="  text-[#731a34]">Elegance</span>
              </h3>
            </div>

          </div>
        </header>

        {/* --- REFINED BENTO GRID --- */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[280px]">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className={`relative group cursor-pointer overflow-hidden shadow-sm hover:shadow-2xl transition-shadow duration-500 ${item.span} ${item.arch}`}
              >
                {/* Image Component */}
                <div className="absolute inset-0 z-0">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                  />
                  {/* Subtle Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                </div>

                {/* Content Overlay */}
                <div className="absolute inset-0 p-8 flex flex-col justify-end z-10">
                  <motion.div 
                    initial={false}
                    className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500"
                  >
                    <p className="text-[#D6A64A] text-[9px] font-bold uppercase tracking-[0.4em] mb-2">
                      {item.category}
                    </p>
                    <h3 className="text-white text-xl md:text-2xl font-serif tracking-wide leading-tight">
                      {item.title}
                    </h3>
                  </motion.div>
                  
                  {/* Minimal Reveal Line */}
                  <div className="w-0 group-hover:w-12 h-[1px] bg-[#D6A64A] mt-4 transition-all duration-700" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* --- FOOTER --- */}
        <footer className="mt-20 flex flex-col items-center">
          <p className="text-[#1A1516]/50 font-serif italic text-base tracking-wide">
            Experience the legacy of refined hospitality.
          </p>
          <div className="mt-8 w-24 h-px bg-gradient-to-r from-transparent via-[#D6A64A] to-transparent" />
        </footer>
        
      </div>
    </section>
  );
};

export default HotelGallery;
