import React from "react";
import { ArrowRight, MapPin, Calendar, Clock } from "lucide-react";

const HeritageReservation = () => {
  return (
    <section className="relative overflow-hidden bg-[#FFFBF2] py-20 lg:py-32" data-testid="reservation-section">
      {/* Background Decorative Element - Mandalas or Paisleys */}
      <div className="absolute -right-20 top-0 h-96 w-96 opacity-5 pointer-events-none">
        <svg viewBox="0 0 100 100" fill="#8B1538">
          <path d="M50 0 L60 40 L100 50 L60 60 L50 100 L40 60 L0 50 L40 40 Z" />
        </svg>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid items-center gap-16 lg:grid-cols-2">

          {/* Left Side: The Imperial Ledger (Form) */}
          <div className="relative order-2 lg:order-1">
            <div className="max-w-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-[1px] w-12 bg-[#D6A64A]"></div>
                <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#8B1538]">
                  Request an Audience
                </span>
              </div>
              
              <h2 className="text-4xl md:text-6xl font-bold text-[#1A1516] leading-tight" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                Reserve Your <span className="italic text-[#8B1538]">Table</span>
              </h2>
              
              <p className="mt-6 text-lg font-serif italic text-[#6D6163]">
                Join us for a dining experience worthy of royalty. Please provide your details below to secure your seat at the palace.
              </p>

              <form className="mt-12 space-y-8" onSubmit={(e) => e.preventDefault()}>
                <div className="grid gap-8 md:grid-cols-2">
                  <div className="group relative">
                    <label className="absolute -top-3 left-4 bg-[#FFFBF2] px-2 text-[10px] font-bold uppercase tracking-widest text-[#D6A64A]">Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Maharaja Vikramaditya"
                      className="w-full border-b-2 border-[#E9D4C0] bg-transparent py-4 px-2 text-sm text-[#2D1B1E] transition-all focus:border-[#8B1538] outline-none placeholder:text-gray-300"
                    />
                  </div>
                  <div className="group relative">
                    <label className="absolute -top-3 left-4 bg-[#FFFBF2] px-2 text-[10px] font-bold uppercase tracking-widest text-[#D6A64A]">Communication Line</label>
                    <input
                      type="tel"
                      placeholder="+91 00000 00000"
                      className="w-full border-b-2 border-[#E9D4C0] bg-transparent py-4 px-2 text-sm text-[#2D1B1E] transition-all focus:border-[#8B1538] outline-none"
                    />
                  </div>
                </div>

                <div className="grid gap-8 md:grid-cols-2">
                  <div className="group relative">
                    <label className="absolute -top-3 left-4 bg-[#FFFBF2] px-2 text-[10px] font-bold uppercase tracking-widest text-[#D6A64A]">Preferred Date</label>
                    <div className="relative">
                        <input
                            type="date"
                            className="w-full border-b-2 border-[#E9D4C0] bg-transparent py-4 px-2 text-sm text-[#2D1B1E] transition-all focus:border-[#8B1538] outline-none"
                        />
                        <Calendar size={16} className="absolute right-2 top-4 text-[#D6A64A]" />
                    </div>
                  </div>
                  <div className="group relative">
                    <label className="absolute -top-3 left-4 bg-[#FFFBF2] px-2 text-[10px] font-bold uppercase tracking-widest text-[#D6A64A]">Arrival Hour</label>
                    <div className="relative">
                        <input
                            type="time"
                            className="w-full border-b-2 border-[#E9D4C0] bg-transparent py-4 px-2 text-sm text-[#2D1B1E] transition-all focus:border-[#8B1538] outline-none"
                        />
                        <Clock size={16} className="absolute right-2 top-4 text-[#D6A64A]" />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="group relative flex w-full items-center justify-center gap-4 bg-[#8B1538] py-6 text-[12px] font-bold uppercase tracking-[0.3em] text-[#F5D38B] transition-all hover:bg-[#1A1516] border border-[#D6A64A]/30 shadow-2xl"
                >
                  Confirm Reservation
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-2" />
                  {/* Ornate corner accents for button */}
                  <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-[#F5D38B]/50" />
                  <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-[#F5D38B]/50" />
                </button>
              </form>
            </div>
          </div>

          {/* Right Side: The Palace Window (Image & Details) */}
          <div className="relative order-1 lg:order-2">
            <div className="relative">
              {/* Arched Frame for Image */}
              <div className="relative h-[550px] w-full overflow-hidden rounded-t-full border-[10px] border-white shadow-2xl">
                <img
                  src="/home_html/images/restaurant.jpg"
                  alt="Heritage Ambiance"
                  className="h-full w-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1516]/80 via-transparent to-transparent" />
                
                {/* Float Card inside image */}
                <div className="absolute bottom-8 left-8 right-8 bg-[#8B1538] p-6 text-center border border-[#D6A64A]">
                   <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#D6A64A] mb-2">Our Royal Address</p>
                   <p className="text-white font-serif text-lg italic">Magic Business Hub, Kondhwa Budruk, Pune</p>
                </div>
              </div>

              {/* Decorative Frame Overlays */}
              <div className="absolute -top-4 -left-4 w-24 h-24 border-t-2 border-l-2 border-[#D6A64A] opacity-40" />
              <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b-2 border-r-2 border-[#D6A64A] opacity-40" />
            </div>

            {/* Timings as "Court Hours" */}
            <div className="mt-12 grid grid-cols-2 gap-8 border-t border-[#D6A64A]/20 pt-8">
               <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full border border-[#D6A64A] flex items-center justify-center text-[#8B1538]">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-[#D6A64A]">Midday Banquet</p>
                    <p className="font-bold text-[#1A1516]">10:00 - 15:30</p>
                  </div>
               </div>
               <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full border border-[#D6A64A] flex items-center justify-center text-[#8B1538]">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-[#D6A64A]">Evening Soirée</p>
                    <p className="font-bold text-[#1A1516]">20:00 - 22:30</p>
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