import React, { useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";

/**
 * Geometric, architectural Veg Icon (Stripped-back Utility)
 */
const VegStatusIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="0.5" y="0.5" width="11" height="11" stroke="#166534" />
    <circle cx="6" cy="6" r="3" fill="#166534" />
  </svg>
);

/**
 * Dainty Dishes Showcase:
 * Re-imagined 'Heritage' layout. Keeps the centered focus and serif typography
 * from Image_4.png and the provided code, but changes text placement and color accents.
 */
export default function DaintyDishesShowcase({ dishes = [] }) {
  const [active, setActive] = useState(0);

  if (!dishes.length) return null;

  const dish = dishes[active];

  const nextDish = () => {
    setActive((prev) => (prev + 1) % dishes.length);
  };

  const prevDish = () => {
    setActive((prev) => (prev === 0 ? dishes.length - 1 : prev - 1));
  };

  return (
    <section className="relative overflow-hidden bg-[#FAF6F1] px-4 py-24 sm:px-6 lg:px-8 font-sans">
      
      {/* Background Graphic: Subtle Skew Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(214,166,74,0.05),transparent_40%)] pointer-events-none" />

      <div className="mx-auto max-w-7xl relative z-10">
        
        {/* --- HEADER --- */}
        <header className="mb-20 text-center max-w-4xl mx-auto">
            <div className="flex items-center gap-3 justify-center mb-6">
              <span className="h-px w-10 bg-[#D6A64A]/60" />
              <span 
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
                className="text-4xl md:text-5xl font-light text-[#2A1F19]"
              >
                Our Signature <span className="italic text-[#D6A64A]">Collection</span>
              </span>
              <span className="h-px w-10 bg-[#D6A64A]/60" />
            </div>

            <p 
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
              className="text-lg text-[#6D615C] italic leading-relaxed max-w-2xl mx-auto"
            >
              Every dish is a curated edit, bringing together traditional flavours with refined modern plating. Fresh ingredients, time-honoured methods, and a passion for flavour.
            </p>
        </header>

        {/* --- CENTRAL INTERFACE --- */}
        <div className="relative flex flex-col items-center">
          
          {/* Floral Motif Background: Updated Color to Gold */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] md:w-[600px] opacity-10 pointer-events-none">
            <svg viewBox="0 0 100 100" fill="#D6A64A" xmlns="http://www.w3.org/2000/svg">
               <path d="M50 0 C60 20, 90 30, 100 50 C90 70, 60 80, 50 100 C40 80, 10 70, 0 50 C10 30, 40 20, 50 0 Z M50 20 C55 35, 75 45, 80 50 C75 55, 55 65, 50 80 C45 65, 25 55, 20 50 C25 45, 45 35, 50 20 Z" />
            </svg>
          </div>

          {/* Navigation Arrows: Keeps the soft, subtle placement */}
          <button 
            onClick={prevDish}
            className="absolute left-[5%] md:left-[20%] top-[40%] md:top-[45%] -translate-y-1/2 z-30 h-11 w-11 rounded-full border border-black/10 bg-white flex items-center justify-center text-[#1A1516] transition hover:bg-[#8B1538] hover:text-white"
          >
            <ArrowLeft size={18} />
          </button>

          <button 
            onClick={nextDish}
            className="absolute right-[5%] md:right-[20%] top-[40%] md:top-[45%] -translate-y-1/2 z-30 h-11 w-11 rounded-full border border-black/10 bg-white flex items-center justify-center text-[#1A1516] transition hover:bg-[#8B1538] hover:text-white"
          >
            <ArrowRight size={18} />
          </button>

          {/* Main Dish Image: Focal point with specific shadow */}
          <div className="relative z-10 w-[280px] h-[280px] md:w-[480px] md:h-[480px]">
             <img 
               src={dish.image} 
               alt={dish.name}
               className="w-full h-full object-contain drop-shadow-[0_45px_70px_rgba(0,0,0,0.2)]"
             />
          </div>

          {/* Dish Details: Symmetrical text block replaces floating labels */}
          <div className="mt-16 text-center max-w-xl mx-auto relative z-10">
            <h4 className="font-serif italic text-3xl md:text-5xl text-[#2A1F19]/80 mb-6">
               Bite-Sized,<br className="md:hidden"/> Fluffy,<br className="md:hidden"/> Irresistible
            </h4>

            <h3 className="text-3xl md:text-5xl font-serif font-medium text-[#1A1516] mb-4">
              {dish.name}
            </h3>
            
            {/* Integrated Rating/Veg Icon */}
            <div className="flex items-center justify-center gap-6 mb-8 border-t border-[#D6A64A]/20 pt-8">
               <div className="flex items-center gap-3">
                 <VegStatusIcon />
                 <span className="text-[#8B1538] text-sm">4.3 ★</span>
               </div>
               <div className="h-4 w-px bg-[#D6A64A]/30" />
               <span className="font-serif italic text-[#8B1538] text-2xl">₹{dish.price}</span>
            </div>

            <p className="text-sm md:text-base text-[#6D615C] font-serif leading-relaxed italic mb-10 px-4">
              {dish.description || "A delicious traditional favourite prepared with rich spices, fresh ingredients, and our signature Taste."}
            </p>

            {/* Main CTA Button: Simplified and sharp */}
            <button className="relative w-full flex items-center justify-center gap-4 bg-[#1A1516] hover:bg-[#8B1538] py-5 text-[12px] font-bold uppercase tracking-[0.4em] text-white transition-colors rounded-sm shadow-xl border border-[#D6A64A]/30">
                Add to Meal
                <span className="w-8 h-px bg-[#D6A64A]" />
            </button>
          </div>

        </div>

        {/* View All Menu Footer CTA */}
        <footer className="mt-20 text-center border-t border-black/5 pt-12">
            <button 
              onClick={() => navigate('/menu')}
              className="group flex items-center justify-center gap-3 mx-auto text-[11px] font-bold uppercase tracking-widest text-[#1A1516] hover:text-[#8B1538] transition-colors"
            >
              <span className="flex items-center justify-center w-9 h-9 rounded-full border border-black/10 group-hover:border-[#8B1538] transition-all">
                <ArrowUpRight size={16} />
              </span>
              View Full Menu
            </button>
        </footer>
        
      </div>
    </section>
  );
}


