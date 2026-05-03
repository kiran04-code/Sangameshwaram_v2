import React from "react";
import { ArrowRight, MapPin, Clock } from "lucide-react";

const HeritageReservation = () => {
  return (
    <section className="relative overflow-hidden bg-[#FAF7F2] py-24 lg:py-32" data-testid="reservation-section">
      {/* Background Subtle Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(214,166,74,0.05),transparent_40%)]" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <div className="grid items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]">

          {/* Left Side: The Imperial Ledger (Form) */}
          <div className="max-w-xl order-2 lg:order-1">
            <div className="flex items-center gap-3 mb-5">
              <span className="h-px w-8 bg-[#8B1538]" />
              <span
                style={{ fontFamily: "Cormorant Garamond, serif" }}
                className="text-[28px] italic leading-none text-[#5f6476] md:text-[34px]"
              >
                Secure Your Seat
              </span>
            </div>
            
            <h2 className="font-serif text-5xl lg:text-6xl leading-tight text-[#1A1516]">
              Reserve Your <span className=" font-light text-[#8B1538]">Table</span>
            </h2>
            
            <p className="mt-8 text-base text-[#5C5452] font-light leading-relaxed">
              We invite you to experience a culinary journey honoring Indian heritage. 
              Please share your details below to request your audience at the palace.
            </p>

            <form className="mt-16 space-y-10" onSubmit={(e) => e.preventDefault()}>
              <div className="grid gap-10 md:grid-cols-2">
                <div className="group relative">
                  <input
                    type="text"
                    required
                    className="w-full border-b border-black/10 bg-transparent py-4 text-sm text-[#1A1516] transition-all focus:border-[#8B1538] outline-none placeholder:text-gray-400 font-light"
                    placeholder="Full Name"
                  />
                </div>
                <div className="group relative">
                  <input
                    type="tel"
                    required
                    className="w-full border-b border-black/10 bg-transparent py-4 text-sm text-[#1A1516] transition-all focus:border-[#8B1538] outline-none placeholder:text-gray-400 font-light"
                    placeholder="Contact Number"
                  />
                </div>
              </div>

              <div className="grid gap-10 md:grid-cols-2">
                <div className="group relative">
                  <label className="text-[10px] text-gray-400 uppercase tracking-widest font-medium mb-1 block">Preferred Date</label>
                  <input
                    type="date"
                    required
                    className="w-full border-b border-black/10 bg-transparent py-3 text-sm text-[#1A1516] transition-all focus:border-[#8B1538] outline-none"
                  />
                </div>
                <div className="group relative">
                  <label className="text-[10px] text-gray-400 uppercase tracking-widest font-medium mb-1 block">Arrival Hour</label>
                  <input
                    type="time"
                    required
                    className="w-full border-b border-black/10 bg-transparent py-3 text-sm text-[#721a35] transition-all focus:border-[#8B1538] outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="group w-full flex items-center justify-center gap-4 bg-[#721a35] py-6 text-[11px] font-bold uppercase tracking-[0.35em] text-white transition-all hover:bg-[#8B1538] rounded-sm"
              >
                Confirm Reservation Request
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-2" />
              </button>
            </form>
          </div>

          {/* Right Side: The Palace Window (Image & Details) */}
          <div className="relative order-1 lg:order-2">
            <div className="relative h-[600px] w-full overflow-hidden   shadow-brown-950/10">
              <img
                src="/home_html/images/restaurant.jpg"
                alt="Heritage Ambiance"
                className="h-full w-full object-cover grayscale-[10%] hover:grayscale-0 transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1516]/70 via-transparent to-transparent" />
              
              {/* Refined Address Card */}
              <div className="absolute bottom-10 left-10 right-10 bg-white p-8 rounded-sm shadow-xl border-l-4 border-[#D6A64A]">
                  <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-[#8B1538] mb-1">Our Location</p>
                  <p className="text-[#1A1516] font-serif text-xl">Magic Business Hub, Kondhwa, Pune</p>
              </div>
            </div>

            {/* Re-designed elegant "Court Hours" */}
            <div className="mt-12 grid grid-cols-2 gap-8 border-t border-black/5 pt-10">
               <div className="flex items-center gap-5">
                  <Clock size={24} className="text-[#D6A64A]" strokeWidth={1} />
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-[#8B1538]/70">Luncheon</p>
                    <p className="font-serif text-lg text-[#1A1516]">10:00 - 15:30</p>
                  </div>
               </div>
               <div className="flex items-center gap-5">
                  <MapPin size={24} className="text-[#D6A64A]" strokeWidth={1} />
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-[#8B1538]/70">Dinner Soirée</p>
                    <p className="font-serif text-lg text-[#1A1516]">20:00 - 22:30</p>
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
