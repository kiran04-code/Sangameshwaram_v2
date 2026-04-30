import React from "react";
import { ArrowRight, Award } from "lucide-react";

const HeritageAbout = () => {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#FFFBF2] px-6 py-20 md:px-16 lg:px-28">
      {/* --- BACKGROUND ORNAMENTATION --- */}
      {/* Large Watermark - Using a more traditional font vibe */}
      <h1 className="pointer-events-none absolute -top-10 right-[-5%] font-serif text-[150px] font-bold leading-none text-[#8d1238]/5 md:text-[250px] lg:text-[350px]">
        CREST
      </h1>
      
      {/* Traditional Pattern Overlay (Optional: Subtle Jaali or Mandala) */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/paper-fibers.png")` }} />

      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 lg:grid-cols-[1.2fr_0.8fr]">
        
        {/* LEFT CONTENT */}
        <div className="pt-6">
          <div className="mb-6 flex items-center gap-4">
            <span className="h-[2px] w-12 bg-[#D6A64A]" />
            <p className="text-sm font-bold uppercase tracking-[0.4em] text-[#8d1238]">
              THE LEGACY STORY
            </p>
          </div>

          <h2 className="font-serif text-[42px] font-bold leading-[1.1] text-[#1a1a1a] md:text-[60px] lg:text-[72px]">
            Enjoy Every{" "}
            <span className="italic text-[#8d1238] font-light">Moment</span> <br />
            <span className="text-[#D6A64A]">Authentic</span> Flavors, 
            <span className="text-[#8d1238]"> Royal Spirit</span>
          </h2>

          <div className="mt-12 flex flex-col md:flex-row gap-10">
            {/* Decorative "Ampersand" or Initial */}
            <div className="hidden md:flex items-center justify-center font-serif text-[120px] leading-none text-[#D6A64A]/20 border-r border-[#D6A64A]/30 pr-10">
              &
            </div>

            <div className="space-y-8">
              <p className="max-w-[550px] font-serif text-[20px] italic leading-relaxed text-[#333]">
                "At Hotel Crest, we don’t just serve meals; we curate sensory
                journeys that honor the rich Sangameshwar heritage while
                embracing modern luxury."
              </p>

              <div className="flex flex-col gap-8 lg:flex-row lg:items-center">
                <div className="flex items-center gap-4 text-[#8d1238]">
                    <div className="p-3 rounded-full border border-[#D6A64A]">
                        <Award size={24} />
                    </div>
                    <p className="text-[16px] font-medium text-black">
                        A legacy defined by <br /> taste and service.
                    </p>
                </div>

                {/* Heritage Style Button: Sharp edges with gold border */}
                <button className="group relative flex h-[80px] w-full max-w-[350px] items-center justify-between border-2 border-[#8d1238] bg-[#8d1238] px-8 text-white transition-all duration-300 hover:bg-transparent hover:text-[#8d1238]">
                  <div className="text-left">
                    <p className="text-[12px] font-bold tracking-widest opacity-80 uppercase">
                      Discover
                    </p>
                    <p className="text-[16px] font-serif font-bold uppercase">
                      Our Royal Legacy
                    </p>
                  </div>
                  <ArrowRight className="h-8 w-8 transition-transform duration-300 group-hover:translate-x-2" />
                  
                  {/* Decorative Corner Accents for Button */}
                  <div className="absolute -top-[6px] -left-[6px] h-3 w-3 border-t-2 border-l-2 border-[#D6A64A]" />
                  <div className="absolute -bottom-[6px] -right-[6px] h-3 w-3 border-b-2 border-r-2 border-[#D6A64A]" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT IMAGE: The "Mehrab" Arch Frame */}
        <div className="relative flex justify-center lg:justify-end">
          <div className="relative">
            {/* The Arch Frame (Mehrab) */}
            <div className="relative z-10 overflow-hidden rounded-t-full border-[12px] border-[#D6A64A] shadow-2xl">
              <img
                src="/edited-photo.png"
                alt="Hotel Crest Staff"
                className="h-[450px] w-auto object-cover transition-transform duration-700 hover:scale-105 md:h-[600px]"
              />
              {/* Image Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a]/40 to-transparent" />
            </div>

            {/* Decorative Background Shape for Image */}
            <div className="absolute -bottom-6 -right-6 -z-10 h-full w-full rounded-t-full bg-[#8d1238]/10" />
            
            {/* Traditional Stamp/Badge */}
            <div className="absolute -left-10 bottom-20 z-20 flex h-24 w-24 items-center justify-center rounded-full border-4 border-[#D6A64A] bg-[#8d1238] text-center text-white shadow-xl rotate-[-12deg]">
                <p className="font-serif text-[12px] font-bold leading-tight">
                    ESTD <br /> <span className="text-lg text-[#D6A64A]">1998</span>
                </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeritageAbout;