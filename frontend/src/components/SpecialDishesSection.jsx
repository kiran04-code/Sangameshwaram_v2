import React from "react";
import { useNavigate } from "react-router-dom";

/**
 * Stripped-back geometric Icon
 */
const VegStatusIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="0.5" y="0.5" width="11" height="11" stroke="#166534" />
    <circle cx="6" cy="6" r="3" fill="#166534" />
  </svg>
);

/**
 * Geometric, architectural Showcase Section.
 * Completely stripped of traditional rounding or soft overlays.
 */
export default function GeometricDishesSection({ dishes = [] }) {
  const navigate = useNavigate();

  if (!dishes.length) {
    return null;
  }

  // Define a distinct geometric flow (3 items example)
  // This layout creates an asymmetrical, architectural visual path.
  const visualFlow = [
    "md:col-span-2 md:row-span-2", // Item 1: Dominant Anchor
    "md:col-span-1 md:row-span-1", // Item 2: Small Square
    "md:col-span-1 md:row-span-1", // Item 3: Symmetrical Block
  ];

  return (
    <section className="relative bg-[#FCFBF7] py-24 lg:py-32 overflow-hidden font-sans">
      
      {/* Background: Geometric Skew Pattern (Minimalist and dynamic) */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-[#E5DCC5]/10" 
           style={{ clipPath: 'polygon(20% 0%, 100% 0%, 100% 100%, 0% 100%)' }} />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        
        {/* --- SHARP & REDUCED HEADER --- */}
        <header className="mb-20 grid grid-cols-1 md:grid-cols-[1fr_auto] items-end gap-10 border-b border-black/5 pb-12">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="h-px w-6 bg-[#8B1538]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#8B1538]">
                Chef's Edit
              </span>
            </div>
            
            <h2 className="font-serif text-5xl lg:text-7xl font-light leading-[1.1] text-[#1A1516]">
              Modern <span className="italic font-normal text-[#D6A64A]">Refinement.</span>
              <span className="block mt-2">Authentic Spirit.</span>
            </h2>
          </div>

          <button
            onClick={() => navigate("/menu")}
            className="group flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.3em] text-[#1A1516] border-b border-black/10 pb-2 hover:border-[#8B1538]"
          >
            Explore the Edit
            <span className="w-6 h-px bg-[#D6A64A] transition-all group-hover:w-10" />
          </button>
        </header>

        {/* --- GEOMETRIC FLOW MASONRY GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:auto-rows-[290px]">
          {dishes.map((item, index) => (
            <article 
              key={item.name} 
              className={`relative group bg-white border border-black/5 flex flex-col transition-shadow duration-500 hover:shadow-xl ${visualFlow[index % visualFlow.length]}`}
            >
              
              {/* Image Container: High fixed aspect, No curve masking */}
              <div className="relative aspect-[3/4] md:aspect-auto md:flex-1 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                
                {/* Simplified Price Corner */}
                <div className="absolute top-0 right-0 bg-[#1A1516] p-4 text-center">
                  <p className="text-white font-serif text-2xl font-normal">₹{item.price}</p>
                </div>
              </div>

              {/* Text Area: Simple, structured grid (Inter font for meta) */}
              <div className="p-8 flex-none grid grid-cols-1 gap-5 border-t border-black/5">
                <div className="flex justify-between items-start gap-4">
                    <div className="flex items-center gap-3">
                      <VegStatusIcon />
                      <h3 className="font-serif text-3xl font-normal text-[#1A1516] leading-none">
                        {item.name}
                      </h3>
                    </div>
                    <span className="shrink-0 text-[10px] font-bold text-[#8B1538]/70 tracking-widest font-sans">
                       ★ 4.3 
                    </span>
                </div>

                <p className="text-sm leading-relaxed text-[#5C5452] font-light italic font-serif">
                  {item.description ||
                    "A curated blend of refined spices, simmered to perfection for a premium experience."}
                </p>

                {/* Streamlined sharp button */}
                <button className="relative w-full flex items-center justify-center gap-4 bg-white hover:bg-[#8B1538] hover:text-white py-4 text-[11px] font-bold uppercase tracking-[0.35em] text-[#1A1516] transition-colors duration-500 border border-black/10">
                  Add to Meal
                  <span className="w-6 h-px bg-[#D6A64A] transition-all group-hover:w-10 group-hover:bg-[#FCFBF7]" />
                </button>
              </div>

            </article>
          ))}
        </div>

      </div>
    </section>
  );
}