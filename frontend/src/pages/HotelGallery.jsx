import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Data representing the Royal Collection. 
 * The 'span' property controls the Bento Grid layout.
 */
const albumItems = [
  { 
    id: 1, 
    category: "Suites", 
    title: "Royal Heritage Suite", 
    span: "md:col-span-2 md:row-span-2", 
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80",
    arch: "rounded-t-full" // Traditional Palace Window
  },
  { 
    id: 2, 
    category: "Dining", 
    title: "The Imperial Kitchen", 
    span: "md:col-span-2 md:row-span-1", 
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80",
    arch: "rounded-tr-[100px]"
  },
  { 
    id: 3, 
    category: "Ambiance", 
    title: "Evening Courtyard", 
    span: "md:col-span-1 md:row-span-1", 
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80",
    arch: "rounded-bl-[60px]"
  },
  { 
    id: 4, 
    category: "Events", 
    title: "Grand Ballroom", 
    span: "md:col-span-1 md:row-span-1", 
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80",
    arch: "rounded-br-[60px]"
  },
];

const categories = ["All", "Suites", "Dining", "Ambiance", "Events"];

const HotelGallery = () => {
  const [filter, setFilter] = useState("All");

  const filteredItems = filter === "All" 
    ? albumItems 
    : albumItems.filter((item) => item.category === filter);

  return (
    <section className="relative py-24 bg-[#FFFBF2] overflow-hidden min-h-screen">
      {/* Decorative Background Element (Mandala Watermark) */}
      <div className="absolute -right-24 -top-24 w-96 h-96 opacity-[0.03] pointer-events-none">
        <svg viewBox="0 0 100 100" fill="#8B1538">
          <path d="M50 0 L60 40 L100 50 L60 60 L50 100 L40 60 L0 50 L40 40 Z" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* --- HEADER SECTION --- */}
        <header className="mb-20">
          <div className="flex flex-col md:flex-row justify-between items-end gap-10">
            <div className="max-w-2xl text-center md:text-left w-full md:w-auto">
              <div className="flex items-center gap-3 mb-4 justify-center md:justify-start">
                <div className="h-[1px] w-12 bg-[#D6A64A]" />
                <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-[#8B1538]">
                  The Imperial Portfolio
                </span>
              </div>
              <h2 className="text-4xl md:text-7xl font-bold text-[#1A1516] font-serif leading-tight">
                Glimpses of <span className="italic text-[#8B1538]">Grandeur</span>
              </h2>
            </div>

            {/* Antique Filter Navigation */}
            <nav className="flex flex-wrap justify-center md:justify-end gap-8 border-b border-[#D6A64A]/20 pb-4 w-full md:w-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`text-[11px] font-bold uppercase tracking-[0.3em] transition-all relative pb-2 outline-none ${
                    filter === cat ? "text-[#8B1538]" : "text-gray-400 hover:text-[#D6A64A]"
                  }`}
                >
                  {cat}
                  {filter === cat && (
                    <motion.div 
                      layoutId="activeFilterLine" 
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#8B1538]" 
                    />
                  )}
                </button>
              ))}
            </nav>
          </div>
        </header>

        {/* --- ARCHED HERITAGE GRID --- */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-4 gap-8 auto-rows-[300px]">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.7, ease: [0.43, 0.13, 0.23, 0.96] }}
                className={`relative group cursor-pointer overflow-hidden border-4 border-white shadow-2xl ${item.span} ${item.arch}`}
              >
                {/* Visual Treatment: Sepia to Color on Hover */}
                <div className="absolute inset-0 z-0">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 sepia-[30%] group-hover:sepia-0" 
                  />
                  {/* Royal Vignette Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1516] via-[#1A1516]/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                </div>

                {/* Heritage Seal (The 'Certified' Detail) */}
                <div className="absolute top-6 right-6 z-20">
                  <div className="flex flex-col items-center justify-center w-12 h-12 rounded-full border border-[#D6A64A]/50 bg-[#8B1538]/30 backdrop-blur-md transform rotate-12 group-hover:rotate-0 transition-transform duration-500">
                    <span className="text-[#F5D38B] text-[7px] font-bold uppercase tracking-tighter">Est.</span>
                    <span className="text-[#F5D38B] text-[10px] font-black italic">2016</span>
                  </div>
                </div>

                {/* Content Layer */}
                <div className="absolute inset-0 p-8 flex flex-col justify-end z-10 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-[1px] w-6 bg-[#D6A64A]" />
                    <span className="text-[#D6A64A] text-[10px] font-bold uppercase tracking-[0.3em]">
                      {item.category}
                    </span>
                  </div>
                  <h3 className="text-white text-2xl md:text-3xl font-serif font-bold tracking-wide group-hover:text-[#F5D38B] transition-colors leading-tight">
                    {item.title}
                  </h3>
                </div>

                {/* Decorative Corner Bracket on Hover */}
                <div className="absolute bottom-6 right-6 w-8 h-8 border-b border-r border-[#F5D38B] opacity-0 group-hover:opacity-100 transition-all duration-700 translate-x-4 translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0" />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* --- FOOTER CALLIGRAPHY --- */}
        <footer className="mt-20 text-center">
          <div className="inline-block relative">
            <p className="text-[#6D6163] font-serif italic text-lg px-10">
              "Every frame captured is a tribute to the legacy of Sangameshwar."
            </p>
            {/* Flourish Lines */}
            <div className="absolute -left-4 top-1/2 -translate-y-1/2 h-px w-8 bg-[#D6A64A]/30" />
            <div className="absolute -right-4 top-1/2 -translate-y-1/2 h-px w-8 bg-[#D6A64A]/30" />
          </div>
          <div className="mt-6 flex justify-center">
            <div className="flex gap-1">
              <div className="h-1 w-1 rounded-full bg-[#D6A64A]" />
              <div className="h-1 w-12 rounded-full bg-gradient-to-r from-[#D6A64A] to-transparent" />
            </div>
          </div>
        </footer>
        
      </div>
    </section>
  );
};

export default HotelGallery;