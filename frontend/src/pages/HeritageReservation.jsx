import React from "react";
import { ArrowRight, MapPin, Clock } from "lucide-react";

const HeritageReservation = () => {
  return (
    <section className="relative overflow-hidden bg-[#FCFAF5] py-24 lg:py-32" data-testid="reservation-section">
      
      {/* --- BACKGROUND GRAPHIC: SYMMETRICAL SKEW --- */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-[#E5DCC5]/10 pointer-events-none" 
           style={{ clipPath: 'polygon(15% 0%, 100% 0%, 100% 100%, 0% 100%)' }} />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-start">

          {/* --- LEFT COLUMN: CLEAN FORM LEGER --- */}
          <div className="max-w-xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="h-px w-6 bg-[#8B1538]" />
              <span
                style={{ fontFamily: "Cormorant Garamond, serif" }}
                className="text-[28px] italic leading-none text-[#5f6476] md:text-[32px]"
              >
                Secure Your Seat
              </span>
            </div>
            
            <h2 className="font-serif text-5xl lg:text-7xl font-light leading-[1.1] text-[#1A1516]">
              Reserve Your <span className="text-[#8B1538]">Table</span>
            </h2>
            
            <p className="mt-8 text-base text-[#5C5452] font-light leading-relaxed max-w-md">
              We invite you to experience a culinary journey honoring Indian heritage. 
              Kindly share your details to request an audience at the palace.
            </p>

            <form className="mt-20 space-y-12" onSubmit={(e) => e.preventDefault()}>
              
              {/* Grouped Symmetrical Inputs (Group 1) */}
              <div className="grid gap-12 md:grid-cols-2">
                <div className="relative border-b border-black/10 transition-colors focus-within:border-[#8B1538]">
                  <label className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-medium block">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vikram Sharma"
                    className="w-full bg-transparent py-4 text-sm text-[#1A1516] outline-none placeholder:text-gray-300 font-light"
                  />
                </div>
                <div className="relative border-b border-black/10 transition-colors focus-within:border-[#8B1538]">
                  <label className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-medium block">Contact Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 00000 00000"
                    className="w-full bg-transparent py-4 text-sm text-[#1A1516] outline-none placeholder:text-gray-300 font-light"
                  />
                </div>
              </div>

              {/* Grouped Symmetrical Inputs (Group 2) */}
              <div className="grid gap-12 md:grid-cols-2">
                <div className="relative border-b border-black/10 transition-colors focus-within:border-[#8B1538]">
                  <label className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-medium block">Preferred Date</label>
                  <input
                    type="date"
                    required
                    className="w-full bg-transparent py-4 text-sm text-[#1A1516] outline-none"
                  />
                </div>
                <div className="relative border-b border-black/10 transition-colors focus-within:border-[#8B1538]">
                  <label className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-medium block">Arrival Hour</label>
                  <input
                    type="time"
                    required
                    className="w-full bg-transparent py-4 text-sm text-[#1A1516] outline-none"
                  />
                </div>
              </div>

              {/* Sharp, Minimalist Button */}
              <button
                type="submit"
                className="group relative w-full flex items-center justify-center gap-4 bg-[#1A1516] py-6 text-[11px] font-bold uppercase tracking-[0.35em] text-white transition-colors hover:bg-[#8B1538]"
              >
                Request Reservation
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-2 text-[#D6A64A]" />
                <span className="absolute bottom-1 left-1 w-2 h-2 border-l border-b border-[#D6A64A]/60 group-hover:border-white" />
                <span className="absolute top-1 right-1 w-2 h-2 border-r border-t border-[#D6A64A]/60 group-hover:border-white" />
              </button>
            </form>
          </div>

          {/* --- RIGHT COLUMN: GEOMETRIC PALACE WINDOW --- */}
          <div className="relative bg-[#1A1516] border border-black/5 p-4 flex flex-col justify-between">
            <div className="relative h-[550px] w-full overflow-hidden">
              <img
                src="/home_html/images/restaurant.jpg"
                alt="Heritage Ambiance"
                className="h-full w-full object-cover grayscale-[10%] hover:grayscale-0 transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1516]/90 via-transparent to-transparent" />
              
              {/* Refined Address Card - Sharp borders */}
              <div className="absolute bottom-10 left-10 right-10 bg-white p-8 border-l-[6px] border-[#D6A64A] shadow-2xl">
                  <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-[#8B1538] mb-1">Our Location</p>
                  <p className="text-[#1A1516] font-serif text-xl">Magic Hub, Kondhwa, Pune</p>
              </div>
            </div>

            {/* Geometric "Court Hours" (Stacked and Minimal) */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-white/5 pt-8 px-6 pb-6">
               <div className="flex items-center gap-5">
                  <Clock size={24} strokeWidth={1.5} className="text-[#D6A64A]" />
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-[#FAF7F2]/60 mb-1">Midday Banquet</p>
                    <p className="font-serif text-lg text-white font-medium">10:00 - 15:30</p>
                  </div>
               </div>
               <div className="flex items-center gap-5">
                  <MapPin size={24} strokeWidth={1.5} className="text-[#D6A64A]" />
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-[#FAF7F2]/60 mb-1">Evening Soirée</p>
                    <p className="font-serif text-lg text-white font-medium">20:00 - 22:30</p>
                  </div>
               </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeritageReservation;