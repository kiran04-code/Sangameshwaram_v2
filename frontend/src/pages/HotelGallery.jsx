import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const albumItems = [
  { id: 1, category: "Suites", title: "Royal Heritage Suite", span: "md:col-span-2 md:row-span-2", image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80" },
  { id: 2, category: "Dining", title: "Authentic Kitchen", span: "md:col-span-2 md:row-span-1", image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80" },
  { id: 3, category: "Ambiance", title: "Evening Courtyard", span: "md:col-span-1 md:row-span-1", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80" },
  { id: 4, category: "Events", title: "Grand Ballroom", span: "md:col-span-1 md:row-span-1", image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80" },
];

const HotelGallery = () => {
  const [filter, setFilter] = useState("All");
  const categories = ["All", "Suites", "Dining", "Ambiance", "Events"];

  const filteredItems = filter === "All" ? albumItems : albumItems.filter((item) => item.category === filter);

  return (
    <section className="py-12 px-4 md:px-16  min-h-screen">
      <div className="max-w-7xl mx-auto  l overflow-hidden border">
        
        {/* --- ALL-IN-ONE BRANDED HEADER --- */}
        <div className="p-8 md:p-12 border-b ">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-6">
            
              <div className="space-y-1">
                <h4 className="text-[#A11A43] font-black text-[10px] uppercase tracking-[0.4em]">The Premium Collection</h4>
                <h2 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight">
                  Discover the <span className="text-gray-400">Authentic</span> <br />
                  Taste of <span className="text-[#A11A43]">Sangameshwar</span>
                </h2>
              </div>
            </div>

            {/* Pill Filters */}
            
          </div>
        </div>

        {/* --- 4-IMAGE UNIQUE BENTO GRID --- */}
        <div className="p-8 md:p-12">
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[250px]"
          >
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={`relative group cursor-pointer overflow-hidden rounded-[32px] border border-gray-100 ${item.span}`}
                >
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  
                  {/* Swiggy-Style Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                  {/* Verified Tag from reference */}
                  <div className="absolute top-5 right-5 px-3 py-1 rounded-lg bg-white/20 backdrop-blur-md border border-white/30 text-white text-[9px] font-bold">
                    Verified
                  </div>

                  <div className="absolute inset-0 p-8 flex flex-col justify-end">
                    <span className="inline-block px-2 py-1 rounded-md bg-[#A11A43] text-white text-[8px] font-black uppercase mb-2 self-start">
                      {item.category}
                    </span>
                    <h3 className="text-white text-xl md:text-2xl font-bold tracking-tight">{item.title}</h3>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* --- INTEGRATED FOOTER --- */}
       
      </div>
    </section>
  );
};

export default HotelGallery;